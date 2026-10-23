import AnimatedNumber from "@/components/AnimatedNumber";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import { TONE_TEXT } from "@/components/ui/tone";
import { cn } from "@/lib/cn";
import { getScoreBand } from "@/lib/score";

interface MatchScoreCardProps {
  score: number;
  /** Count up from 0 on mount. Off for server-rendered previews. */
  animateOnMount?: boolean;
}

export default function MatchScoreCard({ score, animateOnMount = true }: MatchScoreCardProps) {
  const band = getScoreBand(score);

  return (
    <Card radius="md" padding="md" className="h-full">
      <Eyebrow>Match score</Eyebrow>

      <p className={cn("mt-4 flex items-end gap-1 font-mono tabular-nums", TONE_TEXT[band.tone])}>
        <span aria-hidden="true" className="text-h1 font-bold md:text-display">
          <AnimatedNumber target={score} animateOnMount={animateOnMount} />
        </span>
        <span className="sr-only">{score}</span>
        <span className="mb-2 text-h3 text-secondary">%</span>
      </p>

      <p className="mt-3 text-caption text-secondary">{band.label}</p>
      <p className="mt-1 text-caption text-muted">Weighted skill coverage</p>
    </Card>
  );
}
