export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'facebook' | 'unknown';

const PLATFORM_PATTERNS: { platform: Platform; pattern: RegExp }[] = [
  { platform: 'tiktok', pattern: /(?:tiktok\.com|vm\.tiktok\.com)/i },
  { platform: 'instagram', pattern: /(?:instagram\.com\/(?:reel|p|stories)|instagr\.am)/i },
  { platform: 'twitter', pattern: /(?:twitter\.com|x\.com)/i },
  { platform: 'facebook', pattern: /(?:facebook\.com|fb\.watch|fb\.com)/i },
];

export function detectPlatform(url: string): Platform {
  const trimmed = url.trim();
  if (!trimmed) return 'unknown';

  for (const { platform, pattern } of PLATFORM_PATTERNS) {
    if (pattern.test(trimmed)) return platform;
  }

  return 'unknown';
}

export const PLATFORM_NAMES: Record<Platform, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: '',
  twitter: 'X',
  facebook: 'Facebook',
  unknown: '',
};
