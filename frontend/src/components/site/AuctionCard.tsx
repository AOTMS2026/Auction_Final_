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
          "group flex items-center gap-4 rounded-2xl border-2 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg",
          tone === "dark"
            ? "border-[#38bdf8]/35 bg-[#162b35]/85 hover:border-[#38bdf8] hover:shadow-[0_12px_35px_rgba(56,189,248,0.3)]"
            : "border-[#38bdf8]/30 bg-[#162b35]/80 hover:border-[#38bdf8] hover:shadow-[0_12px_35px_rgba(56,189,248,0.25)]"
        )}
      >
        <div className="size-14 shrink-0 rounded-xl overflow-hidden border-2 border-[#38bdf8]/50 shadow-md bg-[#142630]">
          <FallbackImage
            src={auction.coverImage || ""}
            alt=""
            className="size-full object-cover"
            fallback={
              <div className="display flex size-full items-center justify-center bg-gradient-to-br from-[#1e424c] to-[#38bdf8] text-lg font-black text-[#ffffff]">
                {getInitials(auction.name)}
              </div>
            }
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate pr-6 text-base font-black font-auction text-[#ffffff] group-hover:text-[#38bdf8] transition-colors tracking-wide [word-spacing:0.16em] drop-shadow-sm">
            {auction.name}
          </h3>
          <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-[#38bdf8] tracking-wide [word-spacing:0.12em]">
            <CalendarDays className="size-3.5 text-[#38bdf8]" aria-hidden="true" />
            <span className="text-[#f2e9dc]/90">{format(new Date(auction.startsAt), "d MMM, h:mm a")}</span>
          </p>
        </div>
        <div className="size-9 rounded-full bg-[#142630] border-2 border-[#38bdf8]/40 flex items-center justify-center shrink-0 group-hover:bg-[#38bdf8] group-hover:text-[#142630] text-[#38bdf8] transition-all shadow-sm">
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </div>
      </Link>

      {isAuthenticated && (
        <button
          type="button"
          onClick={() => toggle(auction.id)}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          aria-pressed={bookmarked}
          className="absolute right-4 top-4 text-[#38bdf8]/70 hover:text-[#38bdf8] transition-colors"
        >
          <Bookmark className={cn("size-4", bookmarked && "fill-[#38bdf8] text-[#38bdf8]")} aria-hidden="true" />
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
