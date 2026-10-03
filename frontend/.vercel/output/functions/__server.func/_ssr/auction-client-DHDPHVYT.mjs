import { i as request } from "./auth-client-0cXNnUku.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auction-client-DHDPHVYT.js
function toQueryString(filters) {
	if (!filters) return "";
	const params = new URLSearchParams();
	if (filters.sportType) params.set("sportType", filters.sportType);
	if (filters.visibility) params.set("visibility", filters.visibility);
	if (filters.mine) params.set("mine", "true");
	const qs = params.toString();
	return qs ? `?${qs}` : "";
}
var auctionClient = {
	async list(filters) {
		const { auctions } = await request(`/api/auctions${toQueryString(filters)}`);
		return auctions;
	},
	async listMine() {
		return auctionClient.list({ mine: true });
	},
	async listBookmarked() {
		const { auctions } = await request("/api/auctions/bookmarked");
		return auctions;
	},
	async getById(id) {
		const { auction } = await request(`/api/auctions/${id}`);
		return auction;
	},
	async create(input) {
		const { auction } = await request("/api/auctions", {
			method: "POST",
			body: JSON.stringify(input)
		});
		return auction;
	},
	async update(id, patch) {
		const { auction } = await request(`/api/auctions/${id}`, {
			method: "PATCH",
			body: JSON.stringify(patch)
		});
		return auction;
	},
	async remove(id) {
		await request(`/api/auctions/${id}`, { method: "DELETE" });
	},
	async bookmark(id) {
		await request(`/api/auctions/${id}/bookmark`, { method: "POST" });
	},
	async unbookmark(id) {
		await request(`/api/auctions/${id}/bookmark`, { method: "DELETE" });
	},
	async getTeams(auctionId) {
		const { teams } = await request(`/api/auctions/${auctionId}/teams`);
		return teams;
	},
	async getTeamStats(id) {
		return await request(`/api/teams/${id}`);
	},
	async createTeam(input) {
		const { team } = await request("/api/teams", {
			method: "POST",
			body: JSON.stringify(input)
		});
		return team;
	},
	async registerTeam(input) {
		const { team } = await request("/api/teams/register", {
			method: "POST",
			body: JSON.stringify(input)
		});
		return team;
	},
	async updateTeam(id, patch) {
		const { team } = await request(`/api/teams/${id}`, {
			method: "PATCH",
			body: JSON.stringify(patch)
		});
		return team;
	},
	async deleteTeam(id) {
		await request(`/api/teams/${id}`, { method: "DELETE" });
	},
	async getPlayers(auctionId) {
		const { players } = await request(`/api/auctions/${auctionId}/players`);
		return players;
	},
	async getPlayerById(id) {
		const { player } = await request(`/api/players/${id}`);
		return player;
	},
	async createPlayer(input) {
		const { player } = await request("/api/players", {
			method: "POST",
			body: JSON.stringify(input)
		});
		return player;
	},
	async registerPlayer(input) {
		const { player } = await request("/api/players/register", {
			method: "POST",
			body: JSON.stringify(input)
		});
		return player;
	},
	async updatePlayer(id, patch) {
		const { player } = await request(`/api/players/${id}`, {
			method: "PATCH",
			body: JSON.stringify(patch)
		});
		return player;
	},
	async deletePlayer(id) {
		await request(`/api/players/${id}`, { method: "DELETE" });
	},
	async getPlayerProfile(phone) {
		return await request(`/api/players/profile/${phone}`);
	},
	async repeatUnsoldPlayers(auctionId) {
		return await request(`/api/auctions/${auctionId}/repeat-unsold`, { method: "POST" });
	}
};
//#endregion
export { auctionClient as t };
