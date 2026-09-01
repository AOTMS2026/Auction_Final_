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
      <div className="rounded-3xl border border-[#dda15e]/25 bg-[#141f1a]/85 backdrop-blur-xl p-8 sm:p-10 shadow-[0_15px_45px_rgba(8,11,5,0.7)] space-y-6">
        <div className="space-y-2 text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dda15e]/15 border border-[#dda15e]/30 text-[#dda15e] text-xs font-bold uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(221,161,94,0.15)]">
            <ShieldCheck className="size-3.5" />
            <span>Franchise Desk Portal</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#fefae0]">Welcome back</h1>
          <p className="text-sm text-[#e4b57f]/80">
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
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#fefae0]/90">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
                      className="bg-[#18200e]/80 border-[#4c562c]/60 text-[#fefae0] placeholder:text-[#a9b876]/50 focus-visible:ring-[#dda15e] focus-visible:border-[#dda15e] rounded-xl h-11 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-[#dda15e]" />
                </FormItem>
              )}
            />
            
            <FormField
              control={signInForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#fefae0]/90">
                      Password
                    </FormLabel>
                    <Link
                      to="/auth"
                      search={next ? { next } : {}}
                      className="text-xs font-bold text-[#dda15e] hover:text-[#fefae0] transition-colors"
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
                  <FormMessage className="text-xs text-[#dda15e]" />
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
                      className="border-[#dda15e]/50 data-[state=checked]:bg-[#dda15e] data-[state=checked]:text-[#080b05] rounded-md transition-all"
                    />
                  </FormControl>
                  <FormLabel className="font-medium text-xs text-[#fefae0]/80 cursor-pointer select-none">
                    Remember me for 30 days
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-4 rounded-full py-3.5 h-auto font-black text-sm text-[#080b05] bg-gradient-to-r from-[#dda15e] via-[#e4b57f] to-[#dda15e] hover:from-[#e4b57f] hover:to-[#dda15e] shadow-[0_0_25px_rgba(221,161,94,0.35)] hover:shadow-[0_0_35px_rgba(221,161,94,0.55)] hover:scale-[1.02] transition-all duration-300 border border-[#fefae0]/40"
              disabled={signInForm.formState.isSubmitting}
            >
              {signInForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
