import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";

import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Pricing, type PricingPlan } from "@/components/ui/pricing";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const cricketPlans: PricingPlan[] = [
  {
    name: "Gully & Club",
    price: "499",
    yearlyPrice: "399",
    period: "month",
    features: [
      "Up to 6 Franchises / Teams",
      "Up to 100 Players Roster",
      "Live Real-Time Bidding Screen",
      "Auto Purse & Squad Tracking",
      "Mobile & Laptop Bidding Access",
      "Room Code Instant Join",
    ],
    description: "Ideal for local turf, community clubs, and colony cricket tournaments",
    buttonText: "Start Club Plan",
    href: "/auth",
    isPopular: false,
  },
  {
    name: "Premier League",
    price: "1499",
    yearlyPrice: "1199",
    period: "month",
    features: [
      "Up to 16 Franchises / Teams",
      "Unlimited Player Import (Excel / CSV)",
      "Projector & Live Stream Broadcast Overlay",
      "Marquee & Tiered Lot Ordering",
      "Custom Bid Increments & Retention",
      "Priority Support & Timer Controls",
    ],
    description: "Most popular for corporate, district & premier cricket tournaments",
    buttonText: "Get Premier Access",
    href: "/auth",
    isPopular: true,
  },
  {
    name: "Mega Tournament",
    price: "3499",
    yearlyPrice: "2799",
    period: "month",
    features: [
      "Unlimited Teams & Division Brackets",
      "Multiple Auctioneers & Sub-Rooms",
      "Custom Team Branding & Sponsor Logos",
      "Full WhatsApp & SMS Player Alerts",
      "Dedicated Event Specialist On Call",
      "Custom Roster Export & Certificates",
    ],
    description: "Complete turnkey solution for large-scale state & academy tournaments",
    buttonText: "Launch Mega Event",
    href: "/auth",
    isPopular: false,
  },
];

const teamPlans = [
  { name: "Tier 1", teams: "3 Teams", price: "Free", squad: "Up to 5 players per team" },
  { name: "Tier 2", teams: "4 Teams", price: "₹999", squad: "Up to 8 players per team" },
  { name: "Tier 3", teams: "6 Teams", price: "₹1,499", squad: "Up to 12 players per team" },
  { name: "Tier 4", teams: "8 Teams", price: "₹2,499", squad: "Up to 14 players per team" },
  { name: "Tier 5", teams: "12 Teams", price: "₹3,499", squad: "Up to 18 players per team" },
  { name: "Tier 6", teams: "16 Teams", price: "₹4,999", squad: "Up to 22 players per team" },
];

const included = [
  "Live real-time bidding room",
  "Team purse and budget tracking",
  "Player cards with photos and roles",
  "Unsold and re-auction rounds",
  "Projector-friendly bid screen",
  "Downloadable final squad sheets",
];

function PricingPage() {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Interactive Pricing in INR */}
      <section className="pt-8">
        <Pricing
          plans={cricketPlans}
          title="Simple, Transparent Pricing"
          description={"Choose the plan that fits your cricket tournament scale.\nAll plans include live bidding, squad trackers, and real-time purse calculations."}
          currencySymbol="₹"
        />
      </section>

      {/* Team-based packages */}
      <section className="mx-auto max-w-7xl px-4 py-16 border-t border-border">
        <SectionHeading lead="Single Tournament" highlight="Packages" subtitle="One-time flat fee per tournament by team count and squad size." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          {teamPlans.map((p) => (
            <article key={p.name} className="overflow-hidden rounded-2xl border border-border bg-card card-shadow hover:border-[#4f772d] transition-all">
              <div className="p-6 text-center">
                <p className="text-xs font-bold tracking-widest text-[#4f772d] dark:text-[#90a955] uppercase">{p.name}</p>
                <h2 className="display mt-2 text-3xl text-card-foreground">{p.teams}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.squad}</p>
              </div>
              <p className="bg-gradient-to-r from-[#132a13] to-[#31572c] py-3 text-center text-xl font-bold text-[#ecf39e]">{p.price}</p>
              <div className="p-5">
                <button
                  type="button"
                  onClick={() => setComingSoonOpen(true)}
                  className="w-full rounded-full border-2 border-[#4f772d] px-4 py-2.5 font-bold text-[#31572c] dark:text-[#90a955] hover:bg-[#4f772d] hover:text-white transition-all shadow-sm"
                >
                  Select package
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-16 border-t border-border">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading lead="Included in" highlight="Every Plan" />
          <ul className="grid gap-3 sm:grid-cols-2 mt-8">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2.5 rounded-xl bg-card p-4 text-sm card-shadow border border-border/80">
                <Check className="mt-0.5 size-4 shrink-0 text-[#4f772d]" aria-hidden="true" />
                <span className="font-medium text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AlertDialog open={comingSoonOpen} onOpenChange={setComingSoonOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Instant Activation</AlertDialogTitle>
            <AlertDialogDescription>
              We're currently rolling out our integrated UPI &amp; card payment gateway. You can host up to 3 teams free right now or contact support for immediate enterprise tournament activation!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="rounded-full bg-[#31572c] text-white">Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SiteFooter />
    </div>
  );
}

export default PricingPage;
