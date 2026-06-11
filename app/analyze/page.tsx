"use client";

import { useState } from "react";

import JDInput from "@/components/JDInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import MatchResults from "@/components/MatchResults";
import ResumeUpload from "@/components/ResumeUpload";

interface GapSkill {
  skill: string;
  count: number;
}

interface AnalysisResult {
  score: number;

  matchedSkills: string[];

  missingSkills: string[];

  criticalGaps: GapSkill[];

  moderateGaps: GapSkill[];

  minorGaps: GapSkill[];

  summary: string;
}

export default function AnalyzePage() {
  const [resumeFile, setResumeFile] =
    useState<File | null>(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      alert(
        "Please upload a resume and paste a job description."
      );

      return;
    }

    try {
      setLoading(true);

      /*
        PARSE RESUME
      */

      const formData = new FormData();

      formData.append("resume", resumeFile);

      const parseResponse = await fetch(
        "/api/parse-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!parseResponse.ok) {
        throw new Error(
          "Failed to parse resume."
        );
      }

      const parsedData =
        await parseResponse.json();

      /*
        ANALYZE RESUME
      */

      const analyzeResponse = await fetch(
        "/api/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            resumeText: parsedData.text,
            jobDescription,
          }),
        }
      );

      if (!analyzeResponse.ok) {
        throw new Error(
          "Failed to analyze resume."
        );
      }

      const analysis =
        await analyzeResponse.json();

      /*
        SAFE RESULT HANDLING
      */
setResult({
  score:
    typeof analysis.matchScore ===
    "number"
      ? analysis.matchScore
      : 0,

  matchedSkills: Array.isArray(
    analysis.matchedSkills
  )
    ? analysis.matchedSkills
    : [],

  missingSkills: Array.isArray(
    analysis.missingSkills
  )
    ? analysis.missingSkills
    : [],

  criticalGaps: Array.isArray(
    analysis.criticalGaps
  )
    ? analysis.criticalGaps
    : [],

  moderateGaps: Array.isArray(
    analysis.moderateGaps
  )
    ? analysis.moderateGaps
    : [],

  minorGaps: Array.isArray(
    analysis.minorGaps
  )
    ? analysis.minorGaps
    : [],

  summary:
    analysis.aiExplanation ||
    "Analysis completed successfully.",
});

    }catch (error) {
  console.error(error);

  if (error instanceof Error) {
    alert(error.message);
  } else {
    alert("Unknown error");
  }
}
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* NAVBAR */}

      <nav className="container-width py-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-muted">
            ATS Resume Matcher
          </p>
        </div>

        <button
          className="secondary-button text-sm"
          onClick={() =>
            (window.location.href = "/")
          }
        >
          Back Home
        </button>
      </nav>

      {/* HERO */}

      <section className="container-width pt-16 md:pt-24 pb-16">
        <div className="max-w-4xl">
          <div className="fade-up">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">
              Resume Analysis
            </p>
          </div>

          <div className="mt-6 fade-up fade-delay-1">
            <h1 className="text-5xl md:text-7xl leading-[0.98] font-semibold">
              Understand your resume fit instantly.
            </h1>
          </div>

          <div className="mt-8 fade-up fade-delay-2">
            <p className="text-lg text-secondary max-w-2xl leading-[1.9]">
              Compare your resume against any job
              description and identify ATS
              compatibility, missing skills, and
              optimization opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* INPUT SECTION */}

      <section className="container-width pb-10">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <ResumeUpload
            file={resumeFile}
            setFile={setResumeFile}
          />

          <JDInput
            value={jobDescription}
            onChange={setJobDescription}
          />
        </div>

        {/* ANALYZE BUTTON */}

        <div className="flex justify-center mt-12">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="
              primary-button
              min-w-[220px]
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Analyzing..."
              : "Analyze Resume"}
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
    score={result.score}
    matchedSkills={
      result.matchedSkills || []
    }
    missingSkills={
      result.missingSkills || []
    }
    criticalGaps={
      result.criticalGaps || []
    }
    moderateGaps={
      result.moderateGaps || []
    }
    minorGaps={
      result.minorGaps || []
    }
    summary={result.summary}
  />
)}
      {/* FOOTER */}

      <footer className="container-width py-10 mt-20 border-t border-white/5 flex items-center justify-between text-sm text-muted">
        <p>Madhurima Yakkala</p>
      </footer>
    </main>
  );
}