"use client";

import { useRef, useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { getVideoInfo } from "@/lib/actions";
import { VideoInfoCard } from "./video-info-card";
import { Skeleton } from "./ui/skeleton";
import type { VideoInfo } from "@/lib/types";
import { detectPlatform, PLATFORM_NAMES, type Platform } from "@/lib/platform-detect";
import { cn } from "@/lib/utils";

function SkeletonLoader() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 rounded-xl bg-surface border border-border animate-fade-in">
      <div className="flex gap-4">
        <Skeleton className="w-32 h-24 rounded-lg shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

interface VideoDownloaderFormProps {
  defaultPlatform?: Platform;
  placeholder?: string;
  audioOnly?: boolean;
}

export function VideoDownloaderForm({ defaultPlatform, placeholder, audioOnly }: VideoDownloaderFormProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoInfo | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<Platform>(defaultPlatform || 'unknown');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!defaultPlatform) {
      setDetectedPlatform(detectPlatform(e.target.value));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const url = formData.get("url") as string;
    if (!url) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await getVideoInfo(null, formData);

      if (response?.error) {
        toast({
          title: t("toast.errorTitle"),
          description: response.error,
          variant: "destructive",
        });
        setResult(null);
      } else if (response?.data) {
        setResult(response.data);
      }
    } catch {
      toast({
        title: t("toast.errorTitle"),
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const platformName = PLATFORM_NAMES[detectedPlatform];
  const inputPlaceholder = placeholder || "Paste a video link...";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {audioOnly && <input type="hidden" name="audioOnly" value="true" />}
        <div className="relative flex items-center">
          {/* Platform badge inside input */}
          {platformName && (
            <span className="absolute left-4 text-xs font-medium text-primary z-10 animate-fade-in">
              {platformName}
            </span>
          )}

          <input
            ref={inputRef}
            type="url"
            name="url"
            placeholder={inputPlaceholder}
            required
            disabled={isLoading}
            onChange={handleInputChange}
            className={cn(
              "w-full h-14 rounded-xl bg-surface border border-border text-foreground text-sm",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10",
              "transition-all duration-200",
              "disabled:opacity-50",
              platformName ? "pl-[4.5rem] pr-[120px]" : "pl-4 pr-[120px]"
            )}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "absolute right-2 h-10 px-5 rounded-lg",
              "bg-primary text-primary-foreground text-sm font-medium",
              "hover:opacity-90 active:scale-[0.98]",
              "transition-all duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center gap-2"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Download
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading state */}
      {isLoading && <SkeletonLoader />}

      {/* Result */}
      {result && !isLoading && (
        <div className="mt-8 animate-fade-in">
          <VideoInfoCard video={result} shareUrl={inputRef.current?.value || ''} />
        </div>
      )}
    </div>
  );
}
