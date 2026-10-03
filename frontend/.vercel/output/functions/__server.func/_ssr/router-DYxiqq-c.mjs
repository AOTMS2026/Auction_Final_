import { o as __toESM } from "../_runtime.mjs";
import { n as authClient, r as cn } from "./auth-client-0cXNnUku.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as redirect, N as notFound, _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime, k as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as CanvasTexture, c as CurvePath, d as MeshBasicMaterial, f as MeshStandardMaterial, g as Vector3, h as Vector2, i as useThree, l as LineCurve3, m as RepeatWrapping, n as Canvas, o as Color, p as QuadraticBezierCurve3, r as useFrame, s as Curve, t as ContactShadows, u as MathUtils } from "../_libs/@react-three/drei+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as useQueryClient, i as QueryClientProvider, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { $ as Facebook, A as Pencil, Ct as Bookmark, D as Plus, E as Radio, F as MapPin, G as ImagePlus, I as Mail, J as Gavel, K as House, M as MicVocal, O as Play, R as LoaderCircle, V as LayoutGrid, W as Instagram, Y as Gauge, _ as Smartphone, _t as ChevronRight, a as User, b as ShieldCheck, bt as Check, et as Eye, g as Sparkles, i as Users, it as Earth, k as Phone, l as Tv, m as Star, mt as CircleArrowDown, p as Trash2, pt as CircleArrowUp, r as Wallet, t as Youtube, tt as EyeOff, ut as CirclePlus, vt as ChevronLeft, wt as BadgeCheck, x as Share2, xt as Calendar, yt as ChevronDown, z as ListOrdered } from "../_libs/lucide-react.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as SiteHeader, o as useAuth } from "./SiteHeader-yG2LLCbm.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AlertDialogTrigger, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as stadium_band_default } from "./alert-dialog-VY8twHzw.mjs";
import { t as Skeleton } from "./skeleton-CFtqm2zk.mjs";
import { t as auctionClient } from "./auction-client-DHDPHVYT.mjs";
import { n as auctionKeys, r as auctionListQueryOptions, t as auctionDetailQueryOptions } from "./auctions-CnIaKf3e.mjs";
import { t as FallbackImage } from "./fallback-image-CwnNUhIA.mjs";
import { n as buttonVariants, t as Button } from "./button-sM6yADNO.mjs";
import { n as Label, t as Input } from "./input-BifiwAc8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CBTHEQ7z.mjs";
import { a as objectType, o as stringType, t as booleanType } from "../_libs/zod.mjs";
import { a as sportTypeLabels, i as auctionFormSchema, n as SPORT_TYPES, o as visibilityLabels, r as VISIBILITIES, t as Route$12 } from "./auctions._id-Byu_RkE7.mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-CCY-ptI1.mjs";
import { n as fileToCompressedDataUrl, t as IMAGE_PRESETS } from "./image-DJ08YD9d.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { d as format, o as isFuture, r as isToday } from "../_libs/date-fns.mjs";
import { i as useMyAuctions, n as AuctionCardSkeleton, t as AuctionCard } from "./AuctionCard-C7BX8VLP.mjs";
import { t as Route$13 } from "./my-auctions._id.auctioneer-D9apJimA.mjs";
import { t as Route$14 } from "./my-auctions._id.index-CrjZDi3B.mjs";
import { t as Route$15 } from "./players._phone-CwfNcPQv.mjs";
import { t as Route$16 } from "./register-player._auctionId-DaZaLZSH.mjs";
import { t as Route$17 } from "./register-team._auctionId-BV5CeuF8.mjs";
import { t as motion } from "../_libs/framer-motion+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { t as confetti_module_default } from "../_libs/canvas-confetti.mjs";
import { t as NumberFlow } from "../_libs/number-flow+number-flow__react.mjs";
import { a as useFormContext, i as useForm, n as Controller, r as FormProvider, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as getDefaultClassNames, t as DayPicker } from "../_libs/react-day-picker.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DYxiqq-c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CZC1n_9X.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var tabs = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/my-auctions",
		label: "My Auction",
		icon: Gavel
	},
	{
		to: "/bookmarks",
		label: "Bookmarks",
		icon: Bookmark
	},
	{
		to: "/auctioneer",
		label: "Auctioneer",
		icon: MicVocal
	},
	{
		to: "/profile",
		label: "Profile",
		icon: User
	}
];
function BottomNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card md:hidden",
		"aria-label": "Primary",
		children: tabs.map(({ to, label, icon: Icon }) => {
			const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to,
				className: cn("flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium", active ? "text-brand" : "text-muted-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-5",
					"aria-hidden": "true"
				}), label]
			}, to);
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "PitchBid — Live Cricket Auction Platform" },
			{
				name: "description",
				content: "Host live cricket player auctions with real-time bidding, team purses and instant squads."
			},
			{
				property: "og:title",
				content: "PitchBid — Live Cricket Auction Platform"
			},
			{
				property: "og:description",
				content: "Host live cricket player auctions with real-time bidding, team purses and instant squads."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap"
			},
			{
				rel: "icon",
				href: "/new_logo.jpg",
				type: "image/jpeg"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			suppressHydrationWarning: true,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	const router = useRouter();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const showBottomNav = !(pathname.startsWith("/my-auctions") || pathname.startsWith("/auctions") || pathname.startsWith("/register-") || pathname.startsWith("/auctioneer") || pathname.startsWith("/bookmarks") || pathname.startsWith("/profile") || pathname === "/auth");
	(0, import_react.useEffect)(() => {
		return authClient.onAuthChange(() => {
			router.invalidate();
			queryClient.invalidateQueries();
		});
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: showBottomNav ? "pb-16 md:pb-0" : void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			showBottomNav && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				richColors: true,
				position: "top-center"
			})
		]
	});
}
var HeartCurve = class extends Curve {
	constructor() {
		super();
	}
	getPoint(t, optionalTarget = new Vector3()) {
		t = t * Math.PI * 2;
		const x = 16 * Math.pow(Math.sin(t), 3);
		const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
		return optionalTarget.set(x * .002, (y + 6) * .002, 0);
	}
};
var sharedHeartCurve = new HeartCurve();
function ResponsiveGroup({ children, scale = 1 }) {
	const { viewport } = useThree();
	const w = viewport.width > 0 ? viewport.width : 3.5;
	const s = Math.min(1.1, Math.max(.55, w / 3.5)) * scale;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		scale: s,
		children
	});
}
function GlassCapsule({ color, power, intensity }) {
	const materialRef = (0, import_react.useRef)(null);
	const uniforms = (0, import_react.useMemo)(() => ({
		color: { value: new Color("#ffffff") },
		power: { value: 2.5 },
		intensity: { value: .6 }
	}), []);
	useFrame(() => {
		if (materialRef.current?.uniforms) {
			const u = materialRef.current.uniforms;
			if (u["color"]?.value) u["color"].value.set(color);
			if (u["power"]) u["power"].value = power;
			if (u["intensity"]) u["intensity"].value = intensity;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
		.3,
		64,
		64,
		0,
		Math.PI * 2,
		0,
		Math.PI
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("shaderMaterial", {
		ref: materialRef,
		uniforms,
		vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
		fragmentShader: `
          uniform vec3 color;
          uniform float power;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
            fresnel = pow(max(fresnel, 0.0001), power);
            gl_FragColor = vec4(color, fresnel * intensity);
          }
        `,
		transparent: true,
		blending: 2,
		depthWrite: false
	})] });
}
var earBaseMat = new MeshStandardMaterial({
	color: "#f5f5f5",
	roughness: .4
});
var earRingMat = new MeshStandardMaterial({
	color: "#ffffff",
	roughness: .2
});
var earCenterMat = new MeshStandardMaterial({
	color: "#e0e0e0",
	roughness: .7
});
var antennaBaseMat = new MeshStandardMaterial({
	color: "#cccccc",
	roughness: .3,
	metalness: .4
});
var antennaStickMat = new MeshStandardMaterial({
	color: "#e8e8e8",
	roughness: .3,
	metalness: .2
});
var antennaTipMat = new MeshStandardMaterial({
	color: "#ff3366",
	roughness: .2,
	toneMapped: false
});
function RobotEar({ position, scale = 1, isLeft = false }) {
	const dir = isLeft ? -1 : 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		scale,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				castShadow: true,
				receiveShadow: true,
				material: earBaseMat,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.04,
					.04,
					.025,
					32
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					dir * .012,
					0,
					0
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				castShadow: true,
				receiveShadow: true,
				material: earRingMat,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.032,
					.008,
					16,
					32
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				position: [
					dir * .012,
					0,
					0
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				castShadow: true,
				receiveShadow: true,
				material: earCenterMat,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.03,
					.03,
					.005,
					32
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					dir * .015,
					.035,
					0
				],
				rotation: [
					-.4,
					0,
					0
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						position: [
							0,
							.01,
							0
						],
						castShadow: true,
						receiveShadow: true,
						material: antennaBaseMat,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
							.006,
							.008,
							.02,
							16
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						position: [
							0,
							.06,
							0
						],
						castShadow: true,
						receiveShadow: true,
						material: antennaStickMat,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
							.003,
							.003,
							.1,
							8
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						position: [
							0,
							.11,
							0
						],
						castShadow: true,
						receiveShadow: true,
						material: antennaTipMat,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							.006,
							16,
							16
						] })
					})
				]
			})
		]
	});
}
var eyeMat = new MeshBasicMaterial({
	color: new Color(0, 3, 2.5),
	toneMapped: false,
	transparent: true
});
var heartMat = new MeshBasicMaterial({
	color: "#ff3366",
	toneMapped: false
});
function RobotEye({ position, rotation, scale = 1, blinkDuration = .15, blinkCycle = 3, isLovedRef }) {
	const groupRef = (0, import_react.useRef)(null);
	const normalEyesRef = (0, import_react.useRef)(null);
	const heartEyeRef = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (!groupRef.current || !normalEyesRef.current || !heartEyeRef.current) return;
		const isHeart = isLovedRef.current;
		normalEyesRef.current.visible = !isHeart;
		heartEyeRef.current.visible = isHeart;
		const cycle = clock.getElapsedTime() % blinkCycle;
		let targetScaleY = 1;
		if (cycle < blinkDuration && !isHeart) {
			const progress = cycle / blinkDuration;
			const blinkClose = Math.sin(progress * Math.PI);
			targetScaleY = Math.max(.05, 1 - blinkClose);
		}
		groupRef.current.scale.set(scale, scale * targetScaleY, scale);
	});
	const { topPath, bottomPath } = (0, import_react.useMemo)(() => {
		const w = .025;
		const h = .035;
		const g = .005;
		const tPath = new CurvePath();
		tPath.add(new LineCurve3(new Vector3(-.025, g, 0), new Vector3(-.025, .015000000000000003, 0)));
		tPath.add(new QuadraticBezierCurve3(new Vector3(-.025, .015000000000000003, 0), new Vector3(-.025, h, 0), new Vector3(-.005000000000000001, h, 0)));
		tPath.add(new LineCurve3(new Vector3(-.005000000000000001, h, 0), new Vector3(.005000000000000001, h, 0)));
		tPath.add(new QuadraticBezierCurve3(new Vector3(.005000000000000001, h, 0), new Vector3(w, h, 0), new Vector3(w, .015000000000000003, 0)));
		tPath.add(new LineCurve3(new Vector3(w, .015000000000000003, 0), new Vector3(w, g, 0)));
		const bPath = new CurvePath();
		bPath.add(new LineCurve3(new Vector3(-.025, -.005, 0), new Vector3(-.025, -.015000000000000003, 0)));
		bPath.add(new QuadraticBezierCurve3(new Vector3(-.025, -.015000000000000003, 0), new Vector3(-.025, -.035, 0), new Vector3(-.005000000000000001, -.035, 0)));
		bPath.add(new LineCurve3(new Vector3(-.005000000000000001, -.035, 0), new Vector3(.005000000000000001, -.035, 0)));
		bPath.add(new QuadraticBezierCurve3(new Vector3(.005000000000000001, -.035, 0), new Vector3(w, -.035, 0), new Vector3(w, -.015000000000000003, 0)));
		bPath.add(new LineCurve3(new Vector3(w, -.015000000000000003, 0), new Vector3(w, -.005, 0)));
		return {
			topPath: tPath,
			bottomPath: bPath
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: groupRef,
		position,
		rotation,
		scale,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			ref: heartEyeRef,
			visible: false,
			material: heartMat,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tubeGeometry", { args: [
				sharedHeartCurve,
				64,
				.0035,
				8,
				true
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: normalEyesRef,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: eyeMat,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tubeGeometry", { args: [
					topPath,
					20,
					.0035,
					8,
					false
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
				material: eyeMat,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tubeGeometry", { args: [
					bottomPath,
					20,
					.0035,
					8,
					false
				] })
			})]
		})]
	});
}
function generatePbrTextures() {
	const size = 256;
	const canvasC = document.createElement("canvas");
	const canvasB = document.createElement("canvas");
	canvasC.width = canvasB.width = size;
	canvasC.height = canvasB.height = size;
	const ctxC = canvasC.getContext("2d");
	const ctxB = canvasB.getContext("2d");
	if (ctxC && ctxB) {
		ctxC.fillStyle = "#e5e5e5";
		ctxC.fillRect(0, 0, size, size);
		ctxB.fillStyle = "#888888";
		ctxB.fillRect(0, 0, size, size);
		for (let i = 0; i < 6e3; i++) {
			const x = Math.random() * size;
			const y = Math.random() * size;
			const r = .5 + Math.random() * 1.5;
			const isDark = Math.random() > .3;
			ctxC.beginPath();
			ctxC.arc(x, y, r, 0, Math.PI * 2);
			ctxC.fillStyle = isDark ? "#888888" : "#ffffff";
			ctxC.fill();
			ctxB.beginPath();
			ctxB.arc(x, y, r, 0, Math.PI * 2);
			ctxB.fillStyle = isDark ? "#333333" : "#ffffff";
			ctxB.fill();
		}
	}
	const texC = new CanvasTexture(canvasC);
	const texB = new CanvasTexture(canvasB);
	texC.wrapS = texB.wrapS = RepeatWrapping;
	texC.wrapT = texB.wrapT = RepeatWrapping;
	texC.repeat.set(6, 3);
	texB.repeat.set(6, 3);
	texC.needsUpdate = true;
	texB.needsUpdate = true;
	return {
		colorMap: texC,
		bumpMap: texB
	};
}
function RobotPrototype({ neckParams = {
	baseR: .25,
	baseH: -.01,
	midR: .23,
	midH: .02,
	lipBottomR: .27,
	lipBottomH: .025,
	lipTopR: .28,
	lipTopH: .05,
	innerR: .24,
	innerDropH: .03
}, bodyParams = {
	bodyBevelR: .21,
	bodyBevelY: .38,
	bodyBevelT: .015
}, color = "#ececec", pantallaColor = "#00ffc6", pantallaBrillo = 1.2, blinkCycle = 3, metalness = 0 }) {
	const isLovedRef = (0, import_react.useRef)(false);
	const timeoutRef = (0, import_react.useRef)(null);
	const bodyRef = (0, import_react.useRef)(null);
	const headRef = (0, import_react.useRef)(null);
	const textures = (0, import_react.useMemo)(() => {
		if (typeof document === "undefined") return null;
		try {
			return generatePbrTextures();
		} catch {
			return null;
		}
	}, []);
	const design = {
		pantallaColor,
		pantallaGrosor: 3.8,
		pantallaBrillo,
		separacionOjos: .07,
		tamañoOrejas: 1.3,
		escalaOjos: 1.1,
		parpadeoFrecuencia: blinkCycle,
		parpadeoDuracion: .45,
		colorChasis: color,
		alturaCabeza: .6
	};
	const config = {
		moveSpeed: .35,
		bodyRotSpeed: 10,
		headRotSpeed: 20,
		bodyTiltX: 0,
		bodyTiltY: .95,
		headLookX: .3,
		headLookY: 1.8
	};
	useFrame((state, delta) => {
		if (!bodyRef.current || !headRef.current) return;
		const dt = Math.min(Math.max(delta || 0, 0), .1);
		const tx = typeof state.pointer?.x === "number" && !isNaN(state.pointer.x) ? state.pointer.x : 0;
		const ty = typeof state.pointer?.y === "number" && !isNaN(state.pointer.y) ? state.pointer.y : 0;
		const targetPosX = tx * ((state.viewport.width > 0 ? state.viewport.width : 3.5) / 3.5);
		bodyRef.current.position.x = MathUtils.lerp(bodyRef.current.position.x, targetPosX, config.moveSpeed * dt);
		const relativeX = tx - bodyRef.current.position.x / 2.5;
		const bodyTargetRotY = -relativeX * config.bodyTiltY;
		const bodyTargetRotX = relativeX * relativeX * config.bodyTiltX - ty * .25;
		const bodyTargetRotZ = -relativeX * .15;
		bodyRef.current.rotation.y = MathUtils.lerp(bodyRef.current.rotation.y, bodyTargetRotY, config.bodyRotSpeed * dt);
		bodyRef.current.rotation.x = MathUtils.lerp(bodyRef.current.rotation.x, bodyTargetRotX, config.bodyRotSpeed * dt);
		bodyRef.current.rotation.z = MathUtils.lerp(bodyRef.current.rotation.z, bodyTargetRotZ, config.bodyRotSpeed * dt);
		const headTargetRotY = relativeX * config.headLookY;
		const headTargetRotX = -ty * config.headLookX;
		headRef.current.rotation.y = MathUtils.lerp(headRef.current.rotation.y, headTargetRotY, config.headRotSpeed * dt);
		headRef.current.rotation.x = MathUtils.lerp(headRef.current.rotation.x, headTargetRotX, config.headRotSpeed * dt);
	});
	const handlePointerDown = (e) => {
		e.stopPropagation();
		isLovedRef.current = true;
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			isLovedRef.current = false;
		}, 2e3);
	};
	const neckProfile = (0, import_react.useMemo)(() => {
		const points = [];
		points.push(new Vector2(neckParams.innerR, neckParams.baseH));
		points.push(new Vector2(neckParams.baseR, neckParams.baseH));
		points.push(new Vector2(neckParams.midR, neckParams.midH));
		points.push(new Vector2(neckParams.lipBottomR, neckParams.lipBottomH));
		points.push(new Vector2(neckParams.lipTopR, neckParams.lipTopH));
		points.push(new Vector2(neckParams.innerR, neckParams.lipTopH));
		points.push(new Vector2(neckParams.innerR, neckParams.lipTopH - neckParams.innerDropH));
		return points;
	}, [neckParams]);
	const headMat = (0, import_react.useMemo)(() => {
		return new MeshStandardMaterial({
			color: "#111111",
			roughness: .7,
			metalness: .1
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: bodyRef,
		position: [
			0,
			-.3,
			0
		],
		onPointerDown: handlePointerDown,
		onPointerOver: () => document.body.style.cursor = "pointer",
		onPointerOut: () => document.body.style.cursor = "auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.43,
					64,
					64,
					0,
					Math.PI * 2,
					Math.PI * .15,
					Math.PI * .85
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: design.colorChasis,
					map: textures?.colorMap ?? null,
					bumpMap: textures?.bumpMap ?? null,
					bumpScale: .005,
					roughness: .9,
					metalness,
					envMapIntensity: .2
				})]
			}),
			bodyParams.bodyBevelT > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					bodyParams.bodyBevelY,
					0
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				castShadow: true,
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					bodyParams.bodyBevelR,
					bodyParams.bodyBevelT,
					32,
					64
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: design.colorChasis,
					map: textures?.colorMap ?? null,
					bumpMap: textures?.bumpMap ?? null,
					bumpScale: .005,
					roughness: .9,
					metalness,
					envMapIntensity: .2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.38,
					0
				],
				receiveShadow: true,
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("latheGeometry", { args: [neckProfile, 64] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: design.colorChasis,
					map: textures?.colorMap ?? null,
					bumpMap: textures?.bumpMap ?? null,
					bumpScale: .005,
					roughness: .9,
					metalness,
					envMapIntensity: .2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: headRef,
				position: [
					0,
					design.alturaCabeza,
					0
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
						material: headMat,
						castShadow: true,
						receiveShadow: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							.28,
							64,
							64,
							0,
							Math.PI * 2,
							0,
							Math.PI
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCapsule, {
						color: design.pantallaColor,
						power: design.pantallaGrosor,
						intensity: design.pantallaBrillo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
						position: [
							0,
							-.02,
							.29
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RobotEye, {
							position: [
								-design.separacionOjos,
								0,
								0
							],
							rotation: [
								0,
								-.2,
								0
							],
							scale: design.escalaOjos,
							blinkDuration: design.parpadeoDuracion,
							blinkCycle: design.parpadeoFrecuencia,
							isLovedRef
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RobotEye, {
							position: [
								design.separacionOjos,
								0,
								0
							],
							rotation: [
								0,
								.2,
								0
							],
							scale: design.escalaOjos,
							blinkDuration: design.parpadeoDuracion,
							blinkCycle: design.parpadeoFrecuencia,
							isLovedRef
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RobotEar, {
						position: [
							-.29,
							0,
							0
						],
						isLeft: true,
						scale: design.tamañoOrejas
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RobotEar, {
						position: [
							.29,
							0,
							0
						],
						isLeft: false,
						scale: design.tamañoOrejas
					})
				]
			})
		]
	});
}
function RobotHero({ backgroundText = "AUCTION", subtitle = "Live cricket auction platform for real-time player bidding", color = "#f2ede4", scale = 1, pantallaColor = "#38bdf8", pantallaBrillo = 2.6, blinkCycle = 3, metalness = .25, startAuctionHref = "#today", newAuctionTo = "/my-auctions/new" } = {}) {
	const containerRef = (0, import_react.useRef)(null);
	const [isClient, setIsClient] = (0, import_react.useState)(false);
	const [isInView, setIsInView] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setIsClient(true);
		if (!containerRef.current) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry) setIsInView(entry.isIntersecting);
		}, { threshold: .05 });
		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref: containerRef,
		className: "relative w-full h-[620px] md:h-[720px] min-h-[550px] overflow-hidden select-none",
		style: { background: "radial-gradient(ellipse at 50% 25%, #1e424c 0%, #17323b 35%, #122126 70%, #0d1518 100%)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(56,189,248,0.35)_0%,rgba(249,115,22,0.25)_35%,transparent_72%)] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(50,106,122,0.45)_0%,rgba(30,55,64,0.35)_48%,transparent_75%)] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,rgba(242,233,220,0.22)_0%,transparent_58%)] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(to_bottom,rgba(13,21,24,0.25)_0%,transparent_20%,transparent_80%,rgba(13,21,24,0.5)_100%)] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-8 md:top-10 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#142832]/95 border-2 border-[#38bdf8]/60 backdrop-blur-md shadow-[0_0_25px_rgba(56,189,248,0.45)] mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex h-2.5 w-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f97316] opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f97316]" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-black tracking-widest uppercase text-[#ffffff]",
							children: "Live Cricket Arena"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm md:text-base font-bold text-[#ffffff] max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] mb-5",
						children: subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-4 pointer-events-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: startAuctionHref,
							className: "group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#d16919] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_30px_rgba(249,115,22,0.65)] hover:shadow-[0_0_45px_rgba(249,115,22,0.9)] hover:scale-105 transition-all duration-300 border border-[#ffffff]/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex items-center justify-center size-6 rounded-full bg-[#ffffff]/25 text-[#ffffff]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5 fill-current ml-0.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Start Auction" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: newAuctionTo,
							className: "group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full font-bold text-sm text-[#ffffff] bg-[#162c36]/95 hover:bg-[#1e4454] border-2 border-[#38bdf8]/70 hover:border-[#ffffff] shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.65)] hover:scale-105 transition-all duration-300 backdrop-blur-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex items-center justify-center size-6 rounded-full bg-[#38bdf8]/25 text-[#f97316] group-hover:bg-[#ffffff]/25 group-hover:text-[#ffffff] transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New Auction" })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden",
				style: { zIndex: 0 },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-sans font-black select-none whitespace-nowrap tracking-tighter uppercase",
					style: {
						color: "#f2e9dc",
						opacity: .12,
						letterSpacing: "-0.04em",
						fontSize: "clamp(5rem, 19vw, 18rem)",
						lineHeight: 1,
						transform: "translate(0px, 40px)",
						textShadow: "0 0 100px rgba(56, 189, 248, 0.65), 0 0 40px rgba(249, 115, 22, 0.35)"
					},
					children: backgroundText
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-10",
				children: isClient && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
					shadows: true,
					frameloop: isInView ? "always" : "never",
					dpr: [1, 1.5],
					gl: {
						powerPreference: "high-performance",
						antialias: true,
						alpha: true
					},
					camera: {
						position: [
							0,
							.2,
							6
						],
						fov: 40
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
							intensity: 1.35,
							color: "#ffffff"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
							position: [
								3,
								8,
								5
							],
							intensity: 2.3,
							color: "#ffffff",
							castShadow: true,
							"shadow-mapSize": [1024, 1024],
							"shadow-bias": -5e-4,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("orthographicCamera", {
								attach: "shadow-camera",
								args: [
									-1.5,
									1.5,
									1.5,
									-1.5,
									.1,
									20
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
							position: [
								-4,
								3,
								-2
							],
							intensity: 1.5,
							color: "#38bdf8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
							position: [
								0,
								4,
								-5
							],
							intensity: 1.5,
							color: "#f97316"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: null,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ResponsiveGroup, {
								scale,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactShadows, {
									position: [
										0,
										-.79,
										0
									],
									opacity: .75,
									scale: 12,
									resolution: 512,
									frames: 1,
									blur: 2.2,
									far: 2.5,
									color: "#0a0d0f"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RobotPrototype, {
									neckParams: {
										baseR: .215,
										baseH: -.05,
										midR: .28,
										midH: .02,
										lipBottomR: .295,
										lipBottomH: .045,
										lipTopR: .27,
										lipTopH: .055,
										innerR: .1,
										innerDropH: 0
									},
									bodyParams: {
										bodyBevelR: .235,
										bodyBevelY: .34,
										bodyBevelT: .025
									},
									color,
									pantallaColor,
									pantallaBrillo,
									blinkCycle,
									metalness
								})]
							})
						})
					]
				})
			})
		]
	});
}
var settings = {
	backgroundText: "AUCTION",
	subtitle: "Live cricket auction platform for real-time player bidding",
	color: "#f2ede4",
	scale: 1,
	pantallaColor: "#38bdf8",
	pantallaBrillo: 2.6,
	blinkCycle: 3,
	metalness: .25
};
function Demo(props) {
	const s = {
		...settings,
		...props
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full min-h-[550px] overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RobotHero, { ...s })
	});
}
var step_create_default = "/assets/step-create-hFmpGoPD.jpg";
var step_teams_default = "/assets/step-teams-Dvl4Kzqt.jpg";
var step_players_default = "/assets/step-players-CbbcDj66.jpg";
var step_bid_default = "/assets/step-bid-aB38BEzP.jpg";
function SectionHeading({ lead, highlight, subtitle, tone = "dark" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto mb-8 max-w-2xl text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-3.5 size-7 rotate-45 rounded-md bg-gradient-to-tr from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] shadow-[0_0_20px_rgba(161,181,216,0.5)] border border-[#fffcf7]/30",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "section-title text-[#fffcf7] font-black tracking-tight drop-shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[#a1b5d8]",
						children: lead
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-gradient-to-r from-[#fffcf7] via-[#ecf0f7] to-[#a1b5d8] bg-clip-text text-transparent",
						children: highlight
					})
				]
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: tone === "light" ? "mt-2.5 text-sm md:text-base text-[#dae2ef]/90 font-medium max-w-xl mx-auto leading-relaxed" : "mt-2.5 text-sm md:text-base text-[#abb4bd] font-medium max-w-xl mx-auto leading-relaxed",
				children: subtitle
			})
		]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative text-[#ecf0f7] overflow-hidden border-t border-[#5c6875]/30 shadow-[0_-4px_35px_rgba(15,18,20,0.8)]",
		style: { background: "linear-gradient(135deg, #0f1214 0%, #171a1d 35%, #1c2227 75%, #162235 100%)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#a1b5d8]/50 to-transparent pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(161,181,216,0.12)_0%,transparent_70%)] pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "display text-3xl text-[#fffcf7] font-black tracking-wide",
							children: ["Pitch", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#a1b5d8] drop-shadow-[0_0_15px_rgba(161,181,216,0.5)]",
								children: "Bid"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3.5 max-w-xs text-sm text-[#abb4bd] leading-relaxed",
							children: "World-class cricket player auction platform for local & league tournaments — teams, budgets, real-time bids and squad rosters."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#",
									"aria-label": "Facebook",
									className: "rounded-full bg-[#162235] hover:bg-[#2d436a] p-2.5 text-[#a1b5d8] hover:text-[#fffcf7] border border-[#a1b5d8]/30 shadow-[0_0_12px_rgba(161,181,216,0.25)] hover:scale-110 transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#",
									"aria-label": "Instagram",
									className: "rounded-full bg-[#162235] hover:bg-[#2d436a] p-2.5 text-[#a1b5d8] hover:text-[#fffcf7] border border-[#a1b5d8]/30 shadow-[0_0_12px_rgba(161,181,216,0.25)] hover:scale-110 transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#",
									"aria-label": "YouTube",
									className: "rounded-full bg-[#162235] hover:bg-[#2d436a] p-2.5 text-[#a1b5d8] hover:text-[#fffcf7] border border-[#a1b5d8]/30 shadow-[0_0_12px_rgba(161,181,216,0.25)] hover:scale-110 transition-all",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "size-4" })
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-black uppercase tracking-wider text-[#a1b5d8]",
						children: "Quick Links"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium",
								children: "Home"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/#today",
								className: "text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium",
								children: "Today's auctions"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/#upcoming",
								className: "text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium",
								children: "Upcoming auctions"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pricing",
								className: "text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium",
								children: "Pricing"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-black uppercase tracking-wider text-[#a1b5d8]",
						children: "Platform"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/#features",
								className: "text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium",
								children: "Features"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/#steps",
								className: "text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium",
								children: "How it works"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/#numbers",
								className: "text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium",
								children: "Our numbers"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-black uppercase tracking-wider text-[#a1b5d8]",
						children: "Contact Us"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-3 text-sm text-[#abb4bd]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mt-0.5 size-4 shrink-0 text-[#a1b5d8]" }), "info@aotms.com"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mt-0.5 size-4 shrink-0 text-[#a1b5d8]" }), "+91 80199-52233"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0 text-[#a1b5d8]" }), "Vijayawada, Andhra Pradesh, India"]
							})
						]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-[#5c6875]/25 px-4 py-5 text-center text-xs text-[#abb4bd]/70",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" PitchBid. All rights reserved. Built for professional cricket tournament organizers."
				]
			})
		]
	});
}
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function useMediaQuery(query) {
	const [matches, setMatches] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const media = window.matchMedia(query);
		if (media.matches !== matches) setMatches(media.matches);
		const listener = () => setMatches(media.matches);
		media.addEventListener("change", listener);
		return () => media.removeEventListener("change", listener);
	}, [matches, query]);
	return matches;
}
function Pricing({ plans, title = "Simple, Transparent Pricing", description = "Choose the plan that works best for your cricket league or tournament.\nAll plans include real-time live bidding, team balance tracking, and auction management.", currencySymbol = "₹" }) {
	const [isMonthly, setIsMonthly] = (0, import_react.useState)(true);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const switchRef = (0, import_react.useRef)(null);
	const handleToggle = (checked) => {
		setIsMonthly(!checked);
		if (checked && switchRef.current) {
			const rect = switchRef.current.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top + rect.height / 2;
			confetti_module_default({
				particleCount: 60,
				spread: 70,
				origin: {
					x: x / window.innerWidth,
					y: y / window.innerHeight
				},
				colors: [
					"#a1b5d8",
					"#6c8cc2",
					"#e4f0d0",
					"#c2d8b9",
					"#fffcf7"
				],
				ticks: 200,
				gravity: 1.2,
				decay: .94,
				startVelocity: 30,
				shapes: ["circle"]
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container mx-auto px-4 py-16 md:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-4 mb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-4xl font-black tracking-tight sm:text-5xl text-[#fffcf7]",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[#abb4bd] text-base md:text-lg max-w-2xl mx-auto whitespace-pre-line leading-relaxed",
					children: description
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-3 mb-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-sm font-bold transition-colors", isMonthly ? "text-[#fffcf7]" : "text-[#abb4bd]"),
						children: "Monthly"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative inline-flex items-center cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "sr-only",
							children: "Toggle Annual Billing"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							ref: switchRef,
							checked: !isMonthly,
							onCheckedChange: handleToggle,
							className: "data-[state=checked]:bg-[#6c8cc2]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn("text-sm font-bold transition-colors flex items-center gap-1.5", !isMonthly ? "text-[#fffcf7]" : "text-[#abb4bd]"),
						children: ["Annual billing ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#a1b5d8] font-black bg-[#162235] border border-[#a1b5d8]/40 px-2.5 py-0.5 rounded-full text-xs",
							children: "Save 20%"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch",
				children: plans.map((plan, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						y: 50,
						opacity: 1
					},
					whileInView: isDesktop ? {
						y: plan.isPopular ? -16 : 0,
						opacity: 1,
						scale: plan.isPopular ? 1.04 : .98
					} : {},
					viewport: { once: true },
					transition: {
						duration: .8,
						type: "spring",
						stiffness: 100,
						damping: 25,
						delay: index * .1
					},
					className: cn("rounded-3xl border p-7 text-center relative flex flex-col justify-between transition-all duration-300", plan.isPopular ? "border-[#a1b5d8]/80 shadow-[0_0_35px_rgba(161,181,216,0.25)] bg-[#171a1d]/90 backdrop-blur-xl ring-1 ring-[#a1b5d8]/50 z-10" : "border-[#5c6875]/30 bg-[#2e343a]/70 backdrop-blur-xl hover:border-[#a1b5d8]/60 z-0", !plan.isPopular && "md:mt-4"),
					children: [
						plan.isPopular && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] text-[#162235] py-1 px-4 rounded-full flex items-center shadow-md text-xs font-black tracking-wider uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "text-[#162235] h-3.5 w-3.5 fill-current mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Most Popular" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-extrabold tracking-wider text-[#a1b5d8] uppercase",
									children: plan.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("inline-flex items-center px-4 py-2.5 rounded-2xl shadow-inner border transition-all", plan.isPopular ? "bg-[#162235] border-[#a1b5d8]/50 shadow-[0_0_25px_rgba(161,181,216,0.2)]" : "bg-[#162235]/90 border-[#5c6875]/40"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl md:text-3xl font-black text-[#ffd791] mr-1.5 drop-shadow-[0_0_10px_rgba(255,215,145,0.3)]",
												children: currencySymbol
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-4xl md:text-5xl font-black tracking-tight text-[#fffcf7] drop-shadow-sm",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberFlow, {
													value: isMonthly ? Number(plan.price) : Number(plan.yearlyPrice),
													locales: "en-IN",
													transformTiming: {
														duration: 400,
														easing: "ease-out"
													},
													willChange: true,
													className: "tabular-nums font-black text-[#fffcf7]"
												})
											}),
											plan.period !== "Next 3 months" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs md:text-sm font-extrabold text-[#a1b5d8] ml-2 tracking-wide",
												children: ["/", plan.period]
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2.5 text-xs text-[#abb4bd] font-medium",
									children: isMonthly ? "billed monthly" : "billed annually"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-6 border-t border-[#5c6875]/30" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "gap-3 flex flex-col text-sm text-left",
									children: plan.features.map((feature, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full p-0.5 bg-[#162235] border border-[#a1b5d8]/30 text-[#e4f0d0] mt-0.5 shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 stroke-[2.5]" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#ecf0f7] font-medium",
											children: feature
										})]
									}, idx))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 pt-4 border-t border-[#5c6875]/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: plan.href,
								className: cn(buttonVariants({ variant: plan.isPopular ? "default" : "outline" }), "w-full rounded-full py-2.5 text-sm font-black transition-all duration-300 shadow-sm", plan.isPopular ? "bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] text-[#162235] shadow-[0_0_20px_rgba(161,181,216,0.4)]" : "border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60"),
								children: plan.buttonText
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-[11px] leading-4 text-[#abb4bd]",
								children: plan.description
							})]
						})
					]
				}, index))
			})
		]
	});
}
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "PitchBid — Live Cricket Player Auction Software" },
		{
			name: "description",
			content: "Run live cricket player auctions online: build teams, set budgets, bid in real time and manage rosters from any device."
		},
		{
			property: "og:title",
			content: "PitchBid — Live Cricket Player Auction Software"
		},
		{
			property: "og:description",
			content: "Host real-time cricket auctions for your tournament with live bidding, team wallets and instant player cards."
		}
	] }),
	component: Index
});
var features = [
	{
		icon: Radio,
		title: "Live player bidding",
		body: "Owners bid together in real time with instant sold updates on every screen."
	},
	{
		icon: Earth,
		title: "Web + app access",
		body: "Run the auction from a laptop and let team owners join from their phones."
	},
	{
		icon: Gauge,
		title: "Tournament control",
		body: "Set purse limits, base prices, bid increments and unsold rules before you start."
	},
	{
		icon: Users,
		title: "Team management",
		body: "Create teams, assign owners and track squad composition as the auction runs."
	},
	{
		icon: BadgeCheck,
		title: "Player profiles",
		body: "Photos, roles, stats and base price on a broadcast-ready player card."
	},
	{
		icon: Tv,
		title: "Broadcast overlay",
		body: "Show the live bid screen on a projector or stream it for the crowd."
	},
	{
		icon: Wallet,
		title: "Purse tracking",
		body: "Remaining budget per team recalculates automatically after every sale."
	},
	{
		icon: ListOrdered,
		title: "Auto lot ordering",
		body: "Shuffle, group by role, or run marquee sets in the order you choose."
	},
	{
		icon: Smartphone,
		title: "Join by code",
		body: "Share a short room code so owners and viewers can join in seconds."
	}
];
var stats = [
	{
		value: "63,800+",
		label: "Auctions Hosted"
	},
	{
		value: "138,500+",
		label: "Organizers Joined"
	},
	{
		value: "105,900+",
		label: "Cricket Franchises"
	},
	{
		value: "541,000+",
		label: "Players Bidded"
	}
];
var steps = [
	{
		img: step_create_default,
		title: "Create auction",
		body: "Name your tournament, set the purse and pick your bidding rules."
	},
	{
		img: step_teams_default,
		title: "Add teams",
		body: "Add franchises with logos and invite each owner to their team."
	},
	{
		img: step_players_default,
		title: "Add players",
		body: "Import your player pool with roles, photos and base prices."
	},
	{
		img: step_bid_default,
		title: "Start bidding",
		body: "Go live, call each lot and let owners bid until the hammer falls."
	}
];
var testimonials = [
	{
		name: "Rahul Mehta",
		role: "Organizer, Corporate League",
		quote: "Our 12-team auction finished in two hours with zero spreadsheet arguments."
	},
	{
		name: "Sana Qureshi",
		role: "Team owner",
		quote: "Bidding from my phone while sitting with my squad felt exactly like the real thing."
	},
	{
		name: "Vikram Patel",
		role: "Club secretary",
		quote: "Purse tracking and unsold rounds are handled automatically — that saved our evening."
	}
];
var cricketPricingPlans = [
	{
		name: "Gully & Club",
		price: "499",
		yearlyPrice: "399",
		period: "month",
		features: [
			"Up to 6 Franchises / Teams",
			"Up to 100 Players Roster",
			"Live Real-Time Bidding Screen",
			"Auto Purse & Squad Tracking",
			"Mobile & Laptop Bidding Access",
			"Room Code Instant Join"
		],
		description: "Ideal for local turf, community clubs, and colony cricket tournaments",
		buttonText: "Start Club Auction",
		href: "/auth",
		isPopular: false
	},
	{
		name: "Premier League",
		price: "1499",
		yearlyPrice: "1199",
		period: "month",
		features: [
			"Up to 16 Franchises / Teams",
			"Unlimited Player Import (Excel / CSV)",
			"Projector & Live Stream Broadcast Overlay",
			"Marquee & Tiered Lot Ordering",
			"Custom Bid Increments & Retention",
			"Priority Support & Timer Controls"
		],
		description: "Most popular for corporate, district & premier cricket tournaments",
		buttonText: "Get Premier Access",
		href: "/auth",
		isPopular: true
	},
	{
		name: "Mega Tournament",
		price: "3499",
		yearlyPrice: "2799",
		period: "month",
		features: [
			"Unlimited Teams & Division Brackets",
			"Multiple Auctioneers & Sub-Rooms",
			"Custom Team Branding & Sponsor Logos",
			"Full WhatsApp & SMS Player Alerts",
			"Dedicated Event Specialist On Call",
			"Custom Roster Export & Certificates"
		],
		description: "Complete turnkey solution for large-scale state & academy tournaments",
		buttonText: "Launch Mega Event",
		href: "/pricing",
		isPopular: false
	}
];
function Index() {
	const { isAuthenticated } = useAuth();
	const { data: auctions, isPending, isError, refetch } = useQuery({
		...auctionListQueryOptions(),
		refetchInterval: 6e4
	});
	const today = (auctions ?? []).filter((a) => isToday(new Date(a.startsAt)));
	const upcoming = (auctions ?? []).filter((a) => isFuture(new Date(a.startsAt)) && !isToday(new Date(a.startsAt)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#f2e9dc]",
		style: { background: "radial-gradient(ellipse at 50% 10%, #1e3a45 0%, #162a32 35%, #122026 75%, #0e1619 100%)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative isolate overflow-hidden border-b border-[#38bdf8]/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Demo, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
				id: "today",
				initial: {
					opacity: 0,
					y: 24
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .1
				},
				transition: {
					duration: .5,
					ease: "easeOut"
				},
				className: "mx-auto max-w-7xl px-4 py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center text-center mb-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#162a32]/95 border-2 border-[#38bdf8]/60 text-[#ffffff] text-xs font-black uppercase tracking-wider mb-3 shadow-[0_0_25px_rgba(56,189,248,0.4)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-[#f97316] animate-ping" }), "Live Bidding Arena"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
							lead: "Today's",
							highlight: "Auctions",
							subtitle: "Auctions going live on the platform right now."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
						children: isPending ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuctionCardSkeleton, {}, i)) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-full rounded-3xl border border-[#38bdf8]/30 bg-[#1e272b]/85 backdrop-blur-xl p-8 text-center shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-[#ffffff]",
								children: "Failed to load auctions."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => refetch(),
								className: "mt-4 border-2 border-[#38bdf8]/60 bg-[#162a32] text-[#ffffff] hover:bg-[#326a7a]",
								children: "Try again"
							})]
						}) : today.length > 0 ? today.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuctionCard, { auction: a }, a.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-full rounded-3xl border border-[#38bdf8]/30 bg-gradient-to-b from-[#1e343e]/70 to-[#122026]/90 backdrop-blur-xl p-12 text-center shadow-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-8 text-[#f97316] mx-auto mb-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-lg font-black text-[#ffffff]",
									children: "No auctions live today"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[#f2e9dc]/80 mt-1 max-w-md mx-auto",
									children: "Check out the upcoming tournaments below or be the first to launch today's live auction!"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 flex flex-wrap items-center justify-center gap-4",
						children: isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/my-auctions/new",
							className: "inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] px-8 py-3.5 text-center font-black text-sm text-[#ffffff] shadow-[0_4px_28px_rgba(249,115,22,0.6)] transition-all hover:scale-105 border border-[#ffffff]/35",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-4.5" }), "Create Auction"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/my-auctions",
							className: "inline-flex items-center gap-2 rounded-full border-2 border-[#38bdf8]/50 bg-[#162a32]/95 hover:bg-[#204554] px-8 py-3.5 text-center font-extrabold text-sm text-[#ffffff] hover:border-[#ffffff] shadow-sm transition-all hover:scale-105",
							children: "View My Auctions"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/auth",
							search: { next: "/my-auctions/new" },
							className: "inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] px-8 py-3.5 text-center font-black text-sm text-[#ffffff] shadow-[0_4px_28px_rgba(249,115,22,0.6)] transition-all hover:scale-105 border border-[#ffffff]/35",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-4.5" }), "Create Auction"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: { next: "/my-auctions" },
							className: "inline-flex items-center gap-2 rounded-full border-2 border-[#38bdf8]/50 bg-[#162a32]/95 hover:bg-[#204554] px-8 py-3.5 text-center font-extrabold text-sm text-[#ffffff] hover:border-[#ffffff] shadow-sm transition-all hover:scale-105",
							children: "View My Auctions"
						})] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
				id: "upcoming",
				initial: { opacity: 0 },
				whileInView: { opacity: 1 },
				viewport: {
					once: true,
					amount: .1
				},
				transition: {
					duration: .6,
					ease: "easeOut"
				},
				className: "relative isolate overflow-hidden border-y border-[#5c6875]/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: stadium_band_default,
						alt: "",
						"aria-hidden": "true",
						loading: "lazy",
						width: 1920,
						height: 800,
						className: "absolute inset-0 size-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0",
						style: { background: "linear-gradient(180deg, rgba(23,26,29,0.92) 0%, rgba(22,34,53,0.94) 50%, rgba(15,18,20,0.98) 100%)" },
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-7xl px-4 py-20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
							lead: "Upcoming",
							highlight: "Auctions",
							tone: "light",
							subtitle: "Scheduled tournaments taking the stage soon."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 sm:grid-cols-2 mt-8",
							children: isPending ? Array.from({ length: 2 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuctionCardSkeleton, {}, i)) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-full rounded-3xl border border-[#5c6875]/30 bg-[#171a1d]/85 p-8 text-center shadow-xl backdrop-blur-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[#ecf0f7]",
									children: "Failed to load upcoming auctions."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => refetch(),
									className: "mt-4 border-[#a1b5d8]/50 bg-[#162235] text-[#fffcf7] hover:bg-[#2d436a]",
									children: "Try again"
								})]
							}) : upcoming.length > 0 ? upcoming.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuctionCard, {
								auction: a,
								tone: "dark"
							}, a.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-span-full rounded-3xl border border-[#5c6875]/30 bg-[#171a1d]/75 p-10 text-center backdrop-blur-md shadow-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[#abb4bd]",
									children: "No upcoming auctions scheduled yet — plan yours today!"
								})
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
				id: "features",
				initial: {
					opacity: 0,
					y: 24
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .1
				},
				transition: {
					duration: .5,
					ease: "easeOut"
				},
				className: "mx-auto max-w-7xl px-4 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					lead: "Our",
					highlight: "Features",
					subtitle: "Everything an organizer needs on auction night."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10",
					children: features.map(({ icon: Icon, title, body }, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
						initial: {
							opacity: 0,
							y: 16
						},
						whileInView: {
							opacity: 1,
							y: 0
						},
						viewport: {
							once: true,
							amount: .1
						},
						transition: {
							duration: .4,
							delay: idx * .04,
							ease: "easeOut"
						},
						className: "group relative rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/70 backdrop-blur-xl p-6 shadow-xl hover:border-[#a1b5d8] hover:shadow-[0_15px_40px_rgba(161,181,216,0.2)] transition-all duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 mb-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 rounded-2xl bg-gradient-to-br from-[#162235] to-[#2d436a] text-[#a1b5d8] border border-[#a1b5d8]/30 group-hover:scale-110 group-hover:bg-[#4365a0] group-hover:text-[#fffcf7] transition-all duration-300 shadow-md",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-5",
									"aria-hidden": "true"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-black text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors",
								children: title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-[#abb4bd] leading-relaxed",
							children: body
						})]
					}, title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.section, {
				initial: {
					opacity: 0,
					y: 24
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .1
				},
				transition: {
					duration: .5,
					ease: "easeOut"
				},
				className: "bg-gradient-to-b from-[#162235]/40 via-[#171a1d]/60 to-transparent py-20 border-y border-[#5c6875]/25",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162235]/85 border border-[#a1b5d8]/40 text-[#a1b5d8] text-xs font-extrabold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(161,181,216,0.2)]",
							children: "Proven Track Record"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl md:text-5xl font-black text-[#fffcf7] tracking-tight leading-tight",
							children: "Four years of trusted auction technology"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-[#abb4bd] text-base leading-relaxed",
							children: "PitchBid was engineered specifically for cricket organizers who need auction night to run effortlessly, transparently, and with televised-style grandeur. From community gully matches to statewide premier leagues, every bid is captured with microsecond precision."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center gap-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex text-[#ffd791]",
									children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
										className: "size-5 fill-current",
										"aria-hidden": "true"
									}, i))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-black text-[#fffcf7]",
									children: "4.9 / 5 Rating"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-[#abb4bd]",
								children: [
									"Trusted by ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-[#fffcf7]",
										children: "138,500+"
									}),
									" organizers worldwide"
								]
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: testimonials.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
							className: "rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/70 backdrop-blur-xl p-6 shadow-xl hover:border-[#a1b5d8]/60 transition-all duration-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
								className: "text-sm text-[#fffcf7] italic leading-relaxed",
								children: [
									"\"",
									t.quote,
									"\""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
								className: "mt-4 pt-3 border-t border-[#5c6875]/30 text-xs text-[#abb4bd]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-black text-[#a1b5d8] block text-sm not-italic",
									children: t.name
								}), t.role]
							})]
						}, t.name))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
				id: "numbers",
				initial: {
					opacity: 0,
					y: 24
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .1
				},
				transition: {
					duration: .5,
					ease: "easeOut"
				},
				className: "relative py-24 border-y border-[#5c6875]/30 text-[#fffcf7] overflow-hidden",
				style: { background: "radial-gradient(ellipse at 50% 25%, #2e343a 0%, #1c2227 45%, #171a1d 75%, #0f1214 100%)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(161,181,216,0.22)_0%,rgba(228,240,208,0.08)_35%,transparent_70%)] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,rgba(67,101,160,0.20)_0%,transparent_65%)] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-7xl px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center text-center mb-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162235]/85 border border-[#a1b5d8]/40 text-[#a1b5d8] text-xs font-extrabold uppercase tracking-wider mb-3 shadow-[0_0_20px_rgba(161,181,216,0.25)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-[#a1b5d8] animate-pulse" }), "Scale & Reliability"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
								lead: "PitchBid",
								highlight: "in Numbers",
								tone: "light",
								subtitle: "Scale and reliability proven across tournaments of every size."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8",
							children: stats.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									scale: .94
								},
								whileInView: {
									opacity: 1,
									scale: 1
								},
								viewport: {
									once: true,
									amount: .1
								},
								transition: {
									duration: .4,
									delay: idx * .07,
									ease: "easeOut"
								},
								className: "rounded-3xl border border-[#5c6875]/30 bg-[#171a1d]/85 backdrop-blur-xl p-8 text-center shadow-[0_12px_35px_rgba(15,18,20,0.8)] hover:border-[#a1b5d8] hover:shadow-[0_15px_45px_rgba(161,181,216,0.25)] transition-all duration-300 group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "display text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#fffcf7] via-[#ecf0f7] to-[#a1b5d8] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(161,181,216,0.4)] group-hover:scale-105 transition-transform",
									children: s.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2.5 text-xs font-black tracking-widest text-[#a1b5d8] uppercase",
									children: s.label
								})]
							}, s.label))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
				id: "steps",
				initial: {
					opacity: 0,
					y: 24
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .1
				},
				transition: {
					duration: .5,
					ease: "easeOut"
				},
				className: "relative overflow-hidden py-24 border-y border-[#5c6875]/30 text-[#fffcf7]",
				style: { background: "radial-gradient(ellipse at 50% 28%, #2e343a 0%, #1c2227 42%, #171a1d 75%, #0f1214 100%)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(161,181,216,0.22)_0%,rgba(228,240,208,0.10)_30%,transparent_68%)] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(67,101,160,0.20)_0%,transparent_70%)] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,rgba(194,216,185,0.15)_0%,transparent_55%)] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-7xl px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center text-center mb-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#162235]/85 border border-[#a1b5d8]/40 text-[#a1b5d8] text-xs font-extrabold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(161,181,216,0.25)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-[#a1b5d8] animate-pulse" }), "Tournament Blueprint"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
								lead: "How it",
								highlight: "Works",
								tone: "light",
								subtitle: "Four seamless steps from an empty sheet to a championship squad."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8",
							children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
								initial: {
									opacity: 0,
									y: 20
								},
								whileInView: {
									opacity: 1,
									y: 0
								},
								viewport: {
									once: true,
									amount: .1
								},
								transition: {
									duration: .4,
									delay: i * .08,
									ease: "easeOut"
								},
								className: "overflow-hidden rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-xl shadow-[0_12px_35px_rgba(15,18,20,0.8)] hover:border-[#a1b5d8] hover:shadow-[0_16px_45px_rgba(161,181,216,0.25)] transition-all duration-300 group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-48 w-full overflow-hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: s.img,
											alt: s.title,
											loading: "lazy",
											width: 800,
											height: 600,
											className: "size-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[#171a1d] via-transparent to-black/30 pointer-events-none" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute top-3 left-3 size-9 grid place-items-center rounded-full bg-gradient-to-br from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] text-[#162235] font-black text-sm shadow-[0_0_15px_rgba(161,181,216,0.55)] border border-[#fffcf7]/50",
											children: i + 1
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-black text-[#fffcf7] group-hover:text-[#a1b5d8] transition-colors",
										children: s.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-[#abb4bd] leading-relaxed",
										children: s.body
									})]
								})]
							}, s.title))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.section, {
				id: "pricing",
				initial: {
					opacity: 0,
					y: 24
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .1
				},
				transition: {
					duration: .5,
					ease: "easeOut"
				},
				className: "border-t border-[#5c6875]/30 bg-gradient-to-b from-[#171a1d] via-[#111417] to-[#0d0f11]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, {
					plans: cricketPricingPlans,
					title: "Simple, Transparent Pricing",
					description: "Choose the plan that works best for your cricket tournament.\nAll plans include live bidding, purse tracking, and broadcast capabilities.",
					currencySymbol: "₹"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
var $$splitComponentImporter$3 = () => import("./route-Di7iQBCH.mjs");
var Route$9 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		if (typeof window === "undefined") return {};
		const user = await authClient.getCurrentUser();
		if (!user) throw redirect({
			to: "/auth",
			search: { next: location.href }
		});
		return { user };
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function AuthLayout({ children, redirectContext }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-[#0f1214] text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 flex flex-col md:grid md:grid-cols-2 relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden md:flex flex-col justify-between p-12 lg:p-16 relative overflow-hidden select-none border-r border-[#5c6875]/30",
				style: { background: "radial-gradient(ellipse at 50% 28%, #2e343a 0%, #1c2227 38%, #171a1d 70%, #0f1214 100%)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(161,181,216,0.22)_0%,rgba(228,240,208,0.10)_30%,transparent_68%)] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(67,101,160,0.20)_0%,rgba(23,26,29,0.35)_45%,transparent_72%)] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,rgba(194,216,185,0.15)_0%,transparent_55%)] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sans font-black tracking-tighter uppercase whitespace-nowrap text-[#fffcf7] opacity-[0.04] text-8xl lg:text-9xl",
							style: {
								letterSpacing: "-0.04em",
								transform: "translate(0px, 20px)",
								textShadow: "0 0 80px rgba(161, 181, 216, 0.4)"
							},
							children: "AUCTION"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162235]/85 border border-[#a1b5d8]/40 backdrop-blur-md shadow-[0_0_20px_rgba(161,181,216,0.25)] mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-[#a1b5d8] animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-extrabold tracking-widest uppercase text-[#e4f0d0]",
								children: "Live Cricket Arena"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 max-w-lg space-y-6 my-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#fffcf7]",
								children: [
									"Build your ultimate",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-transparent bg-clip-text bg-gradient-to-r from-[#a1b5d8] via-[#e4f0d0] to-[#c2d8b9] drop-shadow-[0_0_25px_rgba(161,181,216,0.4)]",
										children: "dream team"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base lg:text-lg text-[#abb4bd] leading-relaxed font-medium",
								children: "Join elite tournament organizers and team owners. Bid in real-time with zero latency, track squad budgets automatically, and dominate auction night."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-3.5 pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/70 backdrop-blur-md shadow-lg hover:border-[#a1b5d8]/50 transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-2.5 rounded-xl bg-[#162235] text-[#a1b5d8] border border-[#a1b5d8]/30 shadow-sm",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-black text-[#fffcf7]",
											children: "Live Synchronized Bidding"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-[#abb4bd]",
											children: "Instant paddle raises and hammer calls"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/70 backdrop-blur-md shadow-lg hover:border-[#a1b5d8]/50 transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-2.5 rounded-xl bg-[#162235] text-[#a1b5d8] border border-[#a1b5d8]/30 shadow-sm",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-black text-[#fffcf7]",
											children: "Automated Purse Limits"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-[#abb4bd]",
											children: "Real-time wallet adjustments per franchise"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/70 backdrop-blur-md shadow-lg hover:border-[#a1b5d8]/50 transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-2.5 rounded-xl bg-[#162235] text-[#a1b5d8] border border-[#a1b5d8]/30 shadow-sm",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tv, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-black text-[#fffcf7]",
											children: "Televised Broadcast Overlay"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-[#abb4bd]",
											children: "Projector-ready live player cards and stats"
										})] })]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-10 pt-6 border-t border-[#5c6875]/25 text-xs text-[#abb4bd]/80",
						children: "Trusted by 138,500+ cricket tournament organizers worldwide"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-16 xl:px-20 relative overflow-hidden",
				style: { background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 45%, #0f1214 100%)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(161,181,216,0.12)_0%,transparent_70%)] pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 mx-auto w-full max-w-md space-y-6",
					children: [redirectContext && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl bg-[#162235]/80 p-4 border border-[#a1b5d8]/40 shadow-[0_0_15px_rgba(161,181,216,0.15)] backdrop-blur-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#ecf0f7] text-center font-bold",
							children: redirectContext
						})
					}), children]
				})]
			})]
		})]
	});
}
var PasswordField = import_react.forwardRef(({ className, showStrength, value, onChange, ...props }, ref) => {
	const [showPassword, setShowPassword] = import_react.useState(false);
	const passwordValue = value || "";
	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};
	const calculateStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 8) strength += 1;
		if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 1;
		if (/\d/.test(pass)) strength += 1;
		if (/[^a-zA-Z\d]/.test(pass)) strength += 1;
		return Math.min(strength, 3);
	};
	const strength = showStrength ? calculateStrength(passwordValue) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: showPassword ? "text" : "password",
				className: cn("pr-10 bg-[#2e343a]/75 border-[#5c6875]/50 text-[#fffcf7] placeholder:text-[#abb4bd]/50 focus-visible:ring-[#a1b5d8] focus-visible:border-[#a1b5d8]", className),
				ref,
				value,
				onChange,
				...props
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: togglePasswordVisibility,
				className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent flex items-center justify-center text-[#abb4bd] hover:text-[#fffcf7] transition-colors",
				tabIndex: -1,
				"aria-label": showPassword ? "Hide password" : "Show password",
				children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {
					className: "h-4 w-4",
					"aria-hidden": "true"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
					className: "h-4 w-4",
					"aria-hidden": "true"
				})
			})]
		}), showStrength && passwordValue.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1.5 h-1.5 w-full mt-2",
			children: [
				1,
				2,
				3
			].map((level) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-full w-full rounded-full transition-all duration-300", strength >= level ? strength === 1 ? "bg-rose-500" : strength === 2 ? "bg-[#ffd791]" : "bg-[#a1b5d8]" : "bg-[#2e343a]/60") }, level))
		})]
	});
});
PasswordField.displayName = "PasswordField";
var signInSchema = objectType({
	email: stringType().min(1, "Email is required").email("Invalid email address"),
	password: stringType().min(1, "Password is required"),
	rememberMe: booleanType().default(false).optional()
});
objectType({
	email: stringType().min(1, "Email is required").email("Invalid email address"),
	password: stringType().min(8, "Password must be at least 8 characters").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number")
});
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var Form = FormProvider;
var FormFieldContext = import_react.createContext(null);
var FormField = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormFieldContext.Provider, {
		value: { name: props.name },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, { ...props })
	});
};
var useFormField = () => {
	const fieldContext = import_react.useContext(FormFieldContext);
	const itemContext = import_react.useContext(FormItemContext);
	const { getFieldState, formState } = useFormContext();
	if (!fieldContext) throw new Error("useFormField should be used within <FormField>");
	if (!itemContext) throw new Error("useFormField should be used within <FormItem>");
	const fieldState = getFieldState(fieldContext.name, formState);
	const { id } = itemContext;
	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState
	};
};
var FormItemContext = import_react.createContext(null);
var FormItem = import_react.forwardRef(({ className, ...props }, ref) => {
	const id = import_react.useId();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormItemContext.Provider, {
		value: { id },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: cn("space-y-2", className),
			...props
		})
	});
});
FormItem.displayName = "FormItem";
var FormLabel = import_react.forwardRef(({ className, ...props }, ref) => {
	const { error, formItemId } = useFormField();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		ref,
		className: cn(error && "text-destructive", className),
		htmlFor: formItemId,
		...props
	});
});
FormLabel.displayName = "FormLabel";
var FormControl = import_react.forwardRef(({ ...props }, ref) => {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slot, {
		ref,
		id: formItemId,
		"aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
		"aria-invalid": !!error,
		...props
	});
});
FormControl.displayName = "FormControl";
var FormDescription = import_react.forwardRef(({ className, ...props }, ref) => {
	const { formDescriptionId } = useFormField();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		ref,
		id: formDescriptionId,
		className: cn("text-[0.8rem] text-muted-foreground", className),
		...props
	});
});
FormDescription.displayName = "FormDescription";
var FormMessage = import_react.forwardRef(({ className, children, ...props }, ref) => {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error?.message ?? "") : children;
	if (!body) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		ref,
		id: formMessageId,
		className: cn("text-[0.8rem] font-medium text-destructive", className),
		...props,
		children: body
	});
});
FormMessage.displayName = "FormMessage";
function safeNext(value) {
	if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
	return value;
}
var Route$8 = createFileRoute("/auth")({
	validateSearch: (search) => typeof search["next"] === "string" ? { next: search["next"] } : {},
	head: () => {
		const title = "Sign in to bid — PitchBid cricket auctions";
		const description = "Create a PitchBid account or sign in to place bids, confirm purchases and manage your franchise purse during live cricket auctions.";
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		] };
	},
	component: AuthPage
});
function AuthPage() {
	const { next } = Route$8.useSearch();
	const target = safeNext(next);
	const navigate = useNavigate();
	const { isAuthenticated, loading } = useAuth();
	(0, import_react.useEffect)(() => {
		if (!loading && isAuthenticated) navigate({
			to: target,
			replace: true
		});
	}, [
		loading,
		isAuthenticated,
		navigate,
		target
	]);
	const signInForm = useForm({
		resolver: u(signInSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false
		}
	});
	async function onSignIn(data) {
		try {
			await authClient.signIn(data.email, data.password);
			toast.success("Signed in successfully.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Authentication failed.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLayout, {
		redirectContext: next ? `Sign in to access your tournament destination.` : null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-[#5c6875]/30 bg-[#171a1d]/90 backdrop-blur-xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(15,18,20,0.8)] space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 text-center mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#162235] border border-[#a1b5d8]/40 text-[#a1b5d8] text-xs font-black uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(161,181,216,0.2)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5 text-[#a1b5d8]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Franchise Desk Portal" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-black tracking-tight text-[#fffcf7]",
						children: "Welcome back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-[#abb4bd]",
						children: "Enter your credentials to access your franchise bidding desk."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, {
				...signInForm,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: signInForm.handleSubmit(onSignIn),
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							control: signInForm.control,
							name: "email",
							render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									className: "text-xs font-extrabold uppercase tracking-wider text-[#dae2ef]",
									children: "Email Address"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "name@example.com",
									type: "email",
									autoComplete: "email",
									className: "bg-[#2e343a]/75 border-[#5c6875]/50 text-[#fffcf7] placeholder:text-[#abb4bd]/50 focus-visible:ring-[#a1b5d8] focus-visible:border-[#a1b5d8] rounded-xl h-11 transition-all",
									...field
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-xs text-rose-400 font-semibold" })
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							control: signInForm.control,
							name: "password",
							render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
										className: "text-xs font-extrabold uppercase tracking-wider text-[#dae2ef]",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/auth",
										search: next ? { next } : {},
										className: "text-xs font-bold text-[#a1b5d8] hover:text-[#fffcf7] transition-colors",
										children: "Forgot password?"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
									autoComplete: "current-password",
									className: "rounded-xl h-11",
									...field
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-xs text-rose-400 font-semibold" })
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							control: signInForm.control,
							name: "rememberMe",
							render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, {
								className: "flex flex-row items-center space-x-2.5 space-y-0 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: !!field.value,
									onCheckedChange: field.onChange,
									className: "border-[#5c6875] data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#6c8cc2] data-[state=checked]:to-[#a1b5d8] data-[state=checked]:text-[#162235] rounded-md transition-all"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									className: "font-medium text-xs text-[#abb4bd] cursor-pointer select-none",
									children: "Remember me for 30 days"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full mt-4 rounded-full py-3.5 h-auto font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_25px_rgba(161,181,216,0.35)] hover:shadow-[0_0_35px_rgba(161,181,216,0.55)] hover:scale-[1.02] transition-all duration-300 border border-[#fffcf7]/40",
							disabled: signInForm.formState.isSubmitting,
							children: signInForm.formState.isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin text-[#162235]" }), "Signing in..."] }) : "Sign In to Franchise Desk"
						})
					]
				})
			})]
		})
	});
}
var Route$7 = createFileRoute("/pricing")({
	head: () => ({ meta: [
		{ title: "Auction Plans & Pricing — PitchBid" },
		{
			name: "description",
			content: "Pick a cricket auction plan by team count: free for 3 teams, paid plans up to 16 teams with live bidding and squad limits."
		},
		{
			property: "og:title",
			content: "Auction Plans & Pricing — PitchBid"
		},
		{
			property: "og:description",
			content: "Cricket auction plans priced by team count, from a free 3-team auction to 16-team leagues."
		}
	] }),
	component: PricingPage
});
var cricketPlans = [
	{
		name: "Gully & Club",
		price: "499",
		yearlyPrice: "399",
		period: "month",
		features: [
			"Up to 6 Franchises / Teams",
			"Up to 100 Players Roster",
			"Live Real-Time Bidding Screen",
			"Auto Purse & Squad Tracking",
			"Mobile & Laptop Bidding Access",
			"Room Code Instant Join"
		],
		description: "Ideal for local turf, community clubs, and colony cricket tournaments",
		buttonText: "Start Club Plan",
		href: "/auth",
		isPopular: false
	},
	{
		name: "Premier League",
		price: "1499",
		yearlyPrice: "1199",
		period: "month",
		features: [
			"Up to 16 Franchises / Teams",
			"Unlimited Player Import (Excel / CSV)",
			"Projector & Live Stream Broadcast Overlay",
			"Marquee & Tiered Lot Ordering",
			"Custom Bid Increments & Retention",
			"Priority Support & Timer Controls"
		],
		description: "Most popular for corporate, district & premier cricket tournaments",
		buttonText: "Get Premier Access",
		href: "/auth",
		isPopular: true
	},
	{
		name: "Mega Tournament",
		price: "3499",
		yearlyPrice: "2799",
		period: "month",
		features: [
			"Unlimited Teams & Division Brackets",
			"Multiple Auctioneers & Sub-Rooms",
			"Custom Team Branding & Sponsor Logos",
			"Full WhatsApp & SMS Player Alerts",
			"Dedicated Event Specialist On Call",
			"Custom Roster Export & Certificates"
		],
		description: "Complete turnkey solution for large-scale state & academy tournaments",
		buttonText: "Launch Mega Event",
		href: "/auth",
		isPopular: false
	}
];
var teamPlans = [
	{
		name: "Tier 1",
		teams: "3 Teams",
		price: "Free",
		squad: "Up to 5 players per team"
	},
	{
		name: "Tier 2",
		teams: "4 Teams",
		price: "₹999",
		squad: "Up to 8 players per team"
	},
	{
		name: "Tier 3",
		teams: "6 Teams",
		price: "₹1,499",
		squad: "Up to 12 players per team"
	},
	{
		name: "Tier 4",
		teams: "8 Teams",
		price: "₹2,499",
		squad: "Up to 14 players per team"
	},
	{
		name: "Tier 5",
		teams: "12 Teams",
		price: "₹3,499",
		squad: "Up to 18 players per team"
	},
	{
		name: "Tier 6",
		teams: "16 Teams",
		price: "₹4,999",
		squad: "Up to 22 players per team"
	}
];
var included = [
	"Live real-time bidding room",
	"Team purse and budget tracking",
	"Player cards with photos and roles",
	"Unsold and re-auction rounds",
	"Projector-friendly bid screen",
	"Downloadable final squad sheets"
];
function PricingPage() {
	const [comingSoonOpen, setComingSoonOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "pt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, {
					plans: cricketPlans,
					title: "Simple, Transparent Pricing",
					description: "Choose the plan that fits your cricket tournament scale.\nAll plans include live bidding, squad trackers, and real-time purse calculations.",
					currencySymbol: "₹"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-4 py-16 border-t border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					lead: "Single Tournament",
					highlight: "Packages",
					subtitle: "One-time flat fee per tournament by team count and squad size."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10",
					children: teamPlans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "overflow-hidden rounded-2xl border border-border bg-card card-shadow hover:border-[#4f772d] transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold tracking-widest text-[#4f772d] dark:text-[#90a955] uppercase",
										children: p.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "display mt-2 text-3xl text-card-foreground",
										children: p.teams
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: p.squad
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "bg-gradient-to-r from-[#132a13] to-[#31572c] py-3 text-center text-xl font-bold text-[#ecf39e]",
								children: p.price
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setComingSoonOpen(true),
									className: "w-full rounded-full border-2 border-[#4f772d] px-4 py-2.5 font-bold text-[#31572c] dark:text-[#90a955] hover:bg-[#4f772d] hover:text-white transition-all shadow-sm",
									children: "Select package"
								})
							})
						]
					}, p.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "bg-secondary/60 py-16 border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						lead: "Included in",
						highlight: "Every Plan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3 sm:grid-cols-2 mt-8",
						children: included.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2.5 rounded-xl bg-card p-4 text-sm card-shadow border border-border/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "mt-0.5 size-4 shrink-0 text-[#4f772d]",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: item
							})]
						}, item))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: comingSoonOpen,
				onOpenChange: setComingSoonOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Instant Activation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "We're currently rolling out our integrated UPI & card payment gateway. You can host up to 3 teams free right now or contact support for immediate enterprise tournament activation!" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						className: "rounded-full bg-[#31572c] text-white",
						children: "Got it"
					}) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
var $$splitComponentImporter$2 = () => import("./auctioneer-C4eEA6tW.mjs");
var Route$6 = createFileRoute("/_authenticated/auctioneer")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./bookmarks-mFIrpacM.mjs");
var Route$5 = createFileRoute("/_authenticated/bookmarks")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./profile-BKYB7asA.mjs");
var Route$4 = createFileRoute("/_authenticated/profile")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$3 = createFileRoute("/_authenticated/my-auctions/")({ component: MyAuctionsPage });
function MyAuctionsPage() {
	const { items, isPending, isError, refetch, remove } = useMyAuctions();
	const [sportFilter, setSportFilter] = (0, import_react.useState)("all");
	const [visibilityFilter, setVisibilityFilter] = (0, import_react.useState)("all");
	const filtered = items.filter((a) => (sportFilter === "all" || a.sportType === sportFilter) && (visibilityFilter === "all" || a.visibility === visibilityFilter));
	async function handleDelete(id) {
		try {
			await remove(id);
			toast.success("Auction deleted.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to delete auction.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#f2e9dc] selection:bg-[#38bdf8] selection:text-[#ffffff]",
		style: { background: "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-4xl px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#38bdf8]/35",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#162a32]/95 border-2 border-[#38bdf8]/60 text-[#ffffff] text-xs font-black uppercase tracking-widest mb-2 shadow-[0_0_20px_rgba(56,189,248,0.4)] [word-spacing:0.18em] font-auction",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-3.5 text-[#38bdf8]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ORGANIZER CONSOLE" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl sm:text-4xl lg:text-5xl font-black font-auction-title tracking-wider text-[#ffffff] [word-spacing:0.22em] drop-shadow-md uppercase",
							children: "My Auctions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-[#f2e9dc]/85 font-medium tracking-wide [word-spacing:0.14em]",
							children: "Manage tournaments, squad rosters, and live bidding sessions."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "rounded-full px-7 py-3 h-auto font-black font-auction text-sm tracking-wide [word-spacing:0.14em] text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:shadow-[0_0_35px_rgba(249,115,22,0.9)] hover:scale-105 transition-all duration-300 border border-white/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/my-auctions/new",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 size-4 stroke-[3]" }), " Create Auction"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: sportFilter,
						onValueChange: (v) => setSportFilter(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-44 rounded-xl border-2 border-[#38bdf8]/40 bg-[#162a34]/90 text-[#ffffff] font-bold focus:ring-[#38bdf8] backdrop-blur-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All sports" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
							className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All sports"
							}), SPORT_TYPES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: sportTypeLabels[s]
							}, s))]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: visibilityFilter,
						onValueChange: (v) => setVisibilityFilter(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-44 rounded-xl border-2 border-[#38bdf8]/40 bg-[#162a34]/90 text-[#ffffff] font-bold focus:ring-[#38bdf8] backdrop-blur-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All visibility" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
							className: "rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All visibility"
							}), VISIBILITIES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: v,
								children: visibilityLabels[v]
							}, v))]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-3.5",
					children: isPending ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 rounded-2xl border-2 border-[#38bdf8]/20 bg-[#162a32]/60 p-5 backdrop-blur-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-14 shrink-0 rounded-xl bg-[#203a45]/50" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-1/3 bg-[#203a45]/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-1/2 bg-[#203a45]/40" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-9 shrink-0 rounded-xl bg-[#203a45]/50" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-9 shrink-0 rounded-xl bg-[#203a45]/50" })
						]
					}, i)) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a32]/90 p-10 text-center shadow-lg backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[#f2e9dc]",
							children: "Failed to load auctions."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "mt-4 rounded-full border-2 border-[#38bdf8] text-[#ffffff] bg-[#38bdf8]/20 hover:bg-[#38bdf8]/40",
							onClick: () => refetch(),
							children: "Try again"
						})]
					}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border-2 border-dashed border-[#38bdf8]/40 bg-[#162a32]/50 p-12 text-center backdrop-blur-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-8 text-[#f97316] mx-auto mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#f2e9dc] font-bold",
								children: items.length === 0 ? "You haven't created any tournaments yet." : "No auctions match these filters."
							}),
							items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "mt-5 rounded-full px-7 py-3 font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/my-auctions/new",
									children: "Create your first auction"
								})
							})
						]
					}) : filtered.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 rounded-2xl border-2 border-[#38bdf8]/35 bg-[#162b35]/85 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(15,35,45,0.7)] hover:border-[#38bdf8] hover:shadow-[0_12px_35px_rgba(56,189,248,0.3)] transition-all duration-300 group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
								src: a.coverImage || "",
								alt: "",
								className: "size-14 shrink-0 rounded-xl object-cover border-2 border-[#38bdf8]/50 shadow-md",
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "display flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1e424c] to-[#38bdf8] text-xl font-black text-[#ffffff] rounded-xl",
									children: a.name.slice(0, 2).toUpperCase()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/my-auctions/$id",
									params: { id: a.id },
									className: "truncate text-base sm:text-lg font-black font-auction text-[#ffffff] group-hover:text-[#38bdf8] transition-colors block drop-shadow-sm tracking-wide [word-spacing:0.16em]",
									children: a.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-[#f2e9dc]/80 flex items-center gap-2 font-semibold tracking-wide [word-spacing:0.12em]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2.5 py-0.5 rounded-full bg-[#142630] border border-[#38bdf8]/50 text-[#38bdf8] text-[10px] font-black uppercase tracking-wider font-auction",
											children: sportTypeLabels[a.sportType]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 text-[#ffffff]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-[#38bdf8]" }), format(new Date(a.startsAt), "d MMM yyyy, h:mm a")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-400 font-bold capitalize",
											children: visibilityLabels[a.visibility]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "icon",
										className: "rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] hover:bg-[#38bdf8] hover:text-[#ffffff] text-[#38bdf8] transition-all shadow-sm",
										onClick: () => {
											const shareUrl = `${window.location.origin}/auctions/${a.id}`;
											navigator.clipboard.writeText(shareUrl);
											toast.success("Auction link copied to clipboard!");
										},
										"aria-label": "Share auction",
										title: "Share Auction",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										size: "icon",
										className: "rounded-xl border-2 border-emerald-500/50 bg-[#142630] hover:bg-emerald-500 hover:text-[#ffffff] text-emerald-400 transition-all shadow-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/my-auctions/$id/edit",
											params: { id: a.id },
											"aria-label": "Edit auction",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "icon",
											className: "rounded-xl border-2 border-rose-500/50 bg-[#142630] hover:bg-rose-500 hover:text-[#ffffff] text-rose-400 transition-all shadow-sm",
											"aria-label": "Delete auction",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
										className: "rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
											"Delete \"",
											a.name,
											"\"?"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
											className: "text-[#f2e9dc]/80",
											children: "This cannot be undone. All teams, players, and auction data will be permanently removed."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
											className: "rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#203f4f] transition-all font-bold px-6 shadow-sm",
											children: "Cancel"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
											onClick: () => handleDelete(a.id),
											className: "rounded-full bg-destructive hover:bg-destructive/90 text-white font-bold",
											children: "Delete"
										})] })]
									})] })
								]
							})
						]
					}, a.id))
				})
			]
		})]
	});
}
function Calendar$1({ className, classNames, showOutsideDays = true, captionLayout = "label", buttonVariant = "ghost", formatters, components, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, {
		showOutsideDays,
		className: cn("bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className),
		captionLayout,
		formatters: {
			formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
			...formatters
		},
		classNames: {
			root: cn("w-fit", defaultClassNames.root),
			months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
			month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
			nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
			button_previous: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_previous),
			button_next: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_next),
			month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
			dropdowns: cn("flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
			dropdown_root: cn("has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border", defaultClassNames.dropdown_root),
			dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
			caption_label: cn("select-none font-medium", captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5", defaultClassNames.caption_label),
			table: "w-full border-collapse",
			weekdays: cn("flex", defaultClassNames.weekdays),
			weekday: cn("text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal", defaultClassNames.weekday),
			week: cn("mt-2 flex w-full", defaultClassNames.week),
			week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
			week_number: cn("text-muted-foreground select-none text-[0.8rem]", defaultClassNames.week_number),
			day: cn("group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md", defaultClassNames.day),
			range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
			range_middle: cn("rounded-none", defaultClassNames.range_middle),
			range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
			today: cn("bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none", defaultClassNames.today),
			outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
			disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
			hidden: cn("invisible", defaultClassNames.hidden),
			...classNames
		},
		components: {
			Root: ({ className, rootRef, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-slot": "calendar",
					ref: rootRef,
					className: cn(className),
					...props
				});
			},
			Chevron: ({ className, orientation, ...props }) => {
				if (orientation === "left") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: cn("size-4", className),
					...props
				});
				if (orientation === "right") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: cn("size-4", className),
					...props
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: cn("size-4", className),
					...props
				});
			},
			DayButton: CalendarDayButton,
			WeekNumber: ({ children, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					...props,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-(--cell-size) items-center justify-center text-center",
						children
					})
				});
			},
			...components
		},
		...props
	});
}
function CalendarDayButton({ className, day, modifiers, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (modifiers["focused"]) ref.current?.focus();
	}, [modifiers]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		ref,
		variant: "ghost",
		size: "icon",
		"data-day": day.date.toLocaleDateString(),
		"data-selected-single": modifiers["selected"] && !modifiers["range_start"] && !modifiers["range_end"] && !modifiers["range_middle"],
		"data-range-start": modifiers["range_start"],
		"data-range-end": modifiers["range_end"],
		"data-range-middle": modifiers["range_middle"],
		className: cn("data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className),
		...props
	});
}
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
function AuctionForm({ defaultValues, onSubmit, submitLabel }) {
	const form = useForm({
		resolver: u(auctionFormSchema),
		defaultValues: {
			sportType: "cricket",
			name: "",
			coverImage: null,
			date: /* @__PURE__ */ new Date(),
			time: "18:00",
			playersPerTeam: 7,
			pointsPerTeam: 1e5,
			minimumBid: 500,
			maxBid: 3e4,
			bidIncrement: 100,
			visibility: "public",
			...defaultValues
		}
	});
	const coverImage = form.watch("coverImage");
	async function handleCoverImageChange(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 10485760) {
			alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
			toast.error("Cover image must be less than 10MB");
			e.target.value = "";
			return;
		}
		const dataUrl = await fileToCompressedDataUrl(file, IMAGE_PRESETS.cover);
		form.setValue("coverImage", dataUrl, { shouldDirty: true });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, {
		...form,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: form.handleSubmit(onSubmit),
			className: "space-y-6 text-[#fffcf7]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						htmlFor: "coverImage",
						className: "relative flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235]/60 text-[#a1b5d8] hover:bg-[#162235] hover:border-[#a1b5d8] transition-all shadow-inner group",
						children: [coverImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: coverImage,
							alt: "Auction cover",
							className: "size-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex flex-col items-center gap-1.5 text-sm text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
									className: "size-7 text-[#a1b5d8] group-hover:scale-110 transition-transform",
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-[#fffcf7]",
									children: "Add Tournament Cover Image"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-[#abb4bd] font-normal",
									children: "JPEG, PNG up to 10MB"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "coverImage",
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: handleCoverImageChange
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					control: form.control,
					name: "sportType",
					render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
							className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
							children: "Sport"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							onValueChange: field.onChange,
							value: field.value,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a sport" })
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
								className: "rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]",
								children: SPORT_TYPES.map((sport) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: sport,
									className: "hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]",
									children: sportTypeLabels[sport]
								}, sport))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-red-400 text-xs" })
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					control: form.control,
					name: "name",
					render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
							className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
							children: "Auction Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "e.g. Premier League Season 5",
							className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]",
							...field
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-red-400 text-xs" })
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						control: form.control,
						name: "date",
						render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, {
							className: "flex flex-col",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Auction Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										className: cn("justify-start text-left font-normal rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] hover:bg-[#2e343a] hover:text-[#fffcf7]", !field.value && "text-[#8f9ba7]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 size-4 text-[#a1b5d8]" }), field.value ? format(field.value, "d MMM yyyy") : "Pick a date"]
									}) })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
									className: "w-auto p-0 rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-2xl",
									align: "start",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, {
										mode: "single",
										selected: field.value,
										onSelect: field.onChange,
										autoFocus: true,
										disabled: { before: /* @__PURE__ */ new Date() },
										className: "text-[#fffcf7]"
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-red-400 text-xs" })
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						control: form.control,
						name: "time",
						render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
								className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
								children: "Auction Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]",
								...field
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-red-400 text-xs" })
						] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						control: form.control,
						name: "playersPerTeam",
						render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
								className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
								children: "Player Per Team"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]",
								...field
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-red-400 text-xs" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						control: form.control,
						name: "pointsPerTeam",
						render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
								className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
								children: "Points Balance / Team"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]",
								...field
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-red-400 text-xs" })
						] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							control: form.control,
							name: "minimumBid",
							render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Minimum Bid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]",
									...field
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-red-400 text-xs" })
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							control: form.control,
							name: "maxBid",
							render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Maximum Bid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]",
									...field
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-red-400 text-xs" })
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							control: form.control,
							name: "bidIncrement",
							render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
									className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
									children: "Bid Increased By"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									className: "rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]",
									...field
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-red-400 text-xs" })
							] })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					control: form.control,
					name: "visibility",
					render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
							className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
							children: "Auction Visibility"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
							onValueChange: field.onChange,
							value: field.value,
							className: "flex flex-wrap gap-4 pt-1",
							children: VISIBILITIES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm font-semibold text-[#fffcf7] cursor-pointer hover:text-[#a1b5d8] transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
									value: v,
									className: "border-[#5c6875] text-[#a1b5d8] focus:ring-[#a1b5d8]"
								}), visibilityLabels[v]]
							}, v))
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, { className: "text-red-400 text-xs" })
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full rounded-full py-3.5 h-auto font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_25px_rgba(161,181,216,0.35)] hover:shadow-[0_0_35px_rgba(161,181,216,0.55)] hover:scale-[1.01] transition-all duration-300 border border-[#fffcf7]/30",
					disabled: form.formState.isSubmitting,
					children: form.formState.isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Saving..."] }) : submitLabel
				})
			]
		})
	});
}
var Route$2 = createFileRoute("/_authenticated/my-auctions/new")({ component: NewAuctionPage });
function combineDateAndTime$1(date, time) {
	const [hours, minutes] = time.split(":").map(Number);
	const combined = new Date(date);
	combined.setHours(hours || 0, minutes || 0, 0, 0);
	return combined;
}
function NewAuctionPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	async function handleSubmit(values) {
		try {
			await auctionClient.create({
				sportType: values.sportType,
				name: values.name,
				coverImage: values.coverImage ?? null,
				startsAt: combineDateAndTime$1(values.date, values.time).toISOString(),
				playersPerTeam: values.playersPerTeam,
				pointsPerTeam: values.pointsPerTeam,
				minimumBid: values.minimumBid,
				maxBid: values.maxBid,
				bidIncrement: values.bidIncrement,
				visibility: values.visibility
			});
			await queryClient.invalidateQueries({ queryKey: auctionKeys.all });
			toast.success("Auction created.");
			navigate({ to: "/my-auctions" });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to create auction.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235]",
		style: { background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-xl px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#162235]/80 border border-[#a1b5d8]/40 text-[#a1b5d8] text-xs font-bold uppercase tracking-wider mb-2.5 shadow-[0_0_15px_rgba(161,181,216,0.2)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tournament Setup" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl sm:text-4xl font-black text-[#fffcf7] tracking-tight",
						children: "Create Auction"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-[#abb4bd]",
						children: "Set up rules, budgets, and squad limits for your new tournament."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/80 backdrop-blur-xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(23,26,29,0.8)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuctionForm, {
					onSubmit: handleSubmit,
					submitLabel: "Create Auction"
				})
			})]
		})]
	});
}
var Route$1 = createFileRoute("/_authenticated/my-auctions/$id/edit")({
	loader: async ({ params, context }) => {
		let auction;
		try {
			auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.id));
		} catch {
			throw notFound();
		}
		const user = await authClient.getCurrentUser();
		const isAdmin = user?.email === "ameen@gmail.com";
		if (!user || auction.createdBy !== user.id && !isAdmin) throw redirect({ to: "/my-auctions" });
		return { auction };
	},
	component: EditAuctionPage
});
function combineDateAndTime(date, time) {
	const [hours, minutes] = time.split(":").map(Number);
	const combined = new Date(date);
	combined.setHours(hours || 0, minutes || 0, 0, 0);
	return combined;
}
function EditAuctionPage() {
	const { auction } = Route$1.useLoaderData();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	async function handleSubmit(values) {
		try {
			const updatedAuction = await auctionClient.update(auction.id, {
				sportType: values.sportType,
				name: values.name,
				coverImage: values.coverImage ?? null,
				startsAt: combineDateAndTime(values.date, values.time).toISOString(),
				playersPerTeam: values.playersPerTeam,
				pointsPerTeam: values.pointsPerTeam,
				minimumBid: values.minimumBid,
				maxBid: values.maxBid,
				bidIncrement: values.bidIncrement,
				visibility: values.visibility
			});
			queryClient.setQueryData(auctionKeys.detail(auction.id), updatedAuction);
			await queryClient.invalidateQueries({
				queryKey: auctionKeys.all,
				refetchType: "all"
			});
			await queryClient.refetchQueries({ queryKey: auctionKeys.detail(auction.id) });
			await queryClient.refetchQueries({ queryKey: auctionKeys.mine() });
			toast.success("Auction updated.");
			navigate({ to: "/my-auctions" });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to update auction.");
		}
	}
	const startsAt = new Date(auction.startsAt);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235]",
		style: { background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-xl px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#162235]/80 border border-[#a1b5d8]/40 text-[#a1b5d8] text-xs font-bold uppercase tracking-wider mb-2.5 shadow-[0_0_15px_rgba(161,181,216,0.2)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tournament Settings" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl sm:text-4xl font-black text-[#fffcf7] tracking-tight",
						children: "Edit Auction"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-[#abb4bd]",
						children: [
							"Update rules, budgets, and squad parameters for ",
							auction.name,
							"."
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-[#5c6875]/30 bg-[#2e343a]/80 backdrop-blur-xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(23,26,29,0.8)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuctionForm, {
					defaultValues: {
						sportType: auction.sportType,
						name: auction.name,
						coverImage: auction.coverImage,
						date: startsAt,
						time: `${String(startsAt.getHours()).padStart(2, "0")}:${String(startsAt.getMinutes()).padStart(2, "0")}`,
						playersPerTeam: auction.playersPerTeam,
						pointsPerTeam: auction.pointsPerTeam,
						minimumBid: auction.minimumBid,
						maxBid: auction.maxBid,
						bidIncrement: auction.bidIncrement,
						visibility: auction.visibility
					},
					onSubmit: handleSubmit,
					submitLabel: "Save Changes"
				})
			})]
		})]
	});
}
var Route = createFileRoute("/_authenticated/my-auctions/$id/teams/$teamId")({
	loader: async ({ params }) => {
		try {
			const [{ team, stats }, players] = await Promise.all([auctionClient.getTeamStats(params.teamId), auctionClient.getPlayers(params.id)]);
			return {
				team,
				stats,
				players: players.filter((p) => p.teamId === params.teamId)
			};
		} catch {
			throw notFound();
		}
	},
	component: TeamDetailsPage
});
function StatCard({ title, value, subtext }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border-2 border-[#38bdf8]/35 bg-[#162b35]/85 backdrop-blur-md p-4 shadow-[0_8px_30px_rgba(15,35,45,0.7)] hover:border-[#38bdf8] transition-all",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xs font-black uppercase tracking-wider text-[#38bdf8]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-2xl font-black text-[#ffffff]",
				children: value.toLocaleString("en-IN")
			}),
			subtext && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] text-[#f97316] font-bold",
				children: subtext
			})
		]
	});
}
function TeamDetailsPage() {
	const { team, stats, players } = Route.useLoaderData();
	const history = [{
		id: "initial",
		desc: "Initial Budget Allocation",
		amount: stats.totalPoints,
		type: "inflow",
		date: new Date(team.createdAt)
	}];
	players.forEach((p) => {
		if (p.soldPrice) history.push({
			id: p.id,
			desc: `Bought ${p.name}`,
			amount: p.soldPrice,
			type: "outflow",
			date: new Date(p.updatedAt)
		});
	});
	history.sort((a, b) => b.date.getTime() - a.date.getTime());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#f2e9dc] pb-24 selection:bg-[#38bdf8] selection:text-[#ffffff]",
		style: { background: "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-4xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "mb-6 -ml-4 text-[#38bdf8] hover:text-[#ffffff] hover:bg-[#1a3847]/60 font-bold",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/my-auctions/$id",
						params: { id: team.auctionId },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-2 size-4" }), " Back to Dashboard"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-3xl p-6 sm:p-8 border-2 border-[#38bdf8]/40 overflow-hidden shadow-[0_15px_45px_rgba(15,35,45,0.85)] bg-[#162b35]/90",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-black/50 to-black/25 pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative shrink-0 flex items-center justify-center size-24 rounded-2xl border-2 border-[#38bdf8]/70 overflow-hidden bg-[#142630] shadow-xl",
							children: team.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: team.logo,
								alt: team.name,
								className: "size-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-3xl font-black text-[#38bdf8]",
								children: team.shortName.slice(0, 3)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 text-center sm:text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl sm:text-4xl font-black text-[#ffffff] tracking-tight drop-shadow-md",
									children: team.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[#38bdf8] font-black mt-1 tracking-wider uppercase text-sm",
									children: ["Team Code: ", team.shortName]
								}),
								(team.ownerName || team.ownerPhone) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3.5 text-xs text-[#ffffff] bg-[#142630]/90 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-[#38bdf8]/50 backdrop-blur-md",
									children: [
										team.ownerName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-black text-[#ffffff]",
											children: team.ownerName
										}),
										team.ownerName && team.ownerPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#38bdf8]",
											children: "•"
										}),
										team.ownerPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#f97316] font-extrabold",
											children: team.ownerPhone
										})
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-10 text-xl font-black text-[#ffffff] tracking-tight mb-4",
					children: "Budget & Roster"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							title: "Total Points",
							value: stats.totalPoints
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							title: "Used Points",
							value: stats.usedPoints
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							title: "Available Points",
							value: stats.availablePoints
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							title: "Max Bid",
							value: stats.maxBidPoints,
							subtext: `Reserving ${stats.reservedPlayers} spots`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							title: "Total Players",
							value: stats.totalPlayers
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							title: "Reserved Spots",
							value: stats.reservedPlayers
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid grid-cols-1 gap-8 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-black text-[#ffffff] tracking-tight mb-4",
						children: "Sold Players"
					}), players.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border-2 border-dashed border-[#38bdf8]/35 bg-[#162b35]/40 p-8 text-center text-[#f2e9dc]/80 font-bold",
						children: "No players sold to this team yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border-2 border-[#38bdf8]/30 bg-[#162b35]/85 backdrop-blur-md p-4 shadow-sm hover:border-[#38bdf8] transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
									src: p.photo || "",
									alt: p.name,
									className: "size-11 rounded-full border-2 border-[#38bdf8]/50 shrink-0 object-cover",
									fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "display grid size-full place-items-center rounded-full bg-[#142630] text-xs font-black text-[#38bdf8]",
										children: p.name.slice(0, 2).toUpperCase()
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-black text-sm text-[#ffffff]",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#38bdf8] font-bold",
									children: p.sportFields?.["role"] || p.category || "Player"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-black text-sm text-emerald-400",
									children: [p.soldPrice ? p.soldPrice.toLocaleString("en-IN") : 0, " pts"]
								})
							})]
						}, p.id))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-black text-[#ffffff] tracking-tight mb-4",
						children: "Balance History"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: history.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border-2 border-[#38bdf8]/30 bg-[#162b35]/85 backdrop-blur-md p-4 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [h.type === "inflow" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "size-5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowDown, { className: "size-5 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-black text-sm text-[#ffffff]",
									children: h.desc
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#f2e9dc]/70 font-semibold",
									children: format(h.date, "MMM d, yyyy h:mm a")
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `font-black text-sm ${h.type === "inflow" ? "text-emerald-400" : "text-rose-400"}`,
								children: [h.type === "inflow" ? "" : "-", h.amount.toLocaleString("en-IN")]
							})]
						}, h.id))
					})] })]
				})
			]
		})]
	});
}
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var AuthenticatedRouteRoute = Route$9.update({
	id: "/_authenticated",
	getParentRoute: () => Route$11
});
var AuthRoute = Route$8.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$11
});
var PricingRoute = Route$7.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$11
});
var AuthenticatedAuctioneerRoute = Route$6.update({
	id: "/auctioneer",
	path: "/auctioneer",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedBookmarksRoute = Route$5.update({
	id: "/bookmarks",
	path: "/bookmarks",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProfileRoute = Route$4.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var RegisterPlayerAuctionIdRoute = Route$16.update({
	id: "/register-player/$auctionId",
	path: "/register-player/$auctionId",
	getParentRoute: () => Route$11
});
var RegisterTeamAuctionIdRoute = Route$17.update({
	id: "/register-team/$auctionId",
	path: "/register-team/$auctionId",
	getParentRoute: () => Route$11
});
var AuthenticatedAuctionsIdRoute = Route$12.update({
	id: "/auctions/$id",
	path: "/auctions/$id",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMyAuctionsIndexRoute = Route$3.update({
	id: "/my-auctions/",
	path: "/my-auctions/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMyAuctionsNewRoute = Route$2.update({
	id: "/my-auctions/new",
	path: "/my-auctions/new",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPlayersPhoneRoute = Route$15.update({
	id: "/players/$phone",
	path: "/players/$phone",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMyAuctionsIdIndexRoute = Route$14.update({
	id: "/my-auctions/$id/",
	path: "/my-auctions/$id/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAuctioneerRoute,
	AuthenticatedBookmarksRoute,
	AuthenticatedProfileRoute,
	AuthenticatedAuctionsIdRoute,
	AuthenticatedMyAuctionsNewRoute,
	AuthenticatedPlayersPhoneRoute,
	AuthenticatedMyAuctionsIndexRoute,
	AuthenticatedMyAuctionsIdAuctioneerRoute: Route$13.update({
		id: "/my-auctions/$id/auctioneer",
		path: "/my-auctions/$id/auctioneer",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedMyAuctionsIdEditRoute: Route$1.update({
		id: "/my-auctions/$id/edit",
		path: "/my-auctions/$id/edit",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedMyAuctionsIdIndexRoute,
	AuthenticatedMyAuctionsIdTeamsTeamIdRoute: Route.update({
		id: "/my-auctions/$id/teams/$teamId",
		path: "/my-auctions/$id/teams/$teamId",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	PricingRoute,
	RegisterPlayerAuctionIdRoute,
	RegisterTeamAuctionIdRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
