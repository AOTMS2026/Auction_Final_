import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Auction Plans & Pricing — PitchBid" },
      {
        name: "description",
        content:
          "Pick a cricket auction plan by team count: free for 3 teams, paid plans up to 16 teams with live bidding and squad limits.",
      },
      { property: "og:title", content: "Auction Plans & Pricing — PitchBid" },
      {
        property: "og:description",
        content: "Cricket auction plans priced by team count, from a free 3-team auction to 16-team leagues.",
      },
    ],
  }),
  component: PricingPage,
});

const plans = [
  { name: "Plan 1", teams: "3 Teams", price: "Free", squad: "Up to 5 players" },
  { name: "Plan 2", teams: "4 Teams", price: "₹999", squad: "Up to 8 players" },
  { name: "Plan 3", teams: "6 Teams", price: "₹1,499", squad: "Up to 12 players" },
  { name: "Plan 4", teams: "8 Teams", price: "₹2,499", squad: "Up to 14 players" },
  { name: "Plan 5", teams: "12 Teams", price: "₹3,499", squad: "Up to 18 players" },
  { name: "Plan 6", teams: "16 Teams", price: "₹4,999", squad: "Up to 22 players" },
];

const included = [
  "Live real-time bidding room",
  "Team purse and budget tracking",
  "Player cards with photos and roles",
  "Unsold and re-auction rounds",
  "Projector-friendly bid screen",
  "Downloadable final squad sheets",
];

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function PricingPage() {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="ribbon py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl text-brand-foreground md:text-5xl">Auction plans &amp; pricing</h1>
          <p className="mt-3 text-brand-foreground/85">
            One-time price per auction. Start free with three teams and upgrade when your league grows.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading lead="Choose your" highlight="Plan" subtitle="Priced by team count and squad size." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <article key={p.name} className="overflow-hidden rounded-lg border border-border bg-card card-shadow">
              <div className="p-6 text-center">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{p.name}</p>
                <h2 className="display mt-2 text-3xl text-card-foreground">{p.teams}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.squad}</p>
              </div>
              <p className="ribbon py-3 text-center text-xl font-semibold">{p.price}</p>
              <div className="p-5">
                <button
                  type="button"
                  onClick={() => setComingSoonOpen(true)}
                  className="w-full rounded-md border border-brand px-4 py-2 font-semibold text-brand hover:bg-accent transition-colors"
                >
                  Select plan
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading lead="Included in" highlight="Every Plan" />
          <ul className="grid gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-md bg-card p-4 text-sm card-shadow">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AlertDialog open={comingSoonOpen} onOpenChange={setComingSoonOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Coming Soon</AlertDialogTitle>
            <AlertDialogDescription>
              We're currently rolling out our payment system. Upgraded plans will be available for purchase very soon!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SiteFooter />
    </div>
  );
}
