"use client";

import { motion } from "framer-motion";

import MatchScoreCard from "./MatchScoreCard";
import RecommendationCard from "./RecommendationCard";
import SkillBadge from "./SkillBadge";
import { Recommendation } from "@/types";

interface GapSkill {
  skill: string;
  count: number;
}

interface MatchResultsProps {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  criticalGaps: GapSkill[];
  moderateGaps: GapSkill[];
  minorGaps: GapSkill[];
  summary: string;
  recommendations: Recommendation[];
}

function ScoreContext({ score }: { score: number }) {
  if (score >= 80) {
    return (
      <p className="text-secondary leading-[1.8] text-[14px]">
        Your resume aligns well with this role. Focus on measurable
        impact and tailoring your narrative to stand out to reviewers.
      </p>
    );
  }

  if (score >= 60) {
    return (
      <p className="text-secondary leading-[1.8] text-[14px]">
        Solid foundation with room to improve. Addressing the gaps
        below could meaningfully increase your match score.
      </p>
    );
  }

  if (score >= 40) {
    return (
      <p className="text-secondary leading-[1.8] text-[14px]">
        Your resume partially matches this role. Review the critical
        gaps and consider tailoring your resume more specifically to
        this job description.
      </p>
    );
  }

  return (
    <p className="text-secondary leading-[1.8] text-[14px]">
      Low alignment with this role. If this is a target role,
      significant tailoring is recommended before applying.
    </p>
  );
}

export default function MatchResults({
  score,
  matchedSkills,
  missingSkills,
  criticalGaps,
  moderateGaps,
  minorGaps,
  summary,
  recommendations,
}: MatchResultsProps) {
  return (
    <section className="container-width py-20">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="text-sm uppercase tracking-[0.24em] text-muted">
            Analysis Results
          </p>

          <h2 className="text-4xl font-semibold mt-4">
            Resume Match Report
          </h2>
        </motion.div>

        {/* SCORE + CONTEXT ROW */}

        <motion.div
          className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        >
          {/* SCORE */}

          <div className="glass-surface rounded-[28px] p-7 flex flex-col gap-6">
            <MatchScoreCard score={score} />

            <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-5">
              <ScoreContext score={score} />
            </div>
          </div>

          {/* SKILLS BREAKDOWN */}

          <div className="glass-surface rounded-[28px] p-7 flex flex-col gap-8">

            {/* MATCHED */}

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
                Matched Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {matchedSkills.length > 0 ? (
                  matchedSkills.map((skill) => (
                    <SkillBadge key={skill} label={skill} />
                  ))
                ) : (
                  <p className="text-secondary text-sm">
                    No matched skills detected.
                  </p>
                )}
              </div>
            </div>

            {/* CRITICAL GAPS */}

            {criticalGaps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-red-400">
                    Critical Gaps
                  </p>
                  <span className="text-xs text-muted">
                    — appears 3+ times in the job description
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {criticalGaps.map((gap) => (
                    <SkillBadge
                      key={gap.skill}
                      label={`${gap.skill} · ${gap.count}×`}
                      muted
                    />
                  ))}
                </div>
              </div>
            )}

            {/* MODERATE GAPS */}

            {moderateGaps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-yellow-400">
                    Moderate Gaps
                  </p>
                  <span className="text-xs text-muted">
                    — mentioned more than once
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {moderateGaps.map((gap) => (
                    <SkillBadge
                      key={gap.skill}
                      label={`${gap.skill} · ${gap.count}×`}
                      muted
                    />
                  ))}
                </div>
              </div>
            )}

            {/* MINOR GAPS */}

            {minorGaps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-400">
                    Nice to Have
                  </p>
                  <span className="text-xs text-muted">
                    — mentioned once
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {minorGaps.map((gap) => (
                    <SkillBadge
                      key={gap.skill}
                      label={gap.skill}
                      muted
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>

        {/* SUMMARY */}

        <motion.div
          className="glass-surface rounded-[28px] p-7 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
            Full Breakdown
          </p>

          <pre className="text-secondary text-[13px] leading-[1.9] whitespace-pre-wrap font-sans">
            {summary}
          </pre>
        </motion.div>

        {/* RECOMMENDATIONS */}

        {recommendations && recommendations.length > 0 && (
          <div>
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.28 }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted mb-1">
                Recommendations
              </p>
              <p className="text-sm text-secondary">
                Prioritized by impact on your application.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: 0.35 + index * 0.08,
                  }}
                >
                  <RecommendationCard
                    title={rec.title}
                    description={rec.description}
                    reason={rec.reason}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}