import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const isTikTok =
      /tiktok\.com\/.+\/video\/|vm\.tiktok\.com\/|vt\.tiktok\.com\//.test(url);
    if (!isTikTok) {
      return NextResponse.json({ error: "Not a TikTok URL" }, { status: 400 });
    }

    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    const res = await fetch(apiUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Tiklink/1.0)" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch video info" }, { status: 502 });
    }

    const json = await res.json();

    if (json.code !== 0 || !json.data) {
      return NextResponse.json({ error: json.msg || "Video not found" }, { status: 404 });
    }

    const d = json.data;

    return NextResponse.json({
      downloadUrl: d.hdplay || d.play || "",
      audioUrl: d.music || "",
      cover: d.cover || d.origin_cover || "",
      title: d.title || "",
      author: d.author?.nickname || d.author?.unique_id || "",
      duration: d.duration || null,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
