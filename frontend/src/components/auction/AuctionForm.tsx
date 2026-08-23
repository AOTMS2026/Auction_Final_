import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ImagePlus, Loader2 } from "lucide-react";
import { format } from "date-fns";

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
      bidIncrement: 100,
      visibility: "public",
      ...defaultValues,
    },
  });

  const coverImage = form.watch("coverImage");

  async function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToCompressedDataUrl(file, IMAGE_PRESETS.cover);
    form.setValue("coverImage", dataUrl, { shouldDirty: true });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center gap-3">
          <label
            htmlFor="coverImage"
            className="relative flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/40 text-muted-foreground hover:bg-muted/60"
          >
            {coverImage ? (
              <img src={coverImage} alt="Auction cover" className="size-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1 text-sm">
                <ImagePlus className="size-6" aria-hidden="true" />
                Add cover image
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
              <FormLabel>Sport</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SPORT_TYPES.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sportTypeLabels[sport]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auction Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. ABCL Season 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Auction Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value ? format(field.value, "d MMM yyyy") : "Pick a date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      autoFocus
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auction Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
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
                <FormLabel>Players / Team</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pointsPerTeam"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points Balance / Team</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="minimumBid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Bid</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bidIncrement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bid Increased By</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auction Visibility</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                  {VISIBILITIES.map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm text-foreground">
                      <RadioGroupItem value={v} />
                      {visibilityLabels[v]}
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
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
