import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, Gavel, ShieldCheck, Users, Wallet, Pencil, Copy, UserCheck, Share2, ExternalLink, UserPlus, Check, Trophy, Award, Sparkles, FileText, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import stadiumImg from "@/assets/stadium-band.jpg";
import { Countdown } from "@/components/auction/Countdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlayerPreviewCard } from "@/components/auction/PlayerPreviewCard";
import { AboutTab } from "@/components/auction/AboutTab";

import { useTeams } from "@/hooks/useTeams";
import { usePlayers, playersQueryOptions } from "@/hooks/usePlayers";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { computeTeamStats, formatPoints } from "@/lib/team-stats";
import { exportAuctionPDF } from "@/lib/pdf-export";
import type { Player } from "@/lib/auction-client";
import { SiteHeader } from "@/components/site/SiteHeader";
import { auctionDetailQueryOptions, teamsQueryOptions } from "@/lib/queries/auctions";
import { sportTypeLabels, visibilityLabels } from "@/lib/validations/auction";

export const Route = createFileRoute("/_authenticated/auctions/$id")({
  loader: async ({ params, context }) => {
    try {
      const auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.id));
      void Promise.all([
        context.queryClient.prefetchQuery(teamsQueryOptions(params.id)),
        context.queryClient.prefetchQuery(playersQueryOptions(params.id)),
      ]);
      return { auction };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Auction unavailable — PitchBid" }, { name: "robots", content: "noindex" }],
      };
    }
    const { auction } = loaderData;
    const title = `${auction.name} Auction | PitchBid`;
    const description = `${auction.name} — a ${sportTypeLabels[auction.sportType]} player auction on PitchBid.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  pendingComponent: AuctionDetailPending,
  errorComponent: AuctionDetailError,
  notFoundComponent: AuctionNotFound,
  component: AuctionDetailPage,
});

function AuctionDetailError({ error, reset }: { error: any; reset: () => void }) {
  return (
    <div
      className="min-h-screen text-[#fffcf7] flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
      }}
    >
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/80 backdrop-blur-xl p-10 shadow-2xl">
          <h1 className="text-3xl font-black text-[#fffcf7]">Failed to load auction</h1>
          <p className="mt-3 text-[#abb4bd]">
            There was an error loading the auction details. Please check your connection and try again.
          </p>
          <Button
            onClick={() => reset()}
            className="mt-6 rounded-full px-8 py-3 font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-lg"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

function AuctionDetailPending() {
  return (
    <div
      className="min-h-screen text-[#fffcf7] flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
      }}
    >
      <SiteHeader />

      {/* Hero + countdown Skeleton */}
      <section className="relative isolate min-h-[280px]">
        <div className="absolute inset-0 bg-[#171a1d]/85 backdrop-blur-md" />
        <div className="relative mx-auto max-w-4xl px-4 py-12">
          <div className="flex items-center gap-6">
            <Skeleton className="size-24 rounded-3xl bg-[#2e343a]" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-64 rounded-xl bg-[#2e343a]" />
              <Skeleton className="h-4 w-40 rounded-lg bg-[#2e343a]" />
            </div>
          </div>
        </div>
      </section>

      {/* Key facts Skeleton */}
      <section className="mx-auto max-w-4xl px-4 py-12 w-full">
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-3xl bg-[#2e343a]/60" />
          ))}
        </div>
      </section>
    </div>
  );
}

function AuctionNotFound() {
  return (
    <div
      className="min-h-screen text-[#fffcf7] flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
      }}
    >
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/80 backdrop-blur-xl p-10 shadow-2xl">
          <h1 className="text-3xl font-black text-[#fffcf7]">Auction not found</h1>
          <p className="mt-3 text-[#abb4bd]">
            This auction may have finished, been made private, or the link is incorrect. Browse the live and upcoming
            auctions instead.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full px-8 py-3 font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-lg"
          >
            Back to auctions
          </Link>
        </div>
      </div>
    </div>
  );
}

function AuctionDetailPage() {
  const { auction } = Route.useLoaderData();
  useRealtimeUpdates(auction?.id);
  const { players, isPending: playersPending, updatePlayer, isUpdating: playersUpdating } = usePlayers(auction.id);
  const { teams, isPending: teamsPending } = useTeams(auction.id);
  const formatNum = formatPoints;

  const [activeTab, setActiveTab] = useState<"TEAMS" | "PLAYERS" | "MVP" | "SPONSORS" | "LINK" | "ABOUT">("TEAMS");
  const [previewPlayerId, setPreviewPlayerId] = useState<string | null>(null);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  function copyCode() {
    navigator.clipboard.writeText(auction.id);
    toast.success("Auction code copied!");
  }

  function copyUrl(url: string, label: string) {
    navigator.clipboard.writeText(url);
    setCopiedLink(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedLink(null), 2500);
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const playerRegUrl = `${origin}/register-player/${auction.id}`;
  const teamRegUrl = `${origin}/register-team/${auction.id}`;
  const publicAuctionUrl = `${origin}/auctions/${auction.id}`;

  const handleSaveGrade = async (newGrade: string) => {
    if (!editPlayer) return;
    try {
      await updatePlayer({ id: editPlayer.id, patch: { category: newGrade } });
      toast.success("Player grade updated successfully!");
    } catch (err) {
      toast.error("Failed to update player grade.");
    }
  };

  return (
    <div
      className="min-h-screen text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235] flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
      }}
    >
      <SiteHeader />

      {/* Header section with stadium background cover */}
      <section className="relative isolate min-h-[280px] sm:min-h-[320px]">
        <img
          src={stadiumImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171a1d] via-[#171a1d]/80 to-transparent" />
        
        <div className="relative mx-auto max-w-4xl px-4 pt-8">
          <div className="flex items-start gap-4 sm:gap-6">
            <FallbackImage
              src={auction.coverImage || ""}
              alt=""
              className="size-20 rounded-3xl border-2 border-[#a1b5d8]/40 sm:size-28 shadow-2xl object-cover"
              fallback={
                <span className="display grid size-full place-items-center rounded-3xl bg-gradient-to-br from-[#4365a0] to-[#6a9b57] text-2xl sm:text-3xl font-black text-[#fffcf7] shadow-xl">
                  {auction.name.slice(0, 2).toUpperCase()}
                </span>
              }
            />
            <div className="flex-1 text-[#fffcf7]">
              <h1 className="text-2xl font-black sm:text-4xl tracking-tight text-[#fffcf7]">{auction.name}</h1>
              
              <div className="mt-2 space-y-1.5 text-sm sm:text-base">
                <p className="flex items-center gap-2 text-[#abb4bd]">
                  Auction Code: <span className="font-mono text-[#a1b5d8] font-bold bg-[#162235]/60 px-2 py-0.5 rounded-lg border border-[#4365a0]/40">{auction.id.slice(-6)}</span>
                  <button onClick={copyCode} className="hover:text-[#fffcf7] text-[#a1b5d8] transition-colors p-1" aria-label="Copy code">
                    <Copy className="size-4" />
                  </button>
                </p>
                <p className="flex items-center gap-2 text-[#abb4bd]">
                  <CalendarDays className="size-4 text-[#a1b5d8]" />
                  {format(new Date(auction.startsAt), "dd-MM-yyyy, h:mm a")}
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[#abb4bd]">
                  <span className="flex items-center gap-2">
                    <Users className="size-4 text-[#a1b5d8]" /> {auction.playersPerTeam} Player Per Team
                  </span>
                  <span className="flex items-center gap-2">
                    <UserCheck className="size-4 text-[#c2d8b9]" /> {players ? players.length : 0} Registered
                  </span>
                  <Countdown targetDate={auction.startsAt} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-2 font-black">
              <span className="text-xs px-3.5 py-1.5 rounded-xl border border-[#47673a] bg-[#23341d]/70 text-[#e4f0d0] shadow-sm">
                ✨ Free Access
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => {
                  exportAuctionPDF(auction, players || [], teams || []);
                  toast.success("Auction Results PDF Report downloaded!");
                }}
                variant="outline"
                className="rounded-full border border-[#a1b5d8]/40 bg-[#162235]/80 text-[#a1b5d8] hover:bg-[#a1b5d8] hover:text-[#162235] font-bold text-xs gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Download Teams & Purchased Players PDF Report"
              >
                <FileText className="size-4" />
                Auction Results PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-[#171a1d]/90 backdrop-blur-xl border-b border-[#5c6875]/30 sticky top-0 z-30">
        <div className="mx-auto flex max-w-4xl overflow-x-auto px-4 hide-scrollbar">
          {["TEAMS", "PLAYERS", "MVP", "SPONSORS", "LINK", "ABOUT"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`whitespace-nowrap px-5 py-4 text-xs sm:text-sm font-black tracking-wider transition-colors cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-[#a1b5d8] text-[#a1b5d8]"
                  : "text-[#abb4bd] hover:text-[#fffcf7]"
              }`}
            >
              {tab === "TEAMS" && teams ? `TEAMS (${teams.length})` : tab === "PLAYERS" && players ? `PLAYERS (${players.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-10 pb-32 flex-1 w-full">
        {activeTab === "TEAMS" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                onClick={() => {
                  if (!teams || teams.length === 0) {
                    toast.error("No teams found to export.");
                    return;
                  }
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
                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, teamsSheet, "Teams Summary");
                  XLSX.utils.book_append_sheet(workbook, rosterSheet, "Teams Rosters");
                  const cleanTitle = (auction.name || "Tournament").replace(/[^a-zA-Z0-9_-]/g, "_");
                  XLSX.writeFile(workbook, `${cleanTitle}_Teams_Report.xlsx`);
                  toast.success("Teams Excel sheet downloaded successfully!");
                }}
                variant="outline"
                className="gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-600 hover:text-white font-semibold text-xs transition-all shadow-sm"
              >
                <FileSpreadsheet className="size-4 text-emerald-400" /> Export teams Excel
              </Button>
              <Button
                onClick={() => {
                  const url = `${window.location.origin}/register-team/${auction.id}`;
                  navigator.clipboard.writeText(url);
                  toast.success("Team registration link copied to clipboard!");
                }}
                variant="outline"
                className="gap-2 rounded-full border border-[#a1b5d8]/40 bg-[#162235]/70 text-[#a1b5d8] hover:bg-[#a1b5d8]/20 hover:text-[#fffcf7] font-semibold text-xs transition-all shadow-sm"
              >
                <Share2 className="size-4 text-[#a1b5d8]" /> Share Registration Link
              </Button>
            </div>
            {teamsPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-3xl bg-[#2e343a]/60" />
              ))
            ) : teams.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/50 p-10">
                <p className="text-[#abb4bd] font-medium">No teams listed yet.</p>
              </div>
            ) : (
              teams.map((team) => {
                const { totalPoints, totalPlayers, reservedPlayers, usedPoints } = computeTeamStats(
                  team,
                  players,
                  auction,
                );
                const formatNum = formatPoints;

                return (
                  <div
                    key={team.id}
                    className="relative rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-5 shadow-[0_15px_45px_rgba(23,26,29,0.8)] hover:border-[#a1b5d8]/40 transition-all flex flex-col group text-[#fffcf7]"
                  >
                    <div className="flex items-start gap-4 sm:gap-5">
                      {/* Logo */}
                      <div className="shrink-0 size-20 sm:size-24 rounded-2xl bg-[#162235] border border-[#a1b5d8]/30 flex items-center justify-center overflow-hidden shadow-md">
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="size-full object-cover" />
                        ) : (
                          <span className="text-2xl sm:text-3xl font-black text-[#a1b5d8]">{team.shortName.slice(0, 3)}</span>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h3 className="font-black text-lg sm:text-xl text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors truncate">
                              {team.name}
                            </h3>
                            <p className="text-xs font-bold text-[#abb4bd] mt-0.5 uppercase tracking-wider">{team.shortName}</p>
                          </div>
                          
                          {/* Right side Total Points */}
                          <div className="text-right pl-2 shrink-0">
                            <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fffcf7] via-[#ecf0f7] to-[#a1b5d8] leading-none mb-1">
                              {formatNum(totalPoints)}
                            </div>
                            <div className="text-[10px] font-bold text-[#abb4bd] uppercase tracking-wider whitespace-nowrap">Total Points</div>
                          </div>
                        </div>
                        
                        {/* Stats Row */}
                        <div className="flex items-center gap-3 sm:gap-4 mt-3 overflow-x-auto hide-scrollbar">
                          <div>
                            <div className="text-[10px] font-bold text-[#abb4bd] uppercase tracking-wider mb-0.5 whitespace-nowrap">Total Pl</div>
                            <div className="font-black text-sm sm:text-base text-[#fffcf7]">
                              {totalPlayers.toString().padStart(2, '0')} / {auction.playersPerTeam.toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div className="w-px h-6 bg-[#5c6875]/30 shrink-0" />
                          <div>
                            <div className="text-[10px] font-bold text-[#abb4bd] uppercase tracking-wider mb-0.5 whitespace-nowrap">Res. Pl</div>
                            <div className="font-black text-sm sm:text-base text-[#c2d8b9]">{reservedPlayers.toString().padStart(2, '0')}</div>
                          </div>
                          <div className="w-px h-6 bg-[#5c6875]/30 shrink-0" />
                          <div>
                            <div className="text-[10px] font-bold text-[#abb4bd] uppercase tracking-wider mb-0.5 whitespace-nowrap">Used Pts</div>
                            <div className="font-black text-sm sm:text-base text-[#ffd791]">{formatNum(usedPoints)}</div>
                          </div>
                        </div>

                        {/* Bought Players Roster for this Team */}
                        {(() => {
                          const teamBoughtPlayers = (players || []).filter((p) => p.teamId === team.id);
                          if (teamBoughtPlayers.length === 0) return null;
                          return (
                            <div className="mt-4 pt-3.5 border-t border-[#5c6875]/30">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#abb4bd] flex items-center gap-1.5">
                                  <span className="size-2 rounded-full bg-emerald-400" />
                                  Bought Players ({teamBoughtPlayers.length})
                                </span>
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
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "PLAYERS" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                onClick={() => {
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
                    return {
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
                  });
                  const worksheet = XLSX.utils.json_to_sheet(excelRows);
                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, worksheet, "Registered Players");
                  const cleanTitle = (auction.name || "Tournament").replace(/[^a-zA-Z0-9_-]/g, "_");
                  XLSX.writeFile(workbook, `${cleanTitle}_Registered_Players.xlsx`);
                  toast.success("Players Excel sheet downloaded successfully!");
                }}
                variant="outline"
                className="gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-600 hover:text-white font-semibold text-xs transition-all shadow-sm"
              >
                <FileSpreadsheet className="size-4 text-emerald-400" /> Export players Excel
              </Button>
              <Button
                onClick={() => {
                  const url = `${window.location.origin}/register-player/${auction.id}`;
                  navigator.clipboard.writeText(url);
                  toast.success("Player registration link copied to clipboard!");
                }}
                variant="outline"
                className="gap-2 rounded-full border border-[#a1b5d8]/40 bg-[#162235]/70 text-[#a1b5d8] hover:bg-[#a1b5d8]/20 hover:text-[#fffcf7] font-semibold text-xs transition-all shadow-sm"
              >
                <Share2 className="size-4 text-[#a1b5d8]" /> Share Registration Link
              </Button>
            </div>
            {playersPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-3xl bg-[#2e343a]/60" />
              ))
            ) : players.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/50 p-10">
                <p className="text-[#abb4bd] font-medium">No players registered yet.</p>
              </div>
            ) : (
              players.map((player) => {
                const soldTeam = teams?.find((t) => t.id === player.teamId);
                return (
                  <div
                    key={player.id}
                    className="relative flex items-center gap-4 sm:gap-5 rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-4 sm:p-5 shadow-[0_15px_45px_rgba(23,26,29,0.8)] hover:border-[#a1b5d8]/50 hover:bg-[#2e343a]/90 transition-all group text-[#fffcf7]"
                  >
                    <PlayerPreviewCard
                      player={player}
                      open={previewPlayerId === player.id}
                      onOpenChange={(open) => !open && setPreviewPlayerId(null)}
                      trigger={
                        <button 
                          className="flex flex-1 items-center gap-4 sm:gap-5 text-left hover:opacity-90 transition-opacity min-w-0 pr-4 cursor-pointer"
                          onClick={() => setPreviewPlayerId(player.id)}
                        >
                          <FallbackImage
                            src={player.photo || ""}
                            alt={player.name}
                            className="size-14 sm:size-16 rounded-2xl border-2 border-[#a1b5d8]/40 shrink-0 object-cover object-top shadow-md group-hover:border-[#a1b5d8]/70 transition-colors"
                            fallback={
                              <span className="display grid size-full place-items-center rounded-2xl bg-[#162235] text-xl font-black text-[#a1b5d8]">
                                {player.name.slice(0, 2).toUpperCase()}
                              </span>
                            }
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h3 className="font-black text-lg sm:text-xl text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors truncate">
                                {player.name}
                              </h3>
                              {soldTeam ? (
                                <span className="px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>SOLD: {soldTeam.name}</span>
                                  <span className="text-emerald-200">({player.soldPrice ? formatPoints(player.soldPrice) : formatPoints(player.baseValue)} pts)</span>
                                </span>
                              ) : player.teamId ? (
                                <span className="px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold">
                                  SOLD ({player.soldPrice ? formatPoints(player.soldPrice) : ""} pts)
                                </span>
                              ) : null}
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-[#abb4bd] mt-1 leading-snug flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#162235] border border-[#a1b5d8]/30 text-[#e4f0d0] text-xs font-bold uppercase">
                                {player.sportFields?.["role"] || "-"}
                              </span>
                              <span className="text-[#5c6875]">·</span>
                              <span className="text-[#e3e6e9] font-bold">Grade {player.category || "-"}</span>
                              {(() => {
                                const dh = player.sportFields?.["Dominated Hand"] || (player.customData?.startsWith("Dominated Hand: ") ? player.customData.replace("Dominated Hand: ", "") : (player.customData?.includes("BNI") || player.customData?.includes("Family") ? null : player.customData));
                                if (!dh || dh === "-") return null;
                                return (
                                  <>
                                    <span className="text-[#5c6875]">·</span>
                                    <span className="text-[#c2d8b9] font-bold">{dh}</span>
                                  </>
                                );
                              })()}
                            </p>
                          </div>
                        </button>
                      }
                    />
                  <div className="shrink-0 mr-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditPlayer(player)}
                      className="rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-4 py-2 text-xs shadow-sm gap-1.5"
                    >
                      <Pencil className="size-3 text-[#a1b5d8]" /> Edit Grade
                    </Button>
                  </div>
                </div>
              );
            })
          )}
          </div>
        )}

        {/* Links Tab */}
        {activeTab === "LINK" && (
          <div className="space-y-6">
            {/* Player Registration Link */}
            <div className="rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-6 sm:p-7 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="size-10 rounded-2xl bg-[#162235] border border-[#a1b5d8]/40 flex items-center justify-center shadow-md">
                  <UserPlus className="size-5 text-[#a1b5d8]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#fffcf7]">Player Registration Link</h3>
                  <p className="text-xs sm:text-sm text-[#abb4bd] font-medium">Share this public link with players so they can register for this auction</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                <Input
                  readOnly
                  value={playerRegUrl}
                  className="flex-1 rounded-xl border-[#5c6875]/50 bg-[#171a1d]/90 text-[#a1b5d8] font-mono text-xs sm:text-sm h-11"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyUrl(playerRegUrl, "Player registration link")}
                    className="rounded-xl px-5 h-11 font-bold text-xs bg-[#162235] text-[#a1b5d8] border border-[#4365a0] hover:bg-[#a1b5d8] hover:text-[#162235] transition-all flex items-center gap-1.5"
                  >
                    {copiedLink === "Player registration link" ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copiedLink === "Player registration link" ? "Copied" : "Copy Link"}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl px-4 h-11 border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold text-xs"
                  >
                    <a href={playerRegUrl} target="_blank" rel="noreferrer" aria-label="Open registration page">
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Team Registration Link */}
            <div className="rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-6 sm:p-7 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="size-10 rounded-2xl bg-[#23341d] border border-[#47673a] flex items-center justify-center shadow-md">
                  <ShieldCheck className="size-5 text-[#c2d8b9]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#fffcf7]">Team Registration Link</h3>
                  <p className="text-xs sm:text-sm text-[#abb4bd] font-medium">Share this link with team owners to register their franchise and set team names</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                <Input
                  readOnly
                  value={teamRegUrl}
                  className="flex-1 rounded-xl border-[#5c6875]/50 bg-[#171a1d]/90 text-[#c2d8b9] font-mono text-xs sm:text-sm h-11"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyUrl(teamRegUrl, "Team registration link")}
                    className="rounded-xl px-5 h-11 font-bold text-xs bg-[#23341d] text-[#c2d8b9] border border-[#47673a] hover:bg-[#c2d8b9] hover:text-[#23341d] transition-all flex items-center gap-1.5"
                  >
                    {copiedLink === "Team registration link" ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copiedLink === "Team registration link" ? "Copied" : "Copy Link"}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl px-4 h-11 border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold text-xs"
                  >
                    <a href={teamRegUrl} target="_blank" rel="noreferrer" aria-label="Open team registration page">
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Public Auction Spectator Link */}
            <div className="rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-6 sm:p-7 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="size-10 rounded-2xl bg-[#643f00]/30 border border-[#ffd791]/30 flex items-center justify-center shadow-md">
                  <Share2 className="size-5 text-[#ffd791]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#fffcf7]">Public Auction View Link</h3>
                  <p className="text-xs sm:text-sm text-[#abb4bd] font-medium">Direct public link to share with audience and fans to track players and teams</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                <Input
                  readOnly
                  value={publicAuctionUrl}
                  className="flex-1 rounded-xl border-[#5c6875]/50 bg-[#171a1d]/90 text-[#ffd791] font-mono text-xs sm:text-sm h-11"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyUrl(publicAuctionUrl, "Public auction link")}
                    className="rounded-xl px-5 h-11 font-bold text-xs bg-[#643f00]/30 text-[#ffd791] border border-[#ffd791]/40 hover:bg-[#ffd791] hover:text-[#171a1d] transition-all flex items-center gap-1.5"
                  >
                    {copiedLink === "Public auction link" ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copiedLink === "Public auction link" ? "Copied" : "Copy Link"}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl px-4 h-11 border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold text-xs"
                  >
                    <a href={publicAuctionUrl} target="_blank" rel="noreferrer" aria-label="Open public view page">
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MVP Tab */}
        {activeTab === "MVP" && (
          <div className="space-y-5">
            <div className="rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-2xl bg-[#643f00]/30 border border-[#ffd791]/40 flex items-center justify-center shadow-md">
                  <Trophy className="size-5 text-[#ffd791]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#fffcf7]">Top Rated Players</h3>
                  <p className="text-xs text-[#abb4bd]">Players registered for the upcoming draft</p>
                </div>
              </div>

              {players && players.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {players.slice(0, 6).map((player, idx) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#5c6875]/30 bg-[#171a1d]/60 hover:bg-[#171a1d]/90 transition-all"
                    >
                      <div className="size-7 rounded-xl bg-[#162235] border border-[#a1b5d8]/30 flex items-center justify-center font-black text-xs text-[#a1b5d8] shrink-0">
                        #{idx + 1}
                      </div>
                      <FallbackImage
                        src={player.photo || ""}
                        alt={player.name}
                        className="size-12 rounded-xl object-cover object-top border border-[#a1b5d8]/30 shrink-0"
                        fallback={
                          <span className="display grid size-full place-items-center rounded-xl bg-[#162235] text-xs font-black text-[#a1b5d8]">
                            {player.name.slice(0, 2).toUpperCase()}
                          </span>
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-[#fffcf7] truncate">{player.name}</div>
                        <div className="text-xs text-[#abb4bd] font-medium flex items-center gap-2 mt-0.5">
                          <span className="text-[#a1b5d8]">{player.sportFields?.["role"] || "-"}</span>
                          <span>•</span>
                          <span className="text-[#ffd791]">Grade {player.category || "-"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-sm text-[#abb4bd]">No players currently registered to rank.</p>
              )}
            </div>
          </div>
        )}

        {/* Sponsors Tab */}
        {activeTab === "SPONSORS" && (
          <div className="space-y-5">
            <div className="rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-center text-[#fffcf7]">
              <div className="size-14 mx-auto rounded-3xl bg-[#162235] border border-[#a1b5d8]/40 flex items-center justify-center shadow-lg mb-4">
                <Sparkles className="size-7 text-[#a1b5d8]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#fffcf7]">Official Event Partners</h3>
              <p className="text-sm text-[#abb4bd] max-w-md mx-auto mt-2">
                Proudly supported by community sponsors, team franchises, and league organizers.
              </p>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                {["PitchBid Sports", "League Arena", "ProDraft 2026"].map((partner, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-[#5c6875]/30 bg-[#171a1d]/70 text-center font-bold text-xs text-[#a1b5d8] flex items-center justify-center min-h-[60px]"
                  >
                    {partner}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ABOUT" && (
          <AboutTab auction={auction} teams={teams} players={players} />
        )}
      </main>

      <EditGradeModal
        player={editPlayer}
        open={!!editPlayer}
        onOpenChange={(open) => !open && setEditPlayer(null)}
        onSave={handleSaveGrade}
        isSaving={playersUpdating}
      />
    </div>
  );
}

interface EditGradeModalProps {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newGrade: string) => Promise<void>;
  isSaving: boolean;
}

function EditGradeModal({ player, open, onOpenChange, onSave, isSaving }: EditGradeModalProps) {
  const [grade, setGrade] = useState("");

  useEffect(() => {
    if (player) {
      setGrade(player.category || "");
    }
  }, [player]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(grade);
    onOpenChange(false);
  };

  // Helper variables for BNI
  const isBniAuction = player?.auctionId === "6a8edaddd7ed74151dbafab3";
  
  // Custom Data / Membership
  const initialIsBni = player?.customData?.startsWith("BNI Member");
  const initialIsFamily = player?.customData?.startsWith("Family Member");
  const memberType = initialIsBni ? "bni" : initialIsFamily ? "family" : "";
  
  let chapterName = "";
  let bniName = "";
  let relationship = "";
  let bblSeasons = "";

  if (player?.customData) {
    if (initialIsBni) {
      const match = player.customData.match(/Chapter: ([^|]*)/);
      if (match) chapterName = match[1]?.trim() || "";
      const bblMatch = player.customData.match(/BBL Seasons: ([^|]*)/);
      if (bblMatch) bblSeasons = bblMatch[1]?.trim() || "";
    } else if (initialIsFamily) {
      const match = player.customData.match(/BNI Name: ([^,]*), Chapter: ([^,]*), Rel: ([^|]*)/);
      if (match) {
        bniName = match[1]?.trim() || "";
        chapterName = match[2]?.trim() || "";
        relationship = match[3]?.trim() || "";
      }
      const bblMatch = player.customData.match(/BBL Seasons: ([^|]*)/);
      if (bblMatch) bblSeasons = bblMatch[1]?.trim() || "";
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#fffcf7]">Edit Player Grade</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 py-4 max-h-[70vh] overflow-y-auto px-1">
            {/* Photo Preview */}
            {player?.photo && (
              <div className="sm:col-span-2 flex flex-col items-center justify-center space-y-2 mb-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Player Photo</Label>
                <div className="size-28 rounded-2xl overflow-hidden border-2 border-[#a1b5d8]/40 shadow-md">
                  <img src={player.photo} alt={player.name} className="size-full object-cover object-top" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Name</Label>
              <Input id="edit-name" value={player?.name || ""} disabled className="rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Phone</Label>
              <Input id="edit-phone" value={player?.phone || ""} disabled className="rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-age" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Age</Label>
              <Input id="edit-age" value={player?.age?.toString() || "-"} disabled className="rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80" />
            </div>

            {/* Grade (ENABLED) */}
            <div className="space-y-2 border border-[#a1b5d8]/40 bg-[#162235]/60 p-3 rounded-2xl">
              <Label htmlFor="edit-grade" className="text-[#a1b5d8] font-bold text-xs uppercase tracking-wider">Grade (Editable)</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="edit-grade" className="border-[#a1b5d8]/50 bg-[#171a1d] text-[#fffcf7] rounded-xl focus:ring-[#a1b5d8]">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
                  <SelectItem value="A+" className="hover:bg-[#2e343a]">A+</SelectItem>
                  <SelectItem value="A" className="hover:bg-[#2e343a]">A</SelectItem>
                  <SelectItem value="B+" className="hover:bg-[#2e343a]">B+</SelectItem>
                  <SelectItem value="B" className="hover:bg-[#2e343a]">B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Gender</Label>
              <Select value={player?.gender || ""} disabled>
                <SelectTrigger className="rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80"><SelectValue placeholder="-" /></SelectTrigger>
                <SelectContent className="rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-city" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">City</Label>
              <Input id="edit-city" value={player?.city || "-"} disabled className="rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Player Level</Label>
              <Select value={player?.playerLevel || ""} disabled>
                <SelectTrigger className="rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80"><SelectValue placeholder="-" /></SelectTrigger>
                <SelectContent className="rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-jerseySize" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Jersey Size</Label>
              <Input id="edit-jerseySize" value={player?.jerseySize || "-"} disabled className="rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80" />
            </div>

            {isBniAuction && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-jerseyName" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Jersey Name</Label>
                  <Input id="edit-jerseyName" value={player?.jerseyName || "-"} disabled className="rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-trouserSize" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Jersey Number</Label>
                  <Input id="edit-trouserSize" value={player?.trouserSize || "-"} disabled className="rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Number of BBL seasons played</Label>
                  <Select value={bblSeasons} disabled>
                    <SelectTrigger className="rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80"><SelectValue placeholder="-" /></SelectTrigger>
                    <SelectContent className="rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <SelectItem key={i} value={String(i)}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {/* BNI Membership Details */}
            {isBniAuction && memberType && (
              <div className="sm:col-span-2 rounded-2xl border border-[#5c6875]/30 p-4 bg-[#2e343a]/40 space-y-3 mt-2 text-[#fffcf7]">
                <h4 className="font-bold text-sm text-[#fffcf7]">Membership Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[#abb4bd] block text-xs">Member Type</span>
                    <span className="font-bold capitalize text-[#a1b5d8]">{memberType} Member</span>
                  </div>
                  <div>
                    <span className="text-[#abb4bd] block text-xs">Chapter Name</span>
                    <span className="font-medium text-[#fffcf7]">{chapterName || "-"}</span>
                  </div>
                  {memberType === "family" && (
                    <>
                      <div>
                        <span className="text-[#abb4bd] block text-xs">BNI Name</span>
                        <span className="font-medium text-[#fffcf7]">{bniName || "-"}</span>
                      </div>
                      <div>
                        <span className="text-[#abb4bd] block text-xs">Relationship</span>
                        <span className="font-medium capitalize text-[#fffcf7]">{relationship || "-"}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Payment screenshot preview for non-BNI */}
            {!isBniAuction && player?.paymentImage && (
              <div className="sm:col-span-2 flex flex-col items-center justify-center space-y-2 mt-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Payment Screenshot</Label>
                <div className="max-w-xs border border-[#5c6875]/40 rounded-2xl overflow-hidden bg-[#171a1d] p-1 shadow-sm">
                  <img 
                    src={player.paymentImage} 
                    alt="Payment screenshot" 
                    className="w-full h-auto object-contain max-h-48 rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => window.open(player.paymentImage!, "_blank")}
                    title="Click to view full screenshot" 
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-6 shadow-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-full px-7 py-2.5 font-black text-xs text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-md"
            >
              {isSaving ? "Saving..." : "Save Grade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
