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
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-[0_20px_60px_rgba(10,25,32,0.95)]">
        <DialogHeader className="p-4 pb-0 hidden">
          <DialogTitle>Player Details</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center text-center pt-7 px-5 pb-5">
          {/* Compact Optimized Image Display */}
          <div className="relative">
            <div className="size-28 sm:size-32 rounded-2xl overflow-hidden border-2 border-[#38bdf8]/60 shadow-[0_8px_25px_rgba(56,189,248,0.35)] bg-[#162a34]">
              <FallbackImage
                src={player.photo || ""}
                alt={player.name}
                className="size-full object-cover object-top"
                fallback={
                  <span className="display grid size-full place-items-center bg-gradient-to-br from-[#1e424c] to-[#38bdf8] text-4xl font-black text-[#ffffff]">
                    {player.name.slice(0, 2).toUpperCase()}
                  </span>
                }
              />
            </div>
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#162a34] border-2 border-[#38bdf8]/60 px-3.5 py-0.5 text-[11px] font-black uppercase text-emerald-400 shadow-sm">
              {player.sportFields?.["role"] || player.category || "Player"}
            </span>
          </div>

          {/* Player Header Info */}
          <div className="mt-5 text-center">
            <h2 className="text-xl sm:text-2xl font-black text-[#ffffff] tracking-tight">{player.name}</h2>
            <p className="mt-1 text-xs font-bold text-[#38bdf8]">
              {player.phone ? `+91 ${player.phone}` : "No contact available"}
            </p>
          </div>

          {/* Compact Quick Stats */}
          <div className="w-full mt-4 rounded-2xl bg-[#162a34]/90 border-2 border-[#38bdf8]/30 p-3.5 backdrop-blur-sm">
            {open && isLoading ? (
              <div className="flex justify-center py-3">
                <Loader2 className="size-5 animate-spin text-[#38bdf8]" />
              </div>
            ) : profile ? (
              <div className="grid grid-cols-3 gap-2 divide-x divide-[#38bdf8]/30">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-black text-[#ffffff]">{profile.stats.joinedAuctions}</div>
                  <div className="text-[10px] uppercase font-black text-[#38bdf8] mt-0.5 tracking-wider">Auctions</div>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-black text-[#ffffff]">{profile.stats.joinedTeams}</div>
                  <div className="text-[10px] uppercase font-black text-[#38bdf8] mt-0.5 tracking-wider">Teams</div>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-black text-emerald-400">{profile.stats.overallASP > 0 ? profile.stats.overallASP.toLocaleString("en-IN") : "---"}</div>
                  <div className="text-[10px] uppercase font-black text-[#f97316] mt-0.5 tracking-wider">Avg ASP</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#f2e9dc]/70 font-semibold">Quick profile statistics</div>
            )}
          </div>

          {/* Action Button */}
          <div className="w-full mt-4">
            <Button asChild className="w-full rounded-full py-3 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:scale-105 transition-all border border-white/30">
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
