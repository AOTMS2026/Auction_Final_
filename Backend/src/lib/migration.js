const Auction = require("../models/Auction");
const Player = require("../models/Player");
const { uploadBase64Image } = require("./cloudinary");

async function runMigration() {
  console.log("[migration] Checking database for base64 images to migrate to Cloudinary...");

  try {
    // 1. Migrate Auction cover images
    const base64Auctions = await Auction.find({ coverImage: { $regex: /^data:/ } });
    if (base64Auctions.length > 0) {
      console.log(`[migration] Found ${base64Auctions.length} auctions with base64 cover images.`);
      for (const auction of base64Auctions) {
        try {
          const url = await uploadBase64Image(auction.coverImage);
          if (url) {
            auction.coverImage = url;
            await auction.save();
            console.log(`[migration] Successfully migrated cover image for auction: ${auction.name} (${auction._id})`);
          }
        } catch (err) {
          console.error(`[migration] Failed to migrate cover image for auction ${auction._id}:`, err.message);
        }
      }
    }

    // 2. Migrate Player photos and payment images
    const base64Players = await Player.find({
      $or: [
        { photo: { $regex: /^data:/ } },
        { paymentImage: { $regex: /^data:/ } }
      ]
    });

    if (base64Players.length > 0) {
      console.log(`[migration] Found ${base64Players.length} players with base64 images.`);
      for (const player of base64Players) {
        try {
          let updated = false;
          if (player.photo && player.photo.startsWith("data:")) {
            const url = await uploadBase64Image(player.photo);
            if (url) {
              player.photo = url;
              updated = true;
            }
          }
          if (player.paymentImage && player.paymentImage.startsWith("data:")) {
            const url = await uploadBase64Image(player.paymentImage);
            if (url) {
              player.paymentImage = url;
              updated = true;
            }
          }
          if (updated) {
            await player.save();
            console.log(`[migration] Successfully migrated images for player: ${player.name} (${player._id})`);
          }
        } catch (err) {
          console.error(`[migration] Failed to migrate images for player ${player._id}:`, err.message);
        }
      }
    }

    console.log("[migration] Base64 image migration check completed.");
  } catch (error) {
    console.error("[migration] Error during migration check:", error);
  }
}

module.exports = { runMigration };
