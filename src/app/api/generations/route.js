import { NextResponse } from "next/server";
import { generateBatch } from "@/lib/mockData";

/**
 * POST /api/generations
 * Mock generation endpoint. Accepts the same payload a real inference
 * API would and returns realistically-shaped records after a short,
 * randomised delay so the UI exercises genuine loading states.
 */
export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const prompt = (body.prompt || "").trim();
  if (!prompt) {
    return NextResponse.json(
      { error: "A prompt is required to generate." },
      { status: 422 }
    );
  }

  const mode = body.mode === "video" ? "video" : "image";
  const count = Math.min(Math.max(Number(body.count) || 4, 1), 8);

  const items = generateBatch({
    mode,
    prompt,
    count,
    model: body.model || "fomi-core",
    style: body.style || "none",
    ratio: body.ratio || "1:1",
  });

  // Simulate inference latency (videos take a little longer).
  const base = mode === "video" ? 2200 : 1300;
  await new Promise((r) => setTimeout(r, base + Math.random() * 900));

  return NextResponse.json({
    items,
    meta: { mode, count, prompt, generatedAt: new Date().toISOString() },
  });
}
