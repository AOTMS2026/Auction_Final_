import * as React from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Radio, Tv, Wallet } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  redirectContext?: string | null;
}

export function AuthLayout({ children, redirectContext }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1214] text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235]">
      <SiteHeader />

      <main className="flex-1 flex flex-col md:grid md:grid-cols-2 relative overflow-hidden">
        {/* Left Branding Panel with Slate Grey & Powder Blue Ambiance */}
        <div
          className="hidden md:flex flex-col justify-between p-12 lg:p-16 relative overflow-hidden select-none border-r border-[#5c6875]/30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 28%, #2e343a 0%, #1c2227 38%, #171a1d 70%, #0f1214 100%)",
          }}
        >
          {/* Powder Blue & Frosted Mint Ambient Sky Halo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(161,181,216,0.22)_0%,rgba(228,240,208,0.10)_30%,transparent_68%)] pointer-events-none" />

          {/* Slate Grey Atmospheric Depth Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(67,101,160,0.20)_0%,rgba(23,26,29,0.35)_45%,transparent_72%)] pointer-events-none" />

          {/* Tea Green Gentle Earth Bounce at Floor */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_92%,rgba(194,216,185,0.15)_0%,transparent_55%)] pointer-events-none" />

          {/* Background Luminous Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span
              className="font-sans font-black tracking-tighter uppercase whitespace-nowrap text-[#fffcf7] opacity-[0.04] text-8xl lg:text-9xl"
              style={{
                letterSpacing: "-0.04em",
                transform: "translate(0px, 20px)",
                textShadow: "0 0 80px rgba(161, 181, 216, 0.4)",
              }}
            >
              AUCTION
            </span>
          </div>

          {/* Top Tagline */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162235]/85 border border-[#a1b5d8]/40 backdrop-blur-md shadow-[0_0_20px_rgba(161,181,216,0.25)] mb-3">
              <span className="size-2 rounded-full bg-[#a1b5d8] animate-pulse" />
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#e4f0d0]">
                Live Cricket Arena
              </span>
            </div>
          </div>

          {/* Main Headline & Description */}
          <div className="relative z-10 max-w-lg space-y-6 my-auto">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#fffcf7]">
              Build your ultimate{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a1b5d8] via-[#e4f0d0] to-[#c2d8b9] drop-shadow-[0_0_25px_rgba(161,181,216,0.4)]">
                dream team
              </span>
            </h1>
            <p className="text-base lg:text-lg text-[#abb4bd] leading-relaxed font-medium">
              Join elite tournament organizers and team owners. Bid in real-time with zero latency, track squad budgets automatically, and dominate auction night.
            </p>

            {/* Feature Badges matching Slate Grey Theme */}
            <div className="grid grid-cols-1 gap-3.5 pt-4">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/70 backdrop-blur-md shadow-lg hover:border-[#a1b5d8]/50 transition-all">
                <div className="p-2.5 rounded-xl bg-[#162235] text-[#a1b5d8] border border-[#a1b5d8]/30 shadow-sm">
                  <Radio className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#fffcf7]">Live Synchronized Bidding</p>
                  <p className="text-[11px] text-[#abb4bd]">Instant paddle raises and hammer calls</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/70 backdrop-blur-md shadow-lg hover:border-[#a1b5d8]/50 transition-all">
                <div className="p-2.5 rounded-xl bg-[#162235] text-[#a1b5d8] border border-[#a1b5d8]/30 shadow-sm">
                  <Wallet className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#fffcf7]">Automated Purse Limits</p>
                  <p className="text-[11px] text-[#abb4bd]">Real-time wallet adjustments per franchise</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/70 backdrop-blur-md shadow-lg hover:border-[#a1b5d8]/50 transition-all">
                <div className="p-2.5 rounded-xl bg-[#162235] text-[#a1b5d8] border border-[#a1b5d8]/30 shadow-sm">
                  <Tv className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#fffcf7]">Televised Broadcast Overlay</p>
                  <p className="text-[11px] text-[#abb4bd]">Projector-ready live player cards and stats</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="relative z-10 pt-6 border-t border-[#5c6875]/25 text-xs text-[#abb4bd]/80">
            Trusted by 138,500+ cricket tournament organizers worldwide
          </div>
        </div>

        {/* Right Form Panel with Slate Grey & Powder Blue Theme */}
        <div
          className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-16 xl:px-20 relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 45%, #0f1214 100%)",
          }}
        >
          {/* Subtle Powder Blue Overhead Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(161,181,216,0.12)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 mx-auto w-full max-w-md space-y-6">
            {redirectContext && (
              <div className="rounded-2xl bg-[#162235]/80 p-4 border border-[#a1b5d8]/40 shadow-[0_0_15px_rgba(161,181,216,0.15)] backdrop-blur-md">
                <p className="text-xs text-[#ecf0f7] text-center font-bold">
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
