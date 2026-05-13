import MatchScoreCard from "./MatchScoreCard";
import SkillBadge from "./SkillBadge";

export default function ResumePreview() {
  return (
    <section className="container-width py-12 md:py-20">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch">
        {/* LEFT */}

        <div className="glass-surface rounded-[32px] p-8 md:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">
                Resume Upload
              </p>

              <h3 className="text-2xl font-semibold mt-3">
                Resume Analysis
              </h3>
            </div>

            <div className="h-3 w-3 rounded-full bg-[#F0E7D5]/70" />
          </div>

          <div className="mt-10 border border-dashed border-white/10 rounded-[28px] p-10">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center text-2xl">
                ↑
              </div>

              <h4 className="mt-6 text-xl font-medium">
                Upload Resume
              </h4>

              <p className="text-secondary mt-3 max-w-sm">
                Drag and drop your PDF resume to begin
                ATS analysis.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <label className="text-sm uppercase tracking-[0.2em] text-muted">
              Job Description
            </label>

            <div className="mt-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-secondary leading-[1.8] text-[15px]">
                Looking for a frontend developer skilled in
                React, Next.js, TypeScript, APIs,
                Tailwind CSS, and UI architecture...
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="glass-surface rounded-[32px] p-8 md:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">
                ATS Insights
              </p>

              <h3 className="text-2xl font-semibold mt-3">
                Match Results
              </h3>
            </div>

            <div className="text-sm text-secondary">
              Live Analysis
            </div>
          </div>

          <div className="mt-10">
            <MatchScoreCard score={84} />
          </div>

          <div className="mt-10">
            <p className="text-sm uppercase tracking-[0.2em] text-muted mb-5">
              Matched Skills
            </p>

            <div className="flex flex-wrap gap-3">
              <SkillBadge label="React" />
              <SkillBadge label="Next.js" />
              <SkillBadge label="TypeScript" />
              <SkillBadge label="Tailwind CSS" />
            </div>
          </div>

          <div className="mt-10">
            <p className="text-sm uppercase tracking-[0.2em] text-muted mb-5">
              Missing Skills
            </p>

            <div className="flex flex-wrap gap-3">
              <SkillBadge label="Docker" muted />
              <SkillBadge label="Testing" muted />
              <SkillBadge label="GraphQL" muted />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}