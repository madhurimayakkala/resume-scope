import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/parse-resume/route";
import { ApiErrorSchema, MAX_RESUME_FILE_BYTES, ParseResumeResponseSchema } from "@/lib/schemas";

const resumePdf = readFileSync("tests/fixtures/resume.pdf");
const blankPdf = readFileSync("tests/fixtures/blank.pdf");

const upload = (field: string, value: string | Blob) => {
  const form = new FormData();
  form.append(field, value);
  return POST(new Request("http://test/api/parse-resume", { method: "POST", body: form }));
};

const pdfFile = (bytes: BlobPart, name = "resume.pdf", type = "application/pdf") =>
  new File([bytes], name, { type });

const expectError = async (res: Response, status: number, code: string) => {
  expect(res.status).toBe(status);
  expect(ApiErrorSchema.parse(await res.json()).error.code).toBe(code);
};

describe("POST /api/parse-resume — valid upload", () => {
  it("extracts text and keeps headings on their own lines", async () => {
    const res = await upload("resume", pdfFile(resumePdf));
    expect(res.status).toBe(200);
    const { text } = ParseResumeResponseSchema.parse(await res.json());
    expect(text.split("\n")).toEqual(expect.arrayContaining(["SKILLS", "PROJECTS"]));
    expect(text).toContain("React");
  });

  it("accepts an upper-case .PDF extension", async () => {
    const res = await upload("resume", pdfFile(resumePdf, "RESUME.PDF"));
    expect(res.status).toBe(200);
  });

  it("accepts a file exactly at the size limit", async () => {
    const padded = new Uint8Array(MAX_RESUME_FILE_BYTES);
    padded.set(resumePdf);
    // Trailing zero bytes are ignored by PDF readers.
    const res = await upload("resume", pdfFile(padded));
    expect(res.status).toBe(200);
  });
});

describe("POST /api/parse-resume — invalid input is never a 500", () => {
  it("missing file field", async () => {
    await expectError(await upload("other", "x"), 400, "missing_file");
  });

  it("field is a plain string, not a file", async () => {
    await expectError(await upload("resume", "just text"), 400, "invalid_file");
  });

  it("empty file", async () => {
    await expectError(await upload("resume", pdfFile(new Uint8Array(0))), 400, "empty_file");
  });

  it("file over 5 MB", async () => {
    const big = new Uint8Array(MAX_RESUME_FILE_BYTES + 1);
    big.set(resumePdf);
    await expectError(await upload("resume", pdfFile(big)), 413, "file_too_large");
  });

  it.each([
    ["text file", pdfFile("hello", "notes.txt", "text/plain")],
    ["png image", pdfFile(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), "pic.png", "image/png")],
    ["PDF content with a .txt name", pdfFile(resumePdf, "resume.txt", "application/pdf")],
    ["PDF bytes labelled as text/plain", pdfFile(resumePdf, "resume.pdf", "text/plain")],
    ["no extension", pdfFile(resumePdf, "resume", "application/pdf")],
    ["empty MIME type", pdfFile(resumePdf, "resume.pdf", "")],
  ])("non-PDF: %s", async (_n, file) => {
    await expectError(await upload("resume", file), 400, "unsupported_type");
  });

  it("right name and MIME but no %PDF magic bytes", async () => {
    await expectError(await upload("resume", pdfFile("MZ not a pdf at all")), 400, "not_a_pdf");
  });

  it("magic bytes present but the document is corrupt", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await expectError(await upload("resume", pdfFile("%PDF-1.4 garbage")), 422, "unreadable_pdf");
    log.mockRestore();
  });

  it("a PDF with no extractable text", async () => {
    await expectError(await upload("resume", pdfFile(blankPdf)), 422, "no_text");
  });

  it("a request that is not multipart form data", async () => {
    const res = await POST(
      new Request("http://test/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })
    );
    await expectError(res, 400, "invalid_form");
  });
});
