"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

export interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

export interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
  currencySymbol?: string;
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works best for your cricket league or tournament.\nAll plans include real-time live bidding, team balance tracking, and auction management.",
  currencySymbol = "₹",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 60,
        spread: 70,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#90a955", "#4f772d", "#31572c", "#ecf39e", "#ffd60a"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-12">
        <span className={cn("text-sm font-medium transition-colors", isMonthly ? "text-foreground font-semibold" : "text-muted-foreground")}>
          Monthly
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <Label className="sr-only">Toggle Annual Billing</Label>
          <Switch
            ref={switchRef}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-[#4f772d]"
          />
        </label>
        <span className={cn("text-sm font-medium transition-colors flex items-center gap-1.5", !isMonthly ? "text-foreground font-semibold" : "text-muted-foreground")}>
          Annual billing <span className="text-[#4f772d] dark:text-[#90a955] font-bold bg-[#4f772d]/10 dark:bg-[#90a955]/15 px-2 py-0.5 rounded-full text-xs">Save 20%</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -16 : 0,
                    opacity: 1,
                    scale: plan.isPopular ? 1.04 : 0.98,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 25,
              delay: index * 0.1,
            }}
            className={cn(
              "rounded-2xl border p-7 text-center relative flex flex-col justify-between transition-all duration-300",
              plan.isPopular
                ? "border-[#4f772d] shadow-[0_0_30px_rgba(79,119,45,0.25)] bg-card ring-1 ring-[#4f772d]/50 z-10"
                : "border-border bg-card/60 backdrop-blur-sm hover:border-[#4f772d]/40 z-0",
              !plan.isPopular && "md:mt-4",
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#31572c] to-[#4f772d] text-white py-1 px-4 rounded-full flex items-center shadow-md text-xs font-bold tracking-wider uppercase">
                <Star className="text-[#ecf39e] h-3.5 w-3.5 fill-current mr-1.5" />
                <span>Most Popular</span>
              </div>
            )}

            <div className="flex-1 flex flex-col">
              <p className="text-base font-bold tracking-wider text-muted-foreground uppercase">
                {plan.name}
              </p>

              <div className="mt-6 flex items-center justify-center gap-x-1.5">
                <span className="text-4xl md:text-5xl font-black tracking-tight text-foreground flex items-center">
                  <span className="text-3xl md:text-4xl font-bold mr-1">{currencySymbol}</span>
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    formatter={(value) => value.toLocaleString("en-IN")}
                    transformTiming={{
                      duration: 400,
                      easing: "ease-out",
                    }}
                    willChange
                    className="tabular-nums"
                  />
                </span>
                {plan.period !== "Next 3 months" && (
                  <span className="text-sm font-medium leading-6 tracking-wide text-muted-foreground">
                    /{plan.period}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-muted-foreground font-medium">
                {isMonthly ? "billed monthly" : "billed annually"}
              </p>

              <div className="my-6 border-t border-border/80" />

              <ul className="gap-3 flex flex-col text-sm text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="rounded-full p-0.5 bg-[#4f772d]/15 text-[#4f772d] dark:text-[#90a955] mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-foreground/90 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-border/60">
              <Link
                to={plan.href as any}
                className={cn(
                  buttonVariants({
                    variant: plan.isPopular ? "default" : "outline",
                  }),
                  "w-full rounded-full py-2.5 text-sm font-bold transition-all duration-300 shadow-sm",
                  plan.isPopular
                    ? "bg-gradient-to-r from-[#31572c] to-[#4f772d] hover:from-[#31572c]/90 hover:to-[#4f772d]/90 text-white shadow-[0_4px_16px_rgba(49,87,44,0.35)]"
                    : "hover:bg-[#4f772d]/10 hover:border-[#4f772d]/50 hover:text-foreground",
                )}
              >
                {plan.buttonText}
              </Link>
              <p className="mt-3 text-[11px] leading-4 text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
