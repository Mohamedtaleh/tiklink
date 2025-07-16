"use client";

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/hooks/use-i18n';
import { generateShareableCaption } from '@/ai/flows/generate-shareable-caption';
import type { VideoInfo } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

interface AICaptionGeneratorProps {
  video: VideoInfo;
}

export function AICaptionGenerator({ video }: AICaptionGeneratorProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    setError(null);
    setCaption(null);
    try {
      const result = await generateShareableCaption({
        videoTitle: video.title,
        videoAuthor: video.author,
        originalCaption: video.caption,
      });
      setCaption(result.shareableCaption);
    } catch (e) {
      setError(t('aiCaption.error'));
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-headline">{t('aiCaption.title')}</CardTitle>
          <Button onClick={handleGenerateClick} disabled={isLoading} size="sm">
            <Wand2 className="me-2 h-4 w-4" />
            {isLoading ? t('aiCaption.buttonLoading') : t('aiCaption.button')}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {caption && <p className="text-sm text-muted-foreground italic">"{caption}"</p>}
          {!isLoading && !caption && !error && (
            <p className="text-sm text-muted-foreground">{t('aiCaption.description')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
