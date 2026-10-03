import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as auctionDetailQueryOptions } from "./auctions-CnIaKf3e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-player._auctionId-DaZaLZSH.js
var $$splitComponentImporter = () => import("./register-player._auctionId-COVjv8Ps.mjs");
var Route = createFileRoute("/register-player/$auctionId")({
	loader: async ({ params, context }) => {
		try {
			return { auction: await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.auctionId)) };
		} catch {
			return { auction: null };
		}
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
