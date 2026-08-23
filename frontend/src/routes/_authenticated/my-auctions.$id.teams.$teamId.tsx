import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

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
    <div className="rounded-lg border border-border bg-card p-4 card-shadow">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subtext && <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>}
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
    <div className="min-h-screen bg-background pb-24">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" asChild>
          <Link to="/my-auctions/$id" params={{ id: team.auctionId }}>
            <ChevronLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </Button>

        {/* Team Banner */}
        <div 
          className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-xl p-6 card-shadow border border-border overflow-hidden"
          style={{ 
            backgroundColor: team.colorTheme ? team.colorTheme : 'var(--card)',
            color: team.colorTheme ? '#fff' : 'inherit'
          }}
        >
          {/* Subtle overlay for contrast if color theme is used */}
          {team.colorTheme && (
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          )}
          
          <div className="relative shrink-0 flex items-center justify-center size-24 rounded-full border-4 border-background overflow-hidden bg-muted shadow-md">
            {team.logo ? (
              <img src={team.logo} alt={team.name} className="size-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">{team.shortName.slice(0, 3)}</span>
            )}
          </div>
          <div className="relative z-10 text-center sm:text-left">
            <h1 className="text-3xl font-bold drop-shadow-sm">{team.name}</h1>
            <p className="opacity-90 font-medium">Team Code: {team.shortName}</p>
            {(team.ownerName || team.ownerPhone) && (
              <div className="mt-3 text-sm opacity-80 bg-black/20 inline-block px-3 py-1.5 rounded-lg backdrop-blur-sm">
                {team.ownerName && <span className="font-semibold">{team.ownerName}</span>}
                {team.ownerName && team.ownerPhone && <span className="mx-2">•</span>}
                {team.ownerPhone && <span>{team.ownerPhone}</span>}
              </div>
            )}
          </div>
        </div>

        <h2 className="mt-12 text-xl font-semibold mb-4">Budget & Roster</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard title="Total Points" value={stats.totalPoints} />
          <StatCard title="Used Points" value={stats.usedPoints} />
          <StatCard title="Available Points" value={stats.availablePoints} />
          <StatCard title="Max Bid" value={stats.maxBidPoints} subtext={`Reserving ${stats.reservedPlayers} spots`} />
          <StatCard title="Total Players" value={stats.totalPlayers} />
          <StatCard title="Reserved Spots" value={stats.reservedPlayers} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Sold Players */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Sold Players</h2>
            {players.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                No players sold yet.
              </div>
            ) : (
              <div className="space-y-3">
                {players.map((p: Player) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 card-shadow">
                    <div className="flex items-center gap-4">
                      <FallbackImage
                        src={p.photo || ""}
                        alt={p.name}
                        className="size-10 rounded-full border border-border shrink-0"
                        fallback={
                          <span className="display grid size-full place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        }
                      />
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sportFields?.["role"] || p.category || "Player"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand">{p.soldPrice} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Balance History */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Balance History</h2>
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 card-shadow">
                  <div className="flex items-center gap-3">
                    {h.type === "inflow" ? (
                      <ArrowUpCircle className="size-5 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="size-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-semibold">{h.desc}</p>
                      <p className="text-xs text-muted-foreground">{format(h.date, "MMM d, yyyy h:mm a")}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${h.type === "inflow" ? "text-green-500" : "text-red-500"}`}>
                    {h.type === "inflow" ? "+" : "-"}{h.amount}
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
