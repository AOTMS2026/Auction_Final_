import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/usePlayerProfile-DXO1w3Oh.js
var playerProfileQueryOptions = (phone) => ({
	queryKey: ["playerProfile", phone],
	queryFn: () => auctionClient.getPlayerProfile(phone)
});
function usePlayerProfile(phone, enabled = true) {
	return useQuery({
		...playerProfileQueryOptions(phone),
		enabled: enabled && !!phone
	});
}
//#endregion
export { usePlayerProfile as t };
