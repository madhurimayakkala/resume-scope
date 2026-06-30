"use client";

import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
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

/*
  Animation timing constants.
  Each section's delay builds on the previous one so the page
  reveals top to bottom in a single continuous rhythm.
*/
const HEADER_DELAY = 0;
const STAT_ROW_DELAY = 0.1;
const STAT_STAGGER = 0.09;
const SKILLS_CARD_DELAY = 0.4;
const CHIP_STAGGER = 0.025;
const REC_HEADER_DELAY = 0.45;
const REC_STAGGER_START = 0.55;
const REC_STAGGER = 0.1;
const SUMMARY_DELAY_AFTER_RECS = 0.25;

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

  const statTiles = [
    { label: "Match Score", value: `${score}%`, isScore: true },
    { label: "Matched Skills", value: matchedSkills.length, tone: "good" as const },
    {
      label: "Critical Gaps",
      value: criticalGaps.length,
      tone: criticalGaps.length > 0 ? ("critical" as const) : ("neutral" as const),
    },
    {
      label: "Total Gaps",
      value: totalGaps,
      tone: totalGaps > 0 ? ("warning" as const) : ("neutral" as const),
    },
  ];

  const allChips = [
    ...matchedSkills.map((skill) => ({
      skill,
      state: "matched" as const,
      frequency: undefined,
    })),
    ...criticalGaps.map((gap) => ({
      skill: gap.skill,
      state: "critical" as const,
      frequency: gap.count,
    })),
    ...[...moderateGaps, ...minorGaps].map((gap) => ({
      skill: gap.skill,
      state: "missing" as const,
      frequency: gap.count,
    })),
  ];

  const recsAnimationEnd =
    REC_STAGGER_START + recommendations.length * REC_STAGGER;

  return (
    <section className="container-width py-20">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: HEADER_DELAY }}
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statTiles.map((tile, index) =>
            tile.isScore ? (
              <motion.div
                key={tile.label}
                className="col-span-2 md:col-span-1 rounded-[18px] border border-[#4B5563] bg-[#374151] px-6 py-5 flex flex-col gap-2 cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: STAT_ROW_DELAY + index * STAT_STAGGER,
                }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {tile.label}
                </p>
                <ScoreCounter score={score} colorClass={getScoreColor(score)} />
              </motion.div>
            ) : (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: STAT_ROW_DELAY + index * STAT_STAGGER,
                }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="cursor-default"
              >
                <StatTile label={tile.label} value={tile.value} tone={tile.tone} />
              </motion.div>
            )
          )}
        </div>

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">

          {/* SKILLS */}

          <motion.div
            className="glass-surface rounded-[24px] p-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: SKILLS_CARD_DELAY }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted mb-5">
              Skills Detected in This Job Description
            </p>

            <div className="flex flex-wrap gap-2">
              {allChips.map((chip, index) => (
                <motion.div
                  key={chip.skill}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: SKILLS_CARD_DELAY + 0.15 + index * CHIP_STAGGER,
                  }}
                >
                  <SkillChip
                    label={chip.skill}
                    state={chip.state}
                    frequency={chip.frequency}
                  />
                </motion.div>
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

            <motion.div
              className="mt-8 pt-6 border-t border-white/[0.06]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: Math.max(recsAnimationEnd, SKILLS_CARD_DELAY + 0.4) + SUMMARY_DELAY_AFTER_RECS,
              }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted mb-3">
                Summary
              </p>
              <p className="text-secondary text-[13.5px] leading-[1.8]">
                {summary}
              </p>
            </motion.div>
          </motion.div>

          {/* RECOMMENDATIONS */}

          <div>
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-muted mb-1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: REC_HEADER_DELAY }}
            >
              Recommendations
            </motion.p>
            <motion.p
              className="text-sm text-secondary mb-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: REC_HEADER_DELAY + 0.05 }}
            >
              Prioritized by impact on your application.
            </motion.p>

            {recommendations.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                      delay: REC_STAGGER_START + index * REC_STAGGER,
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
              <motion.div
                className="rounded-[18px] border border-white/10 bg-white/[0.02] p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: REC_STAGGER_START }}
              >
                <p className="text-secondary text-sm">
                  No specific recommendations. Your resume looks well aligned with this role.
                </p>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

/*
  Counts up from 0 to the final score on mount.
  Lives inline here since it's only used in this one stat tile.
*/
function ScoreCounter({
  score,
  colorClass,
}: {
  score: number;
  colorClass: string;
}) {
  return (
    <motion.p
      className={`text-4xl font-semibold tabular-nums ${colorClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatedNumber target={score} />%
    </motion.p>
  );
}