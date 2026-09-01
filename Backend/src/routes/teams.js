const { Router } = require("express");
const mongoose = require("mongoose");
const Team = require("../models/Team");
const Auction = require("../models/Auction");
const Player = require("../models/Player");
const { requireAuth, optionalAuth } = require("../middleware/requireAuth");
const { uploadBase64Image, deleteImage } = require("../lib/cloudinary");

const router = Router();

// In-memory cache for ultra-fast team list retrieval (<1ms)
const teamsCache = new Map();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

function getCachedTeams(auctionId) {
  const entry = teamsCache.get(auctionId);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    teamsCache.delete(auctionId);
    return null;
  }
  return entry.data;
}

function setCachedTeams(auctionId, data) {
  if (teamsCache.size > 200) {
    const oldestKey = teamsCache.keys().next().value;
    teamsCache.delete(oldestKey);
  }
  teamsCache.set(auctionId, { data, timestamp: Date.now() });
}

function invalidateTeamsCache(auctionId) {
  if (auctionId) {
    teamsCache.delete(auctionId.toString());
  }
}

function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function toPublicTeam(doc) {
  return {
    id: (doc._id || doc.id).toString(),
    auctionId: doc.auctionId.toString(),
    name: doc.name,
    shortName: doc.shortName,
    logo: doc.logo,
    ownerName: doc.ownerName || "",
    ownerPhone: doc.ownerPhone || "",
    colorTheme: doc.colorTheme || "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Get all teams for a specific auction (Optimized with parallel query, projection, lean, & in-memory caching)
router.get(
  "/auctions/:id/teams",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const startReqTime = performance.now();
    const auctionId = req.params.id;

    if (!auctionId || !mongoose.Types.ObjectId.isValid(auctionId)) {
      return res.status(400).json({ error: "Invalid auction ID" });
    }

    // 1. Check in-memory cache for sub-millisecond response
    const cachedTeams = getCachedTeams(auctionId);
    if (cachedTeams) {
      res.set("X-Cache", "HIT");
      res.set("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
      return res.json({ teams: cachedTeams });
    }

    // 2. Fetch Auction visibility check and Teams list concurrently via Promise.all
    const [auction, teams] = await Promise.all([
      Auction.findById(auctionId).select("visibility createdBy").lean().catch(() => null),
      Team.find({ auctionId: new mongoose.Types.ObjectId(auctionId) })
        .sort({ createdAt: 1 })
        .lean()
        .catch(() => []),
    ]);

    if (!auction) return res.status(404).json({ error: "Auction not found" });

    // Check visibility
    const isOwn = req.userId && auction.createdBy && auction.createdBy.toString() === req.userId;
    if (auction.visibility === "private" && !isOwn) {
      return res.status(404).json({ error: "Auction not found" });
    }

    const publicTeams = teams.map(toPublicTeam);

    // Save to cache
    setCachedTeams(auctionId, publicTeams);

    const elapsed = performance.now() - startReqTime;
    console.log(`[teams-api] GET /auctions/${auctionId}/teams | Total: ${elapsed.toFixed(2)}ms | Count: ${publicTeams.length}`);

    res.set("X-Cache", "MISS");
    res.set("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
    res.json({ teams: publicTeams });
  })
);

// Create a new team
router.post(
  "/teams",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { auctionId, name, shortName, logo, ownerName, ownerPhone, colorTheme } = req.body;

    if (!auctionId || !name || !shortName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const auction = await Auction.findById(auctionId).select("createdBy").lean().catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    if (auction.createdBy.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: "You don't have permission to modify this auction" });
    }

    const uploadedLogo = await uploadBase64Image(logo);

    const team = await Team.create({
      auctionId,
      name: name.trim(),
      shortName: shortName.trim(),
      logo: uploadedLogo || null,
      ownerName: ownerName ? ownerName.trim() : "",
      ownerPhone: ownerPhone ? ownerPhone.trim() : "",
      colorTheme: colorTheme ? colorTheme.trim() : "",
    });

    invalidateTeamsCache(auctionId);

    const publicTeam = toPublicTeam(team);
    const io = req.app.get("io");
    if (io) io.to(`auction:${auctionId}`).emit("teamUpdated", publicTeam);

    res.status(201).json({ team: publicTeam });
  })
);

// Publicly register team
router.post(
  "/teams/register",
  asyncHandler(async (req, res) => {
    const { auctionId, name, shortName, ...rest } = req.body;

    if (!auctionId || !name || !shortName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const auction = await Auction.findById(auctionId).select("_id").lean().catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    let uploadedLogo = null;
    if (rest.logo) {
      uploadedLogo = await uploadBase64Image(rest.logo);
    }

    const team = await Team.create({
      auctionId,
      name: name.trim(),
      shortName: shortName.trim(),
      logo: uploadedLogo,
      ownerName: rest.ownerName ? rest.ownerName.trim() : "",
      ownerPhone: rest.ownerPhone ? rest.ownerPhone.trim() : "",
      colorTheme: rest.colorTheme ? rest.colorTheme.trim() : "",
    });

    invalidateTeamsCache(auctionId);

    const publicTeam = toPublicTeam(team);
    const io = req.app.get("io");
    if (io) io.to(`auction:${auctionId}`).emit("teamUpdated", publicTeam);

    res.status(201).json({ team: publicTeam });
  })
);

// Get single team with computed stats
router.get(
  "/teams/:id",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const teamId = req.params.id;
    if (!teamId || !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: "Invalid team ID" });
    }

    const team = await Team.findById(teamId).lean().catch(() => null);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const [auction, players] = await Promise.all([
      Auction.findById(team.auctionId)
        .select("visibility createdBy pointsPerTeam playersPerTeam maxBid minimumBid")
        .lean()
        .catch(() => null),
      Player.find({ teamId: team._id, auctionId: team.auctionId })
        .select("soldPrice")
        .sort({ updatedAt: -1 })
        .lean()
        .catch(() => []),
    ]);

    if (!auction) return res.status(404).json({ error: "Auction not found" });

    const isOwn = req.userId && auction.createdBy && auction.createdBy.toString() === req.userId;
    if (auction.visibility === "private" && !isOwn) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Compute stats
    let usedPoints = 0;
    for (const p of players) {
      if (p.soldPrice) usedPoints += p.soldPrice;
    }

    const totalPoints = auction.pointsPerTeam;
    const availablePoints = totalPoints - usedPoints;
    const totalPlayers = players.length;
    const reservedPlayers = auction.playersPerTeam - totalPlayers;
    const maxBidPoints =
      reservedPlayers > 0
        ? Math.max(
            0,
            Math.min(auction.maxBid ?? 30000, availablePoints - (reservedPlayers - 1) * auction.minimumBid)
          )
        : 0;

    res.json({
      team: toPublicTeam(team),
      stats: {
        totalPoints,
        usedPoints,
        availablePoints,
        maxBidPoints,
        totalPlayers,
        reservedPlayers: reservedPlayers > 0 ? reservedPlayers : 0,
      },
    });
  })
);

// Update a team
router.patch(
  "/teams/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const teamId = req.params.id;
    if (!teamId || !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: "Invalid team ID" });
    }

    const team = await Team.findById(teamId).catch(() => null);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const auction = await Auction.findById(team.auctionId).select("createdBy").lean().catch(() => null);
    if (!auction || (auction.createdBy.toString() !== req.userId && !req.isAdmin)) {
      return res.status(403).json({ error: "You don't have permission to modify this team" });
    }

    if (req.body.name !== undefined) team.name = req.body.name.trim();
    if (req.body.shortName !== undefined) team.shortName = req.body.shortName.trim();
    if (req.body.logo !== undefined) {
      const newLogo = await uploadBase64Image(req.body.logo);
      if (newLogo && newLogo !== team.logo && team.logo) {
        deleteImage(team.logo).catch(console.error);
      }
      team.logo = newLogo;
    }
    if (req.body.ownerName !== undefined) team.ownerName = req.body.ownerName.trim();
    if (req.body.ownerPhone !== undefined) team.ownerPhone = req.body.ownerPhone.trim();
    if (req.body.colorTheme !== undefined) team.colorTheme = req.body.colorTheme.trim();

    await team.save();

    invalidateTeamsCache(team.auctionId);

    const publicTeam = toPublicTeam(team);
    const io = req.app.get("io");
    if (io) io.to(`auction:${team.auctionId}`).emit("teamUpdated", publicTeam);

    res.json({ team: publicTeam });
  })
);

// Delete a team
router.delete(
  "/teams/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const teamId = req.params.id;
    if (!teamId || !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ error: "Invalid team ID" });
    }

    const team = await Team.findById(teamId).catch(() => null);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const auction = await Auction.findById(team.auctionId).select("createdBy").lean().catch(() => null);
    if (!auction || (auction.createdBy.toString() !== req.userId && !req.isAdmin)) {
      return res.status(403).json({ error: "You don't have permission to delete this team" });
    }

    const auctionId = team.auctionId;
    const logoToDelete = team.logo;
    await team.deleteOne();
    if (logoToDelete) deleteImage(logoToDelete).catch(console.error);

    invalidateTeamsCache(auctionId);

    // Revert players assigned to this team
    await Player.updateMany({ teamId: team._id }, { $set: { teamId: null, soldPrice: null } });

    const io = req.app.get("io");
    if (io) {
      io.to(`auction:${auctionId}`).emit("teamUpdated", { id: team._id });
      io.to(`auction:${auctionId}`).emit("playerUpdated", { bulk: true });
    }

    res.status(204).end();
  })
);

module.exports = router;
