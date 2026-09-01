import { Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, LayoutDashboard, LogOut, Menu, Phone, Settings, X } from "lucide-react";
import { useState, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
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
  const [hideMiniNav, setHideMiniNav] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setHideMiniNav(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function signOut() {
    authClient.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 shadow-[0_4px_30px_rgba(15,18,20,0.8)] transition-all duration-300">
      {/* Top Banner (Mini Navbar) with smooth auto-hide on scroll down */}
      <div
        className={cn(
          "bg-[#0f1214] text-[#abb4bd] text-xs border-b border-[#2e343a]/60 transition-all duration-300 ease-in-out overflow-hidden",
          hideMiniNav ? "max-h-0 opacity-0 py-0 border-transparent pointer-events-none" : "max-h-12 opacity-100 py-1.5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
          <p className="truncate font-medium tracking-wide text-[#abb4bd]">
            World #1 cricket auction platform for local &amp; league player auctions
          </p>
          <a
            href="tel:+918019952233"
            className="hidden items-center gap-1.5 text-[#a1b5d8] hover:text-[#fffcf7] transition-colors font-bold sm:flex"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            +91 80199-52233
          </a>
        </div>
      </div>

      {/* Main Navbar Ribbon matching Slate Grey & Powder Blue Theme */}
      <div
        className="relative border-b border-[#5c6875]/30 backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(23,26,29,0.95) 0%, rgba(28,34,39,0.95) 35%, rgba(46,52,58,0.95) 70%, rgba(22,34,53,0.95) 100%)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2.5">
          {/* Logo with Curved Edge & Powder Blue Glow Border */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-95 transition-all group py-0.5">
            <div className="relative p-1.5 rounded-2xl bg-[#162235]/90 backdrop-blur-md border-2 border-[#a1b5d8]/50 shadow-[0_0_20px_rgba(161,181,216,0.25)] group-hover:border-[#fffcf7] group-hover:shadow-[0_0_25px_rgba(255,252,247,0.35)] transition-all overflow-hidden flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dlxveseav/image/upload/v1787290700/Super_Player_Auction/AOTMS%20%20logo.png"
                alt="Logo"
                className="h-12 sm:h-14 w-auto object-contain rounded-xl"
              />
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-7 text-sm font-bold text-[#ecf0f7] lg:flex">
            <Link to="/" className="hover:text-[#a1b5d8] transition-colors">
              Home
            </Link>
            {anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="hover:text-[#a1b5d8] transition-colors"
              >
                {a.label}
              </a>
            ))}
            <Link to="/pricing" className="hover:text-[#a1b5d8] transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Account menu"
                  className="rounded-full ring-offset-2 ring-offset-[#171a1d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a1b5d8]"
                >
                  <Avatar className="size-9 border-2 border-[#a1b5d8] shadow-sm">
                    {user?.avatar && <AvatarImage src={user.avatar} alt="" />}
                    <AvatarFallback className="bg-[#162235] text-sm font-black text-[#a1b5d8]">
                      {getInitials(user?.name || user?.email || "?")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#171a1d] text-[#fffcf7] border border-[#5c6875]/40 shadow-2xl rounded-2xl">
                  <DropdownMenuLabel className="truncate font-medium text-[#abb4bd]">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#5c6875]/30" />
                  <DropdownMenuItem asChild className="focus:bg-[#2e343a] focus:text-[#fffcf7] cursor-pointer rounded-xl">
                    <Link to="/my-auctions">
                      <LayoutDashboard className="mr-2 size-4 text-[#a1b5d8]" /> My Auctions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#2e343a] focus:text-[#fffcf7] cursor-pointer rounded-xl">
                    <Link to="/bookmarks">
                      <Bookmark className="mr-2 size-4 text-[#a1b5d8]" /> Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#2e343a] focus:text-[#fffcf7] cursor-pointer rounded-xl">
                    <Link to="/profile">
                      <Settings className="mr-2 size-4 text-[#a1b5d8]" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="focus:bg-rose-950/80 focus:text-rose-200 cursor-pointer rounded-xl text-rose-300">
                    <LogOut className="mr-2 size-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="hidden rounded-full bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] px-6 py-2 text-sm font-black text-[#162235] shadow-[0_0_20px_rgba(161,181,216,0.35)] transition-all hover:scale-105 sm:inline-flex"
              >
                Register / Login
              </Link>
            )}

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2 text-[#fffcf7] hover:text-[#a1b5d8] hover:bg-[#2e343a]/60 transition-colors lg:hidden"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <nav className="border-t border-[#5c6875]/30 bg-[#171a1d]/95 backdrop-blur-xl px-4 py-3 text-sm text-[#fffcf7] lg:hidden space-y-1">
            {[...nav.slice(0, 1), ...anchors, ...nav.slice(1)].map((item) =>
              "to" in item ? (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-[#2e343a] hover:text-[#a1b5d8] font-bold transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-[#2e343a] hover:text-[#a1b5d8] font-bold transition-colors"
                >
                  {item.label}
                </a>
              ),
            )}
            {!isAuthenticated && (
              <div className="pt-3 pb-1">
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center rounded-full bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] py-2.5 text-sm font-black text-[#162235] shadow-[0_0_18px_rgba(161,181,216,0.35)]"
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

export default SiteHeader;
