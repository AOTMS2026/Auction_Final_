import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { exportLandingPage } from "@/lib/landing-export";

export function LandingExportButton({ mobile = false }: { mobile?: boolean }) {
  function handleExport() {
    try {
      exportLandingPage();
      toast.success("Landing page code and theme downloaded.");
    } catch (error) {
      console.error("[landing-export] failed:", error);
      toast.error("Could not export the landing page.");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={mobile ? "default" : "sm"}
      data-landing-export-control
      onClick={handleExport}
      className={
        mobile
          ? "w-full border-[#38bdf8]/50 bg-[#162e38] text-[#ffffff] hover:bg-[#234857] hover:text-[#ffffff]"
          : "border-[#38bdf8]/50 bg-[#162e38]/80 text-[#ffffff] hover:bg-[#234857] hover:text-[#ffffff]"
      }
    >
      <Download className="size-4" />
      Export Landing Page
    </Button>
  );
}
