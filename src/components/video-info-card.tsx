
"use client";

import { Download, Film, Heart, Music, Timer, Play, Verified, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import type { VideoInfo } from "@/lib/types";
import { Separator } from "./ui/separator";
import { ShareButtons } from "./share-buttons";
import { AICaptionGenerator } from "./ai-caption-generator";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface VideoInfoCardProps {
  video: VideoInfo;
  shareUrl: string;
}

const Stat = ({ icon: Icon, label, value, gradient }: { icon: React.ElementType; label: string; value: string; gradient: string }) => (
  <div className={cn(
    "flex flex-col items-center gap-2 text-center p-4 rounded-2xl",
    "bg-gradient-to-br from-muted/50 to-muted/20",
    "hover:shadow-premium transition-all duration-300 hover:-translate-y-0.5"
  )}>
    <div className={cn(
      "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
      "bg-gradient-to-br",
      gradient
    )}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div>
      <div className="font-bold text-xl">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  </div>
);

export function VideoInfoCard({ video, shareUrl }: VideoInfoCardProps) {
  const { t } = useI18n();

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden glass border-0 shadow-premium-xl">
      <div className="md:grid md:grid-cols-3">
        {/* Video thumbnail section */}
        <div className="md:col-span-1 relative group">
          <div className="aspect-[9/16] relative w-full h-full bg-muted overflow-hidden">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              data-ai-hint="tiktok dance"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                <Play className="w-10 h-10 text-white fill-white" />
              </div>
            </div>
            
            {/* HD Badge */}
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-primary to-accent border-0 shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              HD Quality
            </Badge>
          </div>
        </div>
        
        {/* Content section */}
        <div className="md:col-span-2 relative">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
          
          <CardHeader className="relative pb-4">
            <div className="flex items-start gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                TikTok Video
              </Badge>
            </div>
            <CardTitle className="font-headline text-2xl leading-tight line-clamp-2">
              {video.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-base">
              <span>{t('videoInfo.by')}</span>
              <span className="font-semibold text-foreground flex items-center gap-1">
                {video.author}
                <Verified className="w-4 h-4 text-primary" />
              </span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Stat 
                icon={Heart} 
                label={t('videoInfo.likes')} 
                value={video.likes}
                gradient="from-pink-500 to-rose-500"
              />
              <Stat 
                icon={Timer} 
                label={t('videoInfo.duration')} 
                value={video.duration}
                gradient="from-blue-500 to-cyan-500"
              />
            </div>

            <Separator className="bg-border/50" />

            {/* Download buttons */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Download Options
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button 
                  asChild 
                  size="lg" 
                  className={cn(
                    "bg-gradient-to-r from-primary to-accent hover:opacity-90",
                    "shadow-lg hover:shadow-xl hover:shadow-primary/30",
                    "transition-all duration-300 hover:-translate-y-0.5",
                    "h-12 rounded-xl"
                  )}
                >
                  <a href={video.hdLink} download target="_blank" rel="noopener noreferrer">
                    <Download className="me-2 h-5 w-5" />
                    {t('videoInfo.downloadHD')}
                  </a>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="secondary"
                  className="h-12 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <a href={video.watermarkedLink} download target="_blank" rel="noopener noreferrer">
                    <Film className="me-2 h-5 w-5" />
                    {t('videoInfo.downloadWatermarked')}
                  </a>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="secondary"
                  className="h-12 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <a href={video.audioLink} download target="_blank" rel="noopener noreferrer">
                    <Music className="me-2 h-5 w-5" />
                    {t('videoInfo.downloadAudio')}
                  </a>
                </Button>
              </div>
            </div>
            
            <ShareButtons shareUrl={shareUrl} videoTitle={video.title} />

            <AICaptionGenerator video={video} />
            
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
