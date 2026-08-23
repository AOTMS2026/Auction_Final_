import { request, setToken, getToken, onAuthChange, notifyAuthChange, ApiError } from "@/lib/api-client";

export type AuthUser = { id: string; email: string; name: string | null; avatar: string | null };

export const authClient = {
  async signUp(email: string, password: string): Promise<AuthUser> {
    const { token, user } = await request<{ token: string; user: AuthUser }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(token);
    return user;
  },

  async signIn(email: string, password: string): Promise<AuthUser> {
    const { token, user } = await request<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(token);
    return user;
  },

  signOut() {
    setToken(null);
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!getToken()) return null;
    try {
      const { user } = await request<{ user: AuthUser }>("/api/auth/me");
      return user;
    } catch (error) {
      // Only a real 401 means the token is actually invalid. Anything else
      // (network error, a request aborted mid-flight by a page navigation,
      // a transient 5xx) is not proof the session is bad — clearing the
      // token here would silently log the user out on a mere hiccup.
      if (error instanceof ApiError && error.status === 401) {
        setToken(null);
      }
      return null;
    }
  },

  async updateProfile(patch: { name?: string; avatar?: string | null }): Promise<AuthUser> {
    const { user } = await request<{ user: AuthUser }>("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    notifyAuthChange();
    return user;
  },

  onAuthChange,
};
