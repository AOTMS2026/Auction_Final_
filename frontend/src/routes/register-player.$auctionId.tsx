import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, CheckCircle2, Copy, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
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
import bniLogoImg from "@/assets/bni-logo.png";
import anotherImg from "@/assets/another.jpeg";

export const Route = createFileRoute("/register-player/$auctionId")({
  loader: async ({ params, context }) => {
    try {
      const auction = await context.queryClient.ensureQueryData(auctionDetailQueryOptions(params.auctionId));
      return { auction };
    } catch {
      return { auction: null };
    }
  },
  component: PlayerRegistrationPage,
});

const CHAPTERS = [
  "Alpha",
  "Beacon",
  "Champions",
  "Diamonds",
  "Excellence",
  "freedom",
  "Grand",
  "Jade",
  "Knights",
  "Legends",
  "Marvel",
  "Orbit",
  "Prime",
  "Royals",
  "Suprime",
  "Titans",
  "Core group",
];

function PlayerRegistrationPage() {
  const loaderData = Route.useLoaderData();
  const { auctionId } = Route.useParams();

  // Load the auction with fallback and auto-retry
  const { data: auction, isPending, isError, refetch } = useQuery({
    queryKey: ["public-auction", auctionId],
    queryFn: () => auctionClient.getById(auctionId),
    initialData: loaderData?.auction ?? undefined,
    retry: 2,
  });

  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("vijayawada");
  const [playerLevel, setPlayerLevel] = useState("");
  const [baseValue, setBaseValue] = useState("0");
  const [jerseySize, setJerseySize] = useState("");
  const [jerseyName, setJerseyName] = useState("");
  const [trouserSize, setTrouserSize] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [sportFields, setSportFields] = useState<Record<string, any>>({});

  // Payment details
  const [paymentMode, setPaymentMode] = useState("Online");
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentImage, setPaymentImage] = useState<string | null>(null);

  // Membership details
  const [memberType, setMemberType] = useState<"bni" | "family" | "">("");
  const [chapterName, setChapterName] = useState("");
  const [bniName, setBniName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [bblSeasons, setBblSeasons] = useState("");

  // Crop state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  if (isPending && !auction) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Loader2 className="size-8 animate-spin text-brand mb-3" />
          <p className="text-sm text-muted-foreground">Loading registration details...</p>
        </main>
      </div>
    );
  }

  if (isError || !auction) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md w-full bg-card rounded-2xl p-8 card-shadow border border-border">
            <h2 className="text-xl font-bold text-foreground mb-2">Auction Not Available</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This auction registration link may be expired, invalid, or temporarily unavailable.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => refetch()}>Try Again</Button>
              <Button asChild variant="outline">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
        toast.error("Image must be less than 10MB");
        e.target.value = "";
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
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
        toast.error("Photo must be less than 10MB");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const rawDataUrl = reader.result as string;
        setSportFields((prev) => ({ ...prev, originalPhoto: rawDataUrl }));
        setPhoto(rawDataUrl);
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
    /*
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
    */
    if (!photo) {
      toast.error("Please upload player photo");
      return;
    }
    if (auction.id !== "6a8edaddd7ed74151dbafab3" && !paymentImage) {
      toast.error("Please upload the payment screenshot");
      return;
    }
    if (!jerseySize) {
      toast.error("Please fill in Jersey Size");
      return;
    }
    const isBniAuction = auction.id === "6a8edaddd7ed74151dbafab3";
    if (isBniAuction) {
      if (!jerseyName.trim()) {
        toast.error("Please fill in Jersey Name");
        return;
      }
      if (!trouserSize.trim()) {
        toast.error("Please fill in Jersey Number");
        return;
      }
      if (bblSeasons === "") {
        toast.error("Please select Number of seasons played");
        return;
      }
    }

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
        toast.error("Please provide Member Name, Chapter Name and Relationship");
        return;
      }
      if (memberType === "bni") {
        customDataStr = `BNI Member | Chapter: ${chapterName} | BBL Seasons: ${bblSeasons}`;
      } else if (memberType === "family") {
        customDataStr = `Family Member | BNI Name: ${bniName}, Chapter: ${chapterName}, Rel: ${relationship} | BBL Seasons: ${bblSeasons}`;
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
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-[#fffcf7] flex flex-col selection:bg-[#a1b5d8] selection:text-[#162235]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
      }}
    >
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden">
        <img
          src={auction.coverImage || stadiumImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover blur-sm scale-105 opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#171a1d]/80 via-[#171a1d]/90 to-[#171a1d]" />
        <div className="relative mx-auto max-w-3xl px-4 py-12 text-center text-[#fffcf7] flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 flex-wrap">
            {auction.id === "6a8edaddd7ed74151dbafab3" && (
              <img 
                src={bniLogoImg} 
                alt="BNI Logo" 
                className="h-24 sm:h-28 w-auto rounded-xl border-2 border-white/20 shadow-xl object-contain bg-black p-2"
              />
            )}
            {auction.coverImage ? (
              <img 
                src={auction.coverImage} 
                alt={auction.name} 
                className="size-24 sm:size-28 rounded-2xl border-2 border-[#a1b5d8]/40 shadow-xl object-cover bg-muted shrink-0"
              />
            ) : (
              <div className="size-24 sm:size-28 rounded-2xl border-2 border-[#a1b5d8]/40 shadow-xl bg-[#162235] flex items-center justify-center shrink-0">
                <span className="text-2xl sm:text-3xl font-black text-[#a1b5d8]">{auction.name.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
            {auction.id === "6a8edaddd7ed74151dbafab3" && (
              <img 
                src={anotherImg} 
                alt="Another Logo" 
                className="h-24 sm:h-28 w-auto rounded-xl border-2 border-white/20 shadow-xl object-contain bg-white p-2"
              />
            )}
          </div>
          <h1 className="text-3xl font-black sm:text-5xl mb-3 tracking-tight drop-shadow-md uppercase text-[#fffcf7]">PLAYER REGISTRATION</h1>
          <p className="text-base sm:lg text-[#abb4bd] font-medium tracking-wide">Register as a player for <span className="text-[#fffcf7] font-bold">{auction.name}</span></p>
        </div>
      </section>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 -mt-6 relative z-10 mb-12">
        <div className="bg-[#2e343a]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-[#5c6875]/30 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]">
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
                    className="relative flex size-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#a1b5d8]/40 bg-[#162235] hover:border-[#a1b5d8] transition-all group cursor-pointer shadow-md"
                    title="Crop / Zoom existing picture"
                  >
                    <img src={photo} alt="Player photo" className="size-full object-cover object-top" />
                    <div className="absolute inset-0 bg-[#171a1d]/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="size-5 text-[#a1b5d8] mb-0.5" />
                      <span className="text-[10px] font-black text-[#fffcf7] uppercase tracking-wider">Crop/Zoom</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("player-photo")?.click()}
                    className="text-xs text-[#a1b5d8] hover:text-[#fffcf7] font-bold hover:underline transition-colors mt-0.5"
                  >
                    Upload New
                  </button>
                </div>
              ) : (
                <Label htmlFor="player-photo" className="cursor-pointer">
                  <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235]/60 hover:bg-[#162235] hover:border-[#a1b5d8] transition-colors shadow-inner">
                    <Plus className="size-8 text-[#a1b5d8]" />
                  </div>
                </Label>
              )}
              <span className="text-xs text-[#abb4bd] font-medium">Player Photo <span className="text-red-400 font-bold ml-0.5">*</span> (up to 10MB)</span>
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
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Name <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                <Input
                  id="name"
                  placeholder="e.g. Virat Kohli"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                  className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Phone (10 digits) <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                <Input
                  id="phone"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={registerMutation.isPending}
                  maxLength={10}
                  required
                  className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Age <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g. 27"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                  className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Gender <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                    <SelectItem value="Male" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Male</SelectItem>
                    <SelectItem value="Female" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">City <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                    <SelectItem value="vijayawada" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Vijayawada</SelectItem>
                    <SelectItem value="tenali" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Tenali</SelectItem>
                    <SelectItem value="guntur" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Guntur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Player Level <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                <Select value={playerLevel} onValueChange={setPlayerLevel}>
                  <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                    <SelectItem value="Beginner" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Beginner</SelectItem>
                    <SelectItem value="Intermediate" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Intermediate</SelectItem>
                    <SelectItem value="Advanced" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Advanced</SelectItem>
                    <SelectItem value="Professional" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sport-specific details are hidden in the code
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
            */}

            {auction.id === "6a8edaddd7ed74151dbafab3" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jerseySize" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Jersey Size <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Input
                    id="jerseySize"
                    placeholder="e.g. M, L, XL"
                    value={jerseySize}
                    onChange={(e) => setJerseySize(e.target.value)}
                    disabled={registerMutation.isPending}
                    required
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jerseyName" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Jersey Name <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Input
                    id="jerseyName"
                    placeholder="e.g. Dhoni"
                    value={jerseyName}
                    onChange={(e) => setJerseyName(e.target.value)}
                    disabled={registerMutation.isPending}
                    required
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trouserSize" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Jersey Number <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Input
                    id="trouserSize"
                    placeholder="e.g. 7"
                    value={trouserSize}
                    onChange={(e) => setTrouserSize(e.target.value)}
                    disabled={registerMutation.isPending}
                    required
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Number of seasons played <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Select value={bblSeasons} onValueChange={setBblSeasons}>
                    <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                      <SelectValue placeholder="Select seasons" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <SelectItem key={i} value={String(i)} className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="jerseySize" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Jersey Size <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                <Input
                  id="jerseySize"
                  placeholder="e.g. M, L, XL"
                  value={jerseySize}
                  onChange={(e) => setJerseySize(e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                  className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                />
              </div>
            )}

            {auction.id === "6a8edaddd7ed74151dbafab3" && (
              <div className="rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/40 p-5 space-y-4 text-[#fffcf7]">
                <h3 className="font-bold text-base text-[#fffcf7]">Membership Details</h3>
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
                      <RadioGroupItem value="bni" id="r-bni" className="border-[#5c6875] text-[#a1b5d8] focus:ring-[#a1b5d8]" />
                      <Label htmlFor="r-bni" className="cursor-pointer text-sm font-semibold text-[#fffcf7]">BNI Member</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="family" id="r-family" className="border-[#5c6875] text-[#a1b5d8] focus:ring-[#a1b5d8]" />
                      <Label htmlFor="r-family" className="cursor-pointer text-sm font-semibold text-[#fffcf7]">Family Member</Label>
                    </div>
                  </RadioGroup>

                  {memberType === "bni" && (
                    <div className="space-y-2 pt-2 animate-in fade-in">
                      <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Chapter Name <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                      <Select value={chapterName} onValueChange={setChapterName}>
                        <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                          <SelectValue placeholder="Select Chapter" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                          {CHAPTERS.map(ch => (
                            <SelectItem key={ch} value={ch} className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">{ch}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {memberType === "family" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2 animate-in fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="bniName" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Member Name <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                        <Input
                          id="bniName"
                          placeholder="e.g. John Doe"
                          value={bniName}
                          onChange={(e) => setBniName(e.target.value)}
                          disabled={registerMutation.isPending}
                          required
                          className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Chapter Name <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                        <Select value={chapterName} onValueChange={setChapterName}>
                          <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                            <SelectValue placeholder="Select Chapter" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                            {CHAPTERS.map(ch => (
                              <SelectItem key={ch} value={ch} className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">{ch}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Relationship <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                        <Select value={relationship} onValueChange={setRelationship}>
                          <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                            <SelectValue placeholder="Select Relationship" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                            <SelectItem value="Child" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Child</SelectItem>
                            <SelectItem value="Spouse" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Spouse</SelectItem>
                            <SelectItem value="Parents" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Parents</SelectItem>
                            <SelectItem value="Siblings" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Siblings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Details - Only for JSE / other auctions, NOT for BNI */}
            {auction.id !== "6a8edaddd7ed74151dbafab3" && (
              <div className="rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/40 p-5 space-y-4 text-[#fffcf7]">
                <h3 className="font-bold text-base text-[#fffcf7]">Payment Details</h3>

                <div className="space-y-2 pt-1">
                  <Label htmlFor="paymentImage" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">
                    Payment Screenshot <span className="text-red-400 font-bold ml-0.5">*</span>
                  </Label>
                  {paymentImage ? (
                    <div className="relative w-full max-w-sm group">
                      <img src={paymentImage} alt="Payment screenshot" className="rounded-2xl border border-[#5c6875]/40 object-contain w-full h-48 bg-[#162235] shadow-md" />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2 rounded-full opacity-90 hover:opacity-100 shadow-md"
                        onClick={() => setPaymentImage(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Label 
                        htmlFor="paymentImage" 
                        className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235]/60 hover:bg-[#162235] hover:border-[#a1b5d8] transition-colors cursor-pointer"
                      >
                        <UploadCloud className="size-8 text-[#a1b5d8] mb-1.5" />
                        <span className="text-sm font-bold text-[#fffcf7]">Click to upload screenshot</span>
                        <span className="text-xs text-[#abb4bd] mt-0.5">JPEG, PNG up to 10MB</span>
                      </Label>
                      <Input id="paymentImage" type="file" accept="image/*" className="hidden" onChange={handlePaymentImageChange} disabled={registerMutation.isPending} required />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full rounded-full py-4 h-auto font-black text-base text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_25px_rgba(161,181,216,0.4)] transition-all"
                disabled={registerMutation.isPending}
              >
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

      {/* Crop Dialog */}
      <Dialog open={!!cropImageSrc} onOpenChange={(open) => { if (!open) setCropImageSrc(null); }}>
        <DialogContent className="sm:max-w-md flex flex-col items-center rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#fffcf7] tracking-tight">Crop Profile Photo</DialogTitle>
          </DialogHeader>
          
          <div className="relative mt-4 flex items-center justify-center bg-[#2e343a]/40 p-6 rounded-2xl w-full border border-[#5c6875]/30">
            <div 
              className="relative size-72 rounded-full overflow-hidden border-4 border-[#a1b5d8] bg-black select-none cursor-move shadow-xl"
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Zoom</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-[#a1b5d8] h-1.5 bg-[#2e343a] rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCropImageSrc(null)}
                className="rounded-full border-[#5c6875]/50 text-[#fffcf7] hover:bg-[#2e343a]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCropSave}
                className="rounded-full px-5 py-2 font-black text-xs text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-md"
              >
                Save Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
