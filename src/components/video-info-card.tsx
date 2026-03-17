"use client";

import { Download, Music, ExternalLink } from "lucide-react";
import type { VideoInfo } from "@/lib/types";
import { PLATFORM_NAMES } from "@/lib/platform-detect";
import {
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
  XIcon,
  FacebookIcon,
} from "@/components/platform-icons";
import { cn } from "@/lib/utils";

const PLATFORM_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  twitter: XIcon,
  facebook: FacebookIcon,
};

interface VideoInfoCardProps {
  video: VideoInfo;
  shareUrl: string;
}

export function VideoInfoCard({ video }: VideoInfoCardProps) {
  const platformName = PLATFORM_NAMES[video.platform] || '';
  const PlatformIcon = PLATFORM_ICON[video.platform];

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl bg-surface border border-border overflow-hidden">
      {/* Thumbnail section */}
      {video.thumbnailUrl ? (
        <div className="relative aspect-video w-full bg-surface-2">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {/* Platform badge overlay */}
          {platformName && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm">
              {PlatformIcon && <PlatformIcon className="h-3 w-3 fill-white" />}
              <span className="text-[10px] font-medium text-white uppercase tracking-wider">
                {platformName}
              </span>
            </div>
          )}
          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm">
              <span className="text-[11px] font-medium text-white tabular-nums">
                {video.duration}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* No thumbnail — show platform-branded header */
        <div className="flex items-center gap-2 px-6 pt-5">
          {PlatformIcon && <PlatformIcon className="h-4 w-4 fill-primary" />}
          {platformName && (
            <span className="text-[10px] font-medium text-primary uppercase tracking-widest">
              {platformName}
            </span>
          )}
        </div>
      )}

      {/* Info section */}
      <div className="p-5">
        <h3 className="text-sm font-medium leading-snug line-clamp-2">
          {video.title}
        </h3>

        <div className="flex items-center gap-3 mt-2">
          {video.author && (
            <span className="text-xs text-muted-foreground">{video.author}</span>
          )}
          {video.likes && (
            <span className="text-xs text-muted-foreground">{video.likes} likes</span>
          )}
        </div>

        {/* Download buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
          {video.hdLink && (
            <a
              href={video.hdLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-2 flex-1",
                "h-11 px-5 rounded-lg text-sm font-medium",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 active:scale-[0.98] transition-all duration-150"
              )}
            >
              <Download className="h-4 w-4" />
              Download HD
            </a>
          )}

          {video.audioLink && (
            <a
              href={video.audioLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-2 flex-1",
                "h-11 px-5 rounded-lg text-sm font-medium",
                "bg-surface-2 text-foreground border border-border",
                "hover:border-border-hover active:scale-[0.98] transition-all duration-150"
              )}
            >
              <Music className="h-4 w-4" />
              Download Audio
            </a>
          )}

          {video.originalUrl && (
            <a
              href={video.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-2",
                "h-11 px-4 rounded-lg text-sm",
                "text-muted-foreground",
                "hover:text-foreground hover:bg-surface-2 transition-all duration-150"
              )}
              title="Open original"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
