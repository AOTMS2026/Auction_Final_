import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as SiteHeader } from "./SiteHeader-yG2LLCbm.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auctions._id-Cb7smzcX.js
var import_jsx_runtime = require_jsx_runtime();
function AuctionDetailError({ error, reset }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#fffcf7] flex flex-col",
		style: { background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-2xl px-4 py-24 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/80 backdrop-blur-xl p-10 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-black text-[#fffcf7]",
						children: "Failed to load auction"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[#abb4bd]",
						children: "There was an error loading the auction details. Please check your connection and try again."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => reset(),
						className: "mt-6 rounded-full px-8 py-3 font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-lg",
						children: "Try again"
					})
				]
			})
		})]
	});
}
//#endregion
export { AuctionDetailError as errorComponent };
