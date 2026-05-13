import { NextResponse } from "next/server";

import { parseResumePdf } from "@/lib/parser";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json(
        {
          error: "Resume file is required.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const extractedText =
      await parseResumePdf(buffer);

    return NextResponse.json({
      text: extractedText,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to parse resume.",
      },
      {
        status: 500,
      }
    );
  }
}