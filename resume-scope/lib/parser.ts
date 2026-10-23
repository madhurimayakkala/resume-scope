import { extractText, getDocumentProxy } from "unpdf";

/*
  Extracts plain text from a PDF. unpdf is a maintained, serverless-safe
  build of pdf.js (the previous pdf-parse 1.1.x is unmaintained and reads
  a bundled test PDF at import time under some bundlers).
  Lines are preserved so section headings stay on their own line.
*/
export async function parseResumePdf(buffer: ArrayBuffer | Uint8Array): Promise<string> {
  // pdf.js rejects Node Buffers, so always hand it a plain Uint8Array copy.
  const data = new Uint8Array(buffer as ArrayBufferLike);
  const pdf = await getDocumentProxy(data);
  const { text } = await extractText(pdf, { mergePages: true });
  return text;
}
