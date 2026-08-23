import * as React from "react";
import { SiteHeader } from "@/components/site/SiteHeader";

interface AuthLayoutProps {
  children: React.ReactNode;
  redirectContext?: string | null;
}

export function AuthLayout({ children, redirectContext }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      
      <main className="flex-1 flex md:grid md:grid-cols-2">
        {/* Branding Panel */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-zinc-950 text-white relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-50" />
          
          <div className="relative z-10 max-w-md mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">
              Build your ultimate <span className="text-brand">dream team</span>
            </h1>
            <p className="text-lg text-zinc-300">
              Join the most competitive franchise owners. Bid in real-time, manage your purse, and dominate the auction floor.
            </p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm space-y-6">
            {redirectContext && (
              <div className="rounded-md bg-brand/10 p-4 border border-brand/20">
                <p className="text-sm text-brand-foreground text-center font-medium">
                  {redirectContext}
                </p>
              </div>
            )}
            
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
