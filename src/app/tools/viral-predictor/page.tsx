"use client";

import { useState, useEffect } from "react";
import { Flame, Sparkles, TrendingUp, Target, Loader2, AlertCircle, Lightbulb, Zap, MessageSquare, Share2, Eye, Timer, ThumbsUp, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getVideoInfo } from "@/lib/actions";
import { predictViralScore, type PredictViralScoreOutput } from "@/ai/flows/predict-viral-score";
import { cn } from "@/lib/utils";
import type { VideoInfo } from "@/lib/types";

function getScoreColor(score: number): string {
  if (score >= 90) return "from-green-500 to-emerald-500";
  if (score >= 70) return "from-blue-500 to-cyan-500";
  if (score >= 50) return "from-yellow-500 to-orange-500";
  if (score >= 30) return "from-orange-500 to-red-500";
  return "from-red-500 to-rose-500";
}

function getScoreBadge(score: number): { label: string; color: string } {
  if (score >= 90) return { label: "🔥 Viral Hit", color: "bg-green-500" };
  if (score >= 70) return { label: "⚡ High Potential", color: "bg-blue-500" };
  if (score >= 50) return { label: "📈 Average", color: "bg-yellow-500" };
  if (score >= 30) return { label: "📉 Needs Work", color: "bg-orange-500" };
  return { label: "❌ Low Potential", color: "bg-red-500" };
}

export default function ViralPredictorPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  
  const [url, setUrl] = useState("");
  const [roastMode, setRoastMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [prediction, setPrediction] = useState<PredictViralScoreOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: t("tools.viral.errorTitle"),
        description: t("tools.viral.errorEmpty"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setVideoInfo(null);

    try {
      // Step 1: Fetch video info
      setLoadingStep(t("tools.viral.fetchingVideo"));
      const formData = new FormData();
      formData.append("url", url);
      const videoResult = await getVideoInfo(null, formData);

      if (videoResult.error || !videoResult.data) {
        throw new Error(videoResult.error || "Failed to fetch video");
      }

      setVideoInfo(videoResult.data);

      // Step 2: Analyze with AI
      setLoadingStep(t("tools.viral.analyzing"));
      const analysis = await predictViralScore({
        videoTitle: videoResult.data.title,
        videoAuthor: videoResult.data.author,
        likes: videoResult.data.likes,
        duration: videoResult.data.duration,
        mode: roastMode ? "roast" : "standard",
      });

      setPrediction(analysis);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || t("tools.viral.errorAnalyze"));
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const scoreBadge = prediction ? getScoreBadge(prediction.score) : null;

  return (
    <ToolLayout
      titleKey="tools.viral.title"
      descriptionKey="tools.viral.description"
      icon={<Flame className="w-10 h-10" />}
      gradient="from-orange-500 to-red-500"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Input Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              {t("tools.viral.formTitle")}
            </CardTitle>
            <CardDescription>{t("tools.viral.formDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label>{t("tools.viral.urlLabel")}</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("tools.viral.urlPlaceholder")}
                className="h-14 text-lg"
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>

            {/* Roast Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Skull className="w-5 h-5 text-orange-500" />
                <div>
                  <Label className="text-base font-medium">{t("tools.viral.roastMode")}</Label>
                  <p className="text-sm text-muted-foreground">{t("tools.viral.roastModeDesc")}</p>
                </div>
              </div>
              <Switch checked={roastMode} onCheckedChange={setRoastMode} />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !url.trim()}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {loadingStep}
                </>
              ) : (
                <>
                  <Flame className="mr-2 h-5 w-5" />
                  {t("tools.viral.analyze")}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {prediction && videoInfo && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Video Preview */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="aspect-[9/16] md:aspect-auto md:h-full relative">
                    <img
                      src={videoInfo.thumbnailUrl}
                      alt={videoInfo.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-2">{videoInfo.title}</h3>
                      <p className="text-muted-foreground">@{videoInfo.author}</p>
                    </div>
                    <Badge className={cn("text-white", scoreBadge?.color)}>
                      {scoreBadge?.label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <ThumbsUp className="w-4 h-4 text-primary" />
                      <span>{videoInfo.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Timer className="w-4 h-4 text-primary" />
                      <span>{videoInfo.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Score */}
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className={cn("p-1 bg-gradient-to-r", getScoreColor(prediction.score))}>
                <div className="bg-card rounded-lg p-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-medium text-muted-foreground">
                      {t("tools.viral.viralScore")}
                    </h3>
                    <div className={cn(
                      "text-7xl md:text-8xl font-bold font-headline bg-gradient-to-r bg-clip-text text-transparent",
                      getScoreColor(prediction.score)
                    )}>
                      {prediction.score}
                    </div>
                    <Badge className={cn("text-white text-lg px-6 py-2", scoreBadge?.color)}>
                      {prediction.verdict}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Roast (if enabled) */}
            {roastMode && prediction.roast && (
              <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <Skull className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="font-bold text-xl">{t("tools.viral.roastTitle")}</h3>
                  </div>
                  <p className="text-lg italic text-muted-foreground leading-relaxed">
                    "{prediction.roast}"
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hook */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{t("tools.viral.hook")}</span>
                    </div>
                    <Badge variant="outline">{prediction.analysis.hook.score}/100</Badge>
                  </div>
                  <Progress value={prediction.analysis.hook.score} className="h-2 mb-3" />
                  <p className="text-sm text-muted-foreground">{prediction.analysis.hook.feedback}</p>
                </CardContent>
              </Card>

              {/* Content */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">{t("tools.viral.content")}</span>
                    </div>
                    <Badge variant="outline">{prediction.analysis.content.score}/100</Badge>
                  </div>
                  <Progress value={prediction.analysis.content.score} className="h-2 mb-3" />
                  <p className="text-sm text-muted-foreground">{prediction.analysis.content.feedback}</p>
                </CardContent>
              </Card>

              {/* Engagement */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{t("tools.viral.engagement")}</span>
                    </div>
                    <Badge variant="outline">{prediction.analysis.engagement.score}/100</Badge>
                  </div>
                  <Progress value={prediction.analysis.engagement.score} className="h-2 mb-3" />
                  <p className="text-sm text-muted-foreground">{prediction.analysis.engagement.feedback}</p>
                </CardContent>
              </Card>

              {/* Trending */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">{t("tools.viral.trending")}</span>
                    </div>
                    <Badge variant="outline">{prediction.analysis.trending.score}/100</Badge>
                  </div>
                  <Progress value={prediction.analysis.trending.score} className="h-2 mb-3" />
                  <p className="text-sm text-muted-foreground">{prediction.analysis.trending.feedback}</p>
                </CardContent>
              </Card>
            </div>

            {/* Improvements */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  {t("tools.viral.improvements")}
                </CardTitle>
                <CardDescription>{t("tools.viral.improvementsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {prediction.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {idx + 1}
                      </div>
                      <span className="text-muted-foreground">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Share */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500"
                onClick={() => {
                  const text = `My TikTok got a ${prediction.score}/100 viral score! 🔥 Check yours at`;
                  navigator.clipboard.writeText(`${text} ${window.location.href}`);
                  toast({ title: t("share.copied") });
                }}
              >
                <Share2 className="mr-2 h-5 w-5" />
                {t("tools.viral.shareResults")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
