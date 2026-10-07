import { Link, useNavigate } from "@tanstack/react-router";
import { Gavel, Plus, LogOut, LayoutDashboard, ShieldCheck, Bookmark, Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminNavbarProps {
  activeTab?: "my-auctions" | "create-auction";
  onTabChange?: (tab: "my-auctions" | "create-auction") => void;
}

export function AdminNavbar({ activeTab = "my-auctions", onTabChange }: AdminNavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    authClient.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#38bdf8]/40 bg-[#0f171c]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Left: Logo + Admin Badge */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative p-1.5 rounded-2xl bg-[#142630] border-2 border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.5)] group-hover:border-[#f97316] transition-all">
              <img
                src="https://res.cloudinary.com/dlxveseav/image/upload/v1787290700/Super_Player_Auction/AOTMS%20%20logo.png"
                alt="Logo"
                className="h-10 sm:h-11 w-auto object-contain rounded-xl"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-black text-white uppercase tracking-wider font-auction">
                PitchBid
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8] flex items-center gap-1">
                <ShieldCheck className="size-3 text-emerald-400" /> Admin Panel
              </span>
            </div>
          </Link>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center gap-2 bg-[#142630] p-1 rounded-2xl border border-[#38bdf8]/30 ml-2 sm:ml-6">
            <button
              type="button"
              onClick={() => onTabChange?.("my-auctions")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "my-auctions"
                  ? "bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                  : "text-[#abb4bd] hover:text-white hover:bg-[#1a3442]"
              }`}
            >
              <Gavel className="size-4" />
              <span>My Auctions</span>
            </button>
          </div>
        </div>

        {/* Right: Admin Profile Dropdown Menu */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#142630] border border-[#38bdf8]/50 text-xs hover:border-[#38bdf8] transition-all cursor-pointer shadow-md group"
              >
                <Avatar className="size-7 border border-[#38bdf8]">
                  {user?.avatar && <AvatarImage src={user.avatar} />}
                  <AvatarFallback className="bg-[#38bdf8] text-[#0f171c] font-black">
                    {(user?.name || "AD").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-black text-white leading-tight group-hover:text-[#38bdf8] transition-colors">
                    {user?.name || "AOTMS"}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Role: {user?.role || "Admin"}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl border-2 border-[#38bdf8]/40 bg-[#0c1820] text-white shadow-2xl p-1.5"
            >
              <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-[#abb4bd] border-b border-[#38bdf8]/20 mb-1">
                <div className="font-black text-white">{user?.name || "AOTMS"}</div>
                <div className="text-[11px] font-normal text-[#38bdf8] truncate">{user?.email || "aotms@aotms.com"}</div>
                <div className="mt-1 text-[10px] text-emerald-400 font-black uppercase tracking-wider">
                  Role: {user?.role || "Admin"}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuItem asChild className="rounded-xl font-extrabold focus:bg-[#162e38] focus:text-[#f97316] text-[#f97316] cursor-pointer">
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-2.5 size-4 text-[#f97316]" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-xl font-extrabold focus:bg-[#162e38] focus:text-[#38bdf8] cursor-pointer">
                <Link to="/bookmarks">
                  <Bookmark className="mr-2.5 size-4 text-[#38bdf8]" />
                  Bookmarks
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-xl font-extrabold focus:bg-[#162e38] focus:text-[#38bdf8] cursor-pointer">
                <Link to="/profile">
                  <Settings className="mr-2.5 size-4 text-[#38bdf8]" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#38bdf8]/20 my-1" />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="rounded-xl font-extrabold text-rose-300 focus:bg-rose-950/80 focus:text-rose-200 cursor-pointer"
              >
                <LogOut className="mr-2.5 size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="hidden sm:flex rounded-xl border-2 border-rose-500/50 bg-rose-950/40 text-rose-300 hover:bg-rose-600 hover:text-white font-extrabold text-xs gap-2 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
