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
    reservedPlayers > 0 ? availablePoints - (reservedPlayers - 1) * auction.minimumBid : 0;

  return {
    usedPoints,
    totalPoints,
    availablePoints,
    totalPlayers,
    reservedPlayers,
    maxBidPoints: maxBidPoints > 0 ? maxBidPoints : 0,
  };
}

export function formatPoints(num: number): string {
  if (num >= 100000) return `${(num / 100000).toFixed(1).replace(/\.0$/, "")} L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")} T`;
  return num.toString();
}
