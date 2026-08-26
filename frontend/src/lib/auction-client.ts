import { request } from "@/lib/api-client";

export type SportType = "cricket" | "volleyball" | "football" | "kabaddi" | "badminton";
export type Visibility = "public" | "semi-private" | "private";
export type AuctionStatus = "draft" | "live";

export type Auction = {
  id: string;
  sportType: SportType;
  name: string;
  coverImage: string | null;
  startsAt: string;
  playersPerTeam: number;
  pointsPerTeam: number;
  minimumBid: number;
  bidIncrement: number;
  visibility: Visibility;
  status: AuctionStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Team = {
  id: string;
  auctionId: string;
  name: string;
  shortName: string;
  logo?: string | null;
  ownerName?: string;
  ownerPhone?: string;
  colorTheme?: string;
  createdAt: string;
  updatedAt: string;
};

export type Player = {
  id: string;
  auctionId: string;
  teamId: string | null;
  name: string;
  phone: string;
  age: number | null;
  category: string;
  baseValue: number;
  soldPrice: number | null;
  jerseySize: string;
  jerseyName: string;
  trouserSize: string;
  customData: string;
  photo?: string | null;
  gender?: string;
  city?: string;
  playerLevel?: string;
  paymentMode?: string;
  utrNumber?: string;
  paymentImage?: string | null;
  sportFields: Record<string, any>;
  auctionRoundStatus: "pending" | "sold" | "unsold";
  createdAt: string;
  updatedAt: string;
};

export type PlayerInput = {
  auctionId: string;
  name: string;
  phone: string;
  age?: number | null;
  category?: string;
  baseValue?: number;
  jerseySize?: string;
  jerseyName?: string;
  trouserSize?: string;
  customData?: string;
  photo?: string | null;
  gender?: string;
  city?: string;
  playerLevel?: string;
  paymentMode?: string;
  utrNumber?: string;
  paymentImage?: string | null;
  sportFields?: Record<string, any>;
};

export type TeamInput = {
  auctionId: string;
  name: string;
  shortName: string;
  logo?: string | null;
  ownerName?: string;
  ownerPhone?: string;
  colorTheme?: string;
};

export type AuctionInput = {
  sportType: SportType;
  name: string;
  coverImage?: string | null;
  startsAt: string;
  playersPerTeam: number;
  pointsPerTeam: number;
  minimumBid: number;
  bidIncrement: number;
  visibility: Visibility;
  status?: AuctionStatus;
};

export type AuctionFilters = {
  sportType?: SportType;
  visibility?: Visibility;
  mine?: boolean;
};

function toQueryString(filters?: AuctionFilters) {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.sportType) params.set("sportType", filters.sportType);
  if (filters.visibility) params.set("visibility", filters.visibility);
  if (filters.mine) params.set("mine", "true");
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export type TeamStats = {
  totalPoints: number;
  usedPoints: number;
  availablePoints: number;
  maxBidPoints: number;
  totalPlayers: number;
  reservedPlayers: number;
};

export type PlayerProfileHistory = {
  id: string;
  auctionId: string;
  auctionName: string;
  auctionCover: string | null;
  auctionDate: string;
  playersPerTeam: number;
  pointsPerTeam: number;
  priceTier: string;
  teamId: string | null;
  teamName: string | null;
  teamLogo: string | null;
  soldPrice: number | null;
  baseValue: number;
};

export type PlayerProfile = {
  profile: {
    phone: string;
    name: string;
    photo: string | null;
    category: string;
    role: string;
  };
  stats: {
    joinedAuctions: number;
    joinedTeams: number;
    overallASP: number;
  };
  history: PlayerProfileHistory[];
};

export const auctionClient = {
  async list(filters?: AuctionFilters): Promise<Auction[]> {
    const { auctions } = await request<{ auctions: Auction[] }>(`/api/auctions${toQueryString(filters)}`);
    return auctions;
  },

  async listMine(): Promise<Auction[]> {
    return auctionClient.list({ mine: true });
  },

  async listBookmarked(): Promise<Auction[]> {
    const { auctions } = await request<{ auctions: Auction[] }>("/api/auctions/bookmarked");
    return auctions;
  },

  async getById(id: string): Promise<Auction> {
    const { auction } = await request<{ auction: Auction }>(`/api/auctions/${id}`);
    return auction;
  },

  async create(input: AuctionInput): Promise<Auction> {
    const { auction } = await request<{ auction: Auction }>("/api/auctions", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return auction;
  },

  async update(id: string, patch: Partial<AuctionInput>): Promise<Auction> {
    const { auction } = await request<{ auction: Auction }>(`/api/auctions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return auction;
  },

  async remove(id: string): Promise<void> {
    await request<void>(`/api/auctions/${id}`, { method: "DELETE" });
  },

  async bookmark(id: string): Promise<void> {
    await request<void>(`/api/auctions/${id}/bookmark`, { method: "POST" });
  },

  async unbookmark(id: string): Promise<void> {
    await request<void>(`/api/auctions/${id}/bookmark`, { method: "DELETE" });
  },

  async getTeams(auctionId: string): Promise<Team[]> {
    const { teams } = await request<{ teams: Team[] }>(`/api/auctions/${auctionId}/teams`);
    return teams;
  },

  async getTeamStats(id: string): Promise<{ team: Team, stats: TeamStats }> {
    const res = await request<{ team: Team, stats: TeamStats }>(`/api/teams/${id}`);
    return res;
  },

  async createTeam(input: TeamInput): Promise<Team> {
    const { team } = await request<{ team: Team }>("/api/teams", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return team;
  },

  async registerTeam(input: TeamInput): Promise<Team> {
    const { team } = await request<{ team: Team }>("/api/teams/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return team;
  },

  async updateTeam(id: string, patch: Partial<TeamInput>): Promise<Team> {
    const { team } = await request<{ team: Team }>(`/api/teams/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return team;
  },

  async deleteTeam(id: string): Promise<void> {
    await request<void>(`/api/teams/${id}`, { method: "DELETE" });
  },

  async getPlayers(auctionId: string): Promise<Player[]> {
    const { players } = await request<{ players: Player[] }>(`/api/auctions/${auctionId}/players`);
    return players;
  },

  async createPlayer(input: PlayerInput): Promise<Player> {
    const { player } = await request<{ player: Player }>("/api/players", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return player;
  },

  async registerPlayer(input: PlayerInput): Promise<Player> {
    const { player } = await request<{ player: Player }>("/api/players/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return player;
  },

  async updatePlayer(
    id: string,
    patch: Partial<PlayerInput> & {
      teamId?: string | null;
      soldPrice?: number | null;
      auctionRoundStatus?: "pending" | "sold" | "unsold";
    },
  ): Promise<Player> {
    const { player } = await request<{ player: Player }>(`/api/players/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return player;
  },

  async deletePlayer(id: string): Promise<void> {
    await request<void>(`/api/players/${id}`, { method: "DELETE" });
  },

  async getPlayerProfile(phone: string): Promise<PlayerProfile> {
    const data = await request<PlayerProfile>(`/api/players/profile/${phone}`);
    return data;
  },
};
