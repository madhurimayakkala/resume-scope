import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/api";
import { parseResumePdf } from "@/lib/parser";
import { MAX_RESUME_FILE_BYTES, type ParseResumeResponse } from "@/lib/schemas";

export const runtime = "nodejs";

const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"

function hasPdfMagic(bytes: Uint8Array): boolean {
  return PDF_MAGIC.every((byte, i) => bytes[i] === byte);
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse(400, "invalid_form", "Send the resume as multipart form data.");
  }

  const file = formData.get("resume");

  if (file === null) {
    return errorResponse(400, "missing_file", "Resume file is required.");
  }
  if (!(file instanceof File)) {
    return errorResponse(400, "invalid_file", "The resume field must be a file upload.");
  }
  if (file.size === 0) {
    return errorResponse(400, "empty_file", "The uploaded file is empty.");
  }
  if (file.size > MAX_RESUME_FILE_BYTES) {
    return errorResponse(413, "file_too_large", "The resume must be 5 MB or smaller.");
  }
  if (!/\.pdf$/i.test(file.name) || file.type !== "application/pdf") {
    return errorResponse(400, "unsupported_type", "Only PDF files are supported.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!hasPdfMagic(bytes)) {
    return errorResponse(400, "not_a_pdf", "This file is not a valid PDF.");
  }

  let text: string;
  try {
    text = await parseResumePdf(bytes);
  } catch (error) {
    console.error("[parse-resume] unreadable PDF:", error);
    return errorResponse(
      422,
      "unreadable_pdf",
      "This PDF could not be read. It may be corrupt or password-protected."
    );
  }

  if (text.trim().length === 0) {
    return errorResponse(
      422,
      "no_text",
      "No text could be extracted. Scanned or image-only PDFs are not supported."
    );
  }

  const body: ParseResumeResponse = { text };
  return NextResponse.json(body);
}
