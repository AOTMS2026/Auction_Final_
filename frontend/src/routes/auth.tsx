import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordField } from "@/components/auth/PasswordField";
import {
  signInSchema,
  type SignInValues,
} from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function safeNext(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { next?: string } =>
    typeof search["next"] === "string" ? { next: search["next"] as string } : {},

  head: () => {
    const title = "Sign in to bid — PitchBid cricket auctions";
    const description =
      "Create a PitchBid account or sign in to place bids, confirm purchases and manage your franchise purse during live cricket auctions.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: AuthPage,
});

function AuthPage() {
  const { next } = Route.useSearch();
  const target = safeNext(next);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) void navigate({ to: target, replace: true });
  }, [loading, isAuthenticated, navigate, target]);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSignIn(data: SignInValues) {
    try {
      await authClient.signIn(data.email, data.password);
      toast.success("Signed in successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    }
  }

  const redirectContext = next 
    ? `Sign in to access your tournament destination.` 
    : null;

  return (
    <AuthLayout redirectContext={redirectContext}>
      <div className="rounded-3xl border border-[#5c6875]/30 bg-[#171a1d]/90 backdrop-blur-xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(15,18,20,0.8)] space-y-6">
        <div className="space-y-2 text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#162235] border border-[#a1b5d8]/40 text-[#a1b5d8] text-xs font-black uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(161,181,216,0.2)]">
            <ShieldCheck className="size-3.5 text-[#a1b5d8]" />
            <span>Franchise Desk Portal</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#fffcf7]">Welcome back</h1>
          <p className="text-sm text-[#abb4bd]">
            Enter your credentials to access your franchise bidding desk.
          </p>
        </div>

        <Form {...signInForm}>
          <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-5">
            <FormField
              control={signInForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-extrabold uppercase tracking-wider text-[#dae2ef]">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
                      className="bg-[#2e343a]/75 border-[#5c6875]/50 text-[#fffcf7] placeholder:text-[#abb4bd]/50 focus-visible:ring-[#a1b5d8] focus-visible:border-[#a1b5d8] rounded-xl h-11 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-400 font-semibold" />
                </FormItem>
              )}
            />
            
            <FormField
              control={signInForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-extrabold uppercase tracking-wider text-[#dae2ef]">
                      Password
                    </FormLabel>
                    <Link
                      to="/auth"
                      search={next ? { next } : {}}
                      className="text-xs font-bold text-[#a1b5d8] hover:text-[#fffcf7] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordField
                      autoComplete="current-password"
                      className="rounded-xl h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-400 font-semibold" />
                </FormItem>
              )}
            />
            
            <FormField
              control={signInForm.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2.5 space-y-0 py-1">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      className="border-[#5c6875] data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#6c8cc2] data-[state=checked]:to-[#a1b5d8] data-[state=checked]:text-[#162235] rounded-md transition-all"
                    />
                  </FormControl>
                  <FormLabel className="font-medium text-xs text-[#abb4bd] cursor-pointer select-none">
                    Remember me for 30 days
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-4 rounded-full py-3.5 h-auto font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_25px_rgba(161,181,216,0.35)] hover:shadow-[0_0_35px_rgba(161,181,216,0.55)] hover:scale-[1.02] transition-all duration-300 border border-[#fffcf7]/40"
              disabled={signInForm.formState.isSubmitting}
            >
              {signInForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#162235]" />
                  Signing in...
                </>
              ) : (
                "Sign In to Franchise Desk"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
}

export default AuthPage;
