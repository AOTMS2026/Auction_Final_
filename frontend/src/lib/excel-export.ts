import * as XLSX from "xlsx";
import type { Auction, Player, Team } from "./auction-client";
import { computeTeamStats } from "./team-stats";

type CellStyle = {
  font?: { bold?: boolean; color?: { rgb: string }; sz?: number; name?: string };
  fill?: { fgColor?: { rgb: string } };
  alignment?: { horizontal?: "left" | "center" | "right"; vertical?: "top" | "center" | "bottom"; wrapText?: boolean };
  border?: {
    top?: { style: string; color?: { rgb: string } };
    bottom?: { style: string; color?: { rgb: string } };
    left?: { style: string; color?: { rgb: string } };
    right?: { style: string; color?: { rgb: string } };
  };
  numFmt?: string;
};

const BORDER_HEADER = {
  top: { style: "thin", color: { rgb: "38BDF8" } },
  bottom: { style: "medium", color: { rgb: "38BDF8" } },
  left: { style: "thin", color: { rgb: "1E3A45" } },
  right: { style: "thin", color: { rgb: "1E3A45" } },
};

const BORDER_DATA = {
  top: { style: "thin", color: { rgb: "E2E8F0" } },
  bottom: { style: "thin", color: { rgb: "E2E8F0" } },
  left: { style: "thin", color: { rgb: "E2E8F0" } },
  right: { style: "thin", color: { rgb: "E2E8F0" } },
};

const STYLE_HEADER: CellStyle = {
  font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11, name: "Calibri" },
  fill: { fgColor: { rgb: "142630" } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: BORDER_HEADER,
};

function formatCleanFilename(name: string, suffix: string): string {
  const clean = (name || "Auction").trim().replace(/[^a-zA-Z0-9_-]+/g, "_");
  const dateStr = new Date().toISOString().slice(0, 10);
  return `${clean}_${suffix}_${dateStr}.xlsx`;
}

/**
 * Applies styles, alignment, row heights, and auto column widths to an XLSX worksheet.
 */
function applySheetStyles(
  ws: XLSX.WorkSheet,
  headers: string[],
  rowsData: Record<string, any>[],
  alignMap: Record<string, "left" | "center" | "right">,
  numFmtMap?: Record<string, string>
) {
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");

  // Row heights: Header is 28pt, data rows are 20pt
  ws["!rows"] = [{ hpt: 28 }];

  // Column width tracker
  const colWidths: { wch: number }[] = headers.map((h) => ({ wch: Math.max(h.length + 4, 12) }));

  // Style Header Row (row 0)
  for (let c = 0; c < headers.length; c++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c });
    if (!ws[cellRef]) continue;
    ws[cellRef].s = { ...STYLE_HEADER };
  }

  // Style Data Rows
  for (let r = 1; r <= rowsData.length; r++) {
    ws["!rows"].push({ hpt: 20 });
    const rowObj = rowsData[r - 1];
    const isEven = r % 2 === 0;
    const bgRgb = isEven ? "F8FAFC" : "FFFFFF";

    for (let c = 0; c < headers.length; c++) {
      const headerKey = headers[c];
      const cellRef = XLSX.utils.encode_cell({ r, c });
      const cell = ws[cellRef];
      if (!cell) continue;

      const rawVal = rowObj?.[headerKey];
      const align = alignMap[headerKey] || (typeof rawVal === "number" ? "right" : "left");
      const valStr = rawVal !== null && rawVal !== undefined ? String(rawVal) : "";

      // Update column width
      if (valStr.length + 4 > colWidths[c].wch) {
        colWidths[c].wch = Math.min(valStr.length + 4, 45);
      }

      // Base style for data cell
      const cellStyle: CellStyle = {
        font: { color: { rgb: "1E293B" }, sz: 10, name: "Calibri" },
        fill: { fgColor: { rgb: bgRgb } },
        alignment: { horizontal: align, vertical: "center" },
        border: BORDER_DATA,
      };

      // Number formatting
      if (numFmtMap?.[headerKey] && typeof rawVal === "number") {
        cellStyle.numFmt = numFmtMap[headerKey];
      }

      // Highlight status values
      if (headerKey === "Auction Status") {
        if (valStr === "Sold") {
          cellStyle.fill = { fgColor: { rgb: "DCFCE7" } }; // Light emerald
          cellStyle.font = { bold: true, color: { rgb: "15803D" }, sz: 10, name: "Calibri" };
        } else if (valStr === "Unsold") {
          cellStyle.fill = { fgColor: { rgb: "FEF3C7" } }; // Light amber
          cellStyle.font = { bold: true, color: { rgb: "B45309" }, sz: 10, name: "Calibri" };
        } else if (valStr === "Pending" || valStr === "Available") {
          cellStyle.fill = { fgColor: { rgb: "E0F2FE" } }; // Light sky blue
          cellStyle.font = { bold: true, color: { rgb: "0369A1" }, sz: 10, name: "Calibri" };
        }
      }

      cell.s = cellStyle;
    }
  }

  ws["!cols"] = colWidths;
}

export const GRADE_ORDER_MAP: Record<string, number> = {
  "A+": 1,
  "A": 2,
  "B+": 3,
  "B": 4,
  "C": 5,
};

export function getPlayerGradeRank(grade?: string | null): number {
  if (!grade) return 999;
  const clean = grade.trim().toUpperCase().replace(/\s+/g, "");
  if (GRADE_ORDER_MAP[clean] !== undefined) {
    return GRADE_ORDER_MAP[clean];
  }
  return 900;
}

export function sortPlayersByGrade(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    const rankA = getPlayerGradeRank(a.category);
    const rankB = getPlayerGradeRank(b.category);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    if (a.sNo && b.sNo) return a.sNo - b.sNo;
    return (a.name || "").localeCompare(b.name || "");
  });
}

/**
 * Builds rows for players export with detected auction fields.
 * Players are sorted strictly according to Grade: A+ -> A -> B+ -> B -> C -> No Grade.
 */
function buildPlayerRows(auction: Auction, players: Player[], teams: Team[]) {
  const sortedPlayers = sortPlayersByGrade(players);

  const isBniAuction =
    auction.id === "6a8edaddd7ed74151dbafab3" ||
    auction.name?.toLowerCase().includes("bni") ||
    auction.name?.toLowerCase().includes("bbl");

  const isHunterzVolleyball =
    auction.id === "6a8a705aef1f9e0978b3031c" ||
    auction.name?.toLowerCase().includes("hunterz");

  const teamMap = new Map(teams.map((t) => [t.id, t.name]));

  // Dynamic field detections
  const hasAge = players.some((p) => p.age != null && String(p.age).trim() !== "");
  const hasRole = players.some(
    (p) =>
      (p.sportFields?.["role"] && String(p.sportFields["role"]).trim() !== "" && p.sportFields["role"] !== "-") ||
      (p.sportFields?.["Position"] && String(p.sportFields["Position"]).trim() !== "" && p.sportFields["Position"] !== "-")
  );
  const hasDominatedHand =
    !isBniAuction &&
    players.some(
      (p) =>
        (p.sportFields?.["Dominated Hand"] && String(p.sportFields["Dominated Hand"]).trim() !== "" && p.sportFields["Dominated Hand"] !== "-") ||
        p.customData?.startsWith("Dominated Hand:") ||
        (p.customData && !p.customData.includes("BNI") && !p.customData.includes("Family"))
    );
  const hasCategory = players.some((p) => p.category && p.category.trim() !== "");
  const hasGender = auction.id === "6a8edaddd7ed74151dbafab3" || players.some((p) => Boolean(p.gender && p.gender.trim() !== ""));
  const hasCity = !isHunterzVolleyball && players.some((p) => p.city && p.city.trim() !== "");
  const hasPlayerLevel = !isHunterzVolleyball && players.some((p) => p.playerLevel && p.playerLevel.trim() !== "");
  const hasJerseySize = !isHunterzVolleyball && players.some((p) => p.jerseySize && p.jerseySize.trim() !== "");
  const hasJerseyName = !isHunterzVolleyball && (isBniAuction || players.some((p) => p.jerseyName && p.jerseyName.trim() !== ""));
  const hasTrouserSize = !isHunterzVolleyball && players.some((p) => p.trouserSize && p.trouserSize.trim() !== "");
  const hasPaymentMode = !isBniAuction && !isHunterzVolleyball && players.some((p) => p.paymentMode && p.paymentMode.trim() !== "");
  const hasUtr = !isBniAuction && !isHunterzVolleyball && players.some((p) => p.utrNumber && p.utrNumber.trim() !== "");

  // BNI checks
  const hasBniMembership = isBniAuction || players.some((p) => p.customData?.includes("BNI Member") || p.customData?.includes("Family Member"));
  const hasChapter =
    auction.id === "6a8edaddd7ed74151dbafab3" ||
    isBniAuction ||
    players.some((p) => p.customData?.includes("Chapter:") || p.sportFields?.["chapter"] || p.sportFields?.["Chapter"] || p.city);

  // Active sport keys
  const activeSportKeys: string[] = [];
  players.forEach((p) => {
    if (p.sportFields && typeof p.sportFields === "object") {
      Object.keys(p.sportFields).forEach((k) => {
        if (
          k !== "originalPhoto" &&
          k !== "role" &&
          k !== "Position" &&
          k !== "Dominated Hand" &&
          k !== "chapter" &&
          k !== "Chapter" &&
          p.sportFields[k] !== undefined &&
          p.sportFields[k] !== null &&
          String(p.sportFields[k]).trim() !== "" &&
          String(p.sportFields[k]) !== "-" &&
          !activeSportKeys.includes(k)
        ) {
          activeSportKeys.push(k);
        }
      });
    }
  });

  const alignMap: Record<string, "left" | "center" | "right"> = {
    "S.No": "center",
    "Lot #": "center",
    "Player Name": "left",
    "Phone Number": "center",
    "Age": "center",
    "Playing Position / Role": "center",
    "Batting Hand": "center",
    "Dominated Hand": "center",
    "Wicket Keeper": "center",
    "Wicket-Keeper": "center",
    "Gender": "center",
    "City / Chapter": "left",
    "Player Level": "center",
    "Grade / Category": "center",
    "Jersey Size": "center",
    "Jersey Name": "left",
    "Trouser Size": "center",
    "Jersey Number": "center",
    "Membership Type": "center",
    "Chapter Name": "left",
    "Payment Mode": "center",
    "UTR / Ref Number": "center",
    "Base Value (Points)": "right",
    "Auction Status": "center",
    "Sold To Team": "left",
    "Sold Price (Points)": "right",
    "Registration Date": "center",
  };

  const numFmtMap: Record<string, string> = {
    "Base Value (Points)": "#,##0",
    "Sold Price (Points)": "#,##0",
  };

  const rows = sortedPlayers.map((p, index) => {
    const isSold = Boolean(p.teamId || p.auctionRoundStatus === "sold");
    const isUnsold = p.auctionRoundStatus === "unsold";
    const statusText = isSold ? "Sold" : isUnsold ? "Unsold" : "Pending";
    const soldTeamName = p.teamId ? (teamMap.get(p.teamId) || "Sold") : "-";

    const row: Record<string, any> = {
      "S.No": index + 1,
      "Player Name": p.name || "",
      "Phone Number": p.phone || "-",
    };

    if (hasAge) {
      row["Age"] = p.age ?? "-";
    }

    if (hasRole) {
      row["Playing Position / Role"] = p.sportFields?.["role"] || p.sportFields?.["Position"] || "-";
    }

    if (hasDominatedHand) {
      row["Batting Hand"] =
        p.sportFields?.["Dominated Hand"] ||
        (p.customData?.startsWith("Dominated Hand: ")
          ? p.customData.replace("Dominated Hand: ", "")
          : (!p.customData?.includes("BNI") && !p.customData?.includes("Family")
              ? (p.customData || "-")
              : "-"));
    }

    if (hasGender) {
      const g = (p.gender || "").trim().toLowerCase();
      row["Gender"] =
        g === "m" || g === "male"
          ? "Male"
          : g === "f" || g === "female" || g === "w" || g === "woman" || g === "women"
          ? "Female"
          : p.gender ? (p.gender.charAt(0).toUpperCase() + p.gender.slice(1)) : "-";
    }

    if (hasCity || hasChapter) {
      let ch = (p.sportFields?.["chapter"] || p.sportFields?.["Chapter"] || "") as string;
      if (!ch && p.customData) {
        const match = p.customData.match(/Chapter:\s*([^,|]+)/i) || p.customData.match(/Chapter\s*-\s*([^,|]+)/i);
        if (match?.[1]) ch = match[1].trim();
      }
      row["City / Chapter"] = ch || p.city || "-";
    }

    if (hasPlayerLevel) {
      row["Player Level"] = p.playerLevel || "-";
    }

    activeSportKeys.forEach((key) => {
      row[key] = p.sportFields?.[key] ?? "-";
      alignMap[key] = "center";
    });

    if (hasCategory || p.category) {
      row["Grade / Category"] = p.category || "-";
    }

    if (hasJerseySize) {
      row["Jersey Size"] = p.jerseySize || "-";
    }

    if (hasJerseyName) {
      row["Jersey Name"] = p.jerseyName || "-";
    }

    if (hasTrouserSize) {
      row["Jersey Number"] = p.trouserSize || "-";
    }

    if (hasBniMembership) {
      let memType = "-";
      if (p.customData?.includes("BNI Member")) memType = "BNI Member";
      else if (p.customData?.includes("Family Member")) memType = "Family Member";
      row["Membership Type"] = memType;
    }

    if (hasPaymentMode) {
      row["Payment Mode"] = p.paymentMode || "-";
    }
    if (hasUtr) {
      row["UTR / Ref Number"] = p.utrNumber || "-";
    }

    row["Base Value (Points)"] = p.baseValue ?? 0;
    row["Auction Status"] = statusText;
    row["Sold To Team"] = soldTeamName;
    row["Sold Price (Points)"] = isSold
      ? (p.soldPrice !== null && p.soldPrice !== undefined ? p.soldPrice : (p.baseValue ?? 0))
      : 0;

    if (p.createdAt) {
      row["Registration Date"] = new Date(p.createdAt).toLocaleDateString("en-IN");
    }

    return row;
  });

  return { rows, alignMap, numFmtMap };
}

/**
 * Builds rows for teams summary.
 */
function buildTeamSummaryRows(auction: Auction, teams: Team[], players: Player[]) {
  const alignMap: Record<string, "left" | "center" | "right"> = {
    "S.No": "center",
    "Team Name": "left",
    "Team Code": "center",
    "Owner Name": "left",
    "Owner Phone": "center",
    "Players Bought": "center",
    "Max Players": "center",
    "Total Points": "right",
    "Points Spent": "right",
    "Points Remaining": "right",
    "Max Bid Possible": "right",
  };

  const numFmtMap: Record<string, string> = {
    "Total Points": "#,##0",
    "Points Spent": "#,##0",
    "Points Remaining": "#,##0",
    "Max Bid Possible": "#,##0",
  };

  const rows = teams.map((team, index) => {
    const stats = computeTeamStats(team, players, auction);
    return {
      "S.No": index + 1,
      "Team Name": team.name,
      "Team Code": team.shortName || "-",
      "Owner Name": team.ownerName || "-",
      "Owner Phone": team.ownerPhone || "-",
      "Players Bought": stats.totalPlayers,
      "Max Players": auction.playersPerTeam,
      "Total Points": stats.totalPoints,
      "Points Spent": stats.usedPoints,
      "Points Remaining": stats.availablePoints,
      "Max Bid Possible": stats.maxBidPoints,
    };
  });

  return { rows, alignMap, numFmtMap };
}

/**
 * Builds rows for Team Rosters (breakdown of each team and their purchased players).
 */
function buildTeamRosterRows(teams: Team[], players: Player[]) {
  const alignMap: Record<string, "left" | "center" | "right"> = {
    "S.No": "center",
    "Team Name": "left",
    "Team Code": "center",
    "Player Name": "left",
    "Phone Number": "center",
    "Role / Position": "center",
    "Category / Grade": "center",
    "Base Value (Points)": "right",
    "Purchase Price (Points)": "right",
  };

  const numFmtMap: Record<string, string> = {
    "Base Value (Points)": "#,##0",
    "Purchase Price (Points)": "#,##0",
  };

  let globalIndex = 1;
  const rows: Record<string, any>[] = [];

  teams.forEach((t) => {
    const teamPlayers = sortPlayersByGrade(players.filter((p) => p.teamId === t.id));
    if (teamPlayers.length === 0) {
      rows.push({
        "S.No": globalIndex++,
        "Team Name": t.name,
        "Team Code": t.shortName || "-",
        "Player Name": "(No players bought yet)",
        "Phone Number": "-",
        "Role / Position": "-",
        "Category / Grade": "-",
        "Base Value (Points)": 0,
        "Purchase Price (Points)": 0,
      });
    } else {
      teamPlayers.forEach((p) => {
        rows.push({
          "S.No": globalIndex++,
          "Team Name": t.name,
          "Team Code": t.shortName || "-",
          "Player Name": p.name || "",
          "Phone Number": p.phone || "-",
          "Role / Position": p.sportFields?.["role"] || p.sportFields?.["Position"] || "-",
          "Category / Grade": p.category || "-",
          "Base Value (Points)": p.baseValue ?? 0,
          "Purchase Price (Points)": p.soldPrice ?? p.baseValue ?? 0,
        });
      });
    }
  });

  return { rows, alignMap, numFmtMap };
}

/**
 * Export Complete Auction Excel workbook with multiple tabs:
 * 1. All Players (with Sold/Unsold/Pending status and proper alignment)
 * 2. Teams Summary (with financial and player statistics)
 * 3. Team Rosters (detailed list of players per team)
 */
export function exportCompleteAuctionExcel(
  auction: Auction,
  players: Player[],
  teams: Team[]
) {
  const wb = XLSX.utils.book_new();

  // 1. Players Sheet
  const { rows: playerRows, alignMap: playerAlign, numFmtMap: playerFmt } = buildPlayerRows(auction, players, teams);
  if (playerRows.length > 0) {
    const headers = Object.keys(playerRows[0]);
    const wsPlayers = XLSX.utils.json_to_sheet(playerRows, { header: headers });
    applySheetStyles(wsPlayers, headers, playerRows, playerAlign, playerFmt);
    XLSX.utils.book_append_sheet(wb, wsPlayers, "All Players");
  }

  // 2. Teams Summary Sheet
  if (teams.length > 0) {
    const { rows: teamRows, alignMap: teamAlign, numFmtMap: teamFmt } = buildTeamSummaryRows(auction, teams, players);
    const headers = Object.keys(teamRows[0]);
    const wsTeams = XLSX.utils.json_to_sheet(teamRows, { header: headers });
    applySheetStyles(wsTeams, headers, teamRows, teamAlign, teamFmt);
    XLSX.utils.book_append_sheet(wb, wsTeams, "Teams Summary");
  }

  // 3. Team Rosters Sheet (Purchased players per team)
  const soldPlayers = players.filter((p) => Boolean(p.teamId));
  if (teams.length > 0 && soldPlayers.length > 0) {
    const { rows: rosterRows, alignMap: rosterAlign, numFmtMap: rosterFmt } = buildTeamRosterRows(teams, players);
    const headers = Object.keys(rosterRows[0]);
    const wsRosters = XLSX.utils.json_to_sheet(rosterRows, { header: headers });
    applySheetStyles(wsRosters, headers, rosterRows, rosterAlign, rosterFmt);
    XLSX.utils.book_append_sheet(wb, wsRosters, "Team Rosters");
  }

  const filename = formatCleanFilename(auction.name, "Auction_Results");
  XLSX.writeFile(wb, filename);
}

/**
 * Export Single Players Excel Sheet with proper alignment and styling
 */
export function exportPlayersExcel(
  auction: Auction,
  players: Player[],
  teams: Team[]
) {
  const wb = XLSX.utils.book_new();
  const { rows, alignMap, numFmtMap } = buildPlayerRows(auction, players, teams);
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  applySheetStyles(ws, headers, rows, alignMap, numFmtMap);
  XLSX.utils.book_append_sheet(wb, ws, "Registered Players");

  const filename = formatCleanFilename(auction.name, "Players");
  XLSX.writeFile(wb, filename);
}

/**
 * Export Single Teams Excel Sheet with proper alignment and styling
 */
export function exportTeamsExcel(
  auction: Auction,
  teams: Team[],
  players: Player[] = []
) {
  const wb = XLSX.utils.book_new();
  const { rows, alignMap, numFmtMap } = buildTeamSummaryRows(auction, teams, players);
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  applySheetStyles(ws, headers, rows, alignMap, numFmtMap);
  XLSX.utils.book_append_sheet(wb, ws, "Teams");

  const filename = formatCleanFilename(auction.name, "Teams");
  XLSX.writeFile(wb, filename);
}
