import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { AuctionForm } from "@/components/auction/AuctionForm";
import { auctionClient } from "@/lib/auction-client";
import { auctionKeys } from "@/lib/queries/auctions";
import type { AuctionFormValues } from "@/lib/validations/auction";

export const Route = createFileRoute("/_authenticated/my-auctions/new")({
  component: NewAuctionPage,
});

function combineDateAndTime(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours || 0, minutes || 0, 0, 0);
  return combined;
}

function NewAuctionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSubmit(values: AuctionFormValues) {
    try {
      await auctionClient.create({
        sportType: values.sportType,
        name: values.name,
        coverImage: values.coverImage ?? null,
        startsAt: combineDateAndTime(values.date, values.time).toISOString(),
        playersPerTeam: values.playersPerTeam,
        pointsPerTeam: values.pointsPerTeam,
        minimumBid: values.minimumBid,
        maxBid: values.maxBid,
        bidIncrement: values.bidIncrement,
        visibility: values.visibility,
      });
      await queryClient.invalidateQueries({ queryKey: auctionKeys.all });
      toast.success("Auction created.");
      void navigate({ to: "/my-auctions" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create auction.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-3xl text-foreground">Create Auction</h1>
        <p className="mt-2 text-sm text-muted-foreground">Set up a new player auction.</p>
        <div className="mt-8">
          <AuctionForm onSubmit={handleSubmit} submitLabel="Create Auction" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
