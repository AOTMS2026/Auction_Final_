import { o as __toESM } from "../_runtime.mjs";
import { r as cn } from "./auth-client-0cXNnUku.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Pencil, C as Search, D as Plus, J as Gavel, Ot as ArrowLeft, T as RefreshCw, U as Landmark, Z as FileText, bt as Check, c as Undo2, et as Eye, ft as CircleCheckBig, gt as ChevronUp, h as SquareMousePointer, i as Users, j as Minus, n as X, v as Shuffle, w as RotateCcw, yt as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as Skeleton } from "./skeleton-CFtqm2zk.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
import { t as FallbackImage } from "./fallback-image-CwnNUhIA.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
import { t as Input } from "./input-BifiwAc8.mjs";
import { s as usePlayers } from "./select-CBTHEQ7z.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C2cO245r.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useTeams, i as formatPoints, n as computeTeamStats, r as exportAuctionPDF, t as ChangePlayerTeamModal } from "./pdf-export-d54OVmg_.mjs";
import { t as SPORT_CONFIGS } from "./player-CH8bdjpo.mjs";
import { t as useRealtimeUpdates } from "./useRealtimeUpdates--HEqg2nB.mjs";
import { t as Route } from "./my-auctions._id.auctioneer-D9apJimA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-auctions._id.auctioneer-B83kzvVh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CurrentPlayerCard({ player, lotNumber, sNo, sportType, currentBid, minBid, onBidChange, onClear, mode }) {
	const [editingBid, setEditingBid] = (0, import_react.useState)(false);
	const [tempBid, setTempBid] = (0, import_react.useState)(currentBid.toString());
	(0, import_react.useEffect)(() => {
		setTempBid(currentBid.toString());
	}, [currentBid]);
	const config = SPORT_CONFIGS[sportType] || SPORT_CONFIGS["cricket"];
	[player.sportFields?.["role"], ...config.specs.map((s) => player.sportFields?.[s])].filter((v) => typeof v === "string" && v.trim().length > 0);
	const statsLine = config.stats.map((stat) => `${stat[0]}: ${player.sportFields?.[stat] ?? 0}`).join("  |  ");
	const playerNumber = player.phone.startsWith("90000000") ? parseInt(player.phone.slice(8)) : null;
	const displaySNo = sNo ?? playerNumber;
	const handleConfirmBid = () => {
		const val = parseFloat(tempBid);
		if (Number.isFinite(val)) onBidChange(minBid !== void 0 ? Math.max(minBid, val) : Math.max(0, val));
		setEditingBid(false);
	};
	const handleCancelBid = () => {
		setTempBid(currentBid.toString());
		setEditingBid(false);
	};
	const handleStepBid = (delta) => {
		const current = parseFloat(tempBid) || currentBid;
		const nextVal = minBid !== void 0 ? Math.max(minBid, current + delta) : Math.max(0, current + delta);
		setTempBid(nextVal.toString());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a34]/95 backdrop-blur-xl p-4 md:p-6 shadow-[0_15px_45px_rgba(15,35,45,0.85)] flex flex-col md:flex-row gap-6 md:gap-8 h-full overflow-hidden select-none text-[#ffffff]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full md:w-72 lg:w-96 xl:w-[420px] shrink-0 flex flex-col justify-between h-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 min-h-0 w-full overflow-hidden rounded-2xl border-2 border-[#38bdf8]/60 shadow-2xl bg-[#142630]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
						src: player.photo || "",
						alt: player.name,
						className: "size-full object-cover object-top animate-fade-in",
						fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "display grid size-full place-items-center bg-[#142630] text-5xl sm:text-6xl font-black text-[#38bdf8]",
							children: player.name.slice(0, 2).toUpperCase()
						})
					}),
					mode === "trial" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "-rotate-12 rounded-2xl border-2 border-[#38bdf8] bg-[#142630]/95 px-5 py-2 text-sm font-black uppercase tracking-widest text-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.6)]",
							children: "🧪 Test / Trial Mode"
						})
					}),
					mode === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-3 right-3 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/90 border-2 border-white text-white text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-white" }), "LIVE"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-2 w-full shrink-0 select-none",
				children: [player.age != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 rounded-xl bg-[#142630] border-2 border-[#38bdf8]/40 text-[#ffffff] px-3 py-2 text-center text-sm sm:text-base font-black shadow-sm",
					children: [player.age, " Years"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 rounded-xl bg-[#142630] border-2 border-[#38bdf8]/40 text-[#38bdf8] px-3 py-2 text-center text-sm sm:text-base font-black shadow-sm",
					children: (() => {
						const g = player.gender?.trim().toLowerCase();
						if (!g) return "Gender: -";
						if (g === "m" || g === "male") return "Gender: Male";
						if (g === "f" || g === "w" || g === "female" || g === "woman" || g === "women") return "Gender: Female";
						return `Gender: ${g.charAt(0).toUpperCase() + g.slice(1)}`;
					})()
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 min-w-0 flex flex-col justify-between h-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 sm:space-y-5 flex-1 flex flex-col justify-center overflow-y-auto pr-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1 text-center md:text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl sm:text-4xl lg:text-5xl font-black text-[#38bdf8] uppercase tracking-wide drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]",
							children: displaySNo ? `S.No #${displaySNo}` : `Player Lot #${lotNumber}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl sm:text-4xl lg:text-5xl font-black text-[#ffffff] leading-tight uppercase tracking-tight drop-shadow-md",
							children: player.name
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center md:justify-start gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] px-4 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base md:text-lg font-black text-white shadow-[0_0_18px_rgba(249,115,22,0.55)] border border-white/30",
								children: player.sportFields?.["role"] || "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-xl bg-[#142630] border-2 border-[#38bdf8]/60 text-[#38bdf8] px-4 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base md:text-lg font-black shadow-md",
								children: ["Grade ", player.category || "-"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-xl bg-orange-950/80 border-2 border-orange-500/60 text-orange-300 px-4 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base md:text-lg font-black shadow-[0_0_15px_rgba(249,115,22,0.3)]",
								children: ["Level ", player.playerLevel ? `- ${player.playerLevel}` : "-"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-xl bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-300 px-4 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base md:text-lg font-black shadow-md",
								children: ["City: ", player.city ? player.city.charAt(0).toUpperCase() + player.city.slice(1) : "-"]
							}),
							config.specs.map((spec) => player.sportFields?.[spec]).filter((v) => typeof v === "string" && v.trim().length > 0).filter((val) => !player.customData || !player.customData.includes(val)).map((val) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-xl bg-[#142630] border-2 border-[#38bdf8]/30 px-4 py-2 sm:px-5 sm:py-2.5 text-center text-sm sm:text-base md:text-lg font-black text-[#f2e9dc] shadow-md",
								children: val
							}, val))
						]
					}),
					statsLine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-[#142630]/90 border-2 border-[#38bdf8]/30 px-5 py-2.5 sm:px-6 sm:py-3 text-base sm:text-lg md:text-xl font-black text-[#ffffff] tracking-wide leading-normal shadow-sm",
						children: statsLine
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-center md:justify-start gap-3 sm:gap-4 border-t border-[#38bdf8]/30 pt-4 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-11 sm:size-13 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] p-0.5 sm:p-1 shadow-[0_0_18px_rgba(245,158,11,0.5)] border-2 border-[#fef08a]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-full items-center justify-center rounded-full border border-[#b45309] bg-gradient-to-b from-[#fbbf24] to-[#d97706]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-5 sm:size-6 text-[#78350f] stroke-[2.5]" })
					})
				}), editingBid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center rounded-full border-2 border-[#f97316] bg-[#0c1820] px-4 sm:px-6 py-1.5 sm:py-2 shadow-[0_0_25px_rgba(249,115,22,0.4)] ring-2 ring-[#f97316]/20 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: minBid ?? 0,
							autoFocus: true,
							value: tempBid,
							onChange: (e) => setTempBid(e.target.value),
							className: "w-32 sm:w-44 lg:w-52 text-center text-3xl sm:text-4xl lg:text-5xl font-black text-[#f97316] bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none leading-none tracking-tight",
							onKeyDown: (e) => {
								if (e.key === "Enter") handleConfirmBid();
								if (e.key === "Escape") handleCancelBid();
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center ml-1.5 text-[#38bdf8]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleStepBid(100),
								"aria-label": "Increase bid",
								className: "text-[#38bdf8] hover:text-[#ffffff] hover:scale-125 transition-transform p-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4 sm:size-5 stroke-[3]" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleStepBid(-100),
								"aria-label": "Decrease bid",
								className: "text-[#38bdf8] hover:text-[#ffffff] hover:scale-125 transition-transform p-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 sm:size-5 stroke-[3]" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleConfirmBid,
						"aria-label": "Confirm bid",
						className: "flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-6 sm:size-7 stroke-[3]" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleCancelBid,
						"aria-label": "Cancel editing",
						className: "flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-[#142630] border-2 border-[#38bdf8]/35 text-[#abb4bd] hover:text-white hover:border-[#38bdf8] hover:bg-[#1a3a4a] shadow-md hover:scale-105 active:scale-95 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6 sm:size-7 stroke-[2.5]" })
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-5xl sm:text-6xl lg:text-7xl font-black text-[#38bdf8] tracking-tight leading-none drop-shadow-[0_0_22px_rgba(56,189,248,0.5)]",
					children: currentBid.toLocaleString()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 ml-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setTempBid(currentBid.toString());
							setEditingBid(true);
						},
						"aria-label": "Edit bid amount",
						className: "text-[#38bdf8] hover:text-[#ffffff] p-2 hover:bg-[#1a3a4a] rounded-xl transition-all border-2 border-[#38bdf8]/40 hover:border-[#38bdf8]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-5 sm:size-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClear,
						"aria-label": "Reset bid amount",
						className: "text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 p-2 rounded-xl transition-all border-2 border-rose-500/40 hover:border-rose-500",
						title: "Reset to base price",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-5 sm:size-6" })
					})]
				})] })]
			})]
		})]
	});
}
function TeamBidCard({ team, stats, selected, onSelect, onViewPlayers, draggable, onDragStart, onDragOver, onDragEnter, onDragLeave, onDragEnd, onDrop, isDragging, isDragOver }) {
	const isFull = stats.reservedPlayers <= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: () => {
			if (!isFull) onSelect();
		},
		draggable,
		onDragStart,
		onDragOver,
		onDragEnter,
		onDragLeave,
		onDragEnd,
		onDrop,
		className: cn("relative flex w-full items-center gap-2.5 rounded-2xl border-2 p-2 sm:p-2.5 text-left transition-all shadow-sm select-none", draggable && "cursor-grab active:cursor-grabbing", isFull ? "border-[#38bdf8]/15 bg-[#142630]/40 opacity-40 cursor-not-allowed" : selected ? "border-[#38bdf8] bg-[#1a3a4a] text-[#ffffff] ring-2 ring-[#38bdf8]/50 shadow-[0_0_20px_rgba(56,189,248,0.4)] cursor-pointer scale-[1.02]" : "border-[#38bdf8]/30 bg-[#162a34]/90 text-[#ffffff] hover:border-[#38bdf8]/80 hover:bg-[#1a3a4a]/80 cursor-pointer", isDragging && "opacity-30 border-dashed border-[#38bdf8] scale-95", isDragOver && "border-[#38bdf8] border-2 scale-[1.03] bg-[#1e4456]/40 shadow-lg ring-2 ring-[#38bdf8]/40"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-9 sm:size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#142630] border-2 border-[#38bdf8]/50 shadow-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
					src: team.logo || "",
					alt: team.name,
					className: "size-full object-cover",
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-black text-[#38bdf8]",
						children: team.shortName.slice(0, 3)
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 pr-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs sm:text-sm font-black text-[#ffffff] leading-tight drop-shadow-sm",
						children: team.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-xs font-bold text-[#38bdf8] truncate",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-black text-emerald-400",
								children: ["🪙 ", formatPoints(stats.availablePoints)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#38bdf8]/40 font-normal",
								children: "•"
							}),
							isFull ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-black text-rose-400",
								children: "Full"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[#f2e9dc]/80",
								children: ["Max: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-black text-emerald-400",
									children: formatPoints(stats.maxBidPoints)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 mt-0.5 text-[9px] sm:text-[10px] font-bold text-[#f2e9dc]/70 truncate",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Sold: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#ffffff] font-black",
								children: stats.totalPlayers
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#38bdf8]/40 font-normal",
								children: "•"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Left: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#f97316] font-black",
								children: stats.reservedPlayers
							})] })
						]
					})
				]
			}),
			onViewPlayers && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					onViewPlayers();
				},
				className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#abb4bd] hover:bg-[#2e343a] hover:text-[#fffcf7] border border-transparent hover:border-[#5c6875]/40 transition-colors",
				"aria-label": "View sold players",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" })
			})
		]
	});
}
function AuctioneerConsole() {
	const { auction } = Route.useLoaderData();
	const { mode: modeParam } = Route.useSearch();
	const mode = modeParam ?? (auction.status === "live" ? "live" : "trial");
	useRealtimeUpdates(auction.id);
	const { teams, isPending: teamsPending } = useTeams(auction.id);
	const { players, isPending: playersPending, updatePlayer, refetch: refetchPlayers } = usePlayers(auction.id);
	const [currentPlayerId, setCurrentPlayerId] = (0, import_react.useState)(null);
	const [currentBid, setCurrentBid] = (0, import_react.useState)(auction.minimumBid);
	const [selectedTeamId, setSelectedTeamId] = (0, import_react.useState)(null);
	const [selectionMode, setSelectionMode] = (0, import_react.useState)("random");
	const [pickerOpen, setPickerOpen] = (0, import_react.useState)(false);
	const [pickerQuery, setPickerQuery] = (0, import_react.useState)("");
	const [trialOverrides, setTrialOverrides] = (0, import_react.useState)({});
	const [shuffledIds, setShuffledIds] = (0, import_react.useState)([]);
	const [replacedPlayerId, setReplacedPlayerId] = (0, import_react.useState)(null);
	const [viewingTeamId, setViewingTeamId] = (0, import_react.useState)(null);
	const [hasPromptedReset, setHasPromptedReset] = (0, import_react.useState)(false);
	const [lastSoldTeamId, setLastSoldTeamId] = (0, import_react.useState)(null);
	const [viewingStatusList, setViewingStatusList] = (0, import_react.useState)(null);
	const [actionHistory, setActionHistory] = (0, import_react.useState)([]);
	const [orderedTeams, setOrderedTeams] = (0, import_react.useState)([]);
	const [draggedIndex, setDraggedIndex] = (0, import_react.useState)(null);
	const [dragOverIndex, setDragOverIndex] = (0, import_react.useState)(null);
	const [editingSoldPlayerId, setEditingSoldPlayerId] = (0, import_react.useState)(null);
	const [editingSoldAmount, setEditingSoldAmount] = (0, import_react.useState)("");
	const [changeTeamPlayer, setChangeTeamPlayer] = (0, import_react.useState)(null);
	const [pickerTab, setPickerTab] = (0, import_react.useState)("pending");
	const [isRepeatingUnsold, setIsRepeatingUnsold] = (0, import_react.useState)(false);
	async function handleSaveSoldPrice(playerId, playerName) {
		const val = parseFloat(editingSoldAmount);
		if (!Number.isFinite(val) || val < 0) {
			toast.error("Please enter a valid amount.");
			return;
		}
		const currentTeamId = effectivePlayers.find((p) => p.id === playerId)?.teamId ?? viewingTeamId;
		setTrialOverrides((prev) => ({
			...prev,
			[playerId]: {
				...prev[playerId],
				soldPrice: val,
				teamId: currentTeamId,
				auctionRoundStatus: "sold"
			}
		}));
		if (mode === "live") try {
			await updatePlayer({
				id: playerId,
				patch: { soldPrice: val }
			});
			toast.success(`Updated ${playerName}'s sold price to 🪙 ${val.toLocaleString()}`);
		} catch {
			toast.error("Failed to update sold price in database.");
		}
		else toast.success(`Updated ${playerName}'s sold price to 🪙 ${val.toLocaleString()}`);
		setEditingSoldPlayerId(null);
	}
	async function handleRepeatSinglePlayer(targetPlayer) {
		setTrialOverrides((prev) => {
			const next = { ...prev };
			delete next[targetPlayer.id];
			return next;
		});
		if (mode === "live") {
			const toastId = toast.loading(`Repeating ${targetPlayer.name} back to auction...`);
			try {
				await updatePlayer({
					id: targetPlayer.id,
					patch: {
						auctionRoundStatus: "pending",
						teamId: null,
						soldPrice: null
					}
				});
				toast.success(`${targetPlayer.name} is back on the auction block!`, { id: toastId });
			} catch (err) {
				toast.error(err?.message || "Failed to repeat player in database.", { id: toastId });
				return;
			}
		} else toast.success(`${targetPlayer.name} is back on the auction block!`);
		startNewLot(targetPlayer);
		setViewingStatusList(null);
		setPickerOpen(false);
		setSelectionMode("manual");
		reshuffleQueue(targetPlayer.id);
	}
	async function handleRepeatAllUnsold() {
		const unsoldList = effectivePlayers.filter((p) => effectiveStatus(p) === "unsold");
		if (unsoldList.length === 0) {
			toast.info("No unsold players to repeat.");
			return;
		}
		const count = unsoldList.length;
		setIsRepeatingUnsold(true);
		if (mode === "live") {
			const toastId = toast.loading(`Repeating all ${count} unsold players...`);
			try {
				await auctionClient.repeatUnsoldPlayers(auction.id);
				await refetchPlayers();
				toast.success(`All ${count} unsold players returned to the auction pool!`, { id: toastId });
			} catch (err) {
				toast.error(err?.message || "Failed to repeat unsold players in database.", { id: toastId });
				setIsRepeatingUnsold(false);
				return;
			}
		} else {
			setTrialOverrides((prev) => {
				const next = { ...prev };
				for (const [id, ov] of Object.entries(next)) if (ov.auctionRoundStatus === "unsold") delete next[id];
				return next;
			});
			toast.success(`All ${count} unsold players returned to the auction pool!`);
		}
		setIsRepeatingUnsold(false);
		setViewingStatusList(null);
		if (!currentPlayer) {
			const first = unsoldList[0];
			if (first) {
				startNewLot(first);
				reshuffleQueue(first.id);
			}
		} else reshuffleQueue();
	}
	(0, import_react.useEffect)(() => {
		if (teams && teams.length > 0) {
			const storedOrder = localStorage.getItem(`auctioneer-teams-order-${auction.id}`);
			if (storedOrder) try {
				const orderedIds = JSON.parse(storedOrder);
				const existingTeamsMap = new Map(teams.map((t) => [t.id, t]));
				const reordered = [];
				orderedIds.forEach((id) => {
					const team = existingTeamsMap.get(id);
					if (team) {
						reordered.push(team);
						existingTeamsMap.delete(id);
					}
				});
				existingTeamsMap.forEach((team) => {
					reordered.push(team);
				});
				setOrderedTeams(reordered);
				return;
			} catch (e) {
				console.error("Error parsing stored teams order", e);
			}
			setOrderedTeams(teams);
		} else setOrderedTeams([]);
	}, [teams, auction.id]);
	const handleReorder = (fromIndex, toIndex) => {
		const fromTeam = orderedTeams[fromIndex];
		const toTeam = orderedTeams[toIndex];
		if (!fromTeam || !toTeam || fromIndex === toIndex) return;
		const newOrder = [...orderedTeams];
		newOrder[fromIndex] = toTeam;
		newOrder[toIndex] = fromTeam;
		setOrderedTeams(newOrder);
		localStorage.setItem(`auctioneer-teams-order-${auction.id}`, JSON.stringify(newOrder.map((t) => t.id)));
	};
	async function handleUndoLatestStep() {
		let targetPlayerId = null;
		if (actionHistory.length > 0) targetPlayerId = actionHistory[actionHistory.length - 1] ?? null;
		else {
			const nonPending = effectivePlayers.filter((p) => effectiveStatus(p) === "sold" || effectiveStatus(p) === "unsold");
			if (nonPending.length > 0) targetPlayerId = [...nonPending].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]?.id ?? null;
		}
		if (!targetPlayerId) {
			toast.info("No actions to undo.");
			return;
		}
		const playerToUndo = effectivePlayers.find((p) => p.id === targetPlayerId);
		if (!playerToUndo) {
			toast.error("Player not found for undo.");
			return;
		}
		const previousTeamId = playerToUndo.teamId;
		const previousSoldPrice = playerToUndo.soldPrice;
		setTrialOverrides((prev) => {
			const next = { ...prev };
			delete next[targetPlayerId];
			return next;
		});
		if (mode === "live") {
			const toastId = toast.loading(`Undoing last action for ${playerToUndo.name}...`);
			try {
				await updatePlayer({
					id: targetPlayerId,
					patch: {
						teamId: null,
						soldPrice: null,
						auctionRoundStatus: "pending"
					}
				});
				toast.success(`Undid last action. ${playerToUndo.name} is now pending.`, { id: toastId });
			} catch (error) {
				toast.error("Failed to undo last action in database.", { id: toastId });
				return;
			}
		} else toast.success(`Undid last action. ${playerToUndo.name} is now pending.`);
		setCurrentPlayerId(targetPlayerId);
		setSelectedTeamId(previousTeamId);
		setCurrentBid(previousSoldPrice ?? auction.minimumBid);
		setActionHistory((prev) => prev.slice(0, -1));
	}
	async function handleResetAllPlayers() {
		setCurrentPlayerId(null);
		setSelectedTeamId(null);
		setLastSoldTeamId(null);
		setCurrentBid(auction.minimumBid);
		setSelectionMode("random");
		setActionHistory([]);
		setShuffledIds([]);
		setReplacedPlayerId(null);
		setTrialOverrides({});
		if (mode === "live") {
			const soldOrUnsold = players.filter((p) => p.auctionRoundStatus === "sold" || p.auctionRoundStatus === "unsold");
			if (soldOrUnsold.length > 0) {
				const toastId = toast.loading("Resetting all players back to pending in database...");
				try {
					await Promise.all(soldOrUnsold.map((p) => updatePlayer({
						id: p.id,
						patch: {
							teamId: null,
							soldPrice: null,
							auctionRoundStatus: "pending"
						}
					})));
					toast.success("Auction reset successfully! All players are now pending.", { id: toastId });
				} catch (error) {
					toast.error("Failed to reset some players in database.", { id: toastId });
				}
			} else toast.success("Auction reset! All selection states cleared.");
		} else toast.success("Trial session cleared successfully!");
	}
	function handleTeamSelect(teamId) {
		if (selectedTeamId === teamId) return;
		setSelectedTeamId(teamId);
	}
	(0, import_react.useEffect)(() => {
		if (playersPending || currentPlayerId) return;
		const pending = players.filter((p) => effectiveStatus(p) === "pending");
		if (pending.length > 0) {
			const queue = createShuffledQueue(pending);
			const firstId = queue[0];
			const firstPlayer = players.find((p) => p.id === firstId);
			if (firstPlayer) {
				startNewLot(firstPlayer);
				setShuffledIds(queue.filter((id) => id !== firstId));
			}
		}
	}, [playersPending]);
	function getSpecialPriority(name) {
		const n = name.toLowerCase();
		if (n.includes("maddineni")) return 1;
		if (n.includes("praveen")) return 2;
		if (n.includes("mallesh")) return 3;
		if (n.includes("dileep")) return 4;
		if (/\bali\b/i.test(n) || n === "ali") return 5;
		if (n.includes("kesava")) return 6;
		if (n.includes("sundeep")) return 7;
		return Infinity;
	}
	function shuffleArray(array) {
		const copy = [...array];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = copy[i];
			copy[i] = copy[j];
			copy[j] = temp;
		}
		return copy;
	}
	function createShuffledQueue(pendingList, excludeId, deprioritizeId) {
		const pool = excludeId ? pendingList.filter((p) => p.id !== excludeId) : pendingList;
		const priorityPending = pool.filter((p) => getSpecialPriority(p.name) !== Infinity);
		const nonPriorityPending = pool.filter((p) => getSpecialPriority(p.name) === Infinity);
		const shuffledPriority = shuffleArray(priorityPending.map((p) => p.id));
		const shuffledNonPriority = shuffleArray(nonPriorityPending.map((p) => p.id));
		const combined = [...shuffledPriority, ...shuffledNonPriority];
		if (deprioritizeId && combined.length > 1 && combined[0] === deprioritizeId) {
			const swapIndex = 1 + Math.floor(Math.random() * (combined.length - 1));
			const temp = combined[0];
			combined[0] = combined[swapIndex];
			combined[swapIndex] = temp;
		}
		return combined;
	}
	function reshuffleQueue(excludeId, deprioritizeId) {
		const newQueue = createShuffledQueue(players.filter((p) => effectiveStatus(p) === "pending"), excludeId, deprioritizeId ?? replacedPlayerId);
		setShuffledIds(newQueue);
		return newQueue;
	}
	(0, import_react.useEffect)(() => {
		if (playersPending) return;
		const pending = players.filter((p) => effectiveStatus(p) === "pending");
		const pendingIdsSet = new Set(pending.map((p) => p.id));
		setShuffledIds((prev) => {
			if (prev.length === 0 && pending.length > 0) return createShuffledQueue(pending, currentPlayerId || void 0, replacedPlayerId);
			const valid = prev.filter((id) => pendingIdsSet.has(id));
			const missing = pending.filter((p) => !valid.includes(p.id) && p.id !== currentPlayerId);
			if (missing.length > 0) return [...valid, ...createShuffledQueue(missing, void 0, replacedPlayerId)];
			return valid;
		});
	}, [
		players,
		playersPending,
		mode,
		trialOverrides,
		currentPlayerId,
		replacedPlayerId
	]);
	function advanceShuffledPlayer(currentId, soldTeamId) {
		setSelectionMode("random");
		const nextPending = players.filter((p) => p.id !== currentId && effectiveStatus(p) === "pending" && trialOverrides[p.id]?.auctionRoundStatus !== "sold" && trialOverrides[p.id]?.auctionRoundStatus !== "unsold");
		const nextQueue = shuffledIds.filter((id) => id !== currentId);
		if (nextPending.length === 0) {
			setCurrentPlayerId(null);
			setSelectedTeamId(null);
			setReplacedPlayerId(null);
			const isJustUnsold = !soldTeamId;
			const remainingUnsold = players.filter((p) => {
				if (p.id === currentId) return isJustUnsold;
				return (trialOverrides[p.id]?.auctionRoundStatus ?? p.auctionRoundStatus) === "unsold";
			});
			if (remainingUnsold.length > 0) {
				setViewingStatusList("unsold");
				toast.info(`No more players available. Showing ${remainingUnsold.length} unsold player${remainingUnsold.length > 1 ? "s" : ""} to repeat again!`, { duration: 5e3 });
			} else toast.info("No more players available. All players have been auctioned!", { duration: 5e3 });
			return;
		}
		let candidateId = nextQueue.find((id) => nextPending.some((p) => p.id === id));
		if (replacedPlayerId && candidateId === replacedPlayerId && nextPending.length > 1) {
			const alternateId = nextQueue.find((id) => id !== replacedPlayerId && nextPending.some((p) => p.id === id));
			if (alternateId) candidateId = alternateId;
			else {
				const alternate = nextPending.find((p) => p.id !== replacedPlayerId);
				if (alternate) candidateId = alternate.id;
			}
		}
		let nextPlayer = candidateId ? players.find((p) => p.id === candidateId) : null;
		if (!nextPlayer) {
			const freshQueue = createShuffledQueue(nextPending, void 0, replacedPlayerId);
			const nextId = freshQueue[0];
			nextPlayer = players.find((p) => p.id === nextId) ?? null;
			setShuffledIds(freshQueue.filter((id) => id !== nextId));
		} else setShuffledIds(nextQueue.filter((id) => id !== nextPlayer.id));
		setReplacedPlayerId(null);
		if (nextPlayer) startNewLot(nextPlayer, soldTeamId);
		else {
			setCurrentPlayerId(null);
			setSelectedTeamId(null);
		}
	}
	function effectiveStatus(player) {
		return trialOverrides[player.id]?.auctionRoundStatus ?? player.auctionRoundStatus ?? "pending";
	}
	const effectivePlayers = players.map((p) => {
		const override = trialOverrides[p.id];
		return override ? {
			...p,
			teamId: override.teamId !== void 0 ? override.teamId : p.teamId,
			soldPrice: override.soldPrice !== void 0 ? override.soldPrice : p.soldPrice,
			auctionRoundStatus: override.auctionRoundStatus || p.auctionRoundStatus
		} : p;
	});
	const teamStatsMap = (0, import_react.useMemo)(() => {
		const teamSoldPlayersMap = /* @__PURE__ */ new Map();
		for (const p of effectivePlayers) if (p.teamId && (p.auctionRoundStatus === "sold" || (p.soldPrice ?? 0) > 0)) {
			const list = teamSoldPlayersMap.get(p.teamId) || [];
			list.push(p);
			teamSoldPlayersMap.set(p.teamId, list);
		}
		const map = /* @__PURE__ */ new Map();
		for (const team of teams) {
			const teamPlayers = teamSoldPlayersMap.get(team.id) || [];
			let usedPoints = 0;
			for (const p of teamPlayers) if (p.soldPrice) usedPoints += p.soldPrice;
			const totalPoints = auction.pointsPerTeam;
			const availablePoints = Math.max(0, totalPoints - usedPoints);
			const totalPlayers = teamPlayers.length;
			const reservedPlayers = Math.max(0, auction.playersPerTeam - totalPlayers);
			const maxBidPoints = reservedPlayers > 0 ? Math.min(auction.maxBid ?? 3e4, availablePoints - (reservedPlayers - 1) * auction.minimumBid) : 0;
			map.set(team.id, {
				usedPoints,
				totalPoints,
				availablePoints,
				totalPlayers,
				reservedPlayers,
				maxBidPoints: maxBidPoints > 0 ? maxBidPoints : 0
			});
		}
		return map;
	}, [
		teams,
		effectivePlayers,
		auction
	]);
	const playerSNoMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		players.forEach((p, idx) => {
			map.set(p.id, idx + 1);
		});
		return map;
	}, [players]);
	const pendingPlayers = players.filter((p) => effectiveStatus(p) === "pending");
	const soldCount = players.filter((p) => effectiveStatus(p) === "sold").length;
	const unsoldCount = players.filter((p) => effectiveStatus(p) === "unsold").length;
	const currentPlayer = players.find((p) => p.id === currentPlayerId) ?? null;
	function startNewLot(player, soldTeamId) {
		setCurrentPlayerId(player.id);
		setCurrentBid(auction.minimumBid);
		const referenceTeamId = soldTeamId !== void 0 ? soldTeamId : lastSoldTeamId;
		if (referenceTeamId && teams.length > 0) setSelectedTeamId(referenceTeamId);
		else setSelectedTeamId(null);
	}
	function handleNewPlayer() {
		if (selectionMode === "random" && currentPlayer) {
			toast.warning("A player is already on the auction block. Please mark them as Sold or Unsold first.");
			return;
		}
		const availablePending = currentPlayerId ? pendingPlayers.filter((p) => p.id !== currentPlayerId) : pendingPlayers;
		if (availablePending.length === 0) {
			if (unsoldCount > 0) {
				setViewingStatusList("unsold");
				toast.info(`No more players available. Showing ${unsoldCount} unsold player${unsoldCount > 1 ? "s" : ""} to repeat again!`, { duration: 5e3 });
				return;
			}
			toast.info("No more players available. All players have been auctioned!", { duration: 5e3 });
			return;
		}
		if (selectionMode === "random") {
			let candidateId = shuffledIds.find((id) => availablePending.some((p) => p.id === id));
			if (replacedPlayerId && candidateId === replacedPlayerId && availablePending.length > 1) {
				const alternateId = shuffledIds.find((id) => id !== replacedPlayerId && availablePending.some((p) => p.id === id));
				if (alternateId) candidateId = alternateId;
				else {
					const alternate = availablePending.find((p) => p.id !== replacedPlayerId);
					if (alternate) candidateId = alternate.id;
				}
			}
			let next = candidateId ? players.find((p) => p.id === candidateId) : null;
			if (!next) {
				const freshQueue = createShuffledQueue(availablePending, void 0, replacedPlayerId);
				const nextId = freshQueue[0];
				next = players.find((p) => p.id === nextId) ?? null;
				setShuffledIds(freshQueue.filter((id) => id !== nextId));
			} else setShuffledIds((prev) => prev.filter((id) => id !== next.id));
			setReplacedPlayerId(null);
			if (next) startNewLot(next);
		} else setPickerOpen(true);
	}
	function handleBid(direction) {
		setCurrentBid((prev) => Math.max(auction.minimumBid, prev + direction * auction.bidIncrement));
	}
	async function handleSold() {
		if (!currentPlayer) return;
		if (!selectedTeamId) {
			toast.error("Select a team first.");
			return;
		}
		const selectedTeam = teams.find((t) => t.id === selectedTeamId);
		const selectedTeamStats = teamStatsMap.get(selectedTeamId);
		if (selectedTeam && selectedTeamStats && selectedTeamStats.reservedPlayers <= 0) {
			toast.error("Max team reached");
			return;
		}
		const soldId = currentPlayer.id;
		const soldPrice = currentBid;
		const teamId = selectedTeamId;
		setTrialOverrides((prev) => ({
			...prev,
			[soldId]: {
				teamId,
				soldPrice,
				auctionRoundStatus: "sold"
			}
		}));
		if (mode === "live") updatePlayer({
			id: soldId,
			patch: {
				teamId,
				soldPrice,
				auctionRoundStatus: "sold"
			}
		}).catch((error) => {
			setTrialOverrides((prev) => {
				const next = { ...prev };
				delete next[soldId];
				return next;
			});
			toast.error(error instanceof Error ? error.message : "Failed to record sale in database.");
		});
		toast.success(`${currentPlayer.name} sold to ${selectedTeam?.name || "Team"} for 🪙 ${soldPrice.toLocaleString()}.`);
		setLastSoldTeamId(teamId);
		setActionHistory((prev) => [...prev, soldId]);
		advanceShuffledPlayer(soldId, teamId);
	}
	async function handleUnsold() {
		if (!currentPlayer) return;
		const unsoldId = currentPlayer.id;
		setTrialOverrides((prev) => ({
			...prev,
			[unsoldId]: {
				teamId: null,
				soldPrice: null,
				auctionRoundStatus: "unsold"
			}
		}));
		if (mode === "live") updatePlayer({
			id: unsoldId,
			patch: {
				teamId: null,
				soldPrice: null,
				auctionRoundStatus: "unsold"
			}
		}).catch((error) => {
			setTrialOverrides((prev) => {
				const next = { ...prev };
				delete next[unsoldId];
				return next;
			});
			toast.error(error instanceof Error ? error.message : "Failed to mark unsold in database.");
		});
		toast.info(`${currentPlayer.name} marked unsold.`);
		setActionHistory((prev) => [...prev, unsoldId]);
		advanceShuffledPlayer(unsoldId, null);
	}
	const unsoldPlayers = players.filter((p) => effectiveStatus(p) === "unsold");
	const basePickerPlayers = [...pendingPlayers.filter((p) => getSpecialPriority(p.name) !== Infinity), ...pendingPlayers.filter((p) => getSpecialPriority(p.name) === Infinity)];
	const filteredPickerPlayers = (pickerTab === "unsold" ? unsoldPlayers : pickerTab === "all" ? [...basePickerPlayers, ...unsoldPlayers] : basePickerPlayers).filter((p) => {
		const rawQuery = pickerQuery.trim().toLowerCase();
		if (!rawQuery) return true;
		const sNo = playerSNoMap.get(p.id);
		const cleanNumQuery = rawQuery.replace(/^(#|s\.?no\.?\s*#?)/i, "").trim();
		if (/^\d+$/.test(cleanNumQuery)) {
			if (sNo === parseInt(cleanNumQuery, 10)) return true;
			const name = p.name.toLowerCase();
			if (name.includes(rawQuery) || name.includes(cleanNumQuery)) return true;
			const phone = p.phone.toLowerCase();
			if (cleanNumQuery.length >= 3 && phone.includes(cleanNumQuery)) return true;
			return false;
		}
		const name = p.name.toLowerCase();
		const phone = p.phone.toLowerCase();
		const role = (p.sportFields?.["role"] || "").toLowerCase();
		const category = (p.category || "").toLowerCase();
		const city = (p.city || "").toLowerCase();
		return name.includes(rawQuery) || phone.includes(rawQuery) || role.includes(rawQuery) || category.includes(rawQuery) || city.includes(rawQuery);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-screen w-full flex-col overflow-hidden text-[#ffffff] select-none",
			style: { background: "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "h-14 shrink-0 flex items-center gap-3 border-b border-[#38bdf8]/40 bg-[#142630]/95 backdrop-blur-md px-6 text-[#ffffff]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							asChild: true,
							className: "text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#1f3a47] rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/my-auctions/$id",
								params: { id: auction.id },
								"aria-label": "Back to dashboard",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
							src: auction.coverImage || "",
							alt: "",
							className: "size-10 shrink-0 rounded-xl border-2 border-[#38bdf8]/60 object-cover shadow-sm",
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "display grid size-full place-items-center rounded-xl bg-[#162a34] text-sm font-black text-[#38bdf8] shadow-sm",
								children: auction.name.slice(0, 2).toUpperCase()
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate text-xl font-black tracking-tight text-[#ffffff] drop-shadow-sm",
							children: auction.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center",
							children: mode === "trial" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-3.5 py-1 rounded-full border-2 border-[#38bdf8] bg-[#162a34] text-[#38bdf8] text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.45)]",
								children: "🧪 Test Mode"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-3.5 py-1 rounded-full border-2 border-emerald-400 bg-emerald-950 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-1.5 animate-pulse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400" }), "🔴 Live Mode"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										exportAuctionPDF(auction, effectivePlayers, orderedTeams.length > 0 ? orderedTeams : teams);
										toast.success("Auction PDF Report downloaded!");
									},
									className: "h-9 px-3.5 rounded-xl border-2 border-[#38bdf8]/60 bg-[#162a34] text-[#ffffff] hover:bg-[#38bdf8] hover:text-[#142630] flex items-center gap-1.5 text-xs font-black transition-all shadow-sm cursor-pointer",
									title: "Download Full Auction Summary PDF",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Export PDF"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => {
										if (window.confirm("Are you sure you want to undo the latest step?")) handleUndoLatestStep();
									},
									className: "text-red-400 hover:text-red-300 hover:bg-destructive/20 rounded-xl",
									"aria-label": "Undo Latest Step",
									title: "Undo Latest Step",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => {
										if (window.confirm("Are you sure you want to reset the auction and clear all sold players?")) handleResetAllPlayers();
									},
									className: "text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] rounded-xl",
									"aria-label": "Reset Auction",
									title: "Reset Auction",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-5" })
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex-1 min-h-0 w-full px-6 py-4 flex gap-6 mx-auto max-w-[1800px] overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 h-full min-w-0",
						children: playersPending || teamsPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-full w-full rounded-3xl bg-[#2e343a]/60" }) : currentPlayer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentPlayerCard, {
							player: currentPlayer,
							lotNumber: soldCount + unsoldCount + 1,
							sNo: playerSNoMap.get(currentPlayer.id),
							sportType: auction.sportType,
							currentBid,
							minBid: auction.minimumBid,
							onBidChange: (value) => setCurrentBid(Math.max(auction.minimumBid, value)),
							onClear: () => {
								setCurrentBid(auction.minimumBid);
								setSelectedTeamId(null);
							},
							mode
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a34]/90 backdrop-blur-xl p-8 sm:p-12 text-center text-[#f2e9dc] shadow-2xl flex flex-col items-center justify-center gap-5 h-full",
							children: pendingPlayers.length === 0 && unsoldCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center max-w-lg mx-auto animate-fade-in",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] animate-pulse mb-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-10 stroke-[2.5]" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-3.5 py-1 rounded-full border border-amber-500/60 bg-amber-950/70 text-amber-300 text-xs font-black uppercase tracking-wider mb-2",
										children: "No More Players Available"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-2xl sm:text-3xl font-black text-white tracking-tight",
										children: "Repeat Unsold Players"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm sm:text-base font-semibold text-[#a1b5d8] mt-2 leading-relaxed",
										children: [
											"All regular players have been auctioned. You have ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-amber-400 font-black",
												children: [
													unsoldCount,
													" Unsold player",
													unsoldCount > 1 ? "s" : ""
												]
											}),
											" ready to repeat again for the next round."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-center gap-3 mt-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											disabled: isRepeatingUnsold,
											onClick: handleRepeatAllUnsold,
											className: "rounded-2xl px-6 py-3.5 h-auto font-black text-sm text-white bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-105 active:scale-95 transition-all border border-white/30 flex items-center gap-2 cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }),
												"Repeat All Unsold Players (",
												unsoldCount,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											onClick: () => setViewingStatusList("unsold"),
											className: "rounded-2xl px-5 py-3.5 h-auto font-bold text-sm text-[#38bdf8] border-2 border-[#38bdf8]/50 bg-[#142630] hover:bg-[#1a3847] hover:text-white transition-all cursor-pointer shadow-md flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }),
												"View Unsold List (",
												unsoldCount,
												")"
											]
										})]
									})
								]
							}) : pendingPlayers.length === 0 && soldCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center max-w-lg mx-auto animate-fade-in",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)] mb-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-10 stroke-[2.5]" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-3.5 py-1 rounded-full border border-emerald-500/60 bg-emerald-950/70 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2",
										children: "Auction Completed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-2xl sm:text-3xl font-black text-white tracking-tight",
										children: "All Players Sold!"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm sm:text-base font-semibold text-[#a1b5d8] mt-2",
										children: [
											"No more players available. All ",
											soldCount,
											" players have been successfully auctioned."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap items-center justify-center gap-3 mt-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											onClick: () => {
												exportAuctionPDF(auction, effectivePlayers, orderedTeams.length > 0 ? orderedTeams : teams);
												toast.success("Auction PDF Report downloaded!");
											},
											className: "rounded-2xl px-6 py-3.5 h-auto font-black text-sm text-white bg-[#162a34] border-2 border-[#38bdf8]/60 hover:bg-[#38bdf8] hover:text-[#142630] flex items-center gap-2 cursor-pointer shadow-md transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), " Download PDF Report"]
										})
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-black text-[#ffffff]",
								children: "Tap \"New Player\" at the bottom to begin."
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-[480px] shrink-0 flex flex-col h-full bg-[#162a34]/90 backdrop-blur-xl border-2 border-[#38bdf8]/40 rounded-3xl p-3.5 shadow-[0_15px_45px_rgba(15,35,45,0.85)] select-none overflow-hidden text-[#ffffff]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "shrink-0 border-b border-[#38bdf8]/30 pb-2 mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
								children: "Teams"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-[#f97316] font-black uppercase tracking-wider",
								children: "Bidding Team Selection"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto pr-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: orderedTeams.map((team, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBidCard, {
									team,
									stats: teamStatsMap.get(team.id) || computeTeamStats(team, effectivePlayers, auction),
									selected: selectedTeamId === team.id,
									onSelect: () => handleTeamSelect(team.id),
									onViewPlayers: () => setViewingTeamId(team.id),
									draggable: true,
									onDragStart: (e) => {
										setDraggedIndex(index);
										e.dataTransfer.effectAllowed = "move";
										e.dataTransfer.setData("text/plain", `${index}`);
									},
									onDragOver: (e) => {
										e.preventDefault();
										e.dataTransfer.dropEffect = "move";
										if (dragOverIndex !== index) setDragOverIndex(index);
									},
									onDragEnter: (e) => {
										e.preventDefault();
										if (dragOverIndex !== index) setDragOverIndex(index);
									},
									onDragLeave: (e) => {
										if (!e.currentTarget.contains(e.relatedTarget)) {
											if (dragOverIndex === index) setDragOverIndex(null);
										}
									},
									onDragEnd: () => {
										setDraggedIndex(null);
										setDragOverIndex(null);
									},
									onDrop: (e) => {
										e.preventDefault();
										const rawFrom = draggedIndex !== null ? draggedIndex : parseInt(e.dataTransfer.getData("text/plain"), 10);
										if (!isNaN(rawFrom) && rawFrom !== index) handleReorder(rawFrom, index);
										setDraggedIndex(null);
										setDragOverIndex(null);
									},
									isDragging: draggedIndex === index,
									isDragOver: dragOverIndex === index
								}, team.id))
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "shrink-0 border-t border-[#38bdf8]/40 bg-[#142630]/98 backdrop-blur-xl p-3 select-none text-[#ffffff]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-[1800px] w-full flex items-center justify-between gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 bg-[#162a34] border-2 border-[#38bdf8]/40 p-2 rounded-2xl shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-1.5 border-r border-[#38bdf8]/30 pr-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-black uppercase tracking-wider text-[#38bdf8] leading-none",
										children: "New Player Mode"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1 w-36",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setSelectionMode("random");
												reshuffleQueue(currentPlayerId || void 0);
											},
											className: cn("rounded-xl p-1.5 transition-all border flex-1 flex items-center justify-center gap-1 text-[10px] font-black cursor-pointer", selectionMode === "random" ? "bg-[#38bdf8] text-[#142630] border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.5)] font-black" : "bg-[#142630] text-[#f2e9dc]/70 border-[#38bdf8]/30 hover:bg-[#1a3847] hover:text-[#ffffff]"),
											title: "Random Selection",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-3" }), "Random"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setSelectionMode("manual");
												if (pendingPlayers.length === 0 && unsoldCount > 0) setPickerTab("unsold");
											},
											className: cn("rounded-xl p-1.5 transition-all border flex-1 flex items-center justify-center gap-1 text-[10px] font-black cursor-pointer", selectionMode === "manual" ? "bg-[#38bdf8] text-[#142630] border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.5)] font-black" : "bg-[#142630] text-[#f2e9dc]/70 border-[#38bdf8]/30 hover:bg-[#1a3847] hover:text-[#ffffff]"),
											title: "Manual Selection",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareMousePointer, { className: "size-3" }), "Manual"]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: cn("rounded-xl px-5 h-9 font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30 shrink-0", selectionMode === "random" && !!currentPlayer && "opacity-50 cursor-not-allowed"),
									disabled: selectionMode === "random" && !!currentPlayer,
									onClick: handleNewPlayer,
									children: "New Player"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 flex items-center gap-3 justify-center max-w-[680px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: "h-10 flex-1 max-w-[160px] text-xs sm:text-sm font-black rounded-xl shadow-md border-2 border-[#38bdf8]/60 bg-[#162a34] text-[#ffffff] hover:bg-[#204554] hover:border-[#38bdf8] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer",
										disabled: !currentPlayer,
										onClick: () => handleBid(1),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 text-[#38bdf8]" }), " Bid Up"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: "h-10 flex-1 max-w-[160px] text-xs sm:text-sm font-black rounded-xl shadow-md border-2 border-[#38bdf8]/60 bg-[#162a34] text-[#ffffff] hover:bg-[#204554] hover:border-[#38bdf8] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer",
										disabled: !currentPlayer,
										onClick: () => handleBid(-1),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4 text-[#38bdf8]" }), " Bid Down"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-px bg-[#38bdf8]/40 mx-1" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "h-10 flex-1 max-w-[180px] text-xs sm:text-sm font-black bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.55)] hover:scale-105 flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-white/30 cursor-pointer",
										disabled: !currentPlayer,
										onClick: handleSold,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gavel, { className: "size-4" }), " Sold"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "destructive",
										className: "h-10 flex-1 max-w-[180px] text-xs sm:text-sm font-black bg-gradient-to-r from-rose-600 via-rose-500 to-red-500 hover:from-rose-500 hover:to-red-400 text-white rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:scale-105 flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-white/30 cursor-pointer",
										disabled: !currentPlayer,
										onClick: handleUnsold,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " Unsold"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 border-l border-[#5c6875]/40 pl-4 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5 w-48 sm:w-56",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setViewingStatusList("sold"),
										className: "rounded-full bg-[#23341d]/85 hover:bg-[#23341d] h-9 px-4 text-[#c2d8b9] border border-[#47673a] active:scale-95 transition-all text-xs sm:text-sm font-black cursor-pointer text-center flex items-center justify-center shadow-sm",
										children: ["Sold ", soldCount]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setViewingStatusList("unsold"),
										className: "rounded-full bg-[#45191f]/85 hover:bg-[#45191f] h-9 px-4 text-[#fca5a5] border border-[#8b2635] active:scale-95 transition-all text-xs sm:text-sm font-black cursor-pointer text-center flex items-center justify-center shadow-sm",
										children: ["Unsold ", unsoldCount]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5 w-48 sm:w-56",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setViewingStatusList("pending"),
										className: "rounded-full bg-[#162235]/90 hover:bg-[#162235] h-9 px-4 text-[#a1b5d8] border border-[#4365a0] active:scale-95 transition-all text-xs sm:text-sm font-black cursor-pointer text-center flex items-center justify-center shadow-sm",
										children: ["Available ", pendingPlayers.length]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full bg-[#2e343a]/80 h-9 px-4 text-[#fffcf7] border border-[#5c6875]/40 select-none text-xs sm:text-sm font-black text-center flex items-center justify-center shadow-sm",
										children: ["Team ", teams.length]
									})]
								})]
							})
						]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: pickerOpen,
			onOpenChange: setPickerOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-3xl lg:max-w-4xl max-h-[88vh] flex flex-col rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#5c6875]/30 pb-3 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "text-xl sm:text-2xl font-black text-[#fffcf7] tracking-tight",
								children: ["Pick a player ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-base text-[#a1b5d8] font-bold",
									children: [
										"(",
										filteredPickerPlayers.length,
										")"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 bg-[#142630] p-1 rounded-xl border border-[#38bdf8]/30 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setPickerTab("pending"),
										className: cn("px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer", pickerTab === "pending" ? "bg-[#38bdf8] text-[#142630] font-black shadow-sm" : "text-[#abb4bd] hover:text-white"),
										children: [
											"Available (",
											pendingPlayers.length,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setPickerTab("unsold"),
										className: cn("px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer", pickerTab === "unsold" ? "bg-rose-500 text-white font-black shadow-sm" : "text-rose-400 hover:text-rose-300"),
										children: [
											"Unsold (",
											unsoldCount,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setPickerTab("all"),
										className: cn("px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer", pickerTab === "all" ? "bg-[#2e343a] text-white font-black shadow-sm" : "text-[#abb4bd] hover:text-white"),
										children: [
											"All (",
											pendingPlayers.length + unsoldCount,
											")"
										]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-2 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#abb4bd]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search by player name, number, or role...",
							value: pickerQuery,
							onChange: (e) => setPickerQuery(e.target.value),
							className: "pl-10 h-10 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/60 focus-visible:ring-[#a1b5d8]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto mt-2 pr-1 min-h-[300px] max-h-[65vh]",
						children: filteredPickerPlayers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col items-center justify-center min-h-[250px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-[#abb4bd] font-bold",
								children: pickerTab === "unsold" ? "No unsold players found." : pickerTab === "pending" ? "No available players found." : "No players found."
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-1.5",
							children: filteredPickerPlayers.map((p) => {
								const sNo = playerSNoMap.get(p.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										if (effectiveStatus(p) === "unsold") {
											handleRepeatSinglePlayer(p);
											return;
										}
										const previouslyVisibleId = currentPlayer && effectiveStatus(currentPlayer) === "pending" && currentPlayer.id !== p.id ? currentPlayer.id : null;
										if (previouslyVisibleId) setReplacedPlayerId(previouslyVisibleId);
										startNewLot(p);
										setPickerOpen(false);
										setPickerQuery("");
										setSelectionMode("manual");
										reshuffleQueue(p.id, previouslyVisibleId);
									},
									className: "flex w-full items-center gap-2.5 rounded-2xl border border-[#5c6875]/35 bg-[#2e343a]/50 p-2 text-left hover:bg-[#2e343a] hover:border-[#a1b5d8] active:scale-[0.99] transition-all text-[#fffcf7] cursor-pointer group shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
										src: p.photo || "",
										alt: p.name,
										className: "size-11 sm:size-12 shrink-0 rounded-xl object-cover object-top border border-[#a1b5d8]/30 group-hover:border-[#a1b5d8] transition-colors",
										fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "display grid size-full place-items-center rounded-xl bg-[#162235] text-xs font-black text-[#a1b5d8]",
											children: p.name.slice(0, 2).toUpperCase()
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs sm:text-sm font-black text-[#fffcf7] truncate group-hover:text-[#a1b5d8] transition-colors flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 ml-2 shrink-0",
												children: [effectiveStatus(p) === "unsold" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] font-black uppercase text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/50 flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-2.5" }), " Unsold"]
												}), sNo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] font-bold text-[#38bdf8]",
													children: [
														"(S.No #",
														sNo,
														")"
													]
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] sm:text-[11px] text-[#abb4bd] font-semibold mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 truncate",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#ecf0f7]",
													children: p.sportFields?.["role"] || "-"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#5c6875]",
													children: "•"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[#c2d8b9]",
													children: ["Grade ", p.category || "-"]
												}),
												p.customData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#5c6875]",
													children: "•"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.customData.replace("Dominated Hand: ", "") })] })
											]
										})]
									})]
								}, p.id);
							})
						})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!viewingTeamId,
			onOpenChange: (open) => {
				if (!open) setViewingTeamId(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-2xl h-[600px] max-h-[85vh] flex flex-col rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-xl sm:text-2xl font-black border-b border-[#5c6875]/30 pb-3 text-[#fffcf7]",
						children: [teams.find((t) => t.id === viewingTeamId)?.name, " - Bought Players"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 space-y-2.5 overflow-y-auto pr-1",
					children: effectivePlayers.filter((p) => p.teamId === viewingTeamId && effectiveStatus(p) === "sold").length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col items-center justify-center min-h-[300px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg text-[#abb4bd] font-bold",
							children: "No players sold to this team yet."
						})
					}) : effectivePlayers.filter((p) => p.teamId === viewingTeamId && effectiveStatus(p) === "sold").map((p) => {
						const pNumber = p.phone.startsWith("90000000") ? parseInt(p.phone.slice(8)) : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-[#5c6875]/30 py-4 hover:bg-[#2e343a]/40 px-3 rounded-2xl transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
									src: p.photo || "",
									alt: p.name,
									className: "size-14 sm:size-16 shrink-0 rounded-2xl object-cover object-top border-2 border-[#a1b5d8]/40 shadow-sm",
									fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "display grid size-full place-items-center rounded-2xl bg-[#162235] text-lg font-black text-[#a1b5d8]",
										children: p.name.slice(0, 2).toUpperCase()
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-base sm:text-lg font-black text-[#fffcf7] truncate max-w-[240px]",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs sm:text-sm text-[#abb4bd] font-semibold mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5",
										children: [
											pNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-[#a1b5d8]",
												children: ["Player ", pNumber]
											}),
											pNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#5c6875]",
												children: "•"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.sportFields?.["role"] || "-" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#5c6875]",
												children: "•"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Grade ", p.category || "-"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#5c6875]",
												children: "•"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.customData ? p.customData.replace("Dominated Hand: ", "") : "-" })
										]
									})]
								})]
							}), editingSoldPlayerId === p.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: editingSoldAmount,
										onChange: (e) => setEditingSoldAmount(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") handleSaveSoldPrice(p.id, p.name);
											if (e.key === "Escape") setEditingSoldPlayerId(null);
										},
										autoFocus: true,
										className: "w-24 sm:w-28 h-9 text-xs sm:text-sm font-black text-[#c2d8b9] bg-[#0f1712] border-2 border-emerald-500 rounded-xl text-center focus-visible:ring-emerald-500"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleSaveSoldPrice(p.id, p.name),
										className: "size-8 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all cursor-pointer",
										title: "Save price",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 stroke-[3]" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setEditingSoldPlayerId(null),
										className: "size-8 rounded-xl bg-[#142630] border border-[#38bdf8]/35 text-[#abb4bd] hover:text-white flex items-center justify-center transition-all cursor-pointer",
										title: "Cancel",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 stroke-[2.5]" })
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-base sm:text-lg font-black text-[#c2d8b9] bg-[#23341d]/70 px-3.5 py-1.5 rounded-xl border border-[#47673a] shadow-sm flex items-center gap-1",
										children: ["🪙 ", p.soldPrice?.toLocaleString() ?? "0"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setEditingSoldPlayerId(p.id);
											setEditingSoldAmount((p.soldPrice ?? 0).toString());
										},
										className: "text-[#a1b5d8] hover:text-white p-2 hover:bg-[#2e343a] rounded-xl transition-all border border-[#5c6875]/40 hover:border-[#a1b5d8] cursor-pointer",
										title: "Edit sold price",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setChangeTeamPlayer(p),
										className: "text-[#38bdf8] hover:text-white p-2 hover:bg-[#2e343a] rounded-xl transition-all border border-[#5c6875]/40 hover:border-[#38bdf8] cursor-pointer",
										title: "Change team",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
									})
								]
							})]
						}, p.id);
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!viewingStatusList,
			onOpenChange: (open) => {
				if (!open) setViewingStatusList(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-2xl h-[600px] max-h-[85vh] flex flex-col rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-[0_20px_50px_rgba(23,26,29,0.95)] p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-[#5c6875]/30 pb-3 flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-xl sm:text-2xl font-black capitalize text-[#fffcf7] flex items-center gap-2",
							children: viewingStatusList === "unsold" && pendingPlayers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unsold Players List" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40",
								children: "No More Players Available"
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								viewingStatusList === "pending" ? "Available" : viewingStatusList,
								" Players (",
								viewingStatusList === "pending" ? pendingPlayers.length : viewingStatusList === "sold" ? soldCount : unsoldCount,
								")"
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-[#a1b5d8] font-semibold mt-1",
							children: viewingStatusList === "unsold" ? pendingPlayers.length === 0 ? "All regular players have been auctioned. Repeat unsold players to continue the auction round." : "Unsold players pool. You can repeat individual players or repeat all at once." : viewingStatusList === "sold" ? "List of all players sold in this auction. You can edit prices or change teams." : "Players currently waiting on the auction queue."
						})] }), viewingStatusList === "unsold" && unsoldCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							disabled: isRepeatingUnsold,
							onClick: handleRepeatAllUnsold,
							className: "rounded-xl px-4 h-9 font-black text-xs text-white bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.6)] flex items-center gap-1.5 active:scale-95 transition-all border border-white/30 cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }),
								"Repeat All Unsold (",
								unsoldCount,
								")"
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 space-y-2.5 overflow-y-auto pr-1",
					children: (() => {
						const list = viewingStatusList === "pending" ? pendingPlayers : effectivePlayers.filter((p) => effectiveStatus(p) === viewingStatusList);
						if (list.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col items-center justify-center min-h-[300px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-[#abb4bd] font-bold",
								children: "No players found in this category."
							})
						});
						return list.map((p) => {
							const pNumber = p.phone.startsWith("90000000") ? parseInt(p.phone.slice(8)) : null;
							const buyerTeam = teams.find((t) => t.id === p.teamId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4 rounded-2xl border border-[#5c6875]/30 p-3.5 bg-[#2e343a]/40 hover:bg-[#2e343a]/75 transition-colors shadow-sm animate-fade-in text-[#fffcf7]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
										src: p.photo || "",
										alt: p.name,
										className: "size-12 sm:size-14 shrink-0 rounded-2xl object-cover object-top border-2 border-[#a1b5d8]/40 shadow-sm",
										fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "display grid size-full place-items-center rounded-2xl bg-[#162235] text-lg font-black text-[#a1b5d8]",
											children: p.name.slice(0, 2).toUpperCase()
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-base sm:text-lg font-black text-[#fffcf7] truncate max-w-[240px]",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs sm:text-sm text-[#abb4bd] font-semibold mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5",
											children: [
												pNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-[#a1b5d8]",
													children: ["Player ", pNumber]
												}),
												pNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#5c6875]",
													children: "•"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.sportFields?.["role"] || "-" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#5c6875]",
													children: "•"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Grade ", p.category || "-"] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#5c6875]",
													children: "•"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.customData ? p.customData.replace("Dominated Hand: ", "") : "-" })
											]
										})]
									})]
								}), viewingStatusList === "sold" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-end gap-1 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-black text-[#a1b5d8] uppercase tracking-wider",
										children: buyerTeam?.name || "Sold"
									}), editingSoldPlayerId === p.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 shrink-0 mt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: editingSoldAmount,
												onChange: (e) => setEditingSoldAmount(e.target.value),
												onKeyDown: (e) => {
													if (e.key === "Enter") handleSaveSoldPrice(p.id, p.name);
													if (e.key === "Escape") setEditingSoldPlayerId(null);
												},
												autoFocus: true,
												className: "w-24 sm:w-28 h-9 text-xs sm:text-sm font-black text-[#c2d8b9] bg-[#0f1712] border-2 border-emerald-500 rounded-xl text-center focus-visible:ring-emerald-500"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => handleSaveSoldPrice(p.id, p.name),
												className: "size-8 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all cursor-pointer",
												title: "Save price",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 stroke-[3]" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setEditingSoldPlayerId(null),
												className: "size-8 rounded-xl bg-[#142630] border border-[#38bdf8]/35 text-[#abb4bd] hover:text-white flex items-center justify-center transition-all cursor-pointer",
												title: "Cancel",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 stroke-[2.5]" })
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 shrink-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-base sm:text-lg font-black text-[#c2d8b9] bg-[#23341d]/70 px-3.5 py-1.5 rounded-xl border border-[#47673a] shadow-sm flex items-center gap-1",
												children: ["🪙 ", p.soldPrice?.toLocaleString() ?? "0"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setEditingSoldPlayerId(p.id);
													setEditingSoldAmount((p.soldPrice ?? 0).toString());
												},
												className: "text-[#a1b5d8] hover:text-white p-2 hover:bg-[#2e343a] rounded-xl transition-all border border-[#5c6875]/40 hover:border-[#a1b5d8] cursor-pointer",
												title: "Edit sold price",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setChangeTeamPlayer(p),
												className: "text-[#38bdf8] hover:text-white p-2 hover:bg-[#2e343a] rounded-xl transition-all border border-[#5c6875]/40 hover:border-[#38bdf8] cursor-pointer",
												title: "Change team",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
											})
										]
									})]
								}) : viewingStatusList === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-[#a1b5d8] bg-[#162235]/70 px-3.5 py-1 rounded-full border border-[#4365a0] shrink-0",
									children: "Available"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-red-400 bg-[#45191f]/70 px-3 py-1 rounded-full border border-[#8b2635]",
										children: "Unsold"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleRepeatSinglePlayer(p),
										className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#38bdf8]/20 to-[#0284c7]/20 border border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#142630] font-black text-xs transition-all cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.3)] active:scale-95",
										title: "Repeat this player and put on auction block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Repeat & Auction"]
									})]
								})]
							}, p.id);
						});
					})()
				})]
			})
		}),
		changeTeamPlayer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangePlayerTeamModal, {
			auction,
			player: changeTeamPlayer,
			teams,
			players: effectivePlayers,
			open: !!changeTeamPlayer,
			onOpenChange: (open) => {
				if (!open) setChangeTeamPlayer(null);
			},
			onSuccess: () => {
				refetchPlayers();
			}
		})
	] });
}
//#endregion
export { AuctioneerConsole as component };
