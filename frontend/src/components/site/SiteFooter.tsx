import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer
      className="relative text-[#ecf0f7] overflow-hidden border-t border-[#5c6875]/30 shadow-[0_-4px_35px_rgba(15,18,20,0.8)]"
      style={{
        background:
          "linear-gradient(135deg, #0f1214 0%, #171a1d 35%, #1c2227 75%, #162235 100%)",
      }}
    >
      {/* Top ambient glow line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#a1b5d8]/50 to-transparent pointer-events-none" />

      {/* Background ambient radial aura */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(161,181,216,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4">
        <div>
          <p className="display text-3xl text-[#fffcf7] font-black tracking-wide">
            Pitch<span className="text-[#a1b5d8] drop-shadow-[0_0_15px_rgba(161,181,216,0.5)]">Bid</span>
          </p>
          <p className="mt-3.5 max-w-xs text-sm text-[#abb4bd] leading-relaxed">
            World-class cricket player auction platform for local &amp; league tournaments — teams, budgets, real-time bids and squad rosters.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-full bg-[#162235] hover:bg-[#2d436a] p-2.5 text-[#a1b5d8] hover:text-[#fffcf7] border border-[#a1b5d8]/30 shadow-[0_0_12px_rgba(161,181,216,0.25)] hover:scale-110 transition-all"
            >
              <Facebook className="size-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full bg-[#162235] hover:bg-[#2d436a] p-2.5 text-[#a1b5d8] hover:text-[#fffcf7] border border-[#a1b5d8]/30 shadow-[0_0_12px_rgba(161,181,216,0.25)] hover:scale-110 transition-all"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="rounded-full bg-[#162235] hover:bg-[#2d436a] p-2.5 text-[#a1b5d8] hover:text-[#fffcf7] border border-[#a1b5d8]/30 shadow-[0_0_12px_rgba(161,181,216,0.25)] hover:scale-110 transition-all"
            >
              <Youtube className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-base font-black uppercase tracking-wider text-[#a1b5d8]">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/" className="text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium">
                Home
              </Link>
            </li>
            <li>
              <a href="/#today" className="text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium">
                Today's auctions
              </a>
            </li>
            <li>
              <a href="/#upcoming" className="text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium">
                Upcoming auctions
              </a>
            </li>
            <li>
              <Link to="/pricing" className="text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-black uppercase tracking-wider text-[#a1b5d8]">Platform</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href="/#features" className="text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium">
                Features
              </a>
            </li>
            <li>
              <a href="/#steps" className="text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium">
                How it works
              </a>
            </li>
            <li>
              <a href="/#numbers" className="text-[#abb4bd] hover:text-[#fffcf7] transition-colors font-medium">
                Our numbers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-black uppercase tracking-wider text-[#a1b5d8]">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#abb4bd]">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-[#a1b5d8]" />
              info@aotms.com
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-[#a1b5d8]" />
              +91 80199-52233
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#a1b5d8]" />
              Vijayawada, Andhra Pradesh, India
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#5c6875]/25 px-4 py-5 text-center text-xs text-[#abb4bd]/70">
        © {new Date().getFullYear()} PitchBid. All rights reserved. Built for professional cricket tournament organizers.
      </div>
    </footer>
  );
}

export default SiteFooter;
