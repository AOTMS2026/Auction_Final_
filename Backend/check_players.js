const mongoose = require("mongoose");
const Player = require("./src/models/Player");
require("dotenv").config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB!");

  const players = await Player.find({});
  console.log(`Total players in database: ${players.length}`);

  let base64Photos = 0;
  let httpPhotos = 0;
  let emptyPhotos = 0;
  let otherPhotos = 0;

  let base64Payments = 0;
  let httpPayments = 0;
  let emptyPayments = 0;
  let otherPayments = 0;

  for (const p of players) {
    if (!p.photo) {
      emptyPhotos++;
    } else if (p.photo.startsWith("http")) {
      httpPhotos++;
    } else if (p.photo.startsWith("data:")) {
      base64Photos++;
    } else {
      otherPhotos++;
    }

    if (!p.paymentImage) {
      emptyPayments++;
    } else if (p.paymentImage.startsWith("http")) {
      httpPayments++;
    } else if (p.paymentImage.startsWith("data:")) {
      base64Payments++;
    } else {
      otherPayments++;
    }
  }

  console.log("--- PHOTOS ---");
  console.log(`Http URLs: ${httpPhotos}`);
  console.log(`Base64 (data:): ${base64Photos}`);
  console.log(`Empty/Null: ${emptyPhotos}`);
  console.log(`Other (raw bytes/base64): ${otherPhotos}`);

  console.log("--- PAYMENTS ---");
  console.log(`Http URLs: ${httpPayments}`);
  console.log(`Base64 (data:): ${base64Payments}`);
  console.log(`Empty/Null: ${emptyPayments}`);
  console.log(`Other (raw bytes/base64): ${otherPayments}`);

  await mongoose.disconnect();
}

check().catch(console.error);
