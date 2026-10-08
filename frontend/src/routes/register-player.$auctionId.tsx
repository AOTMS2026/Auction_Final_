import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, CheckCircle2 } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { auctionClient, PlayerInput } from "@/lib/auction-client";
import { auctionDetailQueryOptions } from "@/lib/queries/auctions";
import { usePlayers } from "@/hooks/usePlayers";
import { SPORT_CONFIGS } from "@/lib/validations/player";
import stadiumImg from "@/assets/stadium-band.jpg";

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

  // 11 Required Fields
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [position, setPosition] = useState("");
  const [dominatedHand, setDominatedHand] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [jerseySize, setJerseySize] = useState("");
  const [jerseyName, setJerseyName] = useState("");
  const [trouserSize, setTrouserSize] = useState("");

  const [sportFields, setSportFields] = useState<Record<string, any>>({});

  // Crop state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  const { players } = usePlayers(auction?.id || auctionId);

  const registerMutation = useMutation({
    mutationFn: (input: PlayerInput) => auctionClient.registerPlayer(input),
    onSuccess: () => {
      setSuccess(true);
      toast.success("Successfully registered for the auction!");
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Failed to register. Please try again.";
      if (msg.toLowerCase().includes("duplicate phone") || msg.toLowerCase().includes("already registered")) {
        setPhoneError("Duplicate phone number not allowed! This phone number is already registered.");
      }
      toast.error(msg);
    },
  });

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
  const availableRoles = Array.from(
    new Set([
      ...config.roles,
      ...(auction.sportType === "cricket" || !auction.sportType ? ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"] : []),
      ...(position ? [position] : []),
    ])
  );

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

    if (!photo) {
      toast.error("Please upload player photo");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter player name");
      return;
    }
    if (!phone.trim() || phone.trim().length !== 10) {
      toast.error("Please provide a valid 10-digit phone number");
      return;
    }

    const trimmedPhone = phone.trim();
    const isDuplicate = players?.some(
      (p) => p.phone?.trim() === trimmedPhone
    );
    if (isDuplicate) {
      setPhoneError("Duplicate phone number not allowed! This number is already registered in this auction.");
      toast.error("Duplicate phone number not allowed! This number is already registered in this auction.");
      return;
    }

    if (!position) {
      toast.error("Please select playing position / role");
      return;
    }
    if (!dominatedHand) {
      toast.error("Please select right/left hand");
      return;
    }
    if (!age || isNaN(Number(age)) || Number(age) <= 0) {
      toast.error("Please enter a valid age");
      return;
    }
    if (!gender) {
      toast.error("Please select gender");
      return;
    }
    if (!city.trim()) {
      toast.error("Please enter city");
      return;
    }
    if (!jerseySize.trim()) {
      toast.error("Please enter jersey size");
      return;
    }
    if (!jerseyName.trim()) {
      toast.error("Please enter jersey name");
      return;
    }
    if (!trouserSize.trim()) {
      toast.error("Please enter jersey number");
      return;
    }

    const customDataStr = `Dominated Hand: ${dominatedHand}`;
    const updatedSportFields = {
      ...sportFields,
      role: position,
      "Dominated Hand": dominatedHand,
    };

    const input: PlayerInput = {
      auctionId: auction.id,
      name: name.trim(),
      phone: trimmedPhone,
      age: parseInt(age),
      gender,
      city: city.trim(),
      jerseySize: jerseySize.trim(),
      jerseyName: jerseyName.trim(),
      trouserSize: trouserSize.trim(),
      customData: customDataStr,
      photo,
      sportFields: updatedSportFields,
      baseValue: 0,
      category: "",
      playerLevel: "",
      paymentMode: "",
      utrNumber: "",
      paymentImage: null,
    };

    registerMutation.mutate(input);
  };

  if (success) {
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
              You have successfully registered for <strong className="text-[#38bdf8]">{auction.name}</strong>.
            </p>
            <Button
              className="w-full rounded-full py-3.5 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-[1.01] transition-all border border-white/30 cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              Return Home
            </Button>
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
          src={auction.coverImage || stadiumImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover blur-sm scale-105 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#142630]/80 via-[#142630]/90 to-[#142630]" />
        <div className="relative mx-auto max-w-3xl px-4 py-12 text-center text-[#ffffff] flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 flex-wrap">
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
          </div>
          <h1 className="text-3xl font-black sm:text-5xl mb-3 tracking-tight drop-shadow-md uppercase text-[#ffffff]">PLAYER REGISTRATION</h1>
          <p className="text-base sm:text-lg text-[#f2e9dc]/80 font-medium tracking-wide">Register as a player for <span className="text-[#38bdf8] font-black">{auction.name}</span></p>
        </div>
      </section>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 -mt-6 relative z-10 mb-12">
        <div className="bg-[#162a34]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border-2 border-[#38bdf8]/40 shadow-[0_20px_60px_rgba(15,35,45,0.9)] text-[#ffffff]">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Player Photo */}
            <div className="flex flex-col items-center justify-center space-y-2 pb-2">
              {photo ? (
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const basePhoto = sportFields["originalPhoto"] || photo;
                      setCropImageSrc(basePhoto);
                      setZoom(1);
                      setDragOffset({ x: 0, y: 0 });
                    }}
                    className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#38bdf8]/60 bg-[#142630] hover:border-[#38bdf8] transition-all group cursor-pointer shadow-md"
                    title="Crop / Zoom existing picture"
                  >
                    <img src={photo} alt="Player photo" className="size-full object-cover object-top" />
                    <div className="absolute inset-0 bg-[#142630]/75 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="size-5 text-[#38bdf8] mb-0.5" />
                      <span className="text-[10px] font-black text-[#ffffff] uppercase tracking-wider">Crop/Zoom</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("player-photo")?.click()}
                    className="text-xs text-[#38bdf8] hover:text-[#ffffff] font-bold hover:underline transition-colors mt-0.5"
                  >
                    Upload New
                  </button>
                </div>
              ) : (
                <Label htmlFor="player-photo" className="cursor-pointer">
                  <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#38bdf8]/50 bg-[#142630]/70 hover:bg-[#142630] hover:border-[#38bdf8] transition-colors shadow-inner">
                    <Plus className="size-8 text-[#38bdf8]" />
                  </div>
                </Label>
              )}
              <span className="text-xs text-[#38bdf8] font-bold">
                PLAYER PHOTO <span className="text-red-400 font-bold ml-0.5">*</span>
              </span>
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
              {/* NAME */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  NAME <span className="text-red-400 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Virat Kohli"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                  className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                />
              </div>

              {/* PHONE */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  PHONE (10 DIGITS) <span className="text-red-400 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError("");
                  }}
                  disabled={registerMutation.isPending}
                  maxLength={10}
                  required
                  className={`rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold ${
                    phoneError ? "border-red-500 ring-1 ring-red-500" : ""
                  }`}
                />
                {phoneError && (
                  <p className="text-xs font-bold text-red-400 mt-1 flex items-center gap-1">
                    <span>⚠️</span> {phoneError}
                  </p>
                )}
              </div>

              {/* PLAYING POSITION / ROLE */}
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  PLAYING POSITION / ROLE <span className="text-red-400 font-bold ml-0.5">*</span>
                </Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold">
                    <SelectValue placeholder="Select Position / Role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]">
                    {availableRoles.map((r) => (
                      <SelectItem key={r} value={r} className="hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* RIGHT/LEFT HAND */}
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  RIGHT/LEFT HAND <span className="text-red-400 font-bold ml-0.5">*</span>
                </Label>
                <Select value={dominatedHand} onValueChange={setDominatedHand}>
                  <SelectTrigger className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold">
                    <SelectValue placeholder="Select Right/Left Hand" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]">
                    <SelectItem value="Right Hand" className="hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold">Right Hand</SelectItem>
                    <SelectItem value="Left Hand" className="hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold">Left Hand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AGE */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  AGE <span className="text-red-400 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  placeholder="e.g. 27"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                  className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                />
              </div>

              {/* GENDER */}
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  GENDER <span className="text-red-400 font-bold ml-0.5">*</span>
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]">
                    <SelectItem value="Male" className="hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold">Male</SelectItem>
                    <SelectItem value="Female" className="hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CITY */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  CITY <span className="text-red-400 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                  className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                />
              </div>

              {/* JERSEY SIZE */}
              <div className="space-y-2">
                <Label htmlFor="jerseySize" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  JERSEY SIZE <span className="text-red-400 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  id="jerseySize"
                  placeholder="e.g. M, L, XL"
                  value={jerseySize}
                  onChange={(e) => setJerseySize(e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                  className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                />
              </div>

              {/* JERSEY NAME */}
              <div className="space-y-2">
                <Label htmlFor="jerseyName" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  JERSEY NAME <span className="text-red-400 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  id="jerseyName"
                  placeholder="e.g. DHONI"
                  value={jerseyName}
                  onChange={(e) => setJerseyName(e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                  className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                />
              </div>

              {/* JERSEY NUMBER */}
              <div className="space-y-2">
                <Label htmlFor="trouserSize" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  JERSEY NUMBER <span className="text-red-400 font-bold ml-0.5">*</span>
                </Label>
                <Input
                  id="trouserSize"
                  placeholder="e.g. 7"
                  value={trouserSize}
                  onChange={(e) => setTrouserSize(e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                  className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                />
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
                  "Submit Registration"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Crop Dialog */}
      <Dialog open={!!cropImageSrc} onOpenChange={(open) => { if (!open) setCropImageSrc(null); }}>
        <DialogContent className="sm:max-w-md flex flex-col items-center rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#ffffff] tracking-tight">Crop Profile Photo</DialogTitle>
          </DialogHeader>

          <div className="relative mt-4 flex items-center justify-center bg-[#162a34] p-6 rounded-2xl w-full border-2 border-[#38bdf8]/30">
            <div
              className="relative size-72 rounded-full overflow-hidden border-4 border-[#38bdf8] bg-black select-none cursor-move shadow-xl"
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
              <span className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">Zoom</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-[#38bdf8] h-1.5 bg-[#162a34] rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCropImageSrc(null)}
                className="rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#ffffff] hover:bg-[#1f3a47] font-bold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCropSave}
                className="rounded-full px-6 py-2.5 font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_15px_rgba(249,115,22,0.6)]"
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
