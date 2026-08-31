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
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-2xl">
        <DialogHeader className="p-4 pb-0 hidden">
          <DialogTitle>Player Details</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center text-center pt-7 px-5 pb-5">
          {/* Compact Optimized Image Display */}
          <div className="relative">
            <div className="size-28 sm:size-32 rounded-2xl overflow-hidden border-2 border-[#a1b5d8]/50 shadow-[0_8px_25px_rgba(161,181,216,0.25)] bg-[#162235]">
              <FallbackImage
                src={player.photo || ""}
                alt={player.name}
                className="size-full object-cover object-top"
                fallback={
                  <span className="display grid size-full place-items-center bg-gradient-to-br from-[#4365a0] to-[#6a9b57] text-4xl font-black text-[#fffcf7]">
                    {player.name.slice(0, 2).toUpperCase()}
                  </span>
                }
              />
            </div>
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#162235] border border-[#a1b5d8]/40 px-3 py-0.5 text-[11px] font-extrabold uppercase text-[#e4f0d0] shadow-sm">
              {player.sportFields?.["role"] || player.category || "Player"}
            </span>
          </div>

          {/* Player Header Info */}
          <div className="mt-5 text-center">
            <h2 className="text-xl sm:text-2xl font-black text-[#fffcf7] tracking-tight">{player.name}</h2>
            <p className="mt-1 text-xs font-semibold text-[#a1b5d8]">
              {player.phone ? `+91 ${player.phone}` : "No contact available"}
            </p>
          </div>

          {/* Compact Quick Stats */}
          <div className="w-full mt-4 rounded-2xl bg-[#2e343a]/60 border border-[#5c6875]/30 p-3.5 backdrop-blur-sm">
            {open && isLoading ? (
              <div className="flex justify-center py-3">
                <Loader2 className="size-5 animate-spin text-[#a1b5d8]" />
              </div>
            ) : profile ? (
              <div className="grid grid-cols-3 gap-2 divide-x divide-[#5c6875]/30">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-black text-[#fffcf7]">{profile.stats.joinedAuctions}</div>
                  <div className="text-[10px] uppercase font-bold text-[#abb4bd] mt-0.5 tracking-wider">Auctions</div>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-black text-[#e3e6e9]">{profile.stats.joinedTeams}</div>
                  <div className="text-[10px] uppercase font-bold text-[#abb4bd] mt-0.5 tracking-wider">Teams</div>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-black text-[#e4f0d0]">{profile.stats.overallASP > 0 ? profile.stats.overallASP.toLocaleString("en-IN") : "---"}</div>
                  <div className="text-[10px] uppercase font-bold text-[#abb4bd] mt-0.5 tracking-wider">Avg ASP</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#abb4bd]">Quick profile statistics</div>
            )}
          </div>

          {/* Action Button */}
          <div className="w-full mt-4">
            <Button asChild className="w-full rounded-full py-3 h-auto font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_20px_rgba(161,181,216,0.35)] transition-all">
              <Link to="/players/$phone" params={{ phone: player.phone }} onClick={() => onOpenChange(false)}>
                View Full Profile
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PlayerPreviewCard;
