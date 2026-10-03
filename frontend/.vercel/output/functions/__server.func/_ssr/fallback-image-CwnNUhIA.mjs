import { o as __toESM } from "../_runtime.mjs";
import { r as cn } from "./auth-client-0cXNnUku.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fallback-image-CwnNUhIA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FallbackImage({ src, fallback, className, ...props }) {
	const [error, setError] = (0, import_react.useState)(false);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	if (!src || error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("overflow-hidden", className),
		children: fallback
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden", className),
		children: [!loaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 z-0",
			children: fallback
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			className: cn("relative z-10 size-full transition-opacity duration-200", !className?.includes("object-") && "object-cover", loaded ? "opacity-100" : "opacity-0", className),
			onLoad: () => setLoaded(true),
			onError: () => setError(true),
			...props
		})]
	});
}
//#endregion
export { FallbackImage as t };
