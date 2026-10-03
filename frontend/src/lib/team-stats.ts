import type { Auction, Player, Team } from "@/lib/auction-client";

export type ComputedTeamStats = {
  usedPoints: number;
  totalPoints: number;
  availablePoints: number;
  totalPlayers: number;
  reservedPlayers: number;
  maxBidPoints: number;
};

export function computeTeamStats(team: Team, players: Player[], auction: Auction): ComputedTeamStats {
  const teamIdStr = String(team.id || (team as any)._id || "").trim();
  const teamPlayers = players.filter((p) => {
    const pTeamIdStr = p.teamId ? String(p.teamId).trim() : "";
    const isSold = p.auctionRoundStatus === "sold" || Number(p.soldPrice ?? 0) > 0;
    return pTeamIdStr !== "" && pTeamIdStr === teamIdStr && isSold;
  });

  let usedPoints = 0;
  for (const p of teamPlayers) {
    if (p.soldPrice) usedPoints += Number(p.soldPrice);
  }
  const totalPoints = Number(auction.pointsPerTeam) || 0;
  const availablePoints = Math.max(0, totalPoints - usedPoints);
  const totalPlayers = teamPlayers.length;
  const reservedPlayers = Math.max(0, (Number(auction.playersPerTeam) || 0) - totalPlayers);

  const minBid = Number(auction.minimumBid) || 0;

  // Exact formula requested: Maximum Bid = Available Purse - (Remaining Players * Minimum Bid)
  const maxBidPoints =
    reservedPlayers > 0
      ? Math.max(0, availablePoints - reservedPlayers * minBid)
      : 0;

  return {
    usedPoints,
    totalPoints,
    availablePoints,
    totalPlayers,
    reservedPlayers,
    maxBidPoints,
  };
}

export function formatPoints(num: number): string {
  if (!num || isNaN(num) || num <= 0) return "0";
  if (num >= 100000) {
    const val = (num / 100000).toFixed(2).replace(/\.?0+$/, "");
    return `${val}L`;
  }
  if (num >= 1000) {
    const val = (num / 1000).toFixed(2).replace(/\.?0+$/, "");
    return `${val}K`;
  }
  return num.toString();
}
