"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import JDInput from "@/components/JDInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import MatchResults from "@/components/MatchResults";
import Nav from "@/components/Nav";
import ResumeUpload from "@/components/ResumeUpload";
import SampleDataButton from "@/components/SampleDataButton";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatResultsJson, formatResultsText } from "@/lib/exportResults";
import { SAMPLE_JD, SAMPLE_RESUME } from "@/lib/sampleData";
import {
  AnalyzeResponseSchema,
  ApiErrorSchema,
  ParseResumeResponseSchema,
  RESUME_TEXT_MIN,
  type AnalyzeResponse,
} from "@/lib/schemas";

/* Reads the structured API error, falling back to a generic message. */
async function readApiError(res: Response, fallback: string): Promise<string> {
  const parsed = ApiErrorSchema.safeParse(await res.json().catch(() => null));
  return parsed.success ? parsed.data.error.message : fallback;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLElement | null>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingSample, setUsingSample] = useState(false);
  const [actionStatus, setActionStatus] = useState("");

  const handleLoadSample = useCallback(() => {
    setResumeFile(null);
    setResumeText(SAMPLE_RESUME);
    setJobDescription(SAMPLE_JD);
    setResult(null);
    setError(null);
    setUsingSample(true);
  }, []);

  function handleClear() {
    setUsingSample(false);
    setResumeFile(null);
    setResumeText(null);
    setJobDescription("");
    setResult(null);
    setError(null);
  }

  useEffect(() => {
    if (searchParams.get("demo") === "true") handleLoadSample();
  }, [searchParams, handleLoadSample]);

  /* Bring the results into view and move focus to their heading. */
  useEffect(() => {
    if (!result || !resultsRef.current) return;
    resultsRef.current.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    document.getElementById("results-heading")?.focus({ preventScroll: true });
  }, [result]);

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
      setActionStatus("");

      let parsedResumeText = resumeText;

      if (!parsedResumeText && resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);

        const parseResponse = await fetch("/api/parse-resume", { method: "POST", body: formData });
        if (!parseResponse.ok) {
          throw new Error(await readApiError(parseResponse, "Failed to parse resume."));
        }
        parsedResumeText = ParseResumeResponseSchema.parse(await parseResponse.json()).text;
      }

      if ((parsedResumeText ?? "").trim().length < RESUME_TEXT_MIN) {
        throw new Error(
          "Could not extract enough text from this PDF. Try re-saving it as a text-based PDF."
        );
      }

      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: parsedResumeText, jobDescription }),
      });
      if (!analyzeResponse.ok) {
        throw new Error(await readApiError(analyzeResponse, "Failed to analyze resume."));
      }

      setResult(AnalyzeResponseSchema.parse(await analyzeResponse.json()));
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(formatResultsText(result));
      setActionStatus("Copied to clipboard.");
    } catch {
      setActionStatus("Copy failed. Your browser blocked clipboard access.");
    }
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([formatResultsJson(result)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume-scope-report.json";
    link.click();
    URL.revokeObjectURL(url);
    setActionStatus("Downloaded resume-scope-report.json.");
  }

  return (
    <>
      <Nav cta={{ href: "/", label: "Back home" }} />

      <main id="main">
        <section className="container-width pb-12 pt-12 md:pt-16">
          <div className="fade-up max-w-3xl">
            <SectionHeader
              level="h1"
              eyebrow="Resume analysis"
              title="See how well your resume fits the role."
              description="Upload your resume and paste a job description. We'll identify matched skills, critical gaps, and actionable improvements."
            />
            <div className="mt-8">
              <SampleDataButton onLoad={handleLoadSample} />
            </div>
          </div>
        </section>

        {usingSample && (
          <section className="container-width mb-2">
            <div
              role="status"
              className="flex items-center justify-between gap-4 rounded-sm border border-border bg-surface px-5 py-3"
            >
              <p className="text-caption text-secondary">
                Using sample data — a CS student resume matched against a full-stack internship JD.
              </p>
              <Button variant="ghost" size="sm" onClick={handleClear} className="shrink-0">
                Clear
              </Button>
            </div>
          </section>
        )}

        <section className="container-width pb-10">
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            <ResumeUpload file={resumeFile} setFile={handleResumeFile} sampleLoaded={usingSample} />
            <JDInput value={jobDescription} onChange={setJobDescription} />
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-md border border-critical/40 bg-critical/10 px-6 py-4"
            >
              <p className="text-caption text-critical">{error}</p>
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              aria-busy={loading}
              className="min-w-52"
            >
              {loading ? "Analyzing..." : "Analyze resume"}
            </Button>
          </div>
        </section>

        {/* Announces progress and completion to assistive tech. */}
        <div role="status" aria-live="polite" className="sr-only">
          {loading
            ? "Analyzing your resume."
            : result
              ? `Analysis complete. Match score ${result.matchScore} percent.`
              : ""}
        </div>

        {loading && (
          <section className="container-width">
            <LoadingSpinner />
          </section>
        )}

        {!loading && result && (
          <MatchResults
            ref={resultsRef}
            result={result}
            onCopy={handleCopy}
            onDownload={handleDownload}
            actionStatus={actionStatus}
          />
        )}
      </main>
    </>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense>
      <AnalyzeContent />
    </Suspense>
  );
}
