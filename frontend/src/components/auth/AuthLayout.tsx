import * as React from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Radio, Tv, Wallet } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  redirectContext?: string | null;
}

export function AuthLayout({ children, redirectContext }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#080b05] text-[#fefae0] selection:bg-[#dda15e] selection:text-[#080b05]">
      <SiteHeader />

      <main className="flex-1 flex flex-col md:grid md:grid-cols-2 relative overflow-hidden">
        {/* Left Branding Panel with Hero Section Ambiance & Color Palette */}
        <div
          className="hidden md:flex flex-col justify-between p-12 lg:p-16 relative overflow-hidden select-none border-r border-[#dda15e]/20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 28%, #1f2a13 0%, #18200e 38%, #101509 70%, #080b05 100%)",
          }}
        >
          {/* Sunlit Clay & Cornsilk Ambient Sky Halo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(221,161,94,0.25)_0%,rgba(254,250,224,0.10)_30%,transparent_68%)] pointer-events-none" />

          {/* Olive Leaf Depth Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(96,108,56,0.22)_0%,rgba(40,54,24,0.26)_45%,transparent_72%)] pointer-events-none" />

          {/* Copperwood Warm Earth Bounce at Floor */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,rgba(188,108,37,0.20)_0%,transparent_55%)] pointer-events-none" />

          {/* Background Luminous Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span
              className="font-sans font-black tracking-tighter uppercase whitespace-nowrap text-[#fefae0] opacity-[0.05] text-8xl lg:text-9xl"
              style={{
                letterSpacing: "-0.04em",
                transform: "translate(0px, 20px)",
                textShadow: "0 0 80px rgba(221, 161, 94, 0.4)",
              }}
            >
              AUCTION
            </span>
          </div>

          {/* Top Tagline */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141f1a]/85 border border-[#dda15e]/40 backdrop-blur-md shadow-[0_0_20px_rgba(221,161,94,0.25)] mb-3">
              <span className="size-2 rounded-full bg-[#dda15e] animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#fefae0]">
                Live Cricket Arena
              </span>
            </div>
          </div>

          {/* Main Headline & Description */}
          <div className="relative z-10 max-w-lg space-y-6 my-auto">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#fefae0]">
              Build your ultimate{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dda15e] via-[#fefae0] to-[#bc6c25] drop-shadow-[0_0_25px_rgba(221,161,94,0.4)]">
                dream team
              </span>
            </h1>
            <p className="text-base lg:text-lg text-[#fefae0]/80 leading-relaxed font-medium">
              Join elite tournament organizers and team owners. Bid in real-time with zero latency, track squad budgets automatically, and dominate auction night.
            </p>

            {/* Feature Badges matching Hero Section */}
            <div className="grid grid-cols-1 gap-3.5 pt-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#dda15e]/25 bg-[#18200e]/60 backdrop-blur-md shadow-sm">
                <div className="p-2 rounded-xl bg-[#dda15e]/15 text-[#dda15e]">
                  <Radio className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#fefae0]">Live Synchronized Bidding</p>
                  <p className="text-[11px] text-[#fefae0]/65">Instant paddle raises and hammer calls</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#dda15e]/25 bg-[#18200e]/60 backdrop-blur-md shadow-sm">
                <div className="p-2 rounded-xl bg-[#dda15e]/15 text-[#dda15e]">
                  <Wallet className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#fefae0]">Automated Purse Limits</p>
                  <p className="text-[11px] text-[#fefae0]/65">Real-time wallet adjustments per franchise</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#dda15e]/25 bg-[#18200e]/60 backdrop-blur-md shadow-sm">
                <div className="p-2 rounded-xl bg-[#dda15e]/15 text-[#dda15e]">
                  <Tv className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#fefae0]">Televised Broadcast Overlay</p>
                  <p className="text-[11px] text-[#fefae0]/65">Projector-ready live player cards and stats</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="relative z-10 pt-6 border-t border-[#dda15e]/15 text-xs text-[#fefae0]/60">
            Trusted by 138,500+ cricket tournament organizers worldwide
          </div>
        </div>

        {/* Right Form Panel with Hero Warm Ambiance */}
        <div
          className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-16 xl:px-20 relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 15%, #18200e 0%, #101509 45%, #080b05 100%)",
          }}
        >
          {/* Subtle Sunlit Clay Overhead Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(221,161,94,0.14)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 mx-auto w-full max-w-md space-y-6">
            {redirectContext && (
              <div className="rounded-2xl bg-[#dda15e]/10 p-4 border border-[#dda15e]/30 shadow-[0_0_15px_rgba(221,161,94,0.15)] backdrop-blur-md">
                <p className="text-xs text-[#fefae0] text-center font-semibold">
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

export default AuthLayout;
