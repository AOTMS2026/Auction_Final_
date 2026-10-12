import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Gavel,
  RefreshCw,
  Search,
  FileSpreadsheet,
  FileText,
  Users,
  Award,
  Clock,
  Sparkles,
  CheckCircle,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FallbackImage } from "@/components/ui/fallback-image";
import { CurrentPlayerCard } from "@/components/auction/CurrentPlayerCard";
import { TeamBidCard } from "@/components/auction/TeamBidCard";
import { useTeams } from "@/hooks/useTeams";
import { usePlayers, playersQueryOptions } from "@/hooks/usePlayers";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { auctionDetailQueryOptions, teamsQueryOptions } from "@/lib/queries/auctions";
import { authClient } from "@/lib/auth-client";
import { LiveTrackingRecordModal } from "@/components/auction/LiveTrackingRecordModal";
import { computeTeamStats, formatPoints } from "@/lib/team-stats";
import { exportAuctionPDF } from "@/lib/pdf-export";
import { exportCompleteAuctionExcel } from "@/lib/excel-export";
import type { Player, Team } from "@/lib/auction-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/live/$auctionId")({
  ssr: false,
  loader: async ({ params, context }) => {
    let auction;
    try {
      auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.auctionId));
    } catch {
      throw notFound();
    }

    let isAuctioneer = false;
    try {
      const user = await authClient.getCurrentUser();
      const isAdmin = user?.role === "admin" || user?.email === "aotms@aotms.com" || user?.email === "ameen@gmail.com";
      isAuctioneer = Boolean(user && (auction.createdBy === user.id || isAdmin));
    } catch {
      isAuctioneer = false;
    }

    void Promise.all([
      context.queryClient.prefetchQuery(teamsQueryOptions(params.auctionId)),
      context.queryClient.prefetchQuery(playersQueryOptions(params.auctionId)),
    ]);

    return { auction, isAuctioneer };
  },
  component: PublicLiveAuctionPage,
});

function PublicLiveAuctionPage() {
  const { auction, isAuctioneer } = Route.useLoaderData();
  const { teams, isPending: teamsPending } = useTeams(auction.id);
  const { players, isPending: playersPending, refetch: refetchPlayers } = usePlayers(auction.id);

  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [currentBid, setCurrentBid] = useState<number>(auction.minimumBid);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [viewingTeamId, setViewingTeamId] = useState<string | null>(null);
  const [viewingStatusList, setViewingStatusList] = useState<"pending" | "sold" | "unsold" | null>(null);

  // Realtime WebSocket sync for live spectator view
  useRealtimeUpdates(auction.id, {
    enableToasts: true,
    onStageUpdate: (data) => {
      if (data.currentPlayerId !== undefined) setCurrentPlayerId(data.currentPlayerId);
      if (data.currentBid !== undefined) setCurrentBid(data.currentBid);
      if (data.selectedTeamId !== undefined) setSelectedTeamId(data.selectedTeamId);
    },
    onBidUpdate: (data) => {
      if (data.bid !== undefined) setCurrentBid(data.bid);
      if (data.teamId !== undefined) setSelectedTeamId(data.teamId);
    },
    onPlayerSold: () => {
      void refetchPlayers();
    },
    onPlayerUnsold: () => {
      void refetchPlayers();
    },
  });

  const pendingPlayers = players.filter((p) => p.auctionRoundStatus === "pending" || (!p.teamId && p.auctionRoundStatus !== "unsold" && p.auctionRoundStatus !== "sold"));
  const soldPlayers = players.filter((p) => p.auctionRoundStatus === "sold" || !!p.teamId);
  const unsoldPlayers = players.filter((p) => p.auctionRoundStatus === "unsold");

  const soldCount = soldPlayers.length;
  const unsoldCount = unsoldPlayers.length;

  const playerSNoMap = useMemo(() => {
    const map = new Map<string, number>();
    players.forEach((p, idx) => {
      map.set(p.id, idx + 1);
    });
    return map;
  }, [players]);

  const currentPlayer = players.find((p) => p.id === currentPlayerId) ?? null;

  // Spectator fallback: if no player on block yet, pick the first pending player
  useEffect(() => {
    if (!currentPlayerId && pendingPlayers.length > 0) {
      const first = pendingPlayers[0];
      if (first) {
        setCurrentPlayerId(first.id);
        setCurrentBid(first.baseValue && first.baseValue > 0 ? first.baseValue : auction.minimumBid);
      }
    }
  }, [currentPlayerId, pendingPlayers, auction.minimumBid]);

  const teamStatsMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof computeTeamStats>>();
    for (const team of teams) {
      map.set(team.id, computeTeamStats(team, players, auction));
    }
    return map;
  }, [teams, players, auction]);

  const viewingTeam = teams.find((t) => t.id === viewingTeamId);
  const viewingTeamPlayers = players.filter((p) => p.teamId === viewingTeamId);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0b171e] text-[#f2e9dc]">
      {/* Top Header Navbar */}
      <header className="shrink-0 h-16 border-b border-[#38bdf8]/30 bg-[#142630]/95 backdrop-blur-xl px-4 flex items-center justify-between shadow-lg select-none">
        {/* Left Section: Live Badge & Auction Title */}
        <div className="flex items-center gap-3">
          <Link
            to={isAuctioneer ? "/my-auctions/$id" : "/"}
            params={isAuctioneer ? { id: auction.id } : undefined}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#1f3745] text-[#38bdf8] transition-colors"
            title="Return to Overview"
          >
            <div className="size-8 rounded-xl bg-[#38bdf8]/20 flex items-center justify-center font-black text-xs border border-[#38bdf8]/40">
              PB
            </div>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight truncate max-w-[200px] sm:max-w-[320px]">
              {auction.name}
            </h1>
            <span className="px-3 py-1 rounded-full border-2 border-emerald-400 bg-emerald-950 text-emerald-300 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-1.5 animate-pulse whitespace-nowrap">
              <span className="size-2 rounded-full bg-emerald-400" />
              🔴 Live Auction
            </span>
          </div>
        </div>

        {/* Center Section: Founder Ameen Sayyed Side Photo & Middle Information Autoscroll */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-4 hidden md:flex items-center bg-[#0d1c24]/90 border border-[#38bdf8]/40 rounded-full py-1 px-3 shadow-[0_0_20px_rgba(14,165,233,0.25)] overflow-hidden h-11">
          {/* Side Photo: Founder Ameen Sayyed */}
          <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-[#38bdf8]/30">
            <div className="relative size-8 rounded-full p-[2px] bg-gradient-to-tr from-[#ea580c] via-[#38bdf8] to-[#f97316] shadow-[0_0_12px_rgba(56,189,248,0.6)] overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/Ameen_hq.png"
                alt="Founder Ameen Sayyed"
                className="size-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[8.5px] font-black uppercase tracking-wider text-[#38bdf8]">Founder</span>
              <span className="text-[11px] font-black text-white whitespace-nowrap">Ameen Sayyed</span>
            </div>
          </div>

          {/* Middle Information Autoscroll */}
          <div className="flex-1 overflow-hidden relative ml-3">
            <div className="animate-ticker flex items-center gap-8 whitespace-nowrap text-xs font-bold text-[#f2e9dc]/90">
              <span>⭐ Founder: Ameen Sayyed • 🏆 AOTMS Premier Sports Auction Platform • ⚡ Real-Time Live Bidding • 🎯 Empowering Grassroots & Professional Leagues • 🚀 Welcome to {auction.name}!</span>
              <span aria-hidden="true">⭐ Founder: Ameen Sayyed • 🏆 AOTMS Premier Sports Auction Platform • ⚡ Real-Time Live Bidding • 🎯 Empowering Grassroots & Professional Leagues • 🚀 Welcome to {auction.name}!</span>
            </div>
          </div>
        </div>

        {/* Right Section: Action Controls */}
        <div className="flex items-center gap-2">
          {/* Live Tracking Record Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTrackingModalOpen(true)}
            className="h-9 px-3.5 rounded-xl border-2 border-amber-500/60 bg-[#162235] text-amber-300 hover:bg-amber-500 hover:text-[#12222b] flex items-center gap-1.5 text-xs font-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer"
            title="Open Live Tracking Record (Sold & Unsold Player Log)"
          >
            <Gavel className="size-4 text-amber-400" />
            <span className="hidden sm:inline">Tracking Record</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-[10px] font-black">
              {soldCount + unsoldCount}
            </span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportCompleteAuctionExcel(auction, players, teams);
              toast.success("Auction Results Excel sheet downloaded!");
            }}
            className="h-9 px-3.5 rounded-xl border-2 border-emerald-500/60 bg-emerald-950/70 text-emerald-300 hover:bg-emerald-600 hover:text-white flex items-center gap-1.5 text-xs font-black transition-all shadow-sm cursor-pointer"
            title="Download Full Auction Results Excel"
          >
            <FileSpreadsheet className="size-4 text-emerald-400" />
            <span className="hidden sm:inline">Export Excel</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportAuctionPDF(auction, players, teams);
              toast.success("Auction PDF Report downloaded!");
            }}
            className="h-9 px-3.5 rounded-xl border-2 border-[#38bdf8]/60 bg-[#162a34] text-[#ffffff] hover:bg-[#38bdf8] hover:text-[#142630] flex items-center gap-1.5 text-xs font-black transition-all shadow-sm cursor-pointer"
            title="Download Full Auction Summary PDF"
          >
            <FileText className="size-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 min-h-0 w-full px-4 sm:px-6 py-4 flex flex-col lg:flex-row gap-6 mx-auto max-w-[1800px] overflow-hidden">
        {/* Left Column: Player Display */}
        <div className="flex-1 h-full min-w-0 flex flex-col">
          {playersPending || teamsPending ? (
            <Skeleton className="h-full w-full rounded-3xl bg-[#2e343a]/60" />
          ) : currentPlayer ? (
            <CurrentPlayerCard
              player={currentPlayer}
              lotNumber={soldCount + unsoldCount + 1}
              sNo={playerSNoMap.get(currentPlayer.id)}
              sportType={auction.sportType}
              currentBid={currentBid}
              minBid={auction.minimumBid}
              onBidChange={() => {}}
              onClear={() => {}}
              mode="live"
            />
          ) : (
            <div className="rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a34]/90 backdrop-blur-xl p-8 sm:p-12 text-center text-[#f2e9dc] shadow-2xl flex flex-col items-center justify-center gap-5 h-full">
              <div className="size-20 rounded-3xl bg-[#38bdf8]/20 border-2 border-[#38bdf8]/60 flex items-center justify-center text-[#38bdf8] shadow-[0_0_30px_rgba(56,189,248,0.35)] animate-pulse">
                <Gavel className="size-10 stroke-[2.5]" />
              </div>
              <span className="px-3.5 py-1 rounded-full border border-[#38bdf8]/60 bg-[#142630] text-[#38bdf8] text-xs font-black uppercase tracking-wider">
                Live Auction in Progress
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Next Player Entering Stage Shortly
              </h3>
              <p className="text-sm sm:text-base font-semibold text-[#a1b5d8] max-w-md leading-relaxed">
                Stay tuned! The auctioneer is preparing the next lot. All bids, sales, and stats update on your screen in real time with zero refresh.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Button
                  onClick={() => setTrackingModalOpen(true)}
                  className="rounded-2xl px-6 py-3 font-black text-sm text-white bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30"
                >
                  <Gavel className="size-4 mr-2" />
                  View All Sold & Unsold Players
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Teams List (Vertical Grid) */}
        <div className="w-full lg:w-[480px] shrink-0 flex flex-col h-full bg-[#162a34]/90 backdrop-blur-xl border-2 border-[#38bdf8]/40 rounded-3xl p-3.5 shadow-[0_15px_45px_rgba(15,35,45,0.85)] select-none overflow-hidden text-[#ffffff]">
          <div className="shrink-0 border-b border-[#38bdf8]/30 pb-2 mb-2 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#38bdf8] flex items-center gap-2">
              <Users className="size-4 text-[#38bdf8]" />
              <span>Participating Teams</span>
            </h2>
            <span className="text-[10px] text-[#38bdf8] font-black uppercase tracking-wider">
              {teams.length} Teams Competing
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2">
              {teams.map((team) => (
                <TeamBidCard
                  key={team.id}
                  team={team}
                  stats={teamStatsMap.get(team.id) || computeTeamStats(team, players, auction)}
                  selected={selectedTeamId === team.id}
                  onSelect={() => setViewingTeamId(team.id)}
                  onViewPlayers={() => setViewingTeamId(team.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Spectator Arena Bar */}
      <footer className="shrink-0 border-t border-[#38bdf8]/40 bg-[#142630]/98 backdrop-blur-xl p-3 select-none text-[#ffffff]">
        <div className="mx-auto max-w-[1800px] w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/70 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="size-3 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                <span>🔴 LIVE SPECTATOR ARENA</span>
                <span className="text-[10px] text-emerald-300 font-black bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/50">
                  Real-time Zero Refresh Sync Active
                </span>
              </div>
              <p className="text-[11px] text-[#38bdf8] font-bold mt-0.5">
                Live bidding, sold & unsold player tracking updating automatically across all screens.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Button
              onClick={() => setTrackingModalOpen(true)}
              className="h-10 px-5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30 flex items-center gap-2 cursor-pointer"
            >
              <Gavel className="size-4" />
              <span>Open Tracking Record ({soldCount + unsoldCount})</span>
            </Button>

            <button
              type="button"
              onClick={() => setViewingStatusList("sold")}
              className="rounded-xl bg-[#23341d] hover:bg-[#2e4526] h-10 px-4 text-[#c2d8b9] border border-[#47673a] text-xs font-black cursor-pointer shadow-sm hover:scale-105 transition-all"
            >
              Sold {soldCount}
            </button>
            <button
              type="button"
              onClick={() => setViewingStatusList("unsold")}
              className="rounded-xl bg-[#45191f] hover:bg-[#5a2128] h-10 px-4 text-[#fca5a5] border border-[#8b2635] text-xs font-black cursor-pointer shadow-sm hover:scale-105 transition-all"
            >
              Unsold {unsoldCount}
            </button>
            <button
              type="button"
              onClick={() => setViewingStatusList("pending")}
              className="rounded-xl bg-[#162235] hover:bg-[#1d2f4a] h-10 px-4 text-[#a1b5d8] border border-[#4365a0] text-xs font-black cursor-pointer shadow-sm hover:scale-105 transition-all"
            >
              Available {pendingPlayers.length}
            </button>
          </div>
        </div>
      </footer>

      {/* Live Tracking Record Modal */}
      <LiveTrackingRecordModal
        open={trackingModalOpen}
        onOpenChange={setTrackingModalOpen}
        auction={auction}
        players={players}
        teams={teams}
        playerSNoMap={playerSNoMap}
      />

      {/* Team Squad Modal */}
      {viewingTeam && (
        <Dialog open={!!viewingTeam} onOpenChange={() => setViewingTeamId(null)}>
          <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-0 border border-[#5c6875]/40 bg-[#162235] text-[#fffcf7] rounded-3xl overflow-hidden shadow-2xl">
            <DialogHeader className="p-5 pb-3 border-b border-[#5c6875]/30">
              <div className="flex items-center gap-3">
                <FallbackImage
                  src={viewingTeam.logo}
                  alt={viewingTeam.name}
                  fallbackText={viewingTeam.shortName}
                  className="size-12 rounded-2xl object-cover border border-[#a1b5d8]/40 shadow-sm"
                />
                <div>
                  <DialogTitle className="text-xl font-black text-white">{viewingTeam.name}</DialogTitle>
                  <DialogDescription className="text-xs font-semibold text-[#a1b5d8]">
                    {viewingTeamPlayers.length} / {auction.playersPerTeam} Players Acquired • Points Spent:{" "}
                    {formatPoints(viewingTeamPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0))}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
              {viewingTeamPlayers.length === 0 ? (
                <div className="text-center py-10 text-[#abb4bd] font-semibold text-sm">
                  No players purchased by this team yet.
                </div>
              ) : (
                viewingTeamPlayers.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#171a1d]/60 border border-[#5c6875]/30 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <FallbackImage
                        src={p.photo}
                        alt={p.name}
                        fallbackText={p.name}
                        className="size-10 rounded-xl object-cover border border-[#5c6875]/30"
                      />
                      <div>
                        <div className="text-sm font-black text-white">{p.name}</div>
                        <div className="text-[11px] font-bold text-[#a1b5d8]">
                          {p.category} {p.sportFields?.role ? `• ${p.sportFields.role}` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-[#e4f0d0]">{formatPoints(p.soldPrice || 0)} pts</div>
                      <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        Sold
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Viewing Status List Modal (Sold / Unsold / Available) */}
      {viewingStatusList && (
        <Dialog open={!!viewingStatusList} onOpenChange={() => setViewingStatusList(null)}>
          <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-0 border border-[#5c6875]/40 bg-[#162235] text-[#fffcf7] rounded-3xl overflow-hidden shadow-2xl">
            <DialogHeader className="p-5 pb-3 border-b border-[#5c6875]/30 flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-black capitalize text-white">
                  {viewingStatusList} Players ({
                    viewingStatusList === "sold"
                      ? soldCount
                      : viewingStatusList === "unsold"
                      ? unsoldCount
                      : pendingPlayers.length
                  })
                </DialogTitle>
                <DialogDescription className="text-xs font-semibold text-[#a1b5d8]">
                  Live auction player registry
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
              {(viewingStatusList === "sold"
                ? soldPlayers
                : viewingStatusList === "unsold"
                ? unsoldPlayers
                : pendingPlayers
              ).map((p) => {
                const assignedTeam = teams.find((t) => t.id === p.teamId);
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#171a1d]/60 border border-[#5c6875]/30 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <FallbackImage
                        src={p.photo}
                        alt={p.name}
                        fallbackText={p.name}
                        className="size-10 rounded-xl object-cover border border-[#5c6875]/30"
                      />
                      <div>
                        <div className="text-sm font-black text-white">{p.name}</div>
                        <div className="text-[11px] font-bold text-[#a1b5d8]">
                          {p.category} {p.sportFields?.role ? `• ${p.sportFields.role}` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {assignedTeam ? (
                        <div className="text-xs font-black text-[#38bdf8]">{assignedTeam.name}</div>
                      ) : (
                        <div className="text-xs font-black text-[#a1b5d8]">Base: {formatPoints(p.baseValue || 0)}</div>
                      )}
                      <div className="text-sm font-black text-[#e4f0d0]">
                        {p.soldPrice ? `${formatPoints(p.soldPrice)} pts` : viewingStatusList.toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

