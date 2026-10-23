import MatchScoreCard from "@/components/MatchScoreCard";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import { matchSkills } from "@/lib/matcher";
import { SAMPLE_JD, SAMPLE_JD_EXCERPT, SAMPLE_RESUME } from "@/lib/sampleData";
import { calculateMatchScore } from "@/lib/scorer";

/*
  Server component. The numbers and chips below come from running the
  real matching engine on the built-in sample data, so this preview can
  never drift from what the product actually produces.
*/
export default function ResumePreview() {
  const result = matchSkills(SAMPLE_RESUME, SAMPLE_JD);
  const score = calculateMatchScore(result.matchedWeight, result.totalWeight);
  const partial = new Set(result.partialSkills);

  const gapGroups = [
    { label: "Critical gaps", tone: "critical", gaps: result.criticalGaps },
    { label: "Moderate gaps", tone: "partial", gaps: result.moderateGaps },
    { label: "Minor gaps", tone: "missing", gaps: result.minorGaps },
  ] as const;

  return (
    <Section aria-label="Product preview" className="py-12 md:py-16">
      <div className="grid items-stretch gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <Eyebrow>Step 1</Eyebrow>
          <h2 className="mt-4 font-display text-h2 font-bold">Upload your resume</h2>

          <div className="mt-8 rounded-md border-2 border-dashed border-border px-6 py-10 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-background/40 text-h2"
            >
              ↑
            </span>
            <p className="mt-6 font-display text-h3 font-bold">Drop your PDF here</p>
            <p className="mt-2 text-caption text-secondary">or click to browse. PDF only, max 5MB.</p>
          </div>

          <div className="mt-8">
            <Eyebrow>Step 2</Eyebrow>
            <Card radius="md" padding="md" className="mt-4 shadow-none">
              <p className="text-caption text-secondary">{SAMPLE_JD_EXCERPT}</p>
            </Card>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Eyebrow>Results</Eyebrow>
              <h2 className="mt-4 font-display text-h2 font-bold">Your match report</h2>
            </div>
            <Chip label="Sample" />
          </div>

          <div className="mt-8">
            <MatchScoreCard score={score} animateOnMount={false} />
          </div>

          <div className="mt-8">
            <Eyebrow className="mb-4">Matched skills</Eyebrow>
            <ul className="flex flex-wrap gap-2">
              {result.matchedSkills.map((skill) => (
                <li key={skill}>
                  <Chip label={skill} tone={partial.has(skill) ? "partial" : "matched"} />
                </li>
              ))}
            </ul>
          </div>

          {gapGroups
            .filter((group) => group.gaps.length > 0)
            .map((group) => (
              <div key={group.label} className="mt-8">
                <Eyebrow className="mb-4">{group.label}</Eyebrow>
                <ul className="flex flex-wrap gap-2">
                  {group.gaps.map((gap) => (
                    <li key={gap.skill}>
                      <Chip label={gap.skill} tone={group.tone} count={gap.count} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </Card>
      </div>
    </Section>
  );
}
