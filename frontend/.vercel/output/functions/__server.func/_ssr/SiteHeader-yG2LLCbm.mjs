import { o as __toESM } from "../_runtime.mjs";
import { n as authClient, r as cn } from "./auth-client-0cXNnUku.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Ct as Bookmark, H as LayoutDashboard, L as LogOut, P as Menu, S as Settings, _t as ChevronRight, bt as Check, k as Phone, lt as Circle, n as X } from "../_libs/lucide-react.mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/radix-ui__react-avatar.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteHeader-yG2LLCbm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CURRENT_USER_KEY = ["auth", "current-user"];
function useAuth() {
	const queryClient = useQueryClient();
	const { data: user, isPending } = useQuery({
		queryKey: CURRENT_USER_KEY,
		queryFn: () => authClient.getCurrentUser()
	});
	(0, import_react.useEffect)(() => {
		return authClient.onAuthChange(() => {
			queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
		});
	}, [queryClient]);
	return {
		user: user ?? null,
		loading: isPending,
		isAuthenticated: Boolean(user)
	};
}
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function getInitials(value) {
	return value.trim().slice(0, 2).toUpperCase();
}
var nav = [{
	label: "Home",
	to: "/"
}, {
	label: "Pricing",
	to: "/pricing"
}];
var anchors = [
	{
		label: "Today's Auctions",
		href: "/#today"
	},
	{
		label: "Upcoming Auctions",
		href: "/#upcoming"
	},
	{
		label: "Features",
		href: "/#features"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [hideMiniNav, setHideMiniNav] = (0, import_react.useState)(false);
	const { user, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const handleScroll = () => {
			setHideMiniNav(window.scrollY > 25);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	async function signOut() {
		authClient.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 shadow-[0_6px_35px_rgba(15,35,45,0.7)] transition-all duration-300",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("bg-gradient-to-r from-[#172e38] via-[#20424f] to-[#172e38] text-[#f2e9dc] text-xs border-b border-[#38bdf8]/40 transition-all duration-300 ease-in-out overflow-hidden", hideMiniNav ? "max-h-0 opacity-0 py-0 border-transparent pointer-events-none" : "max-h-12 opacity-100 py-1.5"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate font-semibold tracking-wide text-[#f2e9dc]",
					children: "World #1 cricket auction platform for local & league player auctions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "tel:+918019952233",
					className: "hidden items-center gap-1.5 text-[#f97316] hover:text-[#ffffff] transition-colors font-extrabold sm:flex drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
						className: "size-3.5 text-[#f97316]",
						"aria-hidden": "true"
					}), "+91 80199-52233"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative border-b border-[#38bdf8]/35 backdrop-blur-xl",
			style: { background: "linear-gradient(135deg, rgba(20,40,48,0.98) 0%, rgba(30,58,70,0.97) 40%, rgba(50,106,122,0.97) 80%, rgba(38,82,98,0.98) 100%)" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "flex items-center gap-3 hover:opacity-95 transition-all group py-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative p-1.5 rounded-2xl bg-[#162e38]/95 backdrop-blur-md border-2 border-[#38bdf8]/80 shadow-[0_0_25px_rgba(56,189,248,0.5)] group-hover:border-[#f97316] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.7)] transition-all overflow-hidden flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "https://res.cloudinary.com/dlxveseav/image/upload/v1787290700/Super_Player_Auction/AOTMS%20%20logo.png",
								alt: "Logo",
								className: "h-12 sm:h-14 w-auto object-contain rounded-xl"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "hidden items-center gap-7 text-sm font-extrabold text-[#ffffff] lg:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "hover:text-[#f97316] transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
								children: "Home"
							}),
							anchors.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: a.href,
								className: "hover:text-[#f97316] transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
								children: a.label
							}, a.href)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pricing",
								className: "hover:text-[#f97316] transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
								children: "Pricing"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							"aria-label": "Account menu",
							className: "rounded-full ring-offset-2 ring-offset-[#172e38] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "size-9 border-2 border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.4)]",
								children: [user?.avatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
									src: user.avatar,
									alt: ""
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "bg-[#162e38] text-sm font-black text-[#f97316]",
									children: getInitials(user?.name || user?.email || "?")
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-56 bg-[#162e38] text-[#ffffff] border border-[#38bdf8]/40 shadow-2xl rounded-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
									className: "truncate font-medium text-[#f2e9dc]/80",
									children: user?.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "bg-[#38bdf8]/20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									className: "focus:bg-[#234857] focus:text-[#ffffff] cursor-pointer rounded-xl font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/my-auctions",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "mr-2 size-4 text-[#38bdf8]" }), " My Auctions"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									className: "focus:bg-[#234857] focus:text-[#ffffff] cursor-pointer rounded-xl font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/bookmarks",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "mr-2 size-4 text-[#38bdf8]" }), " Bookmarks"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									className: "focus:bg-[#234857] focus:text-[#ffffff] cursor-pointer rounded-xl font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/profile",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "mr-2 size-4 text-[#38bdf8]" }), " Profile"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: signOut,
									className: "focus:bg-rose-950/80 focus:text-rose-200 cursor-pointer rounded-xl text-rose-300 font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 size-4" }), " Logout"]
								})
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "hidden rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] px-6 py-2 text-sm font-black text-[#ffffff] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:shadow-[0_0_35px_rgba(249,115,22,0.9)] transition-all hover:scale-105 border border-[#ffffff]/40 sm:inline-flex",
							children: "Login"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Toggle menu",
							onClick: () => setOpen((v) => !v),
							className: "rounded-lg p-2 text-[#ffffff] hover:text-[#f97316] hover:bg-[#234857]/60 transition-colors lg:hidden",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-6" })
						})]
					})
				]
			}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "border-t border-[#38bdf8]/40 bg-[#162e38]/98 backdrop-blur-xl px-4 py-3 text-sm text-[#ffffff] lg:hidden space-y-1",
				children: [[
					...nav.slice(0, 1),
					...anchors,
					...nav.slice(1)
				].map((item) => "to" in item ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					onClick: () => setOpen(false),
					className: "block py-2.5 px-3 rounded-xl hover:bg-[#234857] hover:text-[#f97316] font-extrabold transition-colors",
					children: item.label
				}, item.to) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: item.href,
					onClick: () => setOpen(false),
					className: "block py-2.5 px-3 rounded-xl hover:bg-[#234857] hover:text-[#f97316] font-extrabold transition-colors",
					children: item.label
				}, item.href)), !isAuthenticated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-3 pb-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						onClick: () => setOpen(false),
						className: "block w-full text-center rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] py-2.5 text-sm font-black text-[#ffffff] shadow-[0_0_20px_rgba(249,115,22,0.6)] border border-[#ffffff]/40",
						children: "Register / Login"
					})
				})]
			})]
		})]
	});
}
//#endregion
export { SiteHeader as a, DropdownMenuTrigger as i, DropdownMenuContent as n, useAuth as o, DropdownMenuItem as r, DropdownMenu as t };
