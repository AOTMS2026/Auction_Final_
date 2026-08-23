import { useState, useEffect } from "react";
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
  player?: Player;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function PlayerFormModal({ auctionId, sportType, player, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: PlayerFormModalProps) {
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

  const { createPlayer, updatePlayer, isCreating, isUpdating } = usePlayers(auctionId);
  const { teams } = useTeams(auctionId);
  const isSubmitting = isCreating || isUpdating;

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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Photo must be less than 2MB");
        return;
      }
      try {
        const dataUrl = await fileToCompressedDataUrl(file, IMAGE_PRESETS.avatar);
        setPhoto(dataUrl);
      } catch (err) {
        toast.error("Failed to process photo");
      }
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
            <Label htmlFor="player-photo" className="cursor-pointer">
              <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors">
                {photo ? (
                  <img src={photo} alt="Player photo" className="size-full object-cover" />
                ) : (
                  <Plus className="size-8 text-muted-foreground" />
                )}
              </div>
            </Label>
            <span className="text-xs text-muted-foreground">Player Photo</span>
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
                  <Select value={teamId} onValueChange={setTeamId}>
                    <SelectTrigger><SelectValue placeholder="Unsold" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unsold</SelectItem>
                      {teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
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
  );
}
