import { queryOptions } from "@tanstack/react-query";

import { auctionClient, type AuctionFilters } from "@/lib/auction-client";

export const auctionKeys = {
  all: ["auctions"] as const,
  list: (filters?: AuctionFilters) => [...auctionKeys.all, "list", filters ?? {}] as const,
  detail: (id: string) => [...auctionKeys.all, "detail", id] as const,
  mine: () => [...auctionKeys.all, "mine"] as const,
  bookmarked: () => [...auctionKeys.all, "bookmarked"] as const,
  teams: (auctionId: string) => [...auctionKeys.all, "teams", auctionId] as const,
};

export function auctionListQueryOptions(filters?: AuctionFilters) {
  return queryOptions({
    queryKey: auctionKeys.list(filters),
    queryFn: () => auctionClient.list(filters),
  });
}

export function auctionDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: auctionKeys.detail(id),
    queryFn: () => auctionClient.getById(id),
  });
}

export function myAuctionsQueryOptions() {
  return queryOptions({
    queryKey: auctionKeys.mine(),
    queryFn: () => auctionClient.listMine(),
  });
}

export function bookmarkedAuctionsQueryOptions() {
  return queryOptions({
    queryKey: auctionKeys.bookmarked(),
    queryFn: () => auctionClient.listBookmarked(),
  });
}

export function teamsQueryOptions(auctionId: string) {
  return queryOptions({
    queryKey: auctionKeys.teams(auctionId),
    queryFn: () => auctionClient.getTeams(auctionId),
  });
}
