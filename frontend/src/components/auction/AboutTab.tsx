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

  const auctionUrl = typeof window !== 'undefined' ? `${window.location.origin}/auctions/${auction.id}` : '';

  return (
    <div className="space-y-4">
      {/* Top Details Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden card-shadow">
        <div className="flex justify-between items-center p-3 border-b border-border text-sm">
          <div className="flex items-center gap-2 font-medium">
            <CalendarDays className="size-4 text-brand" />
            {format(new Date(auction.startsAt), "dd-MM-yyyy")}
          </div>
          <div className="flex items-center gap-2 font-medium text-brand">
            <Clock className="size-4" />
            {format(new Date(auction.startsAt), "h:mm a")}
          </div>
        </div>
        
        <div className="p-4 flex items-center gap-4">
          <div className="size-16 rounded-lg bg-brand/10 border border-brand/20 overflow-hidden shrink-0 flex items-center justify-center">
            {auction.coverImage ? (
              <img src={auction.coverImage} alt={auction.name} className="size-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-brand">{auction.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-lg">{auction.name}</h2>
            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="size-3.5" />
              Mumbai {/* Placeholder location as per screenshot */}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-muted/30 border-t border-border">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-brand/10 p-1.5 rounded-full text-brand">
              <Users className="size-4" />
            </div>
            {auction.playersPerTeam} Player Per Team
          </div>
          <button onClick={shareAuction} className="text-brand hover:bg-brand/10 p-1.5 rounded-full transition-colors">
            <Share2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-4 card-shadow">
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full text-muted-foreground shrink-0">
            <Copy className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Auction Code</div>
            <div className="text-sm font-bold flex items-center gap-1">
              {auction.id.slice(-6)}
              <button onClick={copyCode} className="text-brand hover:text-brand/80">
                <Copy className="size-3" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full text-muted-foreground shrink-0">
            <DollarSign className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Points / Team</div>
            <div className="text-sm font-bold">{auction.pointsPerTeam}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full text-muted-foreground shrink-0">
            <Award className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Minimum Bid</div>
            <div className="text-sm font-bold">{auction.minimumBid}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full text-muted-foreground shrink-0">
            <ArrowUpRight className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Bid Increase</div>
            <div className="text-sm font-bold">{auction.bidIncrement}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full text-muted-foreground shrink-0">
            <Settings className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Teams</div>
            <div className="text-sm font-bold">{teams.length}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full text-muted-foreground shrink-0">
            <Users className="size-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Players</div>
            <div className="text-sm font-bold">{players.length}</div>
          </div>
        </div>
      </div>

      {/* Current Plan */}
      <div className="rounded-xl border border-border bg-card p-4 flex justify-between items-center card-shadow">
        <div className="font-medium">
          Current plan <span className="text-brand font-bold ml-1">₹ Free/-</span>
        </div>
        <Award className="size-5 text-brand" />
      </div>

      {/* QR Code */}
      <div className="rounded-xl border border-border bg-card p-4 card-shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xs font-semibold text-muted-foreground">Find your Auction quickly through QR Code</div>
          <button onClick={shareAuction} className="text-brand">
            <Share2 className="size-4" />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="p-2 bg-white rounded-xl mb-3">
            <QRCodeSVG value={auctionUrl} size={150} />
          </div>
          <div className="text-brand font-bold">{auction.id.slice(-6)}</div>
          <div className="text-xs text-brand">Auction QR Code</div>
        </div>
      </div>

      {/* Share This Auction */}
      <div className="rounded-xl border border-border bg-card overflow-hidden card-shadow">
        <div className="p-3 border-b border-border text-xs font-semibold text-muted-foreground">
          Share This Auction
        </div>
        <div className="p-4 bg-muted/20 flex gap-3">
          <a 
            href={`https://wa.me/?text=Check out this auction: ${auctionUrl}`} 
            target="_blank" 
            rel="noreferrer"
            className="size-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="size-4" />
          </a>
          <a 
            href={`https://twitter.com/intent/tweet?text=Check out this auction:&url=${auctionUrl}`} 
            target="_blank" 
            rel="noreferrer"
            className="size-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <span className="font-bold text-xs">X</span>
          </a>
          <button 
            onClick={shareAuction}
            className="size-8 rounded-full bg-brand text-brand-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <LinkIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
