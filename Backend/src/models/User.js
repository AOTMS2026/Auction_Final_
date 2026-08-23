const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    avatar: {
      type: String,
    },
    bookmarkedAuctionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
