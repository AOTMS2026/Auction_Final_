import * as XLSX from "xlsx";
import type { Player, Team } from "./auction-client";
import { format } from "date-fns";

export function exportPlayersAndTeams(players: Player[], teams: Team[], auctionName: string) {
  // Build Team mapping
  const teamMap = new Map<string, string>();
  teams.forEach(t => teamMap.set(t.id, t.name));

  // Prepare Players sheet data
  const playersData = players.map(p => ({
    "Name": p.name,
    "Phone": p.phone,
    "Age": p.age || "",
    "Category": p.category,
    "Base Value": p.baseValue,
    "Sold Price": p.soldPrice || "",
    "Team": p.teamId ? (teamMap.get(p.teamId) || "Unknown Team") : "Unsold",
    "Jersey Size": p.jerseySize,
    "Jersey Name": p.jerseyName,
    "Trouser Size": p.trouserSize,
    "Extra Details": p.customData,
    ...p.sportFields // Spread the dynamic sport fields
  }));

  const wb = XLSX.utils.book_new();

  const wsPlayers = XLSX.utils.json_to_sheet(playersData);
  XLSX.utils.book_append_sheet(wb, wsPlayers, "Players");

  if (teams.length > 0) {
    const teamsData = teams.map(t => {
      const teamPlayers = players.filter(p => p.teamId === t.id);
      const spent = teamPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
      return {
        "Team Name": t.name,
        "Short Name": t.shortName,
        "Total Players Bought": teamPlayers.length,
        "Total Spent": spent,
      };
    });
    const wsTeams = XLSX.utils.json_to_sheet(teamsData);
    XLSX.utils.book_append_sheet(wb, wsTeams, "Teams");
  }

  const dateStr = format(new Date(), "yyyy-MM-dd");
  XLSX.writeFile(wb, `${auctionName.replace(/[^a-zA-Z0-9]/g, "_")}_Export_${dateStr}.xlsx`);
}
