import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ImagePlus, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/site/SiteFooter";
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
          <Skeleton className="mt-4 h-10 w-full" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-3xl text-foreground">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>

        <form onSubmit={handleSave} className="mt-8 space-y-6">
          <div className="flex justify-center">
            <label
              htmlFor="avatar"
              className="relative flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/40 text-muted-foreground hover:bg-muted/60"
            >
              {avatar ? (
                <FallbackImage
                  src={avatar}
                  alt="Your avatar"
                  className="size-full"
                  fallback={<ImagePlus className="size-6" aria-hidden="true" />}
                />
              ) : (
                <ImagePlus className="size-6" aria-hidden="true" />
              )}
              <input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1" />
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>

        <Button variant="outline" className="mt-4 w-full" onClick={handleSignOut}>
          <LogOut className="mr-2 size-4" /> Sign out
        </Button>
      </main>

      <SiteFooter />
    </div>
  );
}
