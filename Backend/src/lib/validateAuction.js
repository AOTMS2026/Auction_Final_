const { SPORT_TYPES, VISIBILITIES } = require("../models/Auction");

const MAX_IMAGE_LENGTH = 4_000_000;

function validateAuctionInput(body, { partial = false } = {}) {
  const errors = [];
  const has = (key) => Object.prototype.hasOwnProperty.call(body, key);

  function requireOrCheck(key, check, message) {
    if (has(key)) {
      if (!check(body[key])) errors.push(message);
    } else if (!partial) {
      errors.push(`${key} is required`);
    }
  }

  requireOrCheck(
    "sportType",
    (v) => typeof v === "string" && SPORT_TYPES.includes(v),
    `sportType must be one of: ${SPORT_TYPES.join(", ")}`,
  );

  requireOrCheck(
    "name",
    (v) => typeof v === "string" && v.trim().length > 0 && v.trim().length <= 120,
    "name must be a non-empty string up to 120 characters",
  );

  requireOrCheck(
    "startsAt",
    (v) => typeof v === "string" && !Number.isNaN(new Date(v).getTime()),
    "startsAt must be a valid date/time",
  );

  requireOrCheck(
    "playersPerTeam",
    (v) => typeof v === "number" && Number.isFinite(v) && v >= 1,
    "playersPerTeam must be a number >= 1",
  );

  requireOrCheck(
    "pointsPerTeam",
    (v) => typeof v === "number" && Number.isFinite(v) && v >= 1,
    "pointsPerTeam must be a number >= 1",
  );

  requireOrCheck(
    "minimumBid",
    (v) => typeof v === "number" && Number.isFinite(v) && v >= 0,
    "minimumBid must be a number >= 0",
  );

  requireOrCheck(
    "bidIncrement",
    (v) => typeof v === "number" && Number.isFinite(v) && v >= 1,
    "bidIncrement must be a number >= 1",
  );

  requireOrCheck(
    "visibility",
    (v) => typeof v === "string" && VISIBILITIES.includes(v),
    `visibility must be one of: ${VISIBILITIES.join(", ")}`,
  );

  if (has("coverImage") && body.coverImage != null) {
    if (typeof body.coverImage !== "string" || body.coverImage.length > MAX_IMAGE_LENGTH) {
      errors.push("coverImage must be a base64 string under the size limit");
    }
  }

  return { errors };
}

module.exports = { validateAuctionInput, MAX_IMAGE_LENGTH };
