const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const match = /^Bearer (.+)$/.exec(header);
  if (!match) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function optionalAuth(req, _res, next) {
  const header = req.headers.authorization ?? "";
  const match = /^Bearer (.+)$/.exec(header);
  if (match) {
    try {
      const payload = jwt.verify(match[1], process.env.JWT_SECRET);
      req.userId = payload.sub;
    } catch {
      // No valid token: proceed as an anonymous request.
    }
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
