import pdfParse from "pdf-parse";

export async function parseResumePdf(
  buffer: Buffer
) {
  const data = await pdfParse(buffer);

  return data.text;
}