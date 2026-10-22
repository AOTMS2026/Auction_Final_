import { Phone, ShieldCheck } from "lucide-react";

interface RegistrationHeaderProps {
  auctionName?: string;
  formType?: "player" | "team";
}

export function RegistrationHeader({ auctionName, formType = "player" }: RegistrationHeaderProps) {
  return (
    <>
      {/* Top Banner (Mini Info Bar - Non-navigable) */}
      <div className="bg-gradient-to-r from-[#172e38] via-[#20424f] to-[#172e38] text-[#f2e9dc] text-xs border-b border-[#38bdf8]/40 py-1.5 select-none relative z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4">
          <p className="truncate font-semibold tracking-wide text-[#f2e9dc]">
            Official {formType === "team" ? "Team" : "Player"} Registration Portal {auctionName ? `• ${auctionName}` : ""}
          </p>
          <a
            href="tel:+918019952233"
            className="flex items-center gap-1.5 text-[#f97316] hover:text-[#ffffff] transition-colors font-extrabold drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]"
          >
            <Phone className="size-3.5 text-[#f97316]" aria-hidden="true" />
            <span className="hidden sm:inline">Helpline:</span> +91 80199-52233
          </a>
        </div>
      </div>

      {/* Main Form Header Ribbon - Fixed/Sticky with ZERO Navigation Escape Routes */}
      <header
        className="sticky top-0 z-50 border-b border-[#38bdf8]/35 backdrop-blur-xl shadow-[0_6px_35px_rgba(15,35,45,0.7)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,40,48,0.98) 0%, rgba(30,58,70,0.97) 40%, rgba(50,106,122,0.97) 80%, rgba(38,82,98,0.98) 100%)",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2.5">
          {/* Logo & Founder Profile Section - Pure static branding, NO links back to home */}
          <div className="flex items-center gap-3 sm:gap-4.5">
            {/* Logo with Curved Edge & White Background (Non-clickable) */}
            <div className="flex items-center gap-3 py-0.5 select-none">
              <div className="relative px-2 py-1 sm:px-3 sm:py-1 rounded-2xl bg-white border-2 border-[#38bdf8]/80 shadow-[0_0_25px_rgba(56,189,248,0.5)] overflow-hidden flex items-center justify-center">
                <img
                  src="/AOTMS__logo.png"
                  alt="AOTMS Logo"
                  className="h-9 sm:h-12 w-auto object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Founder Profile - Circular Photo with Name Underneath */}
            <div className="flex flex-col items-center justify-center select-none shrink-0">
              <div className="relative size-12 sm:size-14 rounded-full p-[2.5px] bg-gradient-to-tr from-[#ea580c] via-[#38bdf8] to-[#f97316] shadow-[0_0_18px_rgba(56,189,248,0.5)] overflow-hidden flex items-center justify-center">
                <img
                  src="/Ameen_hq.png"
                  alt="Founder Ameen Sayyed"
                  className="size-full rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center leading-none mt-1 text-center">
                <span className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[#38bdf8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  Founder
                </span>
                <span className="text-[10px] sm:text-[11.5px] font-black text-[#ffffff] tracking-tight whitespace-nowrap mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  Ameen Sayyed
                </span>
              </div>
            </div>
          </div>

          {/* Secure Registration Badge - Replaces all navigation links */}
          <div className="flex items-center gap-2 select-none">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-emerald-400/60 bg-emerald-950/70 text-emerald-300 text-xs sm:text-sm font-black shadow-[0_0_15px_rgba(16,185,129,0.35)]">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span>Secure Registration</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
