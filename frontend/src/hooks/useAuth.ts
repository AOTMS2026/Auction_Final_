import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

const CURRENT_USER_KEY = ["auth", "current-user"] as const;

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isPending } = useQuery({
    queryKey: CURRENT_USER_KEY,
    queryFn: () => authClient.getCurrentUser(),
  });

  useEffect(() => {
    return authClient.onAuthChange(() => {
      void queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY });
    });
  }, [queryClient]);

  return { user: user ?? null, loading: isPending, isAuthenticated: Boolean(user) };
}
