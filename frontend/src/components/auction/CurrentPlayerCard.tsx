import { Pencil, Undo2 } from "lucide-react";
import { useState } from "react";

import { FallbackImage } from "@/components/ui/fallback-image";
import type { Player } from "@/lib/auction-client";
import { SPORT_CONFIGS } from "@/lib/validations/player";
import type { SportType } from "@/lib/auction-client";

export function CurrentPlayerCard({
  player,
  lotNumber,
  sportType,
  currentBid,
  minBid,
  onBidChange,
  onClear,
  mode,
}: {
  player: Player;
  lotNumber: number;
  sportType: SportType;
  currentBid: number;
  minBid?: number;
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
    <div className="rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/80 backdrop-blur-xl p-4 md:p-6 shadow-[0_15px_45px_rgba(23,26,29,0.8)] flex flex-col md:flex-row gap-6 md:gap-8 h-full overflow-hidden select-none text-[#fffcf7]">
      {/* Left Column: Photo & Age */}
      <div className="w-full md:w-72 lg:w-96 xl:w-[420px] shrink-0 flex flex-col justify-between h-full">
        <div className="relative flex-1 min-h-0 w-full overflow-hidden rounded-2xl border-2 border-[#a1b5d8]/40 shadow-xl bg-[#162235]">
          <FallbackImage
            src={player.photo || ""}
            alt={player.name}
            className="size-full object-cover object-top animate-fade-in"
            fallback={
              <span className="display grid size-full place-items-center bg-[#162235] text-5xl sm:text-6xl font-black text-[#a1b5d8]">
                {player.name.slice(0, 2).toUpperCase()}
              </span>
            }
          />
          {mode === "trial" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="-rotate-12 rounded-xl border border-[#ffd791]/60 bg-[#171a1d]/85 px-4 py-1 text-xs font-black uppercase tracking-widest text-[#ffd791] shadow-lg">
                Trial Mode
              </span>
            </div>
          )}
        </div>
        {player.age != null && (
          <div className="mt-3 rounded-xl bg-[#171a1d]/80 border border-[#5c6875]/30 text-[#abb4bd] px-4 py-2 text-center text-sm sm:text-base font-extrabold w-full shrink-0 select-none">
            {player.age} Years Old
          </div>
        )}
      </div>

      {/* Right Column: Details & Bid amount */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        {/* Top Details */}
<<<<<<< HEAD
        <div className="space-y-4 md:space-y-6 flex-1 flex flex-col justify-center overflow-y-auto pr-1">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-muted-foreground/80 uppercase">
              Player {playerNumber ?? lotNumber}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight uppercase">
              {player.name}
            </h2>
          </div>
=======
        <div className="space-y-4 md:space-y-6 flex-1 overflow-y-auto pr-1">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black flex flex-wrap items-center justify-center md:justify-start gap-2.5 leading-tight text-[#fffcf7]">
            {playerNumber ? (
              <>
                <span className="text-[#a1b5d8]">Player {playerNumber}</span>
                <span className="text-[#5c6875]">•</span>
              </>
            ) : (
              <>
                <span className="text-[#a1b5d8]">Player {lotNumber}</span>
                <span className="text-[#5c6875]">•</span>
              </>
            )}
            <span className="text-[#fffcf7]">{player.name}</span>
          </h2>
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            {/* Skill / Role Badge */}
            <span className="rounded-xl bg-gradient-to-r from-[#6c8cc2] to-[#a1b5d8] px-6 py-3 text-center text-lg sm:text-xl font-black text-[#162235] shadow-lg animate-pulse-subtle">
              {player.sportFields?.["role"] || "-"}
            </span>
            {/* Category / Grade Badge */}
            <span className="rounded-xl bg-[#162235] border border-[#a1b5d8]/40 text-[#a1b5d8] px-6 py-3 text-center text-lg sm:text-xl font-black shadow-md">
              Grade {player.category || "-"}
            </span>
            {/* Dominated Hand Badge */}
            <span className="rounded-xl bg-[#23341d] border border-[#47673a] text-[#c2d8b9] px-6 py-3 text-center text-lg sm:text-xl font-black shadow-md">
              {player.customData ? player.customData.replace("Dominated Hand: ", "") : "-"}
            </span>
            {/* Additional Spec Badges */}
            {config.specs
              .map((spec) => player.sportFields?.[spec])
              .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
              .map((val) => (
                <span
                  key={val}
                  className="rounded-xl bg-[#171a1d]/70 border border-[#5c6875]/30 px-6 py-3 text-center text-lg sm:text-xl font-black text-[#abb4bd] shadow-md"
                >
                  {val}
                </span>
              ))}
          </div>
          {statsLine && (
            <p className="rounded-2xl bg-[#171a1d]/80 border border-[#5c6875]/30 px-6 py-4 text-xl sm:text-2xl font-black text-[#abb4bd] tracking-wide leading-relaxed">
              {statsLine}
            </p>
          )}
        </div>

        {/* Bottom Bid Section */}
        <div className="mt-4 flex items-center justify-center md:justify-start gap-4 border-t border-[#5c6875]/30 pt-4 shrink-0">
          <span className="text-4xl sm:text-5xl">🪙</span>
          {editingBid ? (
            <input
              type="number"
              min={minBid ?? 0}
              autoFocus
              defaultValue={currentBid}
<<<<<<< HEAD
              className="w-60 sm:w-72 md:w-80 lg:w-96 text-center text-5xl sm:text-6xl lg:text-7xl font-black text-orange-500 bg-background h-16 sm:h-20 border-2 border-orange-500/40 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 rounded-xl px-2"
=======
              className="w-48 text-center text-3xl sm:text-4xl font-extrabold h-14 rounded-xl border-[#a1b5d8] bg-[#171a1d] text-[#fffcf7]"
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
              onBlur={(e) => {
                const value = parseFloat(e.target.value);
                if (Number.isFinite(value)) {
                  const validBid = minBid !== undefined ? Math.max(minBid, value) : Math.max(0, value);
                  onBidChange(validBid);
                }
                setEditingBid(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          ) : (
            <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fffcf7] via-[#ecf0f7] to-[#a1b5d8] tracking-tight leading-none drop-shadow-[0_0_25px_rgba(161,181,216,0.35)]">
              {currentBid.toLocaleString()}
            </span>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditingBid(true)}
              aria-label="Edit bid amount"
              className="text-[#abb4bd] hover:text-[#fffcf7] p-2 hover:bg-[#2e343a] rounded-xl transition-all border border-[#5c6875]/40 hover:border-[#a1b5d8]"
            >
              <Pencil className="size-6 sm:size-7" />
            </button>
            <button
              type="button"
              onClick={onClear}
              aria-label="Reset bid amount"
              className="text-red-400 hover:text-red-300 hover:bg-destructive/20 p-2 rounded-xl transition-all border border-red-500/30 hover:border-red-500/60"
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
