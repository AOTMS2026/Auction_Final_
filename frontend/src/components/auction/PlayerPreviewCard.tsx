import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Button } from "@/components/ui/button";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import type { Player } from "@/lib/auction-client";

type PlayerPreviewCardProps = {
  player: Player;
  trigger: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PlayerPreviewCard({ player, trigger, open, onOpenChange }: PlayerPreviewCardProps) {
  // We only fetch the full profile if the dialog is open to save unnecessary requests
  const { data: profile, isLoading } = usePlayerProfile(player.phone, open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0 hidden">
          <DialogTitle>Player Preview</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col">
          {/* Photo Header */}
          <div className="relative aspect-[3/4] w-full bg-muted">
            <FallbackImage
              src={player.photo || ""}
              alt={player.name}
              className="size-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => player.photo && window.open(player.photo, "_blank")}
              fallback={
                <span className="display grid size-full place-items-center bg-brand/10 text-6xl font-bold text-brand">
                  {player.name.slice(0, 2).toUpperCase()}
                </span>
              }
            />
            {/* Gradient Overlay for Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Info over Image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl font-bold leading-tight">{player.name}</h2>
              <p className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-brand-foreground">
                  {player.sportFields?.["role"] || player.category || "Player"}
                </span>
                <span className="opacity-80 text-sm">{player.phone}</span>
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card p-6">
            {open && isLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : profile ? (
              <div className="grid grid-cols-3 gap-4 divide-x divide-border">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-2xl font-bold text-foreground">{profile.stats.joinedAuctions}</div>
                  <div className="text-[10px] uppercase text-muted-foreground mt-1">Auctions</div>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-2xl font-bold text-foreground">{profile.stats.joinedTeams}</div>
                  <div className="text-[10px] uppercase text-muted-foreground mt-1">Teams</div>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-2xl font-bold text-orange-500">{profile.stats.overallASP > 0 ? profile.stats.overallASP : "---"}</div>
                  <div className="text-[10px] uppercase text-muted-foreground mt-1">Avg ASP</div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex gap-3">
              <Button asChild className="w-full">
                <Link to="/players/$phone" params={{ phone: player.phone }} onClick={() => onOpenChange(false)}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
