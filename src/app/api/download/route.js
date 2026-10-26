import { NextResponse } from "next/server";

/**
 * GET /api/download?url=<remote>&name=<filename>
 * Streams a remote asset back through our origin with a
 * Content-Disposition: attachment header, so the browser downloads it
 * directly instead of navigating to it (cross-origin `download` attrs are
 * ignored by browsers). Hosts are allow-listed to avoid an open proxy.
 */
const ALLOWED_HOSTS = new Set([
  "picsum.photos",
  "fastly.picsum.photos",
  "i.pravatar.cc",
  "media.w3.org",
  "test-videos.co.uk",
]);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");
  const name = (searchParams.get("name") || "fomi-download").replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  let upstream;
  try {
    upstream = await fetch(parsed.toString());
  } catch {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}
