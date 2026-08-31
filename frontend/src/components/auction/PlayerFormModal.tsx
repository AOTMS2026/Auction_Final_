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

export function PlayerFormModal({ auctionId, sportType, playersPerTeam, player, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: PlayerFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;
  const isBni = auctionId === "6a8edaddd7ed74151dbafab3";

  
  // Base fields
  const [name, setName] = useState(player?.name || "");
  const [phone, setPhone] = useState(player?.phone || "");
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
  
  // Custom Data / Membership
  const [customData, setCustomData] = useState(player?.customData || "");
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
      setBaseValue("0");
      setJerseySize("");
      setJerseyName("");
      setTrouserSize("");
      setCustomData("");
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
      if (utrNumber && utrNumber.length !== 12) {
        toast.error("UTR Number must be 12 digits if provided");
        return;
      }
    }

    const effectivePaymentMode = isBniAuction ? "" : (paymentMode || (paymentImage ? "Online" : ""));

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
      sportFields,
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
      toast.error(error instanceof Error ? error.message : "Failed to save player");
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button size="icon" className="fixed bottom-24 right-6 size-14 rounded-full shadow-lg sm:bottom-6 sm:right-10">
              <Plus className="size-6" />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{player ? "Edit Player" : "Add New Player"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-6 pt-4">
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
              <span className="text-xs text-muted-foreground font-semibold">Player Photo (up to 10MB)</span>
              <input
                id="player-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={isSubmitting}
              />
            </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" placeholder="e.g. Virat Kohli" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (10 digits) *</Label>
              <Input id="phone" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isSubmitting} maxLength={10} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="e.g. 27" value={age} onChange={(e) => setAge(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label>Grade</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="e.g. Mumbai" value={city} onChange={(e) => setCity(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label>Player Level</Label>
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
            <div className="space-y-2">
              <Label htmlFor="jerseySize">Jersey Size</Label>
              <Input id="jerseySize" placeholder="e.g. M, L, XL" value={jerseySize} onChange={(e) => setJerseySize(e.target.value)} disabled={isSubmitting} />
            </div>
            {isBni && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="jerseyName">Jersey Name *</Label>
                  <Input id="jerseyName" placeholder="e.g. Dhoni" value={jerseyName} onChange={(e) => setJerseyName(e.target.value)} disabled={isSubmitting} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trouserSize">Jersey Number *</Label>
                  <Input id="trouserSize" placeholder="e.g. 7" value={trouserSize} onChange={(e) => setTrouserSize(e.target.value)} disabled={isSubmitting} required />
                </div>
                <div className="space-y-2">
                  <Label>Number of BBL seasons played *</Label>
                  <Select value={bblSeasons} onValueChange={setBblSeasons}>
                    <SelectTrigger><SelectValue placeholder="Select seasons" /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 9 }).map((_, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <div className="rounded-lg border p-4 bg-muted/10 space-y-4">
            {auctionId === "6a8edaddd7ed74151dbafab3" ? (
              <>
                <h3 className="font-semibold text-lg">Membership Details</h3>
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
                      <RadioGroupItem value="bni" id="modal-r-bni" />
                      <Label htmlFor="modal-r-bni" className="cursor-pointer">BNI Member</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="family" id="modal-r-family" />
                      <Label htmlFor="modal-r-family" className="cursor-pointer">Family Member</Label>
                    </div>
                  </RadioGroup>

                  {memberType === "bni" && (
                    <div className="space-y-2 pt-2 animate-in fade-in">
                      <Label htmlFor="chapterName">Chapter Name *</Label>
                      <Input id="chapterName" placeholder="e.g. Alpha" value={chapterName} onChange={(e) => setChapterName(e.target.value)} disabled={isSubmitting} required />
                    </div>
                  )}

                  {memberType === "family" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2 animate-in fade-in">
                      <div className="space-y-2">
                        <Label htmlFor="bniName">BNI Name *</Label>
                        <Input id="bniName" placeholder="e.g. John Doe" value={bniName} onChange={(e) => setBniName(e.target.value)} disabled={isSubmitting} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chapterNameFam">Chapter Name *</Label>
                        <Input id="chapterNameFam" placeholder="e.g. Alpha" value={chapterName} onChange={(e) => setChapterName(e.target.value)} disabled={isSubmitting} required />
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
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Payment Details</h3>
                  {paymentImage && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      Screenshot Uploaded
                    </span>
                  )}
                </div>

                {loadingFullDetails ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                    <Loader2 className="size-4 animate-spin text-brand" />
                    Loading payment details...
                  </div>
                ) : paymentImage ? (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Payment Screenshot</Label>
                      {paymentImage.startsWith("http") && (
                        <a 
                          href={paymentImage} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-brand hover:underline flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="size-3" /> Open in New Tab
                        </a>
                      )}
                    </div>

                    <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-3 shadow-sm space-y-2.5">
                      {/* Image Preview Container with Loading & Error Handlers */}
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border/50">
                        {imgLoading && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 backdrop-blur-xs z-10">
                            <Loader2 className="size-6 animate-spin text-brand mb-1" />
                            <span className="text-xs text-muted-foreground">Loading image...</span>
                          </div>
                        )}
                        {imgError ? (
                          <div className="flex flex-col items-center justify-center p-4 text-center">
                            <AlertCircle className="size-7 text-amber-500 mb-1" />
                            <span className="text-xs font-medium text-foreground">Preview unavailable</span>
                            <span className="text-[11px] text-muted-foreground mt-0.5">Image URL is valid but preview failed to render in browser</span>
                            <a 
                              href={paymentImage} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs text-brand hover:underline mt-2 font-medium flex items-center gap-1"
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
                          <Label className="text-[11px] text-muted-foreground">Image URL</Label>
                          <div className="rounded-lg bg-muted/70 px-2.5 py-1.5 flex items-center justify-between gap-2 border text-[11px]">
                            <a
                              href={paymentImage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand hover:underline truncate font-mono select-all cursor-pointer font-medium"
                              title="Click to redirect to image URL"
                            >
                              {paymentImage}
                            </a>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-1.5 text-[11px]" 
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
                                className="h-6 px-1.5 text-[11px]" 
                                onClick={() => window.open(paymentImage, "_blank")}
                                title="Open URL in new tab"
                              >
                                <ExternalLink className="size-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1.5 border-t text-xs">
                        <Label 
                          htmlFor="modalPaymentImageChangeInput" 
                          className="cursor-pointer font-medium text-brand hover:underline flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-brand/10 transition-colors"
                        >
                          <Pencil className="size-3" /> Change Screenshot
                        </Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
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
                    <p className="text-xs text-muted-foreground">No payment screenshot uploaded.</p>
                    <div>
                      <Label 
                        htmlFor="modalPaymentImageUpload" 
                        className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <UploadCloud className="size-8 text-primary/60 mb-1.5" />
                        <span className="text-sm font-semibold text-foreground">Upload Screenshot / Update Here</span>
                        <span className="text-xs text-muted-foreground mt-0.5">Click to browse image (JPEG, PNG up to 10MB)</span>
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
              </>
            )}
          </div>



          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
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
    </>
  );
}
