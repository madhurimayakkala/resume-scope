import { NextResponse } from "next/server";
import type { ZodError } from "zod";

import type { ApiError } from "./schemas";

/* One shape for every error the API returns. */
export function errorResponse(
  status: number,
  code: string,
  message: string,
  issues?: ApiError["error"]["issues"]
) {
  const body: ApiError = { error: { code, message, ...(issues ? { issues } : {}) } };
  return NextResponse.json(body, { status });
}

export function validationError(error: ZodError) {
  return errorResponse(
    400,
    "invalid_request",
    "The request did not match the expected format.",
    error.issues.map((issue) => ({
      path: issue.path.join(".") || "(root)",
      message: issue.message,
    }))
  );
}
