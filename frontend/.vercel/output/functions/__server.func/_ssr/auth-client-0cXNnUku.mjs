import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-client-0cXNnUku.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var TOKEN_KEY = "pitchbid:auth-token";
var AUTH_CHANGE_EVENT = "pitchbid:auth-change";
function apiBase() {
	return {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_API_URL": "http://localhost:5000"
	}["VITE_API_URL"] || "http://localhost:5000";
}
function getToken() {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
	if (typeof window === "undefined") return;
	if (token) window.localStorage.setItem(TOKEN_KEY, token);
	else window.localStorage.removeItem(TOKEN_KEY);
	window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
function notifyAuthChange() {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
var ApiError = class extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.status = status;
	}
};
async function request(path, init) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 6e4);
	try {
		const res = await fetch(`${apiBase()}${path}`, {
			...init,
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				...getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
				...init?.headers
			}
		});
		clearTimeout(timeoutId);
		if (res.status === 204) return void 0;
		const body = await res.json().catch(() => ({}));
		if (!res.ok) throw new ApiError(body?.error || "Request failed", res.status);
		return body;
	} catch (error) {
		clearTimeout(timeoutId);
		if (error.name === "AbortError") throw new ApiError("Request timed out after 60 seconds. Please check your connection.", 408);
		throw error;
	}
}
function onAuthChange(callback) {
	if (typeof window === "undefined") return () => {};
	window.addEventListener(AUTH_CHANGE_EVENT, callback);
	window.addEventListener("storage", callback);
	return () => {
		window.removeEventListener(AUTH_CHANGE_EVENT, callback);
		window.removeEventListener("storage", callback);
	};
}
var authClient = {
	async signUp(email, password) {
		const { token, user } = await request("/api/auth/signup", {
			method: "POST",
			body: JSON.stringify({
				email,
				password
			})
		});
		setToken(token);
		return user;
	},
	async signIn(email, password) {
		const { token, user } = await request("/api/auth/login", {
			method: "POST",
			body: JSON.stringify({
				email,
				password
			})
		});
		setToken(token);
		return user;
	},
	signOut() {
		setToken(null);
	},
	async getCurrentUser() {
		if (!getToken()) return null;
		try {
			const { user } = await request("/api/auth/me");
			return user;
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) setToken(null);
			return null;
		}
	},
	async updateProfile(patch) {
		const { user } = await request("/api/auth/me", {
			method: "PATCH",
			body: JSON.stringify(patch)
		});
		notifyAuthChange();
		return user;
	},
	onAuthChange
};
//#endregion
export { request as i, authClient as n, cn as r, apiBase as t };
