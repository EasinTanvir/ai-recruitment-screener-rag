import { extractText, getDocumentProxy } from "unpdf";

export async function extractPdfText(url) {
  const res = await fetch(url);
  const buffer = new Uint8Array(await res.arrayBuffer());

  const pdf = await getDocumentProxy(buffer);
  const { text } = await extractText(pdf, { mergePages: true });

  return text.replace(/\x00/g, "").trim();
}
