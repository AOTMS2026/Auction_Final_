import { FallbackImage } from "@/components/ui/fallback-image";
import { formatPoints, type ComputedTeamStats } from "@/lib/team-stats";
import type { Team } from "@/lib/auction-client";
import { cn } from "@/lib/utils";

export function TeamBidCard({
  team,
  stats,
  selected,
  onSelect,
}: {
  team: Team;
  stats: ComputedTeamStats;
  selected: boolean;
  onSelect: () => void;
}) {
  const isFull = stats.reservedPlayers <= 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isFull}
      aria-disabled={isFull}
      className={cn(
        "flex w-56 shrink-0 items-center gap-3 rounded-xl border-2 bg-card p-3 text-left transition-colors",
        isFull
          ? "cursor-not-allowed border-border opacity-50"
          : selected
            ? "border-green-500 bg-green-500/5"
            : "border-border hover:bg-muted/50",
      )}
    >
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1e2329]">
        <FallbackImage
          src={team.logo || ""}
          alt={team.name}
          className="size-full object-cover"
          fallback={<span className="text-sm font-bold text-white/50">{team.shortName.slice(0, 3)}</span>}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{team.name}</p>
        <p className="text-xs text-muted-foreground">
          🪙 {formatPoints(stats.availablePoints)}/{formatPoints(stats.totalPoints)}
        </p>
        {isFull ? (
          <p className="text-xs font-semibold text-destructive">Roster full</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Max Bid: <span className="font-semibold text-orange-500">{formatPoints(stats.maxBidPoints)}</span>
          </p>
        )}
      </div>
    </button>
  );
}
