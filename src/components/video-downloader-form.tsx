
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Sparkles, Search } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { getVideoInfo } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { VideoInfoCard } from "./video-info-card";
import { Skeleton } from "./ui/skeleton";
import type { VideoInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

function SubmitButton({ isPending }: { isPending: boolean }) {
  const { t } = useI18n();

  return (
    <Button 
      type="submit" 
      disabled={isPending} 
      size="lg" 
      className={cn(
        "w-full sm:w-auto min-w-[160px] h-14 px-8",
        "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90",
        "text-primary-foreground font-bold text-base",
        "shadow-lg hover:shadow-xl hover:shadow-primary/30",
        "transition-all duration-300 hover:-translate-y-0.5",
        "rounded-xl"
      )}
    >
      {isPending ? (
        <>
          <Loader2 className="me-2 h-5 w-5 animate-spin" />
          {t('button.loading')}
        </>
      ) : (
        <>
          <Sparkles className="me-2 h-5 w-5" />
          {t('button.download')}
        </>
      )}
    </Button>
  );
}

const SkeletonLoader = () => (
  <Card className="w-full max-w-4xl mx-auto overflow-hidden mt-12 glass border-0 shadow-premium-xl">
    <div className="md:grid md:grid-cols-3">
      <div className="md:col-span-1 relative">
        <Skeleton className="aspect-[9/16] w-full h-full bg-gradient-to-br from-muted to-muted/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </div>
      <div className="md:col-span-2">
        <CardHeader>
          <Skeleton className="h-7 w-3/4 mb-3 rounded-lg" />
          <Skeleton className="h-5 w-1/2 rounded-lg" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 text-center my-6">
              <div className="p-4 rounded-xl bg-muted/50">
                <Skeleton className="h-6 w-16 mx-auto mb-2 rounded-lg" />
                <Skeleton className="h-4 w-20 mx-auto rounded-lg" />
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <Skeleton className="h-6 w-16 mx-auto mb-2 rounded-lg" />
                <Skeleton className="h-4 w-20 mx-auto rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
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
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    } catch (error) {
      toast({
        title: t("toast.errorTitle"),
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className={cn(
          "relative flex flex-col sm:flex-row items-center gap-3 p-3 md:p-4 mb-8",
          "rounded-2xl bg-card/80 backdrop-blur-xl",
          "shadow-premium-lg transition-all duration-300",
          isFocused && "shadow-premium-xl ring-2 ring-primary/20"
        )}
      >
        {/* Animated background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5",
            "animate-gradient opacity-50"
          )} />
        </div>
        
        <div className="relative w-full z-10">
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors",
            isFocused ? "bg-primary/10" : "bg-muted"
          )}>
            <Search className={cn(
              "h-5 w-5 transition-colors",
              isFocused ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <Input
            ref={inputRef}
            type="url"
            name="url"
            placeholder={t('inputPlaceholder')}
            required
            className={cn(
              "ps-16 pe-4 h-14 text-base rounded-xl border-2",
              "bg-background/90 hover:bg-background focus:bg-background",
              "border-transparent focus:border-primary/30",
              "placeholder:text-muted-foreground/60",
              "transition-all duration-200"
            )}
            disabled={isLoading}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <div className="z-10 w-full sm:w-auto">
          <SubmitButton isPending={isLoading} />
        </div>
      </form>

      <div aria-live="polite">
        {isLoading && <SkeletonLoader />}
      </div>
      
      {result && !isLoading && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <VideoInfoCard video={result} shareUrl={inputRef.current?.value || ''} />
        </div>
      )}
    </div>
  );
}
