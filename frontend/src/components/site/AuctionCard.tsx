import { Link } from "@tanstack/react-router";
import { ArrowRight, Bookmark, CalendarDays } from "lucide-react";
import { format } from "date-fns";

import type { Auction } from "@/lib/auction-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useBookmarks } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import { FallbackImage } from "@/components/ui/fallback-image";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function AuctionCard({
  auction,
  tone = "light",
}: {
  auction: Auction;
  tone?: "light" | "dark";
}) {
  const { isAuthenticated } = useAuth();
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(auction.id);

  return (
    <div className="relative">
      <Link
        to="/auctions/$id"
        params={{ id: auction.id }}
        className={cn(
          "group flex items-center gap-4 rounded-2xl border p-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg",
          tone === "dark"
            ? "border-[#5c6875]/40 bg-[#171a1d]/85 hover:border-[#a1b5d8] hover:shadow-[0_10px_35px_rgba(161,181,216,0.25)]"
            : "border-[#5c6875]/30 bg-[#2e343a]/75 hover:border-[#a1b5d8] hover:shadow-[0_10px_35px_rgba(161,181,216,0.2)]"
        )}
      >
        <div className="size-14 shrink-0 rounded-xl overflow-hidden border border-[#a1b5d8]/30 shadow-md bg-[#162235]">
          <FallbackImage
            src={auction.coverImage || ""}
            alt=""
            className="size-full object-cover"
            fallback={
              <div className="display flex size-full items-center justify-center bg-gradient-to-br from-[#162235] to-[#2d436a] text-lg font-black text-[#fffcf7]">
                {getInitials(auction.name)}
              </div>
            }
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate pr-6 text-base font-bold text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors">
            {auction.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#a1b5d8]">
            <CalendarDays className="size-3.5 text-[#a1b5d8]" aria-hidden="true" />
            {format(new Date(auction.startsAt), "d MMM, h:mm a")}
          </p>
        </div>
        <div className="size-8 rounded-full bg-[#162235]/60 border border-[#a1b5d8]/20 flex items-center justify-center shrink-0 group-hover:bg-[#a1b5d8] group-hover:text-[#162235] transition-all">
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </div>
      </Link>

      {isAuthenticated && (
        <button
          type="button"
          onClick={() => toggle(auction.id)}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          aria-pressed={bookmarked}
          className="absolute right-4 top-3.5 text-[#abb4bd] hover:text-[#fffcf7] transition-colors"
        >
          <Bookmark className={cn("size-4", bookmarked && "fill-[#a1b5d8] text-[#a1b5d8]")} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function AuctionCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#5c6875]/25 bg-[#2e343a]/60 backdrop-blur-md p-3.5 shadow-md">
      <Skeleton className="size-14 shrink-0 rounded-xl bg-[#5c6875]/30" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3 bg-[#5c6875]/30" />
        <Skeleton className="h-3 w-1/3 bg-[#5c6875]/20" />
      </div>
    </div>
  );
}

export default AuctionCard;
