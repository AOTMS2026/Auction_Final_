import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, Gavel, ShieldCheck, Users, Wallet } from "lucide-react";
import { format } from "date-fns";

import stadiumImg from "@/assets/stadium-band.jpg";
import { BiddingPanel } from "@/components/site/BiddingPanel";
import { Countdown } from "@/components/site/Countdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/fallback-image";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { auctionDetailQueryOptions } from "@/lib/queries/auctions";
import { sportTypeLabels, visibilityLabels } from "@/lib/validations/auction";

export const Route = createFileRoute("/_authenticated/auctions/$id")({
  loader: async ({ params, context }) => {
    try {
      const auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.id));
      return { auction };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Auction unavailable — PitchBid" }, { name: "robots", content: "noindex" }],
      };
    }
    const { auction } = loaderData;
    const title = `${auction.name} Auction | PitchBid`;
    const description = `${auction.name} — a ${sportTypeLabels[auction.sportType]} player auction on PitchBid.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  pendingComponent: AuctionDetailPending,
  errorComponent: AuctionDetailError,
  notFoundComponent: AuctionNotFound,
  component: AuctionDetailPage,
});

function AuctionDetailError({ error, reset }: { error: any; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl text-foreground">Failed to load auction</h1>
        <p className="mt-3 text-muted-foreground">
          There was an error loading the auction details. Please check your connection and try again.
        </p>
        <Button onClick={() => reset()} className="mt-6 px-6 py-3">
          Try again
        </Button>
      </div>
      <SiteFooter />
    </div>
  );
}

function AuctionDetailPending() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero + countdown Skeleton */}
      <section className="relative isolate">
        <img
          src={stadiumImg}
          alt=""
          aria-hidden="true"
          width={1920}
          height={800}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/85" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <nav className="text-xs text-secondary/70">
            <span className="hover:text-secondary">Home</span>
            <span className="px-1.5">/</span>
            <Skeleton className="inline-block h-3 w-32 bg-secondary/20" />
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Skeleton className="size-16 rounded-lg bg-secondary/20" />
            <div>
              <Skeleton className="mb-2 h-3 w-24 bg-secondary/20" />
              <Skeleton className="h-10 w-64 md:h-12 md:w-96 bg-secondary/20" />
            </div>
          </div>

          <div className="mt-8 max-w-xl">
            <p className="mb-3 text-sm font-semibold text-secondary/80">Bidding starts in</p>
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-24 rounded-lg bg-secondary/20" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key facts Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg border-l-4 border-brand bg-card p-5 card-shadow">
              <Skeleton className="mb-2 h-3 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </section>

      {/* Bidding Panel Skeleton */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </section>

      <SiteFooter />
    </div>
  );
}

function AuctionNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl text-foreground">Auction not found</h1>
        <p className="mt-3 text-muted-foreground">
          This auction may have finished, been made private, or the link is incorrect. Browse the live and upcoming
          auctions instead.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-brand px-6 py-3 font-semibold text-brand-foreground hover:bg-brand-dark"
        >
          Back to auctions
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}

function AuctionDetailPage() {
  const { auction } = Route.useLoaderData();

  const facts = [
    { icon: CalendarDays, label: "Starts", value: format(new Date(auction.startsAt), "d MMM yyyy, h:mm a") },
    { icon: Users, label: "Players per team", value: String(auction.playersPerTeam) },
    { icon: Wallet, label: "Points per team", value: auction.pointsPerTeam.toLocaleString() },
    { icon: Gavel, label: "Minimum bid", value: auction.minimumBid.toLocaleString() },
    { icon: Gavel, label: "Bid increased by", value: auction.bidIncrement.toLocaleString() },
    { icon: ShieldCheck, label: "Visibility", value: visibilityLabels[auction.visibility] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero + countdown */}
      <section className="relative isolate">
        <img
          src={stadiumImg}
          alt=""
          aria-hidden="true"
          width={1920}
          height={800}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/85" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <nav className="text-xs text-secondary/70" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-secondary">
              Home
            </Link>
            <span className="px-1.5">/</span>
            <span className="text-secondary/90">{auction.name}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <FallbackImage
              src={auction.coverImage || ""}
              alt=""
              className="size-16 rounded-lg"
              fallback={
                <span className="display grid size-16 place-items-center rounded-lg bg-brand text-2xl text-brand-foreground">
                  {auction.name.slice(0, 2).toUpperCase()}
                </span>
              }
            />
            <div>
              <p className="text-xs font-semibold tracking-widest text-brand-foreground/80 uppercase">
                {sportTypeLabels[auction.sportType]} auction
              </p>
              <h1 className="text-3xl text-secondary md:text-5xl">{auction.name}</h1>
            </div>
          </div>

          <div className="mt-8 max-w-xl">
            <p className="mb-3 text-sm font-semibold text-secondary/80">Bidding starts in</p>
            <Countdown startsAt={auction.startsAt} tone="dark" />
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg border-l-4 border-brand bg-card p-5 card-shadow">
              <p className="flex items-center gap-2 text-xs tracking-wide text-muted-foreground uppercase">
                <Icon className="size-4 text-brand" aria-hidden="true" />
                {label}
              </p>
              <p className="mt-1.5 text-base font-semibold text-card-foreground">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <BiddingPanel auction={auction} />

      <SiteFooter />
    </div>
  );
}
