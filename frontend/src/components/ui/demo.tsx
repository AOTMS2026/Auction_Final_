import { RobotHero } from "@/components/ui/robot-hero";

const settings = {
  backgroundText: "AUCTION",
  subtitle: "Live cricket auction platform for real-time player bidding",
  color: "#e2e7d1",
  scale: 1,
  pantallaColor: "#dda15e",
  pantallaBrillo: 1.3,
  blinkCycle: 3.0,
  metalness: 0.0,
};

export function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div className="w-full min-h-[550px] overflow-hidden">
      <RobotHero {...s} />
    </div>
  );
}

export default Demo;
