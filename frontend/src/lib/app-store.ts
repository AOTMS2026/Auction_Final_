import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { auctionClient, type Auction, type AuctionInput } from "@/lib/auction-client";
import { auctionKeys, myAuctionsQueryOptions, bookmarkedAuctionsQueryOptions } from "@/lib/queries/auctions";
import { useAuth } from "@/hooks/useAuth";

export function useMyAuctions() {
  const queryClient = useQueryClient();
  const query = useQuery(myAuctionsQueryOptions());

  const invalidate = () => queryClient.invalidateQueries({ queryKey: auctionKeys.all });

  const createMutation = useMutation({
    mutationFn: (input: AuctionInput) => auctionClient.create(input),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AuctionInput> }) => auctionClient.update(id, patch),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => auctionClient.remove(id),
    onSuccess: invalidate,
  });

  return {
    items: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
    create: (input: AuctionInput) => createMutation.mutateAsync(input),
    update: (id: string, patch: Partial<AuctionInput>) => updateMutation.mutateAsync({ id, patch }),
    remove: (id: string) => removeMutation.mutateAsync(id),
  };
}

export function useBookmarks() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const query = useQuery({ ...bookmarkedAuctionsQueryOptions(), enabled: isAuthenticated });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: auctionKeys.all });

  const bookmarkMutation = useMutation({
    mutationFn: (id: string) => auctionClient.bookmark(id),
    onSuccess: invalidate,
  });

  const unbookmarkMutation = useMutation({
    mutationFn: (id: string) => auctionClient.unbookmark(id),
    onSuccess: invalidate,
  });

  const bookmarked: Auction[] = query.data ?? [];
  const bookmarkedIds = new Set(bookmarked.map((a) => a.id));

  return {
    bookmarked,
    isPending: isAuthenticated && query.isPending,
    isError: query.isError,
    refetch: query.refetch,
    isBookmarked: (id: string) => bookmarkedIds.has(id),
    toggle: (id: string) => {
      if (bookmarkedIds.has(id)) unbookmarkMutation.mutate(id);
      else bookmarkMutation.mutate(id);
    },
  };
}
