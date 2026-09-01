import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ImagePlus, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { authClient } from "@/lib/auth-client";
import { fileToCompressedDataUrl, IMAGE_PRESETS } from "@/lib/image";
import { Skeleton } from "@/components/ui/skeleton";
import { FallbackImage } from "@/components/ui/fallback-image";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null);
  const [saving, setSaving] = useState(false);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
      toast.error("Image must be 10MB or less.");
      e.target.value = "";
      return;
    }
    const dataUrl = await fileToCompressedDataUrl(file, IMAGE_PRESETS.avatar);
    setAvatar(dataUrl);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await authClient.updateProfile({ name, avatar });
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  function handleSignOut() {
    authClient.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-md px-4 py-12">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
          <div className="mt-8 space-y-6">
            <div className="flex justify-center">
              <Skeleton className="size-24 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-[#fffcf7] selection:bg-[#a1b5d8] selection:text-[#162235]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 15%, #2e343a 0%, #171a1d 55%, #0f1214 100%)",
      }}
    >
      <SiteHeader />

      <main className="mx-auto max-w-md px-4 py-12">
        <div className="bg-[#2e343a]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#5c6875]/30 shadow-[0_15px_45px_rgba(23,26,29,0.8)] text-[#fffcf7]">
          <h1 className="text-3xl font-black text-[#fffcf7] tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-[#abb4bd]">{user?.email}</p>

          <form onSubmit={handleSave} className="mt-8 space-y-6">
            <div className="flex flex-col items-center justify-center">
              <label
                htmlFor="avatar"
                className="relative flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235]/60 text-[#a1b5d8] hover:bg-[#162235] hover:border-[#a1b5d8] transition-colors shadow-inner"
              >
                {avatar ? (
                  <FallbackImage
                    src={avatar}
                    alt="Your avatar"
                    className="size-full object-cover"
                    fallback={<ImagePlus className="size-6" aria-hidden="true" />}
                  />
                ) : (
                  <ImagePlus className="size-6" aria-hidden="true" />
                )}
                <input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              <span className="text-xs text-[#abb4bd] mt-2">JPEG, PNG up to 10MB</span>
            </div>

            <div>
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1.5 rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full py-3.5 h-auto font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_25px_rgba(161,181,216,0.35)] transition-all"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>

          <Button
            variant="outline"
            className="mt-4 w-full rounded-full border-[#5c6875]/40 bg-[#171a1d]/60 text-[#fffcf7] hover:bg-[#2e343a] hover:text-[#fffcf7] transition-all"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </div>
      </main>
    </div>
  );
}
