require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { connectDB } = require("./src/db");
const { runMigration } = require("./src/lib/migration");
const authRoutes = require("./src/routes/auth");
const auctionRoutes = require("./src/routes/auction");
const teamsRoutes = require("./src/routes/teams");

const app = express();
const server = http.createServer(app);

// CLIENT_ORIGIN may be a comma-separated list (dev ports vary by sandbox).
// No cookies are used for auth (Bearer JWT only), so reflecting any origin
// carries no CSRF risk; set CLIENT_ORIGIN to lock this down in production.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins.length > 0 ? allowedOrigins : true }));

const io = new Server(server, {
  cors: { origin: allowedOrigins.length > 0 ? allowedOrigins : true },
});
app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join-auction", (auctionId) => {
    if (auctionId) socket.join(`auction:${auctionId}`);
  });
});

// Raised from the default ~100kb: cover images/avatars are inlined as base64
// JSON strings (no file-upload storage backend), which inflates ~33% over
// the raw image bytes. Paired with client-side downscaling before encoding.
app.use(express.json({ limit: "15mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api", teamsRoutes);
app.use("/api", require("./src/routes/players"));

app.use((err, _req, res, _next) => {
  if (err?.type === "entity.too.large" || err?.status === 413) {
    return res.status(413).json({ error: "Upload too large" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`[server] listening on port ${PORT}`));
    // runMigration().catch(err => console.error("[migration] failed:", err)); // DISABLED: Causes severe DB timeouts on startup due to massive regex collection scan
  })
  .catch((err) => {
    console.error("[server] failed to start:", err.message);
    process.exit(1);
  });
// Trigger watch reload to pick up team and player optimizations
// Reloaded at: 2026-09-01T18:36:00.000Z


