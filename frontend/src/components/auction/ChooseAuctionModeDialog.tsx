import { useState } from "react";
import { AlertTriangle, ChevronRight, FlaskConical, Globe, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AuctionMode = "trial" | "live";

export function ChooseAuctionModeDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (mode: AuctionMode) => void;
}) {
  const [mode, setMode] = useState<AuctionMode>("trial");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-[0_20px_60px_rgba(10,25,32,0.95)] p-6 sm:p-7">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-black text-[#ffffff] tracking-tight">Start Auction Mode</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-[#f2e9dc]/80 font-medium">Select how you want to run this auction.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-3">
          <button
            type="button"
            onClick={() => setMode("trial")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all cursor-pointer",
              mode === "trial"
                ? "border-[#38bdf8] bg-[#1a3847] text-[#ffffff] shadow-[0_0_25px_rgba(56,189,248,0.4)] ring-2 ring-[#38bdf8]/50 scale-[1.03]"
                : "border-[#38bdf8]/30 bg-[#162a34]/60 text-[#f2e9dc]/70 hover:border-[#38bdf8]/70 hover:bg-[#1a3847]/70 hover:text-[#ffffff]",
            )}
          >
            <FlaskConical className={cn("size-9 transition-colors", mode === "trial" ? "text-[#38bdf8] drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]" : "text-[#808f85]")} />
            <span className="font-black text-sm text-[#ffffff]">Trial / Test Mode</span>
            <span className="text-[11px] text-[#f2e9dc]/80 font-semibold">Safe practice round.</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("live")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all cursor-pointer",
              mode === "live"
                ? "border-emerald-400 bg-emerald-950/80 text-[#ffffff] shadow-[0_0_25px_rgba(16,185,129,0.45)] ring-2 ring-emerald-400/50 scale-[1.03]"
                : "border-[#38bdf8]/30 bg-[#162a34]/60 text-[#f2e9dc]/70 hover:border-emerald-500/70 hover:bg-emerald-950/60 hover:text-[#ffffff]",
            )}
          >
            <Globe className={cn("size-9 transition-colors", mode === "live" ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.7)]" : "text-[#808f85]")} />
            <span className="font-black text-sm text-[#ffffff]">Live Mode</span>
            <span className="text-[11px] text-[#f2e9dc]/80 font-semibold">Official auction round.</span>
          </button>
        </div>

        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/40 bg-amber-500/15 p-3 text-xs text-amber-200 font-medium">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
          <span>Once Live Mode is activated, you cannot switch back to Trial Mode for recorded bids.</span>
        </div>

        <div className="flex gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full py-3 h-auto border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#203f4f] hover:border-[#38bdf8] transition-all font-bold shadow-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-1 size-4" /> Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-full py-3 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30"
            onClick={() => onConfirm(mode)}
          >
            <ChevronRight className="mr-1 size-4" /> Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
