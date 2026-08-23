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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">Choose Auction Mode</DialogTitle>
          <DialogDescription>Select how you want to run this auction.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <button
            type="button"
            onClick={() => setMode("trial")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-colors",
              mode === "trial" ? "border-orange-500 bg-orange-500/5" : "border-border hover:bg-muted/50",
            )}
          >
            <FlaskConical className="size-8 text-orange-500" />
            <span className="font-semibold">Trial Mode</span>
            <span className="text-xs text-muted-foreground">for practice.</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("live")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-colors",
              mode === "live" ? "border-orange-500 bg-orange-500/5" : "border-border hover:bg-muted/50",
            )}
          >
            <Globe className="size-8 text-muted-foreground" />
            <span className="font-semibold">Live Mode</span>
            <span className="text-xs text-muted-foreground">is the official auction.</span>
          </button>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          Once Live Mode is activated, you can't switch back to Trial Mode
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            <X className="mr-1 size-4" /> Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => onConfirm(mode)}
          >
            <ChevronRight className="mr-1 size-4" /> Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
