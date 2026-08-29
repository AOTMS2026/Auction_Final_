import { createFileRoute, Link, notFound, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, Copy, Users, Eye, FileSpreadsheet, MoreVertical, Pencil, Trash, Share2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import stadiumImg from "@/assets/stadium-band.jpg";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { auctionClient } from "@/lib/auction-client";
import { auctionDetailQueryOptions, auctionKeys } from "@/lib/queries/auctions";
import { computeTeamStats, formatPoints } from "@/lib/team-stats";
import { authClient } from "@/lib/auth-client";
import { useTeams } from "@/hooks/useTeams";
import { usePlayers } from "@/hooks/usePlayers";
import { TeamFormModal } from "@/components/auction/TeamFormModal";
import { PlayerFormModal } from "@/components/auction/PlayerFormModal";
import { PlayerPreviewCard } from "@/components/auction/PlayerPreviewCard";
import { ChooseAuctionModeDialog } from "@/components/auction/ChooseAuctionModeDialog";
import { Countdown } from "@/components/auction/Countdown";
import { AboutTab } from "@/components/auction/AboutTab";
import { exportPlayersAndTeams } from "@/lib/export";

export const Route = createFileRoute("/_authenticated/my-auctions/$id/")({
  loader: async ({ params, context }) => {
    let auction;
    try {
      auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.id));
    } catch {
      throw notFound();
    }

    const user = await authClient.getCurrentUser();
    const isAdmin = user?.email === "ameen@gmail.com";
    if (!user || (auction.createdBy !== user.id && !isAdmin)) {
      throw redirect({ to: "/my-auctions" });
    }

    return { auction };
  },
  component: ManageAuctionPage,
});

const TABS = ["TEAMS", "PLAYERS", "MVP", "SPONSORS", "LINK", "ABOUT"];

function ManageAuctionPage() {
  const { auction } = Route.useLoaderData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("TEAMS");
  const [readinessModalOpen, setReadinessModalOpen] = useState(false);
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  // Teams logic
  const { teams, isPending: teamsPending, isError: teamsError, deleteTeam } = useTeams(auction.id);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const [editTeamId, setEditTeamId] = useState<string | null>(null);

  // Players logic
  const { players, isPending: playersPending, deletePlayer } = usePlayers(auction.id);
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [editPlayerId, setEditPlayerId] = useState<string | null>(null);
  const [previewPlayerId, setPreviewPlayerId] = useState<string | null>(null);

  function copyCode() {
    navigator.clipboard.writeText(auction.id);
    toast.success("Auction code copied!");
  }

  function handleSharePlayerForm() {
    const url = `${window.location.origin}/register-player/${auction.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Player registration link copied to clipboard!");
  }

  function handleShareTeamForm() {
    const url = `${window.location.origin}/register-team/${auction.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Team registration link copied to clipboard!");
  }

  function handleStartAuction() {
    if (teams.length === 0 || players.length === 0) {
      setReadinessModalOpen(true);
      return;
    }
    setModeDialogOpen(true);
  }

  async function handleConfirmMode(mode: "trial" | "live") {
    setModeDialogOpen(false);
    if (mode === "live") {
      try {
        await auctionClient.update(auction.id, { status: "live" });
        await queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auction.id) });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to start live auction.");
        return;
      }
      // Pass mode explicitly rather than relying on the auctioneer route's
      // loader to see the just-invalidated auction.status in time — that
      // refetch isn't guaranteed to land before the loader reads the cache.
      void navigate({ to: "/my-auctions/$id/auctioneer", params: { id: auction.id }, search: { mode: "live" } });
    } else {
      void navigate({ to: "/my-auctions/$id/auctioneer", params: { id: auction.id }, search: { mode: "trial" } });
    }
  }

  function handleExport() {
    exportPlayersAndTeams(players, teams, auction.name);
    toast.success("Export downloaded!");
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-12">
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
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-white/80">
                  <span className="flex items-center gap-2">
                    <Users className="size-4" /> {auction.playersPerTeam} Player Per Team
                  </span>
                  <span className="flex items-center gap-2">
                    <UserCheck className="size-4 text-emerald-400" /> {players ? players.length : 0} Registered
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
            <div className="flex gap-2">
              <Button onClick={() => setPaymentModalOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold border border-orange-500/20">
                Upgrade Now
              </Button>
              <Button onClick={handleStartAuction} variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                Start Auction
              </Button>
              <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                <Link to="/auctions/$id" params={{ id: auction.id }}>
                  View Auction
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-4xl overflow-x-auto px-4 hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-4 text-sm font-semibold tracking-wide transition-colors ${
                activeTab === tab ? "border-b-2 border-orange-500 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {tab === "TEAMS" && teams ? `TEAMS (${teams.length})` : tab === "PLAYERS" && players ? `PLAYERS (${players.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-12 pb-32">

        {activeTab === "TEAMS" && (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <Button onClick={handleShareTeamForm} variant="outline" className="gap-2">
                <Share2 className="size-4" /> Share Registration Link
              </Button>
            </div>
            {teamsPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))
            ) : teamsError ? (
              <p className="text-center text-muted-foreground">Failed to load teams.</p>
            ) : teams.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">There is no any team listed.</p>
                <p className="text-muted-foreground">Click the + (plus) button bottom to Add team.</p>
              </div>
            ) : (
              teams.map((team) => {
                const { usedPoints, totalPoints, totalPlayers, reservedPlayers, maxBidPoints } = computeTeamStats(
                  team,
                  players,
                  auction,
                );
                const formatNum = formatPoints;

                return (
                  <div key={team.id} className="relative rounded-2xl border border-border bg-card p-4 card-shadow transition-shadow hover:shadow-md flex flex-col">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <Link
                        to="/my-auctions/$id/teams/$teamId"
                        params={{ id: auction.id, teamId: team.id }}
                        className="shrink-0 size-24 rounded-xl bg-[#1e2329] border border-white/5 flex items-center justify-center overflow-hidden"
                      >
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="size-full object-cover" />
                        ) : (
                          <span className="text-3xl font-bold text-white/50">{team.shortName.slice(0, 3)}</span>
                        )}
                      </Link>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link
                              to="/my-auctions/$id/teams/$teamId"
                              params={{ id: auction.id, teamId: team.id }}
                              className="hover:underline"
                            >
                              <h3 className="font-semibold text-lg text-foreground truncate max-w-[150px] sm:max-w-xs">{team.name}</h3>
                            </Link>
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
                            <div className="font-semibold text-sm sm:text-base">
                              {totalPlayers.toString().padStart(2, '0')} / {auction.playersPerTeam.toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div className="w-px h-6 bg-border shrink-0" />
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase mb-0.5 whitespace-nowrap">Res. Pl</div>
                            <div className="font-semibold text-sm sm:text-base">{reservedPlayers.toString().padStart(2, '0')}</div>
                          </div>
                          <div className="w-px h-6 bg-border shrink-0" />
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase mb-0.5 whitespace-nowrap">Used Pts</div>
                            <div className="font-semibold text-sm sm:text-base text-purple-600">{formatNum(usedPoints)}</div>
                          </div>
                          <div className="w-px h-6 bg-border shrink-0" />
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase mb-0.5 whitespace-nowrap">Max Bid</div>
                            <div className="font-semibold text-sm sm:text-base text-orange-500">{formatNum(maxBidPoints > 0 ? maxBidPoints : 0)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <TeamFormModal 
                        auctionId={auction.id} 
                        team={team} 
                        open={editTeamId === team.id}
                        onOpenChange={(open) => !open && setEditTeamId(null)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 rounded-full bg-muted/50 hover:bg-muted">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setEditTeamId(team.id)}>
                            <Pencil className="mr-2 size-4" /> Edit team
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onSelect={() => setTeamToDelete(team.id)}>
                            <Trash className="mr-2 size-4" /> Delete team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
            <TeamFormModal auctionId={auction.id} />
          </div>
        )}

        {activeTab === "PLAYERS" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-end">
              <Button onClick={handleSharePlayerForm} variant="outline" className="gap-2">
                <Share2 className="size-4" /> Share Registration Link
              </Button>
            </div>
            {playersPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))
            ) : players.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">No players added yet.</p>
                <p className="text-muted-foreground">Click the + (plus) button bottom to Add player.</p>
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
                  <PlayerFormModal
                    auctionId={auction.id}
                    sportType={auction.sportType}
                    playersPerTeam={auction.playersPerTeam}
                    player={player}
                    open={editPlayerId === player.id}
                    onOpenChange={(open) => !open && setEditPlayerId(null)}
                  />
                  <div className="shrink-0 mr-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full size-9 hover:bg-muted">
                          <MoreVertical className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setEditPlayerId(player.id)}>
                          <Pencil className="mr-2 size-4" /> Edit player
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={() => setPlayerToDelete(player.id)}>
                          <Trash className="mr-2 size-4" /> Delete player
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
            <PlayerFormModal auctionId={auction.id} sportType={auction.sportType} playersPerTeam={auction.playersPerTeam} />
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

      {/* Delete Team Dialog */}
      <AlertDialog open={!!teamToDelete} onOpenChange={(o) => !o && setTeamToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team?</AlertDialogTitle>
            <AlertDialogDescription>This will delete the team and unassign any players sold to it. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if(teamToDelete) { deleteTeam(teamToDelete); toast.success("Team deleted"); } }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Player Dialog */}
      <AlertDialog open={!!playerToDelete} onOpenChange={(o) => !o && setPlayerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Player?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. If the player was sold, the team's spent budget will be reversed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if(playerToDelete) { deletePlayer(playerToDelete); toast.success("Player deleted"); } }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Readiness Gate Dialog */}
      <AlertDialog open={readinessModalOpen} onOpenChange={setReadinessModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Auction not ready</AlertDialogTitle>
            <AlertDialogDescription>
              Please add a Team and a player. Then get ready to start your auction!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ChooseAuctionModeDialog open={modeDialogOpen} onOpenChange={setModeDialogOpen} onConfirm={handleConfirmMode} />

      {/* Payment Method Dialog */}
      <AlertDialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Integration with payment gateways (Razorpay, Stripe, etc.) will be added here soon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background p-4 sm:hidden">
        <div className="mx-auto flex max-w-md gap-3">
          <Button variant="outline" className="flex-1 bg-red-700 text-white hover:bg-red-800 hover:text-white border-none" asChild>
            <Link to="/my-auctions/$id/edit" params={{ id: auction.id }}>
              EDIT AUCTION
            </Link>
          </Button>
          <Button onClick={handleStartAuction} className="flex-1 bg-red-700 text-white hover:bg-red-800">
            START AUCTION
          </Button>
        </div>
      </div>
    </div>
  );
}
