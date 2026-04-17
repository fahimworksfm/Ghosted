import { NextRequest, NextResponse } from "next/server";
import { evaluate, evaluateMock, extractPdfText } from "@/lib/rejection-engine";
import { recordEvaluation } from "@/lib/stats";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const companyName = ((formData.get("company") as string) ?? "").trim();

    await new Promise((r) => setTimeout(r, 300));

    let result;

    if (!file) {
      result = evaluateMock("no-file-provided");
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = file.type || "application/octet-stream";

      let text: string;
      if (mimeType === "text/plain") {
        text = buffer.toString("utf-8");
      } else if (mimeType === "application/pdf" || file.name.endsWith(".pdf")) {
        text = extractPdfText(buffer);
      } else {
        // DOCX / DOC: extract readable ASCII tokens
        text = buffer
          .toString("latin1")
          .replace(/[^\x20-\x7E\n]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 2 && /^[a-zA-Z]/.test(w))
          .join(" ");
      }

      if (text.split(/\s+/).filter(Boolean).length < 10) {
        text = `${file.name} ${text}`;
      }

      result = evaluate(text);
    }

    // Record to stats (fire-and-forget, never block response)
    try {
      recordEvaluation(companyName, result.tier);
    } catch {
      // Stats are non-critical
    }

    return NextResponse.json({ success: true, result });
  } catch {
    const result = evaluateMock("error-recovery");
    return NextResponse.json({ success: true, result });
  }
}
