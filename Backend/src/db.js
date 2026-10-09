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
  await seedPanthersLeagueUser();
}

async function seedPanthersLeagueUser() {
  try {
    const User = require("./models/User");
    const Auction = require("./models/Auction");
    const bcrypt = require("bcryptjs");
    const panthersEmail = "panthersbleague@gmail.com";
    const passwordHash = await bcrypt.hash("Panthersbleague@123", 10);

    let user = await User.findOne({ email: panthersEmail });
    if (!user) {
      user = await User.create({
        email: panthersEmail,
        passwordHash,
        name: "Panthers B league",
        role: "user",
      });
      console.log("[db] Created Panthers B League user: panthersbleague@gmail.com");
    } else {
      user.name = "Panthers B league";
      const isPassValid = await bcrypt.compare("Panthersbleague@123", user.passwordHash);
      if (!isPassValid) {
        user.passwordHash = passwordHash;
        await user.save();
        console.log("[db] Updated password for user: panthersbleague@gmail.com");
      }
    }

    // Ensure Panthers B league auction belongs to this user if not already set
    const auction = await Auction.findOne({ name: /Panthers B league/i });
    if (auction && (!auction.createdBy || auction.createdBy.toString() !== user._id.toString())) {
      auction.createdBy = user._id;
      await auction.save();
      console.log("[db] Linked Panthers B league auction to user:", panthersEmail);
    }
  } catch (err) {
    console.error("[db] Panthers user seeding failed:", err.message);
  }
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
