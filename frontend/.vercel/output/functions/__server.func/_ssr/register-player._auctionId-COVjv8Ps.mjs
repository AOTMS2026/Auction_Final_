import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as Pencil, D as Plus, R as LoaderCircle, dt as CircleCheck, st as CloudUpload } from "../_libs/lucide-react.mjs";
import { a as SiteHeader } from "./SiteHeader-yG2LLCbm.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
import { n as Label, t as Input } from "./input-BifiwAc8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, s as usePlayers, t as Select } from "./select-CBTHEQ7z.mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-CCY-ptI1.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C2cO245r.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as SPORT_CONFIGS } from "./player-CH8bdjpo.mjs";
import { t as Route } from "./register-player._auctionId-DaZaLZSH.mjs";
import { t as image_default } from "./image-Cs-CoWcz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-player._auctionId-COVjv8Ps.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function PlayerRegistrationPage() {
	const loaderData = Route.useLoaderData();
	const { auctionId } = Route.useParams();
	const { data: auction, isPending, isError, refetch } = useQuery({
		queryKey: ["public-auction", auctionId],
		queryFn: () => auctionClient.getById(auctionId),
		initialData: loaderData?.auction ?? void 0,
		retry: 2
	});
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [age, setAge] = (0, import_react.useState)("");
	const [gender, setGender] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("vijayawada");
	const [playerLevel, setPlayerLevel] = (0, import_react.useState)("");
	const [baseValue, setBaseValue] = (0, import_react.useState)("0");
	const [jerseySize, setJerseySize] = (0, import_react.useState)("");
	const [jerseyName, setJerseyName] = (0, import_react.useState)("");
	const [trouserSize, setTrouserSize] = (0, import_react.useState)("");
	const [position, setPosition] = (0, import_react.useState)("");
	const [dominatedHand, setDominatedHand] = (0, import_react.useState)("");
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [sportFields, setSportFields] = (0, import_react.useState)({});
	const [paymentMode, setPaymentMode] = (0, import_react.useState)("Online");
	const [utrNumber, setUtrNumber] = (0, import_react.useState)("");
	const [paymentImage, setPaymentImage] = (0, import_react.useState)(null);
	const [memberType, setMemberType] = (0, import_react.useState)("");
	const [chapterName, setChapterName] = (0, import_react.useState)("");
	const [bniName, setBniName] = (0, import_react.useState)("");
	const [relationship, setRelationship] = (0, import_react.useState)("");
	const [bblSeasons, setBblSeasons] = (0, import_react.useState)("");
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
	if (isPending && !auction) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 flex flex-col items-center justify-center p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-brand mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading registration details..."
			})]
		})]
	});
	if (isError || !auction) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 flex flex-col items-center justify-center p-4 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md w-full bg-card rounded-2xl p-8 card-shadow border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold text-foreground mb-2",
						children: "Auction Not Available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mb-6",
						children: "This auction registration link may be expired, invalid, or temporarily unavailable."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => refetch(),
							children: "Try Again"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "Go Home"
							})
						})]
					})
				]
			})
		})]
	});
	SPORT_CONFIGS[auction.sportType] || SPORT_CONFIGS["cricket"];
	const isBniAuction = auction.id === "6a8edaddd7ed74151dbafab3" || auction.name?.toLowerCase().includes("bni") || auction.name?.toLowerCase().includes("bbl");
	const isHunterzVolleyball = auction.id === "6a8a705aef1f9e0978b3031c" || auction.name?.toLowerCase().includes("hunterz");
	auction.id;
	const [phoneError, setPhoneError] = (0, import_react.useState)("");
	const { players } = usePlayers(auction.id);
	const registerMutation = useMutation({
		mutationFn: (input) => auctionClient.registerPlayer(input),
		onSuccess: () => {
			setSuccess(true);
			toast.success("Successfully registered for the auction!");
		},
		onError: (error) => {
			const msg = error instanceof Error ? error.message : "Failed to register. Please try again.";
			if (msg.toLowerCase().includes("duplicate phone") || msg.toLowerCase().includes("already registered")) setPhoneError("Duplicate phone number not allowed! This phone number is already registered.");
			toast.error(msg);
		}
	});
	const handlePaymentImageChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 10485760) {
				alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
				toast.error("Image must be less than 10MB");
				e.target.value = "";
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				setPaymentImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
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
	const onSubmit = (e) => {
		e.preventDefault();
		if (!name.trim() || !phone.trim() || phone.trim().length !== 10) {
			toast.error("Please provide a valid name and exactly 10-digit phone number");
			return;
		}
		const trimmedPhone = phone.trim();
		if (players?.some((p) => p.phone?.trim() === trimmedPhone)) {
			setPhoneError("Duplicate phone number not allowed! This number is already registered in this auction.");
			toast.error("Duplicate phone number not allowed! This number is already registered in this auction.");
			return;
		}
		if (!age) {
			toast.error("Please provide your age");
			return;
		}
		if (!photo) {
			toast.error("Please upload player photo");
			return;
		}
		if (isHunterzVolleyball) {
			if (!position) {
				toast.error("Please select Playing Position / Role");
				return;
			}
			if (!dominatedHand) {
				toast.error("Please select Dominated Hand");
				return;
			}
		} else {
			if (!gender || !city || !playerLevel) {
				toast.error("Please fill in all personal details");
				return;
			}
			if (!jerseySize) {
				toast.error("Please fill in Jersey Size");
				return;
			}
		}
		if (!isBniAuction && !isHunterzVolleyball && !paymentImage) {
			toast.error("Please upload the payment screenshot");
			return;
		}
		let customDataStr = "";
		const updatedSportFields = { ...sportFields };
		if (isHunterzVolleyball) {
			customDataStr = `Dominated Hand: ${dominatedHand}`;
			updatedSportFields["role"] = position;
			updatedSportFields["Dominated Hand"] = dominatedHand;
		} else if (isBniAuction) {
			if (!jerseyName.trim()) {
				toast.error("Please fill in Jersey Name");
				return;
			}
			if (!trouserSize.trim()) {
				toast.error("Please fill in Jersey Number");
				return;
			}
			if (bblSeasons === "") {
				toast.error("Please select Number of seasons played");
				return;
			}
			if (!memberType) {
				toast.error("Please select a membership type");
				return;
			}
			if (memberType === "bni" && !chapterName.trim()) {
				toast.error("Please provide Chapter Name");
				return;
			}
			if (memberType === "family" && (!bniName.trim() || !chapterName.trim() || !relationship)) {
				toast.error("Please provide Member Name, Chapter Name and Relationship");
				return;
			}
			if (memberType === "bni") customDataStr = `BNI Member | Chapter: ${chapterName} | BBL Seasons: ${bblSeasons}`;
			else if (memberType === "family") customDataStr = `Family Member | BNI Name: ${bniName}, Chapter: ${chapterName}, Rel: ${relationship} | BBL Seasons: ${bblSeasons}`;
		}
		const input = {
			auctionId: auction.id,
			name: name.trim(),
			phone: phone.trim(),
			age: age ? parseInt(age) : null,
			gender: isHunterzVolleyball ? "" : gender,
			city: isHunterzVolleyball ? "" : city,
			playerLevel: isHunterzVolleyball ? "" : playerLevel,
			paymentMode: isHunterzVolleyball || isBniAuction ? "" : paymentMode,
			utrNumber: isHunterzVolleyball || isBniAuction ? "" : utrNumber,
			paymentImage: isHunterzVolleyball || isBniAuction ? null : paymentImage,
			baseValue: isHunterzVolleyball ? 5e3 : parseFloat(baseValue) || 0,
			jerseySize: isHunterzVolleyball ? "" : jerseySize,
			jerseyName: isHunterzVolleyball || !isBniAuction ? "" : jerseyName,
			trouserSize: isHunterzVolleyball || !isBniAuction ? "" : trouserSize,
			customData: customDataStr,
			photo,
			sportFields: updatedSportFields
		};
		registerMutation.mutate(input);
	};
	if (success) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#ffffff] flex flex-col selection:bg-[#38bdf8] selection:text-[#ffffff]",
		style: { background: "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 flex items-center justify-center p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md w-full bg-[#162a34]/95 rounded-3xl p-8 text-center border-2 border-emerald-400 shadow-[0_20px_60px_rgba(15,35,45,0.9)] backdrop-blur-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto size-16 bg-emerald-950/80 text-emerald-400 border-2 border-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.5)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-10" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-black text-[#ffffff] mb-2 tracking-tight drop-shadow-sm",
						children: "Registration Complete!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[#f2e9dc]/80 mb-6 font-medium",
						children: [
							"You have successfully registered for ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#38bdf8]",
								children: auction.name
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full rounded-full py-3.5 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-[1.01] transition-all border border-white/30",
						onClick: () => window.location.href = "/",
						children: "Return Home"
					})
				]
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#ffffff] flex flex-col selection:bg-[#38bdf8] selection:text-[#ffffff]",
		style: { background: "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative isolate overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: auction.coverImage || "/assets/stadium-band-BhUy9ADj.jpg",
						alt: "",
						"aria-hidden": "true",
						className: "absolute inset-0 size-full object-cover blur-sm scale-105 opacity-40"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-[#142630]/80 via-[#142630]/90 to-[#142630]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-3xl px-4 py-12 text-center text-[#ffffff] flex flex-col items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-4 sm:gap-6 mb-6 flex-wrap",
								children: [
									isBniAuction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/assets/bni-logo-DWlAik22.png",
										alt: "BNI Logo",
										className: "h-24 sm:h-28 w-auto rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl object-contain bg-black p-2"
									}),
									isBniAuction ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: image_default,
										alt: "BNI Poster",
										className: "h-24 sm:h-28 w-auto rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl object-contain bg-white p-1 shrink-0"
									}) : auction.coverImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: auction.coverImage,
										alt: auction.name,
										className: "size-24 sm:size-28 rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl object-cover bg-muted shrink-0"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-24 sm:size-28 rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl bg-[#142630] flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl sm:text-3xl font-black text-[#38bdf8]",
											children: auction.name.substring(0, 2).toUpperCase()
										})
									}),
									isBniAuction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/assets/another-AZwXa6Vm.jpeg",
										alt: "Another Logo",
										className: "h-24 sm:h-28 w-auto rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl object-contain bg-white p-2"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-black sm:text-5xl mb-3 tracking-tight drop-shadow-md uppercase text-[#ffffff]",
								children: "PLAYER REGISTRATION"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-base sm:text-lg text-[#f2e9dc]/80 font-medium tracking-wide",
								children: ["Register as a player for ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#38bdf8] font-black",
									children: auction.name
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 max-w-3xl w-full mx-auto p-4 -mt-6 relative z-10 mb-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-[#162a34]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border-2 border-[#38bdf8]/40 shadow-[0_20px_60px_rgba(15,35,45,0.9)] text-[#ffffff]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center space-y-2 pb-2",
								children: [
									photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												const basePhoto = sportFields["originalPhoto"] || photo;
												setCropImageSrc(basePhoto);
												setZoom(1);
												setDragOffset({
													x: 0,
													y: 0
												});
											},
											className: "relative flex size-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#38bdf8]/60 bg-[#142630] hover:border-[#38bdf8] transition-all group cursor-pointer shadow-md",
											title: "Crop / Zoom existing picture",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: photo,
												alt: "Player photo",
												className: "size-full object-cover object-top"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "absolute inset-0 bg-[#142630]/75 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-5 text-[#38bdf8] mb-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-black text-[#ffffff] uppercase tracking-wider",
													children: "Crop/Zoom"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => document.getElementById("player-photo")?.click(),
											className: "text-xs text-[#38bdf8] hover:text-[#ffffff] font-bold hover:underline transition-colors mt-0.5",
											children: "Upload New"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "player-photo",
										className: "cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative flex size-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#38bdf8]/50 bg-[#142630]/70 hover:bg-[#142630] hover:border-[#38bdf8] transition-colors shadow-inner",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-8 text-[#38bdf8]" })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-[#38bdf8] font-bold",
										children: [
											"Player Photo ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-400 font-bold ml-0.5",
												children: "*"
											}),
											" (up to 10MB)"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "player-photo",
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: handlePhotoChange,
										disabled: registerMutation.isPending
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "name",
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: ["NAME ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-400 font-bold ml-0.5",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "name",
											placeholder: "e.g. Virat Kohli",
											value: name,
											onChange: (e) => setName(e.target.value),
											disabled: registerMutation.isPending,
											required: true,
											className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "phone",
												className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
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
												disabled: registerMutation.isPending,
												maxLength: 10,
												required: true,
												className: `rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold ${phoneError ? "border-red-500 ring-1 ring-red-500" : ""}`
											}),
											phoneError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs font-bold text-red-400 mt-1 flex items-center gap-1",
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
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
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
											disabled: registerMutation.isPending,
											required: true,
											className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
										})]
									}),
									isHunterzVolleyball && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: ["PLAYING POSITION / ROLE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-400 font-bold ml-0.5",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: position,
											onValueChange: setPosition,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Position / Role" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												className: "rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]",
												children: [
													"Attacker",
													"Setter",
													"Blocker",
													"Universal",
													"Libero",
													"Spiker"
												].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: r,
													className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
													children: r
												}, r))
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: ["DOMINATED HAND ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-400 font-bold ml-0.5",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: dominatedHand,
											onValueChange: setDominatedHand,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Dominated Hand" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
												className: "rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Right Hand",
														className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
														children: "Right Hand"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Left Hand",
														className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
														children: "Left Hand"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Both Hands",
														className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
														children: "Both Hands"
													})
												]
											})]
										})]
									})] }),
									!isHunterzVolleyball && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
												children: ["GENDER ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-400 font-bold ml-0.5",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: gender,
												onValueChange: setGender,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Gender" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
													className: "rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Male",
														className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
														children: "Male"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Female",
														className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
														children: "Female"
													})]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
												children: ["CITY ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-400 font-bold ml-0.5",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: city,
												onValueChange: setCity,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select City" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
													className: "rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "vijayawada",
															className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
															children: "Vijayawada"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "tenali",
															className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
															children: "Tenali"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "guntur",
															className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
															children: "Guntur"
														})
													]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
												children: ["PLAYER LEVEL ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-400 font-bold ml-0.5",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: playerLevel,
												onValueChange: setPlayerLevel,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Level" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
													className: "rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "Beginner",
															className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
															children: "Beginner"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "Intermediate",
															className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
															children: "Intermediate"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "Advanced",
															className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
															children: "Advanced"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "Professional",
															className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
															children: "Professional"
														})
													]
												})]
											})]
										})
									] })
								]
							}),
							!isHunterzVolleyball && (isBniAuction ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "jerseySize",
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: ["JERSEY SIZE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-400 font-bold ml-0.5",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "jerseySize",
											placeholder: "e.g. M, L, XL",
											value: jerseySize,
											onChange: (e) => setJerseySize(e.target.value),
											disabled: registerMutation.isPending,
											required: true,
											className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "jerseyName",
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: ["JERSEY NAME ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-400 font-bold ml-0.5",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "jerseyName",
											placeholder: "e.g. Dhoni",
											value: jerseyName,
											onChange: (e) => setJerseyName(e.target.value),
											disabled: registerMutation.isPending,
											required: true,
											className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "trouserSize",
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: ["JERSEY NUMBER ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-400 font-bold ml-0.5",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "trouserSize",
											placeholder: "e.g. 7",
											value: trouserSize,
											onChange: (e) => setTrouserSize(e.target.value),
											disabled: registerMutation.isPending,
											required: true,
											className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: ["NUMBER OF SEASONS PLAYED ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-red-400 font-bold ml-0.5",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: bblSeasons,
											onValueChange: setBblSeasons,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select seasons" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												className: "rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]",
												children: Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: String(i),
													className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
													children: i
												}, i))
											})]
										})]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									htmlFor: "jerseySize",
									className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
									children: ["JERSEY SIZE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-400 font-bold ml-0.5",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "jerseySize",
									placeholder: "e.g. M, L, XL",
									value: jerseySize,
									onChange: (e) => setJerseySize(e.target.value),
									disabled: registerMutation.isPending,
									required: true,
									className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
								})]
							})),
							isBniAuction && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border-2 border-[#38bdf8]/35 bg-[#142630]/90 p-5 space-y-4 text-[#ffffff]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-black text-base text-[#ffffff]",
									children: "Membership Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
											value: memberType,
											onValueChange: (val) => {
												setMemberType(val);
												setChapterName("");
												setBniName("");
												setRelationship("");
											},
											className: "flex gap-6",
											disabled: registerMutation.isPending,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center space-x-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
													value: "bni",
													id: "r-bni",
													className: "border-2 border-[#38bdf8] text-[#38bdf8] focus:ring-[#38bdf8]"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "r-bni",
													className: "cursor-pointer text-sm font-black text-[#ffffff]",
													children: "BNI Member"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center space-x-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
													value: "family",
													id: "r-family",
													className: "border-2 border-[#38bdf8] text-[#38bdf8] focus:ring-[#38bdf8]"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "r-family",
													className: "cursor-pointer text-sm font-black text-[#ffffff]",
													children: "Family Member"
												})]
											})]
										}),
										memberType === "bni" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 pt-2 animate-in fade-in",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
												children: ["Chapter Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-red-400 font-bold ml-0.5",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: chapterName,
												onValueChange: setChapterName,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Chapter" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
													className: "rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]",
													children: CHAPTERS.map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: ch,
														className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
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
														className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
														children: ["Member Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-red-400 font-bold ml-0.5",
															children: "*"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "bniName",
														placeholder: "e.g. John Doe",
														value: bniName,
														onChange: (e) => setBniName(e.target.value),
														disabled: registerMutation.isPending,
														required: true,
														className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
														className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
														children: ["Chapter Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-red-400 font-bold ml-0.5",
															children: "*"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: chapterName,
														onValueChange: setChapterName,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Chapter" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
															className: "rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]",
															children: CHAPTERS.map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: ch,
																className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
																children: ch
															}, ch))
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
														className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
														children: ["Relationship ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-red-400 font-bold ml-0.5",
															children: "*"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: relationship,
														onValueChange: setRelationship,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Relationship" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
															className: "rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "Child",
																	className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
																	children: "Child"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "Spouse",
																	className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
																	children: "Spouse"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "Parents",
																	className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
																	children: "Parents"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																	value: "Siblings",
																	className: "hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold",
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
							!isBniAuction && !isHunterzVolleyball && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border-2 border-[#38bdf8]/35 bg-[#142630]/90 p-5 space-y-4 text-[#ffffff]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-black text-base text-[#ffffff]",
									children: "Payment Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "paymentImage",
										className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
										children: ["Payment Screenshot ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-red-400 font-bold ml-0.5",
											children: "*"
										})]
									}), paymentImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative w-full max-w-sm group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: paymentImage,
											alt: "Payment screenshot",
											className: "rounded-2xl border-2 border-[#38bdf8]/50 object-contain w-full h-48 bg-[#142630] shadow-md"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "destructive",
											size: "sm",
											className: "absolute top-2 right-2 rounded-full opacity-90 hover:opacity-100 shadow-md",
											onClick: () => setPaymentImage(null),
											children: "Remove"
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "paymentImage",
										className: "flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-[#38bdf8]/50 bg-[#142630]/70 hover:bg-[#142630] hover:border-[#38bdf8] transition-colors cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "size-8 text-[#38bdf8] mb-1.5" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-black text-[#ffffff]",
												children: "Click to upload screenshot"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-[#f2e9dc]/70 mt-0.5",
												children: "JPEG, PNG up to 10MB"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "paymentImage",
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: handlePaymentImageChange,
										disabled: registerMutation.isPending,
										required: true
									})] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "w-full rounded-full py-4 h-auto font-black text-base text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-[1.01] transition-all border border-white/30 cursor-pointer",
									disabled: registerMutation.isPending,
									children: registerMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-5 animate-spin" }), " Submitting..."] }) : "Submit Registration"
								})
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!cropImageSrc,
				onOpenChange: (open) => {
					if (!open) setCropImageSrc(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md flex flex-col items-center rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-2xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-xl font-black text-[#ffffff] tracking-tight",
							children: "Crop Profile Photo"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative mt-4 flex items-center justify-center bg-[#162a34] p-6 rounded-2xl w-full border-2 border-[#38bdf8]/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative size-72 rounded-full overflow-hidden border-4 border-[#38bdf8] bg-black select-none cursor-move shadow-xl",
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
									className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
									children: "Zoom"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: "1",
									max: "3",
									step: "0.05",
									value: zoom,
									onChange: (e) => setZoom(parseFloat(e.target.value)),
									className: "w-full accent-[#38bdf8] h-1.5 bg-[#162a34] rounded-lg appearance-none cursor-pointer"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setCropImageSrc(null),
									className: "rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#ffffff] hover:bg-[#1f3a47] font-bold",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									onClick: handleCropSave,
									className: "rounded-full px-6 py-2.5 font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_15px_rgba(249,115,22,0.6)]",
									children: "Save Photo"
								})]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PlayerRegistrationPage as component };
