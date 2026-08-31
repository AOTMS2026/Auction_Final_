import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { AuctionCard, AuctionCardSkeleton } from "@/components/site/AuctionCard";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/lib/app-store";

export const Route = createFileRoute("/_authenticated/bookmarks")({
  component: BookmarksPage,
});

function BookmarksPage() {
  const { bookmarked, isPending, isError, refetch } = useBookmarks();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl text-foreground">Bookmarks</h1>
        <p className="mt-2 text-sm text-muted-foreground">Auctions you've saved for later.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {isPending ? (
            Array.from({ length: 4 }).map((_, i) => <AuctionCardSkeleton key={i} />)
          ) : isError ? (
            <div className="col-span-full rounded-lg border border-border bg-card p-10 text-center card-shadow">
              <p className="text-muted-foreground">Failed to load bookmarks.</p>
              <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : bookmarked.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center">
              <p className="text-muted-foreground">No bookmarks yet.</p>
              <Link to="/" className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline">
                Browse auctions on Home
              </Link>
            </div>
          ) : (
            bookmarked.map((a) => <AuctionCard key={a.id} auction={a} />)
          )}
        </div>
      </main>
    </div>
  );
}
