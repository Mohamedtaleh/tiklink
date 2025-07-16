
"use client";

import { Download, Film, Heart, Music, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import type { VideoInfo } from "@/lib/types";
import { Separator } from "./ui/separator";
import { ShareButtons } from "./share-buttons";
import { AICaptionGenerator } from "./ai-caption-generator";

interface VideoInfoCardProps {
  video: VideoInfo;
  shareUrl: string;
}

const Stat = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <div className="text-sm font-medium text-muted-foreground">{label}</div>
    <div className="flex items-center gap-1.5 font-bold text-lg">
      <Icon className="h-5 w-5 text-primary" />
      <span>{value}</span>
    </div>
  </div>
);

export function VideoInfoCard({ video, shareUrl }: VideoInfoCardProps) {
  const { t } = useI18n();

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-2xl shadow-primary/10 animate-in fade-in-50 duration-500 bg-card/50 backdrop-blur-sm">
      <div className="md:grid md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="aspect-[9/16] relative w-full h-full bg-muted">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="object-cover w-full h-full"
              loading="lazy"
              data-ai-hint="tiktok dance"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{video.title}</CardTitle>
            <CardDescription>{t('videoInfo.by')} {video.author}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center my-4">
              <Stat icon={Heart} label={t('videoInfo.likes')} value={video.likes} />
              <Stat icon={Timer} label={t('videoInfo.duration')} value={video.duration} />
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button asChild size="lg"><a href={video.hdLink} download target="_blank" rel="noopener noreferrer"><Download className="me-2" /> {t('videoInfo.downloadHD')}</a></Button>
                <Button asChild size="lg" variant="secondary"><a href={video.watermarkedLink} download target="_blank" rel="noopener noreferrer"><Film className="me-2" /> {t('videoInfo.downloadWatermarked')}</a></Button>
                <Button asChild size="lg" variant="secondary"><a href={video.audioLink} download target="_blank" rel="noopener noreferrer"><Music className="me-2" /> {t('videoInfo.downloadAudio')}</a></Button>
            </div>
            
            <ShareButtons shareUrl={shareUrl} videoTitle={video.title} />

            <AICaptionGenerator video={video} />
            
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
