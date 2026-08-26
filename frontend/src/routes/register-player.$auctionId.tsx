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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { auctionClient, PlayerInput } from "@/lib/auction-client";
import { auctionDetailQueryOptions } from "@/lib/queries/auctions";
import { SPORT_CONFIGS } from "@/lib/validations/player";
import stadiumImg from "@/assets/stadium-band.jpg";

export const Route = createFileRoute("/register-player/$auctionId")({
  loader: async ({ params, context }) => {
    try {
      const auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.auctionId));
      return { auction };
    } catch {
      throw new Error("Auction not found");
    }
  },
  component: PlayerRegistrationPage,
});

function PlayerRegistrationPage() {
  const { auction } = Route.useLoaderData();
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [playerLevel, setPlayerLevel] = useState("");
  const [baseValue, setBaseValue] = useState("0");
  const [jerseySize, setJerseySize] = useState("");
  const [jerseyName, setJerseyName] = useState("");
  const [trouserSize, setTrouserSize] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [sportFields, setSportFields] = useState<Record<string, any>>({});

  // Payment details
  const [paymentMode, setPaymentMode] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentImage, setPaymentImage] = useState<string | null>(null);

  // Membership details
  const [memberType, setMemberType] = useState<"bni" | "family" | "">("");
  const [chapterName, setChapterName] = useState("");
  const [bniName, setBniName] = useState("");
  const [relationship, setRelationship] = useState("");

  // Crop state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  const config = SPORT_CONFIGS[auction.sportType] || SPORT_CONFIGS["cricket"];

  const registerMutation = useMutation({
    mutationFn: (input: PlayerInput) => auctionClient.registerPlayer(input),
    onSuccess: () => {
      setSuccess(true);
      toast.success("Successfully registered for the auction!");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to register. Please try again.");
    },
  });

  const handleSportFieldChange = (key: string, value: string) => {
    setSportFields((prev) => ({ ...prev, [key]: value }));
  };

  const specPlaceholders: Record<string, string> = {
    "Preferred Foot": "e.g. Right",
    "Spike Height": "e.g. 320 cm",
    "Block Height": "e.g. 310 cm",
    "Signature Move": "e.g. Cobra Raid",
  };
  const getSpecPlaceholder = (spec: string) => specPlaceholders[spec] || "e.g. Add a detail";

  const handlePaymentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPaymentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Photo must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const rawDataUrl = reader.result as string;
        setSportFields((prev) => ({ ...prev, originalPhoto: rawDataUrl }));
        setCropImageSrc(rawDataUrl);
        setZoom(1);
        setDragOffset({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      const img = imgRef.current;
      
      if (ctx && img) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 256, 256);
        
        const nW = img.naturalWidth;
        const nH = img.naturalHeight;
        let drawW = 288;
        let drawH = 288;
        
        if (nW > nH) {
          drawH = 288;
          drawW = 288 * (nW / nH);
        } else {
          drawW = 288;
          drawH = 288 * (nH / nW);
        }
        
        drawW *= zoom;
        drawH *= zoom;
        
        const containerCenter = 144;
        const drawX = (containerCenter - drawW / 2) + dragOffset.x;
        const drawY = (containerCenter - drawH / 2) + dragOffset.y;
        const scale = 256 / 288;
        
        ctx.drawImage(img, drawX * scale, drawY * scale, drawW * scale, drawH * scale);
        
        const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPhoto(croppedDataUrl);
        setCropImageSrc(null);
      }
    } catch (err) {
      console.error("Failed to crop photo", err);
      toast.error("Using original photo directly.");
      setPhoto(cropImageSrc);
      setCropImageSrc(null);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || phone.trim().length !== 10) {
      toast.error("Please provide a valid name and exactly 10-digit phone number");
      return;
    }
    if (!age || !gender || !city || !playerLevel) {
      toast.error("Please fill in all personal details");
      return;
    }
    if (!sportFields["role"]) {
      toast.error("Please select a role/skill");
      return;
    }
    for (const stat of config.stats) {
      if (!sportFields[stat]) {
        toast.error(`Please provide ${stat}`);
        return;
      }
    }
    for (const spec of config.specs) {
      if (!sportFields[spec]) {
        toast.error(`Please provide ${spec}`);
        return;
      }
    }
    if (!jerseySize || !jerseyName || !trouserSize) {
      toast.error("Please fill in all uniform details");
      return;
    }

    const isBniAuction = auction.id === "6a8edaddd7ed74151dbafab3";
    let customDataStr = "";

    if (isBniAuction) {
      if (!memberType) {
        toast.error("Please select a membership type");
        return;
      }
      if (memberType === "bni" && !chapterName.trim()) {
        toast.error("Please provide Chapter Name");
        return;
      }
      if (memberType === "family" && (!bniName.trim() || !chapterName.trim() || !relationship)) {
        toast.error("Please provide BNI Name, Chapter Name and Relationship");
        return;
      }
      if (memberType === "bni") {
        customDataStr = `BNI Member | Chapter: ${chapterName}`;
      } else if (memberType === "family") {
        customDataStr = `Family Member | BNI Name: ${bniName}, Chapter: ${chapterName}, Rel: ${relationship}`;
      }
    } else {
      if (!paymentMode) {
        toast.error("Please select a payment mode");
        return;
      }
      if (!utrNumber.trim() || utrNumber.trim().length !== 12) {
        toast.error("Please provide a valid 12-digit UTR Number");
        return;
      }
      if (!paymentImage) {
        toast.error("Please upload the payment screenshot");
        return;
      }
    }

    const input: PlayerInput = {
      auctionId: auction.id,
      name,
      phone,
      age: age ? parseInt(age) : null,
      gender,
      city,
      playerLevel,
      paymentMode,
      utrNumber,
      paymentImage,
      baseValue: parseFloat(baseValue) || 0,
      jerseySize,
      jerseyName,
      trouserSize,
      customData: customDataStr,
      photo,
      sportFields,
    };

    registerMutation.mutate(input);
  };

  if (success) {
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
              You have successfully registered for <strong>{auction.name}</strong>.
            </p>
            <Button className="w-full" onClick={() => window.location.href = "/"}>
              Return Home
            </Button>
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
        <img
          src={auction.coverImage || stadiumImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover blur-sm scale-105 opacity-60"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative mx-auto max-w-3xl px-4 py-12 text-center text-white flex flex-col items-center">
          {auction.coverImage ? (
            <img 
              src={auction.coverImage} 
              alt={auction.name} 
              className="size-28 rounded-full border-4 border-white/20 shadow-xl object-cover mb-6 bg-muted"
            />
          ) : (
            <div className="size-28 rounded-full border-4 border-white/20 shadow-xl bg-primary/20 flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-white">{auction.name.substring(0, 2).toUpperCase()}</span>
            </div>
          )}
          <h1 className="text-3xl font-black sm:text-5xl mb-4 tracking-tight drop-shadow-md uppercase">PLAYER REGISTRATION</h1>
          <p className="text-lg text-white/80 font-medium tracking-wide">Register as a player for <span className="text-white font-bold">{auction.name}</span></p>
        </div>
      </section>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 -mt-8 relative z-10 mb-12">
        <div className="bg-card rounded-2xl p-6 sm:p-8 card-shadow border border-border">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2 pb-2">
              {photo ? (
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const basePhoto = sportFields['originalPhoto'] || photo;
                      setCropImageSrc(basePhoto);
                      setZoom(1);
                      setDragOffset({ x: 0, y: 0 });
                    }}
                    className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-border/80 bg-muted hover:border-brand/40 transition-all group cursor-pointer shadow-sm"
                    title="Crop / Zoom existing picture"
                  >
                    <img src={photo} alt="Player photo" className="size-full object-cover object-top" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="size-5 text-white mb-0.5" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Crop/Zoom</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("player-photo")?.click()}
                    className="text-xs text-brand hover:text-brand/80 font-bold hover:underline transition-colors mt-0.5"
                  >
                    Upload New
                  </button>
                </div>
              ) : (
                <Label htmlFor="player-photo" className="cursor-pointer">
                  <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors shadow-sm">
                    <Plus className="size-8 text-muted-foreground" />
                  </div>
                </Label>
              )}
              <span className="text-xs text-muted-foreground font-semibold">Player Photo *</span>
              <input
                id="player-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={registerMutation.isPending}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" placeholder="e.g. Virat Kohli" value={name} onChange={(e) => setName(e.target.value)} disabled={registerMutation.isPending} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (10 digits) *</Label>
                <Input id="phone" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={registerMutation.isPending} maxLength={10} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input id="age" type="number" placeholder="e.g. 27" value={age} onChange={(e) => setAge(e.target.value)} disabled={registerMutation.isPending} required />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" placeholder="e.g. Mumbai" value={city} onChange={(e) => setCity(e.target.value)} disabled={registerMutation.isPending} required />
              </div>
              <div className="space-y-2">
                <Label>Player Level *</Label>
                <Select value={playerLevel} onValueChange={setPlayerLevel}>
                  <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-muted/10">
              <h3 className="mb-4 font-semibold">{auction.sportType.charAt(0).toUpperCase() + auction.sportType.slice(1)} Specific Details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Role/Skill *</Label>
                  <Select value={sportFields["role"] || ""} onValueChange={(v) => handleSportFieldChange("role", v)}>
                    <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                    <SelectContent>
                      {config.roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {config.stats.map(stat => (
                  <div key={stat} className="space-y-2">
                    <Label>{stat} *</Label>
                    <Input type="number" placeholder="e.g. 0" value={sportFields[stat] || ""} onChange={(e) => handleSportFieldChange(stat, e.target.value)} disabled={registerMutation.isPending} required />
                  </div>
                ))}
                {config.specs.map(spec => (
                  <div key={spec} className="space-y-2">
                    <Label>{spec} *</Label>
                    <Input placeholder={getSpecPlaceholder(spec)} value={sportFields[spec] || ""} onChange={(e) => handleSportFieldChange(spec, e.target.value)} disabled={registerMutation.isPending} required />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="jerseySize">Jersey Size *</Label>
                <Input id="jerseySize" placeholder="e.g. M, L, XL" value={jerseySize} onChange={(e) => setJerseySize(e.target.value)} disabled={registerMutation.isPending} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jerseyName">Jersey Name *</Label>
                <Input id="jerseyName" placeholder="e.g. KOHLI" value={jerseyName} onChange={(e) => setJerseyName(e.target.value)} disabled={registerMutation.isPending} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trouserSize">Jersey Number *</Label>
                <Input id="trouserSize" placeholder="e.g. 32" value={trouserSize} onChange={(e) => setTrouserSize(e.target.value)} disabled={registerMutation.isPending} required />
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-muted/10 space-y-4">
              {auction.id === "6a8edaddd7ed74151dbafab3" ? (
                <>
                  <h3 className="font-semibold text-lg">Membership Details</h3>
                  <div className="space-y-4">
                    <RadioGroup 
                      value={memberType} 
                      onValueChange={(val) => {
                        setMemberType(val as "bni" | "family");
                        setChapterName("");
                        setBniName("");
                        setRelationship("");
                      }} 
                      className="flex gap-6"
                      disabled={registerMutation.isPending}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bni" id="r-bni" />
                        <Label htmlFor="r-bni" className="cursor-pointer">BNI Member</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="family" id="r-family" />
                        <Label htmlFor="r-family" className="cursor-pointer">Family Member</Label>
                      </div>
                    </RadioGroup>

                    {memberType === "bni" && (
                      <div className="space-y-2 pt-2 animate-in fade-in">
                        <Label htmlFor="chapterName">Chapter Name *</Label>
                        <Input id="chapterName" placeholder="e.g. Alpha" value={chapterName} onChange={(e) => setChapterName(e.target.value)} disabled={registerMutation.isPending} required />
                      </div>
                    )}

                    {memberType === "family" && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2 animate-in fade-in">
                        <div className="space-y-2">
                          <Label htmlFor="bniName">BNI Name *</Label>
                          <Input id="bniName" placeholder="e.g. John Doe" value={bniName} onChange={(e) => setBniName(e.target.value)} disabled={registerMutation.isPending} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chapterNameFam">Chapter Name *</Label>
                          <Input id="chapterNameFam" placeholder="e.g. Alpha" value={chapterName} onChange={(e) => setChapterName(e.target.value)} disabled={registerMutation.isPending} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Relationship *</Label>
                          <Select value={relationship} onValueChange={setRelationship}>
                            <SelectTrigger><SelectValue placeholder="Select Relationship" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Child">Child</SelectItem>
                              <SelectItem value="Spouse">Spouse</SelectItem>
                              <SelectItem value="Parents">Parents</SelectItem>
                              <SelectItem value="Siblings">Siblings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">Payment Details</h3>
                  <div className="p-4 bg-primary/5 rounded-md border border-primary/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">UPI ID</p>
                        <p className="font-mono font-medium text-lg">7780178092@mbkns</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText("7780178092@mbkns");
                          toast.success("UPI ID copied to clipboard!");
                        }}
                      >
                        <Copy className="size-4" /> Copy
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount Payable</p>
                      <p className="font-semibold text-lg text-primary">₹1,200 per player</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                    <div className="space-y-2">
                      <Label>Payment Mode *</Label>
                      <Select value={paymentMode} onValueChange={setPaymentMode}>
                        <SelectTrigger><SelectValue placeholder="Select Payment Mode" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PhonePe">PhonePe</SelectItem>
                          <SelectItem value="UPI ID">UPI ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="utrNumber">UTR Number (12 digits) *</Label>
                      <Input id="utrNumber" placeholder="e.g. 123456789012" value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} disabled={registerMutation.isPending} maxLength={12} required />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="paymentImage">Payment Screenshot *</Label>
                    {paymentImage ? (
                      <div className="relative w-full max-w-sm group">
                        <img src={paymentImage} alt="Payment screenshot" className="rounded-xl border-2 border-primary/20 object-contain w-full h-48 bg-muted shadow-sm transition-all group-hover:border-primary/50" />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          className="absolute top-2 right-2 opacity-90 hover:opacity-100 shadow-md"
                          onClick={() => setPaymentImage(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Label 
                          htmlFor="paymentImage" 
                          className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <UploadCloud className="size-8 text-primary/60 mb-2" />
                          <span className="text-sm font-medium text-foreground">Click to upload screenshot</span>
                          <span className="text-xs text-muted-foreground mt-1">JPEG, PNG up to 2MB</span>
                        </Label>
                        <Input id="paymentImage" type="file" accept="image/*" className="hidden" onChange={handlePaymentImageChange} disabled={registerMutation.isPending} required />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full text-lg h-12" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? (
                  <><Loader2 className="mr-2 size-5 animate-spin" /> Submitting...</>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      
      <SiteFooter />

      {/* Crop Dialog */}
      <Dialog open={!!cropImageSrc} onOpenChange={(open) => { if (!open) setCropImageSrc(null); }}>
        <DialogContent className="sm:max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Crop Profile Photo</DialogTitle>
          </DialogHeader>
          
          <div className="relative mt-4 flex items-center justify-center bg-black/5 dark:bg-black/40 p-6 rounded-2xl w-full">
            <div 
              className="relative size-72 rounded-full overflow-hidden border-4 border-white bg-black select-none cursor-move shadow-md"
              onPointerDown={(e) => {
                setIsDragging(true);
                setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!isDragging) return;
                setDragOffset({
                  x: e.clientX - dragStart.x,
                  y: e.clientY - dragStart.y,
                });
              }}
              onPointerUp={(e) => {
                setIsDragging(false);
                e.currentTarget.releasePointerCapture(e.pointerId);
              }}
            >
              {cropImageSrc && (
                <img
                  ref={imgRef}
                  src={cropImageSrc}
                  crossOrigin="anonymous"
                  alt="Crop preview"
                  className="pointer-events-none select-none max-w-none origin-center"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom})`,
                  }}
                />
              )}
            </div>
          </div>
          
          <div className="w-full space-y-4 px-4 mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground">Zoom</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-brand h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setCropImageSrc(null)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleCropSave} className="bg-brand text-brand-foreground hover:bg-brand-dark">
                Save Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
