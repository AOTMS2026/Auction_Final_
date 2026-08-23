import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // Auth lives in localStorage, which doesn't exist during SSR — skip the
    // check server-side (this route has ssr:false, so nothing meaningful is
    // rendered there anyway) and let the client-side re-run of beforeLoad do
    // the real check once the browser's token is actually readable. Without
    // this guard, a hard reload / direct link to a protected page would
    // always redirect a signed-in user to /auth, since the server can never
    // see their token.
    if (typeof window === "undefined") return {};
    const user = await authClient.getCurrentUser();
    if (!user) throw redirect({ to: "/auth", search: { next: location.href } });
    return { user };
  },
  component: () => <Outlet />,
});
