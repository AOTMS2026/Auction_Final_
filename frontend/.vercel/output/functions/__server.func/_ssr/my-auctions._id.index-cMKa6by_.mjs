import { o as __toESM } from "../_runtime.mjs";
import { r as cn } from "./auth-client-0cXNnUku.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Pencil, Q as FileSpreadsheet, St as CalendarDays, X as FlaskConical, Z as FileText, _t as ChevronRight, d as TriangleAlert, f as Trash, i as Users, n as X, ot as Copy, q as Globe, rt as EllipsisVertical, s as UserCheck, w as RotateCcw, x as Share2, y as Shield } from "../_libs/lucide-react.mjs";
import { a as SiteHeader, i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./SiteHeader-yG2LLCbm.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as stadium_band_default } from "./alert-dialog-VY8twHzw.mjs";
import { t as Skeleton } from "./skeleton-CFtqm2zk.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
import { n as auctionKeys, t as auctionDetailQueryOptions } from "./auctions-CnIaKf3e.mjs";
import { t as FallbackImage } from "./fallback-image-CwnNUhIA.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
import { s as usePlayers } from "./select-CBTHEQ7z.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C2cO245r.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as format } from "../_libs/date-fns.mjs";
import { a as useTeams, i as formatPoints, n as computeTeamStats, r as exportAuctionPDF, t as ChangePlayerTeamModal } from "./pdf-export-d54OVmg_.mjs";
import { a as TeamFormModal, i as PlayerPreviewCard, n as Countdown, r as PlayerFormModal, t as AboutTab } from "./PlayerFormModal-VTjOHpCn.mjs";
import { n as writeFileSync, t as utils } from "../_libs/xlsx.mjs";
import { t as Route } from "./my-auctions._id.index-CrjZDi3B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-auctions._id.index-cMKa6by_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChooseAuctionModeDialog({ open, onOpenChange, onConfirm }) {
	const [mode, setMode] = (0, import_react.useState)("trial");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-[0_20px_60px_rgba(10,25,32,0.95)] p-6 sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-2xl font-black text-[#ffffff] tracking-tight",
						children: "Start Auction Mode"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs sm:text-sm text-[#f2e9dc]/80 font-medium",
						children: "Select how you want to run this auction."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMode("trial"),
						className: cn("flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all cursor-pointer", mode === "trial" ? "border-[#38bdf8] bg-[#1a3847] text-[#ffffff] shadow-[0_0_25px_rgba(56,189,248,0.4)] ring-2 ring-[#38bdf8]/50 scale-[1.03]" : "border-[#38bdf8]/30 bg-[#162a34]/60 text-[#f2e9dc]/70 hover:border-[#38bdf8]/70 hover:bg-[#1a3847]/70 hover:text-[#ffffff]"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: cn("size-9 transition-colors", mode === "trial" ? "text-[#38bdf8] drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]" : "text-[#808f85]") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-black text-sm text-[#ffffff]",
								children: "Trial / Test Mode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#f2e9dc]/80 font-semibold",
								children: "Safe practice round."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMode("live"),
						className: cn("flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all cursor-pointer", mode === "live" ? "border-emerald-400 bg-emerald-950/80 text-[#ffffff] shadow-[0_0_25px_rgba(16,185,129,0.45)] ring-2 ring-emerald-400/50 scale-[1.03]" : "border-[#38bdf8]/30 bg-[#162a34]/60 text-[#f2e9dc]/70 hover:border-emerald-500/70 hover:bg-emerald-950/60 hover:text-[#ffffff]"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: cn("size-9 transition-colors", mode === "live" ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.7)]" : "text-[#808f85]") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-black text-sm text-[#ffffff]",
								children: "Live Mode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#f2e9dc]/80 font-semibold",
								children: "Official auction round."
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2.5 rounded-2xl border border-amber-500/40 bg-amber-500/15 p-3 text-xs text-amber-200 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Once Live Mode is activated, you cannot switch back to Trial Mode for recorded bids." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "flex-1 rounded-full py-3 h-auto border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#203f4f] hover:border-[#38bdf8] transition-all font-bold shadow-sm",
						onClick: () => onOpenChange(false),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-1 size-4" }), " Cancel"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "flex-1 rounded-full py-3 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30",
						onClick: () => onConfirm(mode),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "mr-1 size-4" }), " Confirm"]
					})]
				})
			]
		})
	});
}
var TABS = [
	"TEAMS",
	"PLAYERS",
	"MVP",
	"SPONSORS",
	"LINK",
	"ABOUT"
];
function ManageAuctionPage() {
	const { auction: initialAuction } = Route.useLoaderData();
	const { data: auction = initialAuction } = useQuery(auctionDetailQueryOptions(initialAuction.id));
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = (0, import_react.useState)("TEAMS");
	const [readinessModalOpen, setReadinessModalOpen] = (0, import_react.useState)(false);
	const [modeDialogOpen, setModeDialogOpen] = (0, import_react.useState)(false);
	const [paymentModalOpen, setPaymentModalOpen] = (0, import_react.useState)(false);
	const formatNum = formatPoints;
	const { teams, isPending: teamsPending, isError: teamsError, deleteTeam } = useTeams(auction.id);
	const [teamToDelete, setTeamToDelete] = (0, import_react.useState)(null);
	const [editTeamId, setEditTeamId] = (0, import_react.useState)(null);
	const { players, isPending: playersPending, deletePlayer, updatePlayer } = usePlayers(auction.id);
	const [playerToDelete, setPlayerToDelete] = (0, import_react.useState)(null);
	const [editPlayerId, setEditPlayerId] = (0, import_react.useState)(null);
	const [previewPlayerId, setPreviewPlayerId] = (0, import_react.useState)(null);
	const [changeTeamPlayer, setChangeTeamPlayer] = (0, import_react.useState)(null);
	const [playerStatusFilter, setPlayerStatusFilter] = (0, import_react.useState)("all");
	const unsoldPlayersCount = players.filter((p) => p.auctionRoundStatus === "unsold").length;
	const soldPlayersCount = players.filter((p) => !!p.teamId || p.auctionRoundStatus === "sold").length;
	const pendingPlayersCount = players.filter((p) => !p.teamId && p.auctionRoundStatus !== "unsold").length;
	const filteredPlayersList = (0, import_react.useMemo)(() => {
		if (playerStatusFilter === "unsold") return players.filter((p) => p.auctionRoundStatus === "unsold");
		if (playerStatusFilter === "sold") return players.filter((p) => !!p.teamId || p.auctionRoundStatus === "sold");
		if (playerStatusFilter === "pending") return players.filter((p) => !p.teamId && p.auctionRoundStatus !== "unsold");
		return players;
	}, [players, playerStatusFilter]);
	function copyCode() {
		navigator.clipboard.writeText(auction.id);
		toast.success("Auction code copied!");
	}
	function handleSharePlayerForm() {
		const url = `${window.location.origin}/register-player/${auction.id}`;
		navigator.clipboard.writeText(url);
		toast.success("Player registration link copied to clipboard!");
	}
	function handleShareTeamForm() {
		const url = `${window.location.origin}/register-team/${auction.id}`;
		navigator.clipboard.writeText(url);
		toast.success("Team registration link copied to clipboard!");
	}
	function handleStartAuction() {
		if (teams.length === 0 || players.length === 0) {
			setReadinessModalOpen(true);
			return;
		}
		setModeDialogOpen(true);
	}
	async function handleConfirmMode(mode) {
		setModeDialogOpen(false);
		if (mode === "live") {
			try {
				await auctionClient.update(auction.id, { status: "live" });
				await queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auction.id) });
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "Failed to start live auction.");
				return;
			}
			navigate({
				to: "/my-auctions/$id/auctioneer",
				params: { id: auction.id },
				search: { mode: "live" }
			});
		} else navigate({
			to: "/my-auctions/$id/auctioneer",
			params: { id: auction.id },
			search: { mode: "trial" }
		});
	}
	function handleExportPDF() {
		exportAuctionPDF(auction, players || [], teams || []);
		toast.success("Auction PDF Report downloaded!");
	}
	function handleDownloadTeamsExcel() {
		if (!teams || teams.length === 0) {
			toast.error("No teams found to export.");
			return;
		}
		const teamsDetailsRows = teams.map((t, index) => ({
			"S.No": index + 1,
			"Team Name": t.name,
			"Team Code": t.shortName,
			"Owner Name": t.ownerName || "",
			"Owner Phone": t.ownerPhone || "",
			"Color Theme": t.colorTheme || ""
		}));
		const teamsSheet = utils.json_to_sheet(teamsDetailsRows);
		teamsSheet["!cols"] = Object.keys(teamsDetailsRows[0] || {}).map((key) => {
			let maxLen = key.length;
			teamsDetailsRows.forEach((row) => {
				const val = row[key];
				if (val !== void 0 && val !== null) {
					const len = String(val).length;
					if (len > maxLen) maxLen = len;
				}
			});
			return { wch: Math.min(Math.max(maxLen + 4, 12), 40) };
		});
		const workbook = utils.book_new();
		utils.book_append_sheet(workbook, teamsSheet, "Teams");
		const cleanTitle = (auction.name || "Tournament").replace(/[^a-zA-Z0-9_-]/g, "_");
		writeFileSync(workbook, `${cleanTitle}_Teams.xlsx`);
		toast.success("Teams Excel sheet downloaded successfully!");
	}
	function handleDownloadPlayersExcel() {
		if (!players || players.length === 0) {
			toast.error("No registered players found to export.");
			return;
		}
		const isBniAuction = auction.id === "6a8edaddd7ed74151dbafab3" || auction.name?.toLowerCase().includes("bni") || auction.name?.toLowerCase().includes("bbl");
		const isHunterzVolleyball = auction.id === "6a8a705aef1f9e0978b3031c" || auction.name?.toLowerCase().includes("hunterz");
		const teamMap = new Map((teams || []).map((t) => [t.id, t.name]));
		const hasAge = players.some((p) => p.age != null && String(p.age).trim() !== "");
		const hasRole = players.some((p) => p.sportFields?.["role"] && String(p.sportFields["role"]).trim() !== "" && p.sportFields["role"] !== "-" || p.sportFields?.["Position"] && String(p.sportFields["Position"]).trim() !== "" && p.sportFields["Position"] !== "-");
		const hasDominatedHand = !isBniAuction && players.some((p) => p.sportFields?.["Dominated Hand"] && String(p.sportFields["Dominated Hand"]).trim() !== "" && p.sportFields["Dominated Hand"] !== "-" || p.customData?.startsWith("Dominated Hand:") || p.customData && !p.customData.includes("BNI") && !p.customData.includes("Family"));
		players.some((p) => p.category && p.category.trim() !== "");
		const hasGender = auction.id === "6a8edaddd7ed74151dbafab3" || players.some((p) => Boolean(p.gender && p.gender.trim() !== ""));
		const hasCity = !isHunterzVolleyball && players.some((p) => p.city && p.city.trim() !== "");
		const hasPlayerLevel = !isHunterzVolleyball && players.some((p) => p.playerLevel && p.playerLevel.trim() !== "");
		const hasJerseySize = !isHunterzVolleyball && players.some((p) => p.jerseySize && p.jerseySize.trim() !== "");
		const hasJerseyName = !isHunterzVolleyball && (isBniAuction || players.some((p) => p.jerseyName && p.jerseyName.trim() !== ""));
		const hasTrouserSize = !isHunterzVolleyball && players.some((p) => p.trouserSize && p.trouserSize.trim() !== "");
		const hasPaymentMode = !isBniAuction && !isHunterzVolleyball && players.some((p) => p.paymentMode && p.paymentMode.trim() !== "");
		const hasUtr = !isBniAuction && !isHunterzVolleyball && players.some((p) => p.utrNumber && p.utrNumber.trim() !== "");
		const hasBniMembership = isBniAuction || players.some((p) => p.customData?.includes("BNI") || p.customData?.includes("Family"));
		const hasChapter = isBniAuction || players.some((p) => p.customData?.includes("Chapter:"));
		const hasBniName = players.some((p) => p.customData?.includes("BNI Name:"));
		const hasRel = players.some((p) => p.customData?.includes("Rel:"));
		const hasBblSeasons = isBniAuction || players.some((p) => p.customData?.includes("BBL Seasons:"));
		const hasOtherCustom = !isBniAuction && !isHunterzVolleyball && players.some((p) => p.customData && !p.customData.startsWith("Dominated Hand:") && !p.customData.includes("BNI") && !p.customData.includes("Family"));
		const activeSportKeys = [];
		players.forEach((p) => {
			if (p.sportFields && typeof p.sportFields === "object") Object.keys(p.sportFields).forEach((k) => {
				if (k !== "originalPhoto" && k !== "role" && k !== "Position" && k !== "Dominated Hand" && p.sportFields[k] !== void 0 && p.sportFields[k] !== null && String(p.sportFields[k]).trim() !== "" && String(p.sportFields[k]) !== "-" && !activeSportKeys.includes(k)) activeSportKeys.push(k);
			});
		});
		const hasAnySold = players.some((p) => p.teamId || p.soldPrice != null);
		const hasTeams = teams && teams.length > 0;
		const excelRows = players.map((p, index) => {
			const row = {
				"S.No": index + 1,
				"Player Name": p.name || "",
				"Phone Number": p.phone || ""
			};
			if (hasAge) row["Age"] = p.age ?? "-";
			if (hasRole) row["Playing Position / Role"] = p.sportFields?.["role"] || p.sportFields?.["Position"] || "-";
			if (hasDominatedHand) row["Dominated Hand"] = p.sportFields?.["Dominated Hand"] || (p.customData?.startsWith("Dominated Hand: ") ? p.customData.replace("Dominated Hand: ", "") : !p.customData?.includes("BNI") && !p.customData?.includes("Family") ? p.customData || "-" : "-");
			if (hasGender) {
				const g = (p.gender || "").trim().toLowerCase();
				row["Gender"] = g === "m" || g === "male" ? "Male" : g === "f" || g === "female" || g === "w" || g === "woman" || g === "women" ? "Female" : p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : "-";
			}
			if (hasCity) row["City"] = p.city || "-";
			if (hasPlayerLevel) row["Player Level"] = p.playerLevel || "-";
			activeSportKeys.forEach((key) => {
				row[key] = p.sportFields?.[key] ?? "-";
			});
			row["Grade / Category"] = p.category || "-";
			if (hasJerseySize) row["Jersey Size"] = p.jerseySize || "-";
			if (hasJerseyName) row["Jersey Name"] = p.jerseyName || "-";
			if (hasTrouserSize) if (isBniAuction) row["Jersey Number"] = p.trouserSize || "-";
			else row["Trouser Size"] = p.trouserSize || "-";
			if (hasBniMembership) {
				let memType = "-";
				if (p.customData?.includes("BNI Member")) memType = "BNI Member";
				else if (p.customData?.includes("Family Member")) memType = "Family Member";
				row["Membership Type"] = memType;
			}
			if (hasChapter) {
				const match = p.customData?.match(/Chapter:\s*([^,|]+)/i);
				row["Chapter Name"] = match?.[1] ? match[1].trim() : "-";
			}
			if (hasBniName) {
				const match = p.customData?.match(/BNI Name:\s*([^,|]+)/i);
				row["BNI Member Name"] = match?.[1] ? match[1].trim() : "-";
			}
			if (hasRel) {
				const match = p.customData?.match(/Rel:\s*([^,|]+)/i);
				row["Relationship"] = match?.[1] ? match[1].trim() : "-";
			}
			if (hasBblSeasons) {
				const match = p.customData?.match(/BBL Seasons:\s*([^,|]+)/i);
				row["Seasons Played"] = match?.[1] ? match[1].trim() : "-";
			}
			if (hasOtherCustom) row["Custom Details"] = p.customData || "-";
			if (hasPaymentMode) row["Payment Mode"] = p.paymentMode || "-";
			if (hasUtr) row["UTR / Ref Number"] = p.utrNumber || "-";
			row["Base Value (Points)"] = p.baseValue ?? 0;
			if (hasTeams || hasAnySold) {
				const soldTeamName = p.teamId ? teamMap.get(p.teamId) || "Sold" : p.auctionRoundStatus === "unsold" ? "Unsold" : "Pending";
				row["Auction Status"] = p.teamId ? "Sold" : p.auctionRoundStatus === "unsold" ? "Unsold" : "Pending";
				row["Sold To Team"] = p.teamId ? soldTeamName : "-";
				row["Sold Price (Points)"] = p.soldPrice !== null && p.soldPrice !== void 0 ? p.soldPrice : p.teamId ? p.baseValue ?? 0 : "-";
			}
			if (p.createdAt) row["Registration Date"] = new Date(p.createdAt).toLocaleDateString("en-IN");
			return row;
		});
		const worksheet = utils.json_to_sheet(excelRows);
		worksheet["!cols"] = Object.keys(excelRows[0] || {}).map((key) => {
			let maxLen = key.length;
			excelRows.forEach((row) => {
				const val = row[key];
				if (val !== void 0 && val !== null) {
					const len = String(val).length;
					if (len > maxLen) maxLen = len;
				}
			});
			return { wch: Math.min(Math.max(maxLen + 3, 10), 40) };
		});
		const workbook = utils.book_new();
		utils.book_append_sheet(workbook, worksheet, "Registered Players");
		const filename = `${(auction.name || "Tournament").replace(/[^a-zA-Z0-9_-]/g, "_")}_Registered_Players.xlsx`;
		writeFileSync(workbook, filename);
		toast.success("Registered players exported to Excel successfully!");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#f2e9dc] selection:bg-[#38bdf8] selection:text-[#ffffff]",
		style: { background: "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative isolate overflow-hidden pt-12 border-b border-[#38bdf8]/35",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: stadium_band_default,
						alt: "",
						"aria-hidden": "true",
						className: "absolute inset-0 size-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[#142630] via-[#142630]/90 to-[#1e3a45]/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-4xl px-4 pt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4 sm:gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
								src: auction.coverImage || "",
								alt: "",
								className: "size-20 rounded-2xl border-2 border-[#38bdf8]/60 sm:size-28 object-cover shadow-xl",
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "display grid size-full place-items-center rounded-2xl bg-gradient-to-br from-[#1e424c] to-[#38bdf8] text-2xl font-black text-[#ffffff] shadow-lg",
									children: auction.name.slice(0, 2).toUpperCase()
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 text-[#ffffff]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#162a32]/95 border-2 border-[#38bdf8]/60 text-[#ffffff] text-[11px] font-black uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(56,189,248,0.4)] font-auction [word-spacing:0.14em]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-[#f97316] animate-pulse" }), "Live Tournament"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-2xl font-black sm:text-4xl lg:text-5xl font-auction tracking-wider [word-spacing:0.18em] text-[#ffffff] drop-shadow-md uppercase",
										children: auction.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 space-y-1.5 text-sm sm:text-base text-[#f2e9dc]/90",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "flex items-center gap-2 font-medium",
												children: [
													"Auction Code: ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[#38bdf8] font-black bg-[#162a32] px-2.5 py-0.5 rounded-md border border-[#38bdf8]/50 shadow-sm",
														children: auction.id.slice(-6)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: copyCode,
														className: "hover:text-[#38bdf8] text-[#f2e9dc] transition-colors",
														"aria-label": "Copy code",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "flex items-center gap-2 text-[#f2e9dc]/90 font-medium",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-[#38bdf8]" }), format(new Date(auction.startsAt), "dd-MM-yyyy, h:mm a")]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[#f2e9dc]/90 font-medium",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-[#38bdf8]" }),
															" ",
															auction.playersPerTeam,
															" Player Per Team"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4 text-emerald-400" }),
															" ",
															players ? players.length : 0,
															" Registered"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { targetDate: auction.startsAt })
												]
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center justify-between gap-3 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 font-black text-emerald-300",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm px-3.5 py-1 rounded-full bg-[#162a32] border-2 border-emerald-500/50 shadow-sm",
									children: "✨ Free Tier"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleExportPDF,
									variant: "outline",
									className: "rounded-full border-2 border-[#38bdf8]/60 bg-[#162a34] text-[#ffffff] hover:bg-[#38bdf8] hover:text-[#ffffff] font-extrabold text-xs gap-1.5 transition-all shadow-sm",
									title: "Download Teams & Purchased Players PDF Report",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-[#38bdf8]" }), "Auction Results PDF"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: handleStartAuction,
									className: "rounded-full px-7 py-2.5 h-auto font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:shadow-[0_0_35px_rgba(249,115,22,0.9)] hover:scale-105 transition-all border border-white/40",
									children: "Start Auction"
								})]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-[#142630]/95 text-[#ffffff] border-b border-[#38bdf8]/35 sticky top-[57px] z-30 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex max-w-4xl overflow-x-auto px-4 hide-scrollbar",
					children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveTab(tab),
						className: `whitespace-nowrap px-5 py-4 text-xs font-black tracking-wider uppercase transition-all ${activeTab === tab ? "border-b-2 border-[#38bdf8] text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" : "text-[#f2e9dc]/70 hover:text-[#ffffff]"}`,
						children: tab === "TEAMS" && teams ? `TEAMS (${teams.length})` : tab === "PLAYERS" && players ? `PLAYERS (${players.length})` : tab
					}, tab))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-4 py-12 pb-32",
				children: [
					activeTab === "TEAMS" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleDownloadTeamsExcel,
									variant: "outline",
									className: "gap-2 rounded-full border-2 border-emerald-500/60 bg-emerald-950/70 text-emerald-300 hover:bg-emerald-600 hover:text-white font-extrabold text-xs transition-all shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4 text-emerald-400" }), " Export teams Excel"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleShareTeamForm,
									variant: "outline",
									className: "gap-2 rounded-full border-2 border-[#38bdf8]/50 bg-[#162a34] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#ffffff] font-extrabold text-xs transition-all shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), " Share Registration Link"]
								})]
							}),
							teamsPending ? Array.from({ length: 2 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-2xl bg-[#2e343a]/50 border border-[#5c6875]/20" }, i)) : teamsError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3xl border border-[#5c6875]/40 bg-[#2e343a]/70 p-10 text-center shadow-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#abb4bd]",
									children: "Failed to load teams."
								})
							}) : teams.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-16 text-center rounded-3xl border-2 border-dashed border-[#5c6875]/40 bg-[#2e343a]/30 p-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#abb4bd] font-medium",
									children: "There are no teams listed yet."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#a1b5d8] mt-1.5",
									children: "Click the + (plus) button below to add your first team."
								})]
							}) : teams.map((team) => {
								const { usedPoints, totalPoints, totalPlayers, reservedPlayers, maxBidPoints } = computeTeamStats(team, players, auction);
								const formatNum = formatPoints;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 sm:p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)] hover:border-[#a1b5d8]/60 hover:shadow-[0_12px_35px_rgba(161,181,216,0.2)] transition-all duration-300 flex flex-col group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/my-auctions/$id/teams/$teamId",
											params: {
												id: auction.id,
												teamId: team.id
											},
											className: "shrink-0 size-20 sm:size-24 rounded-2xl bg-[#162235] border border-[#a1b5d8]/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#a1b5d8]/60 transition-colors",
											children: team.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: team.logo,
												alt: team.name,
												className: "size-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl sm:text-3xl font-black text-[#a1b5d8]",
												children: team.shortName.slice(0, 3)
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0 flex flex-col justify-between py-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between items-start",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/my-auctions/$id/teams/$teamId",
														params: {
															id: auction.id,
															teamId: team.id
														},
														className: "hover:underline",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "font-extrabold text-lg sm:text-xl text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors truncate max-w-[150px] sm:max-w-xs",
															children: team.name
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-[#a1b5d8] mt-0.5 font-bold uppercase tracking-wider",
														children: team.shortName
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-right pl-2 shrink-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xl font-black text-[#a1b5d8] leading-none mb-1",
															children: formatNum(totalPoints)
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold whitespace-nowrap",
															children: "Total Points"
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3 sm:gap-4 mt-3 overflow-x-auto hide-scrollbar",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap",
															children: "Total Pl"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "font-extrabold text-sm sm:text-base text-[#fffcf7]",
															children: [
																totalPlayers.toString().padStart(2, "0"),
																" / ",
																auction.playersPerTeam.toString().padStart(2, "0")
															]
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px h-6 bg-[#5c6875]/40 shrink-0" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap",
															children: "Res. Pl"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-extrabold text-sm sm:text-base text-[#e3e6e9]",
															children: reservedPlayers.toString().padStart(2, "0")
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px h-6 bg-[#5c6875]/40 shrink-0" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap",
															children: "Used Pts"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-extrabold text-sm sm:text-base text-[#c2d8b9]",
															children: formatNum(usedPoints)
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px h-6 bg-[#5c6875]/40 shrink-0" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold mb-0.5 whitespace-nowrap",
															children: "Max Bid"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-extrabold text-sm sm:text-base text-[#e4f0d0]",
															children: formatNum(maxBidPoints > 0 ? maxBidPoints : 0)
														})] })
													]
												}),
												(() => {
													const teamBoughtPlayers = (players || []).filter((p) => p.teamId === team.id);
													if (teamBoughtPlayers.length === 0) return null;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-3.5 pt-3 border-t border-[#5c6875]/30",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between mb-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-[11px] font-bold uppercase tracking-wider text-[#abb4bd] flex items-center gap-1.5",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400" }),
																	"Bought Players (",
																	teamBoughtPlayers.length,
																	")"
																]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
																to: "/my-auctions/$id/teams/$teamId",
																params: {
																	id: auction.id,
																	teamId: team.id
																},
																className: "text-[11px] font-bold text-[#a1b5d8] hover:text-[#fffcf7] hover:underline transition-colors",
																children: "View Full Roster →"
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "flex flex-wrap gap-1.5",
															children: teamBoughtPlayers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#162235]/90 border border-[#a1b5d8]/30 text-xs font-semibold text-[#fffcf7]",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "text-[10px] font-extrabold text-[#c2d8b9]",
																	children: [
																		"(",
																		p.soldPrice ? formatNum(p.soldPrice) : "Base",
																		" pts)"
																	]
																})]
															}, p.id))
														})]
													});
												})()
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute bottom-3 right-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "size-8 rounded-full bg-[#171a1d]/60 text-[#abb4bd] hover:bg-[#a1b5d8]/20 hover:text-[#a1b5d8]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											className: "rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onSelect: () => setEditTeamId(team.id),
												className: "hover:bg-[#2e343a]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 size-4 text-[#a1b5d8]" }), " Edit team"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												className: "text-destructive hover:bg-destructive/15",
												onSelect: () => setTeamToDelete(team.id),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { className: "mr-2 size-4" }), " Delete team"]
											})]
										})] })
									})]
								}, team.id);
							}),
							editTeamId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamFormModal, {
								auctionId: auction.id,
								team: teams.find((t) => t.id === editTeamId),
								open: !!editTeamId,
								onOpenChange: (open) => !open && setEditTeamId(null)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamFormModal, { auctionId: auction.id })
						]
					}),
					activeTab === "PLAYERS" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [
							pendingPlayersCount === 0 && unsoldPlayersCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border-2 border-amber-500/60 bg-amber-950/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_4px_25px_rgba(245,158,11,0.25)] animate-fade-in",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-10 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400 shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-black text-white",
											children: "No More Players Available"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40",
											children: "Round 1 Done"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-[#a1b5d8] mt-0.5",
										children: [
											"All regular players have been auctioned. You have ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-amber-400 font-bold",
												children: [
													unsoldPlayersCount,
													" unsold player",
													unsoldPlayersCount > 1 ? "s" : ""
												]
											}),
											" ready to repeat again for the next round."
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: async () => {
										if (window.confirm(`Repeat all ${unsoldPlayersCount} unsold players and make them available again?`)) try {
											await auctionClient.repeatUnsoldPlayers(auction.id);
											await queryClient.invalidateQueries({ queryKey: ["players", auction.id] });
											toast.success(`Repeated all ${unsoldPlayersCount} unsold players!`);
										} catch (err) {
											toast.error(err?.message || "Failed to repeat unsold players.");
										}
									},
									className: "rounded-xl px-4 py-2 h-auto font-black text-xs text-white bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.6)] shrink-0 border border-white/30 cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5 mr-1.5" }),
										"Repeat All Unsold (",
										unsoldPlayersCount,
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-3 border-b border-[#5c6875]/30 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 bg-[#171a1d] p-1 rounded-xl border border-[#5c6875]/40 shrink-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setPlayerStatusFilter("all"),
											className: cn("px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer", playerStatusFilter === "all" ? "bg-[#38bdf8] text-[#142630] font-black shadow-sm" : "text-[#abb4bd] hover:text-white"),
											children: [
												"All (",
												players.length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setPlayerStatusFilter("pending"),
											className: cn("px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer", playerStatusFilter === "pending" ? "bg-[#4365a0] text-white font-black shadow-sm" : "text-[#abb4bd] hover:text-white"),
											children: [
												"Available (",
												pendingPlayersCount,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setPlayerStatusFilter("sold"),
											className: cn("px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer", playerStatusFilter === "sold" ? "bg-[#23341d] text-[#c2d8b9] font-black border border-[#47673a] shadow-sm" : "text-[#abb4bd] hover:text-white"),
											children: [
												"Sold (",
												soldPlayersCount,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setPlayerStatusFilter("unsold"),
											className: cn("px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer", playerStatusFilter === "unsold" ? "bg-rose-500 text-white font-black shadow-sm" : "text-rose-400 hover:text-rose-300"),
											children: [
												"Unsold (",
												unsoldPlayersCount,
												")"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										unsoldPlayersCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: async () => {
												if (window.confirm(`Repeat all ${unsoldPlayersCount} unsold players and make them available again?`)) try {
													await auctionClient.repeatUnsoldPlayers(auction.id);
													await queryClient.invalidateQueries({ queryKey: ["players", auction.id] });
													toast.success(`Repeated all ${unsoldPlayersCount} unsold players!`);
												} catch (err) {
													toast.error(err?.message || "Failed to repeat unsold players.");
												}
											},
											variant: "outline",
											className: "gap-2 rounded-full border-2 border-amber-500/60 bg-amber-950/70 text-amber-300 hover:bg-amber-600 hover:text-white font-extrabold text-xs transition-all shadow-sm cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4 text-amber-400" }),
												" Repeat All Unsold (",
												unsoldPlayersCount,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: handleDownloadPlayersExcel,
											variant: "outline",
											className: "gap-2 rounded-full border-2 border-emerald-500/60 bg-emerald-950/70 text-emerald-300 hover:bg-emerald-600 hover:text-white font-extrabold text-xs transition-all shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4 text-emerald-400" }), " Export players Excel"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: handleSharePlayerForm,
											variant: "outline",
											className: "gap-2 rounded-full border-2 border-[#38bdf8]/50 bg-[#162a34] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#ffffff] font-extrabold text-xs transition-all shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), " Share Registration Link"]
										})
									]
								})]
							}),
							playersPending ? Array.from({ length: 2 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full rounded-2xl bg-[#2e343a]/50 border border-[#5c6875]/20" }, i)) : filteredPlayersList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-16 text-center rounded-3xl border-2 border-dashed border-[#5c6875]/40 bg-[#2e343a]/30 p-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#abb4bd] font-medium",
									children: playerStatusFilter === "unsold" ? "No unsold players found." : playerStatusFilter === "pending" ? "No available players found." : playerStatusFilter === "sold" ? "No sold players found." : "No players added yet."
								}), playerStatusFilter === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#a1b5d8] mt-1.5",
									children: "Click the + (plus) button below to register players."
								})]
							}) : filteredPlayersList.map((player) => {
								const soldTeam = teams?.find((t) => t.id === player.teamId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-center gap-4 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 sm:p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)] hover:border-[#a1b5d8]/60 hover:shadow-[0_12px_35px_rgba(161,181,216,0.2)] transition-all duration-300 group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerPreviewCard, {
										player,
										open: previewPlayerId === player.id,
										onOpenChange: (open) => !open && setPreviewPlayerId(null),
										trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "flex flex-1 items-center gap-4 sm:gap-5 text-left hover:opacity-90 transition-opacity min-w-0 pr-8",
											onClick: () => setPreviewPlayerId(player.id),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
												src: player.photo || "",
												alt: player.name,
												className: "size-14 sm:size-16 rounded-2xl border-2 border-[#a1b5d8]/40 shrink-0 object-cover object-top shadow-md group-hover:border-[#a1b5d8]/70 transition-colors",
												fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "display grid size-full place-items-center rounded-2xl bg-gradient-to-br from-[#4365a0] to-[#6a9b57] text-2xl font-bold text-[#fffcf7]",
													children: player.name.slice(0, 2).toUpperCase()
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2 flex-wrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "font-extrabold text-lg sm:text-xl text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors truncate",
														children: player.name
													}), soldTeam ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shadow-sm",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-emerald-400 animate-pulse" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["SOLD: ", soldTeam.name] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-emerald-200",
																children: [
																	"(",
																	player.soldPrice ? formatNum(player.soldPrice) : formatNum(player.baseValue),
																	" pts)"
																]
															})
														]
													}) : player.teamId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold",
														children: [
															"SOLD (",
															player.soldPrice ? formatNum(player.soldPrice) : "",
															" pts)"
														]
													}) : player.auctionRoundStatus === "unsold" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-extrabold flex items-center gap-1.5 shadow-sm",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UNSOLD" })]
													}) : null]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs sm:text-sm font-semibold text-[#a1b5d8] mt-1 leading-snug flex items-center gap-2 flex-wrap",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "px-2.5 py-0.5 rounded-full bg-[#162235] border border-[#a1b5d8]/30 text-[#e4f0d0] text-xs font-bold uppercase",
															children: player.sportFields?.["role"] || "-"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[#abb4bd]",
															children: "·"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[#e3e6e9]",
															children: ["Grade ", player.category || "-"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[#abb4bd]",
															children: "·"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[#a1b5d8]",
															children: ["Level ", player.playerLevel ? `- ${player.playerLevel}` : "-"]
														}),
														player.gender && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[#abb4bd]",
															children: "·"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[#38bdf8] font-bold",
															children: (() => {
																const g = player.gender.trim().toLowerCase();
																if (g === "m" || g === "male") return "Male";
																if (g === "f" || g === "w" || g === "female" || g === "woman" || g === "women") return "Female";
																return player.gender.charAt(0).toUpperCase() + player.gender.slice(1);
															})()
														})] }),
														(() => {
															const dh = player.sportFields?.["Dominated Hand"] || (player.customData?.startsWith("Dominated Hand: ") ? player.customData.replace("Dominated Hand: ", "") : player.customData?.includes("BNI") || player.customData?.includes("Family") ? null : player.customData);
															if (!dh || dh === "-") return null;
															return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[#abb4bd]",
																children: "·"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[#c2d8b9]",
																children: dh
															})] });
														})()
													]
												})]
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "shrink-0 mr-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "rounded-full size-9 bg-[#171a1d]/60 text-[#abb4bd] hover:bg-[#a1b5d8]/20 hover:text-[#a1b5d8]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-5" })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											className: "rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onSelect: () => setEditPlayerId(player.id),
													className: "hover:bg-[#2e343a] cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 size-4 text-[#a1b5d8]" }), " Edit player"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onSelect: () => setChangeTeamPlayer(player),
													className: "hover:bg-[#2e343a] cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mr-2 size-4 text-[#38bdf8]" }), " Change Team"]
												}),
												player.auctionRoundStatus === "unsold" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onSelect: async () => {
														try {
															await updatePlayer({
																id: player.id,
																patch: {
																	auctionRoundStatus: "pending",
																	teamId: null,
																	soldPrice: null
																}
															});
															toast.success(`${player.name} is now available!`);
														} catch {
															toast.error("Failed to repeat player.");
														}
													},
													className: "hover:bg-[#2e343a] cursor-pointer text-amber-300",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-2 size-4 text-amber-400" }), " Repeat / Mark Available"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													className: "text-destructive hover:bg-destructive/15 cursor-pointer",
													onSelect: () => setPlayerToDelete(player.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { className: "mr-2 size-4" }), " Delete player"]
												})
											]
										})] })
									})]
								}, player.id);
							}),
							editPlayerId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerFormModal, {
								auctionId: auction.id,
								sportType: auction.sportType,
								playersPerTeam: auction.playersPerTeam,
								player: players.find((p) => p.id === editPlayerId),
								open: !!editPlayerId,
								onOpenChange: (open) => {
									if (!open) setEditPlayerId(null);
								}
							}),
							changeTeamPlayer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangePlayerTeamModal, {
								auction,
								player: changeTeamPlayer,
								teams,
								players,
								open: !!changeTeamPlayer,
								onOpenChange: (open) => {
									if (!open) setChangeTeamPlayer(null);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerFormModal, {
								auctionId: auction.id,
								sportType: auction.sportType,
								playersPerTeam: auction.playersPerTeam
							})
						]
					}),
					activeTab === "ABOUT" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutTab, {
						auction,
						teams,
						players
					}),
					activeTab !== "TEAMS" && activeTab !== "PLAYERS" && activeTab !== "ABOUT" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-16 text-center rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/50 p-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[#abb4bd] font-medium text-sm",
							children: [activeTab, " tab analytics & tools are launching shortly."]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!teamToDelete,
				onOpenChange: (o) => !o && setTeamToDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete Team?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
						className: "text-[#abb4bd]",
						children: "This will delete the team and unassign any players sold to it. This action cannot be undone."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						className: "rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-6 shadow-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: () => {
							if (teamToDelete) {
								deleteTeam(teamToDelete);
								toast.success("Team deleted");
							}
						},
						className: "rounded-full bg-destructive hover:bg-destructive/90 text-white",
						children: "Delete"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!playerToDelete,
				onOpenChange: (o) => !o && setPlayerToDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete Player?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
						className: "text-[#abb4bd]",
						children: "This action cannot be undone. If the player was sold, the team's spent budget will be reversed."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						className: "rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-6 shadow-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: () => {
							if (playerToDelete) {
								deletePlayer(playerToDelete);
								toast.success("Player deleted");
							}
						},
						className: "rounded-full bg-destructive hover:bg-destructive/90 text-white",
						children: "Delete"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: readinessModalOpen,
				onOpenChange: setReadinessModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Auction not ready" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
						className: "text-[#abb4bd]",
						children: "Please add a Team and a player. Then get ready to start your auction!"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						className: "rounded-full bg-gradient-to-r from-[#6c8cc2] to-[#a1b5d8] text-[#162235] font-bold",
						children: "OK"
					}) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChooseAuctionModeDialog, {
				open: modeDialogOpen,
				onOpenChange: setModeDialogOpen,
				onConfirm: handleConfirmMode
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: paymentModalOpen,
				onOpenChange: setPaymentModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Payment Method" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
						className: "text-[#abb4bd]",
						children: "Integration with payment gateways (Razorpay, Stripe, etc.) will be added here soon."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						className: "rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-[#ffffff] font-black shadow-[0_0_20px_rgba(249,115,22,0.6)]",
						children: "OK"
					}) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-0 left-0 right-0 border-t border-[#38bdf8]/40 bg-[#142630]/98 backdrop-blur-xl p-4 sm:hidden z-40 shadow-[0_-5px_25px_rgba(10,25,32,0.8)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-md gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "flex-1 rounded-full py-3 h-auto font-black text-xs border-2 border-[#38bdf8]/50 bg-[#162a34] text-[#ffffff] hover:bg-[#204554] shadow-sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/my-auctions/$id/edit",
							params: { id: auction.id },
							children: "EDIT AUCTION"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: handleStartAuction,
						className: "flex-1 rounded-full py-3 h-auto font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] border border-white/40",
						children: "START AUCTION"
					})]
				})
			})
		]
	});
}
//#endregion
export { ManageAuctionPage as component };
