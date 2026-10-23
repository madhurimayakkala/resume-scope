import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import { TONE_TEXT } from "@/components/ui/tone";
import { cn } from "@/lib/cn";
import type { StatusTone } from "@/lib/score";

interface StatTileProps {
  label: string;
  value: string | number;
  tone?: StatusTone;
}

export default function StatTile({ label, value, tone }: StatTileProps) {
  return (
    <Card radius="md" padding="md" className="flex flex-col gap-2">
      <Eyebrow>{label}</Eyebrow>
      <p className={cn("font-mono text-h2 font-bold tabular-nums", tone ? TONE_TEXT[tone] : "text-primary")}>
        {value}
      </p>
    </Card>
  );
}
