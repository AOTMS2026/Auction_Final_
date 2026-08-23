import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auctionClient, type Player, type PlayerInput } from "@/lib/auction-client";

export const playersQueryKeys = {
  all: ["players"] as const,
  list: (auctionId: string) => [...playersQueryKeys.all, auctionId] as const,
};

export function usePlayers(auctionId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: playersQueryKeys.list(auctionId),
    queryFn: () => auctionClient.getPlayers(auctionId),
  });

  const createMutation = useMutation({
    mutationFn: (input: PlayerInput) => auctionClient.createPlayer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersQueryKeys.list(auctionId) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof auctionClient.updatePlayer>[1] }) =>
      auctionClient.updatePlayer(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersQueryKeys.list(auctionId) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => auctionClient.deletePlayer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playersQueryKeys.list(auctionId) });
    },
  });

  return {
    players: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
    createPlayer: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updatePlayer: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deletePlayer: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
