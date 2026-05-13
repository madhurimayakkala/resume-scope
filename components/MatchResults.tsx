import MatchScoreCard from "./MatchScoreCard";
import RecommendationCard from "./RecommendationCard";
import SkillBadge from "./SkillBadge";

interface MatchResultsProps {
  score: number;

  matchedSkills: string[];

  missingSkills: string[];

  summary: string;
}

export default function MatchResults({
  score,
  matchedSkills,
  missingSkills,
  summary,
}: MatchResultsProps) {
  return (
    <section className="container-width py-20">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}

        <div className="mb-14">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">
            ATS Analysis
          </p>

          <h2 className="text-5xl font-semibold mt-5">
            Resume Match Results
          </h2>
        </div>

        {/* TOP GRID */}

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8">
          {/* SCORE */}

          <div className="glass-surface rounded-[32px] p-8">
            <MatchScoreCard score={score} />

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-secondary leading-[1.8]">
  {score >= 80 &&
    "Your resume strongly aligns with the job description. ATS compatibility appears highly competitive for this role."}

  {score >= 50 &&
    score < 80 &&
    "Your resume shows moderate alignment with the role. Improving keyword coverage and technical depth could strengthen ATS performance."}

  {score >= 20 &&
    score < 50 &&
    "Your resume has limited alignment with the job description. Adding more relevant technologies and role-specific terminology may improve compatibility."}

  {score < 20 &&
    "Your resume currently shows very low alignment with this role. Tailoring your resume specifically to the job description could significantly improve ATS matching."}
</p>
            </div>
          </div>

          {/* SKILLS */}

          <div className="glass-surface rounded-[32px] p-8">
            {/* MATCHED */}

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted mb-5">
                Matched Skills
              </p>

              <div className="flex flex-wrap gap-3">
                {(matchedSkills || []).length > 0 ? (
                  (matchedSkills || []).map(
                    (skill) => (
                      <SkillBadge
                        key={skill}
                        label={skill}
                      />
                    )
                  )
                ) : (
                  <p className="text-secondary">
                    No matched skills detected.
                  </p>
                )}
              </div>
            </div>

            {/* MISSING */}

            <div className="mt-10">
              <p className="text-sm uppercase tracking-[0.2em] text-muted mb-5">
                Missing Skills
              </p>

              <div className="flex flex-wrap gap-3">
                {(missingSkills || []).length > 0 ? (
                  (missingSkills || []).map(
                    (skill) => (
                      <SkillBadge
                        key={skill}
                        label={skill}
                        muted
                      />
                    )
                  )
                ) : (
                  <p className="text-secondary">
                    No major missing skills detected.
                  </p>
                )}
              </div>
            </div>

            {/* SUMMARY */}

            <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-secondary leading-[1.9]">
                {summary}
              </p>
            </div>
          </div>
        </div>

        {/* RECOMMENDATIONS */}

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <RecommendationCard
            title="Improve Keyword Coverage"
            description="Use more role-specific terminology naturally throughout your resume."
          />

          <RecommendationCard
            title="Strengthen Technical Depth"
            description="Add deployment, testing, architecture, or scalability-related technologies."
          />

          <RecommendationCard
            title="Refine Project Descriptions"
            description="Highlight measurable impact and use stronger action-oriented language."
          />
        </div>
      </div>
    </section>
  );
} 