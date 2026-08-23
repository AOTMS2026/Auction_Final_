import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, Loader2, MoreVertical, ExternalLink } from "lucide-react";
import { useState } from "react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { FallbackImage } from "@/components/ui/fallback-image";
import { usePlayerProfile } from "@/hooks/usePlayerProfile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/players/$phone")({
  component: PlayerProfilePage,
});

function PlayerProfilePage() {
  const { phone } = Route.useParams();
  const { data: profile, isLoading, isError } = usePlayerProfile(phone);
  const [activeTab, setActiveTab] = useState<"AUCTIONS" | "BEST_PRICE">("AUCTIONS");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="py-20 text-center text-muted-foreground">
          Player not found.
        </div>
      </div>
    );
  }

  const { profile: info, stats, history } = profile;

  // Tabs logic
  const displayHistory = activeTab === "AUCTIONS" 
    ? [...history] // usually sorted by date descending from backend
    : [...history].sort((a, b) => (b.soldPrice || 0) - (a.soldPrice || 0));

  return (
    <div className="min-h-screen bg-background pb-32">
      <SiteHeader />
      
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="shrink-0 -ml-2">
              <button onClick={() => window.history.back()} aria-label="Go back">
                <ArrowLeft className="size-5" />
              </button>
            </Button>
            
            <FallbackImage
              src={info.photo || ""}
              alt={info.name}
              className="size-14 sm:size-16 rounded-full border-2 border-border object-cover shrink-0"
              fallback={
                <span className="display grid size-full place-items-center rounded-full bg-brand/10 text-2xl font-bold text-brand">
                  {info.name.slice(0, 2).toUpperCase()}
                </span>
              }
            />
            
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{info.name}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground flex items-center gap-2">
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                  {info.role}
                </span>
                {info.phone}
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-4xl px-4 pt-6">
        {/* Aggregates */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
            <div className="text-sm font-medium text-muted-foreground mb-1">Auctions</div>
            <div className="text-2xl sm:text-3xl font-bold">{stats.joinedAuctions}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
            <div className="text-sm font-medium text-muted-foreground mb-1">Teams</div>
            <div className="text-2xl sm:text-3xl font-bold">{stats.joinedTeams}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
            <div className="text-sm font-medium text-muted-foreground mb-1">Overall ASP</div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-500">{stats.overallASP > 0 ? stats.overallASP : "---"}</div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab("AUCTIONS")}
            className={`pb-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "AUCTIONS" 
                ? "border-b-2 border-brand text-brand" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Auctions
          </button>
          <button
            onClick={() => setActiveTab("BEST_PRICE")}
            className={`pb-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "BEST_PRICE" 
                ? "border-b-2 border-brand text-brand" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Best Sold Price
          </button>
        </div>
        
        {/* History List */}
        <div className="space-y-4">
          {displayHistory.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg">
              No auction history found.
            </div>
          ) : (
            displayHistory.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-sm relative">
                <div className="flex gap-4">
                  <div className="shrink-0 size-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    {item.auctionCover ? (
                      <img src={item.auctionCover} alt="" className="size-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-muted-foreground/50">{item.auctionName.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg truncate max-w-[200px] sm:max-w-xs">{item.auctionName}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(item.auctionDate), "MMM d, yyyy")} · {item.playersPerTeam} Player Per Team
                        </p>
                      </div>
                      
                      <div className="text-right pl-2 shrink-0 pr-6">
                        {item.soldPrice ? (
                          <>
                            <div className="text-lg font-bold text-purple-600 leading-none mb-1">{item.soldPrice}</div>
                            <div className="text-[10px] text-muted-foreground uppercase whitespace-nowrap">Sold For</div>
                          </>
                        ) : (
                          <>
                            <div className="text-lg font-bold text-muted-foreground leading-none mb-1">Unsold</div>
                            <div className="text-[10px] text-muted-foreground uppercase whitespace-nowrap">Status</div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {item.teamId && (
                      <div className="mt-3 flex items-center gap-2 bg-muted/30 rounded-md p-2">
                        <div className="size-6 rounded bg-[#1e2329] flex items-center justify-center overflow-hidden shrink-0">
                          {item.teamLogo ? (
                            <img src={item.teamLogo} alt="" className="size-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-white/50">{item.teamName?.slice(0, 2)}</span>
                          )}
                        </div>
                        <span className="text-sm font-medium truncate">{item.teamName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute top-3 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-full">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/my-auctions/$id" params={{ id: item.auctionId }}>
                          <ExternalLink className="mr-2 size-4" /> View Auction
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
