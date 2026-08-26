import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, CheckCircle2, Copy, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
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
      if (sizeMB > 2) {
        toast.error("Logo must be less than 2MB.");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCropImageSrc(event.target?.result as string);
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
      drawW *= zoom[0];
      drawH *= zoom[0];
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
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card rounded-2xl p-8 text-center card-shadow border border-border">
            <div className="mx-auto size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="size-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Registration Complete!</h2>
            <p className="text-muted-foreground mb-6">
              You have successfully registered the team <strong>{name}</strong> for <strong>{auction.name}</strong>.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setSuccess(false)} variant="outline">Register Another Team</Button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 h-48 sm:h-56">
          <img src={stadiumImg} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
        </div>
        
        <div className="relative mx-auto max-w-3xl px-4 pt-16 pb-6 sm:pt-20">
          <div className="flex flex-col items-center text-center">
            {isPending ? (
               <Skeleton className="size-20 sm:size-24 rounded-full border-4 border-background bg-muted/50 mb-4" />
            ) : isError || !auction ? (
              <div className="size-20 sm:size-24 rounded-full border-4 border-background bg-destructive/20 flex items-center justify-center mb-4 text-destructive font-bold text-2xl">?</div>
            ) : (
              <FallbackImage
                src={auction.coverImage || ""}
                alt={auction.name}
                className="size-20 sm:size-24 rounded-full border-4 border-background object-cover shadow-lg mb-4"
                fallback={
                  <span className="display grid size-full place-items-center rounded-full bg-brand text-3xl font-bold text-brand-foreground shadow-lg">
                    {auction.name.slice(0, 2).toUpperCase()}
                  </span>
                }
              />
            )}
            
            {isPending ? (
              <Skeleton className="h-8 w-64 mb-2" />
            ) : isError || !auction ? (
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Auction Not Found</h1>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{auction.name}</h1>
                <p className="text-white/80 font-medium">Public Team Registration</p>
              </>
            )}
          </div>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8 sm:py-12 -mt-4 relative z-10">
        {isPending ? (
          <div className="space-y-6 bg-card p-6 sm:p-8 rounded-2xl border card-shadow">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isError || !auction ? (
          <div className="bg-card p-8 rounded-2xl border border-destructive/20 text-center card-shadow">
            <p className="text-destructive font-medium">Please check the link and try again.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border card-shadow overflow-hidden">
            <div className="bg-muted/30 border-b border-border p-4 sm:p-6 text-center">
              <p className="text-muted-foreground text-sm">
                Register your team to participate in <strong className="text-foreground">{auction.name}</strong>
              </p>
            </div>

            <form onSubmit={onSubmit} className="p-4 sm:p-8 space-y-8">
              
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative group">
                    <Label
                      htmlFor="team-logo"
                      className={`relative flex size-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors ${
                        logo ? "border-primary" : "border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60"
                      }`}
                    >
                      {logo ? (
                        <img src={logo} alt="Team Logo" className="size-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
                          <UploadCloud className="size-8 text-primary/60" />
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Upload Logo *</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="size-6 text-white" />
                      </div>
                    </Label>
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
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Team Name *</Label>
                    <Input id="name" placeholder="e.g. Chennai Super Kings" value={name} onChange={(e) => setName(e.target.value)} disabled={registerMutation.isPending} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName">Short Name (Code) *</Label>
                    <Input id="shortName" placeholder="e.g. CSK" value={shortName} onChange={(e) => setShortName(e.target.value)} disabled={registerMutation.isPending} required maxLength={5} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner/Franchisee Name *</Label>
                    <Input id="ownerName" placeholder="e.g. N. Srinivasan" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} disabled={registerMutation.isPending} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">Contact Number *</Label>
                    <Input id="ownerPhone" placeholder="e.g. 9876543210" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} disabled={registerMutation.isPending} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="colorTheme">Team Color/Theme *</Label>
                    <Input id="colorTheme" placeholder="e.g. Yellow & Blue" value={colorTheme} onChange={(e) => setColorTheme(e.target.value)} disabled={registerMutation.isPending} required />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full text-lg h-12" disabled={registerMutation.isPending}>
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
      
      <SiteFooter />

      {/* Crop Dialog */}
      <Dialog open={!!cropImageSrc} onOpenChange={(open) => { if (!open) setCropImageSrc(null); }}>
        <DialogContent className="sm:max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Crop Team Logo</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 w-72 h-72 bg-black relative overflow-hidden rounded-full border-2 border-border cursor-move touch-none"
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
            
            <div className="absolute inset-0 pointer-events-none border-[4px] border-white/20 rounded-full box-border" />
          </div>
          
          <div className="w-full max-w-[288px] mt-6 flex items-center gap-4">
            <span className="text-xs font-medium">Zoom</span>
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
            <Button variant="ghost" onClick={() => setCropImageSrc(null)}>Cancel</Button>
            <Button onClick={performCrop}>Save Logo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
