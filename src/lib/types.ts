import type { Platform } from './platform-detect';

export interface VideoInfo {
  title: string;
  author: string;
  duration: string;
  likes: string;
  thumbnailUrl: string;
  caption: string;
  hdLink: string;
  watermarkedLink: string;
  audioLink: string;
  platform: Platform;
  originalUrl: string;
}
