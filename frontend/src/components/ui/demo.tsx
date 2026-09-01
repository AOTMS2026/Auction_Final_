import { RobotHero } from "@/components/ui/robot-hero";

const settings = {
  backgroundText: "AUCTION",
  subtitle: "Live cricket auction platform for real-time player bidding",
  color: "#c7cdd3",
  scale: 1,
  pantallaColor: "#a1b5d8",
  pantallaBrillo: 1.6,
  blinkCycle: 3.0,
  metalness: 0.3,
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
