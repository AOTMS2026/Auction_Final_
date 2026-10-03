import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auctions-CnIaKf3e.js
var auctionKeys = {
	all: ["auctions"],
	list: (filters) => [
		...auctionKeys.all,
		"list",
		filters ?? {}
	],
	detail: (id) => [
		...auctionKeys.all,
		"detail",
		id
	],
	mine: () => [...auctionKeys.all, "mine"],
	bookmarked: () => [...auctionKeys.all, "bookmarked"],
	teams: (auctionId) => [
		...auctionKeys.all,
		"teams",
		auctionId
	]
};
function auctionListQueryOptions(filters) {
	return queryOptions({
		queryKey: auctionKeys.list(filters),
		queryFn: () => auctionClient.list(filters)
	});
}
function auctionDetailQueryOptions(id) {
	return queryOptions({
		queryKey: auctionKeys.detail(id),
		queryFn: () => auctionClient.getById(id),
		staleTime: 0
	});
}
function myAuctionsQueryOptions() {
	return queryOptions({
		queryKey: auctionKeys.mine(),
		queryFn: () => auctionClient.listMine(),
		staleTime: 0
	});
}
function bookmarkedAuctionsQueryOptions() {
	return queryOptions({
		queryKey: auctionKeys.bookmarked(),
		queryFn: () => auctionClient.listBookmarked()
	});
}
function teamsQueryOptions(auctionId) {
	return queryOptions({
		queryKey: auctionKeys.teams(auctionId),
		queryFn: () => auctionClient.getTeams(auctionId),
		staleTime: 0,
		gcTime: 3e5
	});
}
//#endregion
export { myAuctionsQueryOptions as a, bookmarkedAuctionsQueryOptions as i, auctionKeys as n, teamsQueryOptions as o, auctionListQueryOptions as r, auctionDetailQueryOptions as t };
