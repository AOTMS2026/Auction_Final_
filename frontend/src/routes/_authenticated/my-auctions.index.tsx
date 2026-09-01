import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar, LayoutGrid, Pencil, Plus, Share2, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
    <div
      className="min-h-screen text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
      }}
    >
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Top Header & Create Button with Powder Blue & Tea Green Gradient */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#5c6875]/30">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162235]/80 border border-[#a1b5d8]/40 text-[#a1b5d8] text-xs font-bold uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(161,181,216,0.2)]">
              <LayoutGrid className="size-3.5" />
              <span>Organizer Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#fffcf7]">
              My Auctions
            </h1>
            <p className="mt-1 text-sm text-[#abb4bd]">
              Manage tournaments, squad rosters, and live bidding sessions.
            </p>
          </div>

          <Button
            asChild
            className="rounded-full px-6 py-2.5 h-auto font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_20px_rgba(161,181,216,0.35)] hover:shadow-[0_0_30px_rgba(161,181,216,0.55)] hover:scale-105 transition-all duration-300 border border-[#fffcf7]/40"
          >
            <Link to="/my-auctions/new">
              <Plus className="mr-1.5 size-4 stroke-[2.5]" /> Create Auction
            </Link>
          </Button>
        </div>

        {/* Filter Controls with Slate Grey Styling */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Select value={sportFilter} onValueChange={(v) => setSportFilter(v as SportType | "all")}>
            <SelectTrigger className="w-44 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8] backdrop-blur-sm">
              <SelectValue placeholder="All sports" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
              <SelectItem value="all">All sports</SelectItem>
              {SPORT_TYPES.map((s) => (
                <SelectItem key={s} value={s}>
                  {sportTypeLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={visibilityFilter} onValueChange={(v) => setVisibilityFilter(v as Visibility | "all")}>
            <SelectTrigger className="w-44 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8] backdrop-blur-sm">
              <SelectValue placeholder="All visibility" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
              <SelectItem value="all">All visibility</SelectItem>
              {VISIBILITIES.map((v) => (
                <SelectItem key={v} value={v}>
                  {visibilityLabels[v]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Auction Cards List */}
        <div className="mt-8 space-y-3.5">
          {isPending ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/50 p-5 backdrop-blur-md"
              >
                <Skeleton className="size-14 shrink-0 rounded-xl bg-[#454e57]/40" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3 bg-[#454e57]/40" />
                  <Skeleton className="h-3 w-1/2 bg-[#454e57]/30" />
                </div>
                <Skeleton className="size-9 shrink-0 rounded-xl bg-[#454e57]/40" />
                <Skeleton className="size-9 shrink-0 rounded-xl bg-[#454e57]/40" />
              </div>
            ))
          ) : isError ? (
            <div className="rounded-3xl border border-[#5c6875]/40 bg-[#2e343a]/70 p-10 text-center shadow-lg backdrop-blur-md">
              <p className="text-[#abb4bd]">Failed to load auctions.</p>
              <Button
                variant="outline"
                className="mt-4 rounded-full border-[#a1b5d8] text-[#a1b5d8] hover:bg-[#a1b5d8]/20"
                onClick={() => refetch()}
              >
                Try again
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-[#5c6875]/40 bg-[#2e343a]/40 p-12 text-center backdrop-blur-sm">
              <Sparkles className="size-8 text-[#a1b5d8] mx-auto mb-3" />
              <p className="text-[#abb4bd] font-medium">
                {items.length === 0 ? "You haven't created any tournaments yet." : "No auctions match these filters."}
              </p>
              {items.length === 0 && (
                <Button
                  asChild
                  className="mt-5 rounded-full px-6 py-2.5 font-bold text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9]"
                >
                  <Link to="/my-auctions/new">Create your first auction</Link>
                </Button>
              )}
            </div>
          ) : (
            filtered.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-4 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)] hover:border-[#a1b5d8]/60 hover:shadow-[0_12px_35px_rgba(161,181,216,0.2)] transition-all duration-300 group"
              >
                <FallbackImage
                  src={a.coverImage || ""}
                  alt=""
                  className="size-14 shrink-0 rounded-xl object-cover border border-[#5c6875]/40"
                  fallback={
                    <div className="display flex h-full w-full items-center justify-center bg-gradient-to-br from-[#4365a0] to-[#6a9b57] text-xl font-bold text-[#fffcf7] rounded-xl">
                      {a.name.slice(0, 2).toUpperCase()}
                    </div>
                  }
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to="/my-auctions/$id"
                    params={{ id: a.id }}
                    className="truncate text-base font-bold text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors block"
                  >
                    {a.name}
                  </Link>
                  <p className="mt-1 text-xs text-[#abb4bd] flex items-center gap-1.5 font-medium">
                    <span className="px-2 py-0.5 rounded-full bg-[#162235]/80 text-[#a1b5d8] text-[10px] font-bold uppercase">
                      {sportTypeLabels[a.sportType]}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#e3e6e9]">
                      <Calendar className="size-3 text-[#a1b5d8]" />
                      {format(new Date(a.startsAt), "d MMM yyyy, h:mm a")}
                    </span>
                    <span>·</span>
                    <span className="text-[#c2d8b9] font-medium capitalize">
                      {visibilityLabels[a.visibility]}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-[#5c6875]/50 bg-[#171a1d]/60 hover:bg-[#a1b5d8]/20 hover:text-[#a1b5d8] hover:border-[#a1b5d8]/60 text-[#c7cdd3] transition-all"
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

                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-[#5c6875]/50 bg-[#171a1d]/60 hover:bg-[#c2d8b9]/20 hover:text-[#e4f0d0] hover:border-[#c2d8b9]/60 text-[#c7cdd3] transition-all"
                  >
                    <Link to="/my-auctions/$id/edit" params={{ id: a.id }} aria-label="Edit auction">
                      <Pencil className="size-4" />
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-[#5c6875]/50 bg-[#171a1d]/60 hover:bg-destructive/20 hover:text-red-400 hover:border-destructive/50 text-[#c7cdd3] transition-all"
                        aria-label="Delete auction"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{a.name}"?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#abb4bd]">
                          This cannot be undone. All teams, players, and auction data will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-6 shadow-sm">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(a.id)}
                          className="rounded-full bg-destructive hover:bg-destructive/90 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default MyAuctionsPage;
