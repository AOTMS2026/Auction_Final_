import { Eye } from "lucide-react";

import { FallbackImage } from "@/components/ui/fallback-image";
import type { Team } from "@/lib/auction-client";
import { formatPoints, type ComputedTeamStats } from "@/lib/team-stats";
import { cn } from "@/lib/utils";

export function TeamBidCard({
  team,
  stats,
  selected,
  currentBid,
  onSelect,
  onViewPlayers,
  draggable,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDragEnd,
  onDrop,
  isDragging,
  isDragOver,
}: {
  team: Team;
  stats: ComputedTeamStats;
  selected: boolean;
  currentBid?: number;
  onSelect: () => void;
  onViewPlayers?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}) {
  const isFull = stats.reservedPlayers <= 0;
  const cannotAfford = currentBid !== undefined && stats.maxBidPoints < currentBid;

  return (
    <div
      onClick={() => {
        if (!isFull) onSelect();
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={cn(
        "relative flex w-full items-center gap-2.5 rounded-2xl border-2 p-2 sm:p-2.5 text-left transition-all shadow-sm select-none",
        draggable && "cursor-grab active:cursor-grabbing",
        isFull
          ? "border-[#38bdf8]/15 bg-[#142630]/40 opacity-40 cursor-not-allowed"
          : selected && cannotAfford
            ? "border-rose-500 bg-[#2d161d] text-[#ffffff] ring-2 ring-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer scale-[1.02]"
            : selected
              ? "border-[#38bdf8] bg-[#1a3a4a] text-[#ffffff] ring-2 ring-[#38bdf8]/50 shadow-[0_0_20px_rgba(56,189,248,0.4)] cursor-pointer scale-[1.02]"
              : cannotAfford
                ? "border-rose-500/40 bg-[#1e171b]/80 text-[#ffffff] hover:border-rose-400 hover:bg-[#281b22] cursor-pointer"
                : "border-[#38bdf8]/30 bg-[#162a34]/90 text-[#ffffff] hover:border-[#38bdf8]/80 hover:bg-[#1a3a4a]/80 cursor-pointer",
        isDragging && "opacity-30 border-dashed border-[#38bdf8] scale-95",
        isDragOver && "border-[#38bdf8] border-2 scale-[1.03] bg-[#1e4456]/40 shadow-lg ring-2 ring-[#38bdf8]/40",
      )}
    >
      <div className={cn(
        "flex size-9 sm:size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 shadow-md",
        cannotAfford ? "bg-[#23151a] border-rose-500/60" : "bg-[#142630] border-[#38bdf8]/50"
      )}>
        <FallbackImage
          src={team.logo || ""}
          alt={team.name}
          className="size-full object-cover"
          fallback={<span className={cn("text-xs font-black", cannotAfford ? "text-rose-400" : "text-[#38bdf8]")}>{team.shortName.slice(0, 3)}</span>}
        />
      </div>
      <div className="min-w-0 flex-1 pr-6">
        <p className="truncate text-xs sm:text-sm font-black text-[#ffffff] leading-tight drop-shadow-sm">{team.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-xs font-bold text-[#38bdf8] truncate">
          <span className={cn("font-black", cannotAfford ? "text-rose-400" : "text-emerald-400")}>🪙 {formatPoints(stats.availablePoints)}</span>
          <span className="text-[#38bdf8]/40 font-normal">•</span>
          {isFull ? (
            <span className="font-black text-rose-400">Full</span>
          ) : (
            <span className={cn(cannotAfford ? "text-rose-400 font-black" : "text-[#f2e9dc]/80")}>
              Max: <span className={cn("font-black", cannotAfford ? "text-rose-400" : "text-emerald-400")}>{formatPoints(stats.maxBidPoints)}</span>
            </span>
          )}
          {cannotAfford && !isFull && (
            <span className="ml-1 px-1 py-0.2 rounded text-[8.5px] font-black bg-rose-500/25 text-rose-300 border border-rose-500/40">
              Low Purse
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] sm:text-[10px] font-bold text-[#f2e9dc]/70 truncate">
          <span>Squad: <span className="text-[#ffffff] font-black">{stats.totalPlayers}/{stats.totalPlayers + stats.reservedPlayers}</span></span>
          <span className="text-[#38bdf8]/40 font-normal">•</span>
          <span>Left: <span className="text-[#f97316] font-black">{stats.reservedPlayers}</span></span>
        </div>
      </div>

      {onViewPlayers && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewPlayers();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#abb4bd] hover:bg-[#2e343a] hover:text-[#fffcf7] border border-transparent hover:border-[#5c6875]/40 transition-colors"
          aria-label="View sold players"
        >
          <Eye className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export default TeamBidCard;
