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

  await seedAdminUser();
}

async function seedAdminUser() {
  try {
    const User = require("./models/User");
    const bcrypt = require("bcryptjs");
    const adminEmail = "aotms@aotms.com";
    const passwordHash = await bcrypt.hash("Aotms@2026", 10);

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        email: adminEmail,
        passwordHash,
        name: "AOTMS",
        role: "admin",
      });
      console.log("[db] Created default Admin user: aotms@aotms.com");
    } else {
      admin.role = "admin";
      admin.name = "AOTMS";
      const isPassValid = await bcrypt.compare("Aotms@2026", admin.passwordHash);
      if (!isPassValid) {
        admin.passwordHash = passwordHash;
      }
      await admin.save();
      console.log("[db] Verified & updated Admin user: aotms@aotms.com");
    }
  } catch (err) {
    console.error("[db] Admin seeding failed:", err.message);
  }
}

module.exports = { connectDB };
