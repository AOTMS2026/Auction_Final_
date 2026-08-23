import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { auctionClient, type TeamInput } from "@/lib/auction-client";
import { auctionKeys, teamsQueryOptions } from "@/lib/queries/auctions";

export function useTeams(auctionId: string) {
  const queryClient = useQueryClient();
  const query = useQuery(teamsQueryOptions(auctionId));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: auctionKeys.teams(auctionId) });

  const createMutation = useMutation({
    mutationFn: (input: TeamInput) => auctionClient.createTeam(input),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<TeamInput> }) =>
      auctionClient.updateTeam(id, patch),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => auctionClient.deleteTeam(id),
    onSuccess: invalidate,
  });

  return {
    teams: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
    createTeam: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTeam: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTeam: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
