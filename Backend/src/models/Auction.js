const mongoose = require("mongoose");

const SPORT_TYPES = ["cricket", "volleyball", "football", "kabaddi", "hockey"];
const VISIBILITIES = ["public", "semi-private", "private"];
const STATUSES = ["draft", "live"];

const auctionSchema = new mongoose.Schema(
  {
    sportType: {
      type: String,
      enum: SPORT_TYPES,
      default: "cricket",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    coverImage: {
      type: String,
    },
    startsAt: {
      type: Date,
      required: true,
    },
    playersPerTeam: {
      type: Number,
      required: true,
      min: 1,
    },
    pointsPerTeam: {
      type: Number,
      required: true,
      min: 1,
    },
    minimumBid: {
      type: Number,
      required: true,
      min: 0,
    },
    bidIncrement: {
      type: Number,
      default: 100,
      min: 1,
    },
    visibility: {
      type: String,
      enum: VISIBILITIES,
      default: "public",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Set to "live" exactly once, when the organizer confirms Live Mode in
    // the auctioneer console. Trial Mode runs entirely client-side and never
    // touches this field — that's what makes "live" a one-way commitment.
    status: {
      type: String,
      enum: STATUSES,
      default: "draft",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Auction", auctionSchema);
module.exports.SPORT_TYPES = SPORT_TYPES;
module.exports.VISIBILITIES = VISIBILITIES;
module.exports.STATUSES = STATUSES;
