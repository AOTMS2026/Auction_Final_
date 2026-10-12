import { useState, useMemo } from "react";
import { 
  Gavel, X, Search, Trophy, Users, Award, 
  Clock, DollarSign, Filter, Sparkles, CheckCircle,
  FileSpreadsheet, FileText, ArrowUpDown
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Button } from "@/components/ui/button";
import type { Player, Team, Auction } from "@/lib/auction-client";
import { cn } from "@/lib/utils";

type LiveTrackingRecordModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  teams: Team[];
  auction: Auction;
  onSelectPlayer?: (player: Player) => void;
  isAuctioneer?: boolean;
};

export function LiveTrackingRecordModal({
  open,
  onOpenChange,
  players,
  teams,
  auction,
  onSelectPlayer,
  isAuctioneer = false,
}: LiveTrackingRecordModalProps) {
  const [tab, setTab] = useState<"all" | "sold" | "unsold">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>("ALL");

  const teamsMap = useMemo(() => {
    const map = new Map<string, Team>();
    teams.forEach((t) => map.set(t.id, t));
    return map;
  }, [teams]);

  // Player S.No map
  const playerSNoMap = useMemo(() => {
    const map = new Map<string, number>();
    players.forEach((p, idx) => {
      const isDummy = p.phone?.startsWith("90000000");
      const pNum = isDummy ? parseInt(p.phone.slice(8)) : null;
      map.set(p.id, pNum ?? idx + 1);
    });
    return map;
  }, [players]);

  // Tracked players: either sold or unsold
  const trackedRecords = useMemo(() => {
    return players.filter(
      (p) => p.auctionRoundStatus === "sold" || p.auctionRoundStatus === "unsold" || Boolean(p.teamId && (p.soldPrice ?? 0) > 0)
    );
  }, [players]);

  const soldRecords = useMemo(() => {
    return trackedRecords.filter(
      (p) => p.auctionRoundStatus === "sold" || Boolean(p.teamId && (p.soldPrice ?? 0) > 0)
    );
  }, [trackedRecords]);

  const unsoldRecords = useMemo(() => {
    return trackedRecords.filter(
      (p) => p.auctionRoundStatus === "unsold" && !p.teamId
    );
  }, [trackedRecords]);

  const totalTurnover = useMemo(() => {
    return soldRecords.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
  }, [soldRecords]);

  // Filtered list based on active tab, search, and team filter
  const displayedRecords = useMemo(() => {
    let list = tab === "sold" ? soldRecords : tab === "unsold" ? unsoldRecords : trackedRecords;

    if (selectedTeamFilter !== "ALL") {
      list = list.filter((p) => p.teamId === selectedTeamFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase().replace(/^#/, "");
      list = list.filter((p) => {
        const sNo = String(playerSNoMap.get(p.id) || "");
        const name = p.name?.toLowerCase() || "";
        const role = (p.sportFields?.role || "").toLowerCase();
        const teamName = p.teamId ? (teamsMap.get(p.teamId)?.name || "").toLowerCase() : "";
        return name.includes(q) || sNo === q || role.includes(q) || teamName.includes(q);
      });
    }

    // Sort: most recently updated first
    return [...list].sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [tab, soldRecords, unsoldRecords, trackedRecords, selectedTeamFilter, searchQuery, playerSNoMap, teamsMap]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl h-[88vh] max-h-[900px] flex flex-col rounded-3xl border-2 border-[#38bdf8]/40 bg-[#12222b] text-[#ffffff] shadow-[0_25px_65px_rgba(10,25,35,0.95)] p-5 sm:p-7 select-none overflow-hidden">
        <DialogHeader className="shrink-0 pb-3 border-b border-[#38bdf8]/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-gradient-to-tr from-[#ea580c] to-[#38bdf8] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                  <Gavel className="size-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    Live Auction Tracking Record
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  </DialogTitle>
                  <p className="text-xs text-[#38bdf8] font-bold mt-0.5">
                    Real-time Sold & Unsold Player Log • Synchronized Across All Devices
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Pills */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
                <CheckCircle className="size-3.5" />
                <span>Sold: {soldRecords.length}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
                <X className="size-3.5" />
                <span>Unsold: {unsoldRecords.length}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#142630] border border-[#38bdf8]/50 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-sm hidden md:flex">
                <DollarSign className="size-3.5" />
                <span>Purse: 🪙 {totalTurnover.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tab Selector & Team Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-[#38bdf8]/20">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#0c1820] p-1 rounded-xl border border-[#38bdf8]/30">
              <button
                type="button"
                onClick={() => setTab("all")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5",
                  tab === "all"
                    ? "bg-[#38bdf8] text-[#142630] shadow-[0_0_12px_rgba(56,189,248,0.45)]"
                    : "text-[#abb4bd] hover:text-white"
                )}
              >
                <span>All Tracking Records</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-black">
                  {trackedRecords.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTab("sold")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5",
                  tab === "sold"
                    ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    : "text-emerald-400 hover:text-white"
                )}
              >
                <span>Sold ({soldRecords.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setTab("unsold")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5",
                  tab === "unsold"
                    ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    : "text-rose-400 hover:text-white"
                )}
              >
                <span>Unsold ({unsoldRecords.length})</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#38bdf8]" />
              <Input
                placeholder="Search player, S.No, role, or team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-white placeholder:text-gray-400 focus-visible:ring-[#38bdf8]"
              />
            </div>
          </div>
        </DialogHeader>

        {/* Content Body: Scrollable Record Cards */}
        <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2.5">
          {displayedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
              <div className="size-16 rounded-2xl bg-[#142630] border-2 border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] mb-3">
                <Gavel className="size-8" />
              </div>
              <h4 className="text-lg font-black text-white">No Auction Tracking Records Yet</h4>
              <p className="text-xs text-[#a1b5d8] mt-1 max-w-sm">
                {searchQuery
                  ? "No matching records found for your search query."
                  : "Players sold or marked unsold during the live auction will appear here in real-time."}
              </p>
            </div>
          ) : (
            displayedRecords.map((player) => {
              const sNo = playerSNoMap.get(player.id);
              const isSold = player.auctionRoundStatus === "sold" || Boolean(player.teamId && (player.soldPrice ?? 0) > 0);
              const team = player.teamId ? teamsMap.get(player.teamId) : null;
              const soldPrice = player.soldPrice ?? 0;

              return (
                <div
                  key={player.id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all gap-3",
                    isSold
                      ? "bg-[#142630]/90 border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      : "bg-[#142630]/90 border-rose-500/40 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  )}
                >
                  {/* Left: Player Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <FallbackImage
                      src={player.photo || ""}
                      alt={player.name}
                      className="size-14 sm:size-16 rounded-xl object-cover object-top border-2 border-[#38bdf8]/60 shrink-0 shadow-md bg-[#0c1820]"
                      fallback={
                        <span className="display grid size-full place-items-center bg-[#0c1820] text-base font-black text-[#38bdf8]">
                          {player.name.slice(0, 2).toUpperCase()}
                        </span>
                      }
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#38bdf8]/20 border border-[#38bdf8]/50 text-[#38bdf8] font-black text-[11px]">
                          S.No #{sNo}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-white truncate max-w-[220px] sm:max-w-[320px]">
                          {player.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#abb4bd] font-semibold mt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white font-bold text-[10px]">
                          {player.sportFields?.role || "Player"}
                        </span>
                        <span>•</span>
                        <span className="text-[#38bdf8] font-bold">Grade {player.category || "-"}</span>
                        {player.age && (
                          <>
                            <span>•</span>
                            <span>{player.age} Yrs</span>
                          </>
                        )}
                        {player.gender && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{player.gender}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Sold TO & Price details or Unsold Status */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#38bdf8]/20">
                    {isSold ? (
                      <div className="flex items-center gap-3">
                        {/* Sold TO Team Badge */}
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                            SOLD TO
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {team?.logo && (
                              <img src={team.logo} alt={team.name} className="size-5 rounded-full object-cover border border-white/40" />
                            )}
                            <span className="text-sm font-black text-white whitespace-nowrap">
                              {team?.name || "Assigned Team"}
                            </span>
                          </div>
                        </div>

                        {/* Sold Price Badge */}
                        <div className="px-3.5 py-2 rounded-xl bg-gradient-to-br from-emerald-950 to-[#0e271d] border-2 border-emerald-500 text-emerald-300 text-right shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          <span className="text-[9px] font-black uppercase text-emerald-400/80 block leading-none">
                            Final Price
                          </span>
                          <span className="text-base sm:text-lg font-black text-emerald-300 leading-none">
                            🪙 {soldPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-rose-950 to-[#2c0e13] border-2 border-rose-500 text-rose-300 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                          <X className="size-4 text-rose-400" />
                          <span>UNSOLD (Pass)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="shrink-0 pt-3 border-t border-[#38bdf8]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#a1b5d8] gap-2">
          <span className="font-bold">
            Total Auctioned Players: <span className="text-white font-black">{trackedRecords.length}</span> of {players.length}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-[#38bdf8]/40 text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#12222b] font-black h-8 px-5"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LiveTrackingRecordModal;
