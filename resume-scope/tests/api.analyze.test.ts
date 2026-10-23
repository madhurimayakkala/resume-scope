import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/analyze/route";
import {
  AnalyzeResponseSchema,
  ApiErrorSchema,
  JOB_DESCRIPTION_MAX,
  RESUME_TEXT_MAX,
} from "@/lib/schemas";
import { SAMPLE_JD, SAMPLE_RESUME } from "@/lib/sampleData";

const call = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request("http://test/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );

const valid = { resumeText: SAMPLE_RESUME, jobDescription: SAMPLE_JD };

describe("POST /api/analyze — valid input", () => {
  it("returns a schema-valid analysis", async () => {
    const res = await call(valid);
    expect(res.status).toBe(200);
    const body = AnalyzeResponseSchema.parse(await res.json());
    expect(body.matchScore).toBeGreaterThanOrEqual(70);
    expect(body.matchedSkills).toContain("react");
    expect(body.missingSkills).toContain("ci/cd");
    expect(body.recommendations.length).toBeLessThanOrEqual(3);
  });

  it("accepts input at exactly the maximum lengths", async () => {
    const res = await call({
      resumeText: "React ".repeat(RESUME_TEXT_MAX / 6),
      jobDescription: "React ".repeat(JOB_DESCRIPTION_MAX / 6),
    });
    expect(res.status).toBe(200);
  });
});

describe("POST /api/analyze — invalid input is always a structured 400", () => {
  const cases: [string, unknown, string][] = [
    ["missing both fields", {}, "resumeText"],
    ["missing jobDescription", { resumeText: SAMPLE_RESUME }, "jobDescription"],
    ["missing resumeText", { jobDescription: SAMPLE_JD }, "resumeText"],
    ["resumeText is a number", { ...valid, resumeText: 42 }, "resumeText"],
    ["jobDescription is an array", { ...valid, jobDescription: ["a"] }, "jobDescription"],
    ["resumeText is null", { ...valid, resumeText: null }, "resumeText"],
    ["resumeText too short", { ...valid, resumeText: "short" }, "resumeText"],
    ["jobDescription too short", { ...valid, jobDescription: "tiny" }, "jobDescription"],
    ["resumeText too long", { ...valid, resumeText: "x".repeat(RESUME_TEXT_MAX + 1) }, "resumeText"],
    ["jobDescription too long", { ...valid, jobDescription: "x".repeat(JOB_DESCRIPTION_MAX + 1) }, "jobDescription"],
    ["body is a JSON string", '"hello"', "(root)"],
    ["body is null", "null", "(root)"],
    ["body is an array", "[]", "(root)"],
  ];

  it.each(cases)("%s", async (_name, body, path) => {
    const res = await call(body);
    expect(res.status).toBe(400);
    const parsed = ApiErrorSchema.parse(await res.json());
    expect(parsed.error.code).toBe("invalid_request");
    expect(parsed.error.issues?.some((i) => i.path === path)).toBe(true);
  });

  it("rejects malformed JSON", async () => {
    const res = await call("{not json");
    expect(res.status).toBe(400);
    expect(ApiErrorSchema.parse(await res.json()).error.code).toBe("invalid_json");
  });

  it("rejects an empty body", async () => {
    const res = await call("");
    expect(res.status).toBe(400);
  });

  it("rejects a gross payload by declared Content-Length with 413", async () => {
    const res = await call(valid, { "content-length": String(10 * 1024 * 1024) });
    expect(res.status).toBe(413);
    expect(ApiErrorSchema.parse(await res.json()).error.code).toBe("payload_too_large");
  });
});

describe("POST /api/analyze — unexpected failures", () => {
  it("returns a structured 500 and logs when the engine throws", async () => {
    vi.resetModules();
    vi.doMock("@/lib/matcher", () => ({
      matchSkills: () => {
        throw new Error("boom");
      },
    }));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { POST: failing } = await import("@/app/api/analyze/route");
    const res = await failing(
      new Request("http://test/api/analyze", {
        method: "POST",
        body: JSON.stringify(valid),
      })
    );
    expect(res.status).toBe(500);
    expect(ApiErrorSchema.parse(await res.json()).error.code).toBe("internal_error");
    expect(log).toHaveBeenCalled();
    vi.doUnmock("@/lib/matcher");
    log.mockRestore();
  });
});
