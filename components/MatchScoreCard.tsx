interface MatchScoreCardProps {
  score: number;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Strong match";
  if (score >= 60) return "Moderate match";
  if (score >= 40) return "Partial match";
  return "Low match";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export default function MatchScoreCard({ score }: MatchScoreCardProps) {
  return (
    <div className="rounded-[20px] border border-[#4B5563] bg-[#374151] p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-muted mb-6">
        Match Score
      </p>

      <div className="flex items-end gap-2">
        <h2 className={`text-7xl font-semibold tracking-tight ${getScoreColor(score)}`}>
          {score}
        </h2>
        <span className="text-2xl text-secondary mb-3">%</span>
      </div>

      <p className="mt-4 text-secondary text-sm">
        {getScoreLabel(score)}
      </p>
    </div>
  );
}