import { o as __toESM } from "../_runtime.mjs";
import { r as cn } from "./auth-client-0cXNnUku.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Pencil, Q as FileSpreadsheet, St as CalendarDays, Z as FileText, b as ShieldCheck, bt as Check, f as Trash, g as Sparkles, i as Users, nt as ExternalLink, o as UserPlus, ot as Copy, rt as EllipsisVertical, s as UserCheck, u as Trophy, w as RotateCcw, x as Share2, y as Shield } from "../_libs/lucide-react.mjs";
import { a as SiteHeader, i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./SiteHeader-yG2LLCbm.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as stadium_band_default } from "./alert-dialog-VY8twHzw.mjs";
import { t as Skeleton } from "./skeleton-CFtqm2zk.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
import { t as auctionDetailQueryOptions } from "./auctions-CnIaKf3e.mjs";
import { t as FallbackImage } from "./fallback-image-CwnNUhIA.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
import { n as Label, t as Input } from "./input-BifiwAc8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, s as usePlayers, t as Select } from "./select-CBTHEQ7z.mjs";
import { t as Route } from "./auctions._id-Byu_RkE7.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C2cO245r.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as format } from "../_libs/date-fns.mjs";
import { a as useTeams, i as formatPoints, n as computeTeamStats, r as exportAuctionPDF, t as ChangePlayerTeamModal } from "./pdf-export-d54OVmg_.mjs";
import { a as TeamFormModal, i as PlayerPreviewCard, n as Countdown, r as PlayerFormModal, t as AboutTab } from "./PlayerFormModal-VTjOHpCn.mjs";
import { t as useRealtimeUpdates } from "./useRealtimeUpdates--HEqg2nB.mjs";
import { n as writeFileSync, t as utils } from "../_libs/xlsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auctions._id-CMK-61Ug.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuctionDetailPage() {
	const { auction: initialAuction } = Route.useLoaderData();
	const { data: auction = initialAuction } = useQuery(auctionDetailQueryOptions(initialAuction.id));
	const queryClient = useQueryClient();
	useRealtimeUpdates(auction?.id);
	const { players, isPending: playersPending, updatePlayer, deletePlayer, isUpdating: playersUpdating } = usePlayers(auction.id);
	const { teams, isPending: teamsPending, deleteTeam } = useTeams(auction.id);
	const [activeTab, setActiveTab] = (0, import_react.useState)("TEAMS");
	const [previewPlayerId, setPreviewPlayerId] = (0, import_react.useState)(null);
	const [editPlayer, setEditPlayer] = (0, import_react.useState)(null);
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(null);
	const [teamToDelete, setTeamToDelete] = (0, import_react.useState)(null);
	const [editTeamId, setEditTeamId] = (0, import_react.useState)(null);
	const [playerToDelete, setPlayerToDelete] = (0, import_react.useState)(null);
	const [editPlayerId, setEditPlayerId] = (0, import_react.useState)(null);
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
	function copyUrl(url, label) {
		navigator.clipboard.writeText(url);
		setCopiedLink(label);
		toast.success(`${label} copied to clipboard!`);
		setTimeout(() => setCopiedLink(null), 2500);
	}
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	const playerRegUrl = `${origin}/register-player/${auction.id}`;
	const teamRegUrl = `${origin}/register-team/${auction.id}`;
	const publicAuctionUrl = `${origin}/auctions/${auction.id}`;
	const handleSaveGrade = async (newGrade) => {
		if (!editPlayer) return;
		try {
			await updatePlayer({
				id: editPlayer.id,
				patch: { category: newGrade }
			});
			toast.success("Player grade updated successfully!");
		} catch (err) {
			toast.error("Failed to update player grade.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235] flex flex-col",
		style: { background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative isolate min-h-[280px] sm:min-h-[320px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: stadium_band_default,
						alt: "",
						"aria-hidden": "true",
						className: "absolute inset-0 size-full object-cover opacity-30 mix-blend-luminosity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[#171a1d] via-[#171a1d]/80 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-4xl px-4 pt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4 sm:gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
								src: auction.coverImage || "",
								alt: "",
								className: "size-20 rounded-3xl border-2 border-[#a1b5d8]/40 sm:size-28 shadow-2xl object-cover",
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "display grid size-full place-items-center rounded-3xl bg-gradient-to-br from-[#4365a0] to-[#6a9b57] text-2xl sm:text-3xl font-black text-[#fffcf7] shadow-xl",
									children: auction.name.slice(0, 2).toUpperCase()
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 text-[#ffffff]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-black sm:text-4xl lg:text-5xl font-auction tracking-wider [word-spacing:0.18em] text-[#ffffff] uppercase drop-shadow-md",
									children: auction.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 space-y-1.5 text-sm sm:text-base",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-2 text-[#abb4bd]",
											children: [
												"Auction Code: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[#a1b5d8] font-bold bg-[#162235]/60 px-2 py-0.5 rounded-lg border border-[#4365a0]/40",
													children: auction.id.slice(-6)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: copyCode,
													className: "hover:text-[#fffcf7] text-[#a1b5d8] transition-colors p-1",
													"aria-label": "Copy code",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-2 text-[#abb4bd]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-[#a1b5d8]" }), format(new Date(auction.startsAt), "dd-MM-yyyy, h:mm a")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[#abb4bd]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-[#a1b5d8]" }),
														" ",
														auction.playersPerTeam,
														" Player Per Team"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4 text-[#c2d8b9]" }),
														" ",
														players ? players.length : 0,
														" Registered"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, { targetDate: auction.startsAt })
											]
										})
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap items-center justify-between gap-3 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 font-black",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs px-3.5 py-1.5 rounded-xl border border-[#47673a] bg-[#23341d]/70 text-[#e4f0d0] shadow-sm",
									children: "✨ Free Access"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => {
										exportAuctionPDF(auction, players || [], teams || []);
										toast.success("Auction Results PDF Report downloaded!");
									},
									variant: "outline",
									className: "rounded-full border border-[#a1b5d8]/40 bg-[#162235]/80 text-[#a1b5d8] hover:bg-[#a1b5d8] hover:text-[#162235] font-bold text-xs gap-1.5 transition-all shadow-sm cursor-pointer",
									title: "Download Teams & Purchased Players PDF Report",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), "Auction Results PDF"]
								})
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-[#171a1d]/90 backdrop-blur-xl border-b border-[#5c6875]/30 sticky top-0 z-30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex max-w-4xl overflow-x-auto px-4 hide-scrollbar",
					children: [
						"TEAMS",
						"PLAYERS",
						"MVP",
						"SPONSORS",
						"LINK",
						"ABOUT"
					].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveTab(tab),
						className: `whitespace-nowrap px-5 py-4 text-xs sm:text-sm font-black tracking-wider transition-colors cursor-pointer ${activeTab === tab ? "border-b-2 border-[#a1b5d8] text-[#a1b5d8]" : "text-[#abb4bd] hover:text-[#fffcf7]"}`,
						children: tab === "TEAMS" && teams ? `TEAMS (${teams.length})` : tab === "PLAYERS" && players ? `PLAYERS (${players.length})` : tab
					}, tab))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-4 py-10 pb-32 flex-1 w-full",
				children: [
					activeTab === "TEAMS" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => {
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
									},
									variant: "outline",
									className: "gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-600 hover:text-white font-semibold text-xs transition-all shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4 text-emerald-400" }), " Export teams Excel"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => {
										const url = `${window.location.origin}/register-team/${auction.id}`;
										navigator.clipboard.writeText(url);
										toast.success("Team registration link copied to clipboard!");
									},
									variant: "outline",
									className: "gap-2 rounded-full border border-[#a1b5d8]/40 bg-[#162235]/70 text-[#a1b5d8] hover:bg-[#a1b5d8]/20 hover:text-[#fffcf7] font-semibold text-xs transition-all shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4 text-[#a1b5d8]" }), " Share Registration Link"]
								})]
							}),
							teamsPending ? Array.from({ length: 2 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full rounded-3xl bg-[#2e343a]/60" }, i)) : teams.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-16 text-center rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/50 p-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#abb4bd] font-medium",
									children: "No teams listed yet."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#a1b5d8] mt-1.5",
									children: "Click the + (plus) button below to add your first team."
								})]
							}) : teams.map((team) => {
								const { totalPoints, totalPlayers, reservedPlayers, usedPoints } = computeTeamStats(team, players, auction);
								const formatNum = formatPoints;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-5 shadow-[0_15px_45px_rgba(23,26,29,0.8)] hover:border-[#a1b5d8]/40 transition-all flex flex-col group text-[#fffcf7]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-4 sm:gap-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0 size-20 sm:size-24 rounded-2xl bg-[#162235] border border-[#a1b5d8]/30 flex items-center justify-center overflow-hidden shadow-md",
											children: team.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: team.logo,
												alt: team.name,
												className: "size-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl sm:text-3xl font-black text-[#a1b5d8]",
												children: team.shortName.slice(0, 3)
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0 flex flex-col justify-between py-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between items-start gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "font-black text-lg sm:text-xl text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors truncate",
															children: team.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs font-bold text-[#abb4bd] mt-0.5 uppercase tracking-wider",
															children: team.shortName
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-right pl-2 shrink-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fffcf7] via-[#ecf0f7] to-[#a1b5d8] leading-none mb-1",
															children: formatNum(totalPoints)
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] font-bold text-[#abb4bd] uppercase tracking-wider whitespace-nowrap",
															children: "Total Points"
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3 sm:gap-4 mt-3 overflow-x-auto hide-scrollbar",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] font-bold text-[#abb4bd] uppercase tracking-wider mb-0.5 whitespace-nowrap",
															children: "Total Pl"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "font-black text-sm sm:text-base text-[#fffcf7]",
															children: [
																totalPlayers.toString().padStart(2, "0"),
																" / ",
																auction.playersPerTeam.toString().padStart(2, "0")
															]
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px h-6 bg-[#5c6875]/30 shrink-0" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] font-bold text-[#abb4bd] uppercase tracking-wider mb-0.5 whitespace-nowrap",
															children: "Res. Pl"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-black text-sm sm:text-base text-[#c2d8b9]",
															children: reservedPlayers.toString().padStart(2, "0")
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px h-6 bg-[#5c6875]/30 shrink-0" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] font-bold text-[#abb4bd] uppercase tracking-wider mb-0.5 whitespace-nowrap",
															children: "Used Pts"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-black text-sm sm:text-base text-[#ffd791]",
															children: formatNum(usedPoints)
														})] })
													]
												}),
												(() => {
													const teamBoughtPlayers = (players || []).filter((p) => p.teamId === team.id);
													if (teamBoughtPlayers.length === 0) return null;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-4 pt-3.5 border-t border-[#5c6875]/30",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "flex items-center justify-between mb-2",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-[11px] font-bold uppercase tracking-wider text-[#abb4bd] flex items-center gap-1.5",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400" }),
																	"Bought Players (",
																	teamBoughtPlayers.length,
																	")"
																]
															})
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
												className: "hover:bg-[#2e343a] cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 size-4 text-[#a1b5d8]" }), " Edit team"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												className: "text-destructive hover:bg-destructive/15 cursor-pointer",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center justify-end gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => {
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
										const cleanTitle = (auction.name || "Tournament").replace(/[^a-zA-Z0-9_-]/g, "_");
										writeFileSync(workbook, `${cleanTitle}_Registered_Players.xlsx`);
										toast.success("Players Excel sheet downloaded successfully!");
									},
									variant: "outline",
									className: "gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-600 hover:text-white font-semibold text-xs transition-all shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4 text-emerald-400" }), " Export players Excel"]
								})
							}),
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
									children: [unsoldPlayersCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
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
										className: "gap-2 rounded-full border border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-600 hover:text-white font-semibold text-xs transition-all shadow-sm cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4 text-amber-400" }),
											" Repeat All Unsold (",
											unsoldPlayersCount,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => {
											const url = `${window.location.origin}/register-player/${auction.id}`;
											navigator.clipboard.writeText(url);
											toast.success("Player registration link copied to clipboard!");
										},
										variant: "outline",
										className: "gap-2 rounded-full border border-[#a1b5d8]/40 bg-[#162235]/70 text-[#a1b5d8] hover:bg-[#a1b5d8]/20 hover:text-[#fffcf7] font-semibold text-xs transition-all shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4 text-[#a1b5d8]" }), " Share Registration Link"]
									})]
								})]
							}),
							playersPending ? Array.from({ length: 2 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-3xl bg-[#2e343a]/60" }, i)) : filteredPlayersList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-16 text-center rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/50 p-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#abb4bd] font-medium",
									children: playerStatusFilter === "unsold" ? "No unsold players found." : playerStatusFilter === "pending" ? "No available players found." : playerStatusFilter === "sold" ? "No sold players found." : "No players registered yet."
								}), playerStatusFilter === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#a1b5d8] mt-1.5",
									children: "Click the + (plus) button below to register players."
								})]
							}) : filteredPlayersList.map((player) => {
								const soldTeam = teams?.find((t) => t.id === player.teamId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-center gap-4 sm:gap-5 rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-4 sm:p-5 shadow-[0_15px_45px_rgba(23,26,29,0.8)] hover:border-[#a1b5d8]/50 hover:bg-[#2e343a]/90 transition-all group text-[#fffcf7]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerPreviewCard, {
										player,
										open: previewPlayerId === player.id,
										onOpenChange: (open) => !open && setPreviewPlayerId(null),
										trigger: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "flex flex-1 items-center gap-4 sm:gap-5 text-left hover:opacity-90 transition-opacity min-w-0 pr-4 cursor-pointer",
											onClick: () => setPreviewPlayerId(player.id),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
												src: player.photo || "",
												alt: player.name,
												className: "size-14 sm:size-16 rounded-2xl border-2 border-[#a1b5d8]/40 shrink-0 object-cover object-top shadow-md group-hover:border-[#a1b5d8]/70 transition-colors",
												fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "display grid size-full place-items-center rounded-2xl bg-[#162235] text-xl font-black text-[#a1b5d8]",
													children: player.name.slice(0, 2).toUpperCase()
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2 flex-wrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "font-black text-lg sm:text-xl text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors truncate",
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
																	player.soldPrice ? formatPoints(player.soldPrice) : formatPoints(player.baseValue),
																	" pts)"
																]
															})
														]
													}) : player.teamId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold",
														children: [
															"SOLD (",
															player.soldPrice ? formatPoints(player.soldPrice) : "",
															" pts)"
														]
													}) : player.auctionRoundStatus === "unsold" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-extrabold flex items-center gap-1.5 shadow-sm",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UNSOLD" })]
													}) : null]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs sm:text-sm font-semibold text-[#abb4bd] mt-1 leading-snug flex items-center gap-2 flex-wrap",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "px-2.5 py-0.5 rounded-full bg-[#162235] border border-[#a1b5d8]/30 text-[#e4f0d0] text-xs font-bold uppercase",
															children: player.sportFields?.["role"] || "-"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[#5c6875]",
															children: "·"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-[#e3e6e9] font-bold",
															children: ["Grade ", player.category || "-"]
														}),
														(() => {
															const dh = player.sportFields?.["Dominated Hand"] || (player.customData?.startsWith("Dominated Hand: ") ? player.customData.replace("Dominated Hand: ", "") : player.customData?.includes("BNI") || player.customData?.includes("Family") ? null : player.customData);
															if (!dh || dh === "-") return null;
															return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[#5c6875]",
																children: "·"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-[#c2d8b9] font-bold",
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
					activeTab === "LINK" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-6 sm:p-7 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3.5 mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-10 rounded-2xl bg-[#162235] border border-[#a1b5d8]/40 flex items-center justify-center shadow-md",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-5 text-[#a1b5d8]" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg sm:text-xl font-black text-[#fffcf7]",
										children: "Player Registration Link"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-[#abb4bd] font-medium",
										children: "Share this public link with players so they can register for this auction"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										readOnly: true,
										value: playerRegUrl,
										className: "flex-1 rounded-xl border-[#5c6875]/50 bg-[#171a1d]/90 text-[#a1b5d8] font-mono text-xs sm:text-sm h-11"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => copyUrl(playerRegUrl, "Player registration link"),
											className: "rounded-xl px-5 h-11 font-bold text-xs bg-[#162235] text-[#a1b5d8] border border-[#4365a0] hover:bg-[#a1b5d8] hover:text-[#162235] transition-all flex items-center gap-1.5",
											children: [copiedLink === "Player registration link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copiedLink === "Player registration link" ? "Copied" : "Copy Link"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "outline",
											className: "rounded-xl px-4 h-11 border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: playerRegUrl,
												target: "_blank",
												rel: "noreferrer",
												"aria-label": "Open registration page",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
											})
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-6 sm:p-7 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3.5 mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-10 rounded-2xl bg-[#23341d] border border-[#47673a] flex items-center justify-center shadow-md",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-[#c2d8b9]" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg sm:text-xl font-black text-[#fffcf7]",
										children: "Team Registration Link"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-[#abb4bd] font-medium",
										children: "Share this link with team owners to register their franchise and set team names"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										readOnly: true,
										value: teamRegUrl,
										className: "flex-1 rounded-xl border-[#5c6875]/50 bg-[#171a1d]/90 text-[#c2d8b9] font-mono text-xs sm:text-sm h-11"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => copyUrl(teamRegUrl, "Team registration link"),
											className: "rounded-xl px-5 h-11 font-bold text-xs bg-[#23341d] text-[#c2d8b9] border border-[#47673a] hover:bg-[#c2d8b9] hover:text-[#23341d] transition-all flex items-center gap-1.5",
											children: [copiedLink === "Team registration link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copiedLink === "Team registration link" ? "Copied" : "Copy Link"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "outline",
											className: "rounded-xl px-4 h-11 border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: teamRegUrl,
												target: "_blank",
												rel: "noreferrer",
												"aria-label": "Open team registration page",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
											})
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-6 sm:p-7 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3.5 mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-10 rounded-2xl bg-[#643f00]/30 border border-[#ffd791]/30 flex items-center justify-center shadow-md",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-5 text-[#ffd791]" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg sm:text-xl font-black text-[#fffcf7]",
										children: "Public Auction View Link"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-[#abb4bd] font-medium",
										children: "Direct public link to share with audience and fans to track players and teams"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										readOnly: true,
										value: publicAuctionUrl,
										className: "flex-1 rounded-xl border-[#5c6875]/50 bg-[#171a1d]/90 text-[#ffd791] font-mono text-xs sm:text-sm h-11"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => copyUrl(publicAuctionUrl, "Public auction link"),
											className: "rounded-xl px-5 h-11 font-bold text-xs bg-[#643f00]/30 text-[#ffd791] border border-[#ffd791]/40 hover:bg-[#ffd791] hover:text-[#171a1d] transition-all flex items-center gap-1.5",
											children: [copiedLink === "Public auction link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copiedLink === "Public auction link" ? "Copied" : "Copy Link"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											variant: "outline",
											className: "rounded-xl px-4 h-11 border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: publicAuctionUrl,
												target: "_blank",
												rel: "noreferrer",
												"aria-label": "Open public view page",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
											})
										})]
									})]
								})]
							})
						]
					}),
					activeTab === "MVP" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-10 rounded-2xl bg-[#643f00]/30 border border-[#ffd791]/40 flex items-center justify-center shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-5 text-[#ffd791]" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-black text-[#fffcf7]",
									children: "Top Rated Players"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#abb4bd]",
									children: "Players registered for the upcoming draft"
								})] })]
							}), players && players.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: players.slice(0, 6).map((player, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#5c6875]/30 bg-[#171a1d]/60 hover:bg-[#171a1d]/90 transition-all",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "size-7 rounded-xl bg-[#162235] border border-[#a1b5d8]/30 flex items-center justify-center font-black text-xs text-[#a1b5d8] shrink-0",
											children: ["#", idx + 1]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
											src: player.photo || "",
											alt: player.name,
											className: "size-12 rounded-xl object-cover object-top border border-[#a1b5d8]/30 shrink-0",
											fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "display grid size-full place-items-center rounded-xl bg-[#162235] text-xs font-black text-[#a1b5d8]",
												children: player.name.slice(0, 2).toUpperCase()
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-sm text-[#fffcf7] truncate",
												children: player.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-[#abb4bd] font-medium flex items-center gap-2 mt-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[#a1b5d8]",
														children: player.sportFields?.["role"] || "-"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[#ffd791]",
														children: ["Grade ", player.category || "-"]
													})
												]
											})]
										})
									]
								}, player.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center py-10 text-sm text-[#abb4bd]",
								children: "No players currently registered to rank."
							})]
						})
					}),
					activeTab === "SPONSORS" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-center text-[#fffcf7]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-14 mx-auto rounded-3xl bg-[#162235] border border-[#a1b5d8]/40 flex items-center justify-center shadow-lg mb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-7 text-[#a1b5d8]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl sm:text-2xl font-black text-[#fffcf7]",
									children: "Official Event Partners"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[#abb4bd] max-w-md mx-auto mt-2",
									children: "Proudly supported by community sponsors, team franchises, and league organizers."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto",
									children: [
										"PitchBid Sports",
										"League Arena",
										"ProDraft 2026"
									].map((partner, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-4 rounded-2xl border border-[#5c6875]/30 bg-[#171a1d]/70 text-center font-bold text-xs text-[#a1b5d8] flex items-center justify-center min-h-[60px]",
										children: partner
									}, i))
								})
							]
						})
					}),
					activeTab === "ABOUT" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutTab, {
						auction,
						teams,
						players
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
						onClick: async () => {
							if (teamToDelete) try {
								await deleteTeam(teamToDelete);
								toast.success("Team deleted");
							} catch (err) {
								toast.error(err instanceof Error ? err.message : "Failed to delete team");
							} finally {
								setTeamToDelete(null);
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
						onClick: async () => {
							if (playerToDelete) try {
								await deletePlayer(playerToDelete);
								toast.success("Player deleted");
							} catch (err) {
								toast.error(err instanceof Error ? err.message : "Failed to delete player");
							} finally {
								setPlayerToDelete(null);
							}
						},
						className: "rounded-full bg-destructive hover:bg-destructive/90 text-white",
						children: "Delete"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditGradeModal, {
				player: editPlayer,
				open: !!editPlayer,
				onOpenChange: (open) => !open && setEditPlayer(null),
				onSave: handleSaveGrade,
				isSaving: playersUpdating
			})
		]
	});
}
function EditGradeModal({ player, open, onOpenChange, onSave, isSaving }) {
	const [grade, setGrade] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (player) setGrade(player.category || "");
	}, [player]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		await onSave(grade);
		onOpenChange(false);
	};
	const isBniAuction = player?.auctionId === "6a8edaddd7ed74151dbafab3";
	const initialIsBni = player?.customData?.startsWith("BNI Member");
	const initialIsFamily = player?.customData?.startsWith("Family Member");
	const memberType = initialIsBni ? "bni" : initialIsFamily ? "family" : "";
	let chapterName = "";
	let bniName = "";
	let relationship = "";
	let bblSeasons = "";
	if (player?.customData) {
		if (initialIsBni) {
			const match = player.customData.match(/Chapter: ([^|]*)/);
			if (match) chapterName = match[1]?.trim() || "";
			const bblMatch = player.customData.match(/BBL Seasons: ([^|]*)/);
			if (bblMatch) bblSeasons = bblMatch[1]?.trim() || "";
		} else if (initialIsFamily) {
			const match = player.customData.match(/BNI Name: ([^,]*), Chapter: ([^,]*), Rel: ([^|]*)/);
			if (match) {
				bniName = match[1]?.trim() || "";
				chapterName = match[2]?.trim() || "";
				relationship = match[3]?.trim() || "";
			}
			const bblMatch = player.customData.match(/BBL Seasons: ([^|]*)/);
			if (bblMatch) bblSeasons = bblMatch[1]?.trim() || "";
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "sm:max-w-[600px] rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-6 sm:p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-xl font-black text-[#fffcf7]",
						children: "Edit Player Grade"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2 py-4 max-h-[70vh] overflow-y-auto px-1",
						children: [
							player?.photo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2 flex flex-col items-center justify-center space-y-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Player Photo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-28 rounded-2xl overflow-hidden border-2 border-[#a1b5d8]/40 shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: player.photo,
										alt: player.name,
										className: "size-full object-cover object-top"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-name",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-name",
									value: player?.name || "",
									disabled: true,
									className: "rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-phone",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-phone",
									value: player?.phone || "",
									disabled: true,
									className: "rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-age",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Age"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-age",
									value: player?.age?.toString() || "-",
									disabled: true,
									className: "rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 border border-[#a1b5d8]/40 bg-[#162235]/60 p-3 rounded-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-grade",
									className: "text-[#a1b5d8] font-bold text-xs uppercase tracking-wider",
									children: "Grade (Editable)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: grade,
									onValueChange: setGrade,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "edit-grade",
										className: "border-[#a1b5d8]/50 bg-[#171a1d] text-[#fffcf7] rounded-xl focus:ring-[#a1b5d8]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Grade" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "A+",
												className: "hover:bg-[#2e343a]",
												children: "A+"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "A",
												className: "hover:bg-[#2e343a]",
												children: "A"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "B+",
												className: "hover:bg-[#2e343a]",
												children: "B+"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "B",
												className: "hover:bg-[#2e343a]",
												children: "B"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Gender"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: player?.gender || "",
									disabled: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "-" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Male",
											children: "Male"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Female",
											children: "Female"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-city",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "City"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-city",
									value: player?.city || "-",
									disabled: true,
									className: "rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Player Level"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: player?.playerLevel || "",
									disabled: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "-" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Beginner",
												children: "Beginner"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Intermediate",
												children: "Intermediate"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Advanced",
												children: "Advanced"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Professional",
												children: "Professional"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-jerseySize",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Jersey Size"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-jerseySize",
									value: player?.jerseySize || "-",
									disabled: true,
									className: "rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80"
								})]
							}),
							isBniAuction && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-jerseyName",
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: "Jersey Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit-jerseyName",
										value: player?.jerseyName || "-",
										disabled: true,
										className: "rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-trouserSize",
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: "Jersey Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit-trouserSize",
										value: player?.trouserSize || "-",
										disabled: true,
										className: "rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: "Number of BBL seasons played"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: bblSeasons,
										disabled: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "rounded-xl border-[#5c6875]/30 bg-[#2e343a]/50 text-[#fffcf7] disabled:opacity-80",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "-" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
											className: "rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7]",
											children: Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: String(i),
												children: i
											}, i))
										})]
									})]
								})
							] }),
							isBniAuction && memberType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2 rounded-2xl border border-[#5c6875]/30 p-4 bg-[#2e343a]/40 space-y-3 mt-2 text-[#fffcf7]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-bold text-sm text-[#fffcf7]",
									children: "Membership Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#abb4bd] block text-xs",
											children: "Member Type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold capitalize text-[#a1b5d8]",
											children: [memberType, " Member"]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#abb4bd] block text-xs",
											children: "Chapter Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-[#fffcf7]",
											children: chapterName || "-"
										})] }),
										memberType === "family" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#abb4bd] block text-xs",
											children: "BNI Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-[#fffcf7]",
											children: bniName || "-"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#abb4bd] block text-xs",
											children: "Relationship"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium capitalize text-[#fffcf7]",
											children: relationship || "-"
										})] })] })
									]
								})]
							}),
							!isBniAuction && player?.paymentImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2 flex flex-col items-center justify-center space-y-2 mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Payment Screenshot"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-w-xs border border-[#5c6875]/40 rounded-2xl overflow-hidden bg-[#171a1d] p-1 shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: player.paymentImage,
										alt: "Payment screenshot",
										className: "w-full h-auto object-contain max-h-48 rounded-xl cursor-pointer hover:opacity-95 transition-opacity",
										onClick: () => window.open(player.paymentImage, "_blank"),
										title: "Click to view full screenshot"
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "mt-4 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							disabled: isSaving,
							className: "rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-6 shadow-sm",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: isSaving,
							className: "rounded-full px-7 py-2.5 font-black text-xs text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-md",
							children: isSaving ? "Saving..." : "Save Grade"
						})]
					})
				]
			})
		})
	});
}
//#endregion
export { AuctionDetailPage as component };
