import { useState } from "react";
import { Loader2, Plus, Upload } from "lucide-react";
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
import { useTeams } from "@/hooks/useTeams";
import { fileToCompressedDataUrl, IMAGE_PRESETS } from "@/lib/image";
import type { Team } from "@/lib/auction-client";

type TeamFormModalProps = {
  auctionId: string;
  team?: Team;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function TeamFormModal({ auctionId, team, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: TeamFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;
  const [name, setName] = useState(team?.name || "");
  const [shortName, setShortName] = useState(team?.shortName || "");
  const [ownerName, setOwnerName] = useState(team?.ownerName || "");
  const [ownerPhone, setOwnerPhone] = useState(team?.ownerPhone || "");
  const [colorTheme, setColorTheme] = useState(team?.colorTheme || "");
  const [logo, setLogo] = useState<string | null>(team?.logo || null);
  const { createTeam, updateTeam, isCreating, isUpdating } = useTeams(auctionId);
  const isSubmitting = isCreating || isUpdating;

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo must be less than 2MB");
        return;
      }
      try {
        const dataUrl = await fileToCompressedDataUrl(file, IMAGE_PRESETS.cover);
        setLogo(dataUrl);
      } catch (err) {
        toast.error("Failed to process image");
      }
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !shortName.trim() || !ownerName.trim() || !ownerPhone.trim() || !colorTheme.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!logo) {
      toast.error("Please upload a team logo");
      return;
    }

    try {
      if (team) {
        await updateTeam({ 
          id: team.id, 
          patch: { name, shortName, logo, ownerName, ownerPhone, colorTheme } 
        });
        toast.success("Team updated successfully!");
      } else {
        await createTeam({ auctionId, name, shortName, logo, ownerName, ownerPhone, colorTheme });
        toast.success("Team added successfully!");
      }
      setOpen(false);
      if (!team) {
        setName("");
        setShortName("");
        setOwnerName("");
        setOwnerPhone("");
        setColorTheme("");
        setLogo(null);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save team");
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Add New Team"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="flex flex-col items-center justify-center space-y-2 pb-4">
            <Label htmlFor="logo" className="cursor-pointer">
              <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors">
                {logo ? (
                  <img src={logo} alt="Team logo" className="size-full object-cover" />
                ) : (
                  <Plus className="size-8 text-muted-foreground" />
                )}
              </div>
            </Label>
            <span className="text-xs text-muted-foreground">Team Logo *</span>
            <input
              id="logo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Royal Challengers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortName">Short Name *</Label>
              <Input
                id="shortName"
                placeholder="e.g. RCB"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input
                id="ownerName"
                placeholder="e.g. John Doe"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Owner Contact *</Label>
              <Input
                id="ownerPhone"
                placeholder="e.g. 9876543210"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="colorTheme">Team Color/Theme *</Label>
            <Input
              id="colorTheme"
              placeholder="e.g. #FF0000 or Red"
              value={colorTheme}
              onChange={(e) => setColorTheme(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Team"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
