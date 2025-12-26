"use client";

import { useState } from "react";
import { MessageSquare, Sparkles, Copy, Check, Loader2, Zap, Hash, Heart, Target, RefreshCw, Star, TrendingUp, Lightbulb, BarChart3, Gauge, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { generateCaption, type GenerateCaptionOutput } from "@/ai/flows/generate-caption";
import { cn } from "@/lib/utils";

const NICHES = [
  { value: "general", label: "General/Entertainment", icon: "🎭" },
  { value: "comedy", label: "Comedy & Humor", icon: "😂" },
  { value: "fitness", label: "Fitness & Health", icon: "💪" },
  { value: "beauty", label: "Beauty & Skincare", icon: "💄" },
  { value: "fashion", label: "Fashion & Style", icon: "👗" },
  { value: "food", label: "Food & Cooking", icon: "🍳" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
  { value: "music", label: "Music & Dance", icon: "🎵" },
  { value: "education", label: "Education & Tips", icon: "📚" },
  { value: "lifestyle", label: "Lifestyle & Vlog", icon: "✨" },
  { value: "tech", label: "Tech & Gadgets", icon: "📱" },
  { value: "business", label: "Business & Finance", icon: "💼" },
  { value: "travel", label: "Travel & Adventure", icon: "✈️" },
  { value: "pets", label: "Pets & Animals", icon: "🐕" },
  { value: "motivation", label: "Motivation & Self-Help", icon: "🚀" },
];

const TONES = [
  { value: "casual", label: "Casual & Friendly", icon: "😊", desc: "Relaxed, conversational vibe" },
  { value: "funny", label: "Funny & Playful", icon: "😂", desc: "Humorous, light-hearted" },
  { value: "professional", label: "Professional", icon: "💼", desc: "Polished, authoritative" },
  { value: "inspirational", label: "Inspirational", icon: "⭐", desc: "Motivating, uplifting" },
  { value: "edgy", label: "Edgy & Bold", icon: "🔥", desc: "Provocative, attention-grabbing" },
  { value: "mysterious", label: "Mysterious", icon: "🌙", desc: "Intriguing, curiosity-driven" },
  { value: "excited", label: "Excited & Energetic", icon: "⚡", desc: "High energy, enthusiastic" },
  { value: "sarcastic", label: "Sarcastic & Witty", icon: "😏", desc: "Clever, dry humor" },
];

const HOOK_STYLES = [
  "Curiosity Hook - Creates mystery and intrigue",
  "POV Hook - Puts viewer in the story",
  "List Hook - Numbers grab attention",
  "Story Hook - Personal narrative",
  "Controversial Hook - Bold opinions",
];

export default function CaptionGeneratorPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();

  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("general");
  const [tone, setTone] = useState("casual");
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateCaptionOutput | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [customCaption, setCustomCaption] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic or video idea",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await generateCaption({
        topic: topic.trim(),
        niche,
        tone,
        includeEmojis,
        includeHashtags,
        includeCTA,
        language: locale,
      });
      setResult(data);

      if (data.debug?.usedFallback) {
        toast({
          title: "⚠️ Using cached results",
          description: data.debug.error || "AI service unavailable, showing sample captions",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Caption generation failed:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCaption = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: "Caption copied!",
      description: "Paste it in your TikTok post",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyWithHashtags = (text: string) => {
    const hashtags = result?.suggestedHashtags.join(" ") || "";
    navigator.clipboard.writeText(`${text}\n\n${hashtags}`);
    toast({
      title: "Caption + Hashtags copied!",
      description: "Ready to paste in TikTok",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    return "text-orange-500";
  };

  const selectedNiche = NICHES.find((n) => n.value === niche);
  const selectedTone = TONES.find((t) => t.value === tone);

  return (
    <ToolLayout
      titleKey="tools.caption-generator.title"
      descriptionKey="tools.caption-generator.description"
      icon={<MessageSquare className="w-10 h-10" />}
      gradient="from-violet-500 to-purple-500"
      toolId="caption-generator"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="outline" className="px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Hook Analysis
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Gauge className="w-4 h-4 mr-2" />
            Engagement Scores
          </Badge>
        </div>

        {/* Generator Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Generate Viral Captions
            </CardTitle>
            <CardDescription>Create engaging captions with proven hook formulas</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Video Topic or Idea
              </Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., morning routine, cooking tips, fitness transformation, makeup tutorial..."
                className="h-14 text-lg"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <p className="text-xs text-muted-foreground">
                Describe your video content or the topic you're posting about
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Niche Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Content Niche
                </Label>
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

              {/* Tone Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Caption Tone
                </Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.icon} {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTone && (
                  <p className="text-xs text-muted-foreground">{selectedTone.desc}</p>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="text-xl">😀</span>
                  <Label>Include Emojis</Label>
                </div>
                <Switch checked={includeEmojis} onCheckedChange={setIncludeEmojis} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-blue-500" />
                  <Label>Include Hashtags</Label>
                </div>
                <Switch checked={includeHashtags} onCheckedChange={setIncludeHashtags} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <Label>Include CTA</Label>
                </div>
                <Switch checked={includeCTA} onCheckedChange={setIncludeCTA} />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Viral Captions...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate 5 Viral Captions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Hook Styles Info */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-1">
                <div className="bg-card rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-violet-500" />
                    <h3 className="font-bold">5 Proven Hook Styles Generated</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {HOOK_STYLES.map((style, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {style.split(" - ")[0]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Generated Captions */}
            <div className="space-y-4">
              {result.captions.map((caption, idx) => (
                <Card
                  key={idx}
                  className={cn(
                    "border-0 shadow-lg transition-all hover:shadow-xl cursor-pointer group relative overflow-hidden",
                    copiedIndex === idx && "ring-2 ring-green-500"
                  )}
                  onClick={() => copyCaption(caption.text, idx)}
                >
                  {idx === 0 && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-none rounded-bl-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Star className="w-3 h-3 mr-1" />
                        Top Pick
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400">
                            {caption.style}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {caption.charCount} characters
                          </span>
                        </div>

                        <p className="text-lg font-medium leading-relaxed">
                          {caption.text}
                        </p>

                        {/* Scores */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Hook Strength
                              </span>
                              <span className={cn("font-bold", getScoreColor(caption.hookStrength))}>
                                {caption.hookStrength}%
                              </span>
                            </div>
                            <Progress value={caption.hookStrength} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Engagement Score
                              </span>
                              <span className={cn("font-bold", getScoreColor(caption.engagementScore))}>
                                {caption.engagementScore}%
                              </span>
                            </div>
                            <Progress value={caption.engagementScore} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyCaption(caption.text, idx);
                          }}
                        >
                          {copiedIndex === idx ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </Button>
                        {includeHashtags && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyWithHashtags(caption.text);
                            }}
                          >
                            <Hash className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Suggested Hashtags */}
            {includeHashtags && result.suggestedHashtags.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Hash className="w-5 h-5 text-blue-500" />
                    Suggested Hashtags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedHashtags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 cursor-pointer px-3 py-1.5"
                        onClick={() => {
                          navigator.clipboard.writeText(tag);
                          toast({ title: `${tag} copied!` });
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(result.suggestedHashtags.join(" "));
                        toast({ title: "All hashtags copied!" });
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Editor */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Edit3 className="w-5 h-5 text-primary" />
                  Customize Your Caption
                </CardTitle>
                <CardDescription>Edit and perfect your caption before posting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  placeholder="Paste a caption here to edit, or write your own..."
                  className="min-h-[100px] text-lg"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {customCaption.length} characters
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!customCaption}
                    onClick={() => {
                      navigator.clipboard.writeText(customCaption);
                      toast({ title: "Custom caption copied!" });
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Regenerate Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <RefreshCw className={cn("mr-2 h-5 w-5", isLoading && "animate-spin")} />
                Generate More Captions
              </Button>
            </div>

            {/* Tips */}
            <Card className="border-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Caption Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      {tip}
                    </div>
                  ))}
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    The first 3-5 words are crucial - make them count
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    Test different caption lengths - sometimes shorter is better
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
