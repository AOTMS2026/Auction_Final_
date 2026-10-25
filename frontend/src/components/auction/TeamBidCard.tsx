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
        "relative flex w-full items-center gap-3 rounded-2xl border-2 p-3 sm:p-3.5 text-left transition-all shadow-sm select-none",
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
        "flex size-11 sm:size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 shadow-md",
        cannotAfford ? "bg-[#23151a] border-rose-500/60" : "bg-[#142630] border-[#38bdf8]/50"
      )}>
        <FallbackImage
          src={team.logo || ""}
          alt={team.name}
          className="size-full object-cover"
          fallback={<span className={cn("text-xs sm:text-sm font-black", cannotAfford ? "text-rose-400" : "text-[#38bdf8]")}>{team.shortName.slice(0, 3)}</span>}
        />
      </div>
      <div className="min-w-0 flex-1 flex flex-col justify-center space-y-1">
        {/* Row 1: Team Name & View Players Eye Button */}
        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-[13.5px] sm:text-[14.5px] font-black text-[#ffffff] leading-tight drop-shadow-sm tracking-wide" title={team.name}>
            {team.name}
          </p>
          {onViewPlayers && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewPlayers();
              }}
              className="shrink-0 -mr-1 rounded-full p-1 text-[#abb4bd] hover:bg-[#38bdf8]/20 hover:text-[#38bdf8] border border-transparent hover:border-[#38bdf8]/40 transition-all cursor-pointer"
              aria-label="View sold players"
              title="View Bought Players"
            >
              <Eye className="size-3.5" />
            </button>
          )}
        </div>

        {/* Row 2: Purse (Available Points) & Max Bid */}
        <div className="flex items-center justify-between gap-1 text-xs sm:text-[13px] font-bold leading-none">
          <span className={cn("font-black whitespace-nowrap text-[12.5px] sm:text-[13.5px]", cannotAfford ? "text-rose-400" : "text-emerald-400")}>
            🪙 {formatPoints(stats.availablePoints)}
          </span>
          {isFull ? (
            <span className="font-black text-rose-400 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40">
              Full
            </span>
          ) : (
            <span className={cn("whitespace-nowrap text-[11.5px] sm:text-xs", cannotAfford ? "text-rose-400 font-black" : "text-[#f2e9dc]/95")}>
              Max: <span className={cn("font-black", cannotAfford ? "text-rose-400" : "text-emerald-400")}>{formatPoints(stats.maxBidPoints)}</span>
            </span>
          )}
        </div>

        {/* Row 3: Squad Count & Left */}
        <div className="flex items-center justify-between gap-1 text-[11px] sm:text-[12px] font-bold text-[#f2e9dc]/85 leading-none">
          <span className="whitespace-nowrap">
            <span className="text-[#a1b5d8] font-semibold">Squad:</span> <span className="text-[#ffffff] font-black">{stats.totalPlayers}/{stats.totalPlayers + stats.reservedPlayers}</span>
          </span>
          <span className="whitespace-nowrap">
            <span className="text-[#a1b5d8] font-semibold">Left:</span> <span className="text-[#f97316] font-black">{stats.reservedPlayers}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default TeamBidCard;
