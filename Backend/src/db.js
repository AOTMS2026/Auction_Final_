const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  mongoose.connection.on("error", (err) => {
    console.error("[mongodb] connection error:", err.message);
  });

  await mongoose.connect(uri, { 
    family: 4,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 15000
  });
  console.log("[mongodb] connected");
}

module.exports = { connectDB };
