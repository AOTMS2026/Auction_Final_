import * as z from "zod";

export const SPORT_TYPES = ["cricket", "volleyball", "football", "kabaddi", "baseball"] as const;
export const VISIBILITIES = ["public", "semi-private", "private"] as const;

export const sportTypeLabels: Record<(typeof SPORT_TYPES)[number], string> = {
  cricket: "Cricket",
  volleyball: "Volleyball",
  football: "Football",
  kabaddi: "Kabaddi",
  baseball: "Baseball",
};

export const visibilityLabels: Record<(typeof VISIBILITIES)[number], string> = {
  public: "Public",
  "semi-private": "Semi-Private",
  private: "Private",
};

export const auctionFormSchema = z.object({
  sportType: z.enum(SPORT_TYPES),
  name: z.string().min(1, "Auction name is required").max(120, "Name is too long"),
  coverImage: z.string().nullable().optional(),
  date: z.date({ message: "Auction date is required" }),
  time: z.string().min(1, "Auction time is required"),
  playersPerTeam: z.coerce.number().min(1, "Must be at least 1"),
  pointsPerTeam: z.coerce.number().min(1, "Must be at least 1"),
  minimumBid: z.coerce.number().min(0, "Must be 0 or more"),
  bidIncrement: z.coerce.number().min(1, "Must be at least 1"),
  visibility: z.enum(VISIBILITIES),
});

export type AuctionFormValues = z.infer<typeof auctionFormSchema>;
