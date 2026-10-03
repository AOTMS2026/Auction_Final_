import { a as objectType, n as coerce, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/player-CH8bdjpo.js
objectType({
	name: stringType().min(1, "Name is required"),
	phone: stringType().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
	age: coerce.number().min(1, "Age must be greater than 0").nullable().optional(),
	category: stringType().optional(),
	baseValue: coerce.number().min(0, "Base value cannot be negative").default(0),
	jerseySize: stringType().optional(),
	jerseyName: stringType().optional(),
	trouserSize: stringType().optional(),
	customData: stringType().optional(),
	gender: stringType().optional(),
	city: stringType().optional(),
	playerLevel: stringType().optional(),
	paymentMode: stringType().optional(),
	utrNumber: stringType().optional(),
	paymentImage: stringType().nullable().optional(),
	teamId: stringType().nullable().optional(),
	soldPrice: coerce.number().min(0).nullable().optional()
});
var SPORT_CONFIGS = {
	cricket: {
		roles: [
			"Batsman",
			"Bowler",
			"Wicket-Keeper",
			"All-Rounder"
		],
		stats: [
			"Matches",
			"Runs",
			"Wickets"
		],
		specs: ["Batting Style", "Bowling Style"]
	},
	football: {
		roles: [
			"Goalkeeper",
			"Defender",
			"Midfielder",
			"Forward"
		],
		stats: [
			"Matches",
			"Goals",
			"Assists"
		],
		specs: ["Preferred Foot"]
	},
	volleyball: {
		roles: [
			"Universal",
			"Attacker",
			"Setter",
			"Libero",
			"Spiker",
			"Blocker",
			"Passer",
			"Opposite Hitter",
			"Middle Blocker"
		],
		stats: [
			"Matches",
			"Points",
			"Blocks"
		],
		specs: [
			"Dominated Hand",
			"Spike Height",
			"Block Height"
		]
	},
	kabaddi: {
		roles: [
			"Raider",
			"Defender (Left)",
			"Defender (Right)",
			"All-Rounder"
		],
		stats: [
			"Matches",
			"Raid Points",
			"Tackle Points"
		],
		specs: ["Specialization"]
	},
	badminton: {
		roles: [
			"Singles Player",
			"Doubles Player",
			"Mixed Doubles"
		],
		stats: [
			"Matches",
			"Wins",
			"Win Percentage"
		],
		specs: ["Dominated Hand"]
	}
};
//#endregion
export { SPORT_CONFIGS as t };
