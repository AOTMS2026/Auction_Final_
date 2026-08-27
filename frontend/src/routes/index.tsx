import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { isToday, isFuture } from "date-fns";
import {
  BadgeCheck,
  Gauge,
  Globe2,
  ListOrdered,
  Play,
  Radio,
  Smartphone,
  Star,
  Tv,
  Users,
  Wallet,
} from "lucide-react";

import heroImg from "@/assets/hero-auction.jpg";
import stadiumImg from "@/assets/stadium-band.jpg";
import stepCreate from "@/assets/step-create.jpg";
import stepTeams from "@/assets/step-teams.jpg";
import stepPlayers from "@/assets/step-players.jpg";
import stepBid from "@/assets/step-bid.jpg";
import { AuctionCard, AuctionCardSkeleton } from "@/components/site/AuctionCard";
import { auctionListQueryOptions } from "@/lib/queries/auctions";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PitchBid — Live Cricket Player Auction Software" },
      {
        name: "description",
        content:
          "Run live cricket player auctions online: build teams, set budgets, bid in real time and manage rosters from any device.",
      },
      { property: "og:title", content: "PitchBid — Live Cricket Player Auction Software" },
      {
        property: "og:description",
        content:
          "Host real-time cricket auctions for your tournament with live bidding, team wallets and instant player cards.",
      },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Radio, title: "Live player bidding", body: "Owners bid together in real time with instant sold updates on every screen." },
  { icon: Globe2, title: "Web + app access", body: "Run the auction from a laptop and let team owners join from their phones." },
  { icon: Gauge, title: "Tournament control", body: "Set purse limits, base prices, bid increments and unsold rules before you start." },
  { icon: Users, title: "Team management", body: "Create teams, assign owners and track squad composition as the auction runs." },
  { icon: BadgeCheck, title: "Player profiles", body: "Photos, roles, stats and base price on a broadcast-ready player card." },
  { icon: Tv, title: "Broadcast overlay", body: "Show the live bid screen on a projector or stream it for the crowd." },
  { icon: Wallet, title: "Purse tracking", body: "Remaining budget per team recalculates automatically after every sale." },
  { icon: ListOrdered, title: "Auto lot ordering", body: "Shuffle, group by role, or run marquee sets in the order you choose." },
  { icon: Smartphone, title: "Join by code", body: "Share a short room code so owners and viewers can join in seconds." },
];

const stats = [
  { value: "63,800+", label: "Auctions" },
  { value: "138,500+", label: "Organizers" },
  { value: "105,900+", label: "Teams" },
  { value: "541,000+", label: "Players" },
];

const steps = [
  { img: stepCreate, title: "Create auction", body: "Name your tournament, set the purse and pick your bidding rules." },
  { img: stepTeams, title: "Add teams", body: "Add franchises with logos and invite each owner to their team." },
  { img: stepPlayers, title: "Add players", body: "Import your player pool with roles, photos and base prices." },
  { img: stepBid, title: "Start bidding", body: "Go live, call each lot and let owners bid until the hammer falls." },
];

const testimonials = [
  {
    name: "Rahul Mehta",
    role: "Organizer, Corporate League",
    quote: "Our 12-team auction finished in two hours with zero spreadsheet arguments.",
  },
  {
    name: "Sana Qureshi",
    role: "Team owner",
    quote: "Bidding from my phone while sitting with my squad felt exactly like the real thing.",
  },
  {
    name: "Vikram Patel",
    role: "Club secretary",
    quote: "Purse tracking and unsold rounds are handled automatically — that saved our evening.",
  },
];

function Index() {
  const { isAuthenticated } = useAuth();
  const { data: auctions, isPending, isError, refetch } = useQuery({
    ...auctionListQueryOptions(),
    // Auto-refresh so today/upcoming stays correct as real time passes
    // (e.g. across a midnight rollover) without requiring a manual reload.
    refetchInterval: 60_000,
  });
  const today = (auctions ?? []).filter((a) => isToday(new Date(a.startsAt)));
  // Strictly future, not just "not today" — a past-dated auction is neither
  // today's nor upcoming, so it must not fall through into this bucket.
  const upcoming = (auctions ?? []).filter((a) => isFuture(new Date(a.startsAt)) && !isToday(new Date(a.startsAt)));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate">
        <img
          src={heroImg}
          alt="Team owners bidding at a live cricket player auction"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/30" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <p className="text-sm font-semibold tracking-widest text-brand-foreground/80 uppercase">
            Live cricket auction platform
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl leading-tight text-secondary md:text-6xl">
            Online cricket auction app for live player bidding
          </h1>
          <p className="mt-4 max-w-xl text-secondary/80">
            Host a professional player auction for your league — real-time bids, team purses and instant squad
            sheets, with no setup on auction day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/pricing"
              className="rounded-md bg-brand px-6 py-3 font-semibold text-brand-foreground hover:bg-brand-dark"
            >
              Start an auction
            </Link>
            {isAuthenticated ? (
              <Link
                to="/my-auctions/new"
                className="rounded-md bg-secondary px-6 py-3 font-semibold text-secondary-foreground hover:bg-secondary/80 border border-border shadow-sm"
              >
                Create Auction
              </Link>
            ) : (
              <Link
                to="/auth"
                search={{ next: "/my-auctions/new" }}
                className="rounded-md bg-secondary px-6 py-3 font-semibold text-secondary-foreground hover:bg-secondary/80 border border-border shadow-sm"
              >
                Create Auction
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Today's auctions */}
      <section id="today" className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading lead="Today's" highlight="Auctions" subtitle="Auctions going live on the platform right now." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isPending ? (
            Array.from({ length: 3 }).map((_, i) => <AuctionCardSkeleton key={i} />)
          ) : isError ? (
            <div className="col-span-full rounded-lg border border-border bg-card p-6 text-center card-shadow">
              <p className="text-sm text-card-foreground">Failed to load auctions.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
                Try again
              </Button>
            </div>
          ) : today.length > 0 ? (
            today.map((a) => <AuctionCard key={a.id} auction={a} />)
          ) : (
            <p className="col-span-full text-sm text-muted-foreground">No auctions today — check back soon.</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {isAuthenticated ? (
            <Link
              to="/my-auctions/new"
              className="flex-1 rounded-md bg-brand px-6 py-3 text-center font-semibold text-brand-foreground hover:bg-brand-dark sm:flex-none sm:min-w-48"
            >
              Create Auction
            </Link>
          ) : (
            <Link
              to="/auth"
              search={{ next: "/my-auctions/new" }}
              className="flex-1 rounded-md bg-brand px-6 py-3 text-center font-semibold text-brand-foreground hover:bg-brand-dark sm:flex-none sm:min-w-48"
            >
              Create Auction
            </Link>
          )}
          {isAuthenticated ? (
            <Link
              to="/my-auctions"
              className="flex-1 rounded-md bg-emerald-600 px-6 py-3 text-center font-semibold text-white hover:bg-emerald-700 sm:flex-none sm:min-w-48"
            >
              View Auction
            </Link>
          ) : (
            <Link
              to="/auth"
              search={{ next: "/my-auctions" }}
              className="flex-1 rounded-md bg-emerald-600 px-6 py-3 text-center font-semibold text-white hover:bg-emerald-700 sm:flex-none sm:min-w-48"
            >
              View Auction
            </Link>
          )}
        </div>
      </section>

      {/* Upcoming auctions */}
      <section id="upcoming" className="relative isolate">
        <img
          src={stadiumImg}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1920}
          height={800}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/85" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            lead="Upcoming"
            highlight="Auctions"
            tone="light"
            subtitle="Scheduled tournaments taking the stage soon."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {isPending ? (
              Array.from({ length: 2 }).map((_, i) => <AuctionCardSkeleton key={i} />)
            ) : isError ? (
              <div className="col-span-full rounded-lg border border-brand/40 bg-card/10 p-6 text-center card-shadow backdrop-blur-sm">
                <p className="text-sm text-secondary">Failed to load auctions.</p>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3 bg-transparent text-secondary hover:bg-secondary/10 hover:text-secondary border-secondary/40">
                  Try again
                </Button>
              </div>
            ) : upcoming.length > 0 ? (
              upcoming.map((a) => <AuctionCard key={a.id} auction={a} tone="dark" />)
            ) : (
              <p className="col-span-full text-sm text-secondary/70">No upcoming auctions yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading lead="Our" highlight="Features" subtitle="Everything an organizer needs on auction night." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-lg border-l-4 border-brand bg-card p-5 card-shadow">
              <div className="flex items-center gap-3">
                <Icon className="size-5 text-brand" aria-hidden="true" />
                <h3 className="text-lg text-card-foreground">{title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Trust / about */}
      <section className="bg-secondary py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2">
          <div>
            <h2 className="text-3xl text-foreground md:text-4xl">Four years of trusted auction technology</h2>
            <p className="mt-4 text-muted-foreground">
              PitchBid was built for organizers who want auction night to feel fast, fair and professional. From
              gully tournaments to city-wide leagues, thousands of teams have been picked on the platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="flex text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-foreground">4.9 organizer rating</p>
              </div>
              <p className="text-sm text-muted-foreground">Trusted by 138,500+ auction organizers worldwide</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-lg bg-card p-5 card-shadow">
                <blockquote className="text-sm text-card-foreground">"{t.quote}"</blockquote>
                <figcaption className="mt-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{t.name}</span> · {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section id="numbers" className="bg-ink py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading lead="PitchBid" highlight="in Numbers" tone="light" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-brand/50 bg-brand-dark/40 p-6 text-center">
                <p className="display text-4xl text-secondary">{s.value}</p>
                <p className="mt-1 text-sm text-secondary/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading lead="How it" highlight="Works" subtitle="Four steps from an empty sheet to a full squad." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <article key={s.title} className="overflow-hidden rounded-lg bg-card card-shadow">
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                width={800}
                height={600}
                className="h-44 w-full object-cover"
              />
              <div className="p-5">
                <span className="display grid size-8 place-items-center rounded-full bg-brand text-brand-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-lg text-card-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>


      {/* Pricing teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading lead="Our" highlight="Pricing" subtitle="Plans priced by the number of teams in your auction." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { teams: "3 Teams", price: "Free", note: "Up to 5 players per squad" },
            { teams: "6 Teams", price: "₹1,499", note: "Up to 12 players per squad" },
            { teams: "12 Teams", price: "₹3,499", note: "Up to 18 players per squad" },
          ].map((p) => (
            <article key={p.teams} className="overflow-hidden rounded-lg border border-border bg-card card-shadow">
              <div className="p-6 text-center">
                <h3 className="display text-3xl text-card-foreground">{p.teams}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
              </div>
              <p className="ribbon py-3 text-center text-xl font-semibold">{p.price}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/pricing"
            className="inline-flex rounded-md bg-brand px-6 py-3 font-semibold text-brand-foreground hover:bg-brand-dark"
          >
            View all plans
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
