import Card from "@/components/ui/Card";
import { TONE_DOT } from "@/components/ui/tone";
import { cn } from "@/lib/cn";
import type { StatusTone } from "@/lib/score";

interface RecommendationCardProps {
  title: string;
  description: string;
  reason?: string;
  /** 1-based position in the prioritized list. */
  rank: number;
}

const RANK_TONE: Record<number, StatusTone> = {
  1: "critical",
  2: "partial",
  3: "matched",
};

export default function RecommendationCard({ title, description, reason, rank }: RecommendationCardProps) {
  const tone = RANK_TONE[rank] ?? "matched";
  return (
    <Card
      radius="md"
      padding="md"
      className="flex flex-col gap-3 transition duration-200 ease-smooth hover:bg-surface-hover"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={cn("mt-2.5 h-2 w-2 shrink-0 rounded-full", TONE_DOT[tone])}
        />
        <h3 className="font-display text-h3 font-bold">
          <span className="sr-only">Priority {rank}: </span>
          {title}
        </h3>
      </div>

      <p className="pl-5 text-caption text-secondary">{description}</p>

      {reason && (
        <p className="border-t border-border pl-5 pt-3 text-caption text-muted">{reason}</p>
      )}
    </Card>
  );
}
