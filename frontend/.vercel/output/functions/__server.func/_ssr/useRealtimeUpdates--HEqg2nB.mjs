import { o as __toESM } from "../_runtime.mjs";
import { t as apiBase } from "./auth-client-0cXNnUku.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as auctionKeys } from "./auctions-CnIaKf3e.mjs";
import { t as lookup } from "../_libs/socket.io-client+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useRealtimeUpdates--HEqg2nB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useRealtimeUpdates(auctionId) {
	const queryClient = useQueryClient();
	const socketRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!auctionId) return;
		const socket = lookup(apiBase(), { transports: ["websocket", "polling"] });
		socketRef.current = socket;
		socket.on("connect", () => {
			console.log("[socket] Connected to real-time server");
			socket.emit("join-auction", auctionId);
		});
		socket.on("playerUpdated", () => {
			console.log("[socket] Player updated");
			queryClient.invalidateQueries({ queryKey: ["players", auctionId] });
			queryClient.invalidateQueries({ queryKey: auctionKeys.teams(auctionId) });
		});
		socket.on("teamUpdated", () => {
			console.log("[socket] Team updated");
			queryClient.invalidateQueries({ queryKey: auctionKeys.teams(auctionId) });
			queryClient.invalidateQueries({ queryKey: ["players", auctionId] });
		});
		socket.on("auctionUpdated", () => {
			console.log("[socket] Auction updated");
			queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionId) });
		});
		return () => {
			socket.disconnect();
			socketRef.current = null;
		};
	}, [auctionId, queryClient]);
	return { socket: socketRef.current };
}
//#endregion
export { useRealtimeUpdates as t };
