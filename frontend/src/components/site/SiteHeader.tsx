import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, LayoutDashboard, LogOut, Menu, Phone, Settings, X } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(value: string) {
  return value.trim().slice(0, 2).toUpperCase();
}

const nav = [
  { label: "Home", to: "/" },
  { label: "Pricing", to: "/pricing" },
];

const anchors = [
  { label: "Today's Auctions", href: "/#today" },
  { label: "Upcoming Auctions", href: "/#upcoming" },
  { label: "Features", href: "/#features" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    authClient.signOut();
    void navigate({ to: "/auth", replace: true });
  }


  return (
    <header className="sticky top-0 z-50 shadow-[0_4px_30px_rgba(10,15,13,0.7)]">
      {/* Top Banner */}
      <div className="bg-[#0a0f0d] text-[#dad7cd]/90 text-xs border-b border-[#141f1a]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5">
          <p className="truncate font-medium tracking-wide text-[#dad7cd]/90">
            World #1 cricket auction platform for local &amp; league player auctions
          </p>
          <a
            href="tel:+918019952233"
            className="hidden items-center gap-1.5 text-[#a3b18a] hover:text-[#dad7cd] transition-colors font-semibold sm:flex"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            +91 80199-52233
          </a>
        </div>
      </div>

      {/* Main Navbar Ribbon matching Hero Section Ambiance */}
      <div
        className="relative border-b border-[#a3b18a]/20"
        style={{
          background:
            "linear-gradient(135deg, #0a0f0d 0%, #172419 32%, #293d33 70%, #3a5a40 100%)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2.5">
          {/* Logo with Curved Edge & Sage/Dust Grey Glow Border */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-95 transition-all group py-0.5">
            <div className="relative p-1.5 rounded-2xl bg-[#141f1a]/85 backdrop-blur-md border-2 border-[#a3b18a]/60 shadow-[0_0_15px_rgba(163,177,138,0.25)] group-hover:border-[#dad7cd] group-hover:shadow-[0_0_22px_rgba(218,215,205,0.4)] transition-all overflow-hidden flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dlxveseav/image/upload/v1787290700/Super_Player_Auction/AOTMS%20%20logo.png"
                alt="Logo"
                className="h-12 sm:h-14 w-auto object-contain rounded-xl"
              />
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#f8f7f5]/90 lg:flex">
            <Link to="/" className="hover:text-[#a3b18a] transition-colors">
              Home
            </Link>
            {anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="hover:text-[#a3b18a] transition-colors"
              >
                {a.label}
              </a>
            ))}
            <Link to="/pricing" className="hover:text-[#a3b18a] transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Account menu"
                  className="rounded-full ring-offset-2 ring-offset-[#141f1a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a3b18a]"
                >
                  <Avatar className="size-9 border-2 border-[#a3b18a]">
                    {user?.avatar && <AvatarImage src={user.avatar} alt="" />}
                    <AvatarFallback className="bg-[#a3b18a] text-sm font-bold text-[#0a0f0d]">
                      {getInitials(user?.name || user?.email || "?")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#141f1a] text-[#edefe8] border border-[#a3b18a]/30">
                  <DropdownMenuLabel className="truncate font-normal text-muted-foreground text-[#dad7cd]">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#293d33]" />
                  <DropdownMenuItem asChild className="focus:bg-[#293d33] focus:text-[#dad7cd]">
                    <Link to="/my-auctions">
                      <LayoutDashboard className="mr-2 size-4" /> My Auctions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#293d33] focus:text-[#dad7cd]">
                    <Link to="/bookmarks">
                      <Bookmark className="mr-2 size-4" /> Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#293d33] focus:text-[#dad7cd]">
                    <Link to="/profile">
                      <Settings className="mr-2 size-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="focus:bg-rose-950 focus:text-rose-300">
                    <LogOut className="mr-2 size-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="hidden rounded-full bg-gradient-to-r from-[#a3b18a] via-[#859865] to-[#588157] hover:from-[#b6c1a2] hover:to-[#739f72] px-5 py-2 text-sm font-bold text-[#0a0f0d] shadow-[0_0_18px_rgba(163,177,138,0.35)] transition-all hover:scale-105 sm:inline-flex"
              >
                Register / Login
              </Link>
            )}

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2 text-[#dad7cd] hover:text-[#a3b18a] hover:bg-[#141f1a]/60 transition-colors lg:hidden"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <nav className="border-t border-[#a3b18a]/20 bg-[#0a0f0d]/95 backdrop-blur-xl px-4 py-3 text-sm text-[#edefe8] lg:hidden space-y-1">
            {[...nav.slice(0, 1), ...anchors, ...nav.slice(1)].map((item) =>
              "to" in item ? (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-[#172419] hover:text-[#a3b18a] font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-3 rounded-lg hover:bg-[#172419] hover:text-[#a3b18a] font-medium transition-colors"
                >
                  {item.label}
                </a>
              ),
            )}
            {!isAuthenticated && (
              <div className="pt-2 pb-1">
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center rounded-full bg-gradient-to-r from-[#a3b18a] via-[#859865] to-[#588157] py-2 text-sm font-bold text-[#0a0f0d]"
                >
                  Register / Login
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
