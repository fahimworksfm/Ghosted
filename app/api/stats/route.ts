import { NextRequest, NextResponse } from "next/server";
import { getStats } from "@/lib/stats";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const company = req.nextUrl.searchParams.get("company") ?? "";
  const stats = getStats(company);
  return NextResponse.json(stats);
}
