import { createFileRoute } from "@tanstack/react-router";
import { Mic2 } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/_authenticated/auctioneer")({
  component: AuctioneerPage,
});

function AuctioneerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <Mic2 className="mx-auto size-10 text-brand" aria-hidden="true" />
        <h1 className="mt-4 text-3xl text-foreground">Auctioneer console</h1>
        <p className="mt-3 text-muted-foreground">
          A live bidding console for running an auction in real time is coming soon.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
