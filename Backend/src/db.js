const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  // Connection Event Listeners
  mongoose.connection.on("connecting", () => {
    console.log("[mongodb] Connection process initiated...");
  });

  mongoose.connection.on("connected", () => {
    console.log("[mongodb] Connection established successfully.");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("[mongodb] Connection lost/disconnected.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[mongodb] Connection error occurred:", err.message);
  });

  await mongoose.connect(uri, { 
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 60000,
    maxPoolSize: 10,
    minPoolSize: 1,
    heartbeatFrequencyMS: 10000,
  });
}

module.exports = { connectDB };
