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
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6 card-shadow flex flex-col justify-between h-full">
      <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-row gap-6 md:gap-8">
        <div className="relative shrink-0">
          <div className="relative size-44 sm:size-52 overflow-hidden rounded-2xl border-4 border-background shadow-md">
            <FallbackImage
              src={player.photo || ""}
              alt={player.name}
              className="size-full object-cover object-top"
              fallback={
                <span className="display grid size-full place-items-center bg-brand/10 text-4xl sm:text-5xl font-bold text-brand">
                  {player.name.slice(0, 2).toUpperCase()}
                </span>
              }
            />
            {mode === "trial" && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="-rotate-12 rounded border-2 border-muted-foreground/60 bg-background/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                  Trial
                </span>
              </div>
            )}
          </div>
          {player.age != null && (
            <div className="mt-2.5 rounded-lg bg-muted px-3 py-1.5 text-center text-xs sm:text-sm font-bold">
              {player.age} Years Old
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-4 md:space-y-5">
          <h2 className="text-3xl sm:text-4xl font-black flex flex-wrap items-center justify-center md:justify-start gap-2 leading-tight">
            {playerNumber ? (
              <>
                <span className="text-muted-foreground">Player {playerNumber}</span>
                <span className="text-muted-foreground/50">•</span>
              </>
            ) : (
              <>
                <span className="text-muted-foreground">Player {lotNumber}</span>
                <span className="text-muted-foreground/50">•</span>
              </>
            )}
            <span className="text-foreground">{player.name}</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            {/* Skill / Role Badge */}
            <span className="rounded-lg bg-brand px-5 py-2.5 text-center text-base font-extrabold text-brand-foreground shadow-sm animate-pulse-subtle">
              {player.sportFields?.["role"] || "-"}
            </span>
            {/* Category / Grade Badge */}
            <span className="rounded-lg bg-orange-100 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-orange-600 dark:text-orange-400 px-5 py-2.5 text-center text-base font-extrabold shadow-sm">
              Grade {player.category || "-"}
            </span>
            {/* Dominated Hand Badge */}
            <span className="rounded-lg bg-blue-100 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 px-5 py-2.5 text-center text-base font-extrabold shadow-sm">
              {player.customData ? player.customData.replace("Dominated Hand: ", "") : "-"}
            </span>
            {/* Additional Spec Badges */}
            {config.specs
              .map((spec) => player.sportFields?.[spec])
              .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
              .map((val) => (
                <span
                  key={val}
                  className="rounded-lg bg-muted border border-border px-5 py-2.5 text-center text-base font-extrabold text-muted-foreground shadow-sm"
                >
                  {val}
                </span>
              ))}
          </div>
          {statsLine && (
            <p className="rounded-lg bg-muted px-5 py-3 text-base sm:text-lg font-bold text-muted-foreground tracking-wide leading-relaxed">
              {statsLine}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 border-t border-border pt-6">
        <span className="text-3xl sm:text-4xl">🪙</span>
        {editingBid ? (
          <Input
            type="number"
            autoFocus
            defaultValue={currentBid}
            className="w-40 text-center text-2xl sm:text-3xl font-extrabold h-12"
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
          <span className="text-4xl sm:text-5xl font-black text-orange-500 tracking-tight">
            {currentBid.toLocaleString()}
          </span>
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditingBid(true)}
            aria-label="Edit bid amount"
            className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted rounded transition-colors"
          >
            <Pencil className="size-5 sm:size-6" />
          </button>
          <button
            type="button"
            onClick={onClear}
            aria-label="Reset bid amount"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors"
            title="Reset to base price"
          >
            <Undo2 className="size-5 sm:size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
