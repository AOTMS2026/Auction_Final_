import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { format } from "date-fns";

import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/fallback-image";
import { auctionClient, type Player } from "@/lib/auction-client";

export const Route = createFileRoute("/_authenticated/my-auctions/$id/teams/$teamId")({
  loader: async ({ params }) => {
    try {
      const [{ team, stats }, players] = await Promise.all([
        auctionClient.getTeamStats(params.teamId),
        auctionClient.getPlayers(params.id),
      ]);
      const teamPlayers = players.filter((p: Player) => p.teamId === params.teamId);
      return { team, stats, players: teamPlayers };
    } catch {
      throw notFound();
    }
  },
  component: TeamDetailsPage,
});

function StatCard({ title, value, subtext }: { title: string; value: number; subtext?: string }) {
  return (
    <div className="rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 shadow-[0_8px_30px_rgba(23,26,29,0.5)]">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">{title}</h3>
      <p className="mt-1.5 text-2xl font-black text-[#fffcf7]">{value.toLocaleString("en-IN")}</p>
      {subtext && <p className="mt-1 text-[11px] text-[#a1b5d8] font-medium">{subtext}</p>}
    </div>
  );
}

function TeamDetailsPage() {
  const { team, stats, players } = Route.useLoaderData();

  // Create Balance History
  // Initial allocation
  const history = [
    {
      id: "initial",
      desc: "Initial Budget Allocation",
      amount: stats.totalPoints,
      type: "inflow",
      date: new Date(team.createdAt),
    }
  ];

  // Each player bought
  players.forEach((p: Player) => {
    if (p.soldPrice) {
      history.push({
        id: p.id,
        desc: `Bought ${p.name}`,
        amount: p.soldPrice,
        type: "outflow",
        date: new Date(p.updatedAt),
      });
    }
  });

  // Sort history by date descending
  history.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div
      className="min-h-screen text-[#fffcf7] pb-24 selection:bg-[#a1b5d8] selection:text-[#162235]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
      }}
    >
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" className="mb-6 -ml-4 text-[#a1b5d8] hover:text-[#fffcf7] hover:bg-[#2e343a]/50" asChild>
          <Link to="/my-auctions/$id" params={{ id: team.auctionId }}>
            <ChevronLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </Button>

        {/* Team Banner */}
        <div 
          className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl p-6 sm:p-8 border border-[#5c6875]/40 overflow-hidden shadow-[0_15px_45px_rgba(23,26,29,0.8)]"
          style={{ 
            backgroundColor: team.colorTheme ? team.colorTheme : '#2e343a',
            color: '#fffcf7'
          }}
        >
          {/* Subtle overlay for contrast if color theme is used */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/70 via-black/40 to-black/20 pointer-events-none" />
          
          <div className="relative shrink-0 flex items-center justify-center size-24 rounded-2xl border-2 border-[#a1b5d8]/40 overflow-hidden bg-[#162235] shadow-xl">
            {team.logo ? (
              <img src={team.logo} alt={team.name} className="size-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-[#a1b5d8]">{team.shortName.slice(0, 3)}</span>
            )}
          </div>
          <div className="relative z-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-[#fffcf7] tracking-tight drop-shadow-md">{team.name}</h1>
            <p className="text-[#a1b5d8] font-bold mt-1 tracking-wider uppercase text-sm">Team Code: {team.shortName}</p>
            {(team.ownerName || team.ownerPhone) && (
              <div className="mt-3.5 text-xs text-[#e3e6e9] bg-black/40 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                {team.ownerName && <span className="font-bold text-[#fffcf7]">{team.ownerName}</span>}
                {team.ownerName && team.ownerPhone && <span className="text-[#abb4bd]">•</span>}
                {team.ownerPhone && <span className="text-[#a1b5d8]">{team.ownerPhone}</span>}
              </div>
            )}
          </div>
        </div>

        <h2 className="mt-10 text-xl font-black text-[#fffcf7] tracking-tight mb-4">Budget & Roster</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard title="Total Points" value={stats.totalPoints} />
          <StatCard title="Used Points" value={stats.usedPoints} />
          <StatCard title="Available Points" value={stats.availablePoints} />
          <StatCard title="Max Bid" value={stats.maxBidPoints} subtext={`Reserving ${stats.reservedPlayers} spots`} />
          <StatCard title="Total Players" value={stats.totalPlayers} />
          <StatCard title="Reserved Spots" value={stats.reservedPlayers} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Sold Players */}
          <div>
            <h2 className="text-xl font-black text-[#fffcf7] tracking-tight mb-4">Sold Players</h2>
            {players.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#5c6875]/40 bg-[#2e343a]/30 p-8 text-center text-[#abb4bd] font-medium">
                No players sold to this team yet.
              </div>
            ) : (
              <div className="space-y-3">
                {players.map((p: Player) => (
                  <div key={p.id} className="flex items-center justify-between rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 shadow-sm hover:border-[#a1b5d8]/40 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <FallbackImage
                        src={p.photo || ""}
                        alt={p.name}
                        className="size-11 rounded-full border border-[#a1b5d8]/30 shrink-0 object-cover"
                        fallback={
                          <span className="display grid size-full place-items-center rounded-full bg-[#162235] text-xs font-bold text-[#a1b5d8]">
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        }
                      />
                      <div>
                        <p className="font-bold text-sm text-[#fffcf7]">{p.name}</p>
                        <p className="text-xs text-[#abb4bd]">{p.sportFields?.["role"] || p.category || "Player"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-[#c2d8b9]">{p.soldPrice ? p.soldPrice.toLocaleString("en-IN") : 0} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Balance History */}
          <div>
            <h2 className="text-xl font-black text-[#fffcf7] tracking-tight mb-4">Balance History</h2>
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    {h.type === "inflow" ? (
                      <ArrowUpCircle className="size-5 text-[#c2d8b9]" />
                    ) : (
                      <ArrowDownCircle className="size-5 text-red-400" />
                    )}
                    <div>
                      <p className="font-bold text-sm text-[#fffcf7]">{h.desc}</p>
                      <p className="text-xs text-[#abb4bd]">{format(h.date, "MMM d, yyyy h:mm a")}</p>
                    </div>
                  </div>
                  <div className={`font-black text-sm ${h.type === "inflow" ? "text-[#c2d8b9]" : "text-red-400"}`}>
                    {h.type === "inflow" ? "" : "-"}{h.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TeamDetailsPage;
