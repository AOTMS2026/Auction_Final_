const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
      index: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      default: "",
    },
    baseValue: {
      type: Number,
      default: 0,
    },
    soldPrice: {
      type: Number,
      default: null,
    },
    jerseySize: {
      type: String,
      default: "",
    },
    jerseyName: {
      type: String,
      default: "",
    },
    trouserSize: {
      type: String,
      default: "",
    },
    customData: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    playerLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Professional", ""],
      default: "",
    },
    paymentMode: {
      type: String,
      default: "",
    },
    utrNumber: {
      type: String,
      default: "",
    },
    paymentImage: {
      type: String,
      default: null,
    },
    sportFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Tracks auction progress (distinct from teamId/soldPrice, which record
    // *who* bought them) so "unsold" is representable: a player who was up
    // for bidding and passed, without being assigned to a team. Only ever
    // written to in Live Mode — Trial Mode runs entirely client-side.
    auctionRoundStatus: {
      type: String,
      enum: ["pending", "sold", "unsold"],
      default: "pending",
    },
  },
  { timestamps: true }
);

playerSchema.index({ auctionId: 1, createdAt: -1 });
playerSchema.index({ auctionId: 1, teamId: 1, auctionRoundStatus: 1 });
playerSchema.index({ auctionId: 1, auctionRoundStatus: 1 });
playerSchema.index({ auctionId: 1, category: 1 });
playerSchema.index({ phone: 1, createdAt: -1 });

playerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("Player", playerSchema);
