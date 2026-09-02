import { createFileRoute, Link, notFound, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, Copy, Users, Eye, MoreVertical, Pencil, Trash, Share2, UserCheck, FileText, Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import * as XLSX from "xlsx";

import stadiumImg from "@/assets/stadium-band.jpg";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { auctionClient } from "@/lib/auction-client";
import { auctionDetailQueryOptions, auctionKeys, teamsQueryOptions } from "@/lib/queries/auctions";
import { computeTeamStats, formatPoints } from "@/lib/team-stats";
import { authClient } from "@/lib/auth-client";
import { useTeams } from "@/hooks/useTeams";
import { usePlayers, playersQueryOptions } from "@/hooks/usePlayers";
import { TeamFormModal } from "@/components/auction/TeamFormModal";
import { PlayerFormModal } from "@/components/auction/PlayerFormModal";
import { PlayerPreviewCard } from "@/components/auction/PlayerPreviewCard";
import { ChooseAuctionModeDialog } from "@/components/auction/ChooseAuctionModeDialog";
import { Countdown } from "@/components/auction/Countdown";
import { AboutTab } from "@/components/auction/AboutTab";
import { exportAuctionPDF } from "@/lib/pdf-export";

export const Route = createFileRoute("/_authenticated/my-auctions/$id/")({
  loader: async ({ params, context }) => {
    let auction;
    try {
      auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.id));
    } catch {
      throw notFound();
    }

    const user = await authClient.getCurrentUser();
    const isAdmin = user?.email === "ameen@gmail.com";
    if (!user || (auction.createdBy !== user.id && !isAdmin)) {
      throw redirect({ to: "/my-auctions" });
    }

    void Promise.all([
      context.queryClient.prefetchQuery(teamsQueryOptions(params.id)),
      context.queryClient.prefetchQuery(playersQueryOptions(params.id)),
    ]);

    return { auction };
  },
  component: ManageAuctionPage,
});

const TABS = ["TEAMS", "PLAYERS", "MVP", "SPONSORS", "LINK", "ABOUT"];

function ManageAuctionPage() {
  const { auction } = Route.useLoaderData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("TEAMS");
  const [readinessModalOpen, setReadinessModalOpen] = useState(false);
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const formatNum = formatPoints;

  // Teams logic
  const { teams, isPending: teamsPending, isError: teamsError, deleteTeam } = useTeams(auction.id);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const [editTeamId, setEditTeamId] = useState<string | null>(null);

  // Players logic
  const { players, isPending: playersPending, deletePlayer } = usePlayers(auction.id);
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [editPlayerId, setEditPlayerId] = useState<string | null>(null);
  const [previewPlayerId, setPreviewPlayerId] = useState<string | null>(null);

  function copyCode() {
    navigator.clipboard.writeText(auction.id);
    toast.success("Auction code copied!");
  }

  function handleSharePlayerForm() {
    const url = `${window.location.origin}/register-player/${auction.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Player registration link copied to clipboard!");
  }

  function handleShareTeamForm() {
    const url = `${window.location.origin}/register-team/${auction.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Team registration link copied to clipboard!");
  }

  function handleStartAuction() {
    if (teams.length === 0 || players.length === 0) {
      setReadinessModalOpen(true);
      return;
    }
    setModeDialogOpen(true);
  }

  async function handleConfirmMode(mode: "trial" | "live") {
    setModeDialogOpen(false);
    if (mode === "live") {
      try {
        await auctionClient.update(auction.id, { status: "live" });
        await queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auction.id) });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to start live auction.");
        return;
      }
      // Pass mode explicitly rather than relying on the auctioneer route's
      // loader to see the just-invalidated auction.status in time — that
      // refetch isn't guaranteed to land before the loader reads the cache.
      void navigate({ to: "/my-auctions/$id/auctioneer", params: { id: auction.id }, search: { mode: "live" } });
    } else {
      void navigate({ to: "/my-auctions/$id/auctioneer", params: { id: auction.id }, search: { mode: "trial" } });
    }
  }

  function handleExportPDF() {
    exportAuctionPDF(auction, players || [], teams || []);
    toast.success("Auction PDF Report downloaded!");
  }

  function handleDownloadTeamsExcel() {
    if (!teams || teams.length === 0) {
      toast.error("No teams found to export.");
      return;
    }

    // 1. Teams Summary Sheet
    const teamsSummaryRows = teams.map((t, index) => {
      const { usedPoints, totalPoints, totalPlayers, reservedPlayers, maxBidPoints } = computeTeamStats(
        t,
        players || [],
        auction,
      );
      const teamBought = (players || []).filter((p) => p.teamId === t.id);

      return {
        "S.No": index + 1,
        "Team Name": t.name,
        "Team Code": t.shortName,
        "Owner Name": t.ownerName || "",
        "Owner Phone": t.ownerPhone || "",
        "Total Budget (Points)": totalPoints,
        "Used Points": usedPoints,
        "Remaining Points": totalPoints - usedPoints,
        "Max Next Bid (Points)": maxBidPoints > 0 ? maxBidPoints : 0,
        "Players Bought": teamBought.length,
        "Target Roster Size": auction.playersPerTeam,
        "Reserved Spots": reservedPlayers,
      };
    });

    const teamsSheet = XLSX.utils.json_to_sheet(teamsSummaryRows);
    const colWidths = Object.keys(teamsSummaryRows[0] || {}).map((key) => {
      let maxLen = key.length;
      teamsSummaryRows.forEach((row) => {
        const val = (row as any)[key];
        if (val !== undefined && val !== null) {
          const len = String(val).length;
          if (len > maxLen) maxLen = len;
        }
      });
      return { wch: Math.min(Math.max(maxLen + 3, 10), 35) };
    });
    teamsSheet["!cols"] = colWidths;

    // 2. Team-wise Bought Players Roster Sheet
    const rosterRows: any[] = [];
    teams.forEach((t) => {
      const teamBought = (players || []).filter((p) => p.teamId === t.id);
      if (teamBought.length === 0) {
        rosterRows.push({
          "Team Name": t.name,
          "Team Code": t.shortName,
          "Player S.No": "-",
          "Player Name": "No players bought yet",
          "Phone Number": "-",
          "Role": "-",
          "Grade": "-",
          "Dominated Hand": "-",
          "Sold Price (Points)": "-",
        });
      } else {
        teamBought.forEach((p, pIdx) => {
          rosterRows.push({
            "Team Name": t.name,
            "Team Code": t.shortName,
            "Player S.No": pIdx + 1,
            "Player Name": p.name,
            "Phone Number": p.phone || "",
            "Role": p.sportFields?.["role"] || "-",
            "Grade": p.category || "-",
            "Dominated Hand": p.sportFields?.["Dominated Hand"] || (p.customData?.startsWith("Dominated Hand: ") ? p.customData.replace("Dominated Hand: ", "") : "-"),
            "Sold Price (Points)": p.soldPrice ?? p.baseValue ?? 0,
          });
        });
      }
    });

    const rosterSheet = XLSX.utils.json_to_sheet(rosterRows);
    const rosterWidths = Object.keys(rosterRows[0] || {}).map((key) => {
      let maxLen = key.length;
      rosterRows.forEach((row) => {
        const val = (row as any)[key];
        if (val !== undefined && val !== null) {
          const len = String(val).length;
          if (len > maxLen) maxLen = len;
        }
      });
      return { wch: Math.min(Math.max(maxLen + 3, 10), 35) };
    });
    rosterSheet["!cols"] = rosterWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, teamsSheet, "Teams Summary");
    XLSX.utils.book_append_sheet(workbook, rosterSheet, "Teams Rosters");

    const cleanTitle = (auction.name || "Tournament").replace(/[^a-zA-Z0-9_-]/g, "_");
    XLSX.writeFile(workbook, `${cleanTitle}_Teams_Report.xlsx`);
    toast.success("Teams Excel sheet downloaded successfully!");
  }

  function handleDownloadPlayersExcel() {
    if (!players || players.length === 0) {
      toast.error("No registered players found to export.");
      return;
    }

    const teamMap = new Map((teams || []).map((t) => [t.id, t.name]));

    const excelRows = players.map((p, index) => {
      const role = p.sportFields?.["role"] || "-";
      const dominatedHand =
        p.sportFields?.["Dominated Hand"] ||
        (p.customData?.startsWith("Dominated Hand: ")
          ? p.customData.replace("Dominated Hand: ", "")
          : (p.customData?.includes("BNI") || p.customData?.includes("Family") ? "-" : (p.customData || "-")));

      const soldTeamName = p.teamId ? (teamMap.get(p.teamId) || "Sold") : "Unsold";

      const row: Record<string, any> = {
        "S.No": index + 1,
        "Player Name": p.name || "",
        "Phone Number": p.phone || "",
        "Age": p.age ?? "",
        "Gender": p.gender || "",
        "City": p.city || "",
        "Player Level": p.playerLevel || "",
        "Grade / Category": p.category || "",
        "Playing Position / Role": role,
        "Dominated Hand": dominatedHand,
        "Jersey Size": p.jerseySize || "",
        "Jersey Name": p.jerseyName || "",
        "Jersey Number / Trouser": p.trouserSize || "",
        "Base Value (Points)": p.baseValue ?? 0,
        "Auction Status": p.teamId ? "Sold" : "Unsold",
        "Sold To Team": soldTeamName,
        "Sold Price (Points)": p.soldPrice ?? (p.teamId ? p.baseValue : 0),
        "Payment Mode": p.paymentMode || "",
        "UTR / Ref Number": p.utrNumber || "",
        "Membership / Extra Details": p.customData || "",
        "Registration Date": p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "",
      };

      if (p.sportFields) {
        Object.entries(p.sportFields).forEach(([k, v]) => {
          if (k !== "role" && k !== "Dominated Hand" && k !== "originalPhoto" && v != null && v !== "") {
            row[k] = v;
          }
        });
      }

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    const keys = Object.keys(excelRows[0] || {});
    const colWidths = keys.map((key) => {
      let maxLen = key.length;
      excelRows.forEach((row) => {
        const val = row[key];
        if (val !== undefined && val !== null) {
          const len = String(val).length;
          if (len > maxLen) maxLen = len;
        }
      });
      return { wch: Math.min(Math.max(maxLen + 3, 10), 40) };
    });
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registered Players");

    const cleanTitle = (auction.name || "Tournament").replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${cleanTitle}_Registered_Players.xlsx`;

    XLSX.writeFile(workbook, filename);
    toast.success("Registered players exported to Excel successfully!");
  }

  return (
    <div
      className="min-h-screen text-[#f2e9dc] selection:bg-[#38bdf8] selection:text-[#ffffff]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)",
      }}
    >
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-12 border-b border-[#38bdf8]/35">
        <img
          src={stadiumImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#142630] via-[#142630]/90 to-[#1e3a45]/60" />

        <div className="relative mx-auto max-w-4xl px-4 pt-8">
          <div className="flex items-start gap-4 sm:gap-6">
            <FallbackImage
              src={auction.coverImage || ""}
              alt=""
              className="size-20 rounded-2xl border-2 border-[#38bdf8]/60 sm:size-28 object-cover shadow-xl"
              fallback={
                <span className="display grid size-full place-items-center rounded-2xl bg-gradient-to-br from-[#1e424c] to-[#38bdf8] text-2xl font-black text-[#ffffff] shadow-lg">
                  {auction.name.slice(0, 2).toUpperCase()}
                </span>
              }
            />
            <div className="flex-1 text-[#ffffff]">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#162a32]/95 border-2 border-[#38bdf8]/60 text-[#ffffff] text-[11px] font-black uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                <span className="size-2 rounded-full bg-[#f97316] animate-pulse" />
                Live Tournament
              </div>
              <h1 className="text-2xl font-black sm:text-4xl tracking-tight text-[#ffffff] drop-shadow-md">{auction.name}</h1>

              <div className="mt-2 space-y-1.5 text-sm sm:text-base text-[#f2e9dc]/90">
                <p className="flex items-center gap-2 font-medium">
                  Auction Code: <span className="font-mono text-[#38bdf8] font-black bg-[#162a32] px-2.5 py-0.5 rounded-md border border-[#38bdf8]/50 shadow-sm">{auction.id.slice(-6)}</span>
                  <button onClick={copyCode} className="hover:text-[#38bdf8] text-[#f2e9dc] transition-colors" aria-label="Copy code">
                    <Copy className="size-4" />
                  </button>
                </p>
                <p className="flex items-center gap-2 text-[#f2e9dc]/90 font-medium">
                  <CalendarDays className="size-4 text-[#38bdf8]" />
                  {format(new Date(auction.startsAt), "dd-MM-yyyy, h:mm a")}
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[#f2e9dc]/90 font-medium">
                  <span className="flex items-center gap-2">
                    <Users className="size-4 text-[#38bdf8]" /> {auction.playersPerTeam} Player Per Team
                  </span>
                  <span className="flex items-center gap-2">
                    <UserCheck className="size-4 text-emerald-400" /> {players ? players.length : 0} Registered
                  </span>
                  <Countdown targetDate={auction.startsAt} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-2 font-black text-emerald-300">
              <span className="text-sm px-3.5 py-1 rounded-full bg-[#162a32] border-2 border-emerald-500/50 shadow-sm">✨ Free Tier</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="rounded-full border-2 border-[#38bdf8]/60 bg-[#162a34] text-[#ffffff] hover:bg-[#38bdf8] hover:text-[#ffffff] font-extrabold text-xs gap-1.5 transition-all shadow-sm"
                title="Download Teams & Purchased Players PDF Report"
              >
                <FileText className="size-4 text-[#38bdf8]" />
                Auction Results PDF
              </Button>
              <Button
                onClick={handleStartAuction}
                className="rounded-full px-7 py-2.5 h-auto font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:shadow-[0_0_35px_rgba(249,115,22,0.9)] hover:scale-105 transition-all border border-white/40"
              >
                Start Auction
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Bar */}
      <div className="bg-[#142630]/95 text-[#ffffff] border-b border-[#38bdf8]/35 sticky top-[57px] z-30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl overflow-x-auto px-4 hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-4 text-xs font-black tracking-wider uppercase transition-all ${
                activeTab === tab 
                  ? "border-b-2 border-[#38bdf8] text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" 
                  : "text-[#f2e9dc]/70 hover:text-[#ffffff]"
              }`}
            >
              {tab === "TEAMS" && teams ? `TEAMS (${teams.length})` : tab === "PLAYERS" && players ? `PLAYERS (${players.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-12 pb-32">

        {activeTab === "TEAMS" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                onClick={handleDownloadTeamsExcel}
                variant="outline"
                className="gap-2 rounded-full border-2 border-emerald-500/60 bg-emerald-950/70 text-emerald-300 hover:bg-emerald-600 hover:text-white font-extrabold text-xs transition-all shadow-sm"
              >
                <FileSpreadsheet className="size-4 text-emerald-400" /> Export teams Excel
              </Button>
              <Button
                onClick={handleShareTeamForm}
                variant="outline"
                className="gap-2 rounded-full border-2 border-[#38bdf8]/50 bg-[#162a34] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#ffffff] font-extrabold text-xs transition-all shadow-sm"
              >
                <Share2 className="size-4" /> Share Registration Link
              </Button>
            </div>
            {teamsPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl bg-[#2e343a]/50 border border-[#5c6875]/20" />
              ))
            ) : teamsError ? (
              <div className="rounded-3xl border border-[#5c6875]/40 bg-[#2e343a]/70 p-10 text-center shadow-lg">
                <p className="text-[#abb4bd]">Failed to load teams.</p>
              </div>
            ) : teams.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border-2 border-dashed border-[#5c6875]/40 bg-[#2e343a]/30 p-8">
                <p className="text-[#abb4bd] font-medium">There are no teams listed yet.</p>
                <p className="text-xs text-[#a1b5d8] mt-1.5">Click the + (plus) button below to add your first team.</p>
              </div>
            ) : (
              teams.map((team) => {
                const { usedPoints, totalPoints, totalPlayers, reservedPlayers, maxBidPoints } = computeTeamStats(
                  team,
                  players,
                  auction,
                );
                const formatNum = formatPoints;

                return (
                  <div
                    key={team.id}
                    className="relative rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 sm:p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)] hover:border-[#a1b5d8]/60 hover:shadow-[0_12px_35px_rgba(161,181,216,0.2)] transition-all duration-300 flex flex-col group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <Link
                        to="/my-auctions/$id/teams/$teamId"
                        params={{ id: auction.id, teamId: team.id }}
                        className="shrink-0 size-20 sm:size-24 rounded-2xl bg-[#162235] border border-[#a1b5d8]/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#a1b5d8]/60 transition-colors"
                      >
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="size-full object-cover" />
                        ) : (
                          <span className="text-2xl sm:text-3xl font-black text-[#a1b5d8]">{team.shortName.slice(0, 3)}</span>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link
                              to="/my-auctions/$id/teams/$teamId"
                              params={{ id: auction.id, teamId: team.id }}
                              className="hover:underline"
                            >
                              <h3 className="font-extrabold text-lg sm:text-xl text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors truncate max-w-[150px] sm:max-w-xs">
                                {team.name}
                              </h3>
                            </Link>
                            <p className="text-xs text-[#a1b5d8] mt-0.5 font-bold uppercase tracking-wider">{team.shortName}</p>
                          </div>

                          {/* Right side Total Points */}
                          <div className="text-right pl-2 shrink-0">
                            <div className="text-xl font-black text-[#a1b5d8] leading-none mb-1">{formatNum(totalPoints)}</div>
                            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold whitespace-nowrap">Total Points</div>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-3 sm:gap-4 mt-3 overflow-x-auto hide-scrollbar">
                          <div>
                            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Total Pl</div>
                            <div className="font-extrabold text-sm sm:text-base text-[#fffcf7]">
                              {totalPlayers.toString().padStart(2, '0')} / {auction.playersPerTeam.toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div className="w-px h-6 bg-[#5c6875]/40 shrink-0" />
                          <div>
                            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Res. Pl</div>
                            <div className="font-extrabold text-sm sm:text-base text-[#e3e6e9]">{reservedPlayers.toString().padStart(2, '0')}</div>
                          </div>
                          <div className="w-px h-6 bg-[#5c6875]/40 shrink-0" />
                          <div>
                            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Used Pts</div>
                            <div className="font-extrabold text-sm sm:text-base text-[#c2d8b9]">{formatNum(usedPoints)}</div>
                          </div>
                          <div className="w-px h-6 bg-[#5c6875]/40 shrink-0" />
                          <div>
                            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Max Bid</div>
                            <div className="font-extrabold text-sm sm:text-base text-[#e4f0d0]">{formatNum(maxBidPoints > 0 ? maxBidPoints : 0)}</div>
                          </div>
                        </div>

                        {/* Bought Players Roster for this Team */}
                        {(() => {
                          const teamBoughtPlayers = (players || []).filter((p) => p.teamId === team.id);
                          if (teamBoughtPlayers.length === 0) return null;
                          return (
                            <div className="mt-3.5 pt-3 border-t border-[#5c6875]/30">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#abb4bd] flex items-center gap-1.5">
                                  <span className="size-2 rounded-full bg-emerald-400" />
                                  Bought Players ({teamBoughtPlayers.length})
                                </span>
                                <Link
                                  to="/my-auctions/$id/teams/$teamId"
                                  params={{ id: auction.id, teamId: team.id }}
                                  className="text-[11px] font-bold text-[#a1b5d8] hover:text-[#fffcf7] hover:underline transition-colors"
                                >
                                  View Full Roster →
                                </Link>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {teamBoughtPlayers.map((p) => (
                                  <span
                                    key={p.id}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#162235]/90 border border-[#a1b5d8]/30 text-xs font-semibold text-[#fffcf7]"
                                  >
                                    <span>{p.name}</span>
                                    <span className="text-[10px] font-extrabold text-[#c2d8b9]">
                                      ({p.soldPrice ? formatNum(p.soldPrice) : "Base"} pts)
                                    </span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 rounded-full bg-[#171a1d]/60 text-[#abb4bd] hover:bg-[#a1b5d8]/20 hover:text-[#a1b5d8]">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
                          <DropdownMenuItem onSelect={() => setEditTeamId(team.id)} className="hover:bg-[#2e343a]">
                            <Pencil className="mr-2 size-4 text-[#a1b5d8]" /> Edit team
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive hover:bg-destructive/15" onSelect={() => setTeamToDelete(team.id)}>
                            <Trash className="mr-2 size-4" /> Delete team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
            {editTeamId && (
              <TeamFormModal
                auctionId={auction.id}
                team={teams.find((t) => t.id === editTeamId)}
                open={!!editTeamId}
                onOpenChange={(open) => !open && setEditTeamId(null)}
              />
            )}
            <TeamFormModal auctionId={auction.id} />
          </div>
        )}

        {activeTab === "PLAYERS" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                onClick={handleDownloadPlayersExcel}
                variant="outline"
                className="gap-2 rounded-full border-2 border-emerald-500/60 bg-emerald-950/70 text-emerald-300 hover:bg-emerald-600 hover:text-white font-extrabold text-xs transition-all shadow-sm"
              >
                <FileSpreadsheet className="size-4 text-emerald-400" /> Export players Excel
              </Button>
              <Button
                onClick={handleSharePlayerForm}
                variant="outline"
                className="gap-2 rounded-full border-2 border-[#38bdf8]/50 bg-[#162a34] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#ffffff] font-extrabold text-xs transition-all shadow-sm"
              >
                <Share2 className="size-4" /> Share Registration Link
              </Button>
            </div>
            {playersPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl bg-[#2e343a]/50 border border-[#5c6875]/20" />
              ))
            ) : players.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border-2 border-dashed border-[#5c6875]/40 bg-[#2e343a]/30 p-8">
                <p className="text-[#abb4bd] font-medium">No players added yet.</p>
                <p className="text-xs text-[#a1b5d8] mt-1.5">Click the + (plus) button below to register players.</p>
              </div>
            ) : (
              players.map((player) => {
                const soldTeam = teams?.find((t) => t.id === player.teamId);
                return (
                  <div
                    key={player.id}
                    className="relative flex items-center gap-4 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 sm:p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)] hover:border-[#a1b5d8]/60 hover:shadow-[0_12px_35px_rgba(161,181,216,0.2)] transition-all duration-300 group"
                  >
                    <PlayerPreviewCard
                      player={player}
                      open={previewPlayerId === player.id}
                      onOpenChange={(open) => !open && setPreviewPlayerId(null)}
                      trigger={
                        <button
                          className="flex flex-1 items-center gap-4 sm:gap-5 text-left hover:opacity-90 transition-opacity min-w-0 pr-8"
                          onClick={() => setPreviewPlayerId(player.id)}
                        >
                          <FallbackImage
                            src={player.photo || ""}
                            alt={player.name}
                            className="size-14 sm:size-16 rounded-2xl border-2 border-[#a1b5d8]/40 shrink-0 object-cover object-top shadow-md group-hover:border-[#a1b5d8]/70 transition-colors"
                            fallback={
                              <span className="display grid size-full place-items-center rounded-2xl bg-gradient-to-br from-[#4365a0] to-[#6a9b57] text-2xl font-bold text-[#fffcf7]">
                                {player.name.slice(0, 2).toUpperCase()}
                              </span>
                            }
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h3 className="font-extrabold text-lg sm:text-xl text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors truncate">
                                {player.name}
                              </h3>
                              {soldTeam ? (
                                <span className="px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>SOLD: {soldTeam.name}</span>
                                  <span className="text-emerald-200">({player.soldPrice ? formatNum(player.soldPrice) : formatNum(player.baseValue)} pts)</span>
                                </span>
                              ) : player.teamId ? (
                                <span className="px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold">
                                  SOLD ({player.soldPrice ? formatNum(player.soldPrice) : ""} pts)
                                </span>
                              ) : null}
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-[#a1b5d8] mt-1 leading-snug flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#162235] border border-[#a1b5d8]/30 text-[#e4f0d0] text-xs font-bold uppercase">
                                {player.sportFields?.["role"] || "-"}
                              </span>
                              <span className="text-[#abb4bd]">·</span>
                              <span className="text-[#e3e6e9]">Grade {player.category || "-"}</span>
                              {(() => {
                                const dh = player.sportFields?.["Dominated Hand"] || (player.customData?.startsWith("Dominated Hand: ") ? player.customData.replace("Dominated Hand: ", "") : (player.customData?.includes("BNI") || player.customData?.includes("Family") ? null : player.customData));
                                if (!dh || dh === "-") return null;
                                return (
                                  <>
                                    <span className="text-[#abb4bd]">·</span>
                                    <span className="text-[#c2d8b9]">{dh}</span>
                                  </>
                                );
                              })()}
                            </p>
                          </div>
                        </button>
                      }
                    />
                  <div className="shrink-0 mr-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full size-9 bg-[#171a1d]/60 text-[#abb4bd] hover:bg-[#a1b5d8]/20 hover:text-[#a1b5d8]">
                          <MoreVertical className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
                        <DropdownMenuItem onSelect={() => setEditPlayerId(player.id)} className="hover:bg-[#2e343a]">
                          <Pencil className="mr-2 size-4 text-[#a1b5d8]" /> Edit player
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hover:bg-destructive/15" onSelect={() => setPlayerToDelete(player.id)}>
                          <Trash className="mr-2 size-4" /> Delete player
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
            {/* Only trigger player modal & API image fetch when editing a specific player */}
            {editPlayerId && (
              <PlayerFormModal
                auctionId={auction.id}
                sportType={auction.sportType}
                playersPerTeam={auction.playersPerTeam}
                player={players.find((p) => p.id === editPlayerId)}
                open={!!editPlayerId}
                onOpenChange={(open) => {
                  if (!open) setEditPlayerId(null);
                }}
              />
            )}
            <PlayerFormModal auctionId={auction.id} sportType={auction.sportType} playersPerTeam={auction.playersPerTeam} />
          </div>
        )}

        {activeTab === "ABOUT" && (
          <AboutTab auction={auction} teams={teams} players={players} />
        )}

        {activeTab !== "TEAMS" && activeTab !== "PLAYERS" && activeTab !== "ABOUT" && (
          <div className="py-16 text-center rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/50 p-10">
            <p className="text-[#abb4bd] font-medium text-sm">{activeTab} tab analytics & tools are launching shortly.</p>
          </div>
        )}
      </main>

      {/* Delete Team Dialog */}
      <AlertDialog open={!!teamToDelete} onOpenChange={(o) => !o && setTeamToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#abb4bd]">
              This will delete the team and unassign any players sold to it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-6 shadow-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (teamToDelete) { deleteTeam(teamToDelete); toast.success("Team deleted"); } }}
              className="rounded-full bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Player Dialog */}
      <AlertDialog open={!!playerToDelete} onOpenChange={(o) => !o && setPlayerToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Player?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#abb4bd]">
              This action cannot be undone. If the player was sold, the team's spent budget will be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-6 shadow-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (playerToDelete) { deletePlayer(playerToDelete); toast.success("Player deleted"); } }}
              className="rounded-full bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Readiness Gate Dialog */}
      <AlertDialog open={readinessModalOpen} onOpenChange={setReadinessModalOpen}>
        <AlertDialogContent className="rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
          <AlertDialogHeader>
            <AlertDialogTitle>Auction not ready</AlertDialogTitle>
            <AlertDialogDescription className="text-[#abb4bd]">
              Please add a Team and a player. Then get ready to start your auction!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="rounded-full bg-gradient-to-r from-[#6c8cc2] to-[#a1b5d8] text-[#162235] font-bold">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ChooseAuctionModeDialog open={modeDialogOpen} onOpenChange={setModeDialogOpen} onConfirm={handleConfirmMode} />

      {/* Payment Method Dialog */}
      <AlertDialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <AlertDialogContent className="rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Method</AlertDialogTitle>
            <AlertDialogDescription className="text-[#abb4bd]">
              Integration with payment gateways (Razorpay, Stripe, etc.) will be added here soon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-[#ffffff] font-black shadow-[0_0_20px_rgba(249,115,22,0.6)]">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mobile Sticky Bar in Luminous Blue-Slate & Bright Amber */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#38bdf8]/40 bg-[#142630]/98 backdrop-blur-xl p-4 sm:hidden z-40 shadow-[0_-5px_25px_rgba(10,25,32,0.8)]">
        <div className="mx-auto flex max-w-md gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-full py-3 h-auto font-black text-xs border-2 border-[#38bdf8]/50 bg-[#162a34] text-[#ffffff] hover:bg-[#204554] shadow-sm"
            asChild
          >
            <Link to="/my-auctions/$id/edit" params={{ id: auction.id }}>
              EDIT AUCTION
            </Link>
          </Button>
          <Button
            onClick={handleStartAuction}
            className="flex-1 rounded-full py-3 h-auto font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] border border-white/40"
          >
            START AUCTION
          </Button>
        </div>
      </div>
    </div>
  );
}
