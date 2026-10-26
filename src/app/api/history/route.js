import { NextResponse } from "next/server";
import { seedHistory } from "@/lib/mockData";

/**
 * GET /api/history
 * Returns the user's recent generations. In production this would be a
 * paginated, authenticated query; here it returns a stable seeded reel.
 */
export async function GET() {
  const items = seedHistory();
  await new Promise((r) => setTimeout(r, 400));
  return NextResponse.json({ items });
}
