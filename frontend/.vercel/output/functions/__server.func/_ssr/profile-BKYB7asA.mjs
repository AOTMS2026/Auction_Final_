import { o as __toESM } from "../_runtime.mjs";
import { n as authClient } from "./auth-client-0cXNnUku.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { G as ImagePlus, L as LogOut, R as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as SiteHeader, o as useAuth } from "./SiteHeader-yG2LLCbm.mjs";
import { t as Skeleton } from "./skeleton-CFtqm2zk.mjs";
import { t as FallbackImage } from "./fallback-image-CwnNUhIA.mjs";
import { t as Button } from "./button-sM6yADNO.mjs";
import { n as Label, t as Input } from "./input-BifiwAc8.mjs";
import { n as fileToCompressedDataUrl, t as IMAGE_PRESETS } from "./image-DJ08YD9d.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BKYB7asA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)(user?.name ?? "");
	const [avatar, setAvatar] = (0, import_react.useState)(user?.avatar ?? null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function handleAvatarChange(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 10485760) {
			alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
			toast.error("Image must be 10MB or less.");
			e.target.value = "";
			return;
		}
		const dataUrl = await fileToCompressedDataUrl(file, IMAGE_PRESETS.avatar);
		setAvatar(dataUrl);
	}
	async function handleSave(e) {
		e.preventDefault();
		setSaving(true);
		try {
			await authClient.updateProfile({
				name,
				avatar
			});
			toast.success("Profile updated.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to update profile.");
		} finally {
			setSaving(false);
		}
	}
	function handleSignOut() {
		authClient.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-md px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-32" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-2 h-4 w-48" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-24 rounded-full" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" })
					]
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235]",
		style: { background: "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-md px-4 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-[#2e343a]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#5c6875]/30 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-black text-[#fffcf7] tracking-tight",
						children: "Profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-[#abb4bd]",
						children: user?.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSave,
						className: "mt-8 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									htmlFor: "avatar",
									className: "relative flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235]/60 text-[#a1b5d8] hover:bg-[#162235] hover:border-[#a1b5d8] transition-colors shadow-inner",
									children: [avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackImage, {
										src: avatar,
										alt: "Your avatar",
										className: "size-full object-cover",
										fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
											className: "size-6",
											"aria-hidden": "true"
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
										className: "size-6",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "avatar",
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: handleAvatarChange
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-[#abb4bd] mt-2",
									children: "JPEG, PNG up to 10MB"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								className: "text-xs font-bold uppercase tracking-wider text-[#abb4bd]",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Your name",
								className: "mt-1.5 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full rounded-full py-3.5 h-auto font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_25px_rgba(161,181,216,0.35)] transition-all",
								disabled: saving,
								children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), " Saving..."] }) : "Save Changes"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "mt-4 w-full rounded-full border-[#5c6875]/40 bg-[#171a1d]/60 text-[#fffcf7] hover:bg-[#2e343a] hover:text-[#fffcf7] transition-all",
						onClick: handleSignOut,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 size-4" }), " Sign out"]
					})
				]
			})
		})]
	});
}
//#endregion
export { ProfilePage as component };
