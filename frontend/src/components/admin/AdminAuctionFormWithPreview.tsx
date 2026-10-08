import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ImagePlus, Loader2, Sparkles, Eye, Trophy, Users, ShieldCheck, Landmark, Check, Clock, Award } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { fileToCompressedDataUrl, IMAGE_PRESETS } from "@/lib/image";
import {
  auctionFormSchema,
  SPORT_TYPES,
  VISIBILITIES,
  sportTypeLabels,
  visibilityLabels,
  type AuctionFormValues,
} from "@/lib/validations/auction";
import stadiumImg from "@/assets/stadium-band.jpg";
import { formatPoints } from "@/lib/team-stats";

const PRESET_COVERS = [
  { label: "Stadium Arena", url: stadiumImg },
  { label: "Cyber Sports", url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80" },
  { label: "Night Floodlights", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80" },
  { label: "Gold Champions", url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80" },
];

export function AdminAuctionFormWithPreview({
  defaultValues,
  onSubmit,
  submitLabel = "Save Customized Auction",
}: {
  defaultValues?: Partial<AuctionFormValues>;
  onSubmit: (values: AuctionFormValues) => Promise<void>;
  submitLabel?: string;
}) {
  const form = useForm<AuctionFormValues>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      sportType: "cricket",
      name: "",
      coverImage: stadiumImg,
      date: new Date(),
      time: "18:00",
      playersPerTeam: 7,
      pointsPerTeam: 100000,
      minimumBid: 5000,
      maxBid: 300000,
      bidIncrement: 500,
      visibility: "public",
      ...defaultValues,
    },
  });

  const watchAll = form.watch();
  const coverImage = watchAll.coverImage;
  const pointsPerTeam = watchAll.pointsPerTeam;
  const playersPerTeam = watchAll.playersPerTeam;
  const minimumBid = watchAll.minimumBid;
  const name = watchAll.name || "My Customized League 2026";
  const sportType = watchAll.sportType || "cricket";
  const bidIncrement = watchAll.bidIncrement || 500;
  const maxBid = watchAll.maxBid || 300000;

  // Custom Preview Toggles
  const [showChapterBadge, setShowChapterBadge] = useState(true);
  const [chapterSampleName, setChapterSampleName] = useState("BNI Hyderabad");

  // Auto-calculate maximum allowed bid based on Purse, Squad size, and Minimum Bid
  useEffect(() => {
    const pts = Number(pointsPerTeam) || 0;
    const players = Number(playersPerTeam) || 1;
    const minBid = Number(minimumBid) || 0;
    if (pts > 0 && players > 0) {
      const calculatedMaxBid = Math.max(minBid, pts - Math.max(0, players - 1) * minBid);
      form.setValue("maxBid", calculatedMaxBid, { shouldValidate: true });
    }
  }, [pointsPerTeam, playersPerTeam, minimumBid, form]);

  async function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Cover image must be less than 10MB");
      e.target.value = "";
      return;
    }
    const dataUrl = await fileToCompressedDataUrl(file, IMAGE_PRESETS.cover);
    form.setValue("coverImage", dataUrl, { shouldDirty: true });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Form Customized */}
      <div className="lg:col-span-7 bg-[#142630]/90 backdrop-blur-xl border-2 border-[#38bdf8]/40 rounded-3xl p-6 md:p-8 shadow-[0_15px_50px_rgba(0,0,0,0.7)] text-[#fffcf7]">
        <div className="flex items-center justify-between border-b border-[#38bdf8]/30 pb-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide font-auction flex items-center gap-2">
              <Sparkles className="size-6 text-[#f97316]" /> Customize Auction Settings
            </h2>
            <p className="text-xs text-[#abb4bd] mt-1 font-medium">
              Configure parameters and custom rules. Live updates appear in preview mode.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Cover Image + Presets */}
            <div className="space-y-3">
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">
                Tournament Cover Banner
              </FormLabel>
              <label
                htmlFor="coverImageInput"
                className="relative flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#38bdf8]/50 bg-[#0f171c]/80 text-[#38bdf8] hover:bg-[#162e38] hover:border-[#38bdf8] transition-all shadow-inner group"
              >
                {coverImage ? (
                  <img src={coverImage} alt="Auction cover" className="size-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-1.5 text-sm text-center">
                    <ImagePlus className="size-7 text-[#38bdf8] group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-white">Click to Upload Cover Image</span>
                    <span className="text-[11px] text-[#abb4bd]">JPEG, PNG up to 10MB</span>
                  </span>
                )}
                <input id="coverImageInput" type="file" accept="image/*" className="hidden" onChange={handleCoverImageChange} />
              </label>

              {/* Quick Cover Preset Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-[#abb4bd] font-bold">Presets:</span>
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => form.setValue("coverImage", preset.url, { shouldDirty: true })}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-[#0c1820] border border-[#38bdf8]/40 text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#0c1820] transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sport & Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="sportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Sport Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-white focus:ring-[#38bdf8]">
                          <SelectValue placeholder="Select a sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-white">
                        {SPORT_TYPES.map((sport) => (
                          <SelectItem key={sport} value={sport} className="hover:bg-[#182e3c] text-white">
                            {sportTypeLabels[sport]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Tournament Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. AOTMS Super League 2026"
                        className="rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-white placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#38bdf8]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Date & Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Auction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-white hover:bg-[#182e3c] hover:text-white",
                              !field.value && "text-[#8f9ba7]"
                            )}
                          >
                            <CalendarIcon className="mr-2 size-4 text-[#38bdf8]" />
                            {field.value ? format(field.value, "d MMM yyyy") : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border border-[#38bdf8]/40 bg-[#0c1820] text-white shadow-2xl" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          autoFocus
                          disabled={{ before: new Date() }}
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Auction Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-white focus-visible:ring-[#38bdf8]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Players & Purse */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="playersPerTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Players / Team</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        className="rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-white focus-visible:ring-[#38bdf8]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pointsPerTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Team Purse (Points)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        className="rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-white focus-visible:ring-[#38bdf8]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Bidding Rules */}
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="minimumBid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Base Price (Min Bid)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        className="rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-white focus-visible:ring-[#38bdf8]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bidIncrement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Bid Step (+ Increment)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        className="rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-white focus-visible:ring-[#38bdf8]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxBid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Max Bid Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        className="rounded-xl border-[#38bdf8]/40 bg-[#0c1820] text-amber-300 font-bold focus-visible:ring-[#38bdf8]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Custom Rules & Form Badges Customization */}
            <div className="rounded-2xl border border-[#38bdf8]/30 bg-[#0c1820] p-4 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#38bdf8] flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-400" /> Additional Custom Field Toggles
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={showChapterBadge}
                    onChange={(e) => setShowChapterBadge(e.target.checked)}
                    className="size-4 rounded accent-[#f97316]"
                  />
                  <span>Enable Chapter Name Badge</span>
                </label>
                {showChapterBadge && (
                  <input
                    type="text"
                    value={chapterSampleName}
                    onChange={(e) => setChapterSampleName(e.target.value)}
                    placeholder="Chapter Name..."
                    className="px-3 py-1 rounded-xl bg-[#142630] border border-[#38bdf8]/40 text-xs text-emerald-300 focus:outline-none"
                  />
                )}
              </div>
            </div>

            {/* Visibility */}
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4 pt-1">
                      {VISIBILITIES.map((v) => (
                        <label key={v} className="flex items-center gap-2 text-sm font-semibold text-white cursor-pointer hover:text-[#38bdf8] transition-colors">
                          <RadioGroupItem value={v} className="border-[#38bdf8] text-[#38bdf8] focus:ring-[#38bdf8]" />
                          {visibilityLabels[v]}
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-rose-400 text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-2xl py-4 h-auto font-black text-sm text-white bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] hover:from-[#f97316] hover:to-[#ea580c] shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:shadow-[0_0_35px_rgba(249,115,22,0.85)] hover:scale-[1.01] transition-all border border-white/30 cursor-pointer uppercase tracking-wider"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Saving Customized Auction...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* RIGHT COLUMN: Live Preview Mode */}
      <div className="lg:col-span-5 space-y-6 sticky top-20">
        {/* Preview Container Header */}
        <div className="rounded-3xl border-2 border-[#f97316]/60 bg-[#0c1820]/95 p-4 flex items-center justify-between shadow-[0_0_30px_rgba(249,115,22,0.3)]">
          <div className="flex items-center gap-2">
            <span className="relative flex size-3">
              <span className="animate-ping absolute inline-flex size-full rounded-full bg-[#f97316] opacity-75" />
              <span className="relative inline-flex rounded-full size-3 bg-[#f97316]" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-[#f97316]">
              RIGHT SIDE PREVIEW MODE
            </span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#f97316]/20 text-orange-300 border border-[#f97316]/40">
            Real-Time Sync
          </span>
        </div>

        {/* Live Preview 1: Auction Hero Card */}
        <div className="rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a34] overflow-hidden shadow-2xl select-none">
          <div className="relative h-44 w-full overflow-hidden">
            {coverImage ? (
              <img src={coverImage} alt="Preview" className="size-full object-cover" />
            ) : (
              <div className="size-full bg-gradient-to-br from-[#1e3a45] to-[#38bdf8] grid place-items-center text-white text-2xl font-black">
                {name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#162a34] via-[#162a34]/60 to-transparent" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#162a32]/90 border border-[#38bdf8]/60 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#f97316] animate-pulse" />
              {sportTypeLabels[sportType] || "Sports"} Tournament
            </div>
          </div>

          <div className="p-5 text-white space-y-3">
            <h3 className="text-2xl font-black uppercase tracking-wide text-white drop-shadow-md leading-tight">
              {name}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#abb4bd]">
              <div className="flex items-center gap-1.5 bg-[#0c1820] p-2 rounded-xl border border-[#38bdf8]/30">
                <Users className="size-4 text-[#38bdf8]" />
                <span>{playersPerTeam} Pl / Team</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0c1820] p-2 rounded-xl border border-[#38bdf8]/30">
                <Landmark className="size-4 text-emerald-400" />
                <span>{formatPoints(pointsPerTeam || 0)} Pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview 2: Auctioneer Bidding Controls */}
        <div className="rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a34] p-5 space-y-4 shadow-xl select-none">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#38bdf8]">
            <span>Bidding Parameters</span>
            <span className="text-emerald-400 font-mono">Max Bid: {formatPoints(maxBid)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-[#0c1820] border border-[#38bdf8]/30">
              <span className="text-[10px] text-[#abb4bd] block uppercase">Base Bid</span>
              <span className="text-sm font-black text-white">{formatPoints(minimumBid || 0)}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0c1820] border border-[#38bdf8]/30">
              <span className="text-[10px] text-[#abb4bd] block uppercase">Increment</span>
              <span className="text-sm font-black text-[#f97316]">+{formatPoints(bidIncrement || 0)}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0c1820] border border-[#38bdf8]/30">
              <span className="text-[10px] text-[#abb4bd] block uppercase">Shortcut</span>
              <span className="text-sm font-black text-emerald-300">{formatPoints(maxBid)}</span>
            </div>
          </div>
        </div>

        {/* Live Preview 3: Player Card Custom Badge Preview */}
        <div className="rounded-3xl border-2 border-[#38bdf8]/40 bg-[#162a34] p-5 space-y-3 shadow-xl select-none">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#38bdf8]">
            <span>Sample Player Card</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-[#38bdf8]/20 border border-[#38bdf8]/40 font-mono">
              S.No #33
            </span>
          </div>

          <div className="flex items-center gap-3 bg-[#0c1820] p-3 rounded-2xl border border-[#38bdf8]/30">
            <div className="size-12 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#1e3a45] grid place-items-center text-white font-black text-lg shrink-0">
              US
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-extrabold text-sm text-white truncate">Uppala Sundeep</h4>
              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-[#f97316] text-white font-bold">
                  All-Rounder
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#142630] border border-[#38bdf8]/40 text-[#38bdf8] font-bold">
                  Grade A
                </span>
                {showChapterBadge && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold">
                    Chapter: {chapterSampleName || "BNI"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAuctionFormWithPreview;
