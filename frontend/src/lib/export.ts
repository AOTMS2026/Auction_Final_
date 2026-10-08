export * from "./excel-export";
import { exportCompleteAuctionExcel } from "./excel-export";
import type { Auction, Player, Team } from "./auction-client";

export function exportPlayersAndTeams(players: Player[], teams: Team[], auctionName: string) {
  const dummyAuction: Partial<Auction> = {
    name: auctionName,
  };
  exportCompleteAuctionExcel(dummyAuction as Auction, players, teams);
}
