import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { toast } from "sonner";
import { auctionClient, type Auction, type Player, type Team } from "./auction-client";

export function exportAuctionPDF(auction: Auction, players: Player[], teams: Team[]) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Filter sold and unsold players
  const soldPlayers = players.filter((p) => p.auctionRoundStatus === "sold" || (p.teamId && (p.soldPrice ?? 0) > 0));
  const unsoldPlayers = players.filter((p) => p.auctionRoundStatus === "unsold" || (!p.teamId && p.auctionRoundStatus !== "pending"));
  const pendingPlayers = players.filter((p) => p.auctionRoundStatus === "pending" && !p.teamId);
  const totalTurnover = soldPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0);

  // --- HEADER BANNER ---
  doc.setFillColor(23, 26, 29); // Dark background #171a1d
  doc.rect(0, 0, pageWidth, 42, "F");

  // Accent line
  doc.setFillColor(161, 181, 216); // #a1b5d8
  doc.rect(0, 41, pageWidth, 1.5, "F");

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 252, 247); // #fffcf7
  doc.text(auction.name.toUpperCase(), margin, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(171, 180, 189); // #abb4bd
  doc.text(
    `OFFICIAL AUCTION SUMMARY REPORT • ${auction.sportType?.toUpperCase() || "SPORTS"}`,
    margin,
    22
  );

  const dateStr = format(new Date(), "dd MMM yyyy, hh:mm a");
  doc.setFontSize(8.5);
  doc.text(`Generated: ${dateStr}`, margin, 28);

  // Status Badge on Top Right
  doc.setFillColor(35, 52, 29); // Green dark
  doc.roundedRect(pageWidth - margin - 35, 10, 35, 12, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(194, 216, 185); // Light green
  doc.text("STATUS: COMPLETED", pageWidth - margin - 33, 17);

  // --- KEY METRICS SUMMARY ROW ---
  let startY = 48;

  const statBoxes = [
    { label: "TOTAL PLAYERS", val: `${players.length}` },
    { label: "SOLD PLAYERS", val: `${soldPlayers.length}` },
    { label: "UNSOLD PLAYERS", val: `${unsoldPlayers.length}` },
    { label: "AVAILABLE / PENDING", val: `${pendingPlayers.length}` },
    { label: "TOTAL SPENT", val: `${totalTurnover.toLocaleString()}` },
  ];

  const boxWidth = contentWidth / statBoxes.length;
  statBoxes.forEach((box, i) => {
    const x = margin + i * boxWidth;
    doc.setFillColor(245, 247, 250);
    doc.setDrawColor(220, 226, 235);
    doc.roundedRect(x, startY, boxWidth - 2, 16, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(92, 104, 117);
    doc.text(box.label, x + 3, startY + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(23, 26, 29);
    doc.text(box.val, x + 3, startY + 12);
  });

  startY += 22;

  // --- SECTION: TEAM SQUADS & PURCHASE BREAKDOWN ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(23, 26, 29);
  doc.text("TEAM SQUADS & PURCHASE BREAKDOWN", margin, startY);
  startY += 4;

  teams.forEach((team) => {
    const teamSoldPlayers = players.filter(
      (p) => p.teamId === team.id && (p.auctionRoundStatus === "sold" || (p.soldPrice ?? 0) > 0)
    );
    const teamTotalSpent = teamSoldPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
    const remainingPurse = (auction.pointsPerTeam || 0) - teamTotalSpent;

    // Check if we need a page break before starting a team block
    if (startY > pageHeight - 50) {
      doc.addPage();
      startY = 18;
    }

    // Team Banner Box
    doc.setFillColor(23, 34, 53); // #162235 Dark navy
    doc.roundedRect(margin, startY, contentWidth, 10, 1.5, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`${team.name.toUpperCase()} (${team.shortName || "-"})`, margin + 4, startY + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(194, 216, 185);
    const ownerInfo = team.ownerName ? `Owner: ${team.ownerName}  |  ` : "";
    const spendInfo = `Bought: ${teamSoldPlayers.length}  |  Spent: ${teamTotalSpent.toLocaleString()} pts  |  Remaining: ${Math.max(0, remainingPurse).toLocaleString()} pts`;
    doc.text(ownerInfo + spendInfo, pageWidth - margin - 4, startY + 6.5, { align: "right" });

    startY += 12;

    if (teamSoldPlayers.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(120, 130, 140);
      doc.text("No players acquired in this auction.", margin + 4, startY + 3);
      startY += 8;
    } else {
      const tableRows = teamSoldPlayers.map((p, idx) => {
        const isDummy = p.phone && p.phone.startsWith("90000000");
        const pNum = isDummy ? `#${parseInt(p.phone.slice(8))}` : `#${idx + 1}`;
        const role = p.sportFields?.["role"] || p.sportFields?.["position"] || "-";
        const category = p.category || "-";
        const base = p.baseValue ? `${p.baseValue.toLocaleString()}` : `${auction.minimumBid.toLocaleString()}`;
        const sold = p.soldPrice ? `${p.soldPrice.toLocaleString()}` : "0";

        return [pNum, p.name, role, category, base, sold];
      });

      autoTable(doc, {
        startY: startY,
        head: [["#", "PLAYER NAME", "ROLE", "GRADE", "BASE PRICE", "FINAL SOLD PRICE"]],
        body: tableRows,
        margin: { left: margin, right: margin },
        theme: "striped",
        headStyles: {
          fillColor: [67, 101, 160], // #4365a0
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "left",
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 35, 42],
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: "auto", fontStyle: "bold" },
          2: { cellWidth: 35 },
          3: { cellWidth: 20 },
          4: { cellWidth: 28, halign: "right" },
          5: { cellWidth: 35, halign: "right", fontStyle: "bold", textColor: [35, 80, 30] },
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        didDrawPage: (data) => {
          startY = data.cursor?.y ? data.cursor.y + 6 : startY + 6;
        },
      });

      // Update startY after table finishes
      // @ts-ignore
      startY = (doc as any).lastAutoTable.finalY + 6;
    }
  });

  // --- SECTION: UNSOLD PLAYERS (IF ANY) ---
  if (unsoldPlayers.length > 0) {
    if (startY > pageHeight - 50) {
      doc.addPage();
      startY = 18;
    } else {
      startY += 4;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(139, 38, 53); // Red
    doc.text(`UNSOLD PLAYERS (${unsoldPlayers.length})`, margin, startY);
    startY += 4;

    const unsoldRows = unsoldPlayers.map((p, idx) => {
      const isDummy = p.phone && p.phone.startsWith("90000000");
      const pNum = isDummy ? `#${parseInt(p.phone.slice(8))}` : `#${idx + 1}`;
      const role = p.sportFields?.["role"] || p.sportFields?.["position"] || "-";
      const category = p.category || "-";
      const base = p.baseValue ? `${p.baseValue.toLocaleString()}` : `${auction.minimumBid.toLocaleString()}`;

      return [pNum, p.name, role, category, base, "UNSOLD"];
    });

    autoTable(doc, {
      startY: startY,
      head: [["#", "PLAYER NAME", "ROLE", "GRADE", "BASE PRICE", "STATUS"]],
      body: unsoldRows,
      margin: { left: margin, right: margin },
      theme: "striped",
      headStyles: {
        fillColor: [139, 38, 53],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 35, 42],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: "auto", fontStyle: "bold" },
        2: { cellWidth: 35 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30, halign: "right" },
        5: { cellWidth: 30, halign: "center", fontStyle: "bold", textColor: [180, 40, 50] },
      },
      alternateRowStyles: {
        fillColor: [255, 245, 245],
      },
    });
  }

  // --- FOOTER ON ALL PAGES ---
  // @ts-ignore
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 226, 235);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 150, 160);
    doc.text(
      `${auction.name} • Official Auction Report`,
      margin,
      pageHeight - 6
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 6,
      { align: "right" }
    );
  }

  // Save the PDF
  const sanitizedName = auction.name.replace(/[^a-zA-Z0-9]/g, "_");
  const fileDate = format(new Date(), "yyyyMMdd_HHmm");
  doc.save(`${sanitizedName}_Auction_Report_${fileDate}.pdf`);
}

export async function downloadAuctionPDFById(auction: Auction) {
  const toastId = toast.loading(`Generating PDF Report for ${auction.name}...`);
  try {
    const [players, teams] = await Promise.all([
      auctionClient.getPlayers(auction.id),
      auctionClient.getTeams(auction.id),
    ]);
    exportAuctionPDF(auction, players, teams);
    toast.success("Auction PDF Report downloaded!", { id: toastId });
  } catch (error) {
    toast.error("Failed to generate PDF Report.", { id: toastId });
  }
}
