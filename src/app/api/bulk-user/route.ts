import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, limit = 30 } = await req.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Check if TikTok session cookie is configured
    const cookie = process.env.TIKTOK_COOKIE;
    if (!cookie) {
      return NextResponse.json({ requiresCookie: true }, { status: 501 });
    }

    const clean = username.replace(/^@/, "").trim();
    const count = Math.min(Number(limit) || 30, 50);

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://www.tiktok.com/",
      Cookie: cookie,
    };

    // Step 1: resolve secUid from username
    const userRes = await fetch(
      `https://www.tiktok.com/api/user/detail/?uniqueId=${encodeURIComponent(clean)}&aid=1988&app_language=en&app_name=tiktok_web`,
      { headers, signal: AbortSignal.timeout(10000) }
    );

    if (!userRes.ok) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const userText = await userRes.text();
    console.log("[bulk-user] userRes status:", userRes.status, "body:", userText.slice(0, 300));

    if (!userText || userText.trim() === "") {
      return NextResponse.json({ error: "Profile not found or cookie expired." }, { status: 404 });
    }

    const userData = JSON.parse(userText);
    const secUid: string | undefined =
      userData?.userInfo?.user?.secUid || userData?.user?.secUid;

    console.log("[bulk-user] secUid:", secUid);

    if (!secUid) {
      return NextResponse.json({ error: "Could not resolve profile. Cookie may be expired." }, { status: 404 });
    }

    // Step 2: fetch video list
    const videosRes = await fetch(
      `https://www.tiktok.com/api/post/item_list/?aid=1988&app_language=en&app_name=tiktok_web&secUid=${encodeURIComponent(secUid)}&count=${count}&cursor=0`,
      { headers, signal: AbortSignal.timeout(12000) }
    );

    const videosText = await videosRes.text();
    console.log("[bulk-user] videosRes status:", videosRes.status, "body:", videosText.slice(0, 300));

    if (!videosText || !videosRes.ok) {
      return NextResponse.json({ error: "Could not load videos for this profile." }, { status: 502 });
    }

    const videosData = JSON.parse(videosText);
    const items: Array<{
      id?: string;
      desc?: string;
      video?: { cover?: string; dynamicCover?: string; duration?: number };
      author?: { nickname?: string; uniqueId?: string };
    }> = videosData?.itemList || [];

    if (items.length === 0) {
      return NextResponse.json({ error: "No public videos found for this profile." }, { status: 404 });
    }

    const videos = items.slice(0, count).map((v) => ({
      url: `https://www.tiktok.com/@${clean}/video/${v.id}`,
      cover: v.video?.dynamicCover || v.video?.cover || "",
      title: (v.desc || "").slice(0, 200),
      author: v.author?.nickname || clean,
      duration: v.video?.duration || null,
    }));

    return NextResponse.json({ videos, total: videos.length });
  } catch (err) {
    console.error("bulk-user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
