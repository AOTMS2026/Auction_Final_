import { z } from "zod";
import type { SportType } from "../auction-client";

// Common player fields
export const basePlayerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  age: z.coerce.number().min(1, "Age must be greater than 0").nullable().optional(),
  category: z.string().optional(),
  baseValue: z.coerce.number().min(0, "Base value cannot be negative").default(0),
  jerseySize: z.string().optional(),
  jerseyName: z.string().optional(),
  trouserSize: z.string().optional(),
  customData: z.string().optional(),
  teamId: z.string().nullable().optional(),
  soldPrice: z.coerce.number().min(0).nullable().optional(),
});

// Sport-specific config
export type SportConfig = {
  roles: string[];
  stats: string[];
  specs: string[];
};

export const SPORT_CONFIGS: Record<SportType, SportConfig> = {
  cricket: {
    roles: ["Batsman", "Bowler", "Wicket-Keeper", "All-Rounder"],
    stats: ["Matches", "Runs", "Wickets"],
    specs: ["Specification 1", "Specification 2", "Specification 3"],
  },
  football: {
    roles: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
    stats: ["Matches", "Goals", "Assists"],
    specs: ["Preferred Foot", "Special Trait 1", "Special Trait 2"],
  },
  volleyball: {
    roles: ["Setter", "Libero", "Spiker", "Blocker"],
    stats: ["Matches", "Points", "Blocks"],
    specs: ["Spike Height", "Block Height", "Special Trait"],
  },
  kabaddi: {
    roles: ["Raider", "Defender (Left)", "Defender (Right)", "All-Rounder"],
    stats: ["Matches", "Raid Points", "Tackle Points"],
    specs: ["Signature Move", "Specification 2", "Specification 3"],
  },
  hockey: {
    roles: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
    stats: ["Matches", "Goals", "Assists"],
    specs: ["Specification 1", "Specification 2", "Specification 3"],
  },
};

export type PlayerFormData = z.infer<typeof basePlayerSchema> & {
  sportFields: Record<string, any>;
};
