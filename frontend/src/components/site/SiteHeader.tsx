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
    <header className="sticky top-0 z-50 shadow-[0_6px_35px_rgba(15,35,45,0.7)] transition-all duration-300">
      {/* Top Banner (Mini Navbar) with smooth auto-hide on scroll down */}
      <div
        className={cn(
          "bg-gradient-to-r from-[#172e38] via-[#20424f] to-[#172e38] text-[#f2e9dc] text-xs border-b border-[#38bdf8]/40 transition-all duration-300 ease-in-out overflow-hidden",
          hideMiniNav ? "max-h-0 opacity-0 py-0 border-transparent pointer-events-none" : "max-h-12 opacity-100 py-1.5"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
          <p className="truncate font-semibold tracking-wide text-[#f2e9dc]">
            World #1 cricket auction platform for local &amp; league player auctions
          </p>
          <a
            href="tel:+918019952233"
            className="hidden items-center gap-1.5 text-[#f97316] hover:text-[#ffffff] transition-colors font-extrabold sm:flex drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]"
          >
            <Phone className="size-3.5 text-[#f97316]" aria-hidden="true" />
            +91 80199-52233
          </a>
        </div>
      </div>

      {/* Main Navbar Ribbon matching Luminous Blue-Slate & Bright Linen Theme */}
      <div
        className="relative border-b border-[#38bdf8]/35 backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,40,48,0.98) 0%, rgba(30,58,70,0.97) 40%, rgba(50,106,122,0.97) 80%, rgba(38,82,98,0.98) 100%)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2.5">
          {/* Logo with Curved Edge & Luminous Blue-Slate Glow Border */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-95 transition-all group py-0.5">
            <div className="relative p-1.5 rounded-2xl bg-[#162e38]/95 backdrop-blur-md border-2 border-[#38bdf8]/80 shadow-[0_0_25px_rgba(56,189,248,0.5)] group-hover:border-[#f97316] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.7)] transition-all overflow-hidden flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dlxveseav/image/upload/v1787290700/Super_Player_Auction/AOTMS%20%20logo.png"
                alt="Logo"
                className="h-12 sm:h-14 w-auto object-contain rounded-xl"
              />
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-7 text-sm font-extrabold text-[#ffffff] lg:flex">
            <Link to="/" className="hover:text-[#f97316] transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              Home
            </Link>
            {anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="hover:text-[#f97316] transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
              >
                {a.label}
              </a>
            ))}
            <Link to="/pricing" className="hover:text-[#f97316] transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              Pricing
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Account menu"
                  className="rounded-full ring-offset-2 ring-offset-[#172e38] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
                >
                  <Avatar className="size-9 border-2 border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                    {user?.avatar && <AvatarImage src={user.avatar} alt="" />}
                    <AvatarFallback className="bg-[#162e38] text-sm font-black text-[#f97316]">
                      {getInitials(user?.name || user?.email || "?")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#162e38] text-[#ffffff] border border-[#38bdf8]/40 shadow-2xl rounded-2xl">
                  <DropdownMenuLabel className="truncate font-medium text-[#f2e9dc]/80">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#38bdf8]/20" />
                  <DropdownMenuItem asChild className="focus:bg-[#234857] focus:text-[#ffffff] cursor-pointer rounded-xl font-bold">
                    <Link to="/my-auctions">
                      <LayoutDashboard className="mr-2 size-4 text-[#38bdf8]" /> My Auctions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#234857] focus:text-[#ffffff] cursor-pointer rounded-xl font-bold">
                    <Link to="/bookmarks">
                      <Bookmark className="mr-2 size-4 text-[#38bdf8]" /> Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#234857] focus:text-[#ffffff] cursor-pointer rounded-xl font-bold">
                    <Link to="/profile">
                      <Settings className="mr-2 size-4 text-[#38bdf8]" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="focus:bg-rose-950/80 focus:text-rose-200 cursor-pointer rounded-xl text-rose-300 font-bold">
                    <LogOut className="mr-2 size-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="hidden rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] px-6 py-2 text-sm font-black text-[#ffffff] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:shadow-[0_0_35px_rgba(249,115,22,0.9)] transition-all hover:scale-105 border border-[#ffffff]/40 sm:inline-flex"
              >
                Register / Login
              </Link>
            )}

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg p-2 text-[#ffffff] hover:text-[#f97316] hover:bg-[#234857]/60 transition-colors lg:hidden"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <nav className="border-t border-[#38bdf8]/40 bg-[#162e38]/98 backdrop-blur-xl px-4 py-3 text-sm text-[#ffffff] lg:hidden space-y-1">
            {[...nav.slice(0, 1), ...anchors, ...nav.slice(1)].map((item) =>
              "to" in item ? (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-[#234857] hover:text-[#f97316] font-extrabold transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-[#234857] hover:text-[#f97316] font-extrabold transition-colors"
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
                  className="block w-full text-center rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] py-2.5 text-sm font-black text-[#ffffff] shadow-[0_0_20px_rgba(249,115,22,0.6)] border border-[#ffffff]/40"
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
