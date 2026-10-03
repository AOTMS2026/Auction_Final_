import { n as authClient } from "./auth-client-0cXNnUku.mjs";
import { A as redirect, N as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as teamsQueryOptions, t as auctionDetailQueryOptions } from "./auctions-CnIaKf3e.mjs";
import { o as playersQueryOptions } from "./select-CBTHEQ7z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-auctions._id.index-CrjZDi3B.js
var $$splitComponentImporter = () => import("./my-auctions._id.index-cMKa6by_.mjs");
var Route = createFileRoute("/_authenticated/my-auctions/$id/")({
	loader: async ({ params, context }) => {
		let auction;
		try {
			auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.id));
		} catch {
			throw notFound();
		}
		const user = await authClient.getCurrentUser();
		const isAdmin = user?.email === "ameen@gmail.com";
		if (!user || auction.createdBy !== user.id && !isAdmin) throw redirect({ to: "/my-auctions" });
		Promise.all([context.queryClient.prefetchQuery(teamsQueryOptions(params.id)), context.queryClient.prefetchQuery(playersQueryOptions(params.id))]);
		return { auction };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
