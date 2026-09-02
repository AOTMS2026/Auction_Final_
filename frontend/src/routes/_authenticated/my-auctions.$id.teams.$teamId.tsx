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
    <div className="rounded-2xl border-2 border-[#38bdf8]/35 bg-[#162b35]/85 backdrop-blur-md p-4 shadow-[0_8px_30px_rgba(15,35,45,0.7)] hover:border-[#38bdf8] transition-all">
      <h3 className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">{title}</h3>
      <p className="mt-1.5 text-2xl font-black text-[#ffffff]">{value.toLocaleString("en-IN")}</p>
      {subtext && <p className="mt-1 text-[11px] text-[#f97316] font-bold">{subtext}</p>}
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
      className="min-h-screen text-[#f2e9dc] pb-24 selection:bg-[#38bdf8] selection:text-[#ffffff]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)",
      }}
    >
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" className="mb-6 -ml-4 text-[#38bdf8] hover:text-[#ffffff] hover:bg-[#1a3847]/60 font-bold" asChild>
          <Link to="/my-auctions/$id" params={{ id: team.auctionId }}>
            <ChevronLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </Button>

        {/* Team Banner */}
        <div 
          className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl p-6 sm:p-8 border-2 border-[#38bdf8]/40 overflow-hidden shadow-[0_15px_45px_rgba(15,35,45,0.85)] bg-[#162b35]/90"
        >
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-black/50 to-black/25 pointer-events-none" />
          
          <div className="relative shrink-0 flex items-center justify-center size-24 rounded-2xl border-2 border-[#38bdf8]/70 overflow-hidden bg-[#142630] shadow-xl">
            {team.logo ? (
              <img src={team.logo} alt={team.name} className="size-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-[#38bdf8]">{team.shortName.slice(0, 3)}</span>
            )}
          </div>
          <div className="relative z-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-[#ffffff] tracking-tight drop-shadow-md">{team.name}</h1>
            <p className="text-[#38bdf8] font-black mt-1 tracking-wider uppercase text-sm">Team Code: {team.shortName}</p>
            {(team.ownerName || team.ownerPhone) && (
              <div className="mt-3.5 text-xs text-[#ffffff] bg-[#142630]/90 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-[#38bdf8]/50 backdrop-blur-md">
                {team.ownerName && <span className="font-black text-[#ffffff]">{team.ownerName}</span>}
                {team.ownerName && team.ownerPhone && <span className="text-[#38bdf8]">•</span>}
                {team.ownerPhone && <span className="text-[#f97316] font-extrabold">{team.ownerPhone}</span>}
              </div>
            )}
          </div>
        </div>

        <h2 className="mt-10 text-xl font-black text-[#ffffff] tracking-tight mb-4">Budget & Roster</h2>
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
            <h2 className="text-xl font-black text-[#ffffff] tracking-tight mb-4">Sold Players</h2>
            {players.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-[#38bdf8]/35 bg-[#162b35]/40 p-8 text-center text-[#f2e9dc]/80 font-bold">
                No players sold to this team yet.
              </div>
            ) : (
              <div className="space-y-3">
                {players.map((p: Player) => (
                  <div key={p.id} className="flex items-center justify-between rounded-2xl border-2 border-[#38bdf8]/30 bg-[#162b35]/85 backdrop-blur-md p-4 shadow-sm hover:border-[#38bdf8] transition-colors">
                    <div className="flex items-center gap-3.5">
                      <FallbackImage
                        src={p.photo || ""}
                        alt={p.name}
                        className="size-11 rounded-full border-2 border-[#38bdf8]/50 shrink-0 object-cover"
                        fallback={
                          <span className="display grid size-full place-items-center rounded-full bg-[#142630] text-xs font-black text-[#38bdf8]">
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        }
                      />
                      <div>
                        <p className="font-black text-sm text-[#ffffff]">{p.name}</p>
                        <p className="text-xs text-[#38bdf8] font-bold">{p.sportFields?.["role"] || p.category || "Player"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-emerald-400">{p.soldPrice ? p.soldPrice.toLocaleString("en-IN") : 0} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Balance History */}
          <div>
            <h2 className="text-xl font-black text-[#ffffff] tracking-tight mb-4">Balance History</h2>
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-2xl border-2 border-[#38bdf8]/30 bg-[#162b35]/85 backdrop-blur-md p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    {h.type === "inflow" ? (
                      <ArrowUpCircle className="size-5 text-emerald-400" />
                    ) : (
                      <ArrowDownCircle className="size-5 text-rose-400" />
                    )}
                    <div>
                      <p className="font-black text-sm text-[#ffffff]">{h.desc}</p>
                      <p className="text-xs text-[#f2e9dc]/70 font-semibold">{format(h.date, "MMM d, yyyy h:mm a")}</p>
                    </div>
                  </div>
                  <div className={`font-black text-sm ${h.type === "inflow" ? "text-emerald-400" : "text-rose-400"}`}>
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
