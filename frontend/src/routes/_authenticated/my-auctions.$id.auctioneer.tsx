import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, RefreshCw, Search, Shuffle, SquareMousePointer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FallbackImage } from "@/components/ui/fallback-image";
import { CurrentPlayerCard } from "@/components/auction/CurrentPlayerCard";
import { TeamBidCard } from "@/components/auction/TeamBidCard";
import { useTeams } from "@/hooks/useTeams";
import { usePlayers } from "@/hooks/usePlayers";
import { auctionDetailQueryOptions } from "@/lib/queries/auctions";
import { authClient } from "@/lib/auth-client";
import { computeTeamStats } from "@/lib/team-stats";
import type { Player } from "@/lib/auction-client";
import { cn } from "@/lib/utils";

type AuctionRoundStatus = "pending" | "sold" | "unsold";
type TrialOverride = { teamId: string | null; soldPrice: number | null; auctionRoundStatus: AuctionRoundStatus };

export const Route = createFileRoute("/_authenticated/my-auctions/$id/auctioneer")({
  validateSearch: (search: Record<string, unknown>): { mode?: "trial" | "live" } =>
    search["mode"] === "trial" || search["mode"] === "live" ? { mode: search["mode"] } : {},
  loader: async ({ params, context }) => {
    let auction;
    try {
      auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.id));
    } catch {
      throw notFound();
    }

    const user = await authClient.getCurrentUser();
    if (!user || auction.createdBy !== user.id) {
      throw redirect({ to: "/my-auctions" });
    }

    return { auction };
  },
  component: AuctioneerConsole,
});

function AuctioneerConsole() {
  const { auction } = Route.useLoaderData();
  const { mode: modeParam } = Route.useSearch();
  const mode: "trial" | "live" = modeParam ?? (auction.status === "live" ? "live" : "trial");

  const { teams, isPending: teamsPending } = useTeams(auction.id);
  const { players, isPending: playersPending, updatePlayer, refetch: refetchPlayers } = usePlayers(auction.id);

  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [currentBid, setCurrentBid] = useState<number>(auction.minimumBid);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<"random" | "manual">("random");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [trialOverrides, setTrialOverrides] = useState<Record<string, TrialOverride>>({});

  function effectiveStatus(player: Player): AuctionRoundStatus {
    if (mode === "live") return player.auctionRoundStatus;
    return trialOverrides[player.id]?.auctionRoundStatus ?? "pending";
  }

  const effectivePlayers: Player[] =
    mode === "live"
      ? players
      : players.map((p) => {
          const override = trialOverrides[p.id];
          return override ? { ...p, teamId: override.teamId, soldPrice: override.soldPrice } : p;
        });

  const pendingPlayers = players.filter((p) => effectiveStatus(p) === "pending");
  const soldCount = players.filter((p) => effectiveStatus(p) === "sold").length;
  const unsoldCount = players.filter((p) => effectiveStatus(p) === "unsold").length;
  const currentPlayer = players.find((p) => p.id === currentPlayerId) ?? null;

  function startNewLot(player: Player) {
    setCurrentPlayerId(player.id);
    setCurrentBid(auction.minimumBid);
    setSelectedTeamId(null);
  }

  function handleNewPlayer() {
    if (pendingPlayers.length === 0) {
      toast.info("No more players available.");
      return;
    }
    if (selectionMode === "random") {
      const next = pendingPlayers[Math.floor(Math.random() * pendingPlayers.length)];
      if (next) startNewLot(next);
    } else {
      setPickerOpen(true);
    }
  }

  function handleBid(direction: 1 | -1) {
    setCurrentBid((prev) => Math.max(auction.minimumBid, prev + direction * auction.bidIncrement));
  }

  async function handleSold() {
    if (!currentPlayer) return;
    if (!selectedTeamId) {
      toast.error("Select a team first.");
      return;
    }
    if (mode === "live") {
      try {
        await updatePlayer({
          id: currentPlayer.id,
          patch: { teamId: selectedTeamId, soldPrice: currentBid, auctionRoundStatus: "sold" },
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to record sale.");
        return;
      }
    } else {
      setTrialOverrides((prev) => ({
        ...prev,
        [currentPlayer.id]: { teamId: selectedTeamId, soldPrice: currentBid, auctionRoundStatus: "sold" },
      }));
    }
    toast.success(`${currentPlayer.name} sold for ${currentBid.toLocaleString()}.`);
    setCurrentPlayerId(null);
    setSelectedTeamId(null);
  }

  async function handleUnsold() {
    if (!currentPlayer) return;
    if (mode === "live") {
      try {
        await updatePlayer({ id: currentPlayer.id, patch: { auctionRoundStatus: "unsold" } });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to mark unsold.");
        return;
      }
    } else {
      setTrialOverrides((prev) => ({
        ...prev,
        [currentPlayer.id]: { teamId: null, soldPrice: null, auctionRoundStatus: "unsold" },
      }));
    }
    toast.info(`${currentPlayer.name} marked unsold.`);
    setCurrentPlayerId(null);
    setSelectedTeamId(null);
  }

  const filteredPickerPlayers = pendingPlayers.filter((p) =>
    p.name.toLowerCase().includes(pickerQuery.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background pb-40">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/my-auctions/$id" params={{ id: auction.id }} aria-label="Back to dashboard">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <FallbackImage
          src={auction.coverImage || ""}
          alt=""
          className="size-9 shrink-0 rounded-md"
          fallback={
            <span className="display grid size-full place-items-center rounded-md bg-brand text-sm font-bold text-brand-foreground">
              {auction.name.slice(0, 2).toUpperCase()}
            </span>
          }
        />
        <h1 className="flex-1 truncate text-lg font-bold">{auction.name}</h1>
        <Button variant="ghost" size="icon" onClick={() => refetchPlayers()} aria-label="Refresh">
          <RefreshCw className="size-5" />
        </Button>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {playersPending || teamsPending ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
        ) : currentPlayer ? (
          <CurrentPlayerCard
            player={currentPlayer}
            lotNumber={soldCount + unsoldCount + 1}
            sportType={auction.sportType}
            currentBid={currentBid}
            onBidChange={setCurrentBid}
            mode={mode}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Tap "New Player" below to begin.
          </div>
        )}

        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {teams.map((team) => (
            <TeamBidCard
              key={team.id}
              team={team}
              stats={computeTeamStats(team, effectivePlayers, auction)}
              selected={selectedTeamId === team.id}
              onSelect={() => setSelectedTeamId(team.id)}
            />
          ))}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-card px-4 py-3 md:bottom-0">
        <div className="mx-auto flex max-w-2xl items-stretch gap-3">
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border px-3">
            <span className="text-[10px] font-semibold uppercase text-muted-foreground">New Player</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setSelectionMode("random")}
                aria-pressed={selectionMode === "random"}
                className={cn(
                  "rounded p-1.5",
                  selectionMode === "random" ? "bg-brand text-brand-foreground" : "text-muted-foreground",
                )}
                aria-label="Random selection"
              >
                <Shuffle className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode("manual")}
                aria-pressed={selectionMode === "manual"}
                className={cn(
                  "rounded p-1.5",
                  selectionMode === "manual" ? "bg-brand text-brand-foreground" : "text-muted-foreground",
                )}
                aria-label="Manual selection"
              >
                <SquareMousePointer className="size-4" />
              </button>
            </div>
            <Button size="sm" className="h-7 px-3 text-xs" onClick={handleNewPlayer}>
              New Player
            </Button>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-2">
            <Button variant="outline" disabled={!currentPlayer} onClick={() => handleBid(1)}>
              Bid Up
            </Button>
            <Button variant="outline" disabled={!currentPlayer} onClick={() => handleBid(-1)}>
              Down
            </Button>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={!currentPlayer}
              onClick={handleSold}
            >
              Sold
            </Button>
            <Button variant="destructive" disabled={!currentPlayer} onClick={handleUnsold}>
              Unsold
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-2xl justify-between text-xs font-semibold">
          <span className="rounded-full bg-green-600/10 px-3 py-1 text-green-600">Sold {soldCount}</span>
          <span className="rounded-full bg-destructive/10 px-3 py-1 text-destructive">Unsold {unsoldCount}</span>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">Available {pendingPlayers.length}</span>
          <span className="rounded-full bg-blue-600/10 px-3 py-1 text-blue-600">Team {teams.length}</span>
        </div>
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pick a player</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {filteredPickerPlayers.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No pending players found.</p>
            ) : (
              filteredPickerPlayers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    startNewLot(p);
                    setPickerOpen(false);
                    setPickerQuery("");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg border border-border p-2 text-left hover:bg-muted/50"
                >
                  <FallbackImage
                    src={p.photo || ""}
                    alt={p.name}
                    className="size-9 shrink-0 rounded-full"
                    fallback={
                      <span className="display grid size-full place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                        {p.name.slice(0, 2).toUpperCase()}
                      </span>
                    }
                  />
                  <span className="text-sm font-medium">{p.name}</span>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
