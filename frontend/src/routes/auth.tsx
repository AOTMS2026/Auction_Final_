import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordField } from "@/components/auth/PasswordField";
import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (!loading && isAuthenticated) void navigate({ to: target, replace: true });
  }, [loading, isAuthenticated, navigate, target]);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSignIn(data: SignInValues) {
    try {
      await authClient.signIn(data.email, data.password);
      toast.success("Signed in successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    }
  }

  async function onSignUp(data: SignUpValues) {
    try {
      await authClient.signUp(data.email, data.password);
      toast.success("Account created successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed.");
    }
  }

  const redirectContext = next 
    ? `Sign in to continue to your destination.` 
    : null;

  return (
    <AuthLayout redirectContext={redirectContext}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Create Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <div className="space-y-2 text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your franchise.
            </p>
          </div>

          <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
              <FormField
                control={signInForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      {/* Forgot password flow to be implemented in future phase */}
                      <Link to="/auth" search={next ? { next } : {}} className="text-xs font-medium text-brand hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordField autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signInForm.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 py-2">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-sm">
                      Remember me for 30 days
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-2 bg-brand text-brand-foreground hover:bg-brand-dark" disabled={signInForm.formState.isSubmitting}>
                {signInForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="signup" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <div className="space-y-2 text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Register as a franchise owner to start bidding.
            </p>
          </div>

          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordField showStrength autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full mt-6 bg-brand text-brand-foreground hover:bg-brand-dark" disabled={signUpForm.formState.isSubmitting}>
                {signUpForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}
