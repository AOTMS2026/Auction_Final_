import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ImagePlus, Loader2 } from "lucide-react";
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

export function AuctionForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: {
  defaultValues?: Partial<AuctionFormValues>;
  onSubmit: (values: AuctionFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const form = useForm<AuctionFormValues>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      sportType: "cricket",
      name: "",
      coverImage: null,
      date: new Date(),
      time: "18:00",
      playersPerTeam: 7,
      pointsPerTeam: 100000,
      minimumBid: 500,
      maxBid: 30000,
      bidIncrement: 100,
      visibility: "public",
      ...defaultValues,
    },
  });

  const coverImage = form.watch("coverImage");

  async function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size exceeds 10MB limit. Please upload an image under 10MB.");
      toast.error("Cover image must be less than 10MB");
      e.target.value = "";
      return;
    }
    const dataUrl = await fileToCompressedDataUrl(file, IMAGE_PRESETS.cover);
    form.setValue("coverImage", dataUrl, { shouldDirty: true });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-[#fffcf7]">
        <div className="flex flex-col items-center gap-3">
          <label
            htmlFor="coverImage"
            className="relative flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#a1b5d8]/40 bg-[#162235]/60 text-[#a1b5d8] hover:bg-[#162235] hover:border-[#a1b5d8] transition-all shadow-inner group"
          >
            {coverImage ? (
              <img src={coverImage} alt="Auction cover" className="size-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1.5 text-sm text-center">
                <ImagePlus className="size-7 text-[#a1b5d8] group-hover:scale-110 transition-transform" aria-hidden="true" />
                <span className="font-bold text-[#fffcf7]">Add Tournament Cover Image</span>
                <span className="text-[11px] text-[#abb4bd] font-normal">JPEG, PNG up to 10MB</span>
              </span>
            )}
            <input id="coverImage" type="file" accept="image/*" className="hidden" onChange={handleCoverImageChange} />
          </label>
        </div>

        <FormField
          control={form.control}
          name="sportType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Sport</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus:ring-[#a1b5d8]">
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl border-[#5c6875]/50 bg-[#171a1d] text-[#fffcf7]">
                  {SPORT_TYPES.map((sport) => (
                    <SelectItem key={sport} value={sport} className="hover:bg-[#2e343a] focus:bg-[#2e343a] text-[#fffcf7]">
                      {sportTypeLabels[sport]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Auction Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Premier League Season 5"
                  className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] placeholder:text-[#8f9ba7]/50 focus-visible:ring-[#a1b5d8]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

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
                          "justify-start text-left font-normal rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] hover:bg-[#2e343a] hover:text-[#fffcf7]",
                          !field.value && "text-[#8f9ba7]"
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4 text-[#a1b5d8]" />
                        {field.value ? format(field.value, "d MMM yyyy") : "Pick a date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl border border-[#5c6875]/40 bg-[#171a1d] text-[#fffcf7] shadow-2xl" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      autoFocus
                      disabled={{ before: new Date() }}
                      className="text-[#fffcf7]"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-400 text-xs" />
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
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="playersPerTeam"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Player Per Team</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pointsPerTeam"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Points Balance / Team</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="minimumBid"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Minimum Bid</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxBid"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Maximum Bid</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bidIncrement"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Bid Increased By</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    className="rounded-xl border-[#5c6875]/50 bg-[#2e343a]/70 text-[#fffcf7] focus-visible:ring-[#a1b5d8]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#abb4bd]">Auction Visibility</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4 pt-1">
                  {VISIBILITIES.map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm font-semibold text-[#fffcf7] cursor-pointer hover:text-[#a1b5d8] transition-colors">
                      <RadioGroupItem value={v} className="border-[#5c6875] text-[#a1b5d8] focus:ring-[#a1b5d8]" />
                      {visibilityLabels[v]}
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full rounded-full py-3.5 h-auto font-black text-sm text-[#162235] bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] shadow-[0_0_25px_rgba(161,181,216,0.35)] hover:shadow-[0_0_35px_rgba(161,181,216,0.55)] hover:scale-[1.01] transition-all duration-300 border border-[#fffcf7]/30"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </Form>
  );
}

export default AuctionForm;
