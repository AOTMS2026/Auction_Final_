export function SectionHeading({
  lead,
  highlight,
  subtitle,
  tone = "dark",
}: {
  lead: string;
  highlight: string;
  subtitle?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      <div className="mx-auto mb-3 h-8 w-8 rotate-45 rounded-sm bg-brand" aria-hidden="true" />
      <h2 className={tone === "light" ? "section-title text-secondary" : "section-title text-foreground"}>
        <span className="text-brand">{lead}</span> {highlight}
      </h2>
      {subtitle && (
        <p className={tone === "light" ? "mt-2 text-sm text-secondary/70" : "mt-2 text-sm text-muted-foreground"}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
