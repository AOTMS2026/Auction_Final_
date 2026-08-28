const { Router } = require("express");
const Team = require("../models/Team");
const Auction = require("../models/Auction");
const { requireAuth, optionalAuth } = require("../middleware/requireAuth");
const { uploadBase64Image, deleteImage } = require("../lib/cloudinary");

const router = Router();

function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function toPublicTeam(doc) {
  return {
    id: doc._id.toString(),
    auctionId: doc.auctionId.toString(),
    name: doc.name,
    shortName: doc.shortName,
    logo: doc.logo,
    ownerName: doc.ownerName,
    ownerPhone: doc.ownerPhone,
    colorTheme: doc.colorTheme,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Get all teams for a specific auction
router.get(
  "/auctions/:id/teams",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id).catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    // Check visibility
    const isOwn = req.userId && auction.createdBy.toString() === req.userId;
    if (auction.visibility === "private" && !isOwn) {
      return res.status(404).json({ error: "Auction not found" });
    }

    const teams = await Team.find({ auctionId: req.params.id }).sort({ createdAt: 1 });
    res.json({ teams: teams.map(toPublicTeam) });
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

    const auction = await Auction.findById(auctionId).catch(() => null);
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

    const auction = await Auction.findById(auctionId).catch(() => null);
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
    const team = await Team.findById(req.params.id).catch(() => null);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const auction = await Auction.findById(team.auctionId).catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    const isOwn = req.userId && auction.createdBy.toString() === req.userId;
    if (auction.visibility === "private" && !isOwn) {
      return res.status(404).json({ error: "Team not found" });
    }

    const Player = require("../models/Player");
    const players = await Player.find({ teamId: team._id, auctionId: auction._id }).sort({ updatedAt: -1 });
    
    // Compute stats
    let usedPoints = 0;
    for (const p of players) {
      if (p.soldPrice) usedPoints += p.soldPrice;
    }
    
    const totalPoints = auction.pointsPerTeam;
    const availablePoints = totalPoints - usedPoints;
    const totalPlayers = players.length;
    const reservedPlayers = auction.playersPerTeam - totalPlayers;
    const maxBidPoints = reservedPlayers > 0 
      ? availablePoints - ((reservedPlayers - 1) * auction.minimumBid)
      : 0;

    res.json({
      team: toPublicTeam(team),
      stats: {
        totalPoints,
        usedPoints,
        availablePoints,
        maxBidPoints: maxBidPoints > 0 ? maxBidPoints : 0,
        totalPlayers,
        reservedPlayers: reservedPlayers > 0 ? reservedPlayers : 0,
      }
    });
  })
);

// Update a team
router.patch(
  "/teams/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.id).catch(() => null);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const auction = await Auction.findById(team.auctionId).catch(() => null);
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
    const team = await Team.findById(req.params.id).catch(() => null);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const auction = await Auction.findById(team.auctionId).catch(() => null);
    if (!auction || (auction.createdBy.toString() !== req.userId && !req.isAdmin)) {
      return res.status(403).json({ error: "You don't have permission to delete this team" });
    }

    const logoToDelete = team.logo;
    await team.deleteOne();
    if (logoToDelete) deleteImage(logoToDelete).catch(console.error);

    // Revert players assigned to this team
    const Player = require("../models/Player");
    await Player.updateMany({ teamId: team._id }, { $set: { teamId: null, soldPrice: null } });

    const io = req.app.get("io");
    if (io) {
      io.to(`auction:${team.auctionId}`).emit("teamUpdated", { id: team._id });
      io.to(`auction:${team.auctionId}`).emit("playerUpdated", { bulk: true });
    }

    res.status(204).end();
  })
);

module.exports = router;
