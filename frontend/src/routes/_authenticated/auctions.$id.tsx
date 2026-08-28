import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, Gavel, ShieldCheck, Users, Wallet, Pencil, Copy } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import stadiumImg from "@/assets/stadium-band.jpg";
import { Countdown } from "@/components/auction/Countdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlayerPreviewCard } from "@/components/auction/PlayerPreviewCard";
import { AboutTab } from "@/components/auction/AboutTab";

import { usePlayers } from "@/hooks/usePlayers";
import { useTeams } from "@/hooks/useTeams";
import { computeTeamStats, formatPoints } from "@/lib/team-stats";
import type { Player } from "@/lib/auction-client";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { auctionDetailQueryOptions } from "@/lib/queries/auctions";
import { sportTypeLabels, visibilityLabels } from "@/lib/validations/auction";

export const Route = createFileRoute("/_authenticated/auctions/$id")({
  loader: async ({ params, context }) => {
    try {
      const auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.id));
      return { auction };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Auction unavailable — PitchBid" }, { name: "robots", content: "noindex" }],
      };
    }
    const { auction } = loaderData;
    const title = `${auction.name} Auction | PitchBid`;
    const description = `${auction.name} — a ${sportTypeLabels[auction.sportType]} player auction on PitchBid.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  pendingComponent: AuctionDetailPending,
  errorComponent: AuctionDetailError,
  notFoundComponent: AuctionNotFound,
  component: AuctionDetailPage,
});

function AuctionDetailError({ error, reset }: { error: any; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl text-foreground">Failed to load auction</h1>
        <p className="mt-3 text-muted-foreground">
          There was an error loading the auction details. Please check your connection and try again.
        </p>
        <Button onClick={() => reset()} className="mt-6 px-6 py-3">
          Try again
        </Button>
      </div>
      <SiteFooter />
    </div>
  );
}

function AuctionDetailPending() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero + countdown Skeleton */}
      <section className="relative isolate">
        <img
          src={stadiumImg}
          alt=""
          aria-hidden="true"
          width={1920}
          height={800}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/85" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <nav className="text-xs text-secondary/70">
            <span className="hover:text-secondary">Home</span>
            <span className="px-1.5">/</span>
            <Skeleton className="inline-block h-3 w-32 bg-secondary/20" />
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Skeleton className="size-16 rounded-lg bg-secondary/20" />
            <div>
              <Skeleton className="mb-2 h-3 w-24 bg-secondary/20" />
              <Skeleton className="h-10 w-64 md:h-12 md:w-96 bg-secondary/20" />
            </div>
          </div>

          <div className="mt-8 max-w-xl">
            <p className="mb-3 text-sm font-semibold text-secondary/80">Bidding starts in</p>
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-24 rounded-lg bg-secondary/20" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key facts Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg border-l-4 border-brand bg-card p-5 card-shadow">
              <Skeleton className="mb-2 h-3 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </section>

      {/* Bidding Panel Skeleton is removed */}

      <SiteFooter />
    </div>
  );
}

function AuctionNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl text-foreground">Auction not found</h1>
        <p className="mt-3 text-muted-foreground">
          This auction may have finished, been made private, or the link is incorrect. Browse the live and upcoming
          auctions instead.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-brand px-6 py-3 font-semibold text-brand-foreground hover:bg-brand-dark"
        >
          Back to auctions
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}

function AuctionDetailPage() {
  const { auction } = Route.useLoaderData();
  const { players, isPending: playersPending, updatePlayer, isUpdating: playersUpdating } = usePlayers(auction.id);
  const { teams, isPending: teamsPending } = useTeams(auction.id);

  const [activeTab, setActiveTab] = useState<"TEAMS" | "PLAYERS" | "MVP" | "SPONSORS" | "LINK" | "ABOUT">("TEAMS");
  const [previewPlayerId, setPreviewPlayerId] = useState<string | null>(null);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);

  function copyCode() {
    navigator.clipboard.writeText(auction.id);
    toast.success("Auction code copied!");
  }

  const handleSaveGrade = async (newGrade: string) => {
    if (!editPlayer) return;
    try {
      await updatePlayer({ id: editPlayer.id, patch: { category: newGrade } });
      toast.success("Player grade updated successfully!");
    } catch (err) {
      toast.error("Failed to update player grade.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Header section with stadium background cover */}
      <section className="relative isolate min-h-[280px] sm:min-h-[320px]">
        <img
          src={stadiumImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="relative mx-auto max-w-4xl px-4 pt-8">
          <div className="flex items-start gap-4 sm:gap-6">
            <FallbackImage
              src={auction.coverImage || ""}
              alt=""
              className="size-20 rounded-full border-2 border-white/20 sm:size-28"
              fallback={
                <span className="display grid size-full place-items-center rounded-full bg-brand text-2xl font-bold text-brand-foreground shadow-lg">
                  {auction.name.slice(0, 2).toUpperCase()}
                </span>
              }
            />
            <div className="flex-1 text-white">
              <h1 className="text-2xl font-bold sm:text-4xl">{auction.name}</h1>
              
              <div className="mt-2 space-y-1.5 text-sm sm:text-base">
                <p className="flex items-center gap-2 text-white/80">
                  Auction Code: <span className="font-mono">{auction.id.slice(-6)}</span>
                  <button onClick={copyCode} className="hover:text-white" aria-label="Copy code">
                    <Copy className="size-4" />
                  </button>
                </p>
                <p className="flex items-center gap-2 text-white/80">
                  <CalendarDays className="size-4" />
                  {format(new Date(auction.startsAt), "dd-MM-yyyy, h:mm a")}
                </p>
                <div className="flex items-center gap-6 text-white/80">
                  <span className="flex items-center gap-2">
                    <Users className="size-4" /> {auction.playersPerTeam} Player Per Team
                  </span>
                  <Countdown targetDate={auction.startsAt} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between pb-4">
            <div className="flex items-center gap-2 font-bold text-yellow-400">
              <span className="text-xl">✨ Free/-</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-4xl overflow-x-auto px-4 hide-scrollbar">
          {["TEAMS", "PLAYERS", "MVP", "SPONSORS", "LINK", "ABOUT"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`whitespace-nowrap px-4 py-4 text-sm font-semibold tracking-wide transition-colors ${
                activeTab === tab ? "border-b-2 border-orange-500 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-12 pb-32">
        {activeTab === "TEAMS" && (
          <div className="space-y-4">
            {teamsPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))
            ) : teams.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">No teams listed yet.</p>
              </div>
            ) : (
              teams.map((team) => {
                const { totalPoints, totalPlayers, reservedPlayers, usedPoints } = computeTeamStats(
                  team,
                  players,
                  auction,
                );
                const formatNum = formatPoints;

                return (
                  <div key={team.id} className="relative rounded-2xl border border-border bg-card p-4 card-shadow flex flex-col">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="shrink-0 size-24 rounded-xl bg-[#1e2329] border border-white/5 flex items-center justify-center overflow-hidden">
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="size-full object-cover" />
                        ) : (
                          <span className="text-3xl font-bold text-white/50">{team.shortName.slice(0, 3)}</span>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground truncate max-w-[150px] sm:max-w-xs">{team.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{team.shortName}</p>
                          </div>
                          
                          {/* Right side Total Points */}
                          <div className="text-right pl-2 shrink-0">
                            <div className="text-xl font-bold text-blue-600 leading-none mb-1">{formatNum(totalPoints)}</div>
                            <div className="text-[10px] text-muted-foreground uppercase whitespace-nowrap">Total Points</div>
                          </div>
                        </div>
                        
                        {/* Stats Row */}
                        <div className="flex items-center gap-3 sm:gap-4 mt-3 overflow-x-auto hide-scrollbar">
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase mb-0.5 whitespace-nowrap">Total Pl</div>
                            <div className="font-semibold text-sm sm:text-base">{totalPlayers.toString().padStart(2, '0')}</div>
                          </div>
                          <div className="w-px h-6 bg-border shrink-0" />
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase mb-0.5 whitespace-nowrap">Res. Pl</div>
                            <div className="font-semibold text-sm sm:text-base">{reservedPlayers.toString().padStart(2, '0')}</div>
                          </div>
                          <div className="w-px h-6 bg-border shrink-0" />
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase mb-0.5 whitespace-nowrap">Used Pts</div>
                            <div className="font-semibold text-sm sm:text-base">{formatNum(usedPoints)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "PLAYERS" && (
          <div className="flex flex-col gap-4">
            {playersPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))
            ) : players.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">No players registered yet.</p>
              </div>
            ) : (
              players.map((player) => (
                <div key={player.id} className="relative flex items-center gap-4 rounded-xl border border-border bg-card p-4.5 sm:p-5 card-shadow hover:shadow-md transition-shadow">
                  <PlayerPreviewCard
                    player={player}
                    open={previewPlayerId === player.id}
                    onOpenChange={(open) => !open && setPreviewPlayerId(null)}
                    trigger={
                      <button 
                        className="flex flex-1 items-center gap-5 text-left hover:opacity-80 transition-opacity min-w-0 pr-8"
                        onClick={() => setPreviewPlayerId(player.id)}
                      >
                        <FallbackImage
                          src={player.photo || ""}
                          alt={player.name}
                          className="size-16 rounded-full border border-border shrink-0 object-cover object-top shadow-sm"
                          fallback={
                            <span className="display grid size-full place-items-center rounded-full bg-brand/10 text-2xl font-bold text-brand">
                              {player.name.slice(0, 2).toUpperCase()}
                            </span>
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-lg sm:text-xl text-foreground truncate">{player.name}</h3>
                          <p className="text-sm sm:text-base font-bold text-muted-foreground mt-1 leading-snug">
                            {player.sportFields?.["role"] || "-"}  •  Grade {player.category || "-"}  •  {player.customData ? player.customData.replace("Dominated Hand: ", "") : "-"}
                          </p>
                        </div>
                      </button>
                    }
                  />
                  <div className="shrink-0 mr-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditPlayer(player)}
                      className="gap-1 text-xs"
                    >
                      <Pencil className="size-3" /> Edit Grade
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "ABOUT" && (
          <AboutTab auction={auction} teams={teams} players={players} />
        )}

        {activeTab !== "TEAMS" && activeTab !== "PLAYERS" && activeTab !== "ABOUT" && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">{activeTab} tab content coming soon.</p>
          </div>
        )}
      </main>

      <EditGradeModal
        player={editPlayer}
        open={!!editPlayer}
        onOpenChange={(open) => !open && setEditPlayer(null)}
        onSave={handleSaveGrade}
        isSaving={playersUpdating}
      />

      <SiteFooter />
    </div>
  );
}

interface EditGradeModalProps {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newGrade: string) => Promise<void>;
  isSaving: boolean;
}

function EditGradeModal({ player, open, onOpenChange, onSave, isSaving }: EditGradeModalProps) {
  const [grade, setGrade] = useState("");

  useEffect(() => {
    if (player) {
      setGrade(player.category || "");
    }
  }, [player]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(grade);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Player Grade</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Player Name</Label>
              <div className="font-semibold text-foreground">{player?.name}</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Grade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
