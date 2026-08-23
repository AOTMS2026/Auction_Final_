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

export function AuctionCard({ auction, tone = "light" }: { auction: Auction; tone?: "light" | "dark" }) {
  const { isAuthenticated } = useAuth();
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(auction.id);

  return (
    <div className="relative">
      <Link
        to="/auctions/$id"
        params={{ id: auction.id }}
        className={
          tone === "dark"
            ? "group flex items-center gap-3 rounded-lg border border-brand/40 bg-card p-3 card-shadow transition-transform hover:-translate-y-0.5"
            : "group flex items-center gap-3 rounded-lg border border-border bg-card p-3 card-shadow transition-transform hover:-translate-y-0.5"
        }
      >
        <FallbackImage
          src={auction.coverImage || ""}
          alt=""
          className="size-12 shrink-0 rounded-md"
          fallback={
            <div className="display flex h-full w-full items-center justify-center bg-brand text-lg text-brand-foreground">
              {getInitials(auction.name)}
            </div>
          }
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate pr-6 text-base text-card-foreground">{auction.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-brand">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {format(new Date(auction.startsAt), "d MMM, h:mm a")}
          </p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-brand transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>

      {isAuthenticated && (
        <button
          type="button"
          onClick={() => toggle(auction.id)}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          aria-pressed={bookmarked}
          className="absolute right-3 top-2.5 text-muted-foreground hover:text-brand"
        >
          <Bookmark className={cn("size-4", bookmarked && "fill-brand text-brand")} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function AuctionCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 card-shadow">
      <Skeleton className="size-12 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
