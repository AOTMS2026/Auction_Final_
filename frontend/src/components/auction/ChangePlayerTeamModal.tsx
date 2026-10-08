import { useState, useEffect } from "react";
import { Loader2, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FallbackImage } from "@/components/ui/fallback-image";
import { usePlayers } from "@/hooks/usePlayers";
import { computeTeamStats, formatPoints } from "@/lib/team-stats";
import type { Auction, Player, Team } from "@/lib/auction-client";

interface ChangePlayerTeamModalProps {
  auction: Auction;
  player: Player | null;
  teams: Team[];
  players: Player[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ChangePlayerTeamModal({
  auction,
  player,
  teams,
  players,
  open,
  onOpenChange,
  onSuccess,
}: ChangePlayerTeamModalProps) {
  const { updatePlayer, isUpdating } = usePlayers(auction.id);

  const [selectedTeamId, setSelectedTeamId] = useState<string>("none");
  const [soldPrice, setSoldPrice] = useState<string>("");

  useEffect(() => {
    if (player && open) {
      setSelectedTeamId(player.teamId || "none");
      const defaultPrice =
        player.soldPrice != null && player.soldPrice > 0
          ? player.soldPrice
          : player.baseValue != null && player.baseValue > 0
            ? player.baseValue
            : auction.minimumBid;
      setSoldPrice(defaultPrice.toString());
    }
  }, [player, open, auction.minimumBid]);

  if (!player) return null;

  const currentTeam = teams.find((t) => t.id === player.teamId);
  const targetTeam = teams.find((t) => t.id === selectedTeamId);

  // Compute stats for the currently selected target team
  const targetTeamStats = targetTeam ? computeTeamStats(targetTeam, players, auction) : null;
  
  // Calculate if player is already on this team
  const isAlreadyOnSelectedTeam = player.teamId === selectedTeamId;
  const isTargetTeamFull =
    targetTeamStats != null && !isAlreadyOnSelectedTeam && targetTeamStats.reservedPlayers <= 0;

  const parsedPrice = parseFloat(soldPrice);

  let priceError: string | null = null;
  if (selectedTeamId !== "none") {
    if (!soldPrice || isNaN(parsedPrice)) {
      priceError = "Please enter a valid sold price.";
    } else if (parsedPrice < auction.minimumBid) {
      priceError = `Minimum bid is 🪙 ${auction.minimumBid.toLocaleString()}`;
    } else if (targetTeamStats) {
      const priceDelta = isAlreadyOnSelectedTeam ? parsedPrice - (player.soldPrice ?? 0) : parsedPrice;
      if (priceDelta > targetTeamStats.availablePoints) {
        priceError = `Exceeds available purse (🪙 ${targetTeamStats.availablePoints.toLocaleString()} left)`;
      } else if (!isAlreadyOnSelectedTeam && parsedPrice > targetTeamStats.maxBidPoints) {
        priceError = `Exceeds team's max allowed bid of 🪙 ${targetTeamStats.maxBidPoints.toLocaleString()}`;
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!player) return;

    if (selectedTeamId === "none") {
      // Removing player from team
      try {
        await updatePlayer({
          id: player.id,
          patch: {
            teamId: null,
            soldPrice: null,
            auctionRoundStatus: "pending",
          },
        });
        toast.success(`Removed ${player.name} from team. Marked as Available.`);
        onOpenChange(false);
        onSuccess?.();
      } catch (err: any) {
        toast.error(err?.message || "Failed to remove player from team.");
      }
      return;
    }

    if (priceError) {
      toast.error(priceError);
      return;
    }

    if (isTargetTeamFull) {
      toast.error("The selected team already has the maximum number of players.");
      return;
    }

    try {
      await updatePlayer({
        id: player.id,
        patch: {
          teamId: selectedTeamId,
          soldPrice: parsedPrice,
          auctionRoundStatus: "sold",
        },
      });

      toast.success(
        `Updated ${player.name}'s team to ${targetTeam?.name || "Team"} (🪙 ${parsedPrice.toLocaleString()})`
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update player's team.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md flex flex-col rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-6">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-black text-[#fffcf7] tracking-tight flex items-center gap-2">
            <Shield className="size-5 text-[#38bdf8]" />
            Change Player Team
          </DialogTitle>
        </DialogHeader>

        {/* Player summary header card */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-[#5c6875]/35 bg-[#2e343a]/50 mt-1">
          <FallbackImage
            src={player.photo || ""}
            alt={player.name}
            className="size-14 rounded-xl object-cover object-top border-2 border-[#a1b5d8]/40 shrink-0"
            fallback={
              <span className="display grid size-full place-items-center rounded-xl bg-[#162235] text-lg font-black text-[#a1b5d8]">
                {player.name.slice(0, 2).toUpperCase()}
              </span>
            }
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-extrabold text-[#fffcf7] truncate">{player.name}</h3>
            <div className="text-xs text-[#abb4bd] font-medium flex items-center gap-1.5 flex-wrap mt-0.5">
              <span>{player.sportFields?.["role"] || "-"}</span>
              <span>•</span>
              <span className="text-[#c2d8b9]">Grade {player.category || "-"}</span>
              {player.baseValue ? (
                <>
                  <span>•</span>
                  <span>Base: 🪙 {player.baseValue.toLocaleString()}</span>
                </>
              ) : null}
            </div>
            <div className="mt-1.5">
              {currentTeam ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Currently: {currentTeam.name} {player.soldPrice ? `(🪙 ${player.soldPrice.toLocaleString()})` : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#162235] border border-[#4365a0] text-[#a1b5d8]">
                  Currently Available / Unsold
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Team Select */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">
              Select Team <span className="text-red-400">*</span>
            </Label>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger className="h-11 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#38bdf8]">
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7] max-h-64">
                <SelectItem value="none" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-amber-300 font-bold">
                  ⭕ None (Unassigned / Mark Available)
                </SelectItem>
                {teams.map((t) => {
                  const stats = computeTeamStats(t, players, auction);
                  const isFull = stats.reservedPlayers <= 0 && t.id !== player.teamId;
                  return (
                    <SelectItem
                      key={t.id}
                      value={t.id}
                      disabled={isFull}
                      className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7] cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full gap-3">
                        <span className="font-bold truncate">{t.name}</span>
                        <span className="text-[11px] text-[#abb4bd] shrink-0 font-medium">
                          {isFull ? (
                            <span className="text-rose-400 font-bold">(Full)</span>
                          ) : (
                            `${stats.totalPlayers}/${auction.playersPerTeam} players · 🪙 ${formatPoints(stats.availablePoints)}`
                          )}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Sold Price field (when a team is selected) */}
          {selectedTeamId !== "none" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="changeTeamSoldPrice" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">
                  Sold Price (Points) <span className="text-red-400">*</span>
                </Label>
                {targetTeamStats && (
                  <span className="text-[11px] text-[#38bdf8] font-bold">
                    Max: 🪙 {targetTeamStats.maxBidPoints.toLocaleString()}
                  </span>
                )}
              </div>
              <Input
                id="changeTeamSoldPrice"
                type="number"
                min={auction.minimumBid}
                placeholder={`e.g. ${auction.minimumBid}`}
                value={soldPrice}
                onChange={(e) => setSoldPrice(e.target.value)}
                disabled={isUpdating}
                className="h-11 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] font-bold text-base focus-visible:ring-[#38bdf8]"
              />
              {priceError ? (
                <p className="text-xs font-semibold text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="size-3.5 shrink-0" /> {priceError}
                </p>
              ) : targetTeamStats ? (
                <div className="flex items-center justify-between text-[11px] text-[#abb4bd] font-medium pt-0.5">
                  <span>Min bid: 🪙 {auction.minimumBid.toLocaleString()}</span>
                  <span>Purse left: 🪙 {targetTeamStats.availablePoints.toLocaleString()}</span>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                Setting to <strong>None</strong> will remove {player.name} from their team and return them to the available pool. Any points spent will be refunded to the team.
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#5c6875]/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
              className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/50 text-[#fffcf7] hover:bg-[#2e343a] font-bold h-10 px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || (selectedTeamId !== "none" && !!priceError)}
              className="rounded-xl px-6 h-10 font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:scale-105 transition-all border border-white/30"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Team"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
