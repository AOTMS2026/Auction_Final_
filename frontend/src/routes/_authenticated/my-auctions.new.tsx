import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

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
    <div
      className="min-h-screen text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
      }}
    >
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#162235]/80 border border-[#a1b5d8]/40 text-[#a1b5d8] text-xs font-bold uppercase tracking-wider mb-2.5 shadow-[0_0_15px_rgba(161,181,216,0.2)]">
            <Sparkles className="size-3.5" />
            <span>Tournament Setup</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#fffcf7] tracking-tight">Create Auction</h1>
          <p className="mt-2 text-sm text-[#abb4bd]">Set up rules, budgets, and squad limits for your new tournament.</p>
        </div>

        <div className="rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/80 backdrop-blur-xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(23,26,29,0.8)]">
          <AuctionForm onSubmit={handleSubmit} submitLabel="Create Auction" />
        </div>
      </main>
    </div>
  );
}

export default NewAuctionPage;
