// Mocks and test suite for the dynamic max bid calculations and validation rules

// 1. Mock computeTeamStats function from team-stats.ts logic
function computeTeamStats(team, players, auction) {
  const teamPlayers = players.filter((p) => p.teamId === team.id);
  let usedPoints = 0;
  for (const p of teamPlayers) {
    if (p.soldPrice) usedPoints += p.soldPrice;
  }
  const totalPoints = auction.pointsPerTeam;
  const availablePoints = totalPoints - usedPoints;
  const totalPlayers = teamPlayers.length;
  const reservedPlayers = auction.playersPerTeam - totalPlayers;
  
  const maxBidPoints =
    reservedPlayers > 0
      ? Math.min(auction.maxBid, availablePoints - (reservedPlayers - 1) * auction.minimumBid)
      : 0;

  return {
    usedPoints,
    totalPoints,
    availablePoints,
    totalPlayers,
    reservedPlayers,
    maxBidPoints: maxBidPoints > 0 ? maxBidPoints : 0,
  };
}

// 2. Mock Backend validation logic
function validatePlayerPurchase(player, targetTeamId, reqBody, otherPlayersOnTeam, auction) {
  const nextTeamId = targetTeamId;
  const rosterCount = otherPlayersOnTeam.length;
  
  if (rosterCount >= auction.playersPerTeam) {
    return { error: `This team already has the maximum ${auction.playersPerTeam} players.` };
  }

  const newPrice = reqBody.soldPrice !== undefined ? reqBody.soldPrice : player.soldPrice;
  const newStatus = reqBody.auctionRoundStatus !== undefined ? reqBody.auctionRoundStatus : player.auctionRoundStatus;

  if (newStatus === "sold" && newPrice !== null && newPrice !== undefined) {
    if (newPrice < auction.minimumBid) {
      return { error: `Sale price (🪙 ${newPrice.toLocaleString()}) cannot be below the configured minimum bid (🪙 ${auction.minimumBid.toLocaleString()}).` };
    }

    let usedPoints = 0;
    for (const op of otherPlayersOnTeam) {
      if (op.soldPrice) usedPoints += op.soldPrice;
    }

    const remainingPurse = auction.pointsPerTeam - usedPoints;
    const playersRemaining = auction.playersPerTeam - rosterCount;

    const configuredMaximumBid = auction.maxBid ?? 30000;
    const reserveForOtherPlayers = playersRemaining > 1 ? (playersRemaining - 1) * auction.minimumBid : 0;
    const affordableBid = remainingPurse - reserveForOtherPlayers;
    const actualMaximumBid = Math.max(0, Math.min(configuredMaximumBid, affordableBid));

    if (newPrice > remainingPurse) {
      return { error: `Insufficient funds: Team only has 🪙 ${remainingPurse.toLocaleString()} remaining, but bid is 🪙 ${newPrice.toLocaleString()}.` };
    }

    if (newPrice > actualMaximumBid) {
      return { error: `Bid of 🪙 ${newPrice.toLocaleString()} exceeds the team's maximum allowed bid of 🪙 ${actualMaximumBid.toLocaleString()} (reserving 🪙 ${reserveForOtherPlayers.toLocaleString()} for ${playersRemaining - 1} remaining spots).` };
    }
  }

  return { ok: true };
}

// RUN TEST CONFIGURATIONS
console.log("=========================================");
console.log("RUNNING CALCULATIONS & VALIDATION TESTS");
console.log("=========================================");

const configs = {
  A: { pointsPerTeam: 60000, minimumBid: 5000, maxBid: 30000, playersPerTeam: 7 },
  B: { pointsPerTeam: 100000, minimumBid: 2000, maxBid: 40000, playersPerTeam: 8 },
  C: { pointsPerTeam: 50000, minimumBid: 3000, maxBid: 20000, playersPerTeam: 5 },
  D: { pointsPerTeam: 200000, minimumBid: 10000, maxBid: 75000, playersPerTeam: 10 },
  E: { pointsPerTeam: 80000, minimumBid: 8000, maxBid: 25000, playersPerTeam: 6 }
};

const team = { id: "team-1" };

// TEST CONFIGURATION A
console.log("\n--- CONFIGURATION A ---");
let playersA = [];
let stats = computeTeamStats(team, playersA, configs.A);
console.log(`Initial Max Bid (Expected: 30,000): ${stats.maxBidPoints.toLocaleString()}`);

// Add 3 players sold at 10,000 each. Remaining purse = 30,000. Players remaining = 4.
playersA = [
  { teamId: "team-1", soldPrice: 10000 },
  { teamId: "team-1", soldPrice: 10000 },
  { teamId: "team-1", soldPrice: 10000 }
];
stats = computeTeamStats(team, playersA, configs.A);
// Reserve for other 3 players: 3 * 5000 = 15000. Max Bid = min(30000, 30000 - 15000) = 15000.
console.log(`Max Bid after 3 purchases of 10,000 (Expected: 15,000): ${stats.maxBidPoints.toLocaleString()}`);

// Test validation for CONFIG A: try to purchase a 4th player at 16,000
let val = validatePlayerPurchase({ id: "player-4" }, "team-1", { soldPrice: 16000, auctionRoundStatus: "sold" }, playersA, configs.A);
console.log(`Attempt to buy at 16,000 (Expected rejection): ${val.error ? "REJECTED: " + val.error : "PASSED"}`);

// Try to purchase at 15,000
val = validatePlayerPurchase({ id: "player-4" }, "team-1", { soldPrice: 15000, auctionRoundStatus: "sold" }, playersA, configs.A);
console.log(`Attempt to buy at 15,000 (Expected OK): ${val.ok ? "PASSED" : "FAILED: " + val.error}`);


// TEST CONFIGURATION B
console.log("\n--- CONFIGURATION B ---");
let playersB = [];
stats = computeTeamStats(team, playersB, configs.B);
console.log(`Initial Max Bid (Expected: 40,000): ${stats.maxBidPoints.toLocaleString()}`);

// Add 4 players for total of 30,000. Remaining purse = 70,000. Remaining players = 4.
playersB = [
  { teamId: "team-1", soldPrice: 10000 },
  { teamId: "team-1", soldPrice: 8000 },
  { teamId: "team-1", soldPrice: 6000 },
  { teamId: "team-1", soldPrice: 6000 }
];
stats = computeTeamStats(team, playersB, configs.B);
// Reserve for other 3 spots: 3 * 2000 = 6000. Max Bid = min(40000, 70000 - 6000) = 40,000.
console.log(`Max Bid after 4 purchases (Expected: 40,000): ${stats.maxBidPoints.toLocaleString()}`);

// Test validation for CONFIG B: try to bid 41,000
val = validatePlayerPurchase({ id: "player-5" }, "team-1", { soldPrice: 41000, auctionRoundStatus: "sold" }, playersB, configs.B);
console.log(`Attempt to buy at 41,000 (Expected rejection): ${val.error ? "REJECTED: " + val.error : "PASSED"}`);


// TEST CONFIGURATION C (Last Player & Squad Limit)
console.log("\n--- CONFIGURATION C ---");
let playersC = [
  { teamId: "team-1", soldPrice: 10000 },
  { teamId: "team-1", soldPrice: 10000 },
  { teamId: "team-1", soldPrice: 10000 },
  { teamId: "team-1", soldPrice: 10000 }
];
stats = computeTeamStats(team, playersC, configs.C);
// Remaining purse = 10,000. Remaining players = 1.
// Reserve for other 0 spots: 0. Max Bid = min(20000, 10000 - 0) = 10,000.
console.log(`Max Bid for last spot (Expected: 10,000): ${stats.maxBidPoints.toLocaleString()}`);

// Attempt to buy last player at 10,001 (exceeds purse)
val = validatePlayerPurchase({ id: "player-5" }, "team-1", { soldPrice: 10001, auctionRoundStatus: "sold" }, playersC, configs.C);
console.log(`Attempt to buy at 10,001 (Expected rejection): ${val.error ? "REJECTED: " + val.error : "PASSED"}`);

// Attempt to buy last player at 10,000 (exceeds neither)
val = validatePlayerPurchase({ id: "player-5" }, "team-1", { soldPrice: 10000, auctionRoundStatus: "sold" }, playersC, configs.C);
console.log(`Attempt to buy at 10,000 (Expected OK): ${val.ok ? "PASSED" : "FAILED: " + val.error}`);

// After last player is bought, try to buy a 6th player (roster cap exceeded)
playersC.push({ teamId: "team-1", soldPrice: 10000 });
val = validatePlayerPurchase({ id: "player-6" }, "team-1", { soldPrice: 3000, auctionRoundStatus: "sold" }, playersC, configs.C);
console.log(`Attempt to buy 6th player (Expected rejection): ${val.error ? "REJECTED: " + val.error : "PASSED"}`);


// TEST CONFIGURATION D (Extremely Low Purse / Insufficient for reserve)
console.log("\n--- CONFIGURATION D ---");
// Purse = 200,000. Squad = 10. Base = 10,000.
// Let's buy 8 players for total of 185,000. Remaining purse = 15,000. Remaining players = 2.
// Reserve required for other 1 spot: 1 * 10,000 = 10,000.
// Max affordable bid: 15,000 - 10,000 = 5,000. Note: 5,000 is LESS than base price (10,000).
// Max Bid returned should be 5,000.
let playersD = Array(8).fill({ teamId: "team-1", soldPrice: 23125 }); // 8 * 23125 = 185,000
stats = computeTeamStats(team, playersD, configs.D);
console.log(`Max Bid when purse is low (Expected: 5,000): ${stats.maxBidPoints.toLocaleString()}`);

// Attempt to buy at base price 10,000 (fails due to reserve violation - not enough money left for last player)
val = validatePlayerPurchase({ id: "player-9" }, "team-1", { soldPrice: 10000, auctionRoundStatus: "sold" }, playersD, configs.D);
console.log(`Attempt to buy at base price 10,000 (Expected rejection due to reserve): ${val.error ? "REJECTED: " + val.error : "PASSED"}`);


// TEST CONFIGURATION E (Negative purse protection & base price protection)
console.log("\n--- CONFIGURATION E ---");
let playersE = [];
// Base price is 8,000. Attempt to sell below base price (e.g. 7,999)
val = validatePlayerPurchase({ id: "player-1" }, "team-1", { soldPrice: 7999, auctionRoundStatus: "sold" }, playersE, configs.E);
console.log(`Attempt to buy below base price 8,000 (Expected rejection): ${val.error ? "REJECTED: " + val.error : "PASSED"}`);

console.log("\nAll tests ran.");
