import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, CheckCircle2, Copy, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FallbackImage } from "@/components/ui/fallback-image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import stadiumImg from "@/assets/stadium-band.jpg";
import bniLogoImg from "@/assets/bni-logo.png";
import anotherImg from "@/assets/another.jpeg";
import { auctionClient, TeamInput } from "@/lib/auction-client";

export const Route = createFileRoute("/register-team/$auctionId")({
  component: PublicRegisterTeamPage,
});

function PublicRegisterTeamPage() {
  const { auctionId } = Route.useParams();

  // Load the auction publicly
  const { data: auction, isPending, isError } = useQuery({
    queryKey: ["public-auction", auctionId],
    queryFn: () => auctionClient.getById(auctionId),
    retry: 1,
  });

  const [success, setSuccess] = useState(false);
  
  // Team Fields
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [colorTheme, setColorTheme] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [originalLogo, setOriginalLogo] = useState<string | null>(null);
  
  // Image cropping logic
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState([1]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const registerMutation = useMutation({
    mutationFn: (input: TeamInput) => auctionClient.registerTeam(input),
    onSuccess: () => {
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to register team. Try again.");
    },
  });

  // Basic image crop handler
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = file.size / 1024 / 1024;
      if (sizeMB > 10) {
        alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
        toast.error("Logo must be less than 10MB.");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        setOriginalLogo(rawDataUrl);
        setLogo(rawDataUrl);
        setCropImageSrc(rawDataUrl);
        setZoom([1]);
        setDragOffset({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y,
    });
  };

  const handlePointerUp = () => setIsDragging(false);

  const performCrop = () => {
    if (!imageRef.current || !cropImageSrc) return;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
      const img = imageRef.current;
      const nW = img.naturalWidth;
      const nH = img.naturalHeight;
      if (!nW || !nH) {
        setLogo(cropImageSrc);
        setCropImageSrc(null);
        return;
      }
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, 256, 256);
      let drawW = 288;
      let drawH = 288;
      if (nW > nH) {
        drawH = 288;
        drawW = 288 * (nW / nH);
      } else {
        drawW = 288;
        drawH = 288 * (nH / nW);
      }
      drawW *= zoom[0] ?? 1;
      drawH *= zoom[0] ?? 1;
      const containerCenter = 144;
      const drawX = (containerCenter - drawW / 2) + dragOffset.x;
      const drawY = (containerCenter - drawH / 2) + dragOffset.y;
      const scale = 256 / 288;
      ctx.drawImage(img, drawX * scale, drawY * scale, drawW * scale, drawH * scale);
      
      const croppedDataUrl = canvas.toDataURL("image/png", 1.0);
      setLogo(croppedDataUrl);
      setCropImageSrc(null);
    } catch (err) {
      toast.error("Using original photo directly.");
      setLogo(cropImageSrc);
      setCropImageSrc(null);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortName.trim() || !ownerName.trim() || !ownerPhone.trim() || !colorTheme.trim()) {
      toast.error("Please fill in all team details");
      return;
    }
    if (!logo) {
      toast.error("Please upload a team logo");
      return;
    }
    
    const input: TeamInput = {
      auctionId: auction!.id,
      name,
      shortName,
      ownerName,
      ownerPhone,
      colorTheme,
      logo,
    };

    registerMutation.mutate(input);
  };

  if (success && auction) {
    return (
      <div
        className="min-h-screen text-[#ffffff] flex flex-col selection:bg-[#38bdf8] selection:text-[#ffffff]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)",
        }}
      >
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#162a34]/95 rounded-3xl p-8 text-center border-2 border-emerald-400 shadow-[0_20px_60px_rgba(15,35,45,0.9)] backdrop-blur-xl">
            <div className="mx-auto size-16 bg-emerald-950/80 text-emerald-400 border-2 border-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="size-10" />
            </div>
            <h2 className="text-2xl font-black text-[#ffffff] mb-2 tracking-tight drop-shadow-sm">Registration Complete!</h2>
            <p className="text-[#f2e9dc]/80 mb-6 font-medium">
              You have successfully registered the team <strong className="text-[#38bdf8]">{name}</strong> for <strong className="text-[#38bdf8]">{auction.name}</strong>.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setSuccess(false)}
                className="w-full rounded-full py-3.5 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-[1.01] transition-all border border-white/30"
              >
                Register Another Team
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-[#ffffff] flex flex-col selection:bg-[#38bdf8] selection:text-[#ffffff]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #1e3a45 0%, #162a32 45%, #101c22 80%, #0c1417 100%)",
      }}
    >
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        <img
          src={auction?.coverImage || stadiumImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover blur-sm scale-105 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#142630]/80 via-[#142630]/90 to-[#142630]" />
        <div className="relative mx-auto max-w-3xl px-4 py-12 text-center text-[#ffffff] flex flex-col items-center">
          {isPending ? (
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="size-24 sm:size-28 rounded-2xl bg-white/20" />
              <Skeleton className="h-10 w-64 bg-white/20" />
              <Skeleton className="h-6 w-48 bg-white/20" />
            </div>
          ) : isError || !auction ? (
            <div className="flex flex-col items-center gap-4">
              <div className="size-24 sm:size-28 rounded-2xl border-4 border-white/20 bg-destructive/20 flex items-center justify-center text-destructive font-bold text-3xl">?</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Auction Not Found</h1>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 flex-wrap">
                {auction.id === "6a8edaddd7ed74151dbafab3" && (
                  <img 
                    src={bniLogoImg} 
                    alt="BNI Logo" 
                    className="h-24 sm:h-28 w-auto rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl object-contain bg-black p-2"
                  />
                )}
                {auction.coverImage ? (
                  <img 
                    src={auction.coverImage} 
                    alt={auction.name} 
                    className="size-24 sm:size-28 rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl object-cover bg-muted shrink-0"
                  />
                ) : (
                  <div className="size-24 sm:size-28 rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl bg-[#142630] flex items-center justify-center shrink-0">
                    <span className="text-2xl sm:text-3xl font-black text-[#38bdf8]">{auction.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                )}
                {auction.id === "6a8edaddd7ed74151dbafab3" && (
                  <img 
                    src={anotherImg} 
                    alt="Another Logo" 
                    className="h-24 sm:h-28 w-auto rounded-2xl border-2 border-[#38bdf8]/60 shadow-xl object-contain bg-white p-2"
                  />
                )}
              </div>
              <h1 className="text-3xl font-black sm:text-5xl mb-3 tracking-tight drop-shadow-md uppercase text-[#ffffff]">TEAM REGISTRATION</h1>
              <p className="text-base sm:text-lg text-[#f2e9dc]/80 font-medium tracking-wide">Register your team for <span className="text-[#38bdf8] font-black">{auction.name}</span></p>
            </>
          )}
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8 sm:py-10 -mt-6 relative z-10">
        {isPending ? (
          <div className="space-y-6 bg-[#162a34]/95 p-6 sm:p-8 rounded-3xl border-2 border-[#38bdf8]/40 card-shadow">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isError || !auction ? (
          <div className="bg-[#162a34]/95 p-8 rounded-3xl border-2 border-destructive/40 text-center card-shadow">
            <p className="text-destructive font-medium">Please check the link and try again.</p>
          </div>
        ) : (
          <div className="bg-[#162a34]/95 backdrop-blur-xl rounded-3xl border-2 border-[#38bdf8]/40 shadow-[0_20px_60px_rgba(15,35,45,0.9)] overflow-hidden text-[#ffffff]">
            <div className="bg-[#142630]/80 border-b border-[#38bdf8]/30 p-4 sm:p-6 text-center">
              <p className="text-[#f2e9dc]/80 text-sm font-medium">
                Register your team to participate in <strong className="text-[#38bdf8]">{auction.name}</strong>
              </p>
            </div>

            <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-8">
              
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative group">
                      {logo ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (originalLogo) {
                              setCropImageSrc(originalLogo);
                              setZoom([1]);
                              setDragOffset({ x: 0, y: 0 });
                            }
                          }}
                          className="relative flex size-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#38bdf8]/60 bg-[#142630] hover:border-[#38bdf8] transition-all group cursor-pointer shadow-md"
                          title="Crop / Zoom existing picture"
                        >
                          <img src={logo} alt="Team Logo" className="size-full object-cover" />
                          <div className="absolute inset-0 bg-[#142630]/75 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil className="size-6 text-[#38bdf8] mb-0.5" />
                            <span className="text-[10px] font-black text-[#ffffff] uppercase tracking-wider">Crop/Zoom</span>
                          </div>
                        </button>
                      ) : (
                        <Label
                          htmlFor="team-logo"
                          className="relative flex size-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#38bdf8]/50 bg-[#142630]/70 hover:bg-[#142630] hover:border-[#38bdf8] transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
                            <UploadCloud className="size-8 text-[#38bdf8]" />
                            <span className="text-[10px] text-[#38bdf8] uppercase tracking-wider font-bold">Upload Logo * (up to 10MB)</span>
                          </div>
                        </Label>
                      )}
                      <input
                        id="team-logo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        disabled={registerMutation.isPending}
                      />
                    </div>
                    {logo && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-[#38bdf8] hover:text-[#ffffff] font-bold hover:underline transition-colors mt-1"
                      >
                        Upload New
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">Team Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Chennai Super Kings"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={registerMutation.isPending}
                      required
                      className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">Short Name (Code) *</Label>
                    <Input
                      id="shortName"
                      placeholder="e.g. CSK"
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                      disabled={registerMutation.isPending}
                      required
                      maxLength={5}
                      className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">Owner/Franchisee Name *</Label>
                    <Input
                      id="ownerName"
                      placeholder="e.g. N. Srinivasan"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      disabled={registerMutation.isPending}
                      required
                      className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">Contact Number *</Label>
                    <Input
                      id="ownerPhone"
                      placeholder="e.g. 9876543210"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      disabled={registerMutation.isPending}
                      required
                      className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="colorTheme" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">Team Color/Theme *</Label>
                    <Input
                      id="colorTheme"
                      placeholder="e.g. Yellow & Blue"
                      value={colorTheme}
                      onChange={(e) => setColorTheme(e.target.value)}
                      disabled={registerMutation.isPending}
                      required
                      className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full rounded-full py-4 h-auto font-black text-base text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-[1.01] transition-all border border-white/30 cursor-pointer"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <><Loader2 className="mr-2 size-5 animate-spin" /> Submitting...</>
                  ) : (
                    "Submit Team Registration"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>


      {/* Crop Dialog */}
      <Dialog open={!!cropImageSrc} onOpenChange={(open) => { if (!open) setCropImageSrc(null); }}>
        <DialogContent className="sm:max-w-md flex flex-col items-center rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#ffffff] tracking-tight">Crop Team Logo</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 w-72 h-72 bg-black relative overflow-hidden rounded-2xl border-4 border-[#38bdf8] cursor-move touch-none shadow-xl"
               onPointerDown={handlePointerDown}
               onPointerMove={handlePointerMove}
               onPointerUp={handlePointerUp}
               onPointerLeave={handlePointerUp}>
            {cropImageSrc && (
              <img
                ref={imageRef}
                src={cropImageSrc}
                alt="Crop preview"
                className="absolute origin-top-left pointer-events-none select-none max-w-none"
                style={{
                  transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom[0]})`,
                  opacity: isDragging ? 0.8 : 1
                }}
                draggable={false}
              />
            )}
            
            <div className="absolute inset-0 pointer-events-none border-[4px] border-white/20 rounded-2xl box-border" />
          </div>
          
          <div className="w-full max-w-[288px] mt-6 flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">Zoom</span>
            <Slider
              value={zoom}
              min={0.5}
              max={3}
              step={0.1}
              onValueChange={setZoom}
              className="flex-1"
            />
          </div>

          <DialogFooter className="w-full sm:justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCropImageSrc(null)}
              className="rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#ffffff] hover:bg-[#1f3a47] font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={performCrop}
              className="rounded-full px-6 py-2.5 font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_15px_rgba(249,115,22,0.6)]"
            >
              Save Logo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
