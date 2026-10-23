"use client";

import { forwardRef } from "react";

import MatchScoreCard from "@/components/MatchScoreCard";
import RecommendationCard from "@/components/RecommendationCard";
import StatTile from "@/components/StatTile";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip, { type ChipTone } from "@/components/ui/Chip";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { TONE_DOT } from "@/components/ui/tone";
import { cn } from "@/lib/cn";
import { getVerdict } from "@/lib/score";
import type { AnalyzeResponse } from "@/lib/schemas";

interface MatchResultsProps {
  result: AnalyzeResponse;
  onCopy: () => void;
  onDownload: () => void;
  /** Short status text announced after copy/download. */
  actionStatus: string;
}

interface ChipItem {
  skill: string;
  tone: ChipTone;
  count?: number;
  title?: string;
}

const PARTIAL_HINT =
  "Listed in a skills section only. Show it in a project or experience entry for full credit.";

const MatchResults = forwardRef<HTMLElement, MatchResultsProps>(function MatchResults(
  { result, onCopy, onDownload, actionStatus },
  ref
) {
  const {
    matchScore,
    matchedSkills,
    partialSkills,
    criticalGaps,
    moderateGaps,
    minorGaps,
    recommendations,
    summary,
  } = result;

  const totalGaps = criticalGaps.length + moderateGaps.length + minorGaps.length;
  const partial = new Set(partialSkills);

  const chips: ChipItem[] = [
    ...matchedSkills.map((skill): ChipItem =>
      partial.has(skill)
        ? { skill, tone: "partial", title: PARTIAL_HINT }
        : { skill, tone: "matched" }
    ),
    ...criticalGaps.map((g): ChipItem => ({ skill: g.skill, tone: "critical", count: g.count })),
    ...[...moderateGaps, ...minorGaps].map(
      (g): ChipItem => ({
        skill: g.skill,
        tone: "missing",
        count: g.count,
        title: g.niceToHave ? "Nice to have" : undefined,
      })
    ),
  ];

  return (
    <section
      ref={ref}
      aria-labelledby="results-heading"
      className="container-width scroll-mt-8 py-16 md:py-24"
    >
      <Reveal className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Analysis results"
          title="Resume match report"
          description={getVerdict(matchScore, criticalGaps.length)}
          id="results-heading"
          focusable
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" onClick={onCopy}>
            Copy summary
          </Button>
          <Button variant="secondary" size="sm" onClick={onDownload}>
            Download JSON
          </Button>
          <span role="status" aria-live="polite" className="text-caption text-muted">
            {actionStatus}
          </span>
        </div>
      </Reveal>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Reveal delay={0.1} className="col-span-2 md:col-span-1">
          <MatchScoreCard score={matchScore} />
        </Reveal>
        <Reveal delay={0.19}>
          <StatTile label="Matched skills" value={matchedSkills.length} tone="matched" />
        </Reveal>
        <Reveal delay={0.28}>
          <StatTile
            label="Critical gaps"
            value={criticalGaps.length}
            tone={criticalGaps.length > 0 ? "critical" : undefined}
          />
        </Reveal>
        <Reveal delay={0.37}>
          <StatTile
            label="Total gaps"
            value={totalGaps}
            tone={totalGaps > 0 ? "partial" : undefined}
          />
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal delay={0.4} className="lg:col-span-3">
          <Card radius="lg" padding="md" className="h-full md:p-8">
            <Eyebrow>Skills detected in this job description</Eyebrow>

            {chips.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li key={chip.skill}>
                    <Chip label={chip.skill} tone={chip.tone} count={chip.count} title={chip.title} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-caption text-secondary">
                No skills detected. Try a more detailed job description.
              </p>
            )}

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-caption text-muted">
              <LegendItem dot={TONE_DOT.matched} label="Matched" />
              <LegendItem dot={TONE_DOT.partial} label="Listed only (partial credit)" />
              <LegendItem dot={TONE_DOT.critical} label="Critical gap" />
              <LegendItem ring label="Missing" />
            </ul>

            <div className="mt-8 border-t border-border pt-6">
              <Eyebrow>Summary</Eyebrow>
              <p className="mt-3 whitespace-pre-line text-caption text-secondary">{summary}</p>
            </div>
          </Card>
        </Reveal>

        <div className="lg:col-span-2">
          <Reveal delay={0.45}>
            <Eyebrow>Recommendations</Eyebrow>
            <p className="mb-5 mt-1 text-caption text-secondary">
              Prioritized by impact on your application.
            </p>
          </Reveal>

          {recommendations.length > 0 ? (
            <ol className="flex flex-col gap-3">
              {recommendations.map((rec, index) => (
                <li key={rec.title}>
                  <Reveal delay={0.55 + index * 0.1}>
                    <RecommendationCard
                      title={rec.title}
                      description={rec.description}
                      reason={rec.reason}
                      rank={index + 1}
                    />
                  </Reveal>
                </li>
              ))}
            </ol>
          ) : (
            <Reveal delay={0.55}>
              <Card radius="md" padding="md" className="text-center">
                <p className="text-caption text-secondary">
                  No specific recommendations. Your resume looks well aligned with this role.
                </p>
              </Card>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
});

export default MatchResults;

function LegendItem({ dot, ring, label }: { dot?: string; ring?: boolean; label: string }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className={cn("h-2 w-2 rounded-full", ring ? "border border-secondary" : dot)}
      />
      {label}
    </li>
  );
}
