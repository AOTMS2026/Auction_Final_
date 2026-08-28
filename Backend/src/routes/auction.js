const { Router } = require("express");

const Auction = require("../models/Auction");
const { STATUSES: AUCTION_STATUSES } = Auction;
const User = require("../models/User");
const { requireAuth, optionalAuth } = require("../middleware/requireAuth");
const { validateAuctionInput } = require("../lib/validateAuction");
const { uploadBase64Image, deleteImage } = require("../lib/cloudinary");

const router = Router();

function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function toPublicAuction(doc) {
  return {
    id: doc._id.toString(),
    sportType: doc.sportType,
    name: doc.name,
    coverImage: doc.coverImage ?? null,
    startsAt: doc.startsAt,
    playersPerTeam: doc.playersPerTeam,
    pointsPerTeam: doc.pointsPerTeam,
    minimumBid: doc.minimumBid,
    bidIncrement: doc.bidIncrement,
    visibility: doc.visibility,
    status: doc.status,
    createdBy: doc.createdBy.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function isOwnAuction(auction, userId) {
  return userId && auction.createdBy.toString() === userId;
}

function visibleTo(auction, userId) {
  return auction.visibility === "public" || isOwnAuction(auction, userId);
}

// Registered before "/:id" so "bookmarked" isn't matched as an id param.
router.get(
  "/bookmarked",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).populate("bookmarkedAuctionIds");
    const auctions = (user?.bookmarkedAuctionIds ?? []).map(toPublicAuction);
    res.json({ auctions });
  }),
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { errors } = validateAuctionInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }

    const uploadedCoverImage = await uploadBase64Image(req.body.coverImage);
    const auction = await Auction.create({
      sportType: req.body.sportType,
      name: req.body.name.trim(),
      coverImage: uploadedCoverImage || undefined,
      startsAt: new Date(req.body.startsAt),
      playersPerTeam: req.body.playersPerTeam,
      pointsPerTeam: req.body.pointsPerTeam,
      minimumBid: req.body.minimumBid,
      bidIncrement: req.body.bidIncrement,
      visibility: req.body.visibility,
      createdBy: req.userId,
    });

    res.status(201).json({ auction: toPublicAuction(auction) });
  }),
);

router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const query = {};

    if (req.query.mine === "true") {
      if (!req.userId) return res.status(401).json({ error: "Sign in required for mine=true" });
      query.createdBy = req.userId;
    } else {
      query.$or = req.userId ? [{ visibility: "public" }, { createdBy: req.userId }] : [{ visibility: "public" }];
    }

    if (typeof req.query.sportType === "string") query.sportType = req.query.sportType;
    if (typeof req.query.visibility === "string") query.visibility = req.query.visibility;

    const auctions = await Auction.find(query).sort({ startsAt: 1 }).lean();
    res.json({ auctions: auctions.map(toPublicAuction) });
  }),
);

router.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id).catch(() => null);
    if (!auction || !visibleTo(auction, req.userId)) {
      return res.status(404).json({ error: "Auction not found" });
    }
    res.json({ auction: toPublicAuction(auction) });
  }),
);

router.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id).catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });
    if (!isOwnAuction(auction, req.userId)) {
      return res.status(403).json({ error: "You don't have permission to edit this auction" });
    }

    const { errors } = validateAuctionInput(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }
    if (
      Object.prototype.hasOwnProperty.call(req.body, "status") &&
      !AUCTION_STATUSES.includes(req.body.status)
    ) {
      return res.status(400).json({ error: `status must be one of: ${AUCTION_STATUSES.join(", ")}` });
    }

    const fields = ["sportType", "name", "startsAt", "playersPerTeam", "pointsPerTeam", "minimumBid", "bidIncrement", "visibility", "status"];
    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        auction[field] = field === "startsAt" ? new Date(req.body[field]) : req.body[field];
      }
    }
    if (req.body.coverImage !== undefined) {
      const newCover = await uploadBase64Image(req.body.coverImage);
      if (newCover && newCover !== auction.coverImage && auction.coverImage) {
        deleteImage(auction.coverImage).catch(console.error);
      }
      auction.coverImage = newCover;
    }
    if (typeof auction.name === "string") auction.name = auction.name.trim();

    await auction.save();

    const publicAuction = toPublicAuction(auction);
    const io = req.app.get("io");
    if (io) io.to(`auction:${auction._id}`).emit("auctionUpdated", publicAuction);

    res.json({ auction: publicAuction });
  }),
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id).catch(() => null);
    if (!auction) return res.status(404).json({ error: "Auction not found" });
    if (!isOwnAuction(auction, req.userId)) {
      return res.status(403).json({ error: "You don't have permission to delete this auction" });
    }

    const coverToDelete = auction.coverImage;
    await auction.deleteOne();
    if (coverToDelete) deleteImage(coverToDelete).catch(console.error);

    res.status(204).end();
  }),
);

router.post(
  "/:id/bookmark",
  requireAuth,
  asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id).catch(() => null);
    if (!auction || !visibleTo(auction, req.userId)) {
      return res.status(404).json({ error: "Auction not found" });
    }
    await User.findByIdAndUpdate(req.userId, { $addToSet: { bookmarkedAuctionIds: auction._id } });
    res.status(204).end();
  }),
);

router.delete(
  "/:id/bookmark",
  requireAuth,
  asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.userId, { $pull: { bookmarkedAuctionIds: req.params.id } });
    res.status(204).end();
  }),
);

module.exports = router;
