import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Gavel, Home, Mic2, User } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  { to: "/" as const, label: "Home", icon: Home },
  { to: "/my-auctions" as const, label: "My Auction", icon: Gavel },
  { to: "/bookmarks" as const, label: "Bookmarks", icon: Bookmark },
  { to: "/auctioneer" as const, label: "Auctioneer", icon: Mic2 },
  { to: "/profile" as const, label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-card md:hidden"
      aria-label="Primary"
    >
      {tabs.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium",
              active ? "text-brand" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
