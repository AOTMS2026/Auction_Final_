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
    <div
      className="min-h-screen text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
      }}
    >
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-12 border-b border-[#5c6875]/30">
        <img
          src={stadiumImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171a1d] via-[#171a1d]/85 to-[#162235]/50" />
        
        <div className="relative mx-auto max-w-4xl px-4 pt-8">
          <div className="flex items-start gap-4 sm:gap-6">
            <FallbackImage
              src={auction.coverImage || ""}
              alt=""
              className="size-20 rounded-2xl border-2 border-[#a1b5d8]/40 sm:size-28 object-cover shadow-lg"
              fallback={
                <span className="display grid size-full place-items-center rounded-2xl bg-gradient-to-br from-[#4365a0] to-[#6a9b57] text-2xl font-bold text-[#fffcf7] shadow-lg">
                  {auction.name.slice(0, 2).toUpperCase()}
                </span>
              }
            />
            <div className="flex-1 text-[#fffcf7]">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#162235]/80 border border-[#a1b5d8]/40 text-[#a1b5d8] text-[11px] font-bold uppercase tracking-wider mb-2">
                Live Tournament
              </div>
              <h1 className="text-2xl font-black sm:text-4xl tracking-tight">{auction.name}</h1>
              
              <div className="mt-2 space-y-1.5 text-sm sm:text-base text-[#abb4bd]">
                <p className="flex items-center gap-2">
                  Auction Code: <span className="font-mono text-[#a1b5d8] font-bold bg-[#162235]/60 px-2 py-0.5 rounded-md border border-[#a1b5d8]/30">{auction.id.slice(-6)}</span>
                  <button onClick={copyCode} className="hover:text-[#a1b5d8] transition-colors" aria-label="Copy code">
                    <Copy className="size-4" />
                  </button>
                </p>
                <p className="flex items-center gap-2 text-[#abb4bd]">
                  <CalendarDays className="size-4 text-[#a1b5d8]" />
                  {format(new Date(auction.startsAt), "dd-MM-yyyy, h:mm a")}
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[#abb4bd]">
                  <span className="flex items-center gap-2">
                    <Users className="size-4 text-[#a1b5d8]" /> {auction.playersPerTeam} Player Per Team
                  </span>
                  <span className="flex items-center gap-2">
                    <UserCheck className="size-4 text-[#e4f0d0]" /> {players ? players.length : 0} Registered
                  </span>
                  <Countdown targetDate={auction.startsAt} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between pb-4">
            <div className="flex items-center gap-2 font-bold text-[#e4f0d0]">
              <span className="text-lg px-3 py-1 rounded-full bg-[#162235]/80 border border-[#e4f0d0]/30 shadow-sm">✨ Free Tier</span>
            </div>
            <div className="flex gap-2.5">
              <Button
                onClick={() => setPaymentModalOpen(true)}
                className="rounded-full px-5 py-2 font-bold text-xs text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_15px_rgba(161,181,216,0.3)]"
              >
                Upgrade Plan
              </Button>
              <Button
                onClick={handleStartAuction}
                variant="outline"
                className="rounded-full border-[#a1b5d8]/40 bg-[#162235]/70 text-[#a1b5d8] hover:bg-[#a1b5d8]/20 font-semibold"
              >
                Start Auction
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-[#5c6875]/50 bg-[#171a1d]/60 text-[#fffcf7] hover:bg-[#2e343a]"
              >
                <Link to="/auctions/$id" params={{ id: auction.id }}>
                  View Auction
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Bar with Slate Grey & Powder Blue Accents */}
      <div className="bg-[#171a1d] text-[#fffcf7] border-b border-[#5c6875]/30 sticky top-[57px] z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl overflow-x-auto px-4 hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-4 text-xs font-bold tracking-wider uppercase transition-colors ${
                activeTab === tab ? "border-b-2 border-[#a1b5d8] text-[#a1b5d8]" : "text-[#abb4bd] hover:text-[#fffcf7]"
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
              <Button
                onClick={handleShareTeamForm}
                variant="outline"
                className="gap-2 rounded-full border border-[#a1b5d8]/40 bg-[#162235]/70 text-[#a1b5d8] hover:bg-[#a1b5d8]/20 hover:text-[#fffcf7] font-semibold text-xs transition-all shadow-sm"
              >
                <Share2 className="size-4 text-[#a1b5d8]" /> Share Registration Link
              </Button>
            </div>
            {teamsPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl bg-[#2e343a]/50 border border-[#5c6875]/20" />
              ))
            ) : teamsError ? (
              <div className="rounded-3xl border border-[#5c6875]/40 bg-[#2e343a]/70 p-10 text-center shadow-lg">
                <p className="text-[#abb4bd]">Failed to load teams.</p>
              </div>
            ) : teams.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border-2 border-dashed border-[#5c6875]/40 bg-[#2e343a]/30 p-8">
                <p className="text-[#abb4bd] font-medium">There are no teams listed yet.</p>
                <p className="text-xs text-[#a1b5d8] mt-1.5">Click the + (plus) button below to add your first team.</p>
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
                  <div
                    key={team.id}
                    className="relative rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 sm:p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)] hover:border-[#a1b5d8]/60 hover:shadow-[0_12px_35px_rgba(161,181,216,0.2)] transition-all duration-300 flex flex-col group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <Link
                        to="/my-auctions/$id/teams/$teamId"
                        params={{ id: auction.id, teamId: team.id }}
                        className="shrink-0 size-20 sm:size-24 rounded-2xl bg-[#162235] border border-[#a1b5d8]/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#a1b5d8]/60 transition-colors"
                      >
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="size-full object-cover" />
                        ) : (
                          <span className="text-2xl sm:text-3xl font-black text-[#a1b5d8]">{team.shortName.slice(0, 3)}</span>
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
                              <h3 className="font-extrabold text-lg sm:text-xl text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors truncate max-w-[150px] sm:max-w-xs">
                                {team.name}
                              </h3>
                            </Link>
                            <p className="text-xs text-[#a1b5d8] mt-0.5 font-bold uppercase tracking-wider">{team.shortName}</p>
                          </div>
                          
                          {/* Right side Total Points */}
                          <div className="text-right pl-2 shrink-0">
                            <div className="text-xl font-black text-[#a1b5d8] leading-none mb-1">{formatNum(totalPoints)}</div>
                            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold whitespace-nowrap">Total Points</div>
                          </div>
                        </div>
                        
                        {/* Stats Row */}
                        <div className="flex items-center gap-3 sm:gap-4 mt-3 overflow-x-auto hide-scrollbar">
                          <div>
                            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Total Pl</div>
                            <div className="font-extrabold text-sm sm:text-base text-[#fffcf7]">
                              {totalPlayers.toString().padStart(2, '0')} / {auction.playersPerTeam.toString().padStart(2, '0')}
                            </div>
                          </div>
                          <div className="w-px h-6 bg-[#5c6875]/40 shrink-0" />
                          <div>
                            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Res. Pl</div>
                            <div className="font-extrabold text-sm sm:text-base text-[#e3e6e9]">{reservedPlayers.toString().padStart(2, '0')}</div>
                          </div>
                          <div className="w-px h-6 bg-[#5c6875]/40 shrink-0" />
                          <div>
                            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Used Pts</div>
                            <div className="font-extrabold text-sm sm:text-base text-[#c2d8b9]">{formatNum(usedPoints)}</div>
                          </div>
                          <div className="w-px h-6 bg-[#5c6875]/40 shrink-0" />
                          <div>
                            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap">Max Bid</div>
                            <div className="font-extrabold text-sm sm:text-base text-[#e4f0d0]">{formatNum(maxBidPoints > 0 ? maxBidPoints : 0)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 rounded-full bg-[#171a1d]/60 text-[#abb4bd] hover:bg-[#a1b5d8]/20 hover:text-[#a1b5d8]">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
                          <DropdownMenuItem onSelect={() => setEditTeamId(team.id)} className="hover:bg-[#2e343a]">
                            <Pencil className="mr-2 size-4 text-[#a1b5d8]" /> Edit team
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive hover:bg-destructive/15" onSelect={() => setTeamToDelete(team.id)}>
                            <Trash className="mr-2 size-4" /> Delete team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
            {editTeamId && (
              <TeamFormModal 
                auctionId={auction.id} 
                team={teams.find((t) => t.id === editTeamId)} 
                open={!!editTeamId}
                onOpenChange={(open) => !open && setEditTeamId(null)}
              />
            )}
            <TeamFormModal auctionId={auction.id} />
          </div>
        )}

        {activeTab === "PLAYERS" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-end">
              <Button
                onClick={handleSharePlayerForm}
                variant="outline"
                className="gap-2 rounded-full border border-[#a1b5d8]/40 bg-[#162235]/70 text-[#a1b5d8] hover:bg-[#a1b5d8]/20 hover:text-[#fffcf7] font-semibold text-xs transition-all shadow-sm"
              >
                <Share2 className="size-4 text-[#a1b5d8]" /> Share Registration Link
              </Button>
            </div>
            {playersPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl bg-[#2e343a]/50 border border-[#5c6875]/20" />
              ))
            ) : players.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border-2 border-dashed border-[#5c6875]/40 bg-[#2e343a]/30 p-8">
                <p className="text-[#abb4bd] font-medium">No players added yet.</p>
                <p className="text-xs text-[#a1b5d8] mt-1.5">Click the + (plus) button below to register players.</p>
              </div>
            ) : (
              players.map((player) => (
                <div
                  key={player.id}
                  className="relative flex items-center gap-4 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 sm:p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)] hover:border-[#a1b5d8]/60 hover:shadow-[0_12px_35px_rgba(161,181,216,0.2)] transition-all duration-300 group"
                >
                  <PlayerPreviewCard
                    player={player}
                    open={previewPlayerId === player.id}
                    onOpenChange={(open) => !open && setPreviewPlayerId(null)}
                    trigger={
                      <button 
                        className="flex flex-1 items-center gap-4 sm:gap-5 text-left hover:opacity-90 transition-opacity min-w-0 pr-8"
                        onClick={() => setPreviewPlayerId(player.id)}
                      >
                        <FallbackImage
                          src={player.photo || ""}
                          alt={player.name}
                          className="size-14 sm:size-16 rounded-2xl border-2 border-[#a1b5d8]/40 shrink-0 object-cover object-top shadow-md group-hover:border-[#a1b5d8]/70 transition-colors"
                          fallback={
                            <span className="display grid size-full place-items-center rounded-2xl bg-gradient-to-br from-[#4365a0] to-[#6a9b57] text-2xl font-bold text-[#fffcf7]">
                              {player.name.slice(0, 2).toUpperCase()}
                            </span>
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-lg sm:text-xl text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors truncate">
                            {player.name}
                          </h3>
                          <p className="text-xs sm:text-sm font-semibold text-[#a1b5d8] mt-1 leading-snug flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#162235] border border-[#a1b5d8]/30 text-[#e4f0d0] text-xs font-bold uppercase">
                              {player.sportFields?.["role"] || "-"}
                            </span>
                            <span className="text-[#abb4bd]">·</span>
                            <span className="text-[#e3e6e9]">Grade {player.category || "-"}</span>
                            <span className="text-[#abb4bd]">·</span>
                            <span className="text-[#c2d8b9]">{player.customData ? player.customData.replace("Dominated Hand: ", "") : "-"}</span>
                          </p>
                        </div>
                      </button>
                    }
                  />
                  <div className="shrink-0 mr-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full size-9 bg-[#171a1d]/60 text-[#abb4bd] hover:bg-[#a1b5d8]/20 hover:text-[#a1b5d8]">
                          <MoreVertical className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
                        <DropdownMenuItem onSelect={() => setEditPlayerId(player.id)} className="hover:bg-[#2e343a]">
                          <Pencil className="mr-2 size-4 text-[#a1b5d8]" /> Edit player
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hover:bg-destructive/15" onSelect={() => setPlayerToDelete(player.id)}>
                          <Trash className="mr-2 size-4" /> Delete player
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
            {/* Only trigger player modal & API image fetch when editing a specific player */}
            {editPlayerId && (
              <PlayerFormModal
                auctionId={auction.id}
                sportType={auction.sportType}
                playersPerTeam={auction.playersPerTeam}
                player={players.find((p) => p.id === editPlayerId)}
                open={!!editPlayerId}
                onOpenChange={(open) => {
                  if (!open) setEditPlayerId(null);
                }}
              />
            )}
            <PlayerFormModal auctionId={auction.id} sportType={auction.sportType} playersPerTeam={auction.playersPerTeam} />
          </div>
        )}

        {activeTab === "ABOUT" && (
          <AboutTab auction={auction} teams={teams} players={players} />
        )}

        {activeTab !== "TEAMS" && activeTab !== "PLAYERS" && activeTab !== "ABOUT" && (
          <div className="py-16 text-center rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/50 p-10">
            <p className="text-[#abb4bd] font-medium text-sm">{activeTab} tab analytics & tools are launching shortly.</p>
          </div>
        )}
      </main>

      {/* Delete Team Dialog */}
      <AlertDialog open={!!teamToDelete} onOpenChange={(o) => !o && setTeamToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#abb4bd]">
              This will delete the team and unassign any players sold to it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-6 shadow-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if(teamToDelete) { deleteTeam(teamToDelete); toast.success("Team deleted"); } }}
              className="rounded-full bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Player Dialog */}
      <AlertDialog open={!!playerToDelete} onOpenChange={(o) => !o && setPlayerToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Player?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#abb4bd]">
              This action cannot be undone. If the player was sold, the team's spent budget will be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-6 shadow-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if(playerToDelete) { deletePlayer(playerToDelete); toast.success("Player deleted"); } }}
              className="rounded-full bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Readiness Gate Dialog */}
      <AlertDialog open={readinessModalOpen} onOpenChange={setReadinessModalOpen}>
        <AlertDialogContent className="rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
          <AlertDialogHeader>
            <AlertDialogTitle>Auction not ready</AlertDialogTitle>
            <AlertDialogDescription className="text-[#abb4bd]">
              Please add a Team and a player. Then get ready to start your auction!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="rounded-full bg-gradient-to-r from-[#6c8cc2] to-[#a1b5d8] text-[#162235] font-bold">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ChooseAuctionModeDialog open={modeDialogOpen} onOpenChange={setModeDialogOpen} onConfirm={handleConfirmMode} />

      {/* Payment Method Dialog */}
      <AlertDialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <AlertDialogContent className="rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]">
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Method</AlertDialogTitle>
            <AlertDialogDescription className="text-[#abb4bd]">
              Integration with payment gateways (Razorpay, Stripe, etc.) will be added here soon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="rounded-full bg-gradient-to-r from-[#6c8cc2] to-[#a1b5d8] text-[#162235] font-bold">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mobile Sticky Bar in Powder Blue & Tea Green */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#5c6875]/40 bg-[#171a1d]/95 backdrop-blur-md p-4 sm:hidden z-40">
        <div className="mx-auto flex max-w-md gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-full py-2.5 h-auto font-bold text-xs border border-[#a1b5d8]/40 bg-[#162235]/80 text-[#a1b5d8] hover:bg-[#a1b5d8]/20"
            asChild
          >
            <Link to="/my-auctions/$id/edit" params={{ id: auction.id }}>
              EDIT AUCTION
            </Link>
          </Button>
          <Button
            onClick={handleStartAuction}
            className="flex-1 rounded-full py-2.5 h-auto font-black text-xs text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_20px_rgba(161,181,216,0.35)]"
          >
            START AUCTION
          </Button>
        </div>
      </div>
    </div>
  );
}
