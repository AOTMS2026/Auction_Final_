import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, RefreshCw, RotateCcw, Search, Shuffle, SquareMousePointer, Plus, Minus, Gavel, X, FileText, Pencil, Check, Users, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FallbackImage } from "@/components/ui/fallback-image";
import { CurrentPlayerCard } from "@/components/auction/CurrentPlayerCard";
import { TeamBidCard } from "@/components/auction/TeamBidCard";
import { useTeams } from "@/hooks/useTeams";
import { usePlayers, playersQueryOptions } from "@/hooks/usePlayers";
import { ChangePlayerTeamModal } from "@/components/auction/ChangePlayerTeamModal";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { auctionDetailQueryOptions, teamsQueryOptions } from "@/lib/queries/auctions";
import { authClient } from "@/lib/auth-client";
import { computeTeamStats } from "@/lib/team-stats";
import { exportAuctionPDF } from "@/lib/pdf-export";
import { auctionClient, type Player, type Team } from "@/lib/auction-client";
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

    // Preload teams and players concurrently for zero-latency instant rendering
    void Promise.all([
      context.queryClient.prefetchQuery(teamsQueryOptions(params.id)),
      context.queryClient.prefetchQuery(playersQueryOptions(params.id)),
    ]);

    return { auction };
  },
  component: AuctioneerConsole,
});

function AuctioneerConsole() {
  const { auction } = Route.useLoaderData();
  const { mode: modeParam } = Route.useSearch();
  const mode: "trial" | "live" = modeParam ?? (auction.status === "live" ? "live" : "trial");

  useRealtimeUpdates(auction.id);

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
  const [replacedPlayerId, setReplacedPlayerId] = useState<string | null>(null);
  const [viewingTeamId, setViewingTeamId] = useState<string | null>(null);
  const [hasPromptedReset, setHasPromptedReset] = useState(false);
  const [lastSoldTeamId, setLastSoldTeamId] = useState<string | null>(null);
  const [viewingStatusList, setViewingStatusList] = useState<AuctionRoundStatus | null>(null);
  const [actionHistory, setActionHistory] = useState<string[]>([]);
  const [orderedTeams, setOrderedTeams] = useState<Team[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingSoldPlayerId, setEditingSoldPlayerId] = useState<string | null>(null);
  const [editingSoldAmount, setEditingSoldAmount] = useState<string>("");
  const [changeTeamPlayer, setChangeTeamPlayer] = useState<Player | null>(null);
  const [pickerTab, setPickerTab] = useState<"pending" | "unsold" | "all">("pending");
  const [isRepeatingUnsold, setIsRepeatingUnsold] = useState(false);

  async function handleSaveSoldPrice(playerId: string, playerName: string) {
    const val = parseFloat(editingSoldAmount);
    if (!Number.isFinite(val) || val < 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const targetPlayer = effectivePlayers.find((p) => p.id === playerId);
    const currentTeamId = targetPlayer?.teamId ?? viewingTeamId;

    setTrialOverrides((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        soldPrice: val,
        teamId: currentTeamId,
        auctionRoundStatus: "sold",
      },
    }));

    if (mode === "live") {
      try {
        await updatePlayer({
          id: playerId,
          patch: { soldPrice: val },
        });
        toast.success(`Updated ${playerName}'s sold price to 🪙 ${val.toLocaleString()}`);
      } catch {
        toast.error("Failed to update sold price in database.");
      }
    } else {
      toast.success(`Updated ${playerName}'s sold price to 🪙 ${val.toLocaleString()}`);
    }

    setEditingSoldPlayerId(null);
  }

  async function handleRepeatSinglePlayer(targetPlayer: Player) {
    // 1. Clear trial override locally
    setTrialOverrides((prev) => {
      const next = { ...prev };
      delete next[targetPlayer.id];
      return next;
    });

    // 2. In live mode, update status to pending in database
    if (mode === "live") {
      const toastId = toast.loading(`Repeating ${targetPlayer.name} back to auction...`);
      try {
        await updatePlayer({
          id: targetPlayer.id,
          patch: { auctionRoundStatus: "pending", teamId: null, soldPrice: null },
        });
        toast.success(`${targetPlayer.name} is back on the auction block!`, { id: toastId });
      } catch (err: any) {
        toast.error(err?.message || "Failed to repeat player in database.", { id: toastId });
        return;
      }
    } else {
      toast.success(`${targetPlayer.name} is back on the auction block!`);
    }

    // 3. Put player onto block immediately
    startNewLot(targetPlayer);
    setViewingStatusList(null);
    setPickerOpen(false);
    setSelectionMode("manual");
    reshuffleQueue(targetPlayer.id);
  }

  async function handleRepeatAllUnsold() {
    const unsoldList = effectivePlayers.filter((p) => effectiveStatus(p) === "unsold");
    if (unsoldList.length === 0) {
      toast.info("No unsold players to repeat.");
      return;
    }

    const count = unsoldList.length;
    setIsRepeatingUnsold(true);

    if (mode === "live") {
      const toastId = toast.loading(`Repeating all ${count} unsold players...`);
      try {
        await auctionClient.repeatUnsoldPlayers(auction.id);
        await refetchPlayers();
        toast.success(`All ${count} unsold players returned to the auction pool!`, { id: toastId });
      } catch (err: any) {
        toast.error(err?.message || "Failed to repeat unsold players in database.", { id: toastId });
        setIsRepeatingUnsold(false);
        return;
      }
    } else {
      // In trial mode, clear all unsold overrides
      setTrialOverrides((prev) => {
        const next = { ...prev };
        for (const [id, ov] of Object.entries(next)) {
          if (ov.auctionRoundStatus === "unsold") {
            delete next[id];
          }
        }
        return next;
      });
      toast.success(`All ${count} unsold players returned to the auction pool!`);
    }

    setIsRepeatingUnsold(false);
    setViewingStatusList(null);

    // If no player is on the block, place the first repeated player on the block
    if (!currentPlayer) {
      const first = unsoldList[0];
      if (first) {
        startNewLot(first);
        reshuffleQueue(first.id);
      }
    } else {
      reshuffleQueue();
    }
  }

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
      const nonPending = effectivePlayers.filter(
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

    const playerToUndo = effectivePlayers.find((p) => p.id === targetPlayerId);
    if (!playerToUndo) {
      toast.error("Player not found for undo.");
      return;
    }

    const previousTeamId = playerToUndo.teamId;
    const previousSoldPrice = playerToUndo.soldPrice;

    // Immediately remove local override so UI updates instantly
    setTrialOverrides((prev) => {
      const next = { ...prev };
      delete next[targetPlayerId!];
      return next;
    });

    if (mode === "live") {
      const toastId = toast.loading(`Undoing last action for ${playerToUndo.name}...`);
      try {
        await updatePlayer({
          id: targetPlayerId,
          patch: { teamId: null, soldPrice: null, auctionRoundStatus: "pending" },
        });
        toast.success(`Undid last action. ${playerToUndo.name} is now pending.`, { id: toastId });
      } catch (error) {
        toast.error("Failed to undo last action in database.", { id: toastId });
        return;
      }
    } else {
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
    setCurrentPlayerId(null);
    setSelectedTeamId(null);
    setLastSoldTeamId(null);
    setCurrentBid(auction.minimumBid);
    setSelectionMode("random");
    setActionHistory([]);
    setShuffledIds([]);
    setReplacedPlayerId(null);
    setTrialOverrides({});

    if (mode === "live") {
      const soldOrUnsold = players.filter(
        (p) => p.auctionRoundStatus === "sold" || p.auctionRoundStatus === "unsold"
      );
      if (soldOrUnsold.length > 0) {
        const toastId = toast.loading("Resetting all players back to pending in database...");
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
        } catch (error) {
          toast.error("Failed to reset some players in database.", { id: toastId });
        }
      } else {
        toast.success("Auction reset! All selection states cleared.");
      }
    } else {
      toast.success("Trial session cleared successfully!");
    }
  }

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
  }

  // Auto-select initial random player on start if none is currently selected
  useEffect(() => {
    if (playersPending || currentPlayerId) return;
    const pending = players.filter((p) => effectiveStatus(p) === "pending");
    if (pending.length > 0) {
      const queue = createShuffledQueue(pending);
      const firstId = queue[0];
      const firstPlayer = players.find((p) => p.id === firstId);
      if (firstPlayer) {
        startNewLot(firstPlayer);
        setShuffledIds(queue.filter((id) => id !== firstId));
      }
    }
  }, [playersPending]);

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

  function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i] as T;
      copy[i] = copy[j] as T;
      copy[j] = temp;
    }
    return copy;
  }

  function createShuffledQueue(
    pendingList: Player[],
    excludeId?: string,
    deprioritizeId?: string | null
  ): string[] {
    const pool = excludeId ? pendingList.filter((p) => p.id !== excludeId) : pendingList;
    const priorityPending = pool.filter((p) => getSpecialPriority(p.name) !== Infinity);
    const nonPriorityPending = pool.filter((p) => getSpecialPriority(p.name) === Infinity);

    const shuffledPriority = shuffleArray(priorityPending.map((p) => p.id));
    const shuffledNonPriority = shuffleArray(nonPriorityPending.map((p) => p.id));

    const combined = [...shuffledPriority, ...shuffledNonPriority];

    // If the deprioritized player (visible before manual selection) is at index 0 and others exist, swap them away
    if (deprioritizeId && combined.length > 1 && combined[0] === deprioritizeId) {
      const swapIndex = 1 + Math.floor(Math.random() * (combined.length - 1));
      const temp = combined[0]!;
      combined[0] = combined[swapIndex]!;
      combined[swapIndex] = temp;
    }

    return combined;
  }

  function reshuffleQueue(excludeId?: string, deprioritizeId?: string | null) {
    const currentPending = players.filter((p) => effectiveStatus(p) === "pending");
    const newQueue = createShuffledQueue(currentPending, excludeId, deprioritizeId ?? replacedPlayerId);
    setShuffledIds(newQueue);
    return newQueue;
  }

  // Keep shuffled queue synchronized with pending players
  useEffect(() => {
    if (playersPending) return;
    const pending = players.filter((p) => effectiveStatus(p) === "pending");
    const pendingIdsSet = new Set(pending.map((p) => p.id));

    setShuffledIds((prev) => {
      // If queue is empty and we have pending players, build full shuffled queue
      if (prev.length === 0 && pending.length > 0) {
        return createShuffledQueue(pending, currentPlayerId || undefined, replacedPlayerId);
      }
      // Filter out any IDs that are no longer pending
      const valid = prev.filter((id) => pendingIdsSet.has(id));
      // If new pending players appeared that aren't in queue, append them shuffled
      const missing = pending.filter((p) => !valid.includes(p.id) && p.id !== currentPlayerId);
      if (missing.length > 0) {
        return [...valid, ...createShuffledQueue(missing, undefined, replacedPlayerId)];
      }
      return valid;
    });
  }, [players, playersPending, mode, trialOverrides, currentPlayerId, replacedPlayerId]);

  // Helper to advance to the next player in the shuffled queue
  function advanceShuffledPlayer(currentId: string, soldTeamId?: string | null) {
    setSelectionMode("random");
    const nextPending = players.filter(
      (p) =>
        p.id !== currentId &&
        effectiveStatus(p) === "pending" &&
        trialOverrides[p.id]?.auctionRoundStatus !== "sold" &&
        trialOverrides[p.id]?.auctionRoundStatus !== "unsold"
    );
    const nextQueue = shuffledIds.filter((id) => id !== currentId);

    if (nextPending.length === 0) {
      setCurrentPlayerId(null);
      setSelectedTeamId(null);
      setReplacedPlayerId(null);

      // Check remaining unsold players (including the one just processed)
      const isJustUnsold = !soldTeamId;
      const remainingUnsold = players.filter((p) => {
        if (p.id === currentId) {
          return isJustUnsold;
        }
        return (trialOverrides[p.id]?.auctionRoundStatus ?? p.auctionRoundStatus) === "unsold";
      });

      if (remainingUnsold.length > 0) {
        setViewingStatusList("unsold");
        toast.info(
          `No more players available. Showing ${remainingUnsold.length} unsold player${
            remainingUnsold.length > 1 ? "s" : ""
          } to repeat again!`,
          { duration: 5000 }
        );
      } else {
        toast.info("No more players available. All players have been auctioned!", { duration: 5000 });
      }
      return;
    }

    // Find the next candidate ID from nextQueue
    let candidateId = nextQueue.find((id) => nextPending.some((p) => p.id === id));

    // If candidate is the player who was visible right before manual selection and other pending players exist, skip to another player
    if (replacedPlayerId && candidateId === replacedPlayerId && nextPending.length > 1) {
      const alternateId = nextQueue.find(
        (id) => id !== replacedPlayerId && nextPending.some((p) => p.id === id)
      );
      if (alternateId) {
        candidateId = alternateId;
      } else {
        const alternate = nextPending.find((p) => p.id !== replacedPlayerId);
        if (alternate) candidateId = alternate.id;
      }
    }

    let nextPlayer = candidateId ? players.find((p) => p.id === candidateId) : null;

    if (!nextPlayer) {
      const freshQueue = createShuffledQueue(nextPending, undefined, replacedPlayerId);
      const nextId = freshQueue[0];
      nextPlayer = players.find((p) => p.id === nextId) ?? null;
      setShuffledIds(freshQueue.filter((id) => id !== nextId));
    } else {
      setShuffledIds(nextQueue.filter((id) => id !== nextPlayer!.id));
    }

    // Clear replacedPlayerId once we advance
    setReplacedPlayerId(null);

    if (nextPlayer) {
      startNewLot(nextPlayer, soldTeamId);
    } else {
      setCurrentPlayerId(null);
      setSelectedTeamId(null);
    }
  }

  function effectiveStatus(player: Player): AuctionRoundStatus {
    return trialOverrides[player.id]?.auctionRoundStatus ?? player.auctionRoundStatus ?? "pending";
  }

  const effectivePlayers: Player[] = players.map((p) => {
    const override = trialOverrides[p.id];
    return override
      ? {
          ...p,
          teamId: override.teamId !== undefined ? override.teamId : p.teamId,
          soldPrice: override.soldPrice !== undefined ? override.soldPrice : p.soldPrice,
          auctionRoundStatus: override.auctionRoundStatus || p.auctionRoundStatus,
        }
      : p;
  });

  const teamStatsMap = useMemo(() => {
    const teamSoldPlayersMap = new Map<string, Player[]>();
    for (const p of effectivePlayers) {
      if (p.teamId && (p.auctionRoundStatus === "sold" || ((p.soldPrice ?? 0) > 0))) {
        const list = teamSoldPlayersMap.get(p.teamId) || [];
        list.push(p);
        teamSoldPlayersMap.set(p.teamId, list);
      }
    }

    const map = new Map<string, ReturnType<typeof computeTeamStats>>();
    for (const team of teams) {
      const teamPlayers = teamSoldPlayersMap.get(team.id) || [];
      let usedPoints = 0;
      for (const p of teamPlayers) {
        if (p.soldPrice) usedPoints += p.soldPrice;
      }
      const totalPoints = auction.pointsPerTeam;
      const availablePoints = Math.max(0, totalPoints - usedPoints);
      const totalPlayers = teamPlayers.length;
      const reservedPlayers = Math.max(0, auction.playersPerTeam - totalPlayers);
      const maxBidPoints =
        reservedPlayers > 0
          ? Math.min(auction.maxBid ?? 30000, availablePoints - (reservedPlayers - 1) * auction.minimumBid)
          : 0;

      map.set(team.id, {
        usedPoints,
        totalPoints,
        availablePoints,
        totalPlayers,
        reservedPlayers,
        maxBidPoints: maxBidPoints > 0 ? maxBidPoints : 0,
      });
    }
    return map;
  }, [teams, effectivePlayers, auction]);

  const playerSNoMap = useMemo(() => {
    const map = new Map<string, number>();
    players.forEach((p, idx) => {
      map.set(p.id, idx + 1);
    });
    return map;
  }, [players]);

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
    if (selectionMode === "random" && currentPlayer) {
      toast.warning("A player is already on the auction block. Please mark them as Sold or Unsold first.");
      return;
    }

    const availablePending = currentPlayerId
      ? pendingPlayers.filter((p) => p.id !== currentPlayerId)
      : pendingPlayers;

    if (availablePending.length === 0) {
      if (unsoldCount > 0) {
        setViewingStatusList("unsold");
        toast.info(
          `No more players available. Showing ${unsoldCount} unsold player${
            unsoldCount > 1 ? "s" : ""
          } to repeat again!`,
          { duration: 5000 }
        );
        return;
      }
      toast.info("No more players available. All players have been auctioned!", { duration: 5000 });
      return;
    }
    if (selectionMode === "random") {
      let candidateId = shuffledIds.find((id) => availablePending.some((p) => p.id === id));

      if (replacedPlayerId && candidateId === replacedPlayerId && availablePending.length > 1) {
        const alternateId = shuffledIds.find(
          (id) => id !== replacedPlayerId && availablePending.some((p) => p.id === id)
        );
        if (alternateId) {
          candidateId = alternateId;
        } else {
          const alternate = availablePending.find((p) => p.id !== replacedPlayerId);
          if (alternate) candidateId = alternate.id;
        }
      }

      let next = candidateId ? players.find((p) => p.id === candidateId) : null;

      if (!next) {
        const freshQueue = createShuffledQueue(availablePending, undefined, replacedPlayerId);
        const nextId = freshQueue[0];
        next = players.find((p) => p.id === nextId) ?? null;
        setShuffledIds(freshQueue.filter((id) => id !== nextId));
      } else {
        setShuffledIds((prev) => prev.filter((id) => id !== next!.id));
      }

      setReplacedPlayerId(null);

      if (next) {
        startNewLot(next);
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
    // Guard roster count
    const selectedTeam = teams.find((t) => t.id === selectedTeamId);
    const selectedTeamStats = teamStatsMap.get(selectedTeamId);
    if (selectedTeam && selectedTeamStats && selectedTeamStats.reservedPlayers <= 0) {
      toast.error("Max team reached");
      return;
    }

    const soldId = currentPlayer.id;
    const soldPrice = currentBid;
    const teamId = selectedTeamId;

    // Apply immediate local state update so live mode works with the same instant responsiveness as trial mode
    setTrialOverrides((prev) => ({
      ...prev,
      [soldId]: { teamId, soldPrice, auctionRoundStatus: "sold" },
    }));

    if (mode === "live") {
      updatePlayer({
        id: soldId,
        patch: { teamId, soldPrice, auctionRoundStatus: "sold" },
      }).catch((error) => {
        // Revert local override if backend fails
        setTrialOverrides((prev) => {
          const next = { ...prev };
          delete next[soldId];
          return next;
        });
        toast.error(error instanceof Error ? error.message : "Failed to record sale in database.");
      });
    }

    toast.success(`${currentPlayer.name} sold to ${selectedTeam?.name || "Team"} for 🪙 ${soldPrice.toLocaleString()}.`);
    setLastSoldTeamId(teamId);
    setActionHistory((prev) => [...prev, soldId]);
    advanceShuffledPlayer(soldId, teamId);
  }

  async function handleUnsold() {
    if (!currentPlayer) return;
    const unsoldId = currentPlayer.id;

    // Apply immediate local state update
    setTrialOverrides((prev) => ({
      ...prev,
      [unsoldId]: { teamId: null, soldPrice: null, auctionRoundStatus: "unsold" },
    }));

    if (mode === "live") {
      updatePlayer({
        id: unsoldId,
        patch: { teamId: null, soldPrice: null, auctionRoundStatus: "unsold" },
      }).catch((error) => {
        setTrialOverrides((prev) => {
          const next = { ...prev };
          delete next[unsoldId];
          return next;
        });
        toast.error(error instanceof Error ? error.message : "Failed to mark unsold in database.");
      });
    }

    toast.info(`${currentPlayer.name} marked unsold.`);
    setActionHistory((prev) => [...prev, unsoldId]);
    advanceShuffledPlayer(unsoldId, null);
  }

  const unsoldPlayers = players.filter((p) => effectiveStatus(p) === "unsold");

  const pendingPriorityPlayers = pendingPlayers.filter(
    (p) => getSpecialPriority(p.name) !== Infinity
  );
  const basePickerPlayers = [
    ...pendingPriorityPlayers,
    ...pendingPlayers.filter((p) => getSpecialPriority(p.name) === Infinity)
  ];

  const pickerSourcePlayers =
    pickerTab === "unsold"
      ? unsoldPlayers
      : pickerTab === "all"
        ? [...basePickerPlayers, ...unsoldPlayers]
        : basePickerPlayers;

  const filteredPickerPlayers = pickerSourcePlayers.filter((p) => {
    const rawQuery = pickerQuery.trim().toLowerCase();
    if (!rawQuery) return true;

    const sNo = playerSNoMap.get(p.id);

    // Check if query is numeric or starts with S.No prefix (e.g. "1", "#1", "sno 1", "s.no 1", "s.no#1")
    const cleanNumQuery = rawQuery.replace(/^(#|s\.?no\.?\s*#?)/i, "").trim();
    const isNumericQuery = /^\d+$/.test(cleanNumQuery);

    if (isNumericQuery) {
      const targetSNo = parseInt(cleanNumQuery, 10);
      // Exact S.No match
      if (sNo === targetSNo) return true;

      // Name match if name explicitly contains the digits (e.g. "Player 1")
      const name = p.name.toLowerCase();
      if (name.includes(rawQuery) || name.includes(cleanNumQuery)) return true;

      // Mobile phone match only for queries with 3 or more digits to prevent 1-2 digit S.No search pollution
      const phone = p.phone.toLowerCase();
      if (cleanNumQuery.length >= 3 && phone.includes(cleanNumQuery)) return true;

      return false;
    }

    const name = p.name.toLowerCase();
    const phone = p.phone.toLowerCase();
    const role = (p.sportFields?.["role"] || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    const city = (p.city || "").toLowerCase();

    return (
      name.includes(rawQuery) ||
      phone.includes(rawQuery) ||
      role.includes(rawQuery) ||
      category.includes(rawQuery) ||
      city.includes(rawQuery)
    );
  });

  return (
    <>
      <div
        className="flex h-screen w-full flex-col overflow-hidden text-[#ffffff] select-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)",
        }}
      >
      <header className="h-14 shrink-0 flex items-center gap-3 border-b border-[#38bdf8]/40 bg-[#142630]/95 backdrop-blur-md px-6 text-[#ffffff]">
        <Button variant="ghost" size="icon" asChild className="text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#1f3a47] rounded-xl">
          <Link to="/my-auctions/$id" params={{ id: auction.id }} aria-label="Back to dashboard">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <FallbackImage
          src={auction.coverImage || ""}
          alt=""
          className="size-10 shrink-0 rounded-xl border-2 border-[#38bdf8]/60 object-cover shadow-sm"
          fallback={
            <span className="display grid size-full place-items-center rounded-xl bg-[#162a34] text-sm font-black text-[#38bdf8] shadow-sm">
              {auction.name.slice(0, 2).toUpperCase()}
            </span>
          }
        />
        <h1 className="truncate text-xl font-black tracking-tight text-[#ffffff] drop-shadow-sm">{auction.name}</h1>

        {/* Prominent Mode Badge (Test Mode vs Live Mode) */}
        <div className="flex items-center">
          {mode === "trial" ? (
            <span className="px-3.5 py-1 rounded-full border-2 border-[#38bdf8] bg-[#162a34] text-[#38bdf8] text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.45)]">
              🧪 Test Mode
            </span>
          ) : (
            <span className="px-3.5 py-1 rounded-full border-2 border-emerald-400 bg-emerald-950 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-1.5 animate-pulse">
              <span className="size-2 rounded-full bg-emerald-400" />
              🔴 Live Mode
            </span>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportAuctionPDF(auction, effectivePlayers, orderedTeams.length > 0 ? orderedTeams : teams);
              toast.success("Auction PDF Report downloaded!");
            }}
            className="h-9 px-3.5 rounded-xl border-2 border-[#38bdf8]/60 bg-[#162a34] text-[#ffffff] hover:bg-[#38bdf8] hover:text-[#142630] flex items-center gap-1.5 text-xs font-black transition-all shadow-sm cursor-pointer"
            title="Download Full Auction Summary PDF"
          >
            <FileText className="size-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
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
              sNo={playerSNoMap.get(currentPlayer.id)}
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
            <div className="rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a34]/90 backdrop-blur-xl p-8 sm:p-12 text-center text-[#f2e9dc] shadow-2xl flex flex-col items-center justify-center gap-5 h-full">
              {pendingPlayers.length === 0 && unsoldCount > 0 ? (
                <div className="flex flex-col items-center max-w-lg mx-auto animate-fade-in">
                  <div className="size-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] animate-pulse mb-2">
                    <RotateCcw className="size-10 stroke-[2.5]" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full border border-amber-500/60 bg-amber-950/70 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                    No More Players Available
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Repeat Unsold Players
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-[#a1b5d8] mt-2 leading-relaxed">
                    All regular players have been auctioned. You have <span className="text-amber-400 font-black">{unsoldCount} Unsold player{unsoldCount > 1 ? "s" : ""}</span> ready to repeat again for the next round.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    <Button
                      type="button"
                      disabled={isRepeatingUnsold}
                      onClick={handleRepeatAllUnsold}
                      className="rounded-2xl px-6 py-3.5 h-auto font-black text-sm text-white bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-105 active:scale-95 transition-all border border-white/30 flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="size-4" />
                      Repeat All Unsold Players ({unsoldCount})
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setViewingStatusList("unsold")}
                      className="rounded-2xl px-5 py-3.5 h-auto font-bold text-sm text-[#38bdf8] border-2 border-[#38bdf8]/50 bg-[#142630] hover:bg-[#1a3847] hover:text-white transition-all cursor-pointer shadow-md flex items-center gap-2"
                    >
                      <Users className="size-4" />
                      View Unsold List ({unsoldCount})
                    </Button>
                  </div>
                </div>
              ) : pendingPlayers.length === 0 && soldCount > 0 ? (
                <div className="flex flex-col items-center max-w-lg mx-auto animate-fade-in">
                  <div className="size-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)] mb-3">
                    <CheckCircle className="size-10 stroke-[2.5]" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full border border-emerald-500/60 bg-emerald-950/70 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                    Auction Completed
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    All Players Sold!
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-[#a1b5d8] mt-2">
                    No more players available. All {soldCount} players have been successfully auctioned.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        exportAuctionPDF(auction, effectivePlayers, orderedTeams.length > 0 ? orderedTeams : teams);
                        toast.success("Auction PDF Report downloaded!");
                      }}
                      className="rounded-2xl px-6 py-3.5 h-auto font-black text-sm text-white bg-[#162a34] border-2 border-[#38bdf8]/60 hover:bg-[#38bdf8] hover:text-[#142630] flex items-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      <FileText className="size-4" /> Download PDF Report
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-lg font-black text-[#ffffff]">Tap "New Player" at the bottom to begin.</p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Teams List (Vertical Grid) */}
        <div className="w-[480px] shrink-0 flex flex-col h-full bg-[#162a34]/90 backdrop-blur-xl border-2 border-[#38bdf8]/40 rounded-3xl p-3.5 shadow-[0_15px_45px_rgba(15,35,45,0.85)] select-none overflow-hidden text-[#ffffff]">
          <div className="shrink-0 border-b border-[#38bdf8]/30 pb-2 mb-2 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">Teams</h2>
            <span className="text-[10px] text-[#f97316] font-black uppercase tracking-wider">Bidding Team Selection</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2">
              {orderedTeams.map((team, index) => (
                <TeamBidCard
                  key={team.id}
                  team={team}
                  stats={teamStatsMap.get(team.id) || computeTeamStats(team, effectivePlayers, auction)}
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
      <div className="shrink-0 border-t border-[#38bdf8]/40 bg-[#142630]/98 backdrop-blur-xl p-3 select-none text-[#ffffff]">
        <div className="mx-auto max-w-[1800px] w-full flex items-center justify-between gap-4">
          
          {/* New Player Mode & Button */}
          <div className="flex items-center gap-3 bg-[#162a34] border-2 border-[#38bdf8]/40 p-2 rounded-2xl shrink-0">
            <div className="flex flex-col items-center gap-1.5 border-r border-[#38bdf8]/30 pr-3">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#38bdf8] leading-none">New Player Mode</span>
              <div className="flex gap-1 w-36">
                <button
                  type="button"
                  onClick={() => {
                    setSelectionMode("random");
                    reshuffleQueue(currentPlayerId || undefined);
                  }}
                  className={cn(
                    "rounded-xl p-1.5 transition-all border flex-1 flex items-center justify-center gap-1 text-[10px] font-black cursor-pointer",
                    selectionMode === "random"
                      ? "bg-[#38bdf8] text-[#142630] border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.5)] font-black"
                      : "bg-[#142630] text-[#f2e9dc]/70 border-[#38bdf8]/30 hover:bg-[#1a3847] hover:text-[#ffffff]",
                  )}
                  title="Random Selection"
                >
                  <Shuffle className="size-3" />
                  Random
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectionMode("manual");
                    if (pendingPlayers.length === 0 && unsoldCount > 0) {
                      setPickerTab("unsold");
                    }
                  }}
                  className={cn(
                    "rounded-xl p-1.5 transition-all border flex-1 flex items-center justify-center gap-1 text-[10px] font-black cursor-pointer",
                    selectionMode === "manual"
                      ? "bg-[#38bdf8] text-[#142630] border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.5)] font-black"
                      : "bg-[#142630] text-[#f2e9dc]/70 border-[#38bdf8]/30 hover:bg-[#1a3847] hover:text-[#ffffff]",
                  )}
                  title="Manual Selection"
                >
                  <SquareMousePointer className="size-3" />
                  Manual
                </button>
              </div>
            </div>
            <Button
              className={cn(
                "rounded-xl px-5 h-9 font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30 shrink-0",
                selectionMode === "random" && !!currentPlayer && "opacity-50 cursor-not-allowed"
              )}
              disabled={selectionMode === "random" && !!currentPlayer}
              onClick={handleNewPlayer}
            >
              New Player
            </Button>
          </div>

          {/* Bid Controls (Horizontal Flex) */}
          <div className="flex-1 flex items-center gap-3 justify-center max-w-[680px]">
            <Button 
              variant="outline" 
              className="h-10 flex-1 max-w-[160px] text-xs sm:text-sm font-black rounded-xl shadow-md border-2 border-[#38bdf8]/60 bg-[#162a34] text-[#ffffff] hover:bg-[#204554] hover:border-[#38bdf8] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer" 
              disabled={!currentPlayer} 
              onClick={() => handleBid(1)}
            >
              <Plus className="size-4 text-[#38bdf8]" /> Bid Up
            </Button>
            <Button 
              variant="outline" 
              className="h-10 flex-1 max-w-[160px] text-xs sm:text-sm font-black rounded-xl shadow-md border-2 border-[#38bdf8]/60 bg-[#162a34] text-[#ffffff] hover:bg-[#204554] hover:border-[#38bdf8] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer" 
              disabled={!currentPlayer} 
              onClick={() => handleBid(-1)}
            >
              <Minus className="size-4 text-[#38bdf8]" /> Bid Down
            </Button>
            
            <div className="h-6 w-px bg-[#38bdf8]/40 mx-1" />

            <Button
              className="h-10 flex-1 max-w-[180px] text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.55)] hover:scale-105 flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-white/30 cursor-pointer"
              disabled={!currentPlayer}
              onClick={handleSold}
            >
              <Gavel className="size-4" /> Sold
            </Button>
            <Button 
              variant="destructive" 
              className="h-10 flex-1 max-w-[180px] text-xs sm:text-sm font-black bg-gradient-to-r from-rose-600 via-rose-500 to-red-500 hover:from-rose-500 hover:to-red-400 text-white rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:scale-105 flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-white/30 cursor-pointer" 
              disabled={!currentPlayer} 
              onClick={handleUnsold}
            >
              <X className="size-4" /> Unsold
            </Button>
          </div>

          {/* Statistics (Horizontal Row) */}
          <div className="flex items-center gap-2.5 border-l border-[#5c6875]/40 pl-4 shrink-0">
            <div className="flex flex-col gap-1.5 w-48 sm:w-56">
              <button 
                type="button"
                onClick={() => setViewingStatusList("sold")}
                className="rounded-full bg-[#23341d]/85 hover:bg-[#23341d] h-9 px-4 text-[#c2d8b9] border border-[#47673a] active:scale-95 transition-all text-xs sm:text-sm font-black cursor-pointer text-center flex items-center justify-center shadow-sm"
              >
                Sold {soldCount}
              </button>
              <button 
                type="button"
                onClick={() => setViewingStatusList("unsold")}
                className="rounded-full bg-[#45191f]/85 hover:bg-[#45191f] h-9 px-4 text-[#fca5a5] border border-[#8b2635] active:scale-95 transition-all text-xs sm:text-sm font-black cursor-pointer text-center flex items-center justify-center shadow-sm"
              >
                Unsold {unsoldCount}
              </button>
            </div>
            <div className="flex flex-col gap-1.5 w-48 sm:w-56">
              <button 
                type="button"
                onClick={() => setViewingStatusList("pending")}
                className="rounded-full bg-[#162235]/90 hover:bg-[#162235] h-9 px-4 text-[#a1b5d8] border border-[#4365a0] active:scale-95 transition-all text-xs sm:text-sm font-black cursor-pointer text-center flex items-center justify-center shadow-sm"
              >
                Available {pendingPlayers.length}
              </button>
              <span className="rounded-full bg-[#2e343a]/80 h-9 px-4 text-[#fffcf7] border border-[#5c6875]/40 select-none text-xs sm:text-sm font-black text-center flex items-center justify-center shadow-sm">
                Team {teams.length}
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[88vh] flex flex-col rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-5 sm:p-6">
          <DialogHeader className="shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#5c6875]/30 pb-3 gap-2">
              <DialogTitle className="text-xl sm:text-2xl font-black text-[#fffcf7] tracking-tight">
                Pick a player <span className="text-base text-[#a1b5d8] font-bold">({filteredPickerPlayers.length})</span>
              </DialogTitle>
              <div className="flex items-center gap-1 bg-[#142630] p-1 rounded-xl border border-[#38bdf8]/30 shrink-0">
                <button
                  type="button"
                  onClick={() => setPickerTab("pending")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    pickerTab === "pending"
                      ? "bg-[#38bdf8] text-[#142630] font-black shadow-sm"
                      : "text-[#abb4bd] hover:text-white"
                  )}
                >
                  Available ({pendingPlayers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPickerTab("unsold")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    pickerTab === "unsold"
                      ? "bg-rose-500 text-white font-black shadow-sm"
                      : "text-rose-400 hover:text-rose-300"
                  )}
                >
                  Unsold ({unsoldCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPickerTab("all")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    pickerTab === "all"
                      ? "bg-[#2e343a] text-white font-black shadow-sm"
                      : "text-[#abb4bd] hover:text-white"
                  )}
                >
                  All ({pendingPlayers.length + unsoldCount})
                </button>
              </div>
            </div>
          </DialogHeader>
          <div className="relative mt-2 shrink-0">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#abb4bd]" />
            <Input
              placeholder="Search by player name, number, or role..."
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/60 focus-visible:ring-[#a1b5d8]"
            />
          </div>
          <div className="flex-1 overflow-y-auto mt-2 pr-1 min-h-[300px] max-h-[65vh]">
            {filteredPickerPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[250px]">
                <p className="text-sm sm:text-base text-[#abb4bd] font-bold">
                  {pickerTab === "unsold"
                    ? "No unsold players found."
                    : pickerTab === "pending"
                      ? "No available players found."
                      : "No players found."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredPickerPlayers.map((p) => {
                  const sNo = playerSNoMap.get(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        const isCurrentlyUnsold = effectiveStatus(p) === "unsold";
                        if (isCurrentlyUnsold) {
                          handleRepeatSinglePlayer(p);
                          return;
                        }

                        const previouslyVisibleId =
                          currentPlayer &&
                          effectiveStatus(currentPlayer) === "pending" &&
                          currentPlayer.id !== p.id
                            ? currentPlayer.id
                            : null;

                        if (previouslyVisibleId) {
                          setReplacedPlayerId(previouslyVisibleId);
                        }

                        startNewLot(p);
                        setPickerOpen(false);
                        setPickerQuery("");
                        setSelectionMode("manual");
                        reshuffleQueue(p.id, previouslyVisibleId);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-2xl border border-[#5c6875]/35 bg-[#2e343a]/50 p-2 text-left hover:bg-[#2e343a] hover:border-[#a1b5d8] active:scale-[0.99] transition-all text-[#fffcf7] cursor-pointer group shadow-sm"
                    >
                      <FallbackImage
                        src={p.photo || ""}
                        alt={p.name}
                        className="size-11 sm:size-12 shrink-0 rounded-xl object-cover object-top border border-[#a1b5d8]/30 group-hover:border-[#a1b5d8] transition-colors"
                        fallback={
                          <span className="display grid size-full place-items-center rounded-xl bg-[#162235] text-xs font-black text-[#a1b5d8]">
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-black text-[#fffcf7] truncate group-hover:text-[#a1b5d8] transition-colors flex items-center justify-between">
                          <span>{p.name}</span>
                          <div className="flex items-center gap-1.5 ml-2 shrink-0">
                            {effectiveStatus(p) === "unsold" && (
                              <span className="text-[10px] font-black uppercase text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/50 flex items-center gap-1">
                                <RotateCcw className="size-2.5" /> Unsold
                              </span>
                            )}
                            {sNo && <span className="text-[11px] font-bold text-[#38bdf8]">(S.No #{sNo})</span>}
                          </div>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-[#abb4bd] font-semibold mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 truncate">
                          <span className="text-[#ecf0f7]">{p.sportFields?.["role"] || "-"}</span>
                          <span className="text-[#5c6875]">•</span>
                          <span className="text-[#c2d8b9]">Grade {p.category || "-"}</span>
                          {p.customData && (
                            <>
                              <span className="text-[#5c6875]">•</span>
                              <span>{p.customData.replace("Dominated Hand: ", "")}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
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
                    {editingSoldPlayerId === p.id ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Input
                          type="number"
                          value={editingSoldAmount}
                          onChange={(e) => setEditingSoldAmount(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveSoldPrice(p.id, p.name);
                            if (e.key === "Escape") setEditingSoldPlayerId(null);
                          }}
                          autoFocus
                          className="w-24 sm:w-28 h-9 text-xs sm:text-sm font-black text-[#c2d8b9] bg-[#0f1712] border-2 border-emerald-500 rounded-xl text-center focus-visible:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveSoldPrice(p.id, p.name)}
                          className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Save price"
                        >
                          <Check className="size-4 stroke-[3]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSoldPlayerId(null)}
                          className="size-8 rounded-xl bg-[#142630] border border-[#38bdf8]/35 text-[#abb4bd] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Cancel"
                        >
                          <X className="size-4 stroke-[2.5]" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-base sm:text-lg font-black text-[#c2d8b9] bg-[#23341d]/70 px-3.5 py-1.5 rounded-xl border border-[#47673a] shadow-sm flex items-center gap-1">
                          🪙 {p.soldPrice?.toLocaleString() ?? "0"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSoldPlayerId(p.id);
                            setEditingSoldAmount((p.soldPrice ?? 0).toString());
                          }}
                          className="text-[#a1b5d8] hover:text-white p-2 hover:bg-[#2e343a] rounded-xl transition-all border border-[#5c6875]/40 hover:border-[#a1b5d8] cursor-pointer"
                          title="Edit sold price"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setChangeTeamPlayer(p)}
                          className="text-[#38bdf8] hover:text-white p-2 hover:bg-[#2e343a] rounded-xl transition-all border border-[#5c6875]/40 hover:border-[#38bdf8] cursor-pointer"
                          title="Change team"
                        >
                          <Users className="size-4" />
                        </button>
                      </div>
                    )}
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
            <div className="flex items-center justify-between border-b border-[#5c6875]/30 pb-3 flex-wrap gap-2">
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-black capitalize text-[#fffcf7] flex items-center gap-2">
                  {viewingStatusList === "unsold" && pendingPlayers.length === 0 ? (
                    <>
                      <span>Unsold Players List</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        No More Players Available
                      </span>
                    </>
                  ) : (
                    <>
                      {viewingStatusList === "pending" ? "Available" : viewingStatusList} Players ({
                        viewingStatusList === "pending"
                          ? pendingPlayers.length
                          : viewingStatusList === "sold"
                            ? soldCount
                            : unsoldCount
                      })
                    </>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#a1b5d8] font-semibold mt-1">
                  {viewingStatusList === "unsold"
                    ? pendingPlayers.length === 0
                      ? "All regular players have been auctioned. Repeat unsold players to continue the auction round."
                      : "Unsold players pool. You can repeat individual players or repeat all at once."
                    : viewingStatusList === "sold"
                      ? "List of all players sold in this auction. You can edit prices or change teams."
                      : "Players currently waiting on the auction queue."}
                </DialogDescription>
              </div>
              {viewingStatusList === "unsold" && unsoldCount > 0 && (
                <Button
                  type="button"
                  disabled={isRepeatingUnsold}
                  onClick={handleRepeatAllUnsold}
                  className="rounded-xl px-4 h-9 font-black text-xs text-white bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.6)] flex items-center gap-1.5 active:scale-95 transition-all border border-white/30 cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  Repeat All Unsold ({unsoldCount})
                </Button>
              )}
            </div>
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
                        {editingSoldPlayerId === p.id ? (
                          <div className="flex items-center gap-1.5 shrink-0 mt-1">
                            <Input
                              type="number"
                              value={editingSoldAmount}
                              onChange={(e) => setEditingSoldAmount(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveSoldPrice(p.id, p.name);
                                if (e.key === "Escape") setEditingSoldPlayerId(null);
                              }}
                              autoFocus
                              className="w-24 sm:w-28 h-9 text-xs sm:text-sm font-black text-[#c2d8b9] bg-[#0f1712] border-2 border-emerald-500 rounded-xl text-center focus-visible:ring-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveSoldPrice(p.id, p.name)}
                              className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                              title="Save price"
                            >
                              <Check className="size-4 stroke-[3]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingSoldPlayerId(null)}
                              className="size-8 rounded-xl bg-[#142630] border border-[#38bdf8]/35 text-[#abb4bd] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                              title="Cancel"
                            >
                              <X className="size-4 stroke-[2.5]" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-base sm:text-lg font-black text-[#c2d8b9] bg-[#23341d]/70 px-3.5 py-1.5 rounded-xl border border-[#47673a] shadow-sm flex items-center gap-1">
                              🪙 {p.soldPrice?.toLocaleString() ?? "0"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSoldPlayerId(p.id);
                                setEditingSoldAmount((p.soldPrice ?? 0).toString());
                              }}
                              className="text-[#a1b5d8] hover:text-white p-2 hover:bg-[#2e343a] rounded-xl transition-all border border-[#5c6875]/40 hover:border-[#a1b5d8] cursor-pointer"
                              title="Edit sold price"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setChangeTeamPlayer(p)}
                              className="text-[#38bdf8] hover:text-white p-2 hover:bg-[#2e343a] rounded-xl transition-all border border-[#5c6875]/40 hover:border-[#38bdf8] cursor-pointer"
                              title="Change team"
                            >
                              <Users className="size-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : viewingStatusList === "pending" ? (
                      <span className="text-sm font-bold text-[#a1b5d8] bg-[#162235]/70 px-3.5 py-1 rounded-full border border-[#4365a0] shrink-0">
                        Available
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-red-400 bg-[#45191f]/70 px-3 py-1 rounded-full border border-[#8b2635]">
                          Unsold
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRepeatSinglePlayer(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#38bdf8]/20 to-[#0284c7]/20 border border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#142630] font-black text-xs transition-all cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.3)] active:scale-95"
                          title="Repeat this player and put on auction block"
                        >
                          <RotateCcw className="size-3.5" />
                          Repeat & Auction
                        </button>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {changeTeamPlayer && (
        <ChangePlayerTeamModal
          auction={auction}
          player={changeTeamPlayer}
          teams={teams}
          players={effectivePlayers}
          open={!!changeTeamPlayer}
          onOpenChange={(open) => {
            if (!open) setChangeTeamPlayer(null);
          }}
          onSuccess={() => {
            refetchPlayers();
          }}
        />
      )}
    </>
  );
}
