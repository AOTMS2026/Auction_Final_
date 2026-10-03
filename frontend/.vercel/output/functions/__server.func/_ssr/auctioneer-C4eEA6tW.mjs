import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { M as MicVocal } from "../_libs/lucide-react.mjs";
import { a as SiteHeader } from "./SiteHeader-yG2LLCbm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auctioneer-C4eEA6tW.js
var import_jsx_runtime = require_jsx_runtime();
function AuctioneerPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-4 py-24 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicVocal, {
					className: "mx-auto size-10 text-brand",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-3xl text-foreground",
					children: "Auctioneer console"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted-foreground",
					children: "A live bidding console for running an auction in real time is coming soon."
				})
			]
		})]
	});
}
//#endregion
export { AuctioneerPage as component };
