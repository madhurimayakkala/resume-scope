"use client";

import { useEffect, useState } from "react";

interface MatchScoreCardProps {
  score: number;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Strong match";
  if (score >= 60) return "Moderate match";
  if (score >= 40) return "Partial match";
  return "Low match";
}

export default function MatchScoreCard({ score }: MatchScoreCardProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    setDisplayed(0);

    const duration = 1200;
    const steps = 60;
    const increment = score / steps;
    const interval = duration / steps;

    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      current += increment;

      if (step >= steps) {
        setDisplayed(score);
        clearInterval(timer);
      } else {
        setDisplayed(Math.round(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="rounded-[20px] border border-line bg-surface-raised p-8">
      <p className="text-sm text-ink-muted mb-6">
        Match Score
      </p>

      <div className="flex items-end gap-2">
        <h2
          className={`text-7xl font-semibold tracking-tight tabular-nums text-accent`}
        >
          {displayed}
        </h2>
        <span className="text-2xl text-ink-secondary mb-3">%</span>
      </div>

      <p className="mt-4 text-ink-secondary text-sm">
        {getScoreLabel(score)}
      </p>
    </div>
  );
}