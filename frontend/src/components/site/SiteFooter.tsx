import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-secondary/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="display text-2xl text-secondary">
            Pitch<span className="opacity-70">Bid</span>
          </p>
          <p className="mt-3 max-w-xs text-sm">
            Run live cricket player auctions for your tournament — teams, budgets, bids and rosters in one place.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Facebook" className="rounded-full bg-brand p-2 text-brand-foreground">
              <Facebook className="size-4" />
            </a>
            <a href="#" aria-label="Instagram" className="rounded-full bg-brand p-2 text-brand-foreground">
              <Instagram className="size-4" />
            </a>
            <a href="#" aria-label="YouTube" className="rounded-full bg-brand p-2 text-brand-foreground">
              <Youtube className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg text-secondary">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-secondary">
                Home
              </Link>
            </li>
            <li>
              <a href="/#today" className="hover:text-secondary">
                Today's auctions
              </a>
            </li>
            <li>
              <a href="/#upcoming" className="hover:text-secondary">
                Upcoming auctions
              </a>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-secondary">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-secondary">Platform</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="/#features" className="hover:text-secondary">
                Features
              </a>
            </li>
            <li>
              <a href="/#steps" className="hover:text-secondary">
                How it works
              </a>
            </li>
            <li>
              <a href="/#guide" className="hover:text-secondary">
                Video guide
              </a>
            </li>
            <li>
              <a href="/#numbers" className="hover:text-secondary">
                Our numbers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-secondary">Contact Us</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
              info@aotms.com
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
              +91 80199-52233
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
              Vijayawada, Andhra Pradesh, India
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-secondary/15 px-4 py-4 text-center text-xs">
        © {new Date().getFullYear()} PitchBid. All rights reserved.
      </div>
    </footer>
  );
}
