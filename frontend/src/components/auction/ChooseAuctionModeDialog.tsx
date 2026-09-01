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
      <DialogContent className="sm:max-w-md rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.9)] p-6 sm:p-7">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-black text-[#fffcf7] tracking-tight">Start Auction Mode</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-[#abb4bd]">Select how you want to run this auction.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-3">
          <button
            type="button"
            onClick={() => setMode("trial")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all cursor-pointer",
              mode === "trial"
                ? "border-[#a1b5d8] bg-[#2e343a]/90 text-[#fffcf7] shadow-[0_0_20px_rgba(161,181,216,0.25)] ring-1 ring-[#a1b5d8]/40 scale-[1.02]"
                : "border-[#5c6875]/30 bg-[#2e343a]/40 text-[#abb4bd] hover:border-[#5c6875]/70 hover:bg-[#2e343a]/70 hover:text-[#fffcf7]",
            )}
          >
            <FlaskConical className={cn("size-8 transition-colors", mode === "trial" ? "text-[#a1b5d8]" : "text-[#8f9ba7]")} />
            <span className="font-extrabold text-sm text-[#fffcf7]">Trial Mode</span>
            <span className="text-[11px] text-[#abb4bd]">Safe practice round.</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("live")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all cursor-pointer",
              mode === "live"
                ? "border-[#c2d8b9] bg-[#23341d]/70 text-[#fffcf7] shadow-[0_0_20px_rgba(194,216,185,0.25)] ring-1 ring-[#c2d8b9]/40 scale-[1.02]"
                : "border-[#5c6875]/30 bg-[#2e343a]/40 text-[#abb4bd] hover:border-[#5c6875]/70 hover:bg-[#2e343a]/70 hover:text-[#fffcf7]",
            )}
          >
            <Globe className={cn("size-8 transition-colors", mode === "live" ? "text-[#c2d8b9]" : "text-[#8f9ba7]")} />
            <span className="font-extrabold text-sm text-[#fffcf7]">Live Mode</span>
            <span className="text-[11px] text-[#abb4bd]">Official auction round.</span>
          </button>
        </div>

        <div className="flex items-start gap-2.5 rounded-2xl border border-[#ffd791]/30 bg-[#643f00]/20 p-3 text-xs text-[#ffd791]">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#ffd791]" />
          <span>Once Live Mode is activated, you cannot switch back to Trial Mode for recorded bids.</span>
        </div>

        <div className="flex gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full py-3 h-auto border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold shadow-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-1 size-4" /> Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-full py-3 h-auto font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_25px_rgba(161,181,216,0.35)] transition-all"
            onClick={() => onConfirm(mode)}
          >
            <ChevronRight className="mr-1 size-4" /> Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
