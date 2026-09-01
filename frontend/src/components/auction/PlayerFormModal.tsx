import { useState, useEffect, useRef } from "react";
import { Loader2, Plus, Pencil, UploadCloud, Copy, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePlayers } from "@/hooks/usePlayers";
import { useTeams } from "@/hooks/useTeams";
import { SPORT_CONFIGS } from "@/lib/validations/player";
import { auctionClient } from "@/lib/auction-client";
import type { SportType, Player, PlayerInput } from "@/lib/auction-client";
import { fileToCompressedDataUrl, IMAGE_PRESETS } from "@/lib/image";

type PlayerFormModalProps = {
  auctionId: string;
  sportType: SportType;
  playersPerTeam: number;
  player?: Player | undefined;
  trigger?: React.ReactNode | undefined;
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
};

const normalizeHand = (h?: string | null) => {
  if (!h) return "";
  const upper = h.toUpperCase().trim();
  if (upper.includes("RIGHT")) return "Right Hand";
  if (upper.includes("LEFT")) return "Left Hand";
  if (upper.includes("BOTH")) return "Both Hands";
  return h;
};

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

export function PlayerFormModal({ auctionId, sportType, playersPerTeam, player, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: PlayerFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;
  const isBni = auctionId === "6a8edaddd7ed74151dbafab3";
  const isHunterzVolleyball = auctionId === "6a8a705aef1f9e0978b3031c";
  const isJsc = auctionId === "6a8ed4afb1d04e719c5866a6";
  const hidePayment = isBni || isHunterzVolleyball;
  const hideManualTeam = isHunterzVolleyball || isBni || isJsc;

  
  // Base fields
  const [name, setName] = useState(player?.name || "");
  const [phone, setPhone] = useState(player?.phone || "");
  const [phoneError, setPhoneError] = useState("");
  const [age, setAge] = useState(player?.age?.toString() || "");
  const [category, setCategory] = useState(player?.category || "");
  const [gender, setGender] = useState(player?.gender || "");
  const [city, setCity] = useState(player?.city || "");
  const [playerLevel, setPlayerLevel] = useState(player?.playerLevel || "");
  
  // Payment Details
  const [paymentMode, setPaymentMode] = useState(player?.paymentMode || "");
  const [utrNumber, setUtrNumber] = useState(player?.utrNumber || "");
  const [paymentImage, setPaymentImage] = useState<string | null>(player?.paymentImage || null);
  const [loadingFullDetails, setLoadingFullDetails] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  const [baseValue, setBaseValue] = useState(player?.baseValue?.toString() || "0");
  const [jerseySize, setJerseySize] = useState(player?.jerseySize || "");
  const [jerseyName, setJerseyName] = useState(player?.jerseyName || "");
  const [trouserSize, setTrouserSize] = useState(player?.trouserSize || "");
  
  // Custom Data / Membership / Dominant Hand
  const [customData, setCustomData] = useState(player?.customData || "");
  const [dominatedHand, setDominatedHand] = useState(
    normalizeHand(
      player?.sportFields?.["Dominated Hand"] ||
      (player?.customData?.startsWith("Dominated Hand: ") ? player.customData.replace("Dominated Hand: ", "") : (player?.customData || ""))
    )
  );
  const [position, setPosition] = useState(player?.sportFields?.["role"] || "");
  const initialIsBni = player?.customData?.startsWith("BNI Member");
  const initialIsFamily = player?.customData?.startsWith("Family Member");
  
  const [memberType, setMemberType] = useState<"bni" | "family" | "">(initialIsBni ? "bni" : initialIsFamily ? "family" : "");
  const [chapterName, setChapterName] = useState("");
  const [bniName, setBniName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [bblSeasons, setBblSeasons] = useState("");

  const [photo, setPhoto] = useState<string | null>(player?.photo || null);
  
  // State fields
  const [teamId, setTeamId] = useState(player?.teamId || "none");
  const [soldPrice, setSoldPrice] = useState(player?.soldPrice?.toString() || "");
  
  // Sport fields
  const [sportFields, setSportFields] = useState<Record<string, any>>(player?.sportFields || {});

  const { players, createPlayer, updatePlayer, isCreating, isUpdating } = usePlayers(auctionId);
  const { teams } = useTeams(auctionId);
  const isSubmitting = isCreating || isUpdating;

  function rosterCount(teamId: string) {
    return players.filter((p) => p.teamId === teamId && p.id !== player?.id).length;
  }

  const config = SPORT_CONFIGS[sportType] || SPORT_CONFIGS["cricket"];

  const availableRoles = Array.from(
    new Set([
      ...config.roles,
      "ALL ROUNDER",
      "COUNTER",
      "MIDDLE BLOCKER",
      "LIBERO",
      "SETTER",
      "ATTACKER",
      "UNIVERSAL",
      "BLOCKER",
      "PASSER",
      "OUTSIDE HITTER",
      "RIGHT SIDE HITTER",
      "BOOSTER",
      ...(position ? [position] : []),
    ])
  );

  const specPlaceholders: Record<string, string> = {
    "Preferred Foot": "e.g. Right",
    "Spike Height": "e.g. 320 cm",
    "Block Height": "e.g. 310 cm",
    "Signature Move": "e.g. Cobra Raid",
  };
  const getSpecPlaceholder = (spec: string) => specPlaceholders[spec] || "e.g. Add a detail";

  // Reset form when opened if not editing
  useEffect(() => {
    if (open && !player) {
      setName("");
      setPhone("");
      setAge("");
      setCategory("");
      setGender("");
      setCity("");
      setPlayerLevel("");
      setPaymentMode("");
      setUtrNumber("");
      setPaymentImage(null);
      setBaseValue("0");
      setJerseySize("");
      setJerseyName("");
      setTrouserSize("");
      setCustomData("");
      setDominatedHand("");
      setPosition("");
      setBblSeasons("");
      setPhoto(null);
      setTeamId("none");
      setSoldPrice("");
      setSportFields({});
    } else if (open && player) {
      setName(player.name);
      setPhone(player.phone);
      setAge(player.age?.toString() || "");
      setCategory(player.category);
      setGender(player.gender || "");
      setCity(player.city || "");
      setPlayerLevel(player.playerLevel || "");
      setPaymentMode(player.paymentMode || "");
      setUtrNumber(player.utrNumber || "");
      setPaymentImage(player.paymentImage || null);
      setBaseValue(player.baseValue.toString());
      
      const fetchFullDetails = async () => {
        setLoadingFullDetails(true);
        try {
          const fullPlayer = await auctionClient.getPlayerById(player.id);
          if (fullPlayer && fullPlayer.paymentImage) {
            setPaymentImage(fullPlayer.paymentImage);
            setImgLoading(true);
            setImgError(false);
          }
        } catch (err) {
          console.error("Failed to fetch full player details for payment screenshot:", err);
        } finally {
          setLoadingFullDetails(false);
        }
      };
      fetchFullDetails();
      setJerseySize(player.jerseySize);
      setJerseyName(player.jerseyName);
      setTrouserSize(player.trouserSize);
      setCustomData(player.customData);
      const rawHand = player.sportFields?.["Dominated Hand"] ||
        (player.customData?.startsWith("Dominated Hand: ") ? player.customData.replace("Dominated Hand: ", "") : (player.customData || ""));
      setDominatedHand(normalizeHand(rawHand));
      setPosition(player.sportFields?.["role"] || "");
      setPhoto(player.photo || null);
      setTeamId(player.teamId || "none");
      setSoldPrice(player.soldPrice?.toString() || "");
      setSportFields(player.sportFields || {});
      
      if (player.customData?.startsWith("BNI Member")) {
        setMemberType("bni");
        const match = player.customData.match(/Chapter: ([^|]*)/);
        if (match) setChapterName(match[1]?.trim() || "");
        const bblMatch = player.customData.match(/BBL Seasons: ([^|]*)/);
        if (bblMatch) setBblSeasons(bblMatch[1]?.trim() || "");
      } else if (player.customData?.startsWith("Family Member")) {
        setMemberType("family");
        const match = player.customData.match(/BNI Name: ([^,]*), Chapter: ([^,]*), Rel: ([^|]*)/);
        if (match) {
          setBniName(match[1]?.trim() || "");
          setChapterName(match[2]?.trim() || "");
          setRelationship(match[3]?.trim() || "");
        }
        const bblMatch = player.customData.match(/BBL Seasons: ([^|]*)/);
        if (bblMatch) setBblSeasons(bblMatch[1]?.trim() || "");
      }
    }
  }, [open, player]);

  const handleSportFieldChange = (key: string, value: string) => {
    setSportFields((prev) => ({ ...prev, [key]: value }));
  };

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

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

  const handlePaymentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Payment screenshot must be less than 10MB");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPaymentImage(reader.result as string);
        setImgLoading(false);
        setImgError(false);
        if (!paymentMode) {
          setPaymentMode("Online");
        }
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || phone.trim().length !== 10) {
      toast.error("Please provide a valid name and exactly 10-digit phone number");
      return;
    }

    const isBniAuction = auctionId === "6a8edaddd7ed74151dbafab3";
    let customDataStr = customData;

    if (isBniAuction) {
      if (bblSeasons === "") {
        toast.error("Please select Number of BBL seasons played");
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
        customDataStr = `BNI Member | Chapter: ${chapterName} | BBL Seasons: ${bblSeasons}`;
      } else if (memberType === "family") {
        customDataStr = `Family Member | BNI Name: ${bniName}, Chapter: ${chapterName}, Rel: ${relationship} | BBL Seasons: ${bblSeasons}`;
      }
    } else {
      if (dominatedHand) {
        customDataStr = `Dominated Hand: ${dominatedHand}`;
      }
      if (utrNumber && utrNumber.length !== 12) {
        toast.error("UTR Number must be 12 digits if provided");
        return;
      }
    }

    const effectivePaymentMode = isBniAuction ? "" : (paymentMode || (paymentImage ? "Online" : ""));

    const updatedSportFields = {
      ...sportFields,
      ...(position ? { role: position } : {}),
      ...(dominatedHand ? { "Dominated Hand": dominatedHand } : {}),
    };

    const input: PlayerInput = {
      auctionId,
      name,
      phone,
      age: age ? parseInt(age) : null,
      category,
      gender,
      city,
      playerLevel,
      paymentMode: effectivePaymentMode,
      utrNumber: isBniAuction ? "" : utrNumber,
      paymentImage: isBniAuction ? null : paymentImage,
      baseValue: parseFloat(baseValue) || 0,
      jerseySize,
      jerseyName,
      trouserSize,
      customData: customDataStr,
      photo,
      sportFields: updatedSportFields,
    };

    const updateExtras = {
      teamId: teamId === "none" ? null : teamId,
      soldPrice: soldPrice ? parseFloat(soldPrice) : null,
    };

    try {
      if (player) {
        await updatePlayer({ id: player.id, patch: { ...input, ...updateExtras } });
        toast.success("Player updated successfully!");
      } else {
        await createPlayer(input);
        toast.success("Player added successfully!");
      }
      setOpen(false);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to save player";
      if (msg.toLowerCase().includes("duplicate phone") || msg.toLowerCase().includes("already registered")) {
        setPhoneError("Duplicate phone number not allowed! This number is already registered.");
      }
      toast.error(msg);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger !== undefined ? (
            trigger
          ) : !player ? (
            <Button
              size="icon"
              className="fixed bottom-24 right-6 size-14 rounded-full shadow-xl sm:bottom-8 sm:right-10 bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] text-[#162235] hover:scale-105 transition-all shadow-[0_0_20px_rgba(161,181,216,0.4)] border border-[#fffcf7]/40 z-30"
            >
              <Plus className="size-7 stroke-[2.5]" />
            </Button>
          ) : null}
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#fffcf7] tracking-tight">
              {player ? "Edit Player Details" : "Add New Player"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-6 pt-4 text-[#fffcf7]">
            <div className="flex flex-col items-center justify-center space-y-2 pb-2">
              {photo ? (
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCropImageSrc(photo);
                      setZoom(1);
                      setDragOffset({ x: 0, y: 0 });
                    }}
                    className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#a1b5d8]/40 bg-[#162235] hover:border-[#a1b5d8] transition-all group cursor-pointer shadow-md"
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
                    onClick={() => document.getElementById("modal-player-photo")?.click()}
                    className="text-xs text-[#a1b5d8] hover:text-[#fffcf7] font-bold hover:underline transition-colors mt-0.5"
                  >
                    Upload New
                  </button>
                </div>
              ) : (
                <Label htmlFor="modal-player-photo" className="cursor-pointer">
                  <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235]/60 hover:bg-[#162235] hover:border-[#a1b5d8] transition-colors shadow-inner">
                    <Plus className="size-8 text-[#a1b5d8]" />
                  </div>
                </Label>
              )}
              <span className="text-xs text-[#abb4bd] font-medium">Player Photo</span>
              <input
                id="modal-player-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={isSubmitting}
              />
            </div>

            {isBni ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">NAME <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Input
                    id="name"
                    placeholder="e.g. Virat Kohli"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">
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
                    disabled={isSubmitting}
                    maxLength={10}
                    required
                    className={`rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8] ${phoneError ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                  {phoneError && (
                    <p className="text-xs font-semibold text-red-400 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {phoneError}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">AGE <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g. 27"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">GENDER <span className="text-red-400 font-bold ml-0.5">*</span></Label>
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
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">CITY <span className="text-red-400 font-bold ml-0.5">*</span></Label>
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
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">PLAYER LEVEL <span className="text-red-400 font-bold ml-0.5">*</span></Label>
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
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">GRADE / CATEGORY <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                      <SelectItem value="A+" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">A+</SelectItem>
                      <SelectItem value="A" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">A</SelectItem>
                      <SelectItem value="B+" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">B+</SelectItem>
                      <SelectItem value="B" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">B</SelectItem>
                      <SelectItem value="C" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jerseySize" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">JERSEY SIZE <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Input
                    id="jerseySize"
                    placeholder="e.g. M, L, XL"
                    value={jerseySize}
                    onChange={(e) => setJerseySize(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jerseyName" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">JERSEY NAME <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Input
                    id="jerseyName"
                    placeholder="e.g. Dhoni"
                    value={jerseyName}
                    onChange={(e) => setJerseyName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trouserSize" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">JERSEY NUMBER <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Input
                    id="trouserSize"
                    placeholder="e.g. 7"
                    value={trouserSize}
                    onChange={(e) => setTrouserSize(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">NUMBER OF SEASONS PLAYED <span className="text-red-400 font-bold ml-0.5">*</span></Label>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Name <span className="text-red-400 font-bold ml-0.5">*</span></Label>
                  <Input
                    id="name"
                    placeholder="e.g. Virat Kohli"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">
                    Phone (10 digits) <span className="text-red-400 font-bold ml-0.5">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError("");
                    }}
                    disabled={isSubmitting}
                    maxLength={10}
                    required
                    className={`rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8] ${phoneError ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                  {phoneError && (
                    <p className="text-xs font-semibold text-red-400 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {phoneError}
                    </p>
                  )}
                </div>

              {/* Playing Position / Role & Dominated Hand (Hidden for JSC Badminton) */}
              {!isJsc && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Playing Position / Role</Label>
                    <Select value={position} onValueChange={setPosition}>
                      <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                        <SelectValue placeholder="Select Position / Role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                        {config.roles.map((r) => (
                          <SelectItem key={r} value={r} className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Dominated Hand</Label>
                    <Select value={dominatedHand} onValueChange={setDominatedHand}>
                      <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                        <SelectValue placeholder="Select Dominated Hand" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                        <SelectItem value="Right Hand" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Right Hand</SelectItem>
                        <SelectItem value="Left Hand" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Left Hand</SelectItem>
                        <SelectItem value="Both Hands" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Both Hands</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g. 27"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Grade / Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                    <SelectItem value="A+" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">A+</SelectItem>
                    <SelectItem value="A" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">A</SelectItem>
                    <SelectItem value="B+" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">B+</SelectItem>
                    <SelectItem value="B" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">B</SelectItem>
                    {!isJsc && (
                      <SelectItem value="C" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">C</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {!isJsc && (
                <div className="space-y-2">
                  <Label htmlFor="baseValue" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Base Value (Points)</Label>
                  <Input
                    id="baseValue"
                    type="number"
                    placeholder="e.g. 500"
                    value={baseValue}
                    onChange={(e) => setBaseValue(e.target.value)}
                    disabled={isSubmitting}
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
              )}

              {!isHunterzVolleyball && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Gender</Label>
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
                    <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">City</Label>
                    {isJsc ? (
                      <Select value={city || "vijayawada"} onValueChange={setCity}>
                        <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                          <SelectItem value="vijayawada" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Vijayawada</SelectItem>
                          <SelectItem value="tenali" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Tenali</SelectItem>
                          <SelectItem value="guntur" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Guntur</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="city"
                        placeholder="e.g. Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={isSubmitting}
                        className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Player Level</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="jerseySize" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Jersey Size</Label>
                    <Input
                      id="jerseySize"
                      placeholder="e.g. M, L, XL"
                      value={jerseySize}
                      onChange={(e) => setJerseySize(e.target.value)}
                      disabled={isSubmitting}
                      className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                    />
                  </div>
                  {!isJsc && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="jerseyName" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Jersey Name</Label>
                        <Input
                          id="jerseyName"
                          placeholder="e.g. DHONI"
                          value={jerseyName}
                          onChange={(e) => setJerseyName(e.target.value)}
                          disabled={isSubmitting}
                          className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trouserSize" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Jersey Number / Trouser</Label>
                        <Input
                          id="trouserSize"
                          placeholder="e.g. 7"
                          value={trouserSize}
                          onChange={(e) => setTrouserSize(e.target.value)}
                          disabled={isSubmitting}
                          className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {isBni && (
              <div className="rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/40 p-5 space-y-4 text-[#fffcf7]">
                <h3 className="font-bold text-base text-[#fffcf7]">Membership Details</h3>
              <div className="space-y-4">
                <RadioGroup 
                  value={memberType} 
                  onValueChange={(val) => {
                    setMemberType(val as "bni" | "family");
                    if (!player) {
                      setChapterName("");
                      setBniName("");
                      setRelationship("");
                    }
                  }} 
                  className="flex gap-6"
                  disabled={isSubmitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bni" id="modal-r-bni" className="border-[#5c6875] text-[#a1b5d8] focus:ring-[#a1b5d8]" />
                    <Label htmlFor="modal-r-bni" className="cursor-pointer text-sm font-semibold text-[#fffcf7]">BNI Member</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="family" id="modal-r-family" className="border-[#5c6875] text-[#a1b5d8] focus:ring-[#a1b5d8]" />
                    <Label htmlFor="modal-r-family" className="cursor-pointer text-sm font-semibold text-[#fffcf7]">Family Member</Label>
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
                        {CHAPTERS.map((ch) => (
                          <SelectItem key={ch} value={ch} className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">
                            {ch}
                          </SelectItem>
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
                        disabled={isSubmitting}
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
                          {CHAPTERS.map((ch) => (
                            <SelectItem key={ch} value={ch} className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">
                              {ch}
                            </SelectItem>
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

          {!hidePayment && (
            <div className="rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/40 p-5 space-y-4 text-[#fffcf7]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#fffcf7]">Payment Details</h3>
                {paymentImage && (
                  <span className="text-xs font-semibold text-[#c2d8b9] bg-[#23341d]/70 border border-[#47673a] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    Screenshot Uploaded
                  </span>
                )}
              </div>

            {loadingFullDetails ? (
              <div className="flex items-center gap-2 text-sm text-[#abb4bd] pt-2">
                <Loader2 className="size-4 animate-spin text-[#a1b5d8]" />
                Loading payment details...
              </div>
            ) : paymentImage ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Payment Screenshot</Label>
                  {paymentImage.startsWith("http") && (
                    <a 
                      href={paymentImage} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-[#a1b5d8] hover:underline flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="size-3" /> Open in New Tab
                    </a>
                  )}
                </div>

                <div className="relative w-full max-w-sm rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] p-3 shadow-md space-y-2.5">
                  {/* Image Preview Container with Loading & Error Handlers */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#162235] flex items-center justify-center border border-[#5c6875]/30">
                    {imgLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#162235]/80 backdrop-blur-xs z-10">
                        <Loader2 className="size-6 animate-spin text-[#a1b5d8] mb-1" />
                        <span className="text-xs text-[#abb4bd]">Loading image...</span>
                      </div>
                    )}
                    {imgError ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <AlertCircle className="size-7 text-amber-400 mb-1" />
                        <span className="text-xs font-bold text-[#fffcf7]">Preview unavailable</span>
                        <span className="text-[11px] text-[#abb4bd] mt-0.5">Image URL is valid but preview failed to render in browser</span>
                        <a 
                          href={paymentImage} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-[#a1b5d8] hover:underline mt-2 font-medium flex items-center gap-1"
                        >
                          <ExternalLink className="size-3" /> View Image URL directly
                        </a>
                      </div>
                    ) : (
                      <img 
                        src={paymentImage} 
                        alt="Payment screenshot" 
                        className={`size-full object-contain cursor-pointer hover:opacity-95 transition-opacity ${imgLoading ? "opacity-0" : "opacity-100"}`}
                        onLoad={() => setImgLoading(false)}
                        onError={() => { setImgLoading(false); setImgError(true); }}
                        onClick={() => window.open(paymentImage, "_blank")}
                        title="Click to open full screenshot" 
                      />
                    )}
                  </div>

                  {/* Display Image URL with Copy and Open Buttons */}
                  {paymentImage.startsWith("http") && (
                    <div className="space-y-1">
                      <Label className="text-[11px] text-[#abb4bd]">Image URL</Label>
                      <div className="rounded-xl bg-[#2e343a]/70 px-2.5 py-1.5 flex items-center justify-between gap-2 border border-[#5c6875]/40 text-[11px]">
                        <a
                          href={paymentImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#a1b5d8] hover:underline truncate font-mono select-all cursor-pointer font-medium"
                          title="Click to redirect to image URL"
                        >
                          {paymentImage}
                        </a>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-1.5 text-[11px] text-[#abb4bd] hover:text-[#fffcf7]" 
                            onClick={() => {
                              navigator.clipboard.writeText(paymentImage);
                              toast.success("Image URL copied to clipboard");
                            }}
                            title="Copy URL"
                          >
                            <Copy className="size-3" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-1.5 text-[11px] text-[#abb4bd] hover:text-[#fffcf7]" 
                            onClick={() => window.open(paymentImage, "_blank")}
                            title="Open URL in new tab"
                          >
                            <ExternalLink className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1.5 border-t border-[#5c6875]/30 text-xs">
                    <Label 
                      htmlFor="modalPaymentImageChangeInput" 
                      className="cursor-pointer font-bold text-[#a1b5d8] hover:underline flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-[#a1b5d8]/10 transition-colors"
                    >
                      <Pencil className="size-3" /> Change Screenshot
                    </Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-destructive/10"
                      onClick={() => {
                        setPaymentImage(null);
                        setImgLoading(false);
                        setImgError(false);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  <input 
                    id="modalPaymentImageChangeInput" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePaymentImageChange} 
                    disabled={isSubmitting} 
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-[#abb4bd]">No payment screenshot uploaded.</p>
                <div>
                  <Label 
                    htmlFor="modalPaymentImageUpload" 
                    className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235]/60 hover:bg-[#162235] hover:border-[#a1b5d8] transition-colors cursor-pointer"
                  >
                    <UploadCloud className="size-8 text-[#a1b5d8] mb-1.5" />
                    <span className="text-sm font-bold text-[#fffcf7]">Upload Screenshot / Update Here</span>
                    <span className="text-xs text-[#abb4bd] mt-0.5">Click to browse image (JPEG, PNG up to 10MB)</span>
                  </Label>
                  <input 
                    id="modalPaymentImageUpload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePaymentImageChange} 
                    disabled={isSubmitting} 
                  />
                </div>
              </div>
            )}
          </div>
        )}

          {player && !hideManualTeam && (
            <div className="rounded-2xl border border-[#5c6875]/30 bg-[#2e343a]/40 p-5 space-y-4 text-[#fffcf7]">
              <h3 className="font-bold text-base text-[#fffcf7]">Manual Team & Price Assignment</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Sold To Team</Label>
                  <Select value={teamId} onValueChange={setTeamId}>
                    <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                      <SelectValue placeholder="Unsold / Available" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                      <SelectItem value="none" className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">Unsold / Available</SelectItem>
                      {teams.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soldPrice" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Sold Price (Points)</Label>
                  <Input
                    id="soldPrice"
                    type="number"
                    placeholder="e.g. 1200"
                    value={soldPrice}
                    onChange={(e) => setSoldPrice(e.target.value)}
                    disabled={isSubmitting}
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#5c6875]/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-6 shadow-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full px-6 py-2.5 h-auto font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_20px_rgba(161,181,216,0.35)]"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 size-4 animate-spin" />Saving...</>
              ) : (
                "Save Player"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
      </Dialog>

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
                className="rounded-full border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60 transition-all font-bold px-5 py-2 shadow-sm"
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
    </>
  );
}
