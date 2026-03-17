"use client";

import { useState } from "react";
import { Loader2, Copy, Check } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { generateHashtags, type GenerateHashtagsOutput, type HashtagItem } from "@/ai/flows/generate-hashtags";
import { cn } from "@/lib/utils";

export function HashtagGeneratorClient() {
  const { locale } = useI18n();
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateHashtagsOutput | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const output = await generateHashtags({
        topic,
        language: locale,
        style: "mixed",
      });
      setResult(output);
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate hashtags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAll = async () => {
    if (!result) return;
    const allTags = [
      ...result.trending.map((h) => h.tag),
      ...result.medium.map((h) => h.tag),
      ...result.niche.map((h) => h.tag),
    ].join(" ");
    await navigator.clipboard.writeText(allTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSection = (title: string, items: HashtagItem[]) => {
    if (items.length === 0) return null;
    return (
      <div>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          {title}
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 text-sm"
            >
              <span className="text-primary">{item.tag}</span>
              <span className="text-xs text-muted-foreground">{item.posts}</span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="hero-glow" />

        <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-4 animate-fade-in">
          AI Powered
        </p>

        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-center max-w-2xl animate-fade-in">
          Hashtag Generator
        </h1>

        <p className="mt-4 text-base text-muted-foreground text-center max-w-md animate-fade-in-delay-1">
          Get trending hashtags for any topic to maximize your reach.
        </p>

        {/* Form */}
        <div className="w-full max-w-lg mt-10 animate-fade-in-delay-2">
          <div className="relative flex items-center">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your topic or niche..."
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className={cn(
                "w-full h-14 rounded-xl bg-surface border border-border text-foreground text-sm",
                "pl-4 pr-[140px]",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10",
                "transition-all duration-200"
              )}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
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
                "Generate"
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      {result && (
        <section className="px-6 pb-16 md:pb-24">
          <div className="mx-auto max-w-lg">
            <div className="p-6 rounded-xl bg-surface border border-border space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generated Hashtags</span>
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy All
                    </>
                  )}
                </button>
              </div>

              {renderSection("Trending", result.trending)}
              {renderSection("Medium", result.medium)}
              {renderSection("Niche", result.niche)}

              {result.recommended.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                    Recommended Combo
                  </span>
                  <p className="mt-2 text-sm text-primary">
                    {result.recommended.join(" ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
