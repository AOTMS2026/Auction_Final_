import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { isToday, isFuture } from "date-fns";
import {
  BadgeCheck,
  Gauge,
  Globe2,
  ListOrdered,
  PlusCircle,
  Radio,
  Smartphone,
  Sparkles,
  Star,
  Tv,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

import Demo from "@/components/ui/demo";
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
import { Pricing, type PricingPlan } from "@/components/ui/pricing";

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
  { value: "63,800+", label: "Auctions Hosted" },
  { value: "138,500+", label: "Organizers Joined" },
  { value: "105,900+", label: "Cricket Franchises" },
  { value: "541,000+", label: "Players Bidded" },
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

const cricketPricingPlans: PricingPlan[] = [
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
    buttonText: "Start Club Auction",
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
    href: "/pricing",
    isPopular: false,
  },
];

function Index() {
  const { isAuthenticated } = useAuth();
  const { data: auctions, isPending, isError, refetch } = useQuery({
    ...auctionListQueryOptions(),
    refetchInterval: 60_000,
  });
  const today = (auctions ?? []).filter((a) => isToday(new Date(a.startsAt)));
  const upcoming = (auctions ?? []).filter((a) => isFuture(new Date(a.startsAt)) && !isToday(new Date(a.startsAt)));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-[#31572c]/30">
        <Demo />
      </section>

      {/* Today's auctions with smooth Framer Motion reveal */}
      <motion.section
        id="today"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-7xl px-4 py-20"
      >
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#31572c]/10 border border-[#4f772d]/30 text-[#31572c] dark:text-[#90a955] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#4f772d] animate-ping" />
            Live Bidding Arena
          </div>
          <SectionHeading lead="Today's" highlight="Auctions" subtitle="Auctions going live on the platform right now." />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isPending ? (
            Array.from({ length: 3 }).map((_, i) => <AuctionCardSkeleton key={i} />)
          ) : isError ? (
            <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center card-shadow">
              <p className="text-sm text-card-foreground">Failed to load auctions.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4 border-[#4f772d] text-[#31572c]">
                Try again
              </Button>
            </div>
          ) : today.length > 0 ? (
            today.map((a) => <AuctionCard key={a.id} auction={a} />)
          ) : (
            <div className="col-span-full rounded-2xl border border-[#31572c]/20 bg-gradient-to-b from-[#31572c]/5 to-transparent p-12 text-center">
              <Sparkles className="size-8 text-[#4f772d] mx-auto mb-3" />
              <h4 className="text-lg font-bold text-foreground">No auctions live today</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Check out the upcoming tournaments below or be the first to launch today's live auction!
              </p>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={isAuthenticated ? "/my-auctions/new" : "/auth"}
            search={isAuthenticated ? undefined : { next: "/my-auctions/new" }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#31572c] to-[#4f772d] hover:from-[#132a13] hover:to-[#31572c] px-8 py-3.5 text-center font-bold text-white shadow-[0_4px_20px_rgba(49,87,44,0.35)] transition-all hover:scale-105"
          >
            <PlusCircle className="size-4" />
            Create Auction
          </Link>
          <Link
            to={isAuthenticated ? "/my-auctions" : "/auth"}
            search={isAuthenticated ? undefined : { next: "/my-auctions" }}
            className="inline-flex items-center gap-2 rounded-full bg-[#132a13] hover:bg-[#31572c] px-8 py-3.5 text-center font-bold text-[#ecf39e] border border-[#90a955]/40 shadow-sm transition-all hover:scale-105"
          >
            View My Auctions
          </Link>
        </div>
      </motion.section>

      {/* Upcoming auctions with atmospheric evergreen stadium styling */}
      <motion.section
        id="upcoming"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative isolate overflow-hidden border-y border-[#31572c]/40"
      >
        <img
          src={stadiumImg}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1920}
          height={800}
          className="absolute inset-0 size-full object-cover"
        />
        {/* Ambient Dark Evergreen Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(19,42,19,0.92) 0%, rgba(11,25,11,0.94) 50%, rgba(4,8,4,0.97) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            lead="Upcoming"
            highlight="Auctions"
            tone="light"
            subtitle="Scheduled tournaments taking the stage soon."
          />
          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            {isPending ? (
              Array.from({ length: 2 }).map((_, i) => <AuctionCardSkeleton key={i} />)
            ) : isError ? (
              <div className="col-span-full rounded-2xl border border-[#4f772d]/40 bg-[#081108]/60 p-8 text-center card-shadow backdrop-blur-md">
                <p className="text-sm text-[#ecf39e]">Failed to load upcoming auctions.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="mt-4 bg-transparent text-[#ecf39e] hover:bg-[#31572c]/30 hover:text-white border-[#90a955]/40"
                >
                  Try again
                </Button>
              </div>
            ) : upcoming.length > 0 ? (
              upcoming.map((a) => <AuctionCard key={a.id} auction={a} tone="dark" />)
            ) : (
              <div className="col-span-full rounded-2xl border border-[#90a955]/25 bg-[#081108]/50 p-10 text-center backdrop-blur-md">
                <p className="text-sm text-[#d0e6cd]/80">No upcoming auctions scheduled yet — plan yours today!</p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Our Features with Framer Motion staggered entrance */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-7xl px-4 py-20"
      >
        <SectionHeading lead="Our" highlight="Features" subtitle="Everything an organizer needs on auction night." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10">
          {features.map(({ icon: Icon, title, body }, idx) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: idx * 0.04, ease: "easeOut" }}
              className="group relative rounded-2xl border border-[#31572c]/20 bg-card p-6 shadow-sm hover:border-[#4f772d] hover:shadow-[0_10px_35px_rgba(79,119,45,0.15)] transition-all duration-300 border-l-4 border-l-[#4f772d]"
            >
              <div className="flex items-center gap-3.5 mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#31572c]/15 to-[#4f772d]/10 text-[#31572c] dark:text-[#90a955] group-hover:scale-110 group-hover:bg-[#4f772d] group-hover:text-white transition-all duration-300">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground">{title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* Four years of trusted auction technology */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-b from-[#ecf39e]/10 to-transparent dark:from-[#132a13]/25 dark:to-transparent py-20 border-y border-[#31572c]/20"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4f772d]/15 border border-[#4f772d]/30 text-[#31572c] dark:text-[#90a955] text-xs font-bold uppercase tracking-wider mb-4">
              Proven Track Record
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              Four years of trusted auction technology
            </h2>
            <p className="mt-5 text-muted-foreground text-base leading-relaxed">
              PitchBid was engineered specifically for cricket organizers who need auction night to run effortlessly,
              transparently, and with televised-style grandeur. From community gully matches to statewide premier leagues,
              every bid is captured with microsecond precision.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-2.5">
                <div className="flex text-[#4f772d] dark:text-[#90a955]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-5 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-base font-bold text-foreground">4.9 / 5 Rating</p>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Trusted by <span className="font-bold text-foreground">138,500+</span> organizers worldwide
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-[#90a955]/30 bg-card/90 p-5 shadow-sm hover:border-[#4f772d] transition-all"
              >
                <blockquote className="text-sm text-card-foreground italic">"{t.quote}"</blockquote>
                <figcaption className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                  <span className="font-bold text-foreground block text-sm not-italic">{t.name}</span>
                  {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </motion.section>

      {/* PitchBid in Numbers - Hero Section Color Palette & Ambient Arena */}
      <motion.section
        id="numbers"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative py-24 border-y border-[#dda15e]/25 text-[#fefae0] overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 25%, #1f2a13 0%, #18200e 38%, #101509 70%, #080b05 100%)",
        }}
      >
        {/* Sunlit Clay & Cornsilk Ambient Sky Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(221,161,94,0.18)_0%,rgba(254,250,224,0.08)_35%,transparent_70%)] pointer-events-none" />
        {/* Olive Leaf Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,rgba(96,108,56,0.18)_0%,transparent_65%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141f1a]/85 border border-[#dda15e]/40 text-[#fefae0] text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_0_20px_rgba(221,161,94,0.2)]">
              <span className="size-2 rounded-full bg-[#dda15e] animate-pulse" />
              Scale &amp; Reliability
            </div>
            <SectionHeading
              lead="PitchBid"
              highlight="in Numbers"
              tone="light"
              subtitle="Scale and reliability proven across tournaments of every size."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {stats.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: idx * 0.07, ease: "easeOut" }}
                className="rounded-3xl border border-[#dda15e]/25 bg-[#141f1a]/85 backdrop-blur-xl p-8 text-center shadow-[0_12px_35px_rgba(8,11,5,0.7)] hover:border-[#dda15e] hover:shadow-[0_15px_45px_rgba(221,161,94,0.25)] transition-all duration-300 group"
              >
                <p className="display text-4xl sm:text-5xl font-black text-[#fefae0] drop-shadow-[0_0_25px_rgba(221,161,94,0.4)] group-hover:scale-105 transition-transform">
                  {s.value}
                </p>
                <p className="mt-2.5 text-xs font-bold tracking-widest text-[#dda15e] uppercase">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How it Works - Hero Section Color Palette & Ambiance */}
      <motion.section
        id="steps"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden py-24 border-y border-[#dda15e]/25 text-[#fefae0]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, #1f2a13 0%, #18200e 42%, #101509 75%, #080b05 100%)",
        }}
      >
        {/* Sunlit Clay & Cornsilk Ambient Sky Halo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(221,161,94,0.20)_0%,rgba(254,250,224,0.08)_30%,transparent_68%)] pointer-events-none" />

        {/* Olive Leaf Depth Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(96,108,56,0.20)_0%,rgba(40,54,24,0.22)_45%,transparent_70%)] pointer-events-none" />

        {/* Copperwood Warm Earth Bounce at Floor */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,rgba(188,108,37,0.18)_0%,transparent_55%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141f1a]/85 border border-[#dda15e]/40 text-[#fefae0] text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(221,161,94,0.25)]">
              <span className="size-2 rounded-full bg-[#dda15e] animate-pulse" />
              Tournament Blueprint
            </div>
            <SectionHeading
              lead="How it"
              highlight="Works"
              tone="light"
              subtitle="Four seamless steps from an empty sheet to a championship squad."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {steps.map((s, i) => (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                className="overflow-hidden rounded-3xl border border-[#dda15e]/25 bg-[#141f1a]/85 backdrop-blur-xl shadow-[0_12px_35px_rgba(8,11,5,0.75)] hover:border-[#dda15e] hover:shadow-[0_16px_45px_rgba(221,161,94,0.25)] transition-all duration-300 group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141f1a] via-transparent to-black/30 pointer-events-none" />
                  <span className="absolute top-3 left-3 size-9 grid place-items-center rounded-full bg-gradient-to-br from-[#bc6c25] via-[#dda15e] to-[#606c38] text-[#080b05] font-black text-sm shadow-[0_0_15px_rgba(221,161,94,0.55)] border border-[#fefae0]/50">
                    {i + 1}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#fefae0] group-hover:text-[#dda15e] transition-colors">{s.title}</h3>
                  <p className="mt-2 text-sm text-[#fefae0]/75 leading-relaxed">{s.body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Interactive Pricing in Indian Rupees (₹) */}
      <motion.section
        id="pricing"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="border-t border-[#31572c]/20 bg-gradient-to-b from-card/30 to-background"
      >
        <Pricing
          plans={cricketPricingPlans}
          title="Simple, Transparent Pricing"
          description={"Choose the plan that works best for your cricket tournament.\nAll plans include live bidding, purse tracking, and broadcast capabilities."}
          currencySymbol="₹"
        />
      </motion.section>

      <SiteFooter />
    </div>
  );
}

export default Index;
