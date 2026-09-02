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
  team?: Team | undefined;
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
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
        toast.error("Logo must be less than 10MB");
        e.target.value = "";
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
      toast.error("Please fill in all required fields marked with an asterisk (*)");
      return;
    }

    try {
      if (team) {
        await updateTeam({
          id: team.id,
          patch: {
            name,
            shortName,
            ownerName,
            ownerPhone,
            colorTheme,
            logo,
          },
        });
        toast.success("Team updated successfully");
      } else {
        await createTeam({
          auctionId,
          name,
          shortName,
          ownerName,
          ownerPhone,
          colorTheme,
          logo,
        });
        toast.success("Team created successfully");
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
        {trigger !== undefined ? (
          trigger
        ) : !team ? (
          <Button
            size="icon"
            className="fixed bottom-24 right-6 size-14 rounded-full shadow-2xl sm:bottom-8 sm:right-10 bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-[#ffffff] hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.7)] border-2 border-white/50 z-30"
          >
            <Plus className="size-7 stroke-[3]" />
          </Button>
        ) : null}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl border-2 border-[#38bdf8]/40 bg-[#142630] text-[#ffffff] shadow-[0_20px_60px_rgba(10,25,32,0.95)] p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-[#ffffff] tracking-tight">
            {team ? "Edit Team Details" : "Add New Team"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="flex flex-col items-center justify-center space-y-2 pb-2">
            <Label htmlFor="logo" className="cursor-pointer">
              <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235] hover:border-[#a1b5d8] transition-colors shadow-inner">
                {logo ? (
                  <img src={logo} alt="Team logo" className="size-full object-cover" />
                ) : (
                  <Plus className="size-8 text-[#a1b5d8]" />
                )}
              </div>
            </Label>
            <span className="text-xs text-[#abb4bd] font-medium">Team Logo * (up to 10MB)</span>
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
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Team Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Royal Challengers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortName" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Short Name *</Label>
              <Input
                id="shortName"
                placeholder="e.g. RCB"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                disabled={isSubmitting}
                className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Owner Name *</Label>
              <Input
                id="ownerName"
                placeholder="e.g. John Doe"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                disabled={isSubmitting}
                className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerPhone" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Owner Contact *</Label>
              <Input
                id="ownerPhone"
                placeholder="e.g. 9876543210"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                disabled={isSubmitting}
                className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="colorTheme" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Team Color/Theme *</Label>
            <Input
              id="colorTheme"
              placeholder="e.g. #3b82f6 or Blue"
              value={colorTheme}
              onChange={(e) => setColorTheme(e.target.value)}
              disabled={isSubmitting}
              className="rounded-xl border-2 border-[#38bdf8]/40 bg-[#162a34]/90 text-[#ffffff] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8]"
            />
          </div>

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

export default TeamFormModal;
