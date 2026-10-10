import { useState, useEffect } from "react";
import { Award, Check, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { Player } from "@/lib/auction-client";
import { cn } from "@/lib/utils";

export const AVAILABLE_GRADES = [
  {
    value: "A+",
    label: "Grade A+",
    desc: "Elite Tier Player",
    color: "from-emerald-500/20 to-emerald-600/30 border-emerald-500 text-emerald-300 ring-emerald-500/40",
    badge: "bg-emerald-500 text-white",
  },
  {
    value: "A",
    label: "Grade A",
    desc: "Prime Top Performer",
    color: "from-sky-500/20 to-blue-600/30 border-sky-400 text-sky-300 ring-sky-400/40",
    badge: "bg-sky-500 text-white",
  },
  {
    value: "B+",
    label: "Grade B+",
    desc: "Strong Star Talent",
    color: "from-purple-500/20 to-indigo-600/30 border-purple-400 text-purple-300 ring-purple-400/40",
    badge: "bg-purple-500 text-white",
  },
  {
    value: "B",
    label: "Grade B",
    desc: "Solid Experienced Pick",
    color: "from-amber-500/20 to-orange-600/30 border-amber-400 text-amber-300 ring-amber-400/40",
    badge: "bg-amber-500 text-white",
  },
  {
    value: "C",
    label: "Grade C",
    desc: "Standard Squad Player",
    color: "from-slate-600/25 to-zinc-700/35 border-slate-400 text-slate-200 ring-slate-400/40",
    badge: "bg-slate-500 text-white",
  },
] as const;

export type GradeType = "A+" | "A" | "B+" | "B" | "C" | "";

interface EditGradeModalProps {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (newGrade: string) => Promise<void>;
  isSaving?: boolean;
}

export function EditGradeModal({
  player,
  open,
  onOpenChange,
  onSave,
  isSaving = false,
}: EditGradeModalProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [savingInternal, setSavingInternal] = useState(false);

  useEffect(() => {
    if (player && open) {
      setSelectedGrade(player.category ? player.category.trim() : "");
    }
  }, [player, open]);

  const handleSelectGrade = (val: string) => {
    setSelectedGrade(val);
  };

  const handleSave = async () => {
    if (!player) return;
    if (!selectedGrade.trim()) {
      toast.error("Please select a Grade (A+, A, B+, B, or C)");
      return;
    }

    setSavingInternal(true);
    try {
      if (onSave) {
        await onSave(selectedGrade.trim());
      }
      toast.success(
        `Grade "${selectedGrade}" assigned to ${player.name} successfully!`
      );
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to save player grade", err);
      toast.error(err?.message || "Failed to update player grade.");
    } finally {
      setSavingInternal(false);
    }
  };

  const activeSaving = isSaving || savingInternal;

  if (!player) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-[0_20px_60px_rgba(10,25,32,0.95)] p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-black text-[#ffffff] flex items-center gap-2">
            <Award className="size-6 text-[#38bdf8]" />
            <span>Assign Player Grade</span>
          </DialogTitle>
        </DialogHeader>

        {/* Player Snapshot Info */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#162a34] border border-[#38bdf8]/30 my-2">
          <div className="size-14 shrink-0 rounded-xl overflow-hidden border-2 border-[#38bdf8]/60 bg-[#142630]">
            <FallbackImage
              src={player.photo || ""}
              alt={player.name}
              className="size-full object-cover object-top"
              fallback={
                <span className="display grid size-full place-items-center bg-[#142630] text-sm font-black text-[#38bdf8]">
                  {player.name.slice(0, 2).toUpperCase()}
                </span>
              }
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-black text-[#ffffff] truncate">
              {player.name}
            </h3>
            <div className="text-xs font-semibold text-[#8f9ba7] flex items-center gap-2 mt-0.5">
              <span>{player.sportFields?.["role"] || player.city || "Player"}</span>
              <span>•</span>
              <span className="text-[#38bdf8]">
                Current:{" "}
                <strong className="text-white font-black">
                  {player.category || "No Grade"}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Grade Selection Grid */}
        <div className="space-y-2 py-2">
          <label className="text-xs font-black uppercase tracking-wider text-[#38bdf8] flex items-center justify-between">
            <span>Choose Grade (A+, A, B+, B, C)</span>
            {selectedGrade && (
              <span className="text-emerald-400 font-bold lowercase text-[11px]">
                Selected: {selectedGrade}
              </span>
            )}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {AVAILABLE_GRADES.map((g) => {
              const isSelected = selectedGrade === g.value;
              return (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => handleSelectGrade(g.value)}
                  disabled={activeSaving}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left cursor-pointer group select-none",
                    isSelected
                      ? cn("bg-gradient-to-r shadow-lg ring-2 ring-offset-2 ring-offset-[#142630]", g.color)
                      : "border-[#38bdf8]/30 bg-[#162a34]/60 hover:bg-[#162a34] hover:border-[#38bdf8]/70 text-[#abb4bd]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "size-8 rounded-xl flex items-center justify-center font-black text-sm shadow-sm",
                        isSelected
                          ? g.badge
                          : "bg-[#142630] text-[#ffffff] border border-[#38bdf8]/40 group-hover:text-[#38bdf8]"
                      )}
                    >
                      {g.value}
                    </span>
                    <div>
                      <div className="text-sm font-black text-white">
                        {g.label}
                      </div>
                      <div className="text-[10px] font-semibold text-[#8f9ba7]">
                        {g.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Clear Option */}
          {selectedGrade && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setSelectedGrade("")}
                className="text-[11px] font-bold text-rose-400/80 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="size-3" /> Clear Grade
              </button>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 gap-2 border-t border-[#38bdf8]/30 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={activeSaving}
            className="rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#203f4f] transition-all font-bold px-6 shadow-sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={activeSaving || !selectedGrade}
            className="rounded-full px-7 py-2.5 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {activeSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin text-white" />
                <span>Saving Grade...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-amber-300" />
                <span>Save Grade</span>
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
