const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    ownerName: {
      type: String,
      trim: true,
      default: "",
    },
    ownerPhone: {
      type: String,
      trim: true,
      default: "",
    },
    colorTheme: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

teamSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("Team", teamSchema);
