import { useEffect, useState } from "react";

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function Countdown({ startsAt, tone = "light" }: { startsAt: string; tone?: "light" | "dark" }) {
  const target = new Date(startsAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = now === null ? null : target - now;
  const live = remaining !== null && remaining <= 0;
  const t = parts(remaining ?? 0);

  const boxClass =
    tone === "dark"
      ? "rounded-lg border border-brand/50 bg-brand-dark/40 px-4 py-3 text-center"
      : "rounded-lg border border-border bg-card px-4 py-3 text-center card-shadow";
  const valueClass = tone === "dark" ? "display text-3xl text-secondary" : "display text-3xl text-card-foreground";
  const labelClass = tone === "dark" ? "text-xs text-secondary/70" : "text-xs text-muted-foreground";

  if (live) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">
        <span className="size-2 animate-pulse rounded-full bg-brand-foreground" aria-hidden="true" />
        Bidding is live now
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3" role="timer" aria-label="Time until auction starts">
      {[
        { value: t.days, label: "Days" },
        { value: t.hours, label: "Hours" },
        { value: t.minutes, label: "Minutes" },
        { value: t.seconds, label: "Seconds" },
      ].map((item) => (
        <div key={item.label} className={boxClass}>
          <p className={valueClass}>{now === null ? "--" : String(item.value).padStart(2, "0")}</p>
          <p className={labelClass}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}
