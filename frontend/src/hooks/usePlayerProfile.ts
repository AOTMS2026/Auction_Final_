import { useQuery } from "@tanstack/react-query";
import { auctionClient } from "@/lib/auction-client";

export const playerProfileQueryOptions = (phone: string) => ({
  queryKey: ["playerProfile", phone],
  queryFn: () => auctionClient.getPlayerProfile(phone),
});

export function usePlayerProfile(phone: string, enabled: boolean = true) {
  return useQuery({
    ...playerProfileQueryOptions(phone),
    enabled: enabled && !!phone,
  });
}
