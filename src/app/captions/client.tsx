"use client";

import { useState } from "react";
import { Loader2, Copy, Check } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { generateCaption, type GenerateCaptionOutput } from "@/ai/flows/generate-caption";
import { cn } from "@/lib/utils";

const NICHES = [
  { value: "general", label: "General" },
  { value: "comedy", label: "Comedy" },
  { value: "fitness", label: "Fitness" },
  { value: "beauty", label: "Beauty" },
  { value: "food", label: "Food" },
  { value: "gaming", label: "Gaming" },
  { value: "education", label: "Education" },
  { value: "tech", label: "Tech" },
  { value: "business", label: "Business" },
  { value: "travel", label: "Travel" },
  { value: "music", label: "Music" },
  { value: "lifestyle", label: "Lifestyle" },
];

const TONES = [
  { value: "casual", label: "Casual" },
  { value: "funny", label: "Funny" },
  { value: "professional", label: "Professional" },
  { value: "inspirational", label: "Inspirational" },
  { value: "edgy", label: "Edgy" },
  { value: "excited", label: "Excited" },
];

export function CaptionGeneratorClient() {
  const { locale } = useI18n();
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("general");
  const [tone, setTone] = useState("casual");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateCaptionOutput | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const output = await generateCaption({
        topic,
        niche,
        tone,
        includeEmojis: true,
        includeHashtags: true,
        includeCTA: true,
        language: locale,
      });
      setResult(output);
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate captions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
          Caption Generator
        </h1>

        <p className="mt-4 text-base text-muted-foreground text-center max-w-md animate-fade-in-delay-1">
          Generate viral captions for TikTok, Instagram, and YouTube with AI.
        </p>

        {/* Form */}
        <div className="w-full max-w-lg mt-10 space-y-4 animate-fade-in-delay-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Describe your video or content..."
            className={cn(
              "w-full h-14 rounded-xl bg-surface border border-border text-foreground text-sm px-4",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10",
              "transition-all duration-200"
            )}
          />

          <div className="flex gap-3">
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="flex-1 h-10 rounded-lg bg-surface border border-border text-foreground text-sm px-3 focus:outline-none focus:border-primary"
            >
              {NICHES.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="flex-1 h-10 rounded-lg bg-surface border border-border text-foreground text-sm px-3 focus:outline-none focus:border-primary"
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className={cn(
              "w-full h-10 rounded-lg text-sm font-medium",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 active:scale-[0.98]",
              "transition-all duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Captions"
            )}
          </button>
        </div>
      </section>

      {/* Results */}
      {result && (
        <section className="px-6 pb-16 md:pb-24">
          <div className="mx-auto max-w-lg space-y-3">
            {result.captions.map((caption, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-surface border border-border group animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                      {caption.style}
                    </span>
                    <p className="mt-1 text-sm leading-relaxed">{caption.text}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(caption.text, index)}
                    className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {result.suggestedHashtags.length > 0 && (
              <div className="p-4 rounded-xl bg-surface border border-border mt-4">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                  Suggested Hashtags
                </span>
                <p className="mt-1 text-sm text-primary">
                  {result.suggestedHashtags.join(" ")}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
