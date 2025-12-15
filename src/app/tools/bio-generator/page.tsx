"use client";

import { useState } from "react";
import { User, Sparkles, Copy, Check, Loader2, Wand2, Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { generateBio, type GenerateBioOutput } from "@/ai/flows/generate-bio";
import { cn } from "@/lib/utils";

const NICHES = [
  { value: "comedy", label: "Comedy & Entertainment", icon: "😂" },
  { value: "fitness", label: "Fitness & Health", icon: "💪" },
  { value: "beauty", label: "Beauty & Fashion", icon: "💄" },
  { value: "food", label: "Food & Cooking", icon: "🍳" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
  { value: "music", label: "Music & Dance", icon: "🎵" },
  { value: "education", label: "Education & Tips", icon: "📚" },
  { value: "lifestyle", label: "Lifestyle & Vlog", icon: "✨" },
  { value: "tech", label: "Tech & Gadgets", icon: "📱" },
  { value: "business", label: "Business & Finance", icon: "💼" },
  { value: "travel", label: "Travel & Adventure", icon: "✈️" },
  { value: "art", label: "Art & Creative", icon: "🎨" },
];

const VIBES = [
  { value: "funny", label: "Funny & Playful", icon: "😄" },
  { value: "professional", label: "Professional", icon: "💼" },
  { value: "mysterious", label: "Mysterious & Intriguing", icon: "🌙" },
  { value: "inspirational", label: "Inspirational", icon: "⭐" },
  { value: "sarcastic", label: "Sarcastic & Witty", icon: "😏" },
  { value: "friendly", label: "Friendly & Approachable", icon: "🤗" },
  { value: "bold", label: "Bold & Confident", icon: "🔥" },
  { value: "aesthetic", label: "Aesthetic & Minimal", icon: "🌸" },
];

const MAX_CHARS = 80;

export default function BioGeneratorPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  
  const [niche, setNiche] = useState("comedy");
  const [vibe, setVibe] = useState("funny");
  const [keywords, setKeywords] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateBioOutput | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await generateBio({
        niche,
        vibe,
        keywords,
        language: locale,
      });
      setResult(data);
    } catch (error) {
      console.error("Bio generation failed:", error);
      toast({
        title: t("tools.bio-generator.errorTitle"),
        description: t("tools.bio-generator.errorGenerate"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyBio = (bio: string, index: number) => {
    navigator.clipboard.writeText(bio);
    setCopiedIndex(index);
    toast({
      title: t("share.copied"),
      description: t("tools.bio-generator.copiedDesc"),
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ToolLayout
      titleKey="tools.bio-generator.title"
      descriptionKey="tools.bio-generator.description"
      icon={<User className="w-10 h-10" />}
      gradient="from-pink-500 to-rose-500"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Generator Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Wand2 className="w-6 h-6 text-accent" />
              {t("tools.bio-generator.formTitle")}
            </CardTitle>
            <CardDescription>{t("tools.bio-generator.formDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Niche Select */}
              <div className="space-y-2">
                <Label>{t("tools.bio-generator.nicheLabel")}</Label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NICHES.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.icon} {n.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vibe Select */}
              <div className="space-y-2">
                <Label>{t("tools.bio-generator.vibeLabel")}</Label>
                <Select value={vibe} onValueChange={setVibe}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VIBES.map((v) => (
                      <SelectItem key={v.value} value={v.value}>
                        {v.icon} {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Keywords Input */}
            <div className="space-y-2">
              <Label>{t("tools.bio-generator.keywordsLabel")}</Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={t("tools.bio-generator.keywordsPlaceholder")}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">{t("tools.bio-generator.keywordsHint")}</p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("tools.bio-generator.generating")}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t("tools.bio-generator.generate")}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Generated Bios */}
            <div className="grid grid-cols-1 gap-4">
              {result.bios.map((bio, idx) => (
                <Card 
                  key={idx} 
                  className={cn(
                    "border-0 shadow-lg transition-all hover:shadow-xl cursor-pointer group",
                    copiedIndex === idx && "ring-2 ring-green-500"
                  )}
                  onClick={() => copyBio(bio.text, idx)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {bio.style}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {bio.charCount}/{MAX_CHARS} chars
                          </span>
                        </div>
                        <p className="text-lg font-medium leading-relaxed">
                          {bio.text}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t("tools.bio-generator.suggestedEmojis")}:</span>
                          <span className="text-lg">{bio.emojis}</span>
                        </div>
                        <Progress 
                          value={(bio.charCount / MAX_CHARS) * 100} 
                          className={cn(
                            "h-1",
                            bio.charCount > MAX_CHARS ? "bg-red-200" : ""
                          )} 
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyBio(bio.text, idx);
                        }}
                      >
                        {copiedIndex === idx ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Regenerate Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <RefreshCw className={cn("mr-2 h-5 w-5", isLoading && "animate-spin")} />
                {t("tools.bio-generator.regenerate")}
              </Button>
            </div>

            {/* Tips */}
            <Card className="border-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  {t("tools.bio-generator.tipsTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
