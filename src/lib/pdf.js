import { extractText, getDocumentProxy } from "unpdf";

export async function downloadPdf(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download PDF. Status: ${response.status}`);
    }

    return new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    console.error("PDF download failed:", error);

    throw new Error("Unable to download the uploaded resume.");
  }
}

export async function extractPdfText(buffer) {
  try {
    const pdf = await getDocumentProxy(buffer);

    const { text } = await extractText(pdf, {
      mergePages: true,
    });

    if (!text || !text.trim()) {
      throw new Error("No readable text found in the PDF.");
    }

    return text.replace(/\x00/g, "").replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error("PDF parsing failed:", error);

    throw new Error(
      "Unable to read the uploaded resume. Please upload a valid PDF.",
    );
  }
}
