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
      <div
        className="mx-auto mb-3.5 size-7 rotate-45 rounded-md bg-gradient-to-tr from-[#6c8cc2] via-[#a1b5d8] to-[#c2d8b9] shadow-[0_0_20px_rgba(161,181,216,0.5)] border border-[#fffcf7]/30"
        aria-hidden="true"
      />
      <h2 className="section-title text-[#fffcf7] font-black tracking-tight drop-shadow-sm">
        <span className="text-[#a1b5d8]">{lead}</span>{" "}
        <span className="bg-gradient-to-r from-[#fffcf7] via-[#ecf0f7] to-[#a1b5d8] bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>
      {subtitle && (
        <p
          className={
            tone === "light"
              ? "mt-2.5 text-sm md:text-base text-[#dae2ef]/90 font-medium max-w-xl mx-auto leading-relaxed"
              : "mt-2.5 text-sm md:text-base text-[#abb4bd] font-medium max-w-xl mx-auto leading-relaxed"
          }
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
