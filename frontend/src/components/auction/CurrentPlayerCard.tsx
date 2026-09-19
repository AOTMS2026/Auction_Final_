import { Check, ChevronDown, ChevronUp, Landmark, Pencil, Undo2, X } from "lucide-react";
import { useState, useEffect } from "react";

import { FallbackImage } from "@/components/ui/fallback-image";
import type { Player } from "@/lib/auction-client";
import { SPORT_CONFIGS } from "@/lib/validations/player";
import type { SportType } from "@/lib/auction-client";

export function CurrentPlayerCard({
  player,
  lotNumber,
  sNo,
  sportType,
  currentBid,
  minBid,
  onBidChange,
  onClear,
  mode,
}: {
  player: Player;
  lotNumber: number;
  sNo?: number | undefined;
  sportType: SportType;
  currentBid: number;
  minBid?: number;
  onBidChange: (value: number) => void;
  onClear: () => void;
  mode: "trial" | "live";
}) {
  const [editingBid, setEditingBid] = useState(false);
  const [tempBid, setTempBid] = useState<string>(currentBid.toString());

  useEffect(() => {
    setTempBid(currentBid.toString());
  }, [currentBid]);
  const config = SPORT_CONFIGS[sportType] || SPORT_CONFIGS["cricket"];

  const tags = [player.sportFields?.["role"], ...config.specs.map((s) => player.sportFields?.[s])].filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0,
  );

  const statsLine = config.stats
    .map((stat) => `${stat[0]}: ${player.sportFields?.[stat] ?? 0}`)
    .join("  |  ");

  const isDummyPhone = player.phone.startsWith("90000000");
  const playerNumber = isDummyPhone ? parseInt(player.phone.slice(8)) : null;
  const displaySNo = sNo ?? playerNumber;

  const handleConfirmBid = () => {
    const val = parseFloat(tempBid);
    if (Number.isFinite(val)) {
      const validBid = minBid !== undefined ? Math.max(minBid, val) : Math.max(0, val);
      onBidChange(validBid);
    }
    setEditingBid(false);
  };

  const handleCancelBid = () => {
    setTempBid(currentBid.toString());
    setEditingBid(false);
  };

  const handleStepBid = (delta: number) => {
    const current = parseFloat(tempBid) || currentBid;
    const nextVal = minBid !== undefined ? Math.max(minBid, current + delta) : Math.max(0, current + delta);
    setTempBid(nextVal.toString());
  };

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
        <div className="mt-3 flex items-center gap-2 w-full shrink-0 select-none">
          {player.age != null && (
            <div className="flex-1 rounded-xl bg-[#142630] border-2 border-[#38bdf8]/40 text-[#ffffff] px-3 py-2 text-center text-sm sm:text-base font-black shadow-sm">
              {player.age} Years
            </div>
          )}
          <div className="flex-1 rounded-xl bg-[#142630] border-2 border-[#38bdf8]/40 text-[#38bdf8] px-3 py-2 text-center text-sm sm:text-base font-black shadow-sm">
            {(() => {
              const g = player.gender?.trim().toLowerCase();
              if (!g) return "Gender: -";
              if (g === "m" || g === "male") return "Gender: Male";
              if (g === "f" || g === "w" || g === "female" || g === "woman" || g === "women") return "Gender: Female";
              return `Gender: ${g.charAt(0).toUpperCase() + g.slice(1)}`;
            })()}
          </div>
        </div>
      </div>

      {/* Right Column: Details & Bid amount */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        {/* Top Details */}
        <div className="space-y-4 sm:space-y-5 flex-1 flex flex-col justify-center overflow-y-auto pr-1">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#38bdf8] uppercase tracking-wide drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
              {displaySNo ? `S.No #${displaySNo}` : `Player Lot #${lotNumber}`}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#ffffff] leading-tight uppercase tracking-tight drop-shadow-md">
              {player.name}
              {displaySNo && (
                <span className="text-[#38bdf8] text-2xl sm:text-3xl lg:text-4xl font-bold ml-3 inline-block">
                  (S.No #{displaySNo})
                </span>
              )}
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            {/* Skill / Role Badge */}
            <span className="rounded-xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] px-4 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base md:text-lg font-black text-white shadow-[0_0_18px_rgba(249,115,22,0.55)] border border-white/30">
              {player.sportFields?.["role"] || "-"}
            </span>
            {/* Category / Grade Badge */}
            <span className="rounded-xl bg-[#142630] border-2 border-[#38bdf8]/60 text-[#38bdf8] px-4 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base md:text-lg font-black shadow-md">
              Grade {player.category || "-"}
            </span>
            {/* Level Badge (Added right after Grade) */}
            <span className="rounded-xl bg-[#142630] border-2 border-[#38bdf8]/60 text-[#a1b5d8] px-4 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base md:text-lg font-black shadow-md">
              Level {player.playerLevel || "-"}
            </span>
            {/* City Name Badge (Green Box) */}
            <span className="rounded-xl bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-300 px-4 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base md:text-lg font-black shadow-md">
              City: {player.city ? (player.city.charAt(0).toUpperCase() + player.city.slice(1)) : "-"}
            </span>
            {/* Additional Spec Badges (Filtered for duplicates) */}
            {config.specs
              .map((spec) => player.sportFields?.[spec])
              .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
              .filter((val) => !player.customData || !player.customData.includes(val))
              .map((val) => (
                <span
                  key={val}
                  className="rounded-xl bg-[#142630] border-2 border-[#38bdf8]/30 px-4 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base md:text-lg font-black text-[#f2e9dc] shadow-md"
                >
                  {val}
                </span>
              ))}
          </div>
          {statsLine && (
            <p className="rounded-xl bg-[#142630]/90 border-2 border-[#38bdf8]/30 px-5 py-2.5 sm:px-6 sm:py-3 text-base sm:text-lg md:text-xl font-black text-[#ffffff] tracking-wide leading-normal shadow-sm">
              {statsLine}
            </p>
          )}
        </div>

        {/* Bottom Bid Section */}
        <div className="mt-4 flex items-center justify-center md:justify-start gap-3 sm:gap-4 border-t border-[#38bdf8]/30 pt-4 shrink-0">
          {/* Gold Coin Icon */}
          <div className="flex size-11 sm:size-13 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] p-0.5 sm:p-1 shadow-[0_0_18px_rgba(245,158,11,0.5)] border-2 border-[#fef08a]">
            <div className="flex size-full items-center justify-center rounded-full border border-[#b45309] bg-gradient-to-b from-[#fbbf24] to-[#d97706]">
              <Landmark className="size-5 sm:size-6 text-[#78350f] stroke-[2.5]" />
            </div>
          </div>

          {editingBid ? (
            <>
              {/* Capsule Stepper Input Box */}
              <div className="relative flex items-center rounded-full border-2 border-[#f97316] bg-[#0c1820] px-4 sm:px-6 py-1.5 sm:py-2 shadow-[0_0_25px_rgba(249,115,22,0.4)] ring-2 ring-[#f97316]/20 transition-all">
                <input
                  type="number"
                  min={minBid ?? 0}
                  autoFocus
                  value={tempBid}
                  onChange={(e) => setTempBid(e.target.value)}
                  className="w-32 sm:w-44 lg:w-52 text-center text-3xl sm:text-4xl lg:text-5xl font-black text-[#f97316] bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none leading-none tracking-tight"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirmBid();
                    if (e.key === "Escape") handleCancelBid();
                  }}
                />
                <div className="flex flex-col items-center justify-center ml-1.5 text-[#38bdf8]">
                  <button
                    type="button"
                    onClick={() => handleStepBid(100)}
                    aria-label="Increase bid"
                    className="text-[#38bdf8] hover:text-[#ffffff] hover:scale-125 transition-transform p-0.5"
                  >
                    <ChevronUp className="size-4 sm:size-5 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepBid(-100)}
                    aria-label="Decrease bid"
                    className="text-[#38bdf8] hover:text-[#ffffff] hover:scale-125 transition-transform p-0.5"
                  >
                    <ChevronDown className="size-4 sm:size-5 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Confirm / Green Check Button */}
              <button
                type="button"
                onClick={handleConfirmBid}
                aria-label="Confirm bid"
                className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                <Check className="size-6 sm:size-7 stroke-[3]" />
              </button>

              {/* Cancel / Close Button */}
              <button
                type="button"
                onClick={handleCancelBid}
                aria-label="Cancel editing"
                className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-[#142630] border-2 border-[#38bdf8]/35 text-[#abb4bd] hover:text-white hover:border-[#38bdf8] hover:bg-[#1a3a4a] shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <X className="size-6 sm:size-7 stroke-[2.5]" />
              </button>
            </>
          ) : (
            <>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#38bdf8] tracking-tight leading-none drop-shadow-[0_0_22px_rgba(56,189,248,0.5)]">
                {currentBid.toLocaleString()}
              </span>
              <div className="flex items-center gap-2 ml-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempBid(currentBid.toString());
                    setEditingBid(true);
                  }}
                  aria-label="Edit bid amount"
                  className="text-[#38bdf8] hover:text-[#ffffff] p-2 hover:bg-[#1a3a4a] rounded-xl transition-all border-2 border-[#38bdf8]/40 hover:border-[#38bdf8]"
                >
                  <Pencil className="size-5 sm:size-6" />
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Reset bid amount"
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 p-2 rounded-xl transition-all border-2 border-rose-500/40 hover:border-rose-500"
                  title="Reset to base price"
                >
                  <Undo2 className="size-5 sm:size-6" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
