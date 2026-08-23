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
import { fileToCompressedDataUrl, IMAGE_PRESETS } from "@/lib/image";

type PlayerFormModalProps = {
  auctionId: string;
  sportType: SportType;
  playersPerTeam: number;
  player?: Player;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function PlayerFormModal({ auctionId, sportType, playersPerTeam, player, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: PlayerFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  
  // Base fields
  const [name, setName] = useState(player?.name || "");
  const [phone, setPhone] = useState(player?.phone || "");
  const [age, setAge] = useState(player?.age?.toString() || "");
  const [category, setCategory] = useState(player?.category || "");
  const [baseValue, setBaseValue] = useState(player?.baseValue?.toString() || "0");
  const [jerseySize, setJerseySize] = useState(player?.jerseySize || "");
  const [jerseyName, setJerseyName] = useState(player?.jerseyName || "");
  const [trouserSize, setTrouserSize] = useState(player?.trouserSize || "");
  const [customData, setCustomData] = useState(player?.customData || "");
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
      setPhoto(null);
      setTeamId("none");
      setSoldPrice("");
      setSportFields({});
    } else if (open && player) {
      setName(player.name);
      setPhone(player.phone);
      setAge(player.age?.toString() || "");
      setCategory(player.category);
      setBaseValue(player.baseValue.toString());
      setJerseySize(player.jerseySize);
      setJerseyName(player.jerseyName);
      setTrouserSize(player.trouserSize);
      setCustomData(player.customData);
      setPhoto(player.photo || null);
      setTeamId(player.teamId || "none");
      setSoldPrice(player.soldPrice?.toString() || "");
      setSportFields(player.sportFields || {});
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || phone.trim().length !== 10) {
      toast.error("Please provide a valid name and exactly 10-digit phone number");
      return;
    }

    const input: PlayerInput = {
      auctionId,
      name,
      phone,
      age: age ? parseInt(age) : null,
      category,
      baseValue: parseFloat(baseValue) || 0,
      jerseySize,
      jerseyName,
      trouserSize,
      customData,
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
                      const basePhoto = sportFields.originalPhoto || photo;
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
              <span className="text-xs text-muted-foreground font-semibold">Player Photo</span>
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
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. Icon / Set A / Marquee" value={category} onChange={(e) => setCategory(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseValue">Base Value</Label>
              <Input id="baseValue" type="number" placeholder="e.g. 500" value={baseValue} onChange={(e) => setBaseValue(e.target.value)} disabled={isSubmitting} />
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-semibold">{sportType.charAt(0).toUpperCase() + sportType.slice(1)} Specific Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Role/Skill</Label>
                <Select value={sportFields["role"] || ""} onValueChange={(v) => handleSportFieldChange("role", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                  <SelectContent>
                    {config.roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {config.stats.map(stat => (
                <div key={stat} className="space-y-2">
                  <Label>{stat}</Label>
                  <Input type="number" placeholder="e.g. 0" value={sportFields[stat] || ""} onChange={(e) => handleSportFieldChange(stat, e.target.value)} disabled={isSubmitting} />
                </div>
              ))}
              {config.specs.map(spec => (
                <div key={spec} className="space-y-2">
                  <Label>{spec}</Label>
                  <Input placeholder={getSpecPlaceholder(spec)} value={sportFields[spec] || ""} onChange={(e) => handleSportFieldChange(spec, e.target.value)} disabled={isSubmitting} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="jerseySize">Jersey Size</Label>
              <Input id="jerseySize" placeholder="e.g. M, L, XL" value={jerseySize} onChange={(e) => setJerseySize(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jerseyName">Jersey Name</Label>
              <Input id="jerseyName" placeholder="e.g. KOHLI" value={jerseyName} onChange={(e) => setJerseyName(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trouserSize">Trouser Size</Label>
              <Input id="trouserSize" placeholder="e.g. 32" value={trouserSize} onChange={(e) => setTrouserSize(e.target.value)} disabled={isSubmitting} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customData">Custom Data / Extra Details</Label>
            <Input id="customData" placeholder="e.g. Injury history, past team, notes" value={customData} onChange={(e) => setCustomData(e.target.value)} disabled={isSubmitting} />
          </div>

          {player && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-900/20">
              <h3 className="mb-4 font-semibold text-yellow-800 dark:text-yellow-200">Manual Assignment</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Sold To Team</Label>
                  <Select value={teamId} onValueChange={(val) => {
                    if (val !== "none") {
                      const count = rosterCount(val);
                      if (count >= playersPerTeam && val !== player?.teamId) {
                        toast.error(`This team already has the maximum ${playersPerTeam} players.`);
                        return; // Prevent selection
                      }
                    }
                    setTeamId(val);
                  }}>
                    <SelectTrigger><SelectValue placeholder="Unsold" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unsold</SelectItem>
                      {teams.map((t) => {
                        const count = rosterCount(t.id);
                        const full = count >= playersPerTeam && t.id !== teamId;
                        return (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name} {full ? `(Full ${count}/${playersPerTeam})` : `(${count}/${playersPerTeam})`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soldPrice">Sold Price</Label>
                  <Input id="soldPrice" type="number" placeholder="e.g. 1200" value={soldPrice} onChange={(e) => setSoldPrice(e.target.value)} disabled={isSubmitting} />
                </div>
              </div>
            </div>
          )}

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
