import { useState, useEffect, useRef } from "react";
import { Loader2, Plus, Pencil } from "lucide-react";
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
import { usePlayers } from "@/hooks/usePlayers";
import { useTeams } from "@/hooks/useTeams";
import { SPORT_CONFIGS } from "@/lib/validations/player";
import type { SportType, Player, PlayerInput } from "@/lib/auction-client";

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
  return h;
};

export function PlayerFormModal({ auctionId, sportType, playersPerTeam, player, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: PlayerFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  // 11 Required Fields
  const [photo, setPhoto] = useState<string | null>(player?.photo || null);
  const [name, setName] = useState(player?.name || "");
  const [phone, setPhone] = useState(player?.phone || "");
  const [phoneError, setPhoneError] = useState("");
  const [position, setPosition] = useState(player?.sportFields?.["role"] || player?.sportFields?.["Position"] || "");
  const [dominatedHand, setDominatedHand] = useState(
    normalizeHand(
      player?.sportFields?.["Dominated Hand"] ||
      (player?.customData?.startsWith("Dominated Hand: ") ? player.customData.replace("Dominated Hand: ", "") : (player?.customData || ""))
    )
  );
  const [age, setAge] = useState(player?.age?.toString() || "");
  const [gender, setGender] = useState(player?.gender ? (player.gender.trim().charAt(0).toUpperCase() + player.gender.trim().slice(1).toLowerCase()) : "");
  const [city, setCity] = useState(player?.city || "");
  const [jerseySize, setJerseySize] = useState(player?.jerseySize || "");
  const [jerseyName, setJerseyName] = useState(player?.jerseyName || "");
  const [trouserSize, setTrouserSize] = useState(player?.trouserSize || "");

  // Sport Fields (Preserved on edit)
  const [sportFields, setSportFields] = useState<Record<string, any>>(player?.sportFields || {});

  // State fields (For admin edit mode)
  const [teamId, setTeamId] = useState(player?.teamId || "none");
  const [soldPrice, setSoldPrice] = useState(player?.soldPrice?.toString() || "");

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
      ...(sportType === "cricket" || !sportType ? ["Batsman", "Bowler", "All-Rounder", "Wicket-Keeper"] : []),
      ...(position ? [position] : []),
    ])
  );

  // Reset form when opened if not editing
  useEffect(() => {
    if (open && !player) {
      setPhoto(null);
      setName("");
      setPhone("");
      setPhoneError("");
      setPosition("");
      setDominatedHand("");
      setAge("");
      setGender("");
      setCity("");
      setJerseySize("");
      setJerseyName("");
      setTrouserSize("");
      setTeamId("none");
      setSoldPrice("");
      setSportFields({});
    } else if (open && player) {
      setPhoto(player.photo || null);
      setName(player.name || "");
      setPhone(player.phone || "");
      setPhoneError("");
      setPosition(player.sportFields?.["role"] || player.sportFields?.["Position"] || "");
      const rawHand =
        player.sportFields?.["Dominated Hand"] ||
        (player.customData?.startsWith("Dominated Hand: ")
          ? player.customData.replace("Dominated Hand: ", "")
          : player.customData || "");
      setDominatedHand(normalizeHand(rawHand));
      setAge(player.age?.toString() || "");
      setGender(
        player.gender
          ? player.gender.trim().charAt(0).toUpperCase() + player.gender.trim().slice(1).toLowerCase()
          : ""
      );
      setCity(player.city || "");
      setJerseySize(player.jerseySize || "");
      setJerseyName(player.jerseyName || "");
      setTrouserSize(player.trouserSize || "");
      setTeamId(player.teamId || "none");
      setSoldPrice(player.soldPrice?.toString() || "");
      setSportFields(player.sportFields || {});
    }
  }, [open, player]);

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
    const isDuplicate = players.some(
      (p) => p.phone?.trim() === trimmedPhone && (!player || p.id !== player.id)
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
      auctionId,
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
      baseValue: player?.baseValue ?? 0,
      category: player?.category ?? "",
      playerLevel: player?.playerLevel ?? "",
      paymentMode: "",
      utrNumber: "",
      paymentImage: null,
    };

    if (teamId && teamId !== "none") {
      const selectedTeam = teams.find((t) => t.id === teamId);
      const count = rosterCount(teamId);
      if (selectedTeam && count >= playersPerTeam) {
        toast.error("Max team reached");
        return;
      }
    }

    const updateExtras = {
      teamId: teamId === "none" ? null : teamId,
      soldPrice: (teamId && teamId !== "none" && soldPrice) ? parseFloat(soldPrice) : (teamId === "none" ? null : (soldPrice ? parseFloat(soldPrice) : null)),
      auctionRoundStatus: (teamId === "none" ? "pending" : "sold") as "pending" | "sold",
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
              className="fixed bottom-24 right-6 size-14 rounded-full shadow-2xl sm:bottom-8 sm:right-10 bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-[#ffffff] hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.7)] border-2 border-white/50 z-30"
            >
              <Plus className="size-7 stroke-[3]" />
            </Button>
          ) : null}
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-[0_20px_60px_rgba(10,25,32,0.95)] p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#ffffff] tracking-tight">
              {player ? "Edit Player Details" : "Add New Player"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-6 pt-4 text-[#fffcf7]">
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
                    className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#38bdf8]/60 bg-[#162235] hover:border-[#38bdf8] transition-all group cursor-pointer shadow-md"
                    title="Crop / Zoom existing picture"
                  >
                    <img src={photo} alt="Player photo" className="size-full object-cover object-top" />
                    <div className="absolute inset-0 bg-[#142630]/75 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="size-5 text-[#38bdf8] mb-0.5" />
                      <span className="text-[10px] font-black text-[#fffcf7] uppercase tracking-wider">Crop/Zoom</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("modal-player-photo")?.click()}
                    className="text-xs text-[#38bdf8] hover:text-[#fffcf7] font-bold hover:underline transition-colors mt-0.5"
                  >
                    Upload New
                  </button>
                </div>
              ) : (
                <Label htmlFor="modal-player-photo" className="cursor-pointer">
                  <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#38bdf8]/50 bg-[#162235]/60 hover:bg-[#162235] hover:border-[#38bdf8] transition-colors shadow-inner">
                    <Plus className="size-8 text-[#38bdf8]" />
                  </div>
                </Label>
              )}
              <span className="text-xs text-[#38bdf8] font-bold">
                PLAYER PHOTO <span className="text-red-400 font-bold ml-0.5">*</span>
              </span>
              <input
                id="modal-player-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  maxLength={10}
                  required
                  className={`rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold ${
                    phoneError ? "border-red-500 ring-1 ring-red-500" : ""
                  }`}
                />
                {phoneError && (
                  <p className="text-xs font-semibold text-red-400 mt-1 flex items-center gap-1">
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  required
                  className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                />
              </div>
            </div>

            {/* Manual Team & Price Assignment (Shown only when editing existing player) */}
            {player && (
              <div className="rounded-2xl border-2 border-[#38bdf8]/35 bg-[#142630]/90 p-5 space-y-4 text-[#ffffff]">
                <h3 className="font-black text-base text-[#ffffff]">Manual Team & Price Assignment</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">Sold To Team</Label>
                    <Select value={teamId} onValueChange={setTeamId}>
                      <SelectTrigger className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] focus:ring-[#38bdf8] font-bold">
                        <SelectValue placeholder="Unsold / Available" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-[#38bdf8]/50 bg-[#142630] text-[#ffffff]">
                        <SelectItem value="none" className="hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold">Unsold / Available</SelectItem>
                        {teams.map((t) => (
                          <SelectItem key={t.id} value={t.id} className="hover:bg-[#1a3a4a] focus:bg-[#1a3a4a] text-[#ffffff] font-bold">
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soldPrice" className="text-xs font-black uppercase tracking-wider text-[#38bdf8]">Sold Price (Points)</Label>
                    <Input
                      id="soldPrice"
                      type="number"
                      placeholder="e.g. 1200"
                      value={soldPrice}
                      onChange={(e) => setSoldPrice(e.target.value)}
                      disabled={isSubmitting}
                      className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#142630]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8] font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[#38bdf8]/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#203f4f] transition-all font-bold px-6 shadow-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full px-7 py-2.5 h-auto font-black text-sm text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.65)] hover:scale-105 transition-all border border-white/30"
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
                className="rounded-full border-2 border-[#38bdf8]/40 bg-[#162a34] text-[#f2e9dc] hover:text-[#ffffff] hover:bg-[#203f4f] transition-all font-bold px-6 py-2 shadow-sm"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCropSave}
                className="rounded-full px-6 py-2 font-black text-xs text-[#ffffff] bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_20px_rgba(249,115,22,0.6)]"
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
