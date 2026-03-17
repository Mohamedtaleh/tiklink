"use server";

import { z } from "zod";
import { Innertube } from "youtubei.js";
import type { VideoInfo } from "@/lib/types";
import { detectPlatform, type Platform } from "@/lib/platform-detect";

const schema = z.object({
  url: z.string().min(1, { message: 'Please enter a URL.' }),
});

function formatLikes(likes: number): string {
  if (likes >= 1_000_000) return (likes / 1_000_000).toFixed(1) + 'M';
  if (likes >= 1_000) return (likes / 1_000).toFixed(1) + 'K';
  return likes.toString();
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function makeAbsoluteUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://www.tikwm.com${path}`;
}

// --- TikTok via tikwm.com (proven, keep as-is) ---
async function fetchTikTokVideo(url: string): Promise<VideoInfo> {
  const apiUrl = new URL('https://www.tikwm.com/api/');
  apiUrl.searchParams.append('url', url);
  apiUrl.searchParams.append('hd', '1');

  const response = await fetch(apiUrl.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const json = await response.json();

  if (json.code !== 0 || !json.data) {
    throw new Error(json.msg || "The video could not be found. It might be private, deleted, or the URL is incorrect.");
  }

  const apiData = json.data;

  return {
    title: apiData.title || 'Untitled',
    author: apiData.author?.nickname || apiData.author?.unique_id || 'Unknown',
    duration: formatDuration(apiData.duration || 0),
    likes: formatLikes(apiData.statistics?.digg_count || 0),
    thumbnailUrl: makeAbsoluteUrl(apiData.cover),
    caption: apiData.title || '',
    hdLink: makeAbsoluteUrl(apiData.play),
    watermarkedLink: makeAbsoluteUrl(apiData.wmplay),
    audioLink: makeAbsoluteUrl(apiData.music),
    platform: 'tiktok',
    originalUrl: url,
  };
}

// --- Fetch Open Graph metadata from a URL for thumbnail/title ---
async function fetchOGMetadata(url: string): Promise<{ title: string; image: string; author: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Tiklink/1.0; +https://tiklink.ink)',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return { title: '', image: '', author: '' };

    const html = await response.text();

    const getMetaContent = (property: string): string => {
      const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
      const altRegex = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`, 'i');
      return regex.exec(html)?.[1] || altRegex.exec(html)?.[1] || '';
    };

    const title = getMetaContent('og:title') || getMetaContent('twitter:title') || '';
    const image = getMetaContent('og:image') || getMetaContent('twitter:image') || '';
    const author = getMetaContent('og:site_name') || '';

    return { title, image, author };
  } catch {
    return { title: '', image: '', author: '' };
  }
}

// --- YouTube via youtubei.js (full InnerTube implementation) ---
function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || null;
}

async function fetchYouTubeVideo(url: string, audioOnly = false): Promise<VideoInfo> {
  const videoId = extractYouTubeId(url);
  if (!videoId) throw new Error('Invalid YouTube URL. Please paste a valid YouTube video or Shorts link.');

  try {
    const yt = await Innertube.create({ generate_session_locally: true });
    const info = await yt.getBasicInfo(videoId, 'IOS');

    if (info.playability_status?.status !== 'OK') {
      const reason = info.playability_status?.reason || '';
      if (reason.toLowerCase().includes('private')) throw new Error('This YouTube video is private.');
      if (reason.toLowerCase().includes('age')) throw new Error('This YouTube video is age-restricted.');
      throw new Error(reason || 'This YouTube video is unavailable.');
    }

    const basic = info.basic_info;
    const streaming = info.streaming_data;
    if (!streaming) throw new Error('No streaming data available for this video.');

    const thumbnail =
      (basic.thumbnail || []).sort((a: {width?: number}, b: {width?: number}) => (b.width || 0) - (a.width || 0))[0]?.url
      || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    if (audioOnly) {
      const audioFormats = (streaming.adaptive_formats || [])
        .filter((f: { has_audio?: boolean; has_video?: boolean }) => f.has_audio && !f.has_video)
        .sort((a: { bitrate?: number }, b: { bitrate?: number }) => (b.bitrate || 0) - (a.bitrate || 0));
      const best = audioFormats[0];
      if (!best) throw new Error('No audio stream available for this video.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioUrl = (best as any).decipher(yt.session.player);

      return {
        title: basic.title || 'YouTube Video',
        author: basic.author || '',
        duration: formatDuration(basic.duration || 0),
        likes: formatLikes(basic.view_count || 0),
        thumbnailUrl: thumbnail,
        caption: '',
        hdLink: '',
        watermarkedLink: '',
        audioLink: audioUrl,
        platform: 'youtube',
        originalUrl: url,
      };
    }

    // Combined mp4 formats (audio + video in one file)
    const combined = (streaming.formats || [])
      .filter((f: { mime_type?: string }) => f.mime_type?.includes('video/mp4'))
      .sort((a: { width?: number }, b: { width?: number }) => (b.width || 0) - (a.width || 0));

    const audioFormats = (streaming.adaptive_formats || [])
      .filter((f: { has_audio?: boolean; has_video?: boolean }) => f.has_audio && !f.has_video)
      .sort((a: { bitrate?: number }, b: { bitrate?: number }) => (b.bitrate || 0) - (a.bitrate || 0));

    const bestVideo = combined[0];
    const bestAudio = audioFormats[0];
    if (!bestVideo) throw new Error('No downloadable video format found.');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videoUrl = (bestVideo as any).decipher(yt.session.player);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioUrl = bestAudio ? (bestAudio as any).decipher(yt.session.player) : '';

    return {
      title: basic.title || 'YouTube Video',
      author: basic.author || '',
      duration: formatDuration(basic.duration || 0),
      likes: formatLikes(basic.view_count || 0),
      thumbnailUrl: thumbnail,
      caption: '',
      hdLink: videoUrl,
      watermarkedLink: '',
      audioLink: audioUrl,
      platform: 'youtube',
      originalUrl: url,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('private')) throw new Error('This YouTube video is private.');
    if (msg.includes('age')) throw new Error('This YouTube video is age-restricted.');
    if (msg.includes('unavailable') || msg.includes('not available')) {
      throw new Error('This YouTube video is unavailable or has been removed.');
    }
    throw err;
  }
}

// --- Other platforms via cobalt API (v7) ---
async function fetchCobaltVideo(url: string, platform: Platform, audioOnly = false): Promise<VideoInfo> {
  const cobaltUrl = process.env.COBALT_API_URL;
  const cobaltKey = process.env.COBALT_API_KEY;

  if (!cobaltUrl) {
    const platformNames: Record<string, string> = {
      instagram: 'Instagram',
      youtube: 'YouTube',
      twitter: 'X (Twitter)',
      facebook: 'Facebook',
    };
    throw new Error(
      `${platformNames[platform] || 'This platform'} downloads are coming soon! TikTok downloads are fully supported.`
    );
  }

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (cobaltKey) {
    headers['Authorization'] = `Api-Key ${cobaltKey}`;
  }

  const body: Record<string, unknown> = {
    url,
    videoQuality: 'max',
    filenameStyle: 'basic',
  };

  if (audioOnly) {
    body.downloadMode = 'audio';
    body.audioFormat = 'mp3';
  }

  const response = await fetch(cobaltUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!response.ok || json.status === 'error') {
    console.error('Cobalt API error:', JSON.stringify(json));
    const code = json.error?.code || '';
    const friendlyMessages: Record<string, string> = {
      'error.api.youtube.login': 'YouTube downloads require additional setup. Please try Instagram, X, or Facebook instead.',
      'error.api.link.unsupported': 'This link is not supported. Please check the URL and try again.',
      'error.api.fetch.empty': 'Could not find a video at this URL. It may be private or deleted.',
      'error.api.fetch.critical': 'The download service encountered an error. Please try again later.',
      'error.api.content.video.unavailable': 'This video is unavailable. It may be private, deleted, or region-locked.',
    };
    throw new Error(friendlyMessages[code] || 'Could not process this video. Please check the URL and try again.');
  }

  // cobalt v7 returns status: "tunnel" | "redirect" | "picker"
  let downloadUrl = '';
  let audioUrl = '';

  if (json.status === 'redirect' || json.status === 'tunnel') {
    downloadUrl = json.url || '';
  } else if (json.status === 'picker') {
    downloadUrl = json.picker?.[0]?.url || '';
    audioUrl = json.audio || '';
  }

  if (!downloadUrl) {
    throw new Error('No download link available for this video.');
  }

  // Fetch OG metadata for thumbnail and title
  const og = await fetchOGMetadata(url);

  const platformLabels: Record<string, string> = {
    instagram: 'Instagram',
    youtube: 'YouTube',
    twitter: 'X',
    facebook: 'Facebook',
  };

  // For audio-only mode: the download URL is the MP3, put it in audioLink
  return {
    title: og.title || json.filename || `${platformLabels[platform] || ''} Video`,
    author: og.author || '',
    duration: '',
    likes: '',
    thumbnailUrl: og.image || '',
    caption: og.title || '',
    hdLink: audioOnly ? '' : downloadUrl,
    watermarkedLink: '',
    audioLink: audioOnly ? downloadUrl : audioUrl,
    platform,
    originalUrl: url,
  };
}

export async function getVideoInfo(
  prevState: any,
  formData: FormData
) {
  const validatedFields = schema.safeParse({
    url: formData.get("url"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.url?.[0],
      data: null,
    };
  }

  const url = validatedFields.data.url;
  const platform = detectPlatform(url);

  try {
    let videoData: VideoInfo;

    if (platform === 'tiktok') {
      videoData = await fetchTikTokVideo(url);
    } else if (platform === 'youtube') {
      const audioOnly = formData.get("audioOnly") === "true";
      videoData = await fetchYouTubeVideo(url, audioOnly);
    } else if (platform === 'unknown') {
      return {
        error: "Please paste a valid video URL from TikTok, Instagram, YouTube, Twitter, or Facebook.",
        data: null,
      };
    } else {
      const audioOnly = formData.get("audioOnly") === "true";
      videoData = await fetchCobaltVideo(url, platform, audioOnly);
    }

    return { data: videoData, error: null };
  } catch (error) {
    console.error("Error fetching video info:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
    return { error: message, data: null };
  }
}
