import { Link } from "@tanstack/react-router";
import { Gavel, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import type { Auction } from "@/lib/auction-client";

type Bid = { id: string; team: string; amount: string; by: string; at: string };

export function BiddingPanel({ auction }: { auction: Auction }) {
  const { user, loading, isAuthenticated } = useAuth();
  const [team, setTeam] = useState("");
  const [amount, setAmount] = useState("");
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [purseConfirmed, setPurseConfirmed] = useState(false);
  const [bids, setBids] = useState<Bid[]>([]);

  const ready = rulesAccepted && purseConfirmed && amount.trim().length > 0 && team.trim().length > 0;

  function placeBid(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated || !ready) return;
    setBids((prev) => [
      {
        id: crypto.randomUUID(),
        team: team.trim(),
        amount: amount.trim(),
        by: user?.email ?? "You",
        at: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    setAmount("");
    toast.success("Bid placed with confirmations recorded.");
  }

  return (
    <section id="bidding" className="mx-auto max-w-4xl px-4 pb-16">
      <div className="rounded-lg border border-border bg-card p-6 card-shadow">
        <h2 className="flex items-center gap-2 text-2xl text-card-foreground">
          <Gavel className="size-5 text-brand" aria-hidden="true" />
          Place a bid
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Minimum bid {auction.minimumBid.toLocaleString()} · increases by {auction.bidIncrement.toLocaleString()} each round
        </p>

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Checking your session…</p>
        ) : !isAuthenticated ? (
          <div className="mt-6 rounded-md bg-accent p-5">
            <p className="flex items-start gap-2 text-sm text-accent-foreground">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Only signed-in franchise owners can place bids and submit bidding confirmations.
            </p>
            <Link
              to="/auth"
              search={{ next: `/auctions/${auction.id}` }}
              className="mt-4 inline-flex rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-dark"
            >
              Sign in to bid
            </Link>
          </div>
        ) : (
          <form onSubmit={placeBid} className="mt-6 space-y-4">
            <p className="text-xs text-muted-foreground">
              Bidding as <span className="font-semibold text-card-foreground">{user?.email}</span>
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="team" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Your franchise / team name
                </label>
                <input
                  id="team"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="e.g. Titans XI"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                />
              </div>
              <div>
                <label htmlFor="amount" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Bid amount
                </label>
                <input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={String(auction.minimumBid)}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                />
              </div>
            </div>

            <fieldset className="space-y-2 rounded-md bg-accent p-4">
              <legend className="px-1 text-xs font-semibold tracking-wide text-accent-foreground uppercase">
                Required confirmations
              </legend>
              <label className="flex items-start gap-2 text-sm text-accent-foreground">
                <input
                  type="checkbox"
                  checked={rulesAccepted}
                  onChange={(e) => setRulesAccepted(e.target.checked)}
                  className="mt-0.5"
                />
                I accept the bidding rules for this auction.
              </label>
              <label className="flex items-start gap-2 text-sm text-accent-foreground">
                <input
                  type="checkbox"
                  checked={purseConfirmed}
                  onChange={(e) => setPurseConfirmed(e.target.checked)}
                  className="mt-0.5"
                />
                I confirm my franchise has the remaining purse to honour this bid.
              </label>
            </fieldset>

            <button
              type="submit"
              disabled={!ready}
              className="w-full rounded-md bg-brand px-4 py-3 font-semibold text-brand-foreground hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Place bid
            </button>
          </form>
        )}

        {bids.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg text-card-foreground">Your bids this session</h3>
            <ul className="mt-3 divide-y divide-border">
              {bids.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="font-semibold text-card-foreground">{b.team}</span>
                  <span className="text-brand">{b.amount}</span>
                  <span className="text-xs text-muted-foreground">{b.at}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Demo bidding room — bids are shown for this session only.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
