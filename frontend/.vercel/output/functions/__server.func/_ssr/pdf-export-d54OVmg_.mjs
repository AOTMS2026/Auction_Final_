import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { R as LoaderCircle, ht as CircleAlert, y as Shield } from "../_libs/lucide-react.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
import { n as auctionKeys, o as teamsQueryOptions } from "./auctions-CnIaKf3e.mjs";
import { t as FallbackImage } from "./fallback-image-CwnNUhIA.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
import { n as Label, t as Input } from "./input-BifiwAc8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, s as usePlayers, t as Select } from "./select-CBTHEQ7z.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C2cO245r.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as format } from "../_libs/date-fns.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pdf-export-d54OVmg_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
function useTeams(auctionId) {
	const queryClient = useQueryClient();
	const query = useQuery(teamsQueryOptions(auctionId));
	const invalidate = async () => {
		await queryClient.invalidateQueries({
			queryKey: auctionKeys.teams(auctionId),
			refetchType: "all"
		});
		await queryClient.refetchQueries({ queryKey: auctionKeys.teams(auctionId) });
	};
	const createMutation = useMutation({
		mutationFn: (input) => auctionClient.createTeam(input),
		onSuccess: invalidate
	});
	const updateMutation = useMutation({
		mutationFn: ({ id, patch }) => auctionClient.updateTeam(id, patch),
		onSuccess: invalidate
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => auctionClient.deleteTeam(id),
		onSuccess: invalidate
	});
	return {
		teams: query.data ?? [],
		isPending: query.isPending,
		isError: query.isError,
		refetch: query.refetch,
		createTeam: createMutation.mutateAsync,
		isCreating: createMutation.isPending,
		updateTeam: updateMutation.mutateAsync,
		isUpdating: updateMutation.isPending,
		deleteTeam: deleteMutation.mutateAsync,
		isDeleting: deleteMutation.isPending
	};
}
function computeTeamStats(team, players, auction) {
	const teamPlayers = players.filter((p) => p.teamId === team.id && (p.auctionRoundStatus === "sold" || (p.soldPrice ?? 0) > 0));
	let usedPoints = 0;
	for (const p of teamPlayers) if (p.soldPrice) usedPoints += p.soldPrice;
	const totalPoints = auction.pointsPerTeam;
	const availablePoints = Math.max(0, totalPoints - usedPoints);
	const totalPlayers = teamPlayers.length;
	const reservedPlayers = Math.max(0, auction.playersPerTeam - totalPlayers);
	const maxBidPoints = reservedPlayers > 0 ? Math.min(auction.maxBid ?? 3e4, availablePoints - (reservedPlayers - 1) * auction.minimumBid) : 0;
	return {
		usedPoints,
		totalPoints,
		availablePoints,
		totalPlayers,
		reservedPlayers,
		maxBidPoints: maxBidPoints > 0 ? maxBidPoints : 0
	};
}
function formatPoints(num) {
	if (num >= 1e5) return `${(num / 1e5).toFixed(1).replace(/\.0$/, "")} L`;
	if (num >= 1e3) return `${(num / 1e3).toFixed(1).replace(/\.0$/, "")} T`;
	return num.toString();
}
function ChangePlayerTeamModal({ auction, player, teams, players, open, onOpenChange, onSuccess }) {
	const { updatePlayer, isUpdating } = usePlayers(auction.id);
	const [selectedTeamId, setSelectedTeamId] = (0, import_react.useState)("none");
	const [soldPrice, setSoldPrice] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (player && open) {
			setSelectedTeamId(player.teamId || "none");
			const defaultPrice = player.soldPrice != null && player.soldPrice > 0 ? player.soldPrice : player.baseValue != null && player.baseValue > 0 ? player.baseValue : auction.minimumBid;
			setSoldPrice(defaultPrice.toString());
		}
	}, [
		player,
		open,
		auction.minimumBid
	]);
	if (!player) return null;
	const currentTeam = teams.find((t) => t.id === player.teamId);
	const targetTeam = teams.find((t) => t.id === selectedTeamId);
	const targetTeamStats = targetTeam ? computeTeamStats(targetTeam, players, auction) : null;
	const isAlreadyOnSelectedTeam = player.teamId === selectedTeamId;
	const isTargetTeamFull = targetTeamStats != null && !isAlreadyOnSelectedTeam && targetTeamStats.reservedPlayers <= 0;
	const parsedPrice = parseFloat(soldPrice);
	let priceError = null;
	if (selectedTeamId !== "none") {
		if (!soldPrice || isNaN(parsedPrice)) priceError = "Please enter a valid sold price.";
		else if (parsedPrice < auction.minimumBid) priceError = `Minimum bid is 🪙 ${auction.minimumBid.toLocaleString()}`;
		else if (targetTeamStats) {
			if ((isAlreadyOnSelectedTeam ? parsedPrice - (player.soldPrice ?? 0) : parsedPrice) > targetTeamStats.availablePoints) priceError = `Exceeds available purse (🪙 ${targetTeamStats.availablePoints.toLocaleString()} left)`;
			else if (!isAlreadyOnSelectedTeam && parsedPrice > targetTeamStats.maxBidPoints) priceError = `Exceeds team's max allowed bid of 🪙 ${targetTeamStats.maxBidPoints.toLocaleString()}`;
		}
	}
	async function handleSubmit(e) {
		e.preventDefault();
		if (!player) return;
		if (selectedTeamId === "none") {
			try {
				await updatePlayer({
					id: player.id,
					patch: {
						teamId: null,
						soldPrice: null,
						auctionRoundStatus: "pending"
					}
				});
				toast.success(`Removed ${player.name} from team. Marked as Available.`);
				onOpenChange(false);
				onSuccess?.();
			} catch (err) {
				toast.error(err?.message || "Failed to remove player from team.");
			}
			return;
		}
		if (priceError) {
			toast.error(priceError);
			return;
		}
		if (isTargetTeamFull) {
			toast.error("The selected team already has the maximum number of players.");
			return;
		}
		try {
			await updatePlayer({
				id: player.id,
				patch: {
					teamId: selectedTeamId,
					soldPrice: parsedPrice,
					auctionRoundStatus: "sold"
				}
			});
			toast.success(`Updated ${player.name}'s team to ${targetTeam?.name || "Team"} (🪙 ${parsedPrice.toLocaleString()})`);
			onOpenChange(false);
			onSuccess?.();
		} catch (err) {
			toast.error(err?.message || "Failed to update player's team.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md flex flex-col rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-xl font-black text-[#fffcf7] tracking-tight flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5 text-[#38bdf8]" }), "Change Player Team"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5 p-3 rounded-2xl border border-[#5c6875]/35 bg-[#2e343a]/50 mt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
						src: player.photo || "",
						alt: player.name,
						className: "size-14 rounded-xl object-cover object-top border-2 border-[#a1b5d8]/40 shrink-0",
						fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "display grid size-full place-items-center rounded-xl bg-[#162235] text-lg font-black text-[#a1b5d8]",
							children: player.name.slice(0, 2).toUpperCase()
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-extrabold text-[#fffcf7] truncate",
								children: player.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-[#abb4bd] font-medium flex items-center gap-1.5 flex-wrap mt-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: player.sportFields?.["role"] || "-" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[#c2d8b9]",
										children: ["Grade ", player.category || "-"]
									}),
									player.baseValue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Base: 🪙 ", player.baseValue.toLocaleString()] })] }) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5",
								children: currentTeam ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-950/80 border border-emerald-500/50 text-emerald-300",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-emerald-400" }),
										"Currently: ",
										currentTeam.name,
										" ",
										player.soldPrice ? `(🪙 ${player.soldPrice.toLocaleString()})` : ""
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#162235] border border-[#4365a0] text-[#a1b5d8]",
									children: "Currently Available / Unsold"
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4 mt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
								children: ["Select Team ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-400",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedTeamId,
								onValueChange: setSelectedTeamId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-11 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#38bdf8]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Team" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
									className: "rounded-2xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7] max-h-64",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-amber-300 font-bold",
										children: "⭕ None (Unassigned / Mark Available)"
									}), teams.map((t) => {
										const stats = computeTeamStats(t, players, auction);
										const isFull = stats.reservedPlayers <= 0 && t.id !== player.teamId;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: t.id,
											disabled: isFull,
											className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7] cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between w-full gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold truncate",
													children: t.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-[#abb4bd] shrink-0 font-medium",
													children: isFull ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-400 font-bold",
														children: "(Full)"
													}) : `${stats.totalPlayers}/${auction.playersPerTeam} players · 🪙 ${formatPoints(stats.availablePoints)}`
												})]
											})
										}, t.id);
									})]
								})]
							})]
						}),
						selectedTeamId !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "changeTeamSoldPrice",
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: ["Sold Price (Points) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-400",
											children: "*"
										})]
									}), targetTeamStats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-[#38bdf8] font-bold",
										children: ["Max: 🪙 ", targetTeamStats.maxBidPoints.toLocaleString()]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "changeTeamSoldPrice",
									type: "number",
									min: auction.minimumBid,
									placeholder: `e.g. ${auction.minimumBid}`,
									value: soldPrice,
									onChange: (e) => setSoldPrice(e.target.value),
									disabled: isUpdating,
									className: "h-11 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] font-bold text-base focus-visible:ring-[#38bdf8]"
								}),
								priceError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-semibold text-rose-400 flex items-center gap-1 mt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3.5 shrink-0" }),
										" ",
										priceError
									]
								}) : targetTeamStats ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[11px] text-[#abb4bd] font-medium pt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Min bid: 🪙 ", auction.minimumBid.toLocaleString()] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Purse left: 🪙 ", targetTeamStats.availablePoints.toLocaleString()] })]
								}) : null
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0 mt-0.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Setting to ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "None" }),
								" will remove ",
								player.name,
								" from their team and return them to the available pool. Any points spent will be refunded to the team."
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2.5 pt-3 border-t border-[#5c6875]/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => onOpenChange(false),
								disabled: isUpdating,
								className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/50 text-[#fffcf7] hover:bg-[#2e343a] font-bold h-10 px-5",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: isUpdating || selectedTeamId !== "none" && !!priceError,
								className: "rounded-xl px-6 h-10 font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:scale-105 transition-all border border-white/30",
								children: isUpdating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Updating..."] }) : "Update Team"
							})]
						})
					]
				})
			]
		})
	});
}
function exportAuctionPDF(auction, players, teams) {
	const doc = new import_jspdf_node_min.default({
		orientation: "portrait",
		unit: "mm",
		format: "a4"
	});
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const margin = 14;
	const contentWidth = pageWidth - 28;
	const soldPlayers = players.filter((p) => p.auctionRoundStatus === "sold" || p.teamId && (p.soldPrice ?? 0) > 0);
	const unsoldPlayers = players.filter((p) => p.auctionRoundStatus === "unsold" || !p.teamId && p.auctionRoundStatus !== "pending");
	const pendingPlayers = players.filter((p) => p.auctionRoundStatus === "pending" && !p.teamId);
	const totalTurnover = soldPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
	doc.setFillColor(23, 26, 29);
	doc.rect(0, 0, pageWidth, 42, "F");
	doc.setFillColor(161, 181, 216);
	doc.rect(0, 41, pageWidth, 1.5, "F");
	doc.setFont("helvetica", "bold");
	doc.setFontSize(18);
	doc.setTextColor(255, 252, 247);
	doc.text(auction.name.toUpperCase(), margin, 15);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.setTextColor(171, 180, 189);
	doc.text(`OFFICIAL AUCTION SUMMARY REPORT • ${auction.sportType?.toUpperCase() || "SPORTS"}`, margin, 22);
	const dateStr = format(/* @__PURE__ */ new Date(), "dd MMM yyyy, hh:mm a");
	doc.setFontSize(8.5);
	doc.text(`Generated: ${dateStr}`, margin, 28);
	doc.setFillColor(35, 52, 29);
	doc.roundedRect(pageWidth - margin - 35, 10, 35, 12, 2, 2, "F");
	doc.setFont("helvetica", "bold");
	doc.setFontSize(8.5);
	doc.setTextColor(194, 216, 185);
	doc.text("STATUS: COMPLETED", pageWidth - margin - 33, 17);
	let startY = 48;
	const statBoxes = [
		{
			label: "TOTAL PLAYERS",
			val: `${players.length}`
		},
		{
			label: "SOLD PLAYERS",
			val: `${soldPlayers.length}`
		},
		{
			label: "UNSOLD PLAYERS",
			val: `${unsoldPlayers.length}`
		},
		{
			label: "AVAILABLE / PENDING",
			val: `${pendingPlayers.length}`
		},
		{
			label: "TOTAL SPENT",
			val: `${totalTurnover.toLocaleString()}`
		}
	];
	const boxWidth = contentWidth / statBoxes.length;
	statBoxes.forEach((box, i) => {
		const x = margin + i * boxWidth;
		doc.setFillColor(245, 247, 250);
		doc.setDrawColor(220, 226, 235);
		doc.roundedRect(x, startY, boxWidth - 2, 16, 1.5, 1.5, "FD");
		doc.setFont("helvetica", "bold");
		doc.setFontSize(7);
		doc.setTextColor(92, 104, 117);
		doc.text(box.label, x + 3, startY + 5);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(10.5);
		doc.setTextColor(23, 26, 29);
		doc.text(box.val, x + 3, startY + 12);
	});
	startY += 22;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(13);
	doc.setTextColor(23, 26, 29);
	doc.text("TEAM SQUADS & PURCHASE BREAKDOWN", margin, startY);
	startY += 4;
	teams.forEach((team) => {
		const teamSoldPlayers = players.filter((p) => p.teamId === team.id && (p.auctionRoundStatus === "sold" || (p.soldPrice ?? 0) > 0));
		const teamTotalSpent = teamSoldPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
		const remainingPurse = (auction.pointsPerTeam || 0) - teamTotalSpent;
		if (startY > pageHeight - 50) {
			doc.addPage();
			startY = 18;
		}
		doc.setFillColor(23, 34, 53);
		doc.roundedRect(margin, startY, contentWidth, 10, 1.5, 1.5, "F");
		doc.setFont("helvetica", "bold");
		doc.setFontSize(10.5);
		doc.setTextColor(255, 255, 255);
		doc.text(`${team.name.toUpperCase()} (${team.shortName || "-"})`, 18, startY + 6.5);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8.5);
		doc.setTextColor(194, 216, 185);
		const ownerInfo = team.ownerName ? `Owner: ${team.ownerName}  |  ` : "";
		const spendInfo = `Bought: ${teamSoldPlayers.length}  |  Spent: ${teamTotalSpent.toLocaleString()} pts  |  Remaining: ${Math.max(0, remainingPurse).toLocaleString()} pts`;
		doc.text(ownerInfo + spendInfo, pageWidth - margin - 4, startY + 6.5, { align: "right" });
		startY += 12;
		if (teamSoldPlayers.length === 0) {
			doc.setFont("helvetica", "italic");
			doc.setFontSize(8.5);
			doc.setTextColor(120, 130, 140);
			doc.text("No players acquired in this auction.", 18, startY + 3);
			startY += 8;
		} else {
			const tableRows = teamSoldPlayers.map((p, idx) => {
				const sNo = players.findIndex((x) => x.id === p.id) + 1;
				const pNum = sNo > 0 ? `${sNo}` : `${idx + 1}`;
				const gender = p.gender ? p.gender.trim().toLowerCase().startsWith("m") ? "Male" : p.gender.trim().toLowerCase().startsWith("f") || p.gender.trim().toLowerCase().startsWith("w") ? "Female" : p.gender : "-";
				const jersey = p.jerseySize ? `${p.jerseySize}${p.jerseyName ? ` (${p.jerseyName})` : ""}` : p.jerseyName || "-";
				const mobile = p.phone || "-";
				const sold = p.soldPrice ? `${p.soldPrice.toLocaleString()} pts` : "0 pts";
				return [
					pNum,
					p.name,
					gender,
					jersey,
					mobile,
					sold
				];
			});
			autoTable(doc, {
				startY,
				head: [[
					"S.No",
					"Name",
					"Gender",
					"Jersey",
					"Mobile No",
					"Sold Price"
				]],
				body: tableRows,
				margin: {
					left: margin,
					right: margin
				},
				theme: "striped",
				headStyles: {
					fillColor: [
						67,
						101,
						160
					],
					textColor: [
						255,
						255,
						255
					],
					fontSize: 8,
					fontStyle: "bold",
					halign: "left"
				},
				bodyStyles: {
					fontSize: 8,
					textColor: [
						30,
						35,
						42
					]
				},
				columnStyles: {
					0: {
						cellWidth: 15,
						halign: "center"
					},
					1: {
						cellWidth: "auto",
						fontStyle: "bold"
					},
					2: { cellWidth: 22 },
					3: { cellWidth: 28 },
					4: { cellWidth: 32 },
					5: {
						cellWidth: 30,
						halign: "right",
						fontStyle: "bold",
						textColor: [
							35,
							80,
							30
						]
					}
				},
				alternateRowStyles: { fillColor: [
					248,
					250,
					252
				] },
				didDrawPage: (data) => {
					startY = data.cursor?.y ? data.cursor.y + 6 : startY + 6;
				}
			});
			startY = doc.lastAutoTable.finalY + 6;
		}
	});
	if (unsoldPlayers.length > 0) {
		if (startY > pageHeight - 50) {
			doc.addPage();
			startY = 18;
		} else startY += 4;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(12);
		doc.setTextColor(139, 38, 53);
		doc.text(`UNSOLD PLAYERS (${unsoldPlayers.length})`, margin, startY);
		startY += 4;
		const unsoldRows = unsoldPlayers.map((p, idx) => {
			const sNo = players.findIndex((x) => x.id === p.id) + 1;
			const pNum = sNo > 0 ? `${sNo}` : `${idx + 1}`;
			const gender = p.gender ? p.gender.trim().toLowerCase().startsWith("m") ? "Male" : p.gender.trim().toLowerCase().startsWith("f") || p.gender.trim().toLowerCase().startsWith("w") ? "Female" : p.gender : "-";
			const jersey = p.jerseySize ? `${p.jerseySize}${p.jerseyName ? ` (${p.jerseyName})` : ""}` : p.jerseyName || "-";
			const mobile = p.phone || "-";
			return [
				pNum,
				p.name,
				gender,
				jersey,
				mobile,
				"UNSOLD"
			];
		});
		autoTable(doc, {
			startY,
			head: [[
				"S.No",
				"Name",
				"Gender",
				"Jersey",
				"Mobile No",
				"Sold Price"
			]],
			body: unsoldRows,
			margin: {
				left: margin,
				right: margin
			},
			theme: "striped",
			headStyles: {
				fillColor: [
					139,
					38,
					53
				],
				textColor: [
					255,
					255,
					255
				],
				fontSize: 8,
				fontStyle: "bold"
			},
			bodyStyles: {
				fontSize: 8,
				textColor: [
					30,
					35,
					42
				]
			},
			columnStyles: {
				0: {
					cellWidth: 15,
					halign: "center"
				},
				1: {
					cellWidth: "auto",
					fontStyle: "bold"
				},
				2: { cellWidth: 22 },
				3: { cellWidth: 28 },
				4: { cellWidth: 32 },
				5: {
					cellWidth: 30,
					halign: "center",
					fontStyle: "bold",
					textColor: [
						180,
						40,
						50
					]
				}
			},
			alternateRowStyles: { fillColor: [
				255,
				245,
				245
			] }
		});
	}
	const totalPages = doc.internal.getNumberOfPages();
	for (let i = 1; i <= totalPages; i++) {
		doc.setPage(i);
		doc.setDrawColor(220, 226, 235);
		doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(7.5);
		doc.setTextColor(140, 150, 160);
		doc.text(`${auction.name} • Official Auction Report`, margin, pageHeight - 6);
		doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: "right" });
	}
	const sanitizedName = auction.name.replace(/[^a-zA-Z0-9]/g, "_");
	const fileDate = format(/* @__PURE__ */ new Date(), "yyyyMMdd_HHmm");
	doc.save(`${sanitizedName}_Auction_Report_${fileDate}.pdf`);
}
//#endregion
export { useTeams as a, formatPoints as i, computeTeamStats as n, exportAuctionPDF as r, ChangePlayerTeamModal as t };
