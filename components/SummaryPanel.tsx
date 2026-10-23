"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SkillChip, { SkillChipState } from "./SkillChip";

interface GapSkill {
  skill: string;
  count: number;
}

interface SummaryPanelProps {
  score: number;
  matchedSkills: string[];
  criticalGaps: GapSkill[];
  moderateGaps: GapSkill[];
  minorGaps: GapSkill[];
  /* Plain-text version of the summary, used by the copy button */
  summaryText: string;
  delay?: number;
}

interface Group {
  key: SkillChipState;
  label: string;
  hint: string;
  barClass: string;
  dotClass: string;
  empty: string;
  items: { skill: string; frequency?: number }[];
}

export default function SummaryPanel({
  score,
  matchedSkills,
  criticalGaps,
  moderateGaps,
  minorGaps,
  summaryText,
  delay = 0,
}: SummaryPanelProps) {
  const [copied, setCopied] = useState(false);

  const groups: Group[] = [
    {
      key: "matched",
      label: "Matched",
      hint: "In your resume and the job",
      barClass: "bg-good",
      dotClass: "bg-good",
      empty: "No matching skills found yet.",
      items: matchedSkills.map((skill) => ({ skill })),
    },
    {
      key: "critical",
      label: "Critical gaps",
      hint: "Mentioned 3+ times in the job",
      barClass: "bg-critical",
      dotClass: "border-2 border-critical",
      empty: "None. Nothing the job leans on heavily is missing.",
      items: criticalGaps.map((g) => ({ skill: g.skill, frequency: g.count })),
    },
    {
      key: "moderate",
      label: "Moderate gaps",
      hint: "Mentioned twice",
      barClass: "bg-moderate",
      dotClass: "border border-moderate",
      empty: "None.",
      items: moderateGaps.map((g) => ({ skill: g.skill, frequency: g.count })),
    },
    {
      key: "minor",
      label: "Minor gaps",
      hint: "Mentioned once",
      barClass: "bg-minor",
      dotClass: "border border-dashed border-minor",
      empty: "None.",
      items: minorGaps.map((g) => ({ skill: g.skill, frequency: g.count })),
    },
  ];

  const total = groups.reduce((sum, g) => sum + g.items.length, 0);
  const matched = matchedSkills.length;

  const subline =
    total === 0
      ? ""
      : `${matched} of ${total} detected skills matched, ${
          criticalGaps.length === 0
            ? "and none are critical gaps."
            : `with ${criticalGaps.length} critical gap${criticalGaps.length > 1 ? "s" : ""} to close.`
        }`;

  // What to work on first: the highest-priority tier that has anything in it
  const focus =
    criticalGaps.length > 0
      ? { skills: criticalGaps, why: "The job mentions these 3 or more times, so it leans on them." }
      : moderateGaps.length > 0
      ? { skills: moderateGaps, why: "Each comes up twice in the job description." }
      : minorGaps.length > 0
      ? { skills: minorGaps, why: "Each is mentioned once, so none are urgent." }
      : null;

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <motion.div
      className="glass-surface rounded-[24px] p-7 md:p-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between gap-4">
        <p className="label-caps">Summary</p>

        <button
          type="button"
          onClick={copySummary}
          className="text-sm text-ink-secondary hover:text-ink border border-line-soft hover:border-accent-line rounded-full px-3.5 py-1.5 transition-colors"
        >
          {copied ? "Copied" : "Copy summary"}
        </button>
      </div>

      {total === 0 ? (
        <p className="text-ink-secondary mt-6">
          No skills detected. Try a more detailed job description.
        </p>
      ) : (
        <>
          <h3 className="text-2xl md:text-3xl font-semibold leading-snug mt-5 max-w-xl">
            Your resume covers <span className="text-accent tabular-nums">{score}%</span> of what
            this job asks for.
          </h3>

          <p className="text-ink-secondary mt-2">{subline}</p>

          {/* SEGMENTED BAR */}

          <div className="mt-6">
            <div
              className="flex h-2.5 w-full gap-[3px] overflow-hidden rounded-full"
              role="img"
              aria-label={groups.map((g) => `${g.items.length} ${g.label.toLowerCase()}`).join(", ")}
            >
              {groups
                .filter((g) => g.items.length > 0)
                .map((g, i) => (
                  <motion.div
                    key={g.key}
                    className={`h-full ${g.barClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(g.items.length / total) * 100}%` }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: delay + 0.2 + i * 0.08 }}
                  />
                ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-secondary">
              {groups.map((g) => (
                <span key={g.key} className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${g.dotClass}`} />
                  <span className="tabular-nums text-ink font-medium">{g.items.length}</span>
                  {g.label.toLowerCase()}
                </span>
              ))}
            </div>
          </div>

          {/* FOCUS FIRST */}

          <div className="mt-7 rounded-[16px] border border-accent-line bg-accent-soft px-5 py-4">
            {focus ? (
              <>
                <p className="text-sm text-accent font-medium">Focus first</p>
                <p className="mt-1.5 text-ink leading-[1.6]">
                  {focus.skills
                    .slice(0, 4)
                    .map((g) => g.skill)
                    .join(", ")}
                  {focus.skills.length > 4 ? ` and ${focus.skills.length - 4} more` : ""}
                </p>
                <p className="mt-1 text-sm text-ink-secondary">{focus.why}</p>
              </>
            ) : (
              <>
                <p className="text-sm text-accent font-medium">No gaps found</p>
                <p className="mt-1.5 text-ink-secondary text-sm">
                  Your resume covers every skill detected in this job description.
                </p>
              </>
            )}
          </div>

          {/* GROUPED BREAKDOWN */}

          <div className="mt-8 flex flex-col">
            {groups.map((g, gi) => (
              <div
                key={g.key}
                className="grid md:grid-cols-[170px_1fr] gap-x-6 gap-y-3 py-5 border-t border-line-soft"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {g.label}{" "}
                    <span className="text-ink-muted tabular-nums font-normal">{g.items.length}</span>
                  </p>
                  <p className="text-xs text-ink-muted mt-1">{g.hint}</p>
                </div>

                {g.items.length === 0 ? (
                  <p className="text-sm text-ink-muted self-center">
                    {g.key === "critical" && <span className="text-good mr-1.5">✓</span>}
                    {g.empty}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((item, i) => (
                      <motion.div
                        key={item.skill}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                          delay: delay + 0.3 + gi * 0.08 + i * 0.02,
                        }}
                      >
                        <SkillChip label={item.skill} state={g.key} frequency={item.frequency} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
