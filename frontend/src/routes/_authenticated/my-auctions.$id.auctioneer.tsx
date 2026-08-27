import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, RotateCcw, Search, Shuffle, SquareMousePointer } from "lucide-react";
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
  const [shuffledIds, setShuffledIds] = useState<string[]>([]);
  const [viewingTeamId, setViewingTeamId] = useState<string | null>(null);
  const [hasPromptedReset, setHasPromptedReset] = useState(false);
  const [lastSoldTeamId, setLastSoldTeamId] = useState<string | null>(null);
  const [viewingStatusList, setViewingStatusList] = useState<AuctionRoundStatus | null>(null);
  const [actionHistory, setActionHistory] = useState<string[]>([]);

  async function handleUndoLatestStep() {
    let targetPlayerId: string | null = null;

    if (actionHistory.length > 0) {
      targetPlayerId = actionHistory[actionHistory.length - 1] ?? null;
    } else {
      // Fallback: find the non-pending player with the latest updatedAt
      const nonPending = players.filter(
        (p) => effectiveStatus(p) === "sold" || effectiveStatus(p) === "unsold"
      );
      if (nonPending.length > 0) {
        const sorted = [...nonPending].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        targetPlayerId = sorted[0]?.id ?? null;
      }
    }

    if (!targetPlayerId) {
      toast.info("No actions to undo.");
      return;
    }

    const playerToUndo = players.find((p) => p.id === targetPlayerId);
    if (!playerToUndo) {
      toast.error("Player not found for undo.");
      return;
    }

    const previousTeamId = mode === "live" 
      ? playerToUndo.teamId 
      : (trialOverrides[targetPlayerId]?.teamId ?? playerToUndo.teamId);

    const previousSoldPrice = mode === "live"
      ? playerToUndo.soldPrice
      : (trialOverrides[targetPlayerId]?.soldPrice ?? playerToUndo.soldPrice);

    if (mode === "live") {
      const toastId = toast.loading(`Undoing last action for ${playerToUndo.name}...`);
      try {
        await updatePlayer({
          id: targetPlayerId,
          patch: { teamId: null, soldPrice: null, auctionRoundStatus: "pending" },
        });
        toast.success(`Undid last action. ${playerToUndo.name} is now pending.`, { id: toastId });
      } catch (error) {
        toast.error("Failed to undo last action.", { id: toastId });
        return;
      }
    } else {
      setTrialOverrides((prev) => {
        const next = { ...prev };
        delete next[targetPlayerId!];
        return next;
      });
      toast.success(`Undid last action. ${playerToUndo.name} is now pending.`);
    }

    // Set the undone player as the active player so they can be re-auctioned immediately
    setCurrentPlayerId(targetPlayerId);
    setSelectedTeamId(previousTeamId);
    setCurrentBid(previousSoldPrice ?? auction.minimumBid);

    // Remove from history
    setActionHistory((prev) => prev.slice(0, -1));
  }

  async function handleResetAllPlayers() {
    if (mode === "live") {
      const soldOrUnsold = players.filter(
        (p) => p.auctionRoundStatus === "sold" || p.auctionRoundStatus === "unsold"
      );
      if (soldOrUnsold.length === 0) return;
      
      const toastId = toast.loading("Resetting all players back to pending...");
      try {
        await Promise.all(
          soldOrUnsold.map((p) =>
            updatePlayer({
              id: p.id,
              patch: { teamId: null, soldPrice: null, auctionRoundStatus: "pending" },
            })
          )
        );
        toast.success("Auction reset successfully! All players are now pending.", { id: toastId });
        setCurrentPlayerId(null);
        setSelectedTeamId(null);
        setActionHistory([]);
      } catch (error) {
        toast.error("Failed to reset some players.", { id: toastId });
      }
    } else {
      setTrialOverrides({});
      setCurrentPlayerId(null);
      setSelectedTeamId(null);
      setActionHistory([]);
      toast.success("Trial session cleared successfully!");
    }
  }

  // Automatically reset on mount (refresh / reopen) if there are already sold/unsold players
  useEffect(() => {
    if (playersPending || players.length === 0 || hasPromptedReset) return;

    setHasPromptedReset(true);

    const hasSoldOrUnsold = players.some(
      (p) => effectiveStatus(p) === "sold" || effectiveStatus(p) === "unsold"
    );
    if (hasSoldOrUnsold) {
      handleResetAllPlayers();
    }
  }, [players, playersPending, hasPromptedReset, mode]);

  function getNextAvailableTeamId(fromTeamId: string): string | null {
    if (teams.length === 0) return null;
    const startIndex = teams.findIndex((t) => t.id === fromTeamId);
    if (startIndex === -1) return null;

    for (let i = 1; i <= teams.length; i++) {
      const nextIndex = (startIndex + i) % teams.length;
      const candidateTeam = teams[nextIndex];
      const stats = computeTeamStats(candidateTeam, effectivePlayers, auction);
      if (stats.reservedPlayers > 0) {
        return candidateTeam.id;
      }
    }
    return null;
  }

  function handleTeamSelect(teamId: string) {
    if (selectedTeamId === teamId) return;

    setSelectedTeamId(teamId);

    if (currentPlayer) {
      // Automatically bid up if a player is active!
      setCurrentBid((prev) => Math.max(auction.minimumBid, prev + auction.bidIncrement));
    }
  }

  function getSpecialPriority(name: string): number {
    const n = name.toLowerCase();
    if (n.includes("maddineni")) return 1;
    if (n.includes("praveen")) return 2;
    if (n.includes("mallesh")) return 3;
    if (n.includes("dileep")) return 4;
    if (/\bali\b/i.test(n) || n === "ali") return 5;
    if (n.includes("kesava")) return 6;
    if (n.includes("sundeep")) return 7;
    return Infinity;
  }

  // Keep shuffled queue synchronized with pending players
  useEffect(() => {
    if (playersPending) return;
    const pending = players.filter((p) => effectiveStatus(p) === "pending");
    const pendingIds = pending.map((p) => p.id);
    
    setShuffledIds((prev) => {
      // Find priority players that are still pending
      const priorityPending = pending.filter((p) => getSpecialPriority(p.name) !== Infinity);
      const priorityPendingIds = priorityPending.map((p) => p.id);
      
      // Filter existing queue to only keep pending priority player IDs
      const filteredQueuePriority = prev.filter((id) => priorityPendingIds.includes(id));
      
      // Find new priority players that aren't in the queue yet
      const newPriorityIds = priorityPendingIds.filter(
        (id) => !filteredQueuePriority.includes(id)
      );
      
      // Shuffle new additions
      const shuffledNewPriority = [...newPriorityIds];
      for (let i = shuffledNewPriority.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNewPriority[i], shuffledNewPriority[j]] = [shuffledNewPriority[j], shuffledNewPriority[i]];
      }
      
      const finalPriorityQueue = [...filteredQueuePriority, ...shuffledNewPriority];
      
      // Non-priority pending player IDs
      const nonPriorityPendingIds = pendingIds.filter((id) => !priorityPendingIds.includes(id));
      
      // Filter existing queue to only keep pending non-priority player IDs
      const filteredQueueNonPriority = prev.filter((id) => nonPriorityPendingIds.includes(id));
      
      // Find new non-priority players that aren't in the queue yet
      const newNonPriorityIds = nonPriorityPendingIds.filter(
        (id) => !filteredQueueNonPriority.includes(id)
      );
      
      // Shuffle new additions
      const shuffledNewNonPriority = [...newNonPriorityIds];
      for (let i = shuffledNewNonPriority.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNewNonPriority[i], shuffledNewNonPriority[j]] = [shuffledNewNonPriority[j], shuffledNewNonPriority[i]];
      }
      
      const finalNonPriorityQueue = [...filteredQueueNonPriority, ...shuffledNewNonPriority];
      
      // Priority player IDs go first, then the remaining shuffled non-priority queue
      return [...finalPriorityQueue, ...finalNonPriorityQueue];
    });
  }, [players, playersPending, mode, trialOverrides]);

  // Helper to advance to the next player in the shuffled queue
  function advanceShuffledPlayer(currentId: string, soldTeamId?: string | null) {
    const nextQueue = shuffledIds.filter((id) => id !== currentId);
    setShuffledIds(nextQueue);
    
    const nextPending = pendingPlayers.filter((p) => p.id !== currentId);
    if (nextQueue.length > 0 && nextPending.length > 0) {
      // Find the first player from nextQueue that is still pending
      const nextId = nextQueue.find((id) => nextPending.some((p) => p.id === id));
      const nextPlayer = players.find((p) => p.id === nextId);
      if (nextPlayer) {
        startNewLot(nextPlayer, soldTeamId);
        return;
      }
    }
    
    // Fallback if queue is empty or player not found
    setCurrentPlayerId(null);
    setSelectedTeamId(null);
  }

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

  function startNewLot(player: Player, soldTeamId?: string | null) {
    setCurrentPlayerId(player.id);
    setCurrentBid(auction.minimumBid);
    
    const referenceTeamId = soldTeamId !== undefined ? soldTeamId : lastSoldTeamId;
    if (referenceTeamId && teams.length > 0) {
      setSelectedTeamId(referenceTeamId);
    } else {
      setSelectedTeamId(null);
    }
  }

  function handleNewPlayer() {
    if (pendingPlayers.length === 0) {
      toast.info("No more players available.");
      return;
    }
    if (selectionMode === "random") {
      // Pick the first player from the shuffled queue!
      const nextId = shuffledIds.find((id) => pendingPlayers.some((p) => p.id === id));
      const next = players.find((p) => p.id === nextId);
      if (next) {
        startNewLot(next);
      } else {
        // Fallback random index
        const fallback = pendingPlayers[Math.floor(Math.random() * pendingPlayers.length)];
        if (fallback) startNewLot(fallback);
      }
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
    // Guard here too (not just in TeamBidCard's disabled state) since Trial
    // Mode never reaches the backend's own roster-cap check.
    const selectedTeam = teams.find((t) => t.id === selectedTeamId);
    if (selectedTeam && computeTeamStats(selectedTeam, effectivePlayers, auction).reservedPlayers <= 0) {
      toast.error(`${selectedTeam.name} already has the maximum ${auction.playersPerTeam} players.`);
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
    toast.success(`${currentPlayer.name} sold to ${selectedTeam?.name || "Team"} for 🪙 ${currentBid.toLocaleString()}.`);
    setLastSoldTeamId(selectedTeamId);
    setActionHistory((prev) => [...prev, currentPlayer.id]);
    advanceShuffledPlayer(currentPlayer.id, selectedTeamId);
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
    setActionHistory((prev) => [...prev, currentPlayer.id]);
    advanceShuffledPlayer(currentPlayer.id, null);
  }

  const pendingPriorityPlayers = pendingPlayers.filter(
    (p) => getSpecialPriority(p.name) !== Infinity
  );
  const basePickerPlayers = [
    ...pendingPriorityPlayers,
    ...pendingPlayers.filter((p) => getSpecialPriority(p.name) === Infinity)
  ];
  const filteredPickerPlayers = basePickerPlayers.filter((p) =>
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
          className="size-10 shrink-0 rounded-md"
          fallback={
            <span className="display grid size-full place-items-center rounded-md bg-brand text-sm font-bold text-brand-foreground shadow-sm">
              {auction.name.slice(0, 2).toUpperCase()}
            </span>
          }
        />
        <h1 className="flex-1 truncate text-xl font-extrabold tracking-tight text-foreground">{auction.name}</h1>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              if (window.confirm("Are you sure you want to undo the latest step?")) {
                handleUndoLatestStep();
              }
            }}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label="Undo Latest Step"
            title="Undo Latest Step"
          >
            <RotateCcw className="size-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              if (window.confirm("Are you sure you want to reset the auction and clear all sold players?")) {
                handleResetAllPlayers();
              }
            }}
            className="text-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Reset Auction"
            title="Reset Auction"
          >
            <RefreshCw className="size-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] w-full space-y-4 px-6 py-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Player Display */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            {playersPending || teamsPending ? (
              <Skeleton className="h-96 w-full rounded-2xl" />
            ) : currentPlayer ? (
              <CurrentPlayerCard
                player={currentPlayer}
                lotNumber={soldCount + unsoldCount + 1}
                sportType={auction.sportType}
                currentBid={currentBid}
                onBidChange={setCurrentBid}
                onClear={() => {
                  setCurrentBid(auction.minimumBid);
                  setSelectedTeamId(null);
                }}
                mode={mode}
              />
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center text-muted-foreground bg-card shadow-sm flex items-center justify-center min-h-[300px]">
                <p className="text-lg font-bold">Tap "New Player" below to begin.</p>
              </div>
            )}
          </div>

          {/* Right Column: Teams Grid */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Teams</h2>
              <span className="text-xs text-muted-foreground font-medium">Select bidding team below</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
              {teams.map((team) => (
                <TeamBidCard
                  key={team.id}
                  team={team}
                  stats={computeTeamStats(team, effectivePlayers, auction)}
                  selected={selectedTeamId === team.id}
                  onSelect={() => handleTeamSelect(team.id)}
                  onViewPlayers={() => setViewingTeamId(team.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-card px-6 py-4 md:bottom-0 md:py-5">
        <div className="mx-auto flex max-w-[1800px] w-full items-stretch gap-4">
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2 bg-muted/20">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">New Player</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setSelectionMode("random")}
                aria-pressed={selectionMode === "random"}
                className={cn(
                  "rounded p-1.5 transition-colors",
                  selectionMode === "random" ? "bg-brand text-brand-foreground shadow-sm" : "text-muted-foreground hover:bg-muted",
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
                  "rounded p-1.5 transition-colors",
                  selectionMode === "manual" ? "bg-brand text-brand-foreground shadow-sm" : "text-muted-foreground hover:bg-muted",
                )}
                aria-label="Manual selection"
              >
                <SquareMousePointer className="size-4" />
              </button>
            </div>
            <Button size="sm" className="h-7.5 px-3 text-xs font-bold" onClick={handleNewPlayer}>
              New Player
            </Button>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-3">
            <Button variant="outline" className="h-14 text-base sm:text-lg font-extrabold rounded-xl shadow-sm" disabled={!currentPlayer} onClick={() => handleBid(1)}>
              Bid Up
            </Button>
            <Button variant="outline" className="h-14 text-base sm:text-lg font-extrabold rounded-xl shadow-sm" disabled={!currentPlayer} onClick={() => handleBid(-1)}>
              Down
            </Button>
            <Button
              className="h-14 text-base sm:text-lg font-extrabold bg-green-600 text-white hover:bg-green-700 rounded-xl shadow-sm"
              disabled={!currentPlayer}
              onClick={handleSold}
            >
              Sold
            </Button>
            <Button variant="destructive" className="h-14 text-base sm:text-lg font-extrabold rounded-xl shadow-sm" disabled={!currentPlayer} onClick={handleUnsold}>
              Unsold
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-[1800px] w-full justify-between text-xs sm:text-sm font-bold">
          <button 
            type="button"
            onClick={() => setViewingStatusList("sold")}
            className="rounded-full bg-green-600/10 px-3.5 py-1.5 text-green-600 border border-green-600/5 hover:bg-green-600/20 active:scale-95 transition-all text-xs sm:text-sm font-bold cursor-pointer"
          >
            Sold {soldCount}
          </button>
          <button 
            type="button"
            onClick={() => setViewingStatusList("unsold")}
            className="rounded-full bg-destructive/10 px-3.5 py-1.5 text-destructive border border-destructive/5 hover:bg-destructive/20 active:scale-95 transition-all text-xs sm:text-sm font-bold cursor-pointer"
          >
            Unsold {unsoldCount}
          </button>
          <button 
            type="button"
            onClick={() => setViewingStatusList("pending")}
            className="rounded-full bg-brand/10 px-3.5 py-1.5 text-brand border border-brand/5 hover:bg-brand/20 active:scale-95 transition-all text-xs sm:text-sm font-bold cursor-pointer"
          >
            Available {pendingPlayers.length}
          </button>
          <span className="rounded-full bg-blue-600/10 px-3.5 py-1.5 text-blue-600 border border-blue-600/5 select-none text-xs sm:text-sm font-bold">
            Team {teams.length}
          </span>
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
              filteredPickerPlayers.map((p) => {
               const isDummy = p.phone.startsWith("90000000");
               const pNumber = isDummy ? parseInt(p.phone.slice(8)) : null;
               return (
                 <button
                   key={p.id}
                   type="button"
                   onClick={() => {
                     startNewLot(p);
                     setPickerOpen(false);
                     setPickerQuery("");
                   }}
                   className="flex w-full items-center gap-3 rounded-lg border border-border p-2.5 text-left hover:bg-muted/50"
                 >
                   <FallbackImage
                     src={p.photo || ""}
                     alt={p.name}
                     className="size-11 shrink-0 rounded-full object-cover object-top border border-border/40"
                     fallback={
                       <span className="display grid size-full place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                         {p.name.slice(0, 2).toUpperCase()}
                       </span>
                     }
                   />
                   <div className="min-w-0 flex-1">
                     <div className="text-sm font-bold text-foreground">{p.name}</div>
                     <div className="text-xs text-muted-foreground font-medium mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                       {pNumber && <span className="font-bold text-foreground">Player {pNumber}</span>}
                       {pNumber && <span>•</span>}
                       <span>{p.sportFields?.["role"] || "-"}</span>
                       <span>•</span>
                       <span>Grade {p.category || "-"}</span>
                       <span>•</span>
                       <span>{p.customData ? p.customData.replace("Dominated Hand: ", "") : "-"}</span>
                     </div>
                   </div>
                 </button>
               );
             })
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingTeamId} onOpenChange={(open) => { if (!open) setViewingTeamId(null); }}>
        <DialogContent className="sm:max-w-2xl h-[600px] max-h-[85vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-black border-b border-border pb-3">
              {teams.find(t => t.id === viewingTeamId)?.name} - Bought Players
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
            {effectivePlayers.filter(p => p.teamId === viewingTeamId && effectiveStatus(p) === "sold").length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-lg text-muted-foreground font-bold">No players sold to this team yet.</p>
              </div>
            ) : (
              effectivePlayers.filter(p => p.teamId === viewingTeamId && effectiveStatus(p) === "sold").map((p) => {
                const isDummy = p.phone.startsWith("90000000");
                const pNumber = isDummy ? parseInt(p.phone.slice(8)) : null;
                return (
                  <div key={p.id} className="flex items-center justify-between border-b border-border/40 py-4 hover:bg-muted/10 px-3 rounded-xl transition-colors">
                    <div className="flex items-center gap-4">
                      <FallbackImage
                        src={p.photo || ""}
                        alt={p.name}
                        className="size-14 sm:size-16 shrink-0 rounded-full object-cover object-top border-2 border-border/40 shadow-sm"
                        fallback={
                          <span className="display grid size-full place-items-center rounded-full bg-brand/10 text-lg font-bold text-brand">
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        }
                      />
                      <div className="min-w-0">
                        <div className="text-base sm:text-lg font-extrabold text-foreground truncate max-w-[240px]">{p.name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground font-semibold mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                          {pNumber && <span className="font-bold text-foreground">Player {pNumber}</span>}
                          {pNumber && <span>•</span>}
                          <span>{p.sportFields?.["role"] || "-"}</span>
                          <span>•</span>
                          <span>Grade {p.category || "-"}</span>
                          <span>•</span>
                          <span>{p.customData ? p.customData.replace("Dominated Hand: ", "") : "-"}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-base sm:text-lg font-black text-green-600 bg-green-50 dark:bg-green-950/20 px-3.5 py-1.5 rounded-lg border-2 border-green-100 dark:border-green-900/40 shadow-sm">
                      🪙 {p.soldPrice?.toLocaleString() ?? "0"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingStatusList} onOpenChange={(open) => { if (!open) setViewingStatusList(null); }}>
        <DialogContent className="sm:max-w-2xl h-[600px] max-h-[85vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-black border-b border-border pb-3 capitalize">
              {viewingStatusList === "pending" ? "Available" : viewingStatusList} Players ({
                viewingStatusList === "pending"
                  ? pendingPlayers.length
                  : viewingStatusList === "sold"
                    ? soldCount
                    : unsoldCount
              })
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
            {(() => {
              const list = viewingStatusList === "pending"
                ? pendingPlayers
                : effectivePlayers.filter((p) => effectiveStatus(p) === viewingStatusList);
                
              if (list.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <p className="text-lg text-muted-foreground font-bold">No players found in this category.</p>
                  </div>
                );
              }
              
              return list.map((p) => {
                const isDummy = p.phone.startsWith("90000000");
                const pNumber = isDummy ? parseInt(p.phone.slice(8)) : null;
                const buyerTeam = teams.find((t) => t.id === p.teamId);
                
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border p-3.5 bg-card hover:bg-muted/30 transition-colors shadow-sm animate-fade-in"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <FallbackImage
                        src={p.photo || ""}
                        alt={p.name}
                        className="size-12 sm:size-14 shrink-0 rounded-full object-cover object-top border-2 border-border/40 shadow-sm"
                        fallback={
                          <span className="display grid size-full place-items-center rounded-full bg-brand/10 text-lg font-bold text-brand">
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-base sm:text-lg font-extrabold text-foreground truncate max-w-[240px]">{p.name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground font-semibold mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                          {pNumber && <span className="font-bold text-foreground">Player {pNumber}</span>}
                          {pNumber && <span>•</span>}
                          <span>{p.sportFields?.["role"] || "-"}</span>
                          <span>•</span>
                          <span>Grade {p.category || "-"}</span>
                          <span>•</span>
                          <span>{p.customData ? p.customData.replace("Dominated Hand: ", "") : "-"}</span>
                        </div>
                      </div>
                    </div>
                    
                    {viewingStatusList === "sold" ? (
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">{buyerTeam?.name || "Sold"}</span>
                        <span className="text-base sm:text-lg font-black text-green-600 bg-green-50 dark:bg-green-950/20 px-3.5 py-1.5 rounded-lg border-2 border-green-100 dark:border-green-900/40 shadow-sm">
                          🪙 {p.soldPrice?.toLocaleString() ?? "0"}
                        </span>
                      </div>
                    ) : viewingStatusList === "pending" ? (
                      <span className="text-sm font-bold text-brand bg-brand/5 px-3 py-1 rounded-full border border-brand/10 shrink-0">
                        Available
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-destructive bg-destructive/5 px-3 py-1 rounded-full border border-destructive/10 shrink-0">
                        Unsold
                      </span>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
