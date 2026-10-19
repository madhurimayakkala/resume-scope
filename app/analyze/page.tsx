"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import JDInput from "@/components/JDInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import MatchResults from "@/components/MatchResults";
import ResumeUpload from "@/components/ResumeUpload";
import SampleDataButton from "@/components/SampleDataButton";
import { SAMPLE_JD, SAMPLE_RESUME } from "@/lib/sampleData";
import { AnalysisResult, GapSkill, Recommendation } from "@/types";

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingSample, setUsingSample] = useState(false);

  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      handleLoadSample();
    }
  }, []);

  function handleLoadSample() {
    setResumeFile(null);
    setResumeText(SAMPLE_RESUME);
    setJobDescription(SAMPLE_JD);
    setResult(null);
    setError(null);
    setUsingSample(true);
  }

  function handleResumeFile(file: File | null) {
    setResumeFile(file);
    setResumeText(null);
    setUsingSample(false);
  }

  async function handleAnalyze() {
    setError(null);

    if (!resumeFile && !resumeText) {
      setError("Please upload a PDF resume before analyzing.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste a job description before analyzing.");
      return;
    }

    if (jobDescription.trim().split(/\s+/).length < 20) {
      setError(
        "The job description looks too short. Paste the full role details for accurate results."
      );
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      let parsedResumeText = resumeText;

      if (!parsedResumeText && resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);

        const parseResponse = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        if (!parseResponse.ok) {
          const data = await parseResponse.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to parse resume.");
        }

        const parsedData = await parseResponse.json();

        if (!parsedData.text || parsedData.text.trim().length < 50) {
          throw new Error(
            "Could not extract text from this PDF. Try re-saving it as a standard PDF."
          );
        }

        parsedResumeText = parsedData.text;
      }

      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: parsedResumeText,
          jobDescription,
        }),
      });

      if (!analyzeResponse.ok) {
        const data = await analyzeResponse.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to analyze resume.");
      }

      const analysis = await analyzeResponse.json();

      setResult({
        matchScore:
          typeof analysis.matchScore === "number"
            ? analysis.matchScore
            : 0,
        matchedSkills: Array.isArray(analysis.matchedSkills)
          ? analysis.matchedSkills
          : [],
        missingSkills: Array.isArray(analysis.missingSkills)
          ? analysis.missingSkills
          : [],
        criticalGaps: Array.isArray(analysis.criticalGaps)
          ? analysis.criticalGaps
          : [],
        moderateGaps: Array.isArray(analysis.moderateGaps)
          ? analysis.moderateGaps
          : [],
        minorGaps: Array.isArray(analysis.minorGaps)
          ? analysis.minorGaps
          : [],
        summary: analysis.summary ?? "Analysis completed.",
        recommendations: Array.isArray(analysis.recommendations)
          ? analysis.recommendations
          : [],
      });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>

      {/* NAVBAR */}

      <nav className="container-width py-6 flex items-center justify-between">
        <p className="text-base font-medium text-ink">Resume Scope</p>

        <button
          className="secondary-button text-sm"
          onClick={() => router.push("/")}
        >
          Back Home
        </button>
      </nav>

      {/* HEADER */}

      <section className="container-width pt-4 md:pt-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl leading-[1.05] font-semibold fade-up">
              See how well your resume fits the role.
            </h1>

            <p className="text-ink-secondary leading-[1.7] mt-4 max-w-xl fade-up fade-delay-1">
              Upload a PDF and paste a job description to see your matched
              skills, gaps and what to fix first.
            </p>
          </div>

          <div className="fade-up fade-delay-2 shrink-0">
            <SampleDataButton onLoad={handleLoadSample} />
          </div>
        </div>
      </section>

      {/* SAMPLE DATA BANNER */}

      {usingSample && (
        <section className="container-width mb-4">
          <div className="rounded-[14px] border border-line-soft bg-tint px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-ink-secondary">
              Using sample data: a CS student resume matched against a full-stack internship JD.
            </p>

            <button
              onClick={() => {
                setUsingSample(false);
                setResumeText(null);
                setJobDescription("");
                setResult(null);
              }}
              className="text-sm text-ink-muted hover:text-ink transition-colors ml-4 shrink-0"
            >
              Clear
            </button>
          </div>
        </section>
      )}

      {/* INPUT SECTION */}

      <section className="container-width pb-10">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <ResumeUpload
            file={resumeFile}
            setFile={handleResumeFile}
            sampleLoaded={usingSample}
          />
          <JDInput
            value={jobDescription}
            onChange={setJobDescription}
          />
        </div>

        {/* INLINE ERROR */}

        {error && (
          <div className="mt-6 rounded-[16px] border border-critical-line bg-critical-soft px-6 py-4" role="alert">
            <p className="text-sm text-critical">{error}</p>
          </div>
        )}

        {/* ANALYZE BUTTON */}

        <div className="flex justify-center mt-8">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="
              primary-button
              min-w-[200px]
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>
      </section>

      {/* LOADING */}

      {loading && (
        <section className="container-width">
          <LoadingSpinner />
        </section>
      )}

      {/* RESULTS */}

      {!loading && result && (
        <MatchResults
          score={result.matchScore}
          matchedSkills={result.matchedSkills}
          missingSkills={result.missingSkills}
          criticalGaps={result.criticalGaps}
          moderateGaps={result.moderateGaps}
          minorGaps={result.minorGaps}
          summary={result.summary}
          recommendations={result.recommendations}
        />
      )}

    </main>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense>
      <AnalyzeContent />
    </Suspense>
  );
}