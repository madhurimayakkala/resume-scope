"use client";

import { motion } from "framer-motion";

import RecommendationCard from "./RecommendationCard";
import SkillChip from "./SkillChip";
import StatTile from "./StatTile";
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

function getScoreTone(score: number): "good" | "warning" | "critical" {
  if (score >= 70) return "good";
  if (score >= 45) return "warning";
  return "critical";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function getVerdict(score: number, criticalCount: number): string {
  if (criticalCount > 0) {
    return "A few critical gaps stand between you and a strong match.";
  }
  if (score >= 80) return "Strong alignment with this role.";
  if (score >= 60) return "Solid foundation, with room to tighten the gaps below.";
  if (score >= 40) return "Partial match. Worth tailoring before applying.";
  return "Limited alignment with this role as written.";
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
  const totalGaps =
    criticalGaps.length + moderateGaps.length + minorGaps.length;

  const criticalSkillSet = new Set(criticalGaps.map((g) => g.skill));
  const moderateSkillSet = new Set(moderateGaps.map((g) => g.skill));
  const frequencyMap: Record<string, number> = {};
  [...criticalGaps, ...moderateGaps, ...minorGaps].forEach((g) => {
    frequencyMap[g.skill] = g.count;
  });

  return (
    <section className="container-width py-20">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <motion.div
          className="mb-8"
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
          <p className="text-secondary mt-3 text-[15px]">
            {getVerdict(score, criticalGaps.length)}
          </p>
        </motion.div>

        {/* STAT ROW */}

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.08 }}
        >
          <div className="col-span-2 md:col-span-1 rounded-[18px] border border-[#4B5563] bg-[#374151] px-6 py-5 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Match Score
            </p>
            <p className={`text-4xl font-semibold tabular-nums ${getScoreColor(score)}`}>
              {score}%
            </p>
          </div>

          <StatTile
            label="Matched Skills"
            value={matchedSkills.length}
            tone="good"
          />

          <StatTile
            label="Critical Gaps"
            value={criticalGaps.length}
            tone={criticalGaps.length > 0 ? "critical" : "neutral"}
          />

          <StatTile
            label="Total Gaps"
            value={totalGaps}
            tone={totalGaps > 0 ? "warning" : "neutral"}
          />
        </motion.div>

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">

          {/* SKILLS */}

          <motion.div
            className="glass-surface rounded-[24px] p-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.16 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-5">
              Skills Detected in This Job Description
            </p>

            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill) => (
                <SkillChip key={skill} label={skill} state="matched" />
              ))}

              {[...criticalGaps].map((gap) => (
                <SkillChip
                  key={gap.skill}
                  label={gap.skill}
                  state="critical"
                  frequency={gap.count}
                />
              ))}

              {[...moderateGaps, ...minorGaps].map((gap) => (
                <SkillChip
                  key={gap.skill}
                  label={gap.skill}
                  state="missing"
                  frequency={gap.count}
                />
              ))}
            </div>

            {matchedSkills.length === 0 && totalGaps === 0 && (
              <p className="text-secondary text-sm">
                No skills detected. Try a more detailed job description.
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
                Matched
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border border-red-400/60" />
                Critical gap
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border border-white/30" />
                Missing
              </span>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <p className="text-xs uppercase tracking-[0.2em] text-muted mb-3">
                Summary
              </p>
              <p className="text-secondary text-[13.5px] leading-[1.8]">
                {summary}
              </p>
            </div>
          </motion.div>

          {/* RECOMMENDATIONS */}

          <div>
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-muted mb-1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.24 }}
            >
              Recommendations
            </motion.p>
            <motion.p
              className="text-sm text-secondary mb-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.26 }}
            >
              Prioritized by impact on your application.
            </motion.p>

            {recommendations.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: 0.3 + index * 0.08,
                    }}
                  >
                    <RecommendationCard
                      title={rec.title}
                      description={rec.description}
                      reason={rec.reason}
                      rank={index + 1}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-[18px] border border-white/10 bg-white/[0.02] p-6 text-center">
                <p className="text-secondary text-sm">
                  No specific recommendations. Your resume looks well aligned with this role.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}