import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search, Gavel, Users, Trophy, Pencil, Trash, Play, Eye, Sparkles, Building2, ShieldCheck, ArrowRight, RefreshCw, CalendarDays, Landmark } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminAuctionFormWithPreview } from "@/components/admin/AdminAuctionFormWithPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { auctionClient, type Auction } from "@/lib/auction-client";
import { auctionKeys, myAuctionsQueryOptions } from "@/lib/queries/auctions";
import { formatPoints } from "@/lib/team-stats";
import { sportTypeLabels } from "@/lib/validations/auction";
import type { AuctionFormValues } from "@/lib/validations/auction";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: auctions = [], isPending, error, refetch } = useQuery(myAuctionsQueryOptions());

  const [activeTab, setActiveTab] = useState<"my-auctions" | "create-auction">("my-auctions");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAuction, setEditingAuction] = useState<Auction | null>(null);
  const [auctionToDelete, setAuctionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered auctions
  const filteredAuctions = auctions.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      a.name.toLowerCase().includes(q) ||
      a.sportType.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q)
    );
  });

  // Handle Form Customized submission (+ Create or Edit)
  const handleCreateOrUpdateAuction = async (values: AuctionFormValues) => {
    try {
      const startsAt = new Date(
        `${format(values.date, "yyyy-MM-dd")}T${values.time}:00`,
      ).toISOString();

      if (editingAuction) {
        await auctionClient.update(editingAuction.id, {
          sportType: values.sportType,
          name: values.name,
          coverImage: values.coverImage || null,
          startsAt,
          playersPerTeam: values.playersPerTeam,
          pointsPerTeam: values.pointsPerTeam,
          minimumBid: values.minimumBid,
          maxBid: values.maxBid,
          bidIncrement: values.bidIncrement,
          visibility: values.visibility,
        });
        toast.success(`Customized Auction "${values.name}" updated successfully!`);
        setEditingAuction(null);
      } else {
        const created = await auctionClient.create({
          sportType: values.sportType,
          name: values.name,
          coverImage: values.coverImage || null,
          startsAt,
          playersPerTeam: values.playersPerTeam,
          pointsPerTeam: values.pointsPerTeam,
          minimumBid: values.minimumBid,
          maxBid: values.maxBid,
          bidIncrement: values.bidIncrement,
          visibility: values.visibility,
        });
        toast.success(`Customized Auction "${created.name}" created successfully!`);
      }

      await queryClient.invalidateQueries({ queryKey: auctionKeys.all });
      setActiveTab("my-auctions");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save customized auction.");
    }
  };

  // Handle Auction Deletion
  const handleDeleteAuction = async () => {
    if (!auctionToDelete) return;
    setIsDeleting(true);
    try {
      await auctionClient.delete(auctionToDelete);
      await queryClient.invalidateQueries({ queryKey: auctionKeys.all });
      toast.success("Auction deleted successfully.");
      setAuctionToDelete(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete auction.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="min-h-screen text-[#f2e9dc] selection:bg-[#38bdf8] selection:text-white flex flex-col font-sans"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)",
      }}
    >
      {/* Admin Navbar */}
      <AdminNavbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "create-auction") setEditingAuction(null);
          setActiveTab(tab);
        }}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 flex-1 w-full space-y-8">
        {/* Top Welcome Banner */}
        <div className="rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a34]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 size-72 rounded-full bg-[#38bdf8]/10 blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c1820] border border-emerald-500/50 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="size-4 text-emerald-400" /> Admin Control Center
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-auction uppercase tracking-wider">
              Welcome to Auction Admin Panel
            </h1>
            <p className="text-sm text-[#abb4bd] max-w-2xl font-medium">
              Manage your customized league auctions, configure bidding rules, track team purse calculations, and create new auctions with live real-time preview mode.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
            <Button
              onClick={() => {
                setEditingAuction(null);
                setActiveTab("create-auction");
              }}
              className="rounded-2xl px-6 py-3 h-auto font-black text-xs text-white bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:scale-105 transition-all border border-white/30 cursor-pointer"
            >
              <Plus className="size-4 mr-1.5 stroke-[3]" /> + Create New Auction
            </Button>
          </div>
        </div>

        {/* TAB 1: MY AUCTIONS (Existing Customized Auctions Grid) */}
        {activeTab === "my-auctions" && !editingAuction && (
          <div className="space-y-6">
            {/* Header + Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#38bdf8]/30 pb-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Gavel className="size-5 text-[#38bdf8]" /> Existing Customized Auctions ({auctions.length})
                </h2>
                <p className="text-xs text-[#abb4bd] mt-0.5">
                  Click on any auction to manage teams, registered players, start live auction, or edit settings.
                </p>
              </div>

              <div className="relative min-w-[260px] sm:min-w-[320px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#38bdf8]" />
                <Input
                  type="text"
                  placeholder="Search auctions by name or sport..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-10 rounded-xl bg-[#0c1820] border-[#38bdf8]/40 text-white placeholder:text-[#abb4bd] focus:border-[#38bdf8] text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Auction List (Normal Clean Row Layout) */}
            {isPending ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl bg-[#162a34]/60 border border-[#38bdf8]/20" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-3xl border-2 border-rose-500/40 bg-rose-950/30 p-10 text-center">
                <p className="text-rose-300 font-bold">Failed to load customized auctions.</p>
                <Button onClick={() => refetch()} className="mt-4 rounded-xl bg-rose-600 text-white font-bold">
                  Retry
                </Button>
              </div>
            ) : filteredAuctions.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border-2 border-dashed border-[#38bdf8]/40 bg-[#162a34]/40 p-8 space-y-3">
                <p className="text-[#abb4bd] font-medium">
                  {searchQuery ? `No auctions matching "${searchQuery}" found.` : "No customized auctions created yet."}
                </p>
                <Button
                  onClick={() => {
                    setEditingAuction(null);
                    setActiveTab("create-auction");
                  }}
                  className="rounded-2xl px-6 py-2.5 h-auto font-black text-xs text-white bg-[#f97316] hover:bg-[#ea580c] shadow-md"
                >
                  <Plus className="size-4 mr-1.5 stroke-[3]" /> Create Your First Auction
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAuctions.map((auction) => (
                  <div
                    key={auction.id}
                    onClick={() => {
                      void navigate({
                        to: "/dashboard/$id",
                        params: { id: auction.id },
                      });
                    }}
                    className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl border border-[#38bdf8]/30 bg-[#142630]/90 hover:bg-[#1a3442] backdrop-blur-xl shadow-lg hover:border-[#38bdf8] transition-all cursor-pointer"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative size-16 shrink-0 rounded-xl overflow-hidden bg-[#0c1820] border border-[#38bdf8]/40 shadow-sm">
                        {auction.coverImage ? (
                          <img
                            src={auction.coverImage}
                            alt={auction.name}
                            className="size-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="size-full bg-gradient-to-br from-[#1e3a45] to-[#38bdf8] grid place-items-center text-white text-lg font-black">
                            {auction.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white group-hover:text-[#38bdf8] transition-colors truncate">
                            {auction.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-md bg-[#0c1820] border border-[#38bdf8]/50 text-white text-[10px] font-black uppercase tracking-wider">
                            {sportTypeLabels[auction.sportType] || "Sports"}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                              auction.status === "live"
                                ? "bg-emerald-950/90 text-emerald-300 border-emerald-500/60"
                                : "bg-[#0c1820] text-[#38bdf8] border-[#38bdf8]/40"
                            }`}
                          >
                            {auction.status === "live" ? "🔴 Live Mode" : "Draft"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#abb4bd]">
                          <span className="flex items-center gap-1 font-medium">
                            <CalendarDays className="size-3.5 text-[#38bdf8]" />
                            {format(new Date(auction.startsAt), "dd MMM yyyy, h:mm a")}
                          </span>
                          <span>•</span>
                          <span>Purse/Team: <strong className="text-emerald-300">{formatPoints(auction.pointsPerTeam)}</strong></span>
                          <span>•</span>
                          <span>Base Price: <strong className="text-white">{formatPoints(auction.minimumBid)}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#38bdf8]/20">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          void navigate({
                            to: "/my-auctions/$id/auctioneer",
                            params: { id: auction.id },
                            search: { mode: "live" },
                          });
                        }}
                        className="rounded-xl px-4 py-2 h-auto text-xs font-black bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-white hover:opacity-90 shadow-md cursor-pointer"
                      >
                        <Play className="size-3.5 mr-1 fill-current" /> Start Auction
                      </Button>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          void navigate({
                            to: "/dashboard/$id",
                            params: { id: auction.id },
                          });
                        }}
                        variant="outline"
                        className="rounded-xl px-3 py-2 h-auto text-xs font-bold border-[#38bdf8]/40 bg-[#0c1820] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-white cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="size-4" />
                        <span>Auction Details</span>
                      </Button>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAuction(auction);
                          setActiveTab("create-auction");
                        }}
                        variant="outline"
                        className="rounded-xl p-2.5 h-auto text-xs font-bold border-[#38bdf8]/40 bg-[#0c1820] text-amber-300 hover:bg-amber-500 hover:text-white cursor-pointer"
                        title="Edit Auction Settings"
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAuctionToDelete(auction.id);
                        }}
                        variant="outline"
                        className="rounded-xl p-2.5 h-auto text-xs font-bold border-rose-500/40 bg-[#0c1820] text-rose-400 hover:bg-rose-600 hover:text-white cursor-pointer"
                        title="Delete Auction"
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: + CREATE AUCTION IN SEPARATE ADMIN PANEL (Form Customized + Right Side Live Preview Mode) */}
        {(activeTab === "create-auction" || editingAuction) && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#38bdf8]/30 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-auction flex items-center gap-2">
                  <Sparkles className="size-6 text-[#f97316]" />
                  {editingAuction ? `Edit Customized Auction: "${editingAuction.name}"` : "Form Customized + Live Preview Mode"}
                </h2>
                <p className="text-xs text-[#abb4bd] mt-1 font-medium">
                  {editingAuction
                    ? "Update settings and custom rules for this auction."
                    : "Fill out the custom form on the left. The right pane dynamically renders the live preview in real-time."}
                </p>
              </div>

              <Button
                onClick={() => {
                  setEditingAuction(null);
                  setActiveTab("my-auctions");
                }}
                variant="outline"
                className="rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-white text-xs font-bold"
              >
                ← Back to My Auctions
              </Button>
            </div>

            {/* Customized Form Component with Right Side Live Preview */}
            <AdminAuctionFormWithPreview
              defaultValues={
                editingAuction
                  ? {
                      sportType: editingAuction.sportType,
                      name: editingAuction.name,
                      coverImage: editingAuction.coverImage || undefined,
                      date: new Date(editingAuction.startsAt),
                      time: format(new Date(editingAuction.startsAt), "HH:mm"),
                      playersPerTeam: editingAuction.playersPerTeam,
                      pointsPerTeam: editingAuction.pointsPerTeam,
                      minimumBid: editingAuction.minimumBid,
                      maxBid: editingAuction.maxBid,
                      bidIncrement: editingAuction.bidIncrement,
                      visibility: editingAuction.visibility,
                    }
                  : undefined
              }
              onSubmit={handleCreateOrUpdateAuction}
              submitLabel={editingAuction ? "Update Customized Auction" : "Create Customized Auction"}
            />
          </div>
        )}
      </main>

      {/* Confirmation Dialog for Deleting Auction */}
      <AlertDialog open={!!auctionToDelete} onOpenChange={(open) => !open && setAuctionToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border-2 border-rose-500/40 bg-[#0c1820] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-rose-400">Delete Customized Auction?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#abb4bd]">
              This will permanently delete this auction and all associated teams and player records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl bg-[#142630] border-[#38bdf8]/40 text-white hover:bg-[#1e3a45]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAuction}
              disabled={isDeleting}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {isDeleting ? "Deleting..." : "Delete Auction"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminDashboardPage;
