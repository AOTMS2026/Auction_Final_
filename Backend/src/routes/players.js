const { Router } = require("express");
const mongoose = require("mongoose");
const Player = require("../models/Player");
const Auction = require("../models/Auction");
const Team = require("../models/Team");
const { requireAuth, optionalAuth } = require("../middleware/requireAuth");
const { uploadBase64Image, deleteImage } = require("../lib/cloudinary");

const router = Router();

function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function toPublicPlayer(doc) {
  return {
    id: doc._id.toString(),
    auctionId: doc.auctionId.toString(),
    teamId: doc.teamId ? doc.teamId.toString() : null,
    name: doc.name,
    phone: doc.phone,
    age: doc.age,
    category: doc.category,
    baseValue: doc.baseValue,
    soldPrice: doc.soldPrice,
    jerseySize: doc.jerseySize,
    jerseyName: doc.jerseyName,
    trouserSize: doc.trouserSize,
    customData: doc.customData,
    photo: doc.photo,
    gender: doc.gender,
    city: doc.city,
    playerLevel: doc.playerLevel,
    paymentMode: doc.paymentMode,
    utrNumber: doc.utrNumber,
    paymentImage: doc.paymentImage,
    sportFields: doc.sportFields,
    auctionRoundStatus: doc.auctionRoundStatus,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Get all players for an auction
router.get(
  "/auctions/:id/players",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const startReqTime = performance.now();
    
    // 1. Connection Health Check
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database connection unavailable. Please try again." });
    }

    const auctionId = req.params.id;
    if (!auctionId || auctionId.length !== 24) {
      return res.status(400).json({ error: "Invalid auction ID" });
    }

    const auction = await Auction.findById(auctionId).catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    // Check visibility
    const isOwn = req.userId && auction.createdBy.toString() === req.userId;
    if (auction.visibility === "private" && !isOwn) {
      return res.status(404).json({ error: "Auction not found" });
    }

    const queryStartTime = performance.now();
    let players = [];
    try {
      players = await Player.find({ auctionId })
        .select("-paymentImage -sportFields.originalPhoto")
        .sort({ createdAt: -1 })
        .allowDiskUse(true)
        .lean();
    } catch (dbError) {
      console.error("[players-api] DB Error:", dbError);
      return res.status(500).json({ error: "Database error during query: " + dbError.message });
    }
    const queryEndTime = performance.now();

    const response = { players: players.map(toPublicPlayer) };
    
    const endReqTime = performance.now();
    console.log(`[players-api] GET /auctions/${auctionId}/players | DB Query: ${(queryEndTime - queryStartTime).toFixed(2)}ms | Total: ${(endReqTime - startReqTime).toFixed(2)}ms | Count: ${players.length}`);

    res.json(response);
  })
);

// Create player
router.post(
  "/players",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { auctionId, name, phone, ...rest } = req.body;

    if (!auctionId || !name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const auction = await Auction.findById(auctionId).catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    if (auction.createdBy.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: "You don't have permission to modify this auction" });
    }

    if (rest.sportFields && typeof rest.sportFields === "object") {
      delete rest.sportFields.originalPhoto;
    }

    const trimmedPhone = phone.trim();
    const phoneDigits = phone.replace(/\D/g, "").slice(-10);
    const phoneFilter = phoneDigits && phoneDigits !== trimmedPhone
      ? { $in: [trimmedPhone, phoneDigits] }
      : trimmedPhone;

    const existingPlayer = await Player.findOne({
      auctionId: new mongoose.Types.ObjectId(auctionId),
      phone: phoneFilter,
    }).lean();

    if (existingPlayer) {
      return res.status(400).json({
        error: "Duplicate phone number not allowed! This phone number is already registered for this auction.",
      });
    }

    const uploadedPhoto = await uploadBase64Image(rest.photo);
    const uploadedPayment = await uploadBase64Image(rest.paymentImage);

    const player = await Player.create({
      auctionId,
      name: name.trim(),
      phone: trimmedPhone,
      ...rest,
      photo: uploadedPhoto,
      paymentImage: uploadedPayment,
    });

    const publicPlayer = toPublicPlayer(player);
    const io = req.app.get("io");
    if (io) io.to(`auction:${auctionId}`).emit("playerUpdated", publicPlayer);

    res.status(201).json({ player: publicPlayer });
  })
);

// Publicly register player
router.post(
  "/players/register",
  asyncHandler(async (req, res) => {
    const { auctionId, name, phone, ...rest } = req.body;

    if (!auctionId || !name || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const auction = await Auction.findById(auctionId).catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    if (rest.sportFields && typeof rest.sportFields === "object") {
      delete rest.sportFields.originalPhoto;
    }

    const trimmedPhone = phone.trim();
    const phoneDigits = phone.replace(/\D/g, "").slice(-10);
    const phoneFilter = phoneDigits && phoneDigits !== trimmedPhone
      ? { $in: [trimmedPhone, phoneDigits] }
      : trimmedPhone;

    const existingPlayer = await Player.findOne({
      auctionId: new mongoose.Types.ObjectId(auctionId),
      phone: phoneFilter,
    }).lean();

    if (existingPlayer) {
      return res.status(400).json({
        error: "Duplicate phone number not allowed! This phone number is already registered for this auction.",
      });
    }

    const uploadedPhoto = await uploadBase64Image(rest.photo);
    const uploadedPayment = await uploadBase64Image(rest.paymentImage);

    const player = await Player.create({
      auctionId,
      name: name.trim(),
      phone: trimmedPhone,
      ...rest,
      photo: uploadedPhoto,
      paymentImage: uploadedPayment,
    });

    const publicPlayer = toPublicPlayer(player);
    const io = req.app.get("io");
    if (io) io.to(`auction:${auctionId}`).emit("playerUpdated", publicPlayer);

    res.status(201).json({ player: publicPlayer });
  })
);

// Update player
router.patch(
  "/players/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rawId = req.params.id ? req.params.id.trim() : "";
    let player = null;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      player = await Player.findById(rawId).catch(() => null);
    }
    if (!player) {
      player = await Player.findOne({ _id: rawId }).catch(() => null);
    }
    if (!player) return res.status(404).json({ error: "Player not found" });

    const auction = await Auction.findById(player.auctionId).catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    const isOwn = req.userId && auction.createdBy.toString() === req.userId;
    if (!isOwn && !req.isAdmin) {
      const requestedUpdates = Object.keys(req.body);
      const isOnlyCategory = requestedUpdates.every(key => key === "category");
      if (!isOnlyCategory) {
        return res.status(403).json({ error: "You don't have permission to modify these details" });
      }
    }

    if (req.body.phone !== undefined && req.body.phone.trim() !== player.phone) {
      const trimmedPhone = req.body.phone.trim();
      const phoneDigits = req.body.phone.replace(/\D/g, "").slice(-10);
      const phoneFilter = phoneDigits && phoneDigits !== trimmedPhone
        ? { $in: [trimmedPhone, phoneDigits] }
        : trimmedPhone;

      const existingPlayer = await Player.findOne({
        _id: { $ne: player._id },
        auctionId: player.auctionId,
        phone: phoneFilter,
      }).lean();

      if (existingPlayer) {
        return res.status(400).json({
          error: "Duplicate phone number not allowed! This phone number is already registered for this auction.",
        });
      }
    }

    const updatableFields = [
      "name", "phone", "age", "category", "baseValue",
      "soldPrice", "jerseySize", "jerseyName", "trouserSize",
      "customData", "photo", "gender", "city", "playerLevel",
      "paymentMode", "utrNumber", "paymentImage", "sportFields", "auctionRoundStatus"
    ];

    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        if (field === "photo" || field === "paymentImage") {
          const newUrl = await uploadBase64Image(req.body[field]);
          if (newUrl && newUrl !== player[field] && player[field]) {
            deleteImage(player[field]).catch(console.error);
          }
          player[field] = newUrl;
        } else if (field === "sportFields") {
          const sf = typeof req.body[field] === "object" && req.body[field] ? { ...req.body[field] } : {};
          delete sf.originalPhoto;
          player[field] = sf;
        } else {
          player[field] = req.body[field];
        }
      }
    }

    // Perform validations before modifying the player object if we are assigning a team or if soldPrice/auctionRoundStatus is changing.
    const targetTeamId = req.body.teamId !== undefined ? req.body.teamId : player.teamId;
    const newStatus = req.body.auctionRoundStatus !== undefined ? req.body.auctionRoundStatus : player.auctionRoundStatus;

    if (newStatus === "unsold" || newStatus === "pending") {
      player.teamId = null;
      player.soldPrice = null;
      player.auctionRoundStatus = newStatus;
    } else if (targetTeamId) {
      const currentTeamId = player.teamId ? player.teamId.toString() : null;
      const nextTeamId = targetTeamId ? targetTeamId.toString() : null;

      // 1. Enforce roster count check if team changes
      if (nextTeamId && nextTeamId !== currentTeamId) {
        const rosterCount = await Player.countDocuments({
          teamId: nextTeamId,
          _id: { $ne: player._id },
          auctionRoundStatus: "sold",
        });
        if (rosterCount >= auction.playersPerTeam) {
          return res
            .status(400)
            .json({ error: `This team already has the maximum ${auction.playersPerTeam} players.` });
        }
      }

      // 2. Validate sale budget constraints if a price is specified or updated
      const newPrice = req.body.soldPrice !== undefined ? req.body.soldPrice : player.soldPrice;

      if (newStatus === "sold" && newPrice !== null && newPrice !== undefined) {
        if (newPrice < auction.minimumBid) {
          return res
            .status(400)
            .json({ error: `Sale price (🪙 ${newPrice.toLocaleString()}) cannot be below the configured minimum bid (🪙 ${auction.minimumBid.toLocaleString()}).` });
        }

        const otherPlayers = await Player.find({
          teamId: targetTeamId,
          _id: { $ne: player._id },
          auctionRoundStatus: "sold",
        }).select("soldPrice");
        let usedPoints = 0;
        for (const op of otherPlayers) {
          if (op.soldPrice) usedPoints += op.soldPrice;
        }

        const remainingPurse = auction.pointsPerTeam - usedPoints;
        const rosterCount = otherPlayers.length;
        const playersRemaining = auction.playersPerTeam - rosterCount;

        const configuredMaximumBid = auction.maxBid ?? 30000;
        const reserveForOtherPlayers = playersRemaining > 1 ? (playersRemaining - 1) * auction.minimumBid : 0;
        const affordableBid = remainingPurse - reserveForOtherPlayers;
        const actualMaximumBid = Math.max(0, Math.min(configuredMaximumBid, affordableBid));

        if (newPrice > remainingPurse) {
          return res
            .status(400)
            .json({ error: `Insufficient funds: Team only has 🪙 ${remainingPurse.toLocaleString()} remaining, but bid is 🪙 ${newPrice.toLocaleString()}.` });
        }

        if (newPrice > actualMaximumBid) {
          return res
            .status(400)
            .json({ error: `Bid of 🪙 ${newPrice.toLocaleString()} exceeds the team's maximum allowed bid of 🪙 ${actualMaximumBid.toLocaleString()} (reserving 🪙 ${reserveForOtherPlayers.toLocaleString()} for ${playersRemaining - 1} remaining spots).` });
        }
      }
    }

    if (req.body.teamId !== undefined && newStatus !== "unsold" && newStatus !== "pending") {
      player.teamId = req.body.teamId === null ? null : req.body.teamId;
    }

    await player.save();

    const publicPlayer = toPublicPlayer(player);
    const io = req.app.get("io");
    if (io) io.to(`auction:${player.auctionId}`).emit("playerUpdated", publicPlayer);

    res.json({ player: publicPlayer });
  })
);

// Delete player
router.delete(
  "/players/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const player = await Player.findById(req.params.id).catch(() => null);
    if (!player) return res.status(404).json({ error: "Player not found" });

    const auction = await Auction.findById(player.auctionId).catch(() => null);
    if (!auction || (auction.createdBy.toString() !== req.userId && !req.isAdmin)) {
      return res.status(403).json({ error: "You don't have permission to delete this player" });
    }

    const photoToDelete = player.photo;
    const paymentToDelete = player.paymentImage;
    
    await player.deleteOne();

    if (photoToDelete) deleteImage(photoToDelete).catch(console.error);
    if (paymentToDelete) deleteImage(paymentToDelete).catch(console.error);

    const io = req.app.get("io");
    if (io) io.to(`auction:${player.auctionId}`).emit("playerUpdated", { id: player._id });

    res.status(204).end();
  })
);

// Get player profile across all auctions by phone
router.get(
  "/players/profile/:phone",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { phone } = req.params;
    
    // Find all player instances with this phone number
    const players = await Player.find({ phone })
      .sort({ createdAt: -1 })
      .lean();
    
    if (players.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Get unique auctions and teams to populate context
    const auctionIds = [...new Set(players.map(p => p.auctionId.toString()))];
    const teamIds = [...new Set(players.filter(p => p.teamId).map(p => p.teamId.toString()))];

    const [auctions, teams] = await Promise.all([
      Auction.find({ _id: { $in: auctionIds } }),
      Team.find({ _id: { $in: teamIds } })
    ]);

    const auctionMap = new Map(auctions.map(a => [a._id.toString(), a]));
    const teamMap = new Map(teams.map(t => [t._id.toString(), t]));

    // Use the most recently updated player record as the base profile
    const basePlayer = players.reduce((latest, current) => 
      new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest
    , players[0]);

    // Compute aggregates
    const joinedAuctions = auctionIds.length;
    const joinedTeams = teamIds.length;
    
    let totalSoldPrice = 0;
    let soldCount = 0;
    
    // Build the auctions history
    const auctionHistory = players.map(p => {
      const auction = auctionMap.get(p.auctionId.toString());
      const team = p.teamId ? teamMap.get(p.teamId.toString()) : null;
      
      if (p.soldPrice) {
        totalSoldPrice += p.soldPrice;
        soldCount++;
      }
      
      return {
        id: p._id.toString(),
        auctionId: auction?._id.toString() || p.auctionId.toString(),
        auctionName: auction?.name || "Unknown Auction",
        auctionCover: auction?.coverImage || null,
        auctionDate: auction?.startsAt || p.createdAt,
        playersPerTeam: auction?.playersPerTeam || 0,
        pointsPerTeam: auction?.pointsPerTeam || 0,
        priceTier: "Free", // Assuming Free for now
        teamId: team?._id.toString() || null,
        teamName: team?.name || null,
        teamLogo: team?.logo || null,
        soldPrice: p.soldPrice,
        baseValue: p.baseValue
      };
    });
    
    const overallASP = soldCount > 0 ? Math.round(totalSoldPrice / soldCount) : 0;

    res.json({
      profile: {
        phone: basePlayer.phone,
        name: basePlayer.name,
        photo: basePlayer.photo,
        category: basePlayer.category,
        role: basePlayer.sportFields?.role || "Player",
      },
      stats: {
        joinedAuctions,
        joinedTeams,
        overallASP,
      },
      history: auctionHistory
    });
  })
);

// Get single player details (including payment screenshot)
router.get(
  "/players/:id",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const player = await Player.findById(req.params.id).catch(() => null);
    if (!player) return res.status(404).json({ error: "Player not found" });

    const auction = await Auction.findById(player.auctionId).catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });

    const isOwn = req.userId && auction.createdBy.toString() === req.userId;
    if (auction.visibility === "private" && !isOwn && !req.isAdmin) {
      return res.status(404).json({ error: "Auction not found" });
    }

    res.json({ player: toPublicPlayer(player) });
  })
);

module.exports = router;
