"use client";

import { motion } from "framer-motion";

/*
  A worked example that mirrors lib/matcher.ts and lib/scorer.ts:
  weight = mentions in the JD (capped at 5), score = matched weight / total weight.
*/
const MAX_WEIGHT = 5;

const EXAMPLE = [
  { skill: "React", mentions: 3, matched: true },
  { skill: "TypeScript", mentions: 2, matched: true },
  { skill: "SQL", mentions: 1, matched: true },
  { skill: "Docker", mentions: 4, matched: false, tier: "Critical gap" },
  { skill: "CI/CD", mentions: 2, matched: false, tier: "Moderate gap" },
];

const matchedWeight = EXAMPLE.filter((r) => r.matched).reduce((a, r) => a + r.mentions, 0);
const totalWeight = EXAMPLE.reduce((a, r) => a + r.mentions, 0);
const exampleScore = Math.round((matchedWeight / totalWeight) * 100);

const STEPS = [
  {
    title: "Find the skills the job asks for",
    body: "Skills are pulled from the job description using a fixed skill list and a synonym table, so “JS” and “JavaScript” count as the same thing.",
  },
  {
    title: "Weigh each skill by how often it appears",
    body: "A skill mentioned four times matters more than one mentioned once. Each skill's weight is its number of mentions, capped at 5 so one repeated word can't take over.",
  },
  {
    title: "Divide what you have by what they want",
    body: "Score = matched weight ÷ total weight × 100. Skills you're missing are ranked by the same weights: 3 or more mentions is critical, 2 is moderate, 1 is minor.",
  },
];

export default function HowScoring() {
  return (
    <section id="how-scoring" className="container-width py-20 md:py-28 scroll-mt-8">
      <div className="max-w-2xl">
        <p className="eyebrow">How scoring works</p>

        <h2 className="text-4xl md:text-5xl font-semibold mt-3">
          Every point of your score can be traced.
        </h2>

        <p className="text-ink-secondary mt-6 leading-[1.8] max-w-xl">
          Resume Scope is rule-based, not AI. There is no model guessing at your
          fit and no hidden weighting. The same resume and job description always
          give the same score, and you can see exactly why.
        </p>
      </div>

      <div className="mt-14 grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-start">
        {/* STEPS */}

        <ol className="flex flex-col gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-line text-sm text-accent tabular-nums">
                {i + 1}
              </span>

              <div>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-ink-secondary mt-2 text-[15px] leading-[1.75]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* WORKED EXAMPLE */}

        <div className="glass-surface rounded-[28px] p-7 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="label-caps">Worked example</p>
            <p className="text-xs text-ink-muted">Bar length = mentions in the job description</p>
          </div>

          <ul className="mt-6 flex flex-col gap-4">
            {EXAMPLE.map((row, i) => (
              <li key={row.skill} className="grid grid-cols-[88px_1fr_132px] items-center gap-4">
                <span className="text-sm text-ink">{row.skill}</span>

                <div className="h-2 rounded-full bg-tint-strong overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      row.matched
                        ? "bg-good"
                        : row.tier === "Critical gap"
                        ? "bg-critical"
                        : "bg-moderate"
                    }`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(row.mentions / MAX_WEIGHT) * 100}%` }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                  />
                </div>

                <span className="text-xs text-ink-secondary tabular-nums text-right">
                  {row.mentions}× · {row.matched ? "Matched" : row.tier}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-line-soft flex flex-wrap items-end justify-between gap-4">
            <p className="text-sm text-ink-secondary leading-[1.8] tabular-nums">
              Matched weight {matchedWeight}
              <span className="text-ink-muted"> ({EXAMPLE.filter((r) => r.matched).map((r) => r.mentions).join(" + ")})</span>
              <br />
              Total weight {totalWeight}
              <span className="text-ink-muted"> ({EXAMPLE.map((r) => r.mentions).join(" + ")})</span>
            </p>

            <p className="text-ink-secondary">
              <span className="text-ink-muted text-sm">{matchedWeight} ÷ {totalWeight} = </span>
              <span className="text-4xl font-semibold text-accent tabular-nums">{exampleScore}%</span>
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-ink-muted mt-10 max-w-2xl leading-[1.8]">
        One limit worth knowing: only skills in the built-in skill list are counted,
        so a niche tool that isn&apos;t on the list won&apos;t show up on either side.
      </p>
    </section>
  );
}
