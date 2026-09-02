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
      className="min-h-screen text-[#f2e9dc] selection:bg-[#38bdf8] selection:text-[#ffffff]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)",
      }}
    >
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Top Header & Create Button with Luminous Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#38bdf8]/35">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#162a32]/95 border-2 border-[#38bdf8]/60 text-[#ffffff] text-xs font-black uppercase tracking-wider mb-2 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              <LayoutGrid className="size-3.5 text-[#38bdf8]" />
              <span>Organizer Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#ffffff]">
              My Auctions
            </h1>
            <p className="mt-1 text-sm text-[#f2e9dc]/80 font-medium">
              Manage tournaments, squad rosters, and live bidding sessions.
            </p>
          </div>

          <Button
            asChild
            className="rounded-full px-7 py-3 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:shadow-[0_0_35px_rgba(249,115,22,0.9)] hover:scale-105 transition-all duration-300 border border-white/40"
          >
            <Link to="/my-auctions/new">
              <Plus className="mr-1.5 size-4 stroke-[3]" /> Create Auction
            </Link>
          </Button>
        </div>

        {/* Filter Controls with Bright Teal Styling */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Select value={sportFilter} onValueChange={(v) => setSportFilter(v as SportType | "all")}>
            <SelectTrigger className="w-44 rounded-xl border-2 border-[#38bdf8]/40 bg-[#162a34]/90 text-[#ffffff] font-bold focus:ring-[#38bdf8] backdrop-blur-sm">
              <SelectValue placeholder="All sports" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff]">
              <SelectItem value="all">All sports</SelectItem>
              {SPORT_TYPES.map((s) => (
                <SelectItem key={s} value={s}>
                  {sportTypeLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={visibilityFilter} onValueChange={(v) => setVisibilityFilter(v as Visibility | "all")}>
            <SelectTrigger className="w-44 rounded-xl border-2 border-[#38bdf8]/40 bg-[#162a34]/90 text-[#ffffff] font-bold focus:ring-[#38bdf8] backdrop-blur-sm">
              <SelectValue placeholder="All visibility" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff]">
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
                className="flex items-center gap-4 rounded-2xl border-2 border-[#38bdf8]/20 bg-[#162a32]/60 p-5 backdrop-blur-md"
              >
                <Skeleton className="size-14 shrink-0 rounded-xl bg-[#203a45]/50" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3 bg-[#203a45]/50" />
                  <Skeleton className="h-3 w-1/2 bg-[#203a45]/40" />
                </div>
                <Skeleton className="size-9 shrink-0 rounded-xl bg-[#203a45]/50" />
                <Skeleton className="size-9 shrink-0 rounded-xl bg-[#203a45]/50" />
              </div>
            ))
          ) : isError ? (
            <div className="rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a32]/90 p-10 text-center shadow-lg backdrop-blur-md">
              <p className="text-[#f2e9dc]">Failed to load auctions.</p>
              <Button
                variant="outline"
                className="mt-4 rounded-full border-2 border-[#38bdf8] text-[#ffffff] bg-[#38bdf8]/20 hover:bg-[#38bdf8]/40"
                onClick={() => refetch()}
              >
                Try again
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-[#38bdf8]/40 bg-[#162a32]/50 p-12 text-center backdrop-blur-sm">
              <Sparkles className="size-8 text-[#f97316] mx-auto mb-3" />
              <p className="text-[#f2e9dc] font-bold">
                {items.length === 0 ? "You haven't created any tournaments yet." : "No auctions match these filters."}
              </p>
              {items.length === 0 && (
                <Button
                  asChild
                  className="mt-5 rounded-full px-7 py-3 font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30"
                >
                  <Link to="/my-auctions/new">Create your first auction</Link>
                </Button>
              )}
            </div>
          ) : (
            filtered.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-4 rounded-2xl border-2 border-[#38bdf8]/35 bg-[#162b35]/85 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(15,35,45,0.7)] hover:border-[#38bdf8] hover:shadow-[0_12px_35px_rgba(56,189,248,0.3)] transition-all duration-300 group"
              >
                <FallbackImage
                  src={a.coverImage || ""}
                  alt=""
                  className="size-14 shrink-0 rounded-xl object-cover border-2 border-[#38bdf8]/50 shadow-md"
                  fallback={
                    <div className="display flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1e424c] to-[#38bdf8] text-xl font-black text-[#ffffff] rounded-xl">
                      {a.name.slice(0, 2).toUpperCase()}
                    </div>
                  }
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to="/my-auctions/$id"
                    params={{ id: a.id }}
                    className="truncate text-base sm:text-lg font-black text-[#ffffff] group-hover:text-[#38bdf8] transition-colors block drop-shadow-sm"
                  >
                    {a.name}
                  </Link>
                  <p className="mt-1 text-xs text-[#f2e9dc]/80 flex items-center gap-1.5 font-semibold">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#142630] border border-[#38bdf8]/50 text-[#38bdf8] text-[10px] font-black uppercase tracking-wider">
                      {sportTypeLabels[a.sportType]}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#ffffff]">
                      <Calendar className="size-3.5 text-[#38bdf8]" />
                      {format(new Date(a.startsAt), "d MMM yyyy, h:mm a")}
                    </span>
                    <span>·</span>
                    <span className="text-emerald-400 font-bold capitalize">
                      {visibilityLabels[a.visibility]}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] hover:bg-[#38bdf8] hover:text-[#ffffff] text-[#38bdf8] transition-all shadow-sm"
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
                    className="rounded-xl border-2 border-emerald-500/50 bg-[#142630] hover:bg-emerald-500 hover:text-[#ffffff] text-emerald-400 transition-all shadow-sm"
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
                        className="rounded-xl border-2 border-rose-500/50 bg-[#142630] hover:bg-rose-500 hover:text-[#ffffff] text-rose-400 transition-all shadow-sm"
                        aria-label="Delete auction"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{a.name}"?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#f2e9dc]/80">
                          This cannot be undone. All teams, players, and auction data will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#203f4f] transition-all font-bold px-6 shadow-sm">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(a.id)}
                          className="rounded-full bg-destructive hover:bg-destructive/90 text-white font-bold"
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
