import { N as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as SiteHeader } from "./SiteHeader-yG2LLCbm.mjs";
import { t as Skeleton } from "./skeleton-CFtqm2zk.mjs";
import { o as teamsQueryOptions, t as auctionDetailQueryOptions } from "./auctions-CnIaKf3e.mjs";
import { o as playersQueryOptions } from "./select-CBTHEQ7z.mjs";
import { a as objectType, i as enumType, n as coerce, o as stringType, r as dateType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auctions._id-Byu_RkE7.js
var import_jsx_runtime = require_jsx_runtime();
var SPORT_TYPES = [
	"cricket",
	"volleyball",
	"football",
	"kabaddi",
	"badminton"
];
var VISIBILITIES = [
	"public",
	"semi-private",
	"private"
];
var sportTypeLabels = {
	cricket: "Cricket",
	volleyball: "Volleyball",
	football: "Football",
	kabaddi: "Kabaddi",
	badminton: "Badminton"
};
var visibilityLabels = {
	public: "Public",
	"semi-private": "Semi-Private",
	private: "Private"
};
var auctionFormSchema = objectType({
	sportType: enumType(SPORT_TYPES),
	name: stringType().min(1, "Auction name is required").max(120, "Name is too long"),
	coverImage: stringType().nullable().optional(),
	date: dateType({ message: "Auction date is required" }),
	time: stringType().min(1, "Auction time is required"),
	playersPerTeam: coerce.number().min(1, "Must be at least 1"),
	pointsPerTeam: coerce.number().min(1, "Must be at least 1"),
	minimumBid: coerce.number().min(0, "Must be 0 or more"),
	maxBid: coerce.number().min(1, "Must be at least 1"),
	bidIncrement: coerce.number().min(1, "Must be at least 1"),
	visibility: enumType(VISIBILITIES)
});
var $$splitComponentImporter = () => import("./auctions._id-CMK-61Ug.mjs");
var $$splitNotFoundComponentImporter = () => import("./auctions._id-KmJ3dXto.mjs");
var $$splitErrorComponentImporter = () => import("./auctions._id-Cb7smzcX.mjs");
var Route = createFileRoute("/_authenticated/auctions/$id")({
	loader: async ({ params, context }) => {
		try {
			const auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.id));
			Promise.all([context.queryClient.prefetchQuery(teamsQueryOptions(params.id)), context.queryClient.prefetchQuery(playersQueryOptions(params.id))]);
			return { auction };
		} catch {
			throw notFound();
		}
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Auction unavailable — PitchBid" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { auction } = loaderData;
		const title = `${auction.name} Auction | PitchBid`;
		const description = `${auction.name} — a ${sportTypeLabels[auction.sportType]} player auction on PitchBid.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	pendingComponent: AuctionDetailPending,
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function AuctionDetailPending() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#fffcf7] flex flex-col",
		style: { background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative isolate min-h-[280px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[#171a1d]/85 backdrop-blur-md" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mx-auto max-w-4xl px-4 py-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-24 rounded-3xl bg-[#2e343a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-64 rounded-xl bg-[#2e343a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-40 rounded-lg bg-[#2e343a]" })]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-4xl px-4 py-12 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-3xl bg-[#2e343a]/60" }, i))
				})
			})
		]
	});
}
//#endregion
export { sportTypeLabels as a, auctionFormSchema as i, SPORT_TYPES as n, visibilityLabels as o, VISIBILITIES as r, Route as t };
