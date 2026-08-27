import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { Pencil, Plus, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMyAuctions } from "@/lib/app-store";
import { SPORT_TYPES, VISIBILITIES, sportTypeLabels, visibilityLabels } from "@/lib/validations/auction";
import type { SportType, Visibility } from "@/lib/auction-client";

export const Route = createFileRoute("/_authenticated/my-auctions/")({
  component: MyAuctionsPage,
});

function MyAuctionsPage() {
  const { items, isPending, isError, refetch, remove } = useMyAuctions();
  const [sportFilter, setSportFilter] = useState<SportType | "all">("all");
  const [visibilityFilter, setVisibilityFilter] = useState<Visibility | "all">("all");

  const filtered = items.filter(
    (a) => (sportFilter === "all" || a.sportType === sportFilter) && (visibilityFilter === "all" || a.visibility === visibilityFilter),
  );

  async function handleDelete(id: string) {
    try {
      await remove(id);
      toast.success("Auction deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete auction.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="display text-3xl font-bold uppercase tracking-wider text-foreground">MY AUCTIONS</h1>
          <Button className="bg-brand text-brand-foreground hover:bg-brand-dark" asChild>
            <Link to="/my-auctions/new">
              <Plus className="mr-1.5 size-4" /> Create Auction
            </Link>
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Select value={sportFilter} onValueChange={(v) => setSportFilter(v as SportType | "all")}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sports</SelectItem>
              {SPORT_TYPES.map((s) => (
                <SelectItem key={s} value={s}>
                  {sportTypeLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={visibilityFilter} onValueChange={(v) => setVisibilityFilter(v as Visibility | "all")}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All visibility</SelectItem>
              {VISIBILITIES.map((v) => (
                <SelectItem key={v} value={v}>
                  {visibilityLabels[v]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 space-y-3">
          {isPending ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 card-shadow">
                <Skeleton className="size-14 shrink-0 rounded-md" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="size-9 shrink-0 rounded-md" />
                <Skeleton className="size-9 shrink-0 rounded-md" />
              </div>
            ))
          ) : isError ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center card-shadow">
              <p className="text-muted-foreground">Failed to load auctions.</p>
              <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center">
              <p className="text-muted-foreground">
                {items.length === 0 ? "You haven't created any auctions yet." : "No auctions match these filters."}
              </p>
              {items.length === 0 && (
                <Button asChild className="mt-4">
                  <Link to="/my-auctions/new">Create your first auction</Link>
                </Button>
              )}
            </div>
          ) : (
            filtered.map((a) => (
              <div key={a.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 card-shadow">
                <FallbackImage
                  src={a.coverImage || ""}
                  alt=""
                  className="size-14 shrink-0 rounded-md"
                  fallback={
                    <div className="display flex h-full w-full items-center justify-center bg-brand text-xl text-brand-foreground">
                      {a.name.slice(0, 2).toUpperCase()}
                    </div>
                  }
                />
                <div className="min-w-0 flex-1">
                  <Link to="/my-auctions/$id" params={{ id: a.id }} className="truncate text-base font-semibold text-card-foreground hover:text-brand">
                    {a.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {sportTypeLabels[a.sportType]} · {format(new Date(a.startsAt), "d MMM yyyy, h:mm a")} ·{" "}
                    {visibilityLabels[a.visibility]}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/auctions/${a.id}`;
                    navigator.clipboard.writeText(shareUrl);
                    toast.success("Auction link copied to clipboard!");
                  }}
                  aria-label="Share auction"
                  title="Share Auction"
                >
                  <Share2 className="size-4" />
                </Button>
                <Button asChild variant="outline" size="icon">
                  <Link to="/my-auctions/$id/edit" params={{ id: a.id }} aria-label="Edit auction">
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Delete auction">
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{a.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(a.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
