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
        colors: ["#a1b5d8", "#6c8cc2", "#e4f0d0", "#c2d8b9", "#fffcf7"],
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
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-[#fffcf7]">
          {title}
        </h2>
        <p className="text-[#abb4bd] text-base md:text-lg max-w-2xl mx-auto whitespace-pre-line leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-12">
        <span className={cn("text-sm font-bold transition-colors", isMonthly ? "text-[#fffcf7]" : "text-[#abb4bd]")}>
          Monthly
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <Label className="sr-only">Toggle Annual Billing</Label>
          <Switch
            ref={switchRef}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-[#6c8cc2]"
          />
        </label>
        <span className={cn("text-sm font-bold transition-colors flex items-center gap-1.5", !isMonthly ? "text-[#fffcf7]" : "text-[#abb4bd]")}>
          Annual billing <span className="text-[#a1b5d8] font-black bg-[#162235] border border-[#a1b5d8]/40 px-2.5 py-0.5 rounded-full text-xs">Save 20%</span>
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
              "rounded-3xl border p-7 text-center relative flex flex-col justify-between transition-all duration-300",
              plan.isPopular
                ? "border-[#a1b5d8]/80 shadow-[0_0_35px_rgba(161,181,216,0.25)] bg-[#171a1d]/90 backdrop-blur-xl ring-1 ring-[#a1b5d8]/50 z-10"
                : "border-[#5c6875]/30 bg-[#2e343a]/70 backdrop-blur-xl hover:border-[#a1b5d8]/60 z-0",
              !plan.isPopular && "md:mt-4",
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] text-[#162235] py-1 px-4 rounded-full flex items-center shadow-md text-xs font-black tracking-wider uppercase">
                <Star className="text-[#162235] h-3.5 w-3.5 fill-current mr-1.5" />
                <span>Most Popular</span>
              </div>
            )}

            <div className="flex-1 flex flex-col">
              <p className="text-base font-extrabold tracking-wider text-[#a1b5d8] uppercase">
                {plan.name}
              </p>

              <div className="mt-6 flex items-center justify-center gap-x-1.5">
                <span className="text-4xl md:text-5xl font-black tracking-tight text-[#fffcf7] flex items-center">
                  <span className="text-3xl md:text-4xl font-bold mr-1 text-[#fffcf7]">{currencySymbol}</span>
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
                    className="tabular-nums bg-gradient-to-r from-[#fffcf7] via-[#ecf0f7] to-[#a1b5d8] bg-clip-text text-transparent"
                  />
                </span>
                {plan.period !== "Next 3 months" && (
                  <span className="text-sm font-semibold leading-6 tracking-wide text-[#abb4bd]">
                    /{plan.period}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-[#abb4bd] font-medium">
                {isMonthly ? "billed monthly" : "billed annually"}
              </p>

              <div className="my-6 border-t border-[#5c6875]/30" />

              <ul className="gap-3 flex flex-col text-sm text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="rounded-full p-0.5 bg-[#162235] border border-[#a1b5d8]/30 text-[#e4f0d0] mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-[#ecf0f7] font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#5c6875]/30">
              <Link
                to={plan.href as any}
                className={cn(
                  buttonVariants({
                    variant: plan.isPopular ? "default" : "outline",
                  }),
                  "w-full rounded-full py-2.5 text-sm font-black transition-all duration-300 shadow-sm",
                  plan.isPopular
                    ? "bg-gradient-to-r from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] hover:from-[#a1b5d8] hover:to-[#c2d8b9] text-[#162235] shadow-[0_0_20px_rgba(161,181,216,0.4)]"
                    : "border border-[#5c6875]/50 bg-[#171a1d]/80 text-[#abb4bd] hover:text-[#fffcf7] hover:bg-[#2e343a] hover:border-[#a1b5d8]/60",
                )}
              >
                {plan.buttonText}
              </Link>
              <p className="mt-3 text-[11px] leading-4 text-[#abb4bd]">
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
