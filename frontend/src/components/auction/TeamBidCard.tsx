import { Eye } from "lucide-react";
import { FallbackImage } from "@/components/ui/fallback-image";
import { formatPoints, type ComputedTeamStats } from "@/lib/team-stats";
import type { Team } from "@/lib/auction-client";
import { cn } from "@/lib/utils";

export function TeamBidCard({
  team,
  stats,
  selected,
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
  onSelect: () => void;
  onViewPlayers?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}) {
  const isFull = stats.reservedPlayers <= 0;

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
        "relative flex w-full items-center gap-2 rounded-lg border bg-card p-1.5 sm:p-2 text-left transition-all shadow-sm select-none",
        draggable && "cursor-grab active:cursor-grabbing",
        isFull
          ? "border-border opacity-50"
          : selected
            ? "border-green-500 bg-green-500/5 ring-2 ring-green-500/10"
            : "border-border hover:bg-muted/50",
        isDragging && "opacity-30 border-dashed border-primary scale-95",
        isDragOver && "border-primary border-2 scale-[1.03] bg-primary/10 shadow-lg ring-2 ring-primary/20",
      )}
    >
      <div className="flex size-8 sm:size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1e2329] border border-white/5 shadow-sm">
        <FallbackImage
          src={team.logo || ""}
          alt={team.name}
          className="size-full object-cover"
          fallback={<span className="text-xs font-bold text-white/50">{team.shortName.slice(0, 3)}</span>}
        />
      </div>
      <div className="min-w-0 flex-1 pr-5">
        <p className="truncate text-xs sm:text-sm font-extrabold text-foreground leading-tight">{team.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-xs font-bold text-muted-foreground truncate">
          <span>🪙 {formatPoints(stats.availablePoints)}</span>
          <span className="text-muted-foreground/30 font-normal">•</span>
          {isFull ? (
            <span className="font-black text-destructive">Full</span>
          ) : (
            <span>Max: <span className="font-black text-orange-500">{formatPoints(stats.maxBidPoints)}</span></span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] sm:text-[10px] font-bold text-muted-foreground truncate">
          <span>Sold: <span className="text-foreground font-black">{stats.totalPlayers}</span></span>
          <span className="text-muted-foreground/30 font-normal">•</span>
          <span>Left: <span className="text-foreground font-black">{stats.reservedPlayers}</span></span>
        </div>
      </div>

      {onViewPlayers && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewPlayers();
          }}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="View sold players"
        >
          <Eye className="size-3.5" />
        </button>
      )}
    </div>
  );
}
