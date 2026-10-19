import MatchScoreCard from "./MatchScoreCard";
import SkillBadge from "./SkillBadge";
import SkillChip from "./SkillChip";

export default function ResumePreview() {
  return (
    <section className="container-width py-12 md:py-20">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch">

        {/* LEFT — INPUT PREVIEW */}

        <div className="glass-surface rounded-[32px] p-8 md:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Step 1</p>

              <h3 className="text-2xl font-semibold mt-2">
                Upload your resume
              </h3>
            </div>

            <div className="h-2.5 w-2.5 rounded-full bg-accent opacity-80" />
          </div>

          <div className="mt-10 border border-dashed border-line rounded-[28px] p-10">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-tint-strong flex items-center justify-center text-2xl">
                ↑
              </div>

              <h4 className="mt-6 text-xl font-medium">
                Drop your PDF here
              </h4>

              <p className="text-ink-secondary mt-3 max-w-sm text-sm leading-[1.8]">
                or click to browse. PDF only, max 5MB.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="eyebrow">Step 2</p>

            <div className="mt-4 rounded-[28px] border border-line-soft bg-tint p-6">
              <p className="text-ink-secondary leading-[1.8] text-[14px]">
                We're looking for a full-stack engineer with experience
                in React, Node.js, PostgreSQL, Docker, and Jest.
                TypeScript preferred. CI/CD experience is a plus.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — RESULTS PREVIEW */}

        <div className="glass-surface rounded-[32px] p-8 md:p-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Results</p>

              <h3 className="text-2xl font-semibold mt-2">
                Your match report
              </h3>
            </div>

            <div className="text-xs text-ink-muted border border-line-soft rounded-full px-3 py-1">
              Sample
            </div>
          </div>

          <div className="mt-10">
            <MatchScoreCard score={62} />
          </div>

          <div className="mt-10">
            <p className="label-caps mb-4">
              Matched skills
            </p>

            <div className="flex flex-wrap gap-2">
              <SkillBadge label="React" />
              <SkillBadge label="Next.js" />
              <SkillBadge label="TypeScript" />
              <SkillBadge label="PostgreSQL" />
              <SkillBadge label="Node.js" />
            </div>
          </div>

          <div className="mt-8">
            <p className="label-caps mb-4">
              Critical gaps
            </p>

            <div className="flex flex-wrap gap-2">
              <SkillChip label="Docker" state="critical" frequency={4} />
              <SkillChip label="Jest" state="critical" frequency={3} />
            </div>
          </div>

          <div className="mt-8">
            <p className="label-caps mb-4">
              Moderate gaps
            </p>

            <div className="flex flex-wrap gap-2">
              <SkillChip label="CI/CD" state="moderate" frequency={2} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}