import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { apiBase } from "@/lib/api-client";
import { auctionKeys } from "@/lib/queries/auctions";

export type RealtimeAuctionEventCallbacks = {
  onPlayerSold?: (data: { player: any; teamName?: string; price: number }) => void;
  onPlayerUnsold?: (data: { player: any }) => void;
  onStageUpdate?: (data: { currentPlayerId: string | null; currentBid: number; selectedTeamId: string | null }) => void;
  onBidUpdate?: (data: { bid: number; playerName?: string; teamName?: string }) => void;
  enableToasts?: boolean;
};

// Global deduplication cache to prevent duplicate toasts for the same event across listeners
const recentToastCache = new Set<string>();

export function useRealtimeUpdates(
  auctionId: string | undefined,
  callbacks?: RealtimeAuctionEventCallbacks
) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef<RealtimeAuctionEventCallbacks | undefined>(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!auctionId) return;

    const socket = io(apiBase(), {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[socket] Connected to real-time server for auction:", auctionId);
      socket.emit("join-auction", auctionId);
    });

    // 1. Direct Real-Time Event: Player Sold
    socket.on("playerSold", (data: { player: any; teamName?: string; price: number }) => {
      console.log("[socket] playerSold event received:", data);
      const cacheKey = `sold-${data.player?.id}-${data.price}`;
      if (!recentToastCache.has(cacheKey)) {
        recentToastCache.add(cacheKey);
        setTimeout(() => recentToastCache.delete(cacheKey), 5000);

        if (callbacksRef.current?.enableToasts !== false) {
          toast.success(
            `🎉 ${data.player?.name || "Player"} SOLD to ${data.teamName || "Team"} for 🪙 ${Number(data.price || 0).toLocaleString()}!`,
            {
              duration: 6000,
              description: `Role: ${data.player?.sportFields?.role || data.player?.sportFields?.Role || "Player"} • Grade: ${data.player?.category || "-"}`,
            }
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: ["players", auctionId] });
      queryClient.invalidateQueries({ queryKey: auctionKeys.teams(auctionId) });
      callbacksRef.current?.onPlayerSold?.(data);
    });

    // 2. Direct Real-Time Event: Player Unsold
    socket.on("playerUnsold", (data: { player: any }) => {
      console.log("[socket] playerUnsold event received:", data);
      const cacheKey = `unsold-${data.player?.id}`;
      if (!recentToastCache.has(cacheKey)) {
        recentToastCache.add(cacheKey);
        setTimeout(() => recentToastCache.delete(cacheKey), 5000);

        if (callbacksRef.current?.enableToasts !== false) {
          toast.error(`❌ ${data.player?.name || "Player"} marked UNSOLD`, {
            duration: 5000,
            description: "Player will be available to repeat in the next auction round.",
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: ["players", auctionId] });
      queryClient.invalidateQueries({ queryKey: auctionKeys.teams(auctionId) });
      callbacksRef.current?.onPlayerUnsold?.(data);
    });

    // 3. Direct Real-Time Event: Stage / Current Player sync
    socket.on("stageUpdate", (data: { currentPlayerId: string | null; currentBid: number; selectedTeamId: string | null }) => {
      console.log("[socket] stageUpdate event received:", data);
      callbacksRef.current?.onStageUpdate?.(data);
    });

    // 4. Direct Real-Time Event: Live Bid Placement
    socket.on("bidUpdate", (data: { bid: number; playerName?: string; teamName?: string }) => {
      console.log("[socket] bidUpdate event received:", data);
      if (callbacksRef.current?.enableToasts !== false && data.playerName) {
        toast.info(
          `⚡ Live Bid: 🪙 ${Number(data.bid).toLocaleString()} by ${data.teamName || "Team"} for ${data.playerName}`,
          { duration: 2500 }
        );
      }
      callbacksRef.current?.onBidUpdate?.(data);
    });

    // 5. Backend playerUpdated listener (fallback sync)
    socket.on("playerUpdated", (updatedPlayer: any) => {
      console.log("[socket] Player updated in database:", updatedPlayer);
      queryClient.invalidateQueries({ queryKey: ["players", auctionId] });
      queryClient.invalidateQueries({ queryKey: auctionKeys.teams(auctionId) });

      if (updatedPlayer && updatedPlayer.auctionRoundStatus === "sold" && updatedPlayer.soldPrice) {
        const cacheKey = `sold-${updatedPlayer.id}-${updatedPlayer.soldPrice}`;
        if (!recentToastCache.has(cacheKey)) {
          recentToastCache.add(cacheKey);
          setTimeout(() => recentToastCache.delete(cacheKey), 5000);

          if (callbacksRef.current?.enableToasts !== false) {
            toast.success(
              `🎉 ${updatedPlayer.name} SOLD to ${updatedPlayer.teamName || "Team"} for 🪙 ${Number(updatedPlayer.soldPrice).toLocaleString()}!`,
              {
                duration: 6000,
                description: `Role: ${updatedPlayer.sportFields?.role || updatedPlayer.sportFields?.Role || "Player"} • Grade: ${updatedPlayer.category || "-"}`,
              }
            );
          }
        }
      } else if (updatedPlayer && updatedPlayer.auctionRoundStatus === "unsold") {
        const cacheKey = `unsold-${updatedPlayer.id}`;
        if (!recentToastCache.has(cacheKey)) {
          recentToastCache.add(cacheKey);
          setTimeout(() => recentToastCache.delete(cacheKey), 5000);

          if (callbacksRef.current?.enableToasts !== false) {
            toast.error(`❌ ${updatedPlayer.name} marked UNSOLD`, {
              duration: 5000,
              description: "Player marked unsold in database.",
            });
          }
        }
      }
    });

    socket.on("teamUpdated", () => {
      console.log("[socket] Team updated");
      queryClient.invalidateQueries({ queryKey: auctionKeys.teams(auctionId) });
      queryClient.invalidateQueries({ queryKey: ["players", auctionId] });
    });

    socket.on("auctionUpdated", () => {
      console.log("[socket] Auction updated");
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionId) });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [auctionId, queryClient]);

  const emitAuctionEvent = (event: string, data: any) => {
    if (socketRef.current && auctionId) {
      socketRef.current.emit("auction-event", { auctionId, event, data });
    }
  };

  return { socket: socketRef.current, emitAuctionEvent };
}
