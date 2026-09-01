import { format } from "date-fns";
import { 
  CalendarDays, Clock, MapPin, Share2, Copy, 
  Settings, Users, DollarSign, ArrowUpRight, Award,
  MessageCircle, Link as LinkIcon
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

import type { Auction, Player } from "@/lib/auction-client";
import type { Team } from "@/lib/auction-client";

type AboutTabProps = {
  auction: Auction;
  teams: Team[];
  players: Player[];
};

export function AboutTab({ auction, teams, players }: AboutTabProps) {
  function copyCode() {
    navigator.clipboard.writeText(auction.id);
    toast.success("Auction code copied!");
  }

  const shareAuction = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: auction.name,
          text: `Check out the ${auction.name} auction!`,
          url: url,
        });
      } catch (err) {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Auction URL copied to clipboard!");
    }
  };

  const auctionUrl = typeof window !== "undefined" ? `${window.location.origin}/auctions/${auction.id}` : "";

  return (
    <div className="space-y-4 text-[#fffcf7]">
      {/* Top Details Card */}
      <div className="rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgba(23,26,29,0.7)]">
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#5c6875]/30 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-semibold text-[#a1b5d8]">
            <CalendarDays className="size-4 text-[#a1b5d8]" />
            <span>{format(new Date(auction.startsAt), "dd-MM-yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-[#c2d8b9]">
            <Clock className="size-4 text-[#c2d8b9]" />
            <span>{format(new Date(auction.startsAt), "h:mm a")}</span>
          </div>
        </div>
        
        <div className="p-5 flex items-center gap-4">
          <div className="size-16 rounded-xl bg-[#162235] border border-[#a1b5d8]/40 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
            {auction.coverImage ? (
              <img src={auction.coverImage} alt={auction.name} className="size-full object-cover" />
            ) : (
              <span className="text-xl font-black text-[#a1b5d8]">{auction.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-[#fffcf7]">{auction.name}</h2>
            <p className="flex items-center gap-1.5 text-xs text-[#abb4bd] mt-1 font-medium">
              <MapPin className="size-3.5 text-[#a1b5d8]" />
              <span>Official Tournament Arena</span>
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center px-4 py-3 bg-[#171a1d]/60 border-t border-[#5c6875]/30">
          <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-[#e3e6e9]">
            <div className="bg-[#162235] p-1.5 rounded-lg text-[#a1b5d8] border border-[#a1b5d8]/30">
              <Users className="size-3.5" />
            </div>
            <span>{auction.playersPerTeam} Players Per Team</span>
          </div>
          <button
            onClick={shareAuction}
            className="text-[#a1b5d8] hover:bg-[#a1b5d8]/15 p-2 rounded-xl transition-colors"
            title="Share Tournament"
          >
            <Share2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)]">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20">
          <div className="bg-[#162235] p-2 rounded-xl text-[#a1b5d8] shrink-0 border border-[#a1b5d8]/30">
            <Copy className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold">Auction Code</div>
            <div className="text-sm font-black flex items-center gap-1 text-[#fffcf7]">
              {auction.id.slice(-6)}
              <button onClick={copyCode} className="text-[#a1b5d8] hover:text-[#fffcf7]">
                <Copy className="size-3" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20">
          <div className="bg-[#162235] p-2 rounded-xl text-[#c2d8b9] shrink-0 border border-[#c2d8b9]/30">
            <DollarSign className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold">Purse / Team</div>
            <div className="text-sm font-black text-[#c2d8b9]">{auction.pointsPerTeam.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20">
          <div className="bg-[#162235] p-2 rounded-xl text-[#e4f0d0] shrink-0 border border-[#e4f0d0]/30">
            <Award className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold">Min Base Bid</div>
            <div className="text-sm font-black text-[#e4f0d0]">{auction.minimumBid.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20">
          <div className="bg-[#162235] p-2 rounded-xl text-[#a1b5d8] shrink-0 border border-[#a1b5d8]/30">
            <ArrowUpRight className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold">Bid Increment</div>
            <div className="text-sm font-black text-[#a1b5d8]">+{auction.bidIncrement.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20">
          <div className="bg-[#162235] p-2 rounded-xl text-[#c2d8b9] shrink-0 border border-[#c2d8b9]/30">
            <Settings className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold">Total Teams</div>
            <div className="text-sm font-black text-[#fffcf7]">{teams.length}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#171a1d]/40 border border-[#5c6875]/20">
          <div className="bg-[#162235] p-2 rounded-xl text-[#e4f0d0] shrink-0 border border-[#e4f0d0]/30">
            <Users className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#abb4bd] uppercase tracking-wider font-bold">Total Players</div>
            <div className="text-sm font-black text-[#fffcf7]">{players.length}</div>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div className="rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-4 flex justify-between items-center shadow-[0_8px_30px_rgba(23,26,29,0.7)]">
        <div className="font-semibold text-sm">
          Current Tier: <span className="text-[#e4f0d0] font-black ml-1.5 px-3 py-1 rounded-full bg-[#162235] border border-[#e4f0d0]/30 text-xs">✨ Free Plan</span>
        </div>
        <Award className="size-5 text-[#a1b5d8]" />
      </div>

      {/* QR Code */}
      <div className="rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md p-5 shadow-[0_8px_30px_rgba(23,26,29,0.7)]">
        <div className="flex justify-between items-center mb-5">
          <div className="text-xs font-bold text-[#abb4bd] uppercase tracking-wider">Tournament QR Check-in</div>
          <button onClick={shareAuction} className="text-[#a1b5d8] hover:text-[#fffcf7]">
            <Share2 className="size-4" />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <div className="p-3 bg-white rounded-2xl mb-3 shadow-lg border border-[#a1b5d8]/40">
            <QRCodeSVG value={auctionUrl} size={140} />
          </div>
          <div className="text-[#a1b5d8] font-black text-sm tracking-wider">{auction.id.slice(-6)}</div>
          <div className="text-[11px] text-[#abb4bd] font-medium mt-0.5">Scan to open live auction room</div>
        </div>
      </div>

      {/* Share This Auction */}
      <div className="rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/75 backdrop-blur-md overflow-hidden shadow-[0_8px_30px_rgba(23,26,29,0.7)]">
        <div className="px-5 py-3 border-b border-[#5c6875]/30 text-xs font-bold text-[#abb4bd] uppercase tracking-wider">
          Broadcast & Invite
        </div>
        <div className="p-4 bg-[#171a1d]/60 flex gap-3">
          <a 
            href={`https://wa.me/?text=Check out this auction: ${auctionUrl}`} 
            target="_blank" 
            rel="noreferrer"
            className="size-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
            title="Share on WhatsApp"
          >
            <MessageCircle className="size-4" />
          </a>
          <a 
            href={`https://twitter.com/intent/tweet?text=Check out this auction:&url=${auctionUrl}`} 
            target="_blank" 
            rel="noreferrer"
            className="size-9 rounded-xl bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity border border-white/20 shadow-sm"
            title="Share on X"
          >
            <span className="font-bold text-xs">X</span>
          </a>
          <button 
            onClick={shareAuction}
            className="size-9 rounded-xl bg-gradient-to-r from-[#6c8cc2] to-[#a1b5d8] text-[#162235] flex items-center justify-center hover:opacity-95 transition-opacity font-bold shadow-sm"
            title="Copy Auction Link"
          >
            <LinkIcon className="size-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default AboutTab;
