import { Pencil } from "lucide-react";
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
  mode,
}: {
  player: Player;
  lotNumber: number;
  sportType: SportType;
  currentBid: number;
  onBidChange: (value: number) => void;
  mode: "trial" | "live";
}) {
  const [editingBid, setEditingBid] = useState(false);
  const config = SPORT_CONFIGS[sportType] || SPORT_CONFIGS["cricket"];

  const tags = [player.sportFields?.["role"], ...config.specs.map((s) => player.sportFields?.[s])].filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0,
  );

  const statsLine = config.stats
    .map((stat) => `${stat[0]}:${player.sportFields?.[stat] ?? 0}`)
    .join(" | ");

  return (
    <div className="rounded-2xl border border-border bg-card p-4 card-shadow">
      <div className="flex gap-4">
        <div className="relative shrink-0">
          <div className="relative size-24 overflow-hidden rounded-full border-4 border-background shadow-md">
            <FallbackImage
              src={player.photo || ""}
              alt={player.name}
              className="size-full object-cover"
              fallback={
                <span className="display grid size-full place-items-center bg-brand/10 text-2xl font-bold text-brand">
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
            <div className="mt-2 rounded-full bg-muted px-2 py-1 text-center text-xs font-semibold">
              {player.age} Years
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="truncate text-lg font-bold">
            {lotNumber} | {player.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-brand px-3 py-1.5 text-center text-sm font-semibold text-brand-foreground"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No role set</span>
            )}
          </div>
          {statsLine && <p className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium">{statsLine}</p>}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 border-t border-border pt-4">
        <span className="text-2xl">🪙</span>
        {editingBid ? (
          <Input
            type="number"
            autoFocus
            defaultValue={currentBid}
            className="w-32 text-center text-xl font-bold"
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
          <span className={cn("text-2xl font-bold")}>{currentBid.toLocaleString()}</span>
        )}
        <button
          type="button"
          onClick={() => setEditingBid(true)}
          aria-label="Edit bid amount"
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-4" />
        </button>
      </div>
    </div>
  );
}
