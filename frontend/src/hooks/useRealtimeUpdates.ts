import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { apiBase } from "@/lib/api-client";
import { auctionKeys } from "@/lib/queries/auctions";

export function useRealtimeUpdates(auctionId: string | undefined) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!auctionId) return;

    const socket = io(apiBase(), {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[socket] Connected to real-time server");
      socket.emit("join-auction", auctionId);
    });

    socket.on("playerUpdated", () => {
      console.log("[socket] Player updated");
      queryClient.invalidateQueries({ queryKey: ["players", auctionId] });
      queryClient.invalidateQueries({ queryKey: auctionKeys.teams(auctionId) });
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

  return { socket: socketRef.current };
}
