import { r as cn } from "./auth-client-0cXNnUku.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Ct as Bookmark, Dt as ArrowRight, St as CalendarDays } from "../_libs/lucide-react.mjs";
import { o as useAuth } from "./SiteHeader-yG2LLCbm.mjs";
import { t as Skeleton } from "./skeleton-CFtqm2zk.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
import { a as myAuctionsQueryOptions, i as bookmarkedAuctionsQueryOptions, n as auctionKeys } from "./auctions-CnIaKf3e.mjs";
import { t as FallbackImage } from "./fallback-image-CwnNUhIA.mjs";
import { d as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuctionCard-C7BX8VLP.js
var import_jsx_runtime = require_jsx_runtime();
function useMyAuctions() {
	const queryClient = useQueryClient();
	const query = useQuery(myAuctionsQueryOptions());
	const invalidate = async () => {
		await queryClient.invalidateQueries({
			queryKey: auctionKeys.all,
			refetchType: "all"
		});
		await queryClient.refetchQueries({ queryKey: auctionKeys.mine() });
	};
	const createMutation = useMutation({
		mutationFn: (input) => auctionClient.create(input),
		onSuccess: invalidate
	});
	const updateMutation = useMutation({
		mutationFn: ({ id, patch }) => auctionClient.update(id, patch),
		onSuccess: invalidate
	});
	const removeMutation = useMutation({
		mutationFn: (id) => auctionClient.remove(id),
		onSuccess: invalidate
	});
	return {
		items: query.data ?? [],
		isPending: query.isPending,
		isError: query.isError,
		refetch: query.refetch,
		create: (input) => createMutation.mutateAsync(input),
		update: (id, patch) => updateMutation.mutateAsync({
			id,
			patch
		}),
		remove: (id) => removeMutation.mutateAsync(id)
	};
}
function useBookmarks() {
	const { isAuthenticated } = useAuth();
	const queryClient = useQueryClient();
	const query = useQuery({
		...bookmarkedAuctionsQueryOptions(),
		enabled: isAuthenticated
	});
	const invalidate = () => queryClient.invalidateQueries({ queryKey: auctionKeys.all });
	const bookmarkMutation = useMutation({
		mutationFn: (id) => auctionClient.bookmark(id),
		onSuccess: invalidate
	});
	const unbookmarkMutation = useMutation({
		mutationFn: (id) => auctionClient.unbookmark(id),
		onSuccess: invalidate
	});
	const bookmarked = query.data ?? [];
	const bookmarkedIds = new Set(bookmarked.map((a) => a.id));
	return {
		bookmarked,
		isPending: isAuthenticated && query.isPending,
		isError: query.isError,
		refetch: query.refetch,
		isBookmarked: (id) => bookmarkedIds.has(id),
		toggle: (id) => {
			if (bookmarkedIds.has(id)) unbookmarkMutation.mutate(id);
			else bookmarkMutation.mutate(id);
		}
	};
}
function getInitials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "").join("");
}
function AuctionCard({ auction, tone = "light" }) {
	const { isAuthenticated } = useAuth();
	const { isBookmarked, toggle } = useBookmarks();
	const bookmarked = isBookmarked(auction.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/auctions/$id",
			params: { id: auction.id },
			className: cn("group flex items-center gap-4 rounded-2xl border-2 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg", tone === "dark" ? "border-[#38bdf8]/35 bg-[#162b35]/85 hover:border-[#38bdf8] hover:shadow-[0_12px_35px_rgba(56,189,248,0.3)]" : "border-[#38bdf8]/30 bg-[#162b35]/80 hover:border-[#38bdf8] hover:shadow-[0_12px_35px_rgba(56,189,248,0.25)]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-14 shrink-0 rounded-xl overflow-hidden border-2 border-[#38bdf8]/50 shadow-md bg-[#142630]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
						src: auction.coverImage || "",
						alt: "",
						className: "size-full object-cover",
						fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "display flex size-full items-center justify-center bg-gradient-to-br from-[#1e424c] to-[#38bdf8] text-lg font-black text-[#ffffff]",
							children: getInitials(auction.name)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "truncate pr-6 text-base font-black font-auction text-[#ffffff] group-hover:text-[#38bdf8] transition-colors tracking-wide [word-spacing:0.16em] drop-shadow-sm",
						children: auction.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 flex items-center gap-2 text-xs font-semibold text-[#38bdf8] tracking-wide [word-spacing:0.12em]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
							className: "size-3.5 text-[#38bdf8]",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#f2e9dc]/90",
							children: format(new Date(auction.startsAt), "d MMM, h:mm a")
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-9 rounded-full bg-[#142630] border-2 border-[#38bdf8]/40 flex items-center justify-center shrink-0 group-hover:bg-[#38bdf8] group-hover:text-[#142630] text-[#38bdf8] transition-all shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
						className: "size-4 transition-transform group-hover:translate-x-0.5",
						"aria-hidden": "true"
					})
				})
			]
		}), isAuthenticated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => toggle(auction.id),
			"aria-label": bookmarked ? "Remove bookmark" : "Add bookmark",
			"aria-pressed": bookmarked,
			className: "absolute right-4 top-4 text-[#38bdf8]/70 hover:text-[#38bdf8] transition-colors",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {
				className: cn("size-4", bookmarked && "fill-[#38bdf8] text-[#38bdf8]"),
				"aria-hidden": "true"
			})
		})]
	});
}
function AuctionCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-4 rounded-2xl border border-[#5c6875]/25 bg-[#2e343a]/60 backdrop-blur-md p-3.5 shadow-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-14 shrink-0 rounded-xl bg-[#5c6875]/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1 space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-2/3 bg-[#5c6875]/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-1/3 bg-[#5c6875]/20" })]
		})]
	});
}
//#endregion
export { useMyAuctions as i, AuctionCardSkeleton as n, useBookmarks as r, AuctionCard as t };
