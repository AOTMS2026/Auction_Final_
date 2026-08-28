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
}: {
  team: Team;
  stats: ComputedTeamStats;
  selected: boolean;
  onSelect: () => void;
  onViewPlayers?: () => void;
}) {
  const isFull = stats.reservedPlayers <= 0;

  return (
    <div
      onClick={() => {
        if (!isFull) onSelect();
      }}
      className={cn(
        "relative flex w-full items-center gap-2 rounded-lg border bg-card p-1.5 sm:p-2 text-left transition-colors shadow-sm select-none",
        isFull
          ? "border-border opacity-50"
          : selected
            ? "border-green-500 bg-green-500/5 cursor-pointer ring-2 ring-green-500/10"
            : "border-border hover:bg-muted/50 cursor-pointer",
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
      <div className="min-w-0 flex-1 pr-3">
        <p className="truncate text-xs sm:text-sm font-extrabold text-foreground leading-tight">{team.name}</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 font-bold">
          🪙 {formatPoints(stats.availablePoints)}
        </p>
        {isFull ? (
          <p className="text-[9px] font-black text-destructive mt-0.5">Full</p>
        ) : (
          <p className="text-[9px] text-muted-foreground mt-0.5 font-semibold">
            Max: <span className="font-black text-orange-500">{formatPoints(stats.maxBidPoints)}</span>
          </p>
        )}
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
