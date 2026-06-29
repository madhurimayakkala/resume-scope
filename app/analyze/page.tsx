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
        aiExplanation: analysis.aiExplanation ?? "Analysis completed.",
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
    <main className="min-h-screen">

      {/* NAVBAR */}

      <nav className="container-width py-8 flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.28em] text-muted">
          Resume Scope
        </p>

        <button
          className="secondary-button text-sm"
          onClick={() => router.push("/")}
        >
          Back Home
        </button>
      </nav>

      {/* HERO */}

      <section className="container-width pt-16 md:pt-20 pb-12">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.24em] text-muted fade-up">
            Resume Analysis
          </p>

          <h1 className="text-5xl md:text-6xl leading-[1.0] font-semibold mt-5 fade-up fade-delay-1">
            See how well your resume fits the role.
          </h1>

          <p className="text-base text-secondary max-w-xl leading-[1.9] mt-6 fade-up fade-delay-2">
            Upload your resume and paste a job description.
            We'll identify matched skills, critical gaps, and
            actionable improvements.
          </p>

          <div className="mt-8 fade-up fade-delay-3">
            <SampleDataButton onLoad={handleLoadSample} />
          </div>
        </div>
      </section>

      {/* SAMPLE DATA BANNER */}

      {usingSample && (
        <section className="container-width mb-2">
          <div className="rounded-[14px] border border-white/10 bg-white/[0.03] px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-secondary">
              Using sample data — a CS student resume matched against a full-stack internship JD.
            </p>

            <button
              onClick={() => {
                setUsingSample(false);
                setResumeText(null);
                setJobDescription("");
                setResult(null);
              }}
              className="text-xs text-muted hover:text-secondary transition-colors ml-4 shrink-0"
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
          <div className="mt-6 rounded-[16px] border border-red-500/20 bg-red-500/[0.06] px-6 py-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* ANALYZE BUTTON */}

        <div className="flex justify-center mt-10">
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
          summary={result.aiExplanation}
          recommendations={result.recommendations}
        />
      )}

      {/* FOOTER */}

      <footer className="container-width py-10 mt-20 border-t border-white/5 flex items-center justify-between text-sm text-muted">
        <p>Madhurima Yakkala</p>
      </footer>

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