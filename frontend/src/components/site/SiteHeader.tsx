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
    <header className="sticky top-0 z-50">
      <div className="bg-brand-dark text-brand-foreground/85 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5">
          <p className="truncate">World #1 cricket auction platform for local &amp; league player auctions</p>
          <a href="tel:+918019952233" className="hidden items-center gap-1.5 hover:text-brand-foreground sm:flex">
            <Phone className="size-3.5" aria-hidden="true" />
            +91 80199-52233 
          </a>
        </div>
      </div>

      <div className="ribbon">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img 
              src="https://res.cloudinary.com/dlxveseav/image/upload/v1787290700/Super_Player_Auction/AOTMS%20%20logo.png" 
              alt="Logo" 
              className="h-10 w-auto object-contain"
            />
            
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
            <Link to="/" className="hover:opacity-80">
              Home
            </Link>
            {anchors.map((a) => (
              <a key={a.href} href={a.href} className="hover:opacity-80">
                {a.label}
              </a>
            ))}
            <Link to="/pricing" className="hover:opacity-80">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Account menu"
                  className="rounded-full ring-offset-2 ring-offset-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-foreground"
                >
                  <Avatar className="size-9 border-2 border-brand-foreground/60">
                    {user?.avatar && <AvatarImage src={user.avatar} alt="" />}
                    <AvatarFallback className="bg-brand-foreground text-sm font-semibold text-brand">
                      {getInitials(user?.name || user?.email || "?")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-auctions">
                      <LayoutDashboard className="mr-2 size-4" /> My Auctions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookmarks">
                      <Bookmark className="mr-2 size-4" /> Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <Settings className="mr-2 size-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 size-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="hidden rounded-md bg-brand-foreground px-4 py-2 text-sm font-semibold text-brand sm:inline-flex"
              >
                Register / Login
              </Link>
            )}

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="rounded-md p-2 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-brand-foreground/20 px-4 pb-4 text-sm lg:hidden">
            {[...nav.slice(0, 1), ...anchors, ...nav.slice(1)].map((item) =>
              "to" in item ? (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-2.5"
                >
                  {item.label}
                </Link>
              ) : (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="block py-2.5">
                  {item.label}
                </a>
              ),
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
