import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, RotateCcw, Search, Shuffle, SquareMousePointer, Plus, Minus, Gavel, X } from "lucide-react";
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
import type { Player, Team } from "@/lib/auction-client";
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
    const isAdmin = user?.email === "ameen@gmail.com";
    if (!user || (auction.createdBy !== user.id && !isAdmin)) {
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
  const [orderedTeams, setOrderedTeams] = useState<Team[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sync ordered teams when teams load or change
  useEffect(() => {
    if (teams && teams.length > 0) {
      const storedOrder = localStorage.getItem(`auctioneer-teams-order-${auction.id}`);
      if (storedOrder) {
        try {
          const orderedIds = JSON.parse(storedOrder) as string[];
          const existingTeamsMap = new Map(teams.map((t) => [t.id, t]));
          const reordered: Team[] = [];

          orderedIds.forEach((id) => {
            const team = existingTeamsMap.get(id);
            if (team) {
              reordered.push(team);
              existingTeamsMap.delete(id);
            }
          });
          // Append any remaining teams
          existingTeamsMap.forEach((team) => {
            reordered.push(team);
          });
          setOrderedTeams(reordered);
          return;
        } catch (e) {
          console.error("Error parsing stored teams order", e);
        }
      }
      setOrderedTeams(teams);
    } else {
      setOrderedTeams([]);
    }
  }, [teams, auction.id]);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const fromTeam = orderedTeams[fromIndex];
    const toTeam = orderedTeams[toIndex];
    if (!fromTeam || !toTeam || fromIndex === toIndex) {
      return;
    }
    const newOrder = [...orderedTeams];
    newOrder[fromIndex] = toTeam;
    newOrder[toIndex] = fromTeam;
    setOrderedTeams(newOrder);
    localStorage.setItem(
      `auctioneer-teams-order-${auction.id}`,
      JSON.stringify(newOrder.map((t) => t.id))
    );
  };

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
    if (orderedTeams.length === 0) return null;
    const startIndex = orderedTeams.findIndex((t) => t.id === fromTeamId);
    if (startIndex === -1) return null;

    for (let i = 1; i <= orderedTeams.length; i++) {
      const nextIndex = (startIndex + i) % orderedTeams.length;
      const candidateTeam = orderedTeams[nextIndex];
      if (!candidateTeam) continue;
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
        const temp = shuffledNewPriority[i] as string;
        shuffledNewPriority[i] = shuffledNewPriority[j] as string;
        shuffledNewPriority[j] = temp;
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
        const temp = shuffledNewNonPriority[i] as string;
        shuffledNewNonPriority[i] = shuffledNewNonPriority[j] as string;
        shuffledNewNonPriority[j] = temp;
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
    <>
      <div
        className="h-screen w-screen text-[#fffcf7] flex flex-col overflow-hidden selection:bg-[#a1b5d8] selection:text-[#162235]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
        }}
      >
      <header className="h-14 shrink-0 flex items-center gap-3 border-b border-[#5c6875]/40 bg-[#171a1d]/90 backdrop-blur-md px-6 text-[#fffcf7]">
        <Button variant="ghost" size="icon" asChild className="text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] rounded-xl">
          <Link to="/my-auctions/$id" params={{ id: auction.id }} aria-label="Back to dashboard">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <FallbackImage
          src={auction.coverImage || ""}
          alt=""
<<<<<<< HEAD
          className="size-12 shrink-0 rounded-md object-contain"
=======
          className="size-10 shrink-0 rounded-xl border border-[#a1b5d8]/40 object-cover"
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
          fallback={
            <span className="display grid size-full place-items-center rounded-xl bg-[#162235] text-sm font-black text-[#a1b5d8] shadow-sm">
              {auction.name.slice(0, 2).toUpperCase()}
            </span>
          }
        />
<<<<<<< HEAD
        <h1 className="flex-1 truncate text-xl font-extrabold tracking-wide text-foreground">{auction.name}</h1>
        <div className="flex items-center gap-1">
=======
        <h1 className="flex-1 truncate text-xl font-black tracking-tight text-[#fffcf7]">{auction.name}</h1>
        <div className="flex items-center gap-2">
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              if (window.confirm("Are you sure you want to undo the latest step?")) {
                handleUndoLatestStep();
              }
            }}
            className="text-red-400 hover:text-red-300 hover:bg-destructive/20 rounded-xl"
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
            className="text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] rounded-xl"
            aria-label="Reset Auction"
            title="Reset Auction"
          >
            <RefreshCw className="size-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 w-full px-6 py-4 flex gap-6 mx-auto max-w-[1800px] overflow-hidden">
        {/* Left Column: Player Display */}
        <div className="flex-1 h-full min-w-0">
          {playersPending || teamsPending ? (
            <Skeleton className="h-full w-full rounded-3xl bg-[#2e343a]/60" />
          ) : currentPlayer ? (
            <CurrentPlayerCard
              player={currentPlayer}
              lotNumber={soldCount + unsoldCount + 1}
              sportType={auction.sportType}
              currentBid={currentBid}
              minBid={auction.minimumBid}
              onBidChange={(value) => setCurrentBid(Math.max(auction.minimumBid, value))}
              onClear={() => {
                setCurrentBid(auction.minimumBid);
                setSelectedTeamId(null);
              }}
              mode={mode}
            />
          ) : (
            <div className="rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/80 backdrop-blur-xl p-12 text-center text-[#abb4bd] shadow-2xl flex items-center justify-center h-full">
              <p className="text-lg font-bold text-[#fffcf7]">Tap "New Player" at the bottom to begin.</p>
            </div>
          )}
        </div>

        {/* Right Column: Teams List (Vertical Grid) */}
<<<<<<< HEAD
        <div className="w-[480px] shrink-0 flex flex-col h-full bg-card border border-border rounded-2xl p-3 shadow-sm select-none overflow-hidden">
          <div className="shrink-0 border-b border-border pb-1.5 mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Teams</h2>
            <span className="text-[10px] text-muted-foreground font-medium">Bidding Team Selection</span>
=======
        <div className="w-[360px] shrink-0 flex flex-col h-full bg-[#2e343a]/75 backdrop-blur-xl border border-[#5c6875]/40 rounded-3xl p-3 shadow-[0_15px_45px_rgba(23,26,29,0.8)] select-none overflow-hidden text-[#fffcf7]">
          <div className="shrink-0 border-b border-[#5c6875]/30 pb-2 mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Teams</h2>
            <span className="text-[10px] text-[#a1b5d8] font-bold">Bidding Team Selection</span>
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2">
              {orderedTeams.map((team, index) => (
                <TeamBidCard
                  key={team.id}
                  team={team}
                  stats={computeTeamStats(team, effectivePlayers, auction)}
                  selected={selectedTeamId === team.id}
                  onSelect={() => handleTeamSelect(team.id)}
                  onViewPlayers={() => setViewingTeamId(team.id)}
                  draggable
                  onDragStart={(e) => {
                    setDraggedIndex(index);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", `${index}`);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (dragOverIndex !== index) {
                      setDragOverIndex(index);
                    }
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    if (dragOverIndex !== index) {
                      setDragOverIndex(index);
                    }
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      if (dragOverIndex === index) {
                        setDragOverIndex(null);
                      }
                    }
                  }}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const rawFrom = draggedIndex !== null ? draggedIndex : parseInt(e.dataTransfer.getData("text/plain"), 10);
                    if (!isNaN(rawFrom) && rawFrom !== index) {
                      handleReorder(rawFrom, index);
                    }
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                  }}
                  isDragging={draggedIndex === index}
                  isDragOver={dragOverIndex === index}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Controls Row */}
      <div className="shrink-0 border-t border-[#5c6875]/40 bg-[#171a1d]/95 backdrop-blur-xl p-3 select-none text-[#fffcf7]">
        <div className="mx-auto max-w-[1800px] w-full flex items-center justify-between gap-4">
          
          {/* New Player Mode & Button */}
<<<<<<< HEAD
          <div className="flex items-center gap-3 bg-muted/10 border border-border p-2 sm:p-2.5 rounded-xl shrink-0">
            <div className="flex flex-col items-center gap-1.5 border-r border-border pr-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none">New Player Mode</span>
              <div className="flex gap-1.5 w-44 sm:w-48">
=======
          <div className="flex items-center gap-3 bg-[#2e343a]/60 border border-[#5c6875]/40 p-2 rounded-2xl shrink-0">
            <div className="flex flex-col items-center gap-1.5 border-r border-[#5c6875]/30 pr-3">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#abb4bd] leading-none">New Player Mode</span>
              <div className="flex gap-1 w-36">
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
                <button
                  type="button"
                  onClick={() => setSelectionMode("random")}
                  className={cn(
<<<<<<< HEAD
                    "rounded-lg py-1.5 px-2 transition-all border flex-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold active:scale-95 cursor-pointer",
                    selectionMode === "random" ? "bg-brand text-brand-foreground border-brand shadow-sm" : "bg-card text-muted-foreground border-border hover:bg-muted",
=======
                    "rounded-xl p-1.5 transition-all border flex-1 flex items-center justify-center gap-1 text-[10px] font-black cursor-pointer",
                    selectionMode === "random"
                      ? "bg-[#a1b5d8] text-[#162235] border-[#a1b5d8] shadow-md"
                      : "bg-[#171a1d]/70 text-[#abb4bd] border-[#5c6875]/40 hover:bg-[#2e343a] hover:text-[#fffcf7]",
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
                  )}
                  title="Random Selection"
                >
                  <Shuffle className="size-3.5 sm:size-4" />
                  Random
                </button>
                <button
                  type="button"
                  onClick={() => setSelectionMode("manual")}
                  className={cn(
<<<<<<< HEAD
                    "rounded-lg py-1.5 px-2 transition-all border flex-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold active:scale-95 cursor-pointer",
                    selectionMode === "manual" ? "bg-brand text-brand-foreground border-brand shadow-sm" : "bg-card text-muted-foreground border-border hover:bg-muted",
=======
                    "rounded-xl p-1.5 transition-all border flex-1 flex items-center justify-center gap-1 text-[10px] font-black cursor-pointer",
                    selectionMode === "manual"
                      ? "bg-[#a1b5d8] text-[#162235] border-[#a1b5d8] shadow-md"
                      : "bg-[#171a1d]/70 text-[#abb4bd] border-[#5c6875]/40 hover:bg-[#2e343a] hover:text-[#fffcf7]",
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
                  )}
                  title="Manual Selection"
                >
                  <SquareMousePointer className="size-3.5 sm:size-4" />
                  Manual
                </button>
              </div>
            </div>
<<<<<<< HEAD
            <Button className="text-sm sm:text-base font-extrabold h-11 px-5 shrink-0 shadow-sm" onClick={handleNewPlayer}>
=======
            <Button
              className="rounded-xl px-5 h-9 font-black text-xs text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_15px_rgba(161,181,216,0.35)] shrink-0"
              onClick={handleNewPlayer}
            >
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
              New Player
            </Button>
          </div>

          {/* Bid Controls (Horizontal Flex) */}
          <div className="flex-1 flex items-center gap-2.5 justify-center max-w-[680px]">
            <Button 
              variant="outline" 
<<<<<<< HEAD
              className="h-9.5 sm:h-10 flex-1 max-w-[160px] text-xs sm:text-sm font-bold rounded-xl shadow-sm border bg-card hover:bg-accent flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer" 
              disabled={!currentPlayer} 
              onClick={() => handleBid(1)}
            >
              <Plus className="size-3.5 sm:size-4" /> Bid Up
            </Button>
            <Button 
              variant="outline" 
              className="h-9.5 sm:h-10 flex-1 max-w-[160px] text-xs sm:text-sm font-bold rounded-xl shadow-sm border bg-card hover:bg-accent flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer" 
              disabled={!currentPlayer} 
              onClick={() => handleBid(-1)}
            >
              <Minus className="size-3.5 sm:size-4" /> Bid Down
            </Button>
            
            <div className="h-6 w-px bg-border mx-0.5" />

            <Button
              className="h-9.5 sm:h-10 flex-1 max-w-[180px] text-xs sm:text-sm font-extrabold bg-green-600 text-white hover:bg-green-700 rounded-xl shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
=======
              className="h-11 flex-1 max-w-[240px] text-sm font-black rounded-xl shadow-md border border-[#5c6875]/50 bg-[#2e343a]/80 text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer" 
              disabled={!currentPlayer} 
              onClick={() => handleBid(1)}
            >
              <Plus className="size-4 text-[#a1b5d8]" /> Bid Up
            </Button>
            <Button 
              variant="outline" 
              className="h-11 flex-1 max-w-[240px] text-sm font-black rounded-xl shadow-md border border-[#5c6875]/50 bg-[#2e343a]/80 text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer" 
              disabled={!currentPlayer} 
              onClick={() => handleBid(-1)}
            >
              <Minus className="size-4 text-[#a1b5d8]" /> Bid Down
            </Button>
            
            <div className="h-6 w-px bg-[#5c6875]/40 mx-1" />

            <Button
              className="h-11 flex-1 max-w-[280px] text-base font-black bg-gradient-to-r from-[#47673a] to-[#71b368] hover:from-[#31572c] hover:to-[#4e8a46] text-white rounded-xl shadow-[0_0_20px_rgba(113,179,104,0.3)] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
              disabled={!currentPlayer}
              onClick={handleSold}
            >
              <Gavel className="size-3.5 sm:size-4" /> Sold
            </Button>
            <Button 
<<<<<<< HEAD
              variant="destructive" 
              className="h-9.5 sm:h-10 flex-1 max-w-[180px] text-xs sm:text-sm font-extrabold rounded-xl shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer" 
=======
              className="h-11 flex-1 max-w-[280px] text-base font-black bg-gradient-to-r from-[#8b2635] to-[#c93b51] hover:from-[#721f2c] hover:to-[#b03446] text-white rounded-xl shadow-[0_0_20px_rgba(201,59,81,0.3)] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer" 
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
              disabled={!currentPlayer} 
              onClick={handleUnsold}
            >
              <X className="size-3.5 sm:size-4" /> Unsold
            </Button>
          </div>

          {/* Statistics (Horizontal Row) */}
<<<<<<< HEAD
          <div className="flex items-center gap-2 border-l border-border pl-4 shrink-0">
            <div className="flex flex-col gap-1.5 w-40 sm:w-44">
              <button 
                type="button"
                onClick={() => setViewingStatusList("sold")}
                className="rounded-lg bg-green-600/10 py-1.5 text-green-600 border border-green-600/15 hover:bg-green-600/20 active:scale-95 transition-all text-xs sm:text-sm font-bold cursor-pointer text-center"
=======
          <div className="flex items-center gap-2 border-l border-[#5c6875]/40 pl-4 shrink-0">
            <div className="flex flex-col gap-1 w-36">
              <button 
                type="button"
                onClick={() => setViewingStatusList("sold")}
                className="rounded-xl bg-[#23341d]/70 py-1.5 text-[#c2d8b9] border border-[#47673a] hover:bg-[#23341d] active:scale-95 transition-all text-[11px] font-black cursor-pointer text-center"
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
              >
                Sold {soldCount}
              </button>
              <button 
                type="button"
                onClick={() => setViewingStatusList("unsold")}
<<<<<<< HEAD
                className="rounded-lg bg-destructive/10 py-1.5 text-destructive border border-destructive/15 hover:bg-destructive/20 active:scale-95 transition-all text-xs sm:text-sm font-bold cursor-pointer text-center"
=======
                className="rounded-xl bg-[#45191f]/70 py-1.5 text-[#fca5a5] border border-[#8b2635] hover:bg-[#45191f] active:scale-95 transition-all text-[11px] font-black cursor-pointer text-center"
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
              >
                Unsold {unsoldCount}
              </button>
            </div>
            <div className="flex flex-col gap-1.5 w-40 sm:w-44">
              <button 
                type="button"
                onClick={() => setViewingStatusList("pending")}
<<<<<<< HEAD
                className="rounded-lg bg-brand/10 py-1.5 text-brand border border-brand/15 hover:bg-brand/20 active:scale-95 transition-all text-xs sm:text-sm font-bold cursor-pointer text-center"
              >
                Available {pendingPlayers.length}
              </button>
              <span className="rounded-lg bg-blue-600/10 py-1.5 text-blue-600 border border-blue-600/15 select-none text-xs sm:text-sm font-bold text-center flex items-center justify-center">
=======
                className="rounded-xl bg-[#162235]/70 py-1.5 text-[#a1b5d8] border border-[#4365a0] hover:bg-[#162235] active:scale-95 transition-all text-[11px] font-black cursor-pointer text-center"
              >
                Available {pendingPlayers.length}
              </button>
              <span className="rounded-xl bg-[#2e343a]/70 py-1.5 text-[#fffcf7] border border-[#5c6875]/40 select-none text-[11px] font-black text-center flex items-center justify-center h-[28px]">
>>>>>>> d0063b8860b2d4d303dd2cf192ec0145e30a89d2
                Team {teams.length}
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#fffcf7] tracking-tight">Pick a player</DialogTitle>
          </DialogHeader>
          <div className="relative mt-2">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#abb4bd]" />
            <Input
              placeholder="Search players..."
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              className="pl-10 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
            />
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto mt-2 pr-1">
            {filteredPickerPlayers.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#abb4bd]">No pending players found.</p>
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
                   className="flex w-full items-center gap-3 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/40 p-2.5 text-left hover:bg-[#2e343a]/80 hover:border-[#a1b5d8]/40 transition-colors text-[#fffcf7] cursor-pointer"
                 >
                   <FallbackImage
                     src={p.photo || ""}
                     alt={p.name}
                     className="size-11 shrink-0 rounded-xl object-cover object-top border border-[#a1b5d8]/30"
                     fallback={
                       <span className="display grid size-full place-items-center rounded-xl bg-[#162235] text-xs font-black text-[#a1b5d8]">
                         {p.name.slice(0, 2).toUpperCase()}
                       </span>
                     }
                   />
                   <div className="min-w-0 flex-1">
                     <div className="text-sm font-bold text-[#fffcf7]">{p.name}</div>
                     <div className="text-xs text-[#abb4bd] font-medium mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                       {pNumber && <span className="font-bold text-[#a1b5d8]">Player {pNumber}</span>}
                       {pNumber && <span className="text-[#5c6875]">•</span>}
                       <span>{p.sportFields?.["role"] || "-"}</span>
                       <span className="text-[#5c6875]">•</span>
                       <span>Grade {p.category || "-"}</span>
                       <span className="text-[#5c6875]">•</span>
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
        <DialogContent className="sm:max-w-2xl h-[600px] max-h-[85vh] flex flex-col rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-6">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-black border-b border-[#5c6875]/30 pb-3 text-[#fffcf7]">
              {teams.find(t => t.id === viewingTeamId)?.name} - Bought Players
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
            {effectivePlayers.filter(p => p.teamId === viewingTeamId && effectiveStatus(p) === "sold").length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-lg text-[#abb4bd] font-bold">No players sold to this team yet.</p>
              </div>
            ) : (
              effectivePlayers.filter(p => p.teamId === viewingTeamId && effectiveStatus(p) === "sold").map((p) => {
                const isDummy = p.phone.startsWith("90000000");
                const pNumber = isDummy ? parseInt(p.phone.slice(8)) : null;
                return (
                  <div key={p.id} className="flex items-center justify-between border-b border-[#5c6875]/30 py-4 hover:bg-[#2e343a]/40 px-3 rounded-2xl transition-colors">
                    <div className="flex items-center gap-4">
                      <FallbackImage
                        src={p.photo || ""}
                        alt={p.name}
                        className="size-14 sm:size-16 shrink-0 rounded-2xl object-cover object-top border-2 border-[#a1b5d8]/40 shadow-sm"
                        fallback={
                          <span className="display grid size-full place-items-center rounded-2xl bg-[#162235] text-lg font-black text-[#a1b5d8]">
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        }
                      />
                      <div className="min-w-0">
                        <div className="text-base sm:text-lg font-black text-[#fffcf7] truncate max-w-[240px]">{p.name}</div>
                        <div className="text-xs sm:text-sm text-[#abb4bd] font-semibold mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                          {pNumber && <span className="font-bold text-[#a1b5d8]">Player {pNumber}</span>}
                          {pNumber && <span className="text-[#5c6875]">•</span>}
                          <span>{p.sportFields?.["role"] || "-"}</span>
                          <span className="text-[#5c6875]">•</span>
                          <span>Grade {p.category || "-"}</span>
                          <span className="text-[#5c6875]">•</span>
                          <span>{p.customData ? p.customData.replace("Dominated Hand: ", "") : "-"}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-base sm:text-lg font-black text-[#c2d8b9] bg-[#23341d]/70 px-3.5 py-1.5 rounded-xl border border-[#47673a] shadow-sm">
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
        <DialogContent className="sm:max-w-2xl h-[600px] max-h-[85vh] flex flex-col rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-6">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-black border-b border-[#5c6875]/30 pb-3 capitalize text-[#fffcf7]">
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
                    <p className="text-lg text-[#abb4bd] font-bold">No players found in this category.</p>
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
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#5c6875]/30 p-3.5 bg-[#2e343a]/40 hover:bg-[#2e343a]/75 transition-colors shadow-sm animate-fade-in text-[#fffcf7]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <FallbackImage
                        src={p.photo || ""}
                        alt={p.name}
                        className="size-12 sm:size-14 shrink-0 rounded-2xl object-cover object-top border-2 border-[#a1b5d8]/40 shadow-sm"
                        fallback={
                          <span className="display grid size-full place-items-center rounded-2xl bg-[#162235] text-lg font-black text-[#a1b5d8]">
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-base sm:text-lg font-black text-[#fffcf7] truncate max-w-[240px]">{p.name}</div>
                        <div className="text-xs sm:text-sm text-[#abb4bd] font-semibold mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                          {pNumber && <span className="font-bold text-[#a1b5d8]">Player {pNumber}</span>}
                          {pNumber && <span className="text-[#5c6875]">•</span>}
                          <span>{p.sportFields?.["role"] || "-"}</span>
                          <span className="text-[#5c6875]">•</span>
                          <span>Grade {p.category || "-"}</span>
                          <span className="text-[#5c6875]">•</span>
                          <span>{p.customData ? p.customData.replace("Dominated Hand: ", "") : "-"}</span>
                        </div>
                      </div>
                    </div>
                    
                    {viewingStatusList === "sold" ? (
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs font-black text-[#a1b5d8] uppercase tracking-wider">{buyerTeam?.name || "Sold"}</span>
                        <span className="text-base sm:text-lg font-black text-[#c2d8b9] bg-[#23341d]/70 px-3.5 py-1.5 rounded-xl border border-[#47673a] shadow-sm">
                          🪙 {p.soldPrice?.toLocaleString() ?? "0"}
                        </span>
                      </div>
                    ) : viewingStatusList === "pending" ? (
                      <span className="text-sm font-bold text-[#a1b5d8] bg-[#162235]/70 px-3.5 py-1 rounded-full border border-[#4365a0] shrink-0">
                        Available
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-red-400 bg-[#45191f]/70 px-3.5 py-1 rounded-full border border-[#8b2635] shrink-0">
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
    </>
  );
}
