import { NextRequest, NextResponse } from "next/server";
import { evaluate, evaluateMock } from "@/lib/rejection-engine";

export const runtime = "nodejs";

function extractTextFromBuffer(buffer: Buffer, mimeType: string): string {
  // For plain text files decode directly
  if (mimeType === "text/plain") {
    return buffer.toString("utf-8");
  }
  // For PDF/DOCX we do a best-effort ASCII extraction (no external libs)
  // This strips binary noise and returns readable ASCII tokens
  const raw = buffer.toString("latin1");
  const printable = raw.replace(/[^\x20-\x7E\n\r\t]/g, " ");
  const words = printable.split(/\s+/).filter((w) => w.length > 2 && /^[a-zA-Z]/.test(w));
  return words.join(" ");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    // Simulate a small processing delay for authenticity
    await new Promise((r) => setTimeout(r, 300));

    if (!file) {
      // No file — run mock evaluation so we always get a rejection
      const result = evaluateMock("no-file-provided");
      return NextResponse.json({ success: true, result });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "application/octet-stream";

    let text = extractTextFromBuffer(buffer, mimeType);

    // If extraction yields too little text, pad with filename so seed varies
    if (text.split(/\s+/).filter(Boolean).length < 10) {
      text = `${file.name} ${text}`;
    }

    const result = evaluate(text);

    return NextResponse.json({ success: true, result });
  } catch {
    // Even on error — still reject
    const result = evaluateMock("error-recovery");
    return NextResponse.json({ success: true, result });
  }
}
