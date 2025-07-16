
"use server";

import { z } from "zod";
import type { VideoInfo } from "@/lib/types";

// Permissive schema to accept any non-empty string.
// The external API will handle the actual URL validation.
const schema = z.object({
  url: z.string().min(1, { message: 'Please enter a URL.' }),
});

function formatLikes(likes: number): string {
    if (likes >= 1_000_000) {
      return (likes / 1_000_000).toFixed(1) + 'M';
    }
    if (likes >= 1_000) {
      return (likes / 1_000).toFixed(1) + 'K';
    }
    return likes.toString();
}
  
function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to safely construct an absolute URL
function makeAbsoluteUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) {
    return path;
  }
  return `https://www.tikwm.com${path}`;
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
  
  try {
    const apiUrl = new URL('https://www.tikwm.com/api/');
    apiUrl.searchParams.append('url', validatedFields.data.url);
    apiUrl.searchParams.append('hd', '1');

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      }
    });
    
    if (!response.ok) {
        return { error: `API request failed with status ${response.status}. Please try again later.`, data: null };
    }

    const json = await response.json();

    if (json.code !== 0 || !json.data) {
        return { error: json.msg || "The video could not be found. It might be private, deleted, or the URL is incorrect.", data: null };
    }
    
    const apiData = json.data;

    const videoData: VideoInfo = {
      title: apiData.title || 'Untitled',
      author: apiData.author?.nickname || apiData.author?.unique_id || 'Unknown Author',
      duration: formatDuration(apiData.duration || 0),
      likes: formatLikes(apiData.statistics?.digg_count || 0),
      thumbnailUrl: makeAbsoluteUrl(apiData.cover),
      caption: apiData.title || '',
      hdLink: makeAbsoluteUrl(apiData.play),
      watermarkedLink: makeAbsoluteUrl(apiData.wmplay),
      audioLink: makeAbsoluteUrl(apiData.music),
    };

    return { data: videoData, error: null };
  } catch (error) {
    console.error("Error fetching video info:", error);
    return { error: "An unexpected network error occurred. Please check your connection and try again.", data: null };
  }
}
