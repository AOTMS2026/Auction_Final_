import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer
      className="relative text-[#a8ffd1]/85 overflow-hidden border-t border-[#00fa75]/20 shadow-[0_-4px_35px_rgba(0,15,7,0.8)]"
      style={{
        background:
          "linear-gradient(135deg, #000f07 0%, #001f0e 32%, #004b23 75%, #002e15 100%)",
      }}
    >
      {/* Top ambient glow line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#70e000]/40 to-transparent pointer-events-none" />

      {/* Background ambient radial aura */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(56,176,0,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4">
        <div>
          <p className="display text-3xl text-white font-black tracking-wide">
            Pitch<span className="text-[#9ef01a] drop-shadow-[0_0_10px_rgba(158,240,26,0.5)]">Bid</span>
          </p>
          <p className="mt-3.5 max-w-xs text-sm text-[#a8ffd1]/80 leading-relaxed">
            World-class cricket player auction platform for local &amp; league tournaments — teams, budgets, real-time bids and squad rosters.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-full bg-[#004b23]/80 hover:bg-[#38b000] p-2.5 text-white border border-[#70e000]/40 shadow-[0_0_12px_rgba(112,224,0,0.25)] hover:scale-110 transition-all"
            >
              <Facebook className="size-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full bg-[#004b23]/80 hover:bg-[#38b000] p-2.5 text-white border border-[#70e000]/40 shadow-[0_0_12px_rgba(112,224,0,0.25)] hover:scale-110 transition-all"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="rounded-full bg-[#004b23]/80 hover:bg-[#38b000] p-2.5 text-white border border-[#70e000]/40 shadow-[0_0_12px_rgba(112,224,0,0.25)] hover:scale-110 transition-all"
            >
              <Youtube className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold uppercase tracking-wider text-[#ccff33]">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/" className="text-[#a8ffd1]/80 hover:text-[#ccff33] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <a href="/#today" className="text-[#a8ffd1]/80 hover:text-[#ccff33] transition-colors">
                Today's auctions
              </a>
            </li>
            <li>
              <a href="/#upcoming" className="text-[#a8ffd1]/80 hover:text-[#ccff33] transition-colors">
                Upcoming auctions
              </a>
            </li>
            <li>
              <Link to="/pricing" className="text-[#a8ffd1]/80 hover:text-[#ccff33] transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold uppercase tracking-wider text-[#ccff33]">Platform</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href="/#features" className="text-[#a8ffd1]/80 hover:text-[#ccff33] transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="/#steps" className="text-[#a8ffd1]/80 hover:text-[#ccff33] transition-colors">
                How it works
              </a>
            </li>
            <li>
              <a href="/#guide" className="text-[#a8ffd1]/80 hover:text-[#ccff33] transition-colors">
                Video guide
              </a>
            </li>
            <li>
              <a href="/#numbers" className="text-[#a8ffd1]/80 hover:text-[#ccff33] transition-colors">
                Our numbers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-bold uppercase tracking-wider text-[#ccff33]">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#a8ffd1]/80">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-[#70e000]" />
              info@aotms.com
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-[#70e000]" />
              +91 80199-52233
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#70e000]" />
              Vijayawada, Andhra Pradesh, India
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#00fa75]/15 px-4 py-5 text-center text-xs text-[#a8ffd1]/60">
        © {new Date().getFullYear()} PitchBid. All rights reserved. Built for professional cricket tournament organizers.
      </div>
    </footer>
  );
}

export default SiteFooter;
