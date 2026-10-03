import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as SiteHeader } from "./SiteHeader-yG2LLCbm.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
import { n as AuctionCardSkeleton, r as useBookmarks, t as AuctionCard } from "./AuctionCard-C7BX8VLP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bookmarks-mFIrpacM.js
var import_jsx_runtime = require_jsx_runtime();
function BookmarksPage() {
	const { bookmarked, isPending, isError, refetch } = useBookmarks();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-4xl px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl text-foreground",
					children: "Bookmarks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Auctions you've saved for later."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-4 sm:grid-cols-2",
					children: isPending ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuctionCardSkeleton, {}, i)) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-full rounded-lg border border-border bg-card p-10 text-center card-shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Failed to load bookmarks."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "mt-4",
							onClick: () => refetch(),
							children: "Try again"
						})]
					}) : bookmarked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-full rounded-lg border border-dashed border-border p-10 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "No bookmarks yet."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "mt-3 inline-flex text-sm font-semibold text-brand hover:underline",
							children: "Browse auctions on Home"
						})]
					}) : bookmarked.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuctionCard, { auction: a }, a.id))
				})
			]
		})]
	});
}
//#endregion
export { BookmarksPage as component };
