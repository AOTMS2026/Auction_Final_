import { Pencil, Undo2 } from "lucide-react";
import { useState } from "react";

import { FallbackImage } from "@/components/ui/fallback-image";
import { Input } from "@/components/ui/input";
import type { Player } from "@/lib/auction-client";
import { SPORT_CONFIGS } from "@/lib/validations/player";
import type { SportType } from "@/lib/auction-client";
import { cn } from "@/lib/utils";

export function CurrentPlayerCard({
  player,
  lotNumber,
  sportType,
  currentBid,
  onBidChange,
  onClear,
  mode,
}: {
  player: Player;
  lotNumber: number;
  sportType: SportType;
  currentBid: number;
  onBidChange: (value: number) => void;
  onClear: () => void;
  mode: "trial" | "live";
}) {
  const [editingBid, setEditingBid] = useState(false);
  const config = SPORT_CONFIGS[sportType] || SPORT_CONFIGS["cricket"];

  const tags = [player.sportFields?.["role"], ...config.specs.map((s) => player.sportFields?.[s])].filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0,
  );

  const statsLine = config.stats
    .map((stat) => `${stat[0]}: ${player.sportFields?.[stat] ?? 0}`)
    .join("  |  ");

  const isDummyPhone = player.phone.startsWith("90000000");
  const playerNumber = isDummyPhone ? parseInt(player.phone.slice(8)) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 md:p-6 card-shadow flex flex-col md:flex-row gap-6 md:gap-8 h-full overflow-hidden select-none">
      {/* Left Column: Photo & Age */}
      <div className="w-full md:w-72 lg:w-96 xl:w-[420px] shrink-0 flex flex-col justify-between h-full">
        <div className="relative flex-1 min-h-0 w-full overflow-hidden rounded-2xl border-4 border-background shadow-md">
          <FallbackImage
            src={player.photo || ""}
            alt={player.name}
            className="size-full object-cover object-top animate-fade-in"
            fallback={
              <span className="display grid size-full place-items-center bg-brand/10 text-5xl sm:text-6xl font-bold text-brand">
                {player.name.slice(0, 2).toUpperCase()}
              </span>
            }
          />
          {mode === "trial" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="-rotate-12 rounded border-2 border-muted-foreground/60 bg-background/70 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                Trial
              </span>
            </div>
          )}
        </div>
        {player.age != null && (
          <div className="mt-2.5 rounded-lg bg-muted px-4 py-1.5 text-center text-sm sm:text-base font-extrabold w-full shrink-0 select-none">
            {player.age} Years Old
          </div>
        )}
      </div>

      {/* Right Column: Details & Bid amount */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        {/* Top Details */}
        <div className="space-y-4 md:space-y-6 flex-1 overflow-y-auto pr-1">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black flex flex-wrap items-center justify-center md:justify-start gap-2.5 leading-tight">
            {playerNumber ? (
              <>
                <span className="text-muted-foreground/80">Player {playerNumber}</span>
                <span className="text-muted-foreground/30">•</span>
              </>
            ) : (
              <>
                <span className="text-muted-foreground/80">Player {lotNumber}</span>
                <span className="text-muted-foreground/30">•</span>
              </>
            )}
            <span className="text-foreground">{player.name}</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            {/* Skill / Role Badge */}
            <span className="rounded-lg bg-brand px-6 py-3 text-center text-lg sm:text-xl font-black text-brand-foreground shadow-md animate-pulse-subtle">
              {player.sportFields?.["role"] || "-"}
            </span>
            {/* Category / Grade Badge */}
            <span className="rounded-lg bg-orange-100 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-orange-600 dark:text-orange-400 px-6 py-3 text-center text-lg sm:text-xl font-black shadow-md">
              Grade {player.category || "-"}
            </span>
            {/* Dominated Hand Badge */}
            <span className="rounded-lg bg-blue-100 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 px-6 py-3 text-center text-lg sm:text-xl font-black shadow-md">
              {player.customData ? player.customData.replace("Dominated Hand: ", "") : "-"}
            </span>
            {/* Additional Spec Badges */}
            {config.specs
              .map((spec) => player.sportFields?.[spec])
              .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
              .map((val) => (
                <span
                  key={val}
                  className="rounded-lg bg-muted border border-border px-6 py-3 text-center text-lg sm:text-xl font-black text-muted-foreground shadow-md"
                >
                  {val}
                </span>
              ))}
          </div>
          {statsLine && (
            <p className="rounded-lg bg-muted px-6 py-4 text-xl sm:text-2xl font-black text-muted-foreground tracking-wide leading-relaxed">
              {statsLine}
            </p>
          )}
        </div>

        {/* Bottom Bid Section */}
        <div className="mt-4 flex items-center justify-center md:justify-start gap-4 border-t border-border pt-4 shrink-0">
          <span className="text-4xl sm:text-5xl">🪙</span>
          {editingBid ? (
            <Input
              type="number"
              autoFocus
              defaultValue={currentBid}
              className="w-48 text-center text-3xl sm:text-4xl font-extrabold h-14"
              onBlur={(e) => {
                const value = parseFloat(e.target.value);
                if (Number.isFinite(value)) onBidChange(value);
                setEditingBid(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          ) : (
            <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-orange-500 tracking-tight leading-none">
              {currentBid.toLocaleString()}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setEditingBid(true)}
              aria-label="Edit bid amount"
              className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border"
            >
              <Pencil className="size-6 sm:size-7" />
            </button>
            <button
              type="button"
              onClick={onClear}
              aria-label="Reset bid amount"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors border border-transparent hover:border-border/30"
              title="Reset to base price"
            >
              <Undo2 className="size-6 sm:size-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
