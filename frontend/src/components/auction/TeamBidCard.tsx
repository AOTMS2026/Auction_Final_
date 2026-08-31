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
        "relative flex w-full items-center gap-2.5 rounded-2xl border p-2 sm:p-2.5 text-left transition-all shadow-sm select-none",
        isFull
          ? "border-[#5c6875]/20 bg-[#171a1d]/40 opacity-40 cursor-not-allowed"
          : selected
            ? "border-[#a1b5d8] bg-[#162235] text-[#fffcf7] ring-2 ring-[#a1b5d8]/40 shadow-[0_0_20px_rgba(161,181,216,0.25)] cursor-pointer"
            : "border-[#5c6875]/30 bg-[#171a1d]/75 text-[#fffcf7] hover:border-[#a1b5d8]/50 hover:bg-[#2e343a]/75 cursor-pointer",
      )}
    >
      <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#162235] border border-[#a1b5d8]/30 shadow-md">
        <FallbackImage
          src={team.logo || ""}
          alt={team.name}
          className="size-full object-cover"
          fallback={<span className="text-xs font-black text-[#a1b5d8]">{team.shortName.slice(0, 3)}</span>}
        />
      </div>
      <div className="min-w-0 flex-1 pr-3">
        <p className="truncate text-xs sm:text-sm font-black text-[#fffcf7] leading-tight">{team.name}</p>
        <p className="text-[10px] sm:text-xs text-[#a1b5d8] mt-0.5 font-bold">
          🪙 {formatPoints(stats.availablePoints)}
        </p>
        {isFull ? (
          <p className="text-[9px] font-black text-red-400 mt-0.5">Full</p>
        ) : (
          <p className="text-[9px] text-[#abb4bd] mt-0.5 font-semibold">
            Max: <span className="font-bold text-[#c2d8b9]">{formatPoints(stats.maxBidPoints)}</span>
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
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#abb4bd] hover:bg-[#2e343a] hover:text-[#fffcf7] transition-colors"
          aria-label="View sold players"
        >
          <Eye className="size-3.5" />
        </button>
      )}
    </div>
  );
}
