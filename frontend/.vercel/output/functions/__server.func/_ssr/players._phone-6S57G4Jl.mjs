import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Ot as ArrowLeft, R as LoaderCircle, nt as ExternalLink, rt as EllipsisVertical } from "../_libs/lucide-react.mjs";
import { a as SiteHeader, i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./SiteHeader-yG2LLCbm.mjs";
import { t as FallbackImage } from "./fallback-image-CwnNUhIA.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
import { t as usePlayerProfile } from "./usePlayerProfile-DXO1w3Oh.mjs";
import { d as format } from "../_libs/date-fns.mjs";
import { t as Route } from "./players._phone-CwfNcPQv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/players._phone-6S57G4Jl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlayerProfilePage() {
	const { phone } = Route.useParams();
	const { data: profile, isLoading, isError } = usePlayerProfile(phone);
	const [activeTab, setActiveTab] = (0, import_react.useState)("AUCTIONS");
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-muted-foreground" })
		})]
	});
	if (isError || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-20 text-center text-muted-foreground",
			children: "Player not found."
		})]
	});
	const { profile: info, stats, history } = profile;
	const displayHistory = activeTab === "AUCTIONS" ? [...history] : [...history].sort((a, b) => (b.soldPrice || 0) - (a.soldPrice || 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#f2e9dc] pb-32 selection:bg-[#38bdf8] selection:text-[#ffffff]",
		style: { background: "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-[#38bdf8]/35 bg-[#142630]/95 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-4xl px-4 py-4 sm:py-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								asChild: true,
								className: "shrink-0 -ml-2 text-[#38bdf8] hover:text-[#ffffff] hover:bg-[#1a3847]/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => window.history.back(),
									"aria-label": "Go back",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
								src: info.photo || "",
								alt: info.name,
								className: "size-14 sm:size-16 rounded-full border-2 border-[#38bdf8]/60 object-cover shrink-0 shadow-md",
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "display grid size-full place-items-center rounded-full bg-[#142630] text-2xl font-black text-[#38bdf8]",
									children: info.name.slice(0, 2).toUpperCase()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl sm:text-2xl font-black text-[#ffffff] tracking-tight truncate drop-shadow-sm",
									children: info.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-sm text-[#f2e9dc]/80 flex items-center gap-2 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-[#162a34] border border-[#38bdf8]/50 px-3 py-0.5 text-xs font-black text-emerald-400 shadow-sm",
										children: info.role
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#38bdf8]",
										children: info.phone
									})]
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-4 pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3 mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border-2 border-[#38bdf8]/35 bg-[#162b35]/85 p-4 text-center shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-black text-[#38bdf8] uppercase tracking-wider mb-1",
									children: "Auctions"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl sm:text-3xl font-black text-[#ffffff]",
									children: stats.joinedAuctions
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border-2 border-[#38bdf8]/35 bg-[#162b35]/85 p-4 text-center shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-black text-[#38bdf8] uppercase tracking-wider mb-1",
									children: "Teams"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl sm:text-3xl font-black text-[#ffffff]",
									children: stats.joinedTeams
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border-2 border-[#38bdf8]/35 bg-[#162b35]/85 p-4 text-center shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-black text-[#38bdf8] uppercase tracking-wider mb-1",
									children: "Overall ASP"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl sm:text-3xl font-black text-emerald-400",
									children: stats.overallASP > 0 ? stats.overallASP.toLocaleString("en-IN") : "---"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex border-b border-[#38bdf8]/30 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("AUCTIONS"),
							className: `pb-3 px-5 text-sm font-black transition-all ${activeTab === "AUCTIONS" ? "border-b-2 border-[#38bdf8] text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" : "text-[#f2e9dc]/70 hover:text-[#ffffff]"}`,
							children: "All Auctions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("BEST_PRICE"),
							className: `pb-3 px-5 text-sm font-black transition-all ${activeTab === "BEST_PRICE" ? "border-b-2 border-[#38bdf8] text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" : "text-[#f2e9dc]/70 hover:text-[#ffffff]"}`,
							children: "Best Sold Price"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: displayHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-12 text-center text-[#f2e9dc]/70 border-2 border-dashed border-[#38bdf8]/30 rounded-2xl font-bold bg-[#162b35]/40",
							children: "No auction history found."
						}) : displayHistory.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border-2 border-[#38bdf8]/30 bg-[#162b35]/85 p-4 shadow-md relative hover:border-[#38bdf8] transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "shrink-0 size-16 rounded-xl bg-[#142630] border border-[#38bdf8]/40 flex items-center justify-center overflow-hidden",
									children: item.auctionCover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.auctionCover,
										alt: "",
										className: "size-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-black text-[#38bdf8]",
										children: item.auctionName.slice(0, 2).toUpperCase()
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-black text-base sm:text-lg text-[#ffffff] truncate max-w-[200px] sm:max-w-xs",
											children: item.auctionName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-[#f2e9dc]/70 mt-0.5 font-medium",
											children: [
												format(new Date(item.auctionDate), "MMM d, yyyy"),
												" · ",
												item.playersPerTeam,
												" Player Per Team"
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-right pl-2 shrink-0 pr-6",
											children: item.soldPrice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-lg font-black text-emerald-400 leading-none mb-1",
												children: item.soldPrice.toLocaleString("en-IN")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-[#38bdf8] uppercase font-black whitespace-nowrap",
												children: "Sold For"
											})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-lg font-black text-rose-400 leading-none mb-1",
												children: "Unsold"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-[#f2e9dc]/60 uppercase font-black whitespace-nowrap",
												children: "Status"
											})] })
										})]
									}), item.teamId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center gap-2 bg-muted/30 rounded-md p-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "size-6 rounded bg-[#1e2329] flex items-center justify-center overflow-hidden shrink-0",
											children: item.teamLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: item.teamLogo,
												alt: "",
												className: "size-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold text-white/50",
												children: item.teamName?.slice(0, 2)
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium truncate",
											children: item.teamName
										})]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-3 right-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "size-8 rounded-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
									align: "end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/my-auctions/$id",
											params: { id: item.auctionId },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-2 size-4" }), " View Auction"]
										})
									})
								})] })
							})]
						}, item.id))
					})
				]
			})
		]
	});
}
//#endregion
export { PlayerProfilePage as component };
