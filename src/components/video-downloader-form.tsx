
"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { ArrowRight, Link as LinkIcon, Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { getVideoInfo } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { VideoInfoCard } from "./video-info-card";
import { Skeleton } from "./ui/skeleton";
import type { VideoInfo } from "@/lib/types";

const initialState = {
  error: undefined,
  data: undefined,
};

function SubmitButton({ isPending }: { isPending: boolean }) {
  const { t } = useI18n();

  return (
    <Button type="submit" disabled={isPending} size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-lg hover:shadow-primary/40">
      {isPending ? (
        <>
          <Loader2 className="me-2 h-4 w-4 animate-spin" />
          {t('button.loading')}
        </>
      ) : (
        <>
          {t('button.download')}
          <ArrowRight className="ms-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

const SkeletonLoader = () => (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden animate-pulse mt-12 shadow-2xl shadow-primary/10">
        <div className="md:grid md:grid-cols-3">
            <div className="md:col-span-1">
                <Skeleton className="aspect-[9/16] w-full h-full" />
            </div>
            <div className="md:col-span-2">
                <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center my-4">
                            <div>
                                <Skeleton className="h-5 w-12 mx-auto mb-1" />
                                <Skeleton className="h-4 w-16 mx-auto" />
                            </div>
                            <div>
                                <Skeleton className="h-5 w-12 mx-auto mb-1" />
                                <Skeleton className="h-4 w-16 mx-auto" />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                         </div>
                    </div>
                </CardContent>
            </div>
        </div>
    </Card>
);

export function VideoDownloaderForm() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(getVideoInfo, initialState);
  const [result, setResult] = useState<VideoInfo | undefined | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPending) {
        if (state?.error) {
          toast({
            title: t("toast.errorTitle"),
            description: state.error,
            variant: "destructive",
          });
          setResult(null); // Clear previous successful results on error
        } else if (state?.data) {
          setResult(state.data);
        }
    }
  }, [state, isPending, t, toast]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Clear previous results when a new submission starts
    setResult(null); 
    formAction(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="flex flex-col sm:flex-row items-center gap-2 p-4 md:p-6 mb-8 rounded-lg shadow-2xl shadow-primary/10 bg-card/50 backdrop-blur-sm"
      >
        <div className="relative w-full">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="url"
            name="url"
            placeholder={t('inputPlaceholder')}
            required
            className="ps-12 h-14 text-base bg-background/80 focus:bg-background"
            disabled={isPending}
          />
        </div>
        <SubmitButton isPending={isPending} />
      </form>

      <div aria-live="polite">
        {isPending && <SkeletonLoader />}
      </div>
      
      {result && !isPending && (
        <div className="mt-12">
          <VideoInfoCard video={result} shareUrl={inputRef.current?.value || ''} />
        </div>
      )}
    </div>
  );
}
