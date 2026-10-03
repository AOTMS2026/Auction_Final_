import { o as __toESM } from "../_runtime.mjs";
import { r as cn } from "./auth-client-0cXNnUku.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as Pencil, R as LoaderCircle, dt as CircleCheck, st as CloudUpload } from "../_libs/lucide-react.mjs";
import { a as SiteHeader } from "./SiteHeader-yG2LLCbm.mjs";
import { t as Skeleton } from "./skeleton-CFtqm2zk.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
import { n as Label, t as Input } from "./input-BifiwAc8.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C2cO245r.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as image_default } from "./image-Cs-CoWcz.mjs";
import { t as Route } from "./register-team._auctionId-BV5CeuF8.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-team._auctionId-Mv3zdUNN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
function PublicRegisterTeamPage() {
	const { auctionId } = Route.useParams();
	const { data: auction, isPending, isError } = useQuery({
		queryKey: ["public-auction", auctionId],
		queryFn: () => auctionClient.getById(auctionId),
		retry: 1
	});
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [shortName, setShortName] = (0, import_react.useState)("");
	const [ownerName, setOwnerName] = (0, import_react.useState)("");
	const [ownerPhone, setOwnerPhone] = (0, import_react.useState)("");
	const [colorTheme, setColorTheme] = (0, import_react.useState)("");
	const [logo, setLogo] = (0, import_react.useState)(null);
	const [originalLogo, setOriginalLogo] = (0, import_react.useState)(null);
	const [cropImageSrc, setCropImageSrc] = (0, import_react.useState)(null);
	const [zoom, setZoom] = (0, import_react.useState)([1]);
	const [dragOffset, setDragOffset] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const dragStartPos = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const imageRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const registerMutation = useMutation({
		mutationFn: (input) => auctionClient.registerTeam(input),
		onSuccess: () => {
			setSuccess(true);
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Failed to register team. Try again.");
		}
	});
	const handlePhotoChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			if (file.size / 1024 / 1024 > 10) {
				alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
				toast.error("Logo must be less than 10MB.");
				e.target.value = "";
				return;
			}
			const reader = new FileReader();
			reader.onload = (event) => {
				const rawDataUrl = event.target?.result;
				setOriginalLogo(rawDataUrl);
				setLogo(rawDataUrl);
				setCropImageSrc(rawDataUrl);
				setZoom([1]);
				setDragOffset({
					x: 0,
					y: 0
				});
			};
			reader.readAsDataURL(file);
		}
	};
	const handlePointerDown = (e) => {
		setIsDragging(true);
		dragStartPos.current = {
			x: e.clientX - dragOffset.x,
			y: e.clientY - dragOffset.y
		};
	};
	const handlePointerMove = (e) => {
		if (!isDragging) return;
		setDragOffset({
			x: e.clientX - dragStartPos.current.x,
			y: e.clientY - dragStartPos.current.y
		});
	};
	const handlePointerUp = () => setIsDragging(false);
	const performCrop = () => {
		if (!imageRef.current || !cropImageSrc) return;
		const canvas = document.createElement("canvas");
		canvas.width = 256;
		canvas.height = 256;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		try {
			const img = imageRef.current;
			const nW = img.naturalWidth;
			const nH = img.naturalHeight;
			if (!nW || !nH) {
				setLogo(cropImageSrc);
				setCropImageSrc(null);
				return;
			}
			ctx.fillStyle = "transparent";
			ctx.fillRect(0, 0, 256, 256);
			let drawW = 288;
			let drawH = 288;
			if (nW > nH) {
				drawH = 288;
				drawW = 288 * (nW / nH);
			} else {
				drawW = 288;
				drawH = 288 * (nH / nW);
			}
			drawW *= zoom[0] ?? 1;
			drawH *= zoom[0] ?? 1;
			const containerCenter = 144;
			const drawX = containerCenter - drawW / 2 + dragOffset.x;
			const drawY = containerCenter - drawH / 2 + dragOffset.y;
			const scale = 256 / 288;
			ctx.drawImage(img, drawX * scale, drawY * scale, drawW * scale, drawH * scale);
			const croppedDataUrl = canvas.toDataURL("image/png", 1);
			setLogo(croppedDataUrl);
			setCropImageSrc(null);
		} catch (err) {
			toast.error("Using original photo directly.");
			setLogo(cropImageSrc);
			setCropImageSrc(null);
		}
	};
	const onSubmit = (e) => {
		e.preventDefault();
		if (!name.trim() || !shortName.trim() || !ownerName.trim() || !ownerPhone.trim() || !colorTheme.trim()) {
			toast.error("Please fill in all team details");
			return;
		}
		if (!logo) {
			toast.error("Please upload a team logo");
			return;
		}
		const input = {
			auctionId: auction.id,
			name,
			shortName,
			ownerName,
			ownerPhone,
			colorTheme,
			logo
		};
		registerMutation.mutate(input);
	};
	if (success && auction) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							"You have successfully registered the team ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#38bdf8]",
								children: name
							}),
							" for ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#38bdf8]",
								children: auction.name
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setSuccess(false),
							className: "w-full rounded-full py-3.5 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-[1.01] transition-all border border-white/30",
							children: "Register Another Team"
						})
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
						src: auction?.coverImage || "/assets/stadium-band-BhUy9ADj.jpg",
						alt: "",
						"aria-hidden": "true",
						className: "absolute inset-0 size-full object-cover blur-sm scale-105 opacity-40"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-[#142630]/80 via-[#142630]/90 to-[#142630]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative mx-auto max-w-3xl px-4 py-12 text-center text-[#ffffff] flex flex-col items-center",
						children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-24 sm:size-28 rounded-2xl bg-white/20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64 bg-white/20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-48 bg-white/20" })
							]
						}) : isError || !auction ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-24 sm:size-28 rounded-2xl border-4 border-white/20 bg-destructive/20 flex items-center justify-center text-destructive font-bold text-3xl",
								children: "?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-bold text-white mb-2",
								children: "Auction Not Found"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-4 sm:gap-6 mb-6 flex-wrap",
								children: [
									auction.id === "6a8edaddd7ed74151dbafab3" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/assets/bni-logo-DWlAik22.png",
										alt: "BNI Logo",
										className: "h-24 sm:h-28 w-auto rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl object-contain bg-black p-2"
									}),
									auction.id === "6a8edaddd7ed74151dbafab3" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
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
									auction.id === "6a8edaddd7ed74151dbafab3" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/assets/another-AZwXa6Vm.jpeg",
										alt: "Another Logo",
										className: "h-24 sm:h-28 w-auto rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl object-contain bg-white p-2"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-black sm:text-5xl mb-3 tracking-tight drop-shadow-md uppercase text-[#ffffff]",
								children: "TEAM REGISTRATION"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-base sm:text-lg text-[#f2e9dc]/80 font-medium tracking-wide",
								children: ["Register your team for ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#38bdf8] font-black",
									children: auction.name
								})]
							})
						] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 mx-auto max-w-3xl w-full px-4 py-8 sm:py-10 -mt-6 relative z-10",
				children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 bg-[#162a34]/95 p-6 sm:p-8 rounded-3xl border-2 border-[#38bdf8]/40 card-shadow",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" })
					]
				}) : isError || !auction ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-[#162a34]/95 p-8 rounded-3xl border-2 border-destructive/40 text-center card-shadow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-destructive font-medium",
						children: "Please check the link and try again."
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#162a34]/95 backdrop-blur-xl rounded-3xl border-2 border-[#38bdf8]/40 shadow-[0_20px_60px_rgba(15,35,45,0.9)] overflow-hidden text-[#ffffff]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-[#142630]/80 border-b border-[#38bdf8]/30 p-4 sm:p-6 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[#f2e9dc]/80 text-sm font-medium",
							children: ["Register your team to participate in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#38bdf8]",
								children: auction.name
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "p-6 sm:p-8 space-y-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative group",
										children: [logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												if (originalLogo) {
													setCropImageSrc(originalLogo);
													setZoom([1]);
													setDragOffset({
														x: 0,
														y: 0
													});
												}
											},
											className: "relative flex size-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#38bdf8]/60 bg-[#142630] hover:border-[#38bdf8] transition-all group cursor-pointer shadow-md",
											title: "Crop / Zoom existing picture",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: logo,
												alt: "Team Logo",
												className: "size-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "absolute inset-0 bg-[#142630]/75 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-6 text-[#38bdf8] mb-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-black text-[#ffffff] uppercase tracking-wider",
													children: "Crop/Zoom"
												})]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "team-logo",
											className: "relative flex size-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#38bdf8]/50 bg-[#142630]/70 hover:bg-[#142630] hover:border-[#38bdf8] transition-colors",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col items-center justify-center space-y-2 p-4 text-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "size-8 text-[#38bdf8]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-[#38bdf8] uppercase tracking-wider font-bold",
													children: "Upload Logo * (up to 10MB)"
												})]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "team-logo",
											type: "file",
											accept: "image/*",
											className: "hidden",
											ref: fileInputRef,
											onChange: handlePhotoChange,
											disabled: registerMutation.isPending
										})]
									}), logo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => fileInputRef.current?.click(),
										className: "text-xs text-[#38bdf8] hover:text-[#ffffff] font-bold hover:underline transition-colors mt-1",
										children: "Upload New"
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-6 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "name",
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: "Team Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "name",
											placeholder: "e.g. Chennai Super Kings",
											value: name,
											onChange: (e) => setName(e.target.value),
											disabled: registerMutation.isPending,
											required: true,
											className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "shortName",
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: "Short Name (Code) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "shortName",
											placeholder: "e.g. CSK",
											value: shortName,
											onChange: (e) => setShortName(e.target.value),
											disabled: registerMutation.isPending,
											required: true,
											maxLength: 5,
											className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ownerName",
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: "Owner/Franchisee Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "ownerName",
											placeholder: "e.g. N. Srinivasan",
											value: ownerName,
											onChange: (e) => setOwnerName(e.target.value),
											disabled: registerMutation.isPending,
											required: true,
											className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ownerPhone",
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: "Contact Number *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "ownerPhone",
											placeholder: "e.g. 9876543210",
											value: ownerPhone,
											onChange: (e) => setOwnerPhone(e.target.value),
											disabled: registerMutation.isPending,
											required: true,
											className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "colorTheme",
											className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
											children: "Team Color/Theme *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "colorTheme",
											placeholder: "e.g. Yellow & Blue",
											value: colorTheme,
											onChange: (e) => setColorTheme(e.target.value),
											disabled: registerMutation.isPending,
											required: true,
											className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full rounded-full py-4 h-auto font-black text-base text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-[1.01] transition-all border border-white/30 cursor-pointer",
								disabled: registerMutation.isPending,
								children: registerMutation.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-5 animate-spin" }), " Submitting..."] }) : "Submit Team Registration"
							})
						})]
					})]
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
							children: "Crop Team Logo"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 w-72 h-72 bg-black relative overflow-hidden rounded-2xl border-4 border-[#38bdf8] cursor-move touch-none shadow-xl",
							onPointerDown: handlePointerDown,
							onPointerMove: handlePointerMove,
							onPointerUp: handlePointerUp,
							onPointerLeave: handlePointerUp,
							children: [cropImageSrc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								ref: imageRef,
								src: cropImageSrc,
								alt: "Crop preview",
								className: "absolute origin-top-left pointer-events-none select-none max-w-none",
								style: {
									transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom[0]})`,
									opacity: isDragging ? .8 : 1
								},
								draggable: false
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 pointer-events-none border-[4px] border-white/20 rounded-2xl box-border" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-[288px] mt-6 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
								children: "Zoom"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								value: zoom,
								min: .5,
								max: 3,
								step: .1,
								onValueChange: setZoom,
								className: "flex-1"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "w-full sm:justify-between mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setCropImageSrc(null),
								className: "rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#ffffff] hover:bg-[#1f3a47] font-bold",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: performCrop,
								className: "rounded-full px-6 py-2.5 font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_15px_rgba(249,115,22,0.6)]",
								children: "Save Logo"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PublicRegisterTeamPage as component };
