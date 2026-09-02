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
    <div className="rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a34]/95 backdrop-blur-xl p-4 md:p-6 shadow-[0_15px_45px_rgba(15,35,45,0.85)] flex flex-col md:flex-row gap-6 md:gap-8 h-full overflow-hidden select-none text-[#ffffff]">
      {/* Left Column: Photo & Age */}
      <div className="w-full md:w-72 lg:w-96 xl:w-[420px] shrink-0 flex flex-col justify-between h-full">
        <div className="relative flex-1 min-h-0 w-full overflow-hidden rounded-2xl border-2 border-[#38bdf8]/60 shadow-2xl bg-[#142630]">
          <FallbackImage
            src={player.photo || ""}
            alt={player.name}
            className="size-full object-cover object-top animate-fade-in"
            fallback={
              <span className="display grid size-full place-items-center bg-[#142630] text-5xl sm:text-6xl font-black text-[#38bdf8]">
                {player.name.slice(0, 2).toUpperCase()}
              </span>
            }
          />
          {mode === "trial" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="-rotate-12 rounded-2xl border-2 border-[#38bdf8] bg-[#142630]/95 px-5 py-2 text-sm font-black uppercase tracking-widest text-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.6)]">
                🧪 Test / Trial Mode
              </span>
            </div>
          )}
          {mode === "live" && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/90 border-2 border-white text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse">
              <span className="size-2 rounded-full bg-white" />
              LIVE
            </div>
          )}
        </div>
        {player.age != null && (
          <div className="mt-3 rounded-xl bg-[#142630] border-2 border-[#38bdf8]/40 text-[#ffffff] px-4 py-2 text-center text-sm sm:text-base font-black w-full shrink-0 select-none shadow-sm">
            {player.age} Years Old
          </div>
        )}
      </div>

      {/* Right Column: Details & Bid amount */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        {/* Top Details */}
        <div className="space-y-4 md:space-y-6 flex-1 flex flex-col justify-center overflow-y-auto pr-1">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#38bdf8] uppercase tracking-wide drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
              Player {playerNumber ?? lotNumber}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#ffffff] leading-tight uppercase tracking-tight drop-shadow-md">
              {player.name}
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            {/* Skill / Role Badge */}
            <span className="rounded-xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] px-6 py-3 text-center text-lg sm:text-xl font-black text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse-subtle border border-white/30">
              {player.sportFields?.["role"] || "-"}
            </span>
            {/* Category / Grade Badge */}
            <span className="rounded-xl bg-[#142630] border-2 border-[#38bdf8]/60 text-[#38bdf8] px-6 py-3 text-center text-lg sm:text-xl font-black shadow-md">
              Grade {player.category || "-"}
            </span>
            {/* Dominated Hand Badge */}
            <span className="rounded-xl bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-300 px-6 py-3 text-center text-lg sm:text-xl font-black shadow-md">
              {player.customData ? player.customData.replace("Dominated Hand: ", "") : "-"}
            </span>
            {/* Additional Spec Badges */}
            {config.specs
              .map((spec) => player.sportFields?.[spec])
              .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
              .map((val) => (
                <span
                  key={val}
                  className="rounded-xl bg-[#142630] border-2 border-[#38bdf8]/30 px-6 py-3 text-center text-lg sm:text-xl font-black text-[#f2e9dc] shadow-md"
                >
                  {val}
                </span>
              ))}
          </div>
          {statsLine && (
            <p className="rounded-2xl bg-[#142630]/90 border-2 border-[#38bdf8]/30 px-6 py-4 text-xl sm:text-2xl font-black text-[#ffffff] tracking-wide leading-relaxed shadow-sm">
              {statsLine}
            </p>
          )}
        </div>

        {/* Bottom Bid Section */}
        <div className="mt-4 flex items-center justify-center md:justify-start gap-4 border-t border-[#38bdf8]/30 pt-4 shrink-0">
          <span className="text-4xl sm:text-5xl">🪙</span>
          {editingBid ? (
            <input
              type="number"
              min={minBid ?? 0}
              autoFocus
              defaultValue={currentBid}
              className="w-60 sm:w-72 md:w-80 lg:w-96 text-center text-5xl sm:text-6xl lg:text-7xl font-black text-[#f97316] bg-[#142630] h-16 sm:h-20 border-2 border-[#38bdf8] focus:border-[#f97316] focus:outline-none focus:ring-4 focus:ring-[#f97316]/20 rounded-2xl px-2 shadow-2xl"
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
            <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#38bdf8] tracking-tight leading-none drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
              {currentBid.toLocaleString()}
            </span>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditingBid(true)}
              aria-label="Edit bid amount"
              className="text-[#38bdf8] hover:text-[#ffffff] p-2 hover:bg-[#1a3a4a] rounded-xl transition-all border-2 border-[#38bdf8]/40 hover:border-[#38bdf8]"
            >
              <Pencil className="size-6 sm:size-7" />
            </button>
            <button
              type="button"
              onClick={onClear}
              aria-label="Reset bid amount"
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 p-2 rounded-xl transition-all border-2 border-rose-500/40 hover:border-rose-500"
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
