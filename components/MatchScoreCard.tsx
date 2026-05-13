interface MatchScoreCardProps {
  score: number;
}

export default function MatchScoreCard({
  score,
}: MatchScoreCardProps) {
  return (
    <div className="rounded-[20px] border border-[#4B5563] bg-[#374151] p-8 transition-all duration-300 hover:-translate-y-[2px]">
      <div className="flex items-end gap-3">
        <h2 className="text-6xl font-semibold tracking-tight">
          {score}
        </h2>

        <span className="text-xl text-secondary mb-2">
          %
        </span>
      </div>
<p className="mt-4 text-secondary">
  {score >= 80 &&
    "Strong ATS compatibility detected."}

  {score >= 50 &&
    score < 80 &&
    "Moderate ATS compatibility detected."}

  {score >= 20 &&
    score < 50 &&
    "Low ATS compatibility detected."}

  {score < 20 &&
    "Very weak ATS compatibility detected."}
</p>
    </div>
  );
}