import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Pencil, B as Link$1, D as Plus, Et as ArrowUpRight, F as MapPin, N as MessageCircle, R as LoaderCircle, S as Settings, St as CalendarDays, Tt as Award, at as DollarSign, ct as Clock, ht as CircleAlert, i as Users, nt as ExternalLink, ot as Copy, st as CloudUpload, x as Share2 } from "../_libs/lucide-react.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
import { t as FallbackImage } from "./fallback-image-CwnNUhIA.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
import { n as Label, t as Input } from "./input-BifiwAc8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, s as usePlayers, t as Select } from "./select-CBTHEQ7z.mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-CCY-ptI1.mjs";
import { n as fileToCompressedDataUrl, t as IMAGE_PRESETS } from "./image-DJ08YD9d.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-C2cO245r.mjs";
import { t as usePlayerProfile } from "./usePlayerProfile-DXO1w3Oh.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as format } from "../_libs/date-fns.mjs";
import { a as useTeams } from "./pdf-export-d54OVmg_.mjs";
import { t as SPORT_CONFIGS } from "./player-CH8bdjpo.mjs";
import { t as QRCodeSVG } from "../_libs/qrcode.react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PlayerFormModal-VTjOHpCn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Countdown({ targetDate }) {
	const [timeLeft, setTimeLeft] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const target = new Date(targetDate).getTime();
		const update = () => {
			const now = (/* @__PURE__ */ new Date()).getTime();
			const distance = target - now;
			if (distance < 0) {
				setTimeLeft("Started");
				return;
			}
			const days = Math.floor(distance / 864e5);
			const hours = Math.floor(distance % 864e5 / 36e5);
			const minutes = Math.floor(distance % 36e5 / 6e4);
			const seconds = Math.floor(distance % 6e4 / 1e3);
			setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
		};
		update();
		const interval = setInterval(update, 1e3);
		return () => clearInterval(interval);
	}, [targetDate]);
	if (!timeLeft) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }), " ..."]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" }),
			" ",
			timeLeft
		]
	});
}
function PlayerPreviewCard({ player, trigger, open, onOpenChange }) {
	const { data: profile, isLoading } = usePlayerProfile(player.phone, open);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-sm p-0 overflow-hidden rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-[0_20px_60px_rgba(10,25,32,0.95)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				className: "p-4 pb-0 hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Player Details" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center pt-7 px-5 pb-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-28 sm:size-32 rounded-2xl overflow-hidden border-2 border-[#38bdf8]/60 shadow-[0_8px_25px_rgba(56,189,248,0.35)] bg-[#162a34]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
								src: player.photo || "",
								alt: player.name,
								className: "size-full object-cover object-top",
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "display grid size-full place-items-center bg-gradient-to-br from-[#1e424c] to-[#38bdf8] text-4xl font-black text-[#ffffff]",
									children: player.name.slice(0, 2).toUpperCase()
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#162a34] border-2 border-[#38bdf8]/60 px-3.5 py-0.5 text-[11px] font-black uppercase text-emerald-400 shadow-sm",
							children: player.sportFields?.["role"] || player.category || "Player"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl sm:text-2xl font-black text-[#ffffff] tracking-tight",
							children: player.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs font-bold text-[#38bdf8]",
							children: player.phone ? `+91 ${player.phone}` : "No contact available"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full mt-4 rounded-2xl bg-[#162a34]/90 border-2 border-[#38bdf8]/30 p-3.5 backdrop-blur-sm",
						children: open && isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-[#38bdf8]" })
						}) : profile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 divide-x divide-[#38bdf8]/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-black text-[#ffffff]",
										children: profile.stats.joinedAuctions
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase font-black text-[#38bdf8] mt-0.5 tracking-wider",
										children: "Auctions"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-black text-[#ffffff]",
										children: profile.stats.joinedTeams
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase font-black text-[#38bdf8] mt-0.5 tracking-wider",
										children: "Teams"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-black text-emerald-400",
										children: profile.stats.overallASP > 0 ? profile.stats.overallASP.toLocaleString("en-IN") : "---"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase font-black text-[#f97316] mt-0.5 tracking-wider",
										children: "Avg ASP"
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-[#f2e9dc]/70 font-semibold",
							children: "Quick profile statistics"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full rounded-full py-3 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:scale-105 transition-all border border-white/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/players/$phone",
								params: { phone: player.phone },
								onClick: () => onOpenChange(false),
								children: "View Full Profile"
							})
						})
					})
				]
			})]
		})]
	});
}
function AboutTab({ auction, teams, players }) {
	function copyCode() {
		navigator.clipboard.writeText(auction.id);
		toast.success("Auction code copied!");
	}
	const shareAuction = async () => {
		const url = window.location.href;
		if (navigator.share) try {
			await navigator.share({
				title: auction.name,
				text: `Check out the ${auction.name} auction!`,
				url
			});
		} catch (err) {}
		else {
			navigator.clipboard.writeText(url);
			toast.success("Auction URL copied to clipboard!");
		}
	};
	const auctionUrl = typeof window !== "undefined" ? `${window.location.origin}/auctions/${auction.id}` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 text-[#fffcf7]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgba(23,26,29,0.7)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center px-4 py-3 border-b border-[#5c6875]/30 text-xs sm:text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-semibold text-[#a1b5d8]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-[#a1b5d8]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: format(new Date(auction.startsAt), "dd-MM-yyyy") })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-semibold text-[#c2d8b9]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-[#c2d8b9]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: format(new Date(auction.startsAt), "h:mm a") })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-16 rounded-xl bg-[#162235] border border-[#a1b5d8]/40 overflow-hidden shrink-0 flex items-center justify-center shadow-md",
							children: auction.coverImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: auction.coverImage,
								alt: auction.name,
								className: "size-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl font-black text-[#a1b5d8]",
								children: auction.name.slice(0, 2).toUpperCase()
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-extrabold text-xl text-[#fffcf7]",
							children: auction.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1.5 text-xs text-[#abb4bd] mt-1 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-[#a1b5d8]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Official Tournament Arena" })]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center px-4 py-3 bg-[#171a1d]/60 border-t border-[#5c6875]/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-semibold text-xs sm:text-sm text-[#e3e6e9]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-[#162235] p-1.5 rounded-lg text-[#a1b5d8] border border-[#a1b5d8]/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [auction.playersPerTeam, " Players Per Team"] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: shareAuction,
							className: "text-[#a1b5d8] hover:bg-[#a1b5d8]/15 p-2 rounded-xl transition-colors",
							title: "Share Tournament",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 gap-3.5 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-[#162235] p-2 rounded-xl text-[#a1b5d8] shrink-0 border border-[#a1b5d8]/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold",
							children: "Auction Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-black flex items-center gap-1 text-[#fffcf7]",
							children: [auction.id.slice(-6), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: copyCode,
								className: "text-[#a1b5d8] hover:text-[#fffcf7]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" })
							})]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-[#162235] p-2 rounded-xl text-[#c2d8b9] shrink-0 border border-[#c2d8b9]/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold",
							children: "Purse / Team"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-black text-[#c2d8b9]",
							children: auction.pointsPerTeam.toLocaleString("en-IN")
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-[#162235] p-2 rounded-xl text-[#e4f0d0] shrink-0 border border-[#e4f0d0]/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold",
							children: "Min Base Bid"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-black text-[#e4f0d0]",
							children: auction.minimumBid.toLocaleString("en-IN")
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-[#162235] p-2 rounded-xl text-[#a1b5d8] shrink-0 border border-[#a1b5d8]/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold",
							children: "Bid Increment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-black text-[#a1b5d8]",
							children: ["+", auction.bidIncrement.toLocaleString("en-IN")]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-[#162235] p-2 rounded-xl text-[#c2d8b9] shrink-0 border border-[#c2d8b9]/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold",
							children: "Total Teams"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-black text-[#fffcf7]",
							children: teams.length
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-[#162235] p-2 rounded-xl text-[#e4f0d0] shrink-0 border border-[#e4f0d0]/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold",
							children: "Total Players"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-black text-[#fffcf7]",
							children: players.length
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 flex justify-between items-center shadow-[0_8px_30px_rgba(23,26,29,0.7)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-semibold text-sm",
					children: ["Current Tier: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[#e4f0d0] font-black ml-1.5 px-3 py-1 rounded-full bg-[#162235] border border-[#e4f0d0]/30 text-xs",
						children: "✨ Free Plan"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-5 text-[#a1b5d8]" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center mb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-bold text-[#abb4bd] uppercase tracking-wider",
						children: "Tournament QR Check-in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: shareAuction,
						className: "text-[#a1b5d8] hover:text-[#fffcf7]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 bg-white rounded-2xl mb-3 shadow-lg border border-[#a1b5d8]/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeSVG, {
								value: auctionUrl,
								size: 140
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[#a1b5d8] font-black text-sm tracking-wider",
							children: auction.id.slice(-6)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-[#abb4bd] font-medium mt-0.5",
							children: "Scan to open live auction room"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgba(23,26,29,0.7)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-3 border-b border-[#5c6875]/30 text-xs font-bold text-[#abb4bd] uppercase tracking-wider",
					children: "Broadcast & Invite"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-[#171a1d]/60 flex gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `https://wa.me/?text=Check out this auction: ${auctionUrl}`,
							target: "_blank",
							rel: "noreferrer",
							className: "size-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm",
							title: "Share on WhatsApp",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `https://twitter.com/intent/tweet?text=Check out this auction:&url=${auctionUrl}`,
							target: "_blank",
							rel: "noreferrer",
							className: "size-9 rounded-xl bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity border border-white/20 shadow-sm",
							title: "Share on X",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-xs",
								children: "X"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: shareAuction,
							className: "size-9 rounded-xl bg-gradient-to-r from-[#6c8cc2] to-[#a1b5d8] text-[#162235] flex items-center justify-center hover:opacity-95 transition-opacity font-bold shadow-sm",
							title: "Copy Auction Link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, { className: "size-4 stroke-[2.5]" })
						})
					]
				})]
			})
		]
	});
}
function TeamFormModal({ auctionId, team, trigger, open: controlledOpen, onOpenChange: setControlledOpen }) {
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(false);
	const open = controlledOpen !== void 0 ? controlledOpen : internalOpen;
	const setOpen = setControlledOpen || setInternalOpen;
	const [name, setName] = (0, import_react.useState)(team?.name || "");
	const [shortName, setShortName] = (0, import_react.useState)(team?.shortName || "");
	const [ownerName, setOwnerName] = (0, import_react.useState)(team?.ownerName || "");
	const [ownerPhone, setOwnerPhone] = (0, import_react.useState)(team?.ownerPhone || "");
	const [colorTheme, setColorTheme] = (0, import_react.useState)(team?.colorTheme || "");
	const [logo, setLogo] = (0, import_react.useState)(team?.logo || null);
	const { createTeam, updateTeam, isCreating, isUpdating } = useTeams(auctionId);
	const isSubmitting = isCreating || isUpdating;
	const handleLogoChange = async (e) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 10485760) {
				alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
				toast.error("Logo must be less than 10MB");
				e.target.value = "";
				return;
			}
			try {
				const dataUrl = await fileToCompressedDataUrl(file, IMAGE_PRESETS.cover);
				setLogo(dataUrl);
			} catch (err) {
				toast.error("Failed to process image");
			}
		}
	};
	async function onSubmit(e) {
		e.preventDefault();
		if (!name.trim() || !shortName.trim() || !ownerName.trim() || !ownerPhone.trim() || !colorTheme.trim()) {
			toast.error("Please fill in all required fields marked with an asterisk (*)");
			return;
		}
		try {
			if (team) {
				await updateTeam({
					id: team.id,
					patch: {
						name,
						shortName,
						ownerName,
						ownerPhone,
						colorTheme,
						logo
					}
				});
				toast.success("Team updated successfully");
			} else {
				await createTeam({
					auctionId,
					name,
					shortName,
					ownerName,
					ownerPhone,
					colorTheme,
					logo
				});
				toast.success("Team created successfully");
			}
			setOpen(false);
			if (!team) {
				setName("");
				setShortName("");
				setOwnerName("");
				setOwnerPhone("");
				setColorTheme("");
				setLogo(null);
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to save team");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: trigger !== void 0 ? trigger : !team ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				className: "fixed bottom-24 right-6 size-14 rounded-full shadow-2xl sm:bottom-8 sm:right-10 bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-[#ffffff] hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.7)] border-2 border-white/50 z-30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-7 stroke-[3]" })
			}) : null
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-[0_20px_60px_rgba(10,25,32,0.95)] p-6 sm:p-7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-2xl font-black text-[#ffffff] tracking-tight",
				children: team ? "Edit Team Details" : "Add New Team"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-4 pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center space-y-2 pb-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "logo",
								className: "cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative flex size-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235] hover:border-[#a1b5d8] transition-colors shadow-inner",
									children: logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: logo,
										alt: "Team logo",
										className: "size-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-8 text-[#a1b5d8]" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-[#abb4bd] font-medium",
								children: "Team Logo * (up to 10MB)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "logo",
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: handleLogoChange,
								disabled: isSubmitting
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
								children: "Team Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								placeholder: "e.g. Royal Challengers",
								value: name,
								onChange: (e) => setName(e.target.value),
								disabled: isSubmitting,
								className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "shortName",
								className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
								children: "Short Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "shortName",
								placeholder: "e.g. RCB",
								value: shortName,
								onChange: (e) => setShortName(e.target.value),
								disabled: isSubmitting,
								className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ownerName",
								className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
								children: "Owner Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ownerName",
								placeholder: "e.g. John Doe",
								value: ownerName,
								onChange: (e) => setOwnerName(e.target.value),
								disabled: isSubmitting,
								className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ownerPhone",
								className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
								children: "Owner Contact *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ownerPhone",
								placeholder: "e.g. 9876543210",
								value: ownerPhone,
								onChange: (e) => setOwnerPhone(e.target.value),
								disabled: isSubmitting,
								className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "colorTheme",
							className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
							children: "Team Color/Theme *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "colorTheme",
							placeholder: "e.g. #3b82f6 or Blue",
							value: colorTheme,
							onChange: (e) => setColorTheme(e.target.value),
							disabled: isSubmitting,
							className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#162a34]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-3 pt-4 border-t border-[#38bdf8]/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setOpen(false),
							disabled: isSubmitting,
							className: "rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#203f4f] transition-all font-bold px-6 shadow-sm",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: isSubmitting,
							className: "rounded-full px-7 py-2.5 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30",
							children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Saving..."] }) : "Save Team"
						})]
					})
				]
			})]
		})]
	});
}
var normalizeHand = (h) => {
	if (!h) return "";
	const upper = h.toUpperCase().trim();
	if (upper.includes("RIGHT")) return "Right Hand";
	if (upper.includes("LEFT")) return "Left Hand";
	if (upper.includes("BOTH")) return "Both Hands";
	return h;
};
var CHAPTERS = [
	"Alpha",
	"Beacon",
	"Champions",
	"Diamonds",
	"Excellence",
	"freedom",
	"Grand",
	"Jade",
	"Knights",
	"Legends",
	"Marvel",
	"Orbit",
	"Prime",
	"Royals",
	"Suprime",
	"Titans",
	"Core group"
];
function PlayerFormModal({ auctionId, sportType, playersPerTeam, player, trigger, open: controlledOpen, onOpenChange: setControlledOpen }) {
	const [internalOpen, setInternalOpen] = (0, import_react.useState)(false);
	const open = controlledOpen !== void 0 ? controlledOpen : internalOpen;
	const setOpen = setControlledOpen || setInternalOpen;
	const isBni = auctionId === "6a8edaddd7ed74151dbafab3";
	const isHunterzVolleyball = auctionId === "6a8a705aef1f9e0978b3031c";
	const isJsc = auctionId === "6a8ed4afb1d04e719c5866a6";
	const hidePayment = isBni || isHunterzVolleyball;
	const [name, setName] = (0, import_react.useState)(player?.name || "");
	const [phone, setPhone] = (0, import_react.useState)(player?.phone || "");
	const [phoneError, setPhoneError] = (0, import_react.useState)("");
	const [age, setAge] = (0, import_react.useState)(player?.age?.toString() || "");
	const [category, setCategory] = (0, import_react.useState)(player?.category || "");
	const [gender, setGender] = (0, import_react.useState)(player?.gender || "");
	const [city, setCity] = (0, import_react.useState)(player?.city || "");
	const [playerLevel, setPlayerLevel] = (0, import_react.useState)(player?.playerLevel || "");
	const [paymentMode, setPaymentMode] = (0, import_react.useState)(player?.paymentMode || "");
	const [utrNumber, setUtrNumber] = (0, import_react.useState)(player?.utrNumber || "");
	const [paymentImage, setPaymentImage] = (0, import_react.useState)(player?.paymentImage || null);
	const [loadingFullDetails, setLoadingFullDetails] = (0, import_react.useState)(false);
	const [imgLoading, setImgLoading] = (0, import_react.useState)(false);
	const [imgError, setImgError] = (0, import_react.useState)(false);
	const [baseValue, setBaseValue] = (0, import_react.useState)(player?.baseValue?.toString() || "0");
	const [jerseySize, setJerseySize] = (0, import_react.useState)(player?.jerseySize || "");
	const [jerseyName, setJerseyName] = (0, import_react.useState)(player?.jerseyName || "");
	const [trouserSize, setTrouserSize] = (0, import_react.useState)(player?.trouserSize || "");
	const [customData, setCustomData] = (0, import_react.useState)(player?.customData || "");
	const [dominatedHand, setDominatedHand] = (0, import_react.useState)(normalizeHand(player?.sportFields?.["Dominated Hand"] || (player?.customData?.startsWith("Dominated Hand: ") ? player.customData.replace("Dominated Hand: ", "") : player?.customData || "")));
	const [position, setPosition] = (0, import_react.useState)(player?.sportFields?.["role"] || "");
	const initialIsBni = player?.customData?.startsWith("BNI Member");
	const initialIsFamily = player?.customData?.startsWith("Family Member");
	const [memberType, setMemberType] = (0, import_react.useState)(initialIsBni ? "bni" : initialIsFamily ? "family" : "");
	const [chapterName, setChapterName] = (0, import_react.useState)("");
	const [bniName, setBniName] = (0, import_react.useState)("");
	const [relationship, setRelationship] = (0, import_react.useState)("");
	const [bblSeasons, setBblSeasons] = (0, import_react.useState)("");
	const [photo, setPhoto] = (0, import_react.useState)(player?.photo || null);
	const [teamId, setTeamId] = (0, import_react.useState)(player?.teamId || "none");
	const [soldPrice, setSoldPrice] = (0, import_react.useState)(player?.soldPrice?.toString() || "");
	const [sportFields, setSportFields] = (0, import_react.useState)(player?.sportFields || {});
	const { players, createPlayer, updatePlayer, isCreating, isUpdating } = usePlayers(auctionId);
	const { teams } = useTeams(auctionId);
	const isSubmitting = isCreating || isUpdating;
	function rosterCount(teamId) {
		return players.filter((p) => p.teamId === teamId && p.id !== player?.id).length;
	}
	const config = SPORT_CONFIGS[sportType] || SPORT_CONFIGS["cricket"];
	Array.from(/* @__PURE__ */ new Set([
		...config.roles,
		"ALL ROUNDER",
		"COUNTER",
		"MIDDLE BLOCKER",
		"LIBERO",
		"SETTER",
		"ATTACKER",
		"UNIVERSAL",
		"BLOCKER",
		"PASSER",
		"OUTSIDE HITTER",
		"RIGHT SIDE HITTER",
		"BOOSTER",
		...position ? [position] : []
	]));
	(0, import_react.useEffect)(() => {
		if (open && !player) {
			setName("");
			setPhone("");
			setPhoneError("");
			setAge("");
			setCategory("");
			setGender("");
			setCity("");
			setPlayerLevel("");
			setPaymentMode("");
			setUtrNumber("");
			setPaymentImage(null);
			setBaseValue("0");
			setJerseySize("");
			setJerseyName("");
			setTrouserSize("");
			setCustomData("");
			setDominatedHand("");
			setPosition("");
			setBblSeasons("");
			setPhoto(null);
			setTeamId("none");
			setSoldPrice("");
			setSportFields({});
		} else if (open && player) {
			setName(player.name || "");
			setPhone(player.phone || "");
			setPhoneError("");
			setAge(player.age?.toString() || "");
			setCategory(player.category || "");
			setGender(player.gender ? player.gender.trim().charAt(0).toUpperCase() + player.gender.trim().slice(1).toLowerCase() : "");
			setCity(player.city ? player.city.trim().toLowerCase() : "");
			setPlayerLevel(player.playerLevel ? player.playerLevel.trim().charAt(0).toUpperCase() + player.playerLevel.trim().slice(1).toLowerCase() : "");
			setPaymentMode(player.paymentMode || "");
			setUtrNumber(player.utrNumber || "");
			setPaymentImage(player.paymentImage || null);
			setBaseValue(player.baseValue?.toString() || "0");
			const fetchFullDetails = async () => {
				setLoadingFullDetails(true);
				try {
					const fullPlayer = await auctionClient.getPlayerById(player.id);
					if (fullPlayer && fullPlayer.paymentImage) {
						setPaymentImage(fullPlayer.paymentImage);
						setImgLoading(true);
						setImgError(false);
					}
				} catch (err) {
					console.error("Failed to fetch full player details for payment screenshot:", err);
				} finally {
					setLoadingFullDetails(false);
				}
			};
			fetchFullDetails();
			setJerseySize(player.jerseySize || "");
			setJerseyName(player.jerseyName || "");
			setTrouserSize(player.trouserSize || "");
			setCustomData(player.customData || "");
			const rawHand = player.sportFields?.["Dominated Hand"] || (player.customData?.startsWith("Dominated Hand: ") ? player.customData.replace("Dominated Hand: ", "") : player.customData || "");
			setDominatedHand(normalizeHand(rawHand));
			setPosition(player.sportFields?.["role"] || "");
			setPhoto(player.photo || null);
			setTeamId(player.teamId || "none");
			setSoldPrice(player.soldPrice?.toString() || "");
			setSportFields(player.sportFields || {});
			if (player.customData?.startsWith("BNI Member")) {
				setMemberType("bni");
				const match = player.customData.match(/Chapter: ([^|]*)/);
				if (match) setChapterName(match[1]?.trim() || "");
				const bblMatch = player.customData.match(/BBL Seasons: ([^|]*)/);
				if (bblMatch) setBblSeasons(bblMatch[1]?.trim() || "");
			} else if (player.customData?.startsWith("Family Member")) {
				setMemberType("family");
				const match = player.customData.match(/BNI Name: ([^,]*), Chapter: ([^,]*), Rel: ([^|]*)/);
				if (match) {
					setBniName(match[1]?.trim() || "");
					setChapterName(match[2]?.trim() || "");
					setRelationship(match[3]?.trim() || "");
				}
				const bblMatch = player.customData.match(/BBL Seasons: ([^|]*)/);
				if (bblMatch) setBblSeasons(bblMatch[1]?.trim() || "");
			}
		}
	}, [open, player]);
	const [cropImageSrc, setCropImageSrc] = (0, import_react.useState)(null);
	const [zoom, setZoom] = (0, import_react.useState)(1);
	const [dragOffset, setDragOffset] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [dragStart, setDragStart] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const imgRef = (0, import_react.useRef)(null);
	const handlePhotoChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 10485760) {
				alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
				toast.error("Photo must be less than 10MB");
				e.target.value = "";
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				const rawDataUrl = reader.result;
				setSportFields((prev) => ({
					...prev,
					originalPhoto: rawDataUrl
				}));
				setPhoto(rawDataUrl);
				setCropImageSrc(rawDataUrl);
				setZoom(1);
				setDragOffset({
					x: 0,
					y: 0
				});
			};
			reader.readAsDataURL(file);
		}
	};
	const handlePaymentImageChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 10485760) {
				toast.error("Payment screenshot must be less than 10MB");
				e.target.value = "";
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				setPaymentImage(reader.result);
				setImgLoading(false);
				setImgError(false);
				if (!paymentMode) setPaymentMode("Online");
			};
			reader.readAsDataURL(file);
		}
	};
	const handleCropSave = () => {
		try {
			const canvas = document.createElement("canvas");
			canvas.width = 256;
			canvas.height = 256;
			const ctx = canvas.getContext("2d");
			const img = imgRef.current;
			if (ctx && img) {
				ctx.fillStyle = "#ffffff";
				ctx.fillRect(0, 0, 256, 256);
				const nW = img.naturalWidth;
				const nH = img.naturalHeight;
				let drawW = 288;
				let drawH = 288;
				if (nW > nH) {
					drawH = 288;
					drawW = 288 * (nW / nH);
				} else {
					drawW = 288;
					drawH = 288 * (nH / nW);
				}
				drawW *= zoom;
				drawH *= zoom;
				const containerCenter = 144;
				const drawX = containerCenter - drawW / 2 + dragOffset.x;
				const drawY = containerCenter - drawH / 2 + dragOffset.y;
				const scale = 256 / 288;
				ctx.drawImage(img, drawX * scale, drawY * scale, drawW * scale, drawH * scale);
				const croppedDataUrl = canvas.toDataURL("image/jpeg", .85);
				setPhoto(croppedDataUrl);
				setCropImageSrc(null);
			}
		} catch (err) {
			console.error("Failed to crop photo", err);
			toast.error("Using original photo directly.");
			setPhoto(cropImageSrc);
			setCropImageSrc(null);
		}
	};
	async function onSubmit(e) {
		e.preventDefault();
		if (!name.trim() || !phone.trim() || phone.trim().length !== 10) {
			toast.error("Please provide a valid name and exactly 10-digit phone number");
			return;
		}
		const trimmedPhone = phone.trim();
		if (players.some((p) => p.phone?.trim() === trimmedPhone && (!player || p.id !== player.id))) {
			setPhoneError("Duplicate phone number not allowed! This number is already registered in this auction.");
			toast.error("Duplicate phone number not allowed! This number is already registered in this auction.");
			return;
		}
		const isBniAuction = auctionId === "6a8edaddd7ed74151dbafab3";
		let customDataStr = customData;
		if (isBniAuction) {
			if (bblSeasons === "") {
				toast.error("Please select Number of BBL seasons played");
				return;
			}
			if (memberType === "bni" && !chapterName.trim()) {
				toast.error("Please provide Chapter Name");
				return;
			}
			if (memberType === "family" && (!bniName.trim() || !chapterName.trim() || !relationship)) {
				toast.error("Please provide BNI Name, Chapter Name and Relationship");
				return;
			}
			if (memberType === "bni") customDataStr = `BNI Member | Chapter: ${chapterName} | BBL Seasons: ${bblSeasons}`;
			else if (memberType === "family") customDataStr = `Family Member | BNI Name: ${bniName}, Chapter: ${chapterName}, Rel: ${relationship} | BBL Seasons: ${bblSeasons}`;
		} else {
			if (dominatedHand) customDataStr = `Dominated Hand: ${dominatedHand}`;
			if (utrNumber && utrNumber.length !== 12) {
				toast.error("UTR Number must be 12 digits if provided");
				return;
			}
		}
		const effectivePaymentMode = isBniAuction ? "" : paymentMode || (paymentImage ? "Online" : "");
		const updatedSportFields = {
			...sportFields,
			...position ? { role: position } : {},
			...dominatedHand ? { "Dominated Hand": dominatedHand } : {}
		};
		const input = {
			auctionId,
			name,
			phone,
			age: age ? parseInt(age) : null,
			category,
			gender,
			city,
			playerLevel,
			paymentMode: effectivePaymentMode,
			utrNumber: isBniAuction ? "" : utrNumber,
			paymentImage: isBniAuction ? null : paymentImage,
			baseValue: parseFloat(baseValue) || 0,
			jerseySize,
			jerseyName,
			trouserSize,
			customData: customDataStr,
			photo,
			sportFields: updatedSportFields
		};
		if (teamId && teamId !== "none") {
			const selectedTeam = teams.find((t) => t.id === teamId);
			const count = rosterCount(teamId);
			if (selectedTeam && count >= playersPerTeam) {
				toast.error("Max team reached");
				return;
			}
		}
		const updateExtras = {
			teamId: teamId === "none" ? null : teamId,
			soldPrice: teamId && teamId !== "none" && soldPrice ? parseFloat(soldPrice) : teamId === "none" ? null : soldPrice ? parseFloat(soldPrice) : null,
			auctionRoundStatus: teamId === "none" ? "pending" : "sold"
		};
		try {
			if (player) {
				await updatePlayer({
					id: player.id,
					patch: {
						...input,
						...updateExtras
					}
				});
				toast.success("Player updated successfully!");
			} else {
				await createPlayer(input);
				toast.success("Player added successfully!");
			}
			setOpen(false);
		} catch (error) {
			const msg = error instanceof Error ? error.message : "Failed to save player";
			if (msg.toLowerCase().includes("duplicate phone") || msg.toLowerCase().includes("already registered")) setPhoneError("Duplicate phone number not allowed! This number is already registered.");
			toast.error(msg);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: trigger !== void 0 ? trigger : !player ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				className: "fixed bottom-24 right-6 size-14 rounded-full shadow-2xl sm:bottom-8 sm:right-10 bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-[#ffffff] hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.7)] border-2 border-white/50 z-30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-7 stroke-[3]" })
			}) : null
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-[0_20px_60px_rgba(10,25,32,0.95)] p-6 sm:p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-2xl font-black text-[#ffffff] tracking-tight",
				children: player ? "Edit Player Details" : "Add New Player"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-6 pt-4 text-[#fffcf7]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center space-y-2 pb-2",
						children: [
							photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setCropImageSrc(photo);
										setZoom(1);
										setDragOffset({
											x: 0,
											y: 0
										});
									},
									className: "relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#a1b5d8]/40 bg-[#162235] hover:border-[#a1b5d8] transition-all group cursor-pointer shadow-md",
									title: "Crop / Zoom existing picture",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: photo,
										alt: "Player photo",
										className: "size-full object-cover object-top"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute inset-0 bg-[#171a1d]/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-5 text-[#a1b5d8] mb-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-black text-[#fffcf7] uppercase tracking-wider",
											children: "Crop/Zoom"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => document.getElementById("modal-player-photo")?.click(),
									className: "text-xs text-[#a1b5d8] hover:text-[#fffcf7] font-bold hover:underline transition-colors mt-0.5",
									children: "Upload New"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "modal-player-photo",
								className: "cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235]/60 hover:bg-[#162235] hover:border-[#a1b5d8] transition-colors shadow-inner",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-8 text-[#a1b5d8]" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-[#abb4bd] font-medium",
								children: "Player Photo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "modal-player-photo",
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: handlePhotoChange,
								disabled: isSubmitting
							})
						]
					}),
					isBni ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "name",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["NAME ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									placeholder: "e.g. Virat Kohli",
									value: name,
									onChange: (e) => setName(e.target.value),
									disabled: isSubmitting,
									required: true,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "phone",
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: ["PHONE (10 DIGITS) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-400 font-bold ml-0.5",
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "phone",
										placeholder: "e.g. 9876543210",
										value: phone,
										onChange: (e) => {
											setPhone(e.target.value);
											if (phoneError) setPhoneError("");
										},
										disabled: isSubmitting,
										maxLength: 10,
										required: true,
										className: `rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8] ${phoneError ? "border-red-500 ring-1 ring-red-500" : ""}`
									}),
									phoneError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-semibold text-red-400 mt-1 flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚠️" }),
											" ",
											phoneError
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "age",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["AGE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "age",
									type: "number",
									placeholder: "e.g. 27",
									value: age,
									onChange: (e) => setAge(e.target.value),
									disabled: isSubmitting,
									required: true,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["GENDER ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: gender,
									onValueChange: setGender,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Gender" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Male",
											className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
											children: "Male"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Female",
											className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
											children: "Female"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["CITY ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: city,
									onValueChange: setCity,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select City" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "vijayawada",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Vijayawada"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "tenali",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Tenali"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "guntur",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Guntur"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["PLAYER LEVEL ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: playerLevel,
									onValueChange: setPlayerLevel,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Level" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Beginner",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Beginner"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Intermediate",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Intermediate"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Advanced",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Advanced"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Professional",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Professional"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["GRADE / CATEGORY ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: category,
									onValueChange: setCategory,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Grade" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "A+",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "A+"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "A",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "A"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "B+",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "B+"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "B",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "B"
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "jerseySize",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["JERSEY SIZE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "jerseySize",
									placeholder: "e.g. M, L, XL",
									value: jerseySize,
									onChange: (e) => setJerseySize(e.target.value),
									disabled: isSubmitting,
									required: true,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "jerseyName",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["JERSEY NAME ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "jerseyName",
									placeholder: "e.g. Dhoni",
									value: jerseyName,
									onChange: (e) => setJerseyName(e.target.value),
									disabled: isSubmitting,
									required: true,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "trouserSize",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["JERSEY NUMBER ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "trouserSize",
									placeholder: "e.g. 7",
									value: trouserSize,
									onChange: (e) => setTrouserSize(e.target.value),
									disabled: isSubmitting,
									required: true,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["NUMBER OF SEASONS PLAYED ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: bblSeasons,
									onValueChange: setBblSeasons,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select seasons" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
										children: Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: String(i),
											className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
											children: i
										}, i))
									})]
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "name",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: ["Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									placeholder: "e.g. Virat Kohli",
									value: name,
									onChange: (e) => setName(e.target.value),
									disabled: isSubmitting,
									required: true,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "phone",
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: ["Phone (10 digits) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-400 font-bold ml-0.5",
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "phone",
										placeholder: "e.g. 9876543210",
										value: phone,
										onChange: (e) => {
											setPhone(e.target.value);
											if (phoneError) setPhoneError("");
										},
										disabled: isSubmitting,
										maxLength: 10,
										required: true,
										className: `rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8] ${phoneError ? "border-red-500 ring-1 ring-red-500" : ""}`
									}),
									phoneError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs font-semibold text-red-400 mt-1 flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚠️" }),
											" ",
											phoneError
										]
									})
								]
							}),
							!isJsc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Playing Position / Role"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: position,
									onValueChange: setPosition,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Position / Role" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
										children: config.roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: r,
											className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
											children: r
										}, r))
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Dominated Hand"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: dominatedHand,
									onValueChange: setDominatedHand,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Dominated Hand" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Right Hand",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Right Hand"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Left Hand",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Left Hand"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Both Hands",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Both Hands"
											})
										]
									})]
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "age",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Age"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "age",
									type: "number",
									placeholder: "e.g. 27",
									value: age,
									onChange: (e) => setAge(e.target.value),
									disabled: isSubmitting,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Grade / Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: category,
									onValueChange: setCategory,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Grade" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "A+",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "A+"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "A",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "A"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "B+",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "B+"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "B",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "B"
											}),
											!isJsc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "C",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "C"
											})
										]
									})]
								})]
							}),
							!isJsc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "baseValue",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Base Value (Points)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "baseValue",
									type: "number",
									placeholder: "e.g. 500",
									value: baseValue,
									onChange: (e) => setBaseValue(e.target.value),
									disabled: isSubmitting,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
								})]
							}),
							!isHunterzVolleyball && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: "Gender"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: gender,
										onValueChange: setGender,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Gender" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
											className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Male",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Male"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Female",
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: "Female"
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "city",
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: "City"
									}), isJsc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: city || "vijayawada",
										onValueChange: setCity,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select City" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
											className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "vijayawada",
													className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
													children: "Vijayawada"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "tenali",
													className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
													children: "Tenali"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "guntur",
													className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
													children: "Guntur"
												})
											]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "city",
										placeholder: "e.g. Mumbai",
										value: city,
										onChange: (e) => setCity(e.target.value),
										disabled: isSubmitting,
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: "Player Level"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: playerLevel,
										onValueChange: setPlayerLevel,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Level" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
											className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Beginner",
													className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
													children: "Beginner"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Intermediate",
													className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
													children: "Intermediate"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Advanced",
													className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
													children: "Advanced"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Professional",
													className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
													children: "Professional"
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "jerseySize",
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: "Jersey Size"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "jerseySize",
										placeholder: "e.g. M, L, XL",
										value: jerseySize,
										onChange: (e) => setJerseySize(e.target.value),
										disabled: isSubmitting,
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
									})]
								}),
								!isJsc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "jerseyName",
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: "Jersey Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "jerseyName",
										placeholder: "e.g. DHONI",
										value: jerseyName,
										onChange: (e) => setJerseyName(e.target.value),
										disabled: isSubmitting,
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "trouserSize",
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: "Jersey Number / Trouser"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "trouserSize",
										placeholder: "e.g. 7",
										value: trouserSize,
										onChange: (e) => setTrouserSize(e.target.value),
										disabled: isSubmitting,
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
									})]
								})] })
							] })
						]
					}),
					isBni && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/40 p-5 space-y-4 text-[#fffcf7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-base text-[#fffcf7]",
							children: "Membership Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
									value: memberType,
									onValueChange: (val) => {
										setMemberType(val);
										if (!player) {
											setChapterName("");
											setBniName("");
											setRelationship("");
										}
									},
									className: "flex gap-6",
									disabled: isSubmitting,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center space-x-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
											value: "bni",
											id: "modal-r-bni",
											className: "border-[#5c6875] text-[#a1b5d8] focus:ring-[#a1b5d8]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "modal-r-bni",
											className: "cursor-pointer text-sm font-semibold text-[#fffcf7]",
											children: "BNI Member"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center space-x-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
											value: "family",
											id: "modal-r-family",
											className: "border-[#5c6875] text-[#a1b5d8] focus:ring-[#a1b5d8]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "modal-r-family",
											className: "cursor-pointer text-sm font-semibold text-[#fffcf7]",
											children: "Family Member"
										})]
									})]
								}),
								memberType === "bni" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 pt-2 animate-in fade-in",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
										children: ["Chapter Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-400 font-bold ml-0.5",
											children: "*"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: chapterName,
										onValueChange: setChapterName,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Chapter" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
											className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
											children: Array.from(/* @__PURE__ */ new Set([...CHAPTERS, ...chapterName ? [chapterName] : []])).map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: ch,
												className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
												children: ch
											}, ch))
										})]
									})]
								}),
								memberType === "family" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2 animate-in fade-in",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "bniName",
												className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
												children: ["Member Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-400 font-bold ml-0.5",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "bniName",
												placeholder: "e.g. John Doe",
												value: bniName,
												onChange: (e) => setBniName(e.target.value),
												disabled: isSubmitting,
												required: true,
												className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
												children: ["Chapter Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-400 font-bold ml-0.5",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: chapterName,
												onValueChange: setChapterName,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Chapter" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
													className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
													children: Array.from(/* @__PURE__ */ new Set([...CHAPTERS, ...chapterName ? [chapterName] : []])).map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: ch,
														className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
														children: ch
													}, ch))
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
												children: ["Relationship ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-400 font-bold ml-0.5",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: relationship,
												onValueChange: setRelationship,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Relationship" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
													className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "Child",
															className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
															children: "Child"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "Spouse",
															className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
															children: "Spouse"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "Parents",
															className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
															children: "Parents"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "Siblings",
															className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
															children: "Siblings"
														})
													]
												})]
											})]
										})
									]
								})
							]
						})]
					}),
					!hidePayment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/40 p-5 space-y-4 text-[#fffcf7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-base text-[#fffcf7]",
								children: "Payment Details"
							}), paymentImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-[#c2d8b9] bg-[#23341d]/70 border border-[#47673a] px-2.5 py-0.5 rounded-full flex items-center gap-1",
								children: "Screenshot Uploaded"
							})]
						}), loadingFullDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm text-[#abb4bd] pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-[#a1b5d8]" }), "Loading payment details..."]
						}) : paymentImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Payment Screenshot"
								}), paymentImage.startsWith("http") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: paymentImage,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-xs text-[#a1b5d8] hover:underline flex items-center gap-1 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" }), " Open in New Tab"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full max-w-sm rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] p-3 shadow-md space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative w-full h-48 rounded-xl overflow-hidden bg-[#162235] flex items-center justify-center border border-[#5c6875]/30",
										children: [imgLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute inset-0 flex flex-col items-center justify-center bg-[#162235]/80 backdrop-blur-xs z-10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-[#a1b5d8] mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-[#abb4bd]",
												children: "Loading image..."
											})]
										}), imgError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center justify-center p-4 text-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-7 text-amber-400 mb-1" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-bold text-[#fffcf7]",
													children: "Preview unavailable"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-[#abb4bd] mt-0.5",
													children: "Image URL is valid but preview failed to render in browser"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: paymentImage,
													target: "_blank",
													rel: "noopener noreferrer",
													className: "text-xs text-[#a1b5d8] hover:underline mt-2 font-medium flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" }), " View Image URL directly"]
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: paymentImage,
											alt: "Payment screenshot",
											className: `size-full object-contain cursor-pointer hover:opacity-95 transition-opacity ${imgLoading ? "opacity-0" : "opacity-100"}`,
											onLoad: () => setImgLoading(false),
											onError: () => {
												setImgLoading(false);
												setImgError(true);
											},
											onClick: () => window.open(paymentImage, "_blank"),
											title: "Click to open full screenshot"
										})]
									}),
									paymentImage.startsWith("http") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-[11px] text-[#abb4bd]",
											children: "Image URL"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl bg-[#2e343a]/70 px-2.5 py-1.5 flex items-center justify-between gap-2 border border-[#5c6875]/40 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: paymentImage,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "text-[#a1b5d8] hover:underline truncate font-mono select-all cursor-pointer font-medium",
												title: "Click to redirect to image URL",
												children: paymentImage
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													className: "h-6 px-1.5 text-[11px] text-[#abb4bd] hover:text-[#fffcf7]",
													onClick: () => {
														navigator.clipboard.writeText(paymentImage);
														toast.success("Image URL copied to clipboard");
													},
													title: "Copy URL",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													className: "h-6 px-1.5 text-[11px] text-[#abb4bd] hover:text-[#fffcf7]",
													onClick: () => window.open(paymentImage, "_blank"),
													title: "Open URL in new tab",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })
												})]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pt-1.5 border-t border-[#5c6875]/30 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "modalPaymentImageChangeInput",
											className: "cursor-pointer font-bold text-[#a1b5d8] hover:underline flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-[#a1b5d8]/10 transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3" }), " Change Screenshot"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "ghost",
											size: "sm",
											className: "h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-destructive/10",
											onClick: () => {
												setPaymentImage(null);
												setImgLoading(false);
												setImgError(false);
											},
											children: "Remove"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "modalPaymentImageChangeInput",
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: handlePaymentImageChange,
										disabled: isSubmitting
									})
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#abb4bd]",
								children: "No payment screenshot uploaded."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "modalPaymentImageUpload",
								className: "flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235]/60 hover:bg-[#162235] hover:border-[#a1b5d8] transition-colors cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "size-8 text-[#a1b5d8] mb-1.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold text-[#fffcf7]",
										children: "Upload Screenshot / Update Here"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-[#abb4bd] mt-0.5",
										children: "Click to browse image (JPEG, PNG up to 10MB)"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "modalPaymentImageUpload",
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: handlePaymentImageChange,
								disabled: isSubmitting
							})] })]
						})]
					}),
					player && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/40 p-5 space-y-4 text-[#fffcf7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-base text-[#fffcf7]",
							children: "Manual Team & Price Assignment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Sold To Team"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: teamId,
									onValueChange: setTeamId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Unsold / Available" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "none",
											className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
											children: "Unsold / Available"
										}), teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: t.id,
											className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
											children: t.name
										}, t.id))]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "soldPrice",
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Sold Price (Points)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "soldPrice",
									type: "number",
									placeholder: "e.g. 1200",
									value: soldPrice,
									onChange: (e) => setSoldPrice(e.target.value),
									disabled: isSubmitting,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-3 pt-4 border-t border-[#38bdf8]/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setOpen(false),
							disabled: isSubmitting,
							className: "rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#203f4f] transition-all font-bold px-6 shadow-sm",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: isSubmitting,
							className: "rounded-full px-7 py-2.5 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30",
							children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Saving..."] }) : "Save Player"
						})]
					})
				]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!cropImageSrc,
		onOpenChange: (open) => {
			if (!open) setCropImageSrc(null);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md flex flex-col items-center rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-2xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-xl font-black text-[#fffcf7] tracking-tight",
					children: "Crop Profile Photo"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mt-4 flex items-center justify-center bg-[#2e343a]/40 p-6 rounded-2xl w-full border border-[#5c6875]/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative size-72 rounded-full overflow-hidden border-4 border-[#a1b5d8] bg-black select-none cursor-move shadow-xl",
						onPointerDown: (e) => {
							setIsDragging(true);
							setDragStart({
								x: e.clientX - dragOffset.x,
								y: e.clientY - dragOffset.y
							});
							e.currentTarget.setPointerCapture(e.pointerId);
						},
						onPointerMove: (e) => {
							if (!isDragging) return;
							setDragOffset({
								x: e.clientX - dragStart.x,
								y: e.clientY - dragStart.y
							});
						},
						onPointerUp: (e) => {
							setIsDragging(false);
							e.currentTarget.releasePointerCapture(e.pointerId);
						},
						children: cropImageSrc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							ref: imgRef,
							src: cropImageSrc,
							crossOrigin: "anonymous",
							alt: "Crop preview",
							className: "pointer-events-none select-none max-w-none origin-center",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover",
								transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom})`
							}
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full space-y-4 px-4 mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
							children: "Zoom"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: "1",
							max: "3",
							step: "0.05",
							value: zoom,
							onChange: (e) => setZoom(parseFloat(e.target.value)),
							className: "w-full accent-[#a1b5d8] h-1.5 bg-[#2e343a] rounded-lg appearance-none cursor-pointer"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setCropImageSrc(null),
							className: "rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#203f4f] transition-all font-bold px-6 py-2 shadow-sm",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: handleCropSave,
							className: "rounded-full px-6 py-2 font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.6)]",
							children: "Save Photo"
						})]
					})]
				})
			]
		})
	})] });
}
//#endregion
export { TeamFormModal as a, PlayerPreviewCard as i, Countdown as n, PlayerFormModal as r, AboutTab as t };
