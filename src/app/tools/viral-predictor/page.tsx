"use client";

import { useState } from "react";
import { Flame, Sparkles, TrendingUp, Target, Loader2, AlertCircle, Lightbulb, Zap, MessageSquare, Share2, Eye, Timer, ThumbsUp, Skull, BarChart3, Clock, Music, Hash, Star, CheckCircle2, XCircle, Trophy, Gauge } from "lucide-react";
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

interface EnhancedMetrics {
  watchTimeScore: number;
  durationOptimal: boolean;
  engagementRate: number;
  likesToViewRatio: number;
  viralVelocity: string;
  predictedViews: string;
  contentType: string;
  audienceMatch: number;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "from-green-500 to-emerald-500";
  if (score >= 70) return "from-blue-500 to-cyan-500";
  if (score >= 50) return "from-yellow-500 to-orange-500";
  if (score >= 30) return "from-orange-500 to-red-500";
  return "from-red-500 to-rose-500";
}

function getScoreGradient(score: number): string {
  if (score >= 90) return "bg-gradient-to-r from-green-500 to-emerald-500";
  if (score >= 70) return "bg-gradient-to-r from-blue-500 to-cyan-500";
  if (score >= 50) return "bg-gradient-to-r from-yellow-500 to-orange-500";
  if (score >= 30) return "bg-gradient-to-r from-orange-500 to-red-500";
  return "bg-gradient-to-r from-red-500 to-rose-500";
}

function getScoreBadge(score: number): { label: string; color: string; icon: string } {
  if (score >= 90) return { label: "Viral Potential", color: "bg-green-500", icon: "🔥" };
  if (score >= 70) return { label: "High Potential", color: "bg-blue-500", icon: "⚡" };
  if (score >= 50) return { label: "Moderate", color: "bg-yellow-500", icon: "📈" };
  if (score >= 30) return { label: "Needs Improvement", color: "bg-orange-500", icon: "📉" };
  return { label: "Low Potential", color: "bg-red-500", icon: "❌" };
}

function parseDuration(duration: string): number {
  // Parse duration like "0:45" or "1:30" to seconds
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

function parseLikes(likes: string): number {
  const lower = likes.toLowerCase().replace(/,/g, "");
  if (lower.includes("m")) return parseFloat(lower) * 1000000;
  if (lower.includes("k")) return parseFloat(lower) * 1000;
  return parseFloat(lower) || 0;
}

function calculateEnhancedMetrics(videoInfo: VideoInfo, prediction: PredictViralScoreOutput): EnhancedMetrics {
  const durationSecs = parseDuration(videoInfo.duration);
  const likesNum = parseLikes(videoInfo.likes);
  
  // Optimal TikTok duration is 15-60 seconds for discoverability
  const durationOptimal = durationSecs >= 15 && durationSecs <= 60;
  
  // Watch time score based on duration optimization
  let watchTimeScore = 70;
  if (durationSecs >= 15 && durationSecs <= 30) watchTimeScore = 95;
  else if (durationSecs > 30 && durationSecs <= 60) watchTimeScore = 85;
  else if (durationSecs > 60 && durationSecs <= 180) watchTimeScore = 70;
  else if (durationSecs < 15) watchTimeScore = 60;
  else watchTimeScore = 50;
  
  // Estimate engagement rate (likes are typically 3-8% of views for viral content)
  const estimatedViews = likesNum / 0.05; // Assume 5% like rate
  const engagementRate = 5 + (prediction.score / 20); // 5-10% based on score
  const likesToViewRatio = 5 + (prediction.score / 25);
  
  // Viral velocity estimate
  let viralVelocity = "Slow";
  if (prediction.score >= 90) viralVelocity = "Explosive 🚀";
  else if (prediction.score >= 70) viralVelocity = "Fast ⚡";
  else if (prediction.score >= 50) viralVelocity = "Moderate 📈";
  else if (prediction.score >= 30) viralVelocity = "Slow 🐢";
  else viralVelocity = "Very Slow 🐌";
  
  // Predicted views based on score
  let predictedViews = "1K - 5K";
  if (prediction.score >= 90) predictedViews = "1M - 10M+";
  else if (prediction.score >= 80) predictedViews = "500K - 1M";
  else if (prediction.score >= 70) predictedViews = "100K - 500K";
  else if (prediction.score >= 60) predictedViews = "50K - 100K";
  else if (prediction.score >= 50) predictedViews = "10K - 50K";
  else if (prediction.score >= 40) predictedViews = "5K - 10K";
  
  // Content type detection
  let contentType = "Entertainment";
  const titleLower = videoInfo.title.toLowerCase();
  if (titleLower.includes("tutorial") || titleLower.includes("how to") || titleLower.includes("learn")) contentType = "Educational";
  else if (titleLower.includes("recipe") || titleLower.includes("cook") || titleLower.includes("food")) contentType = "Food";
  else if (titleLower.includes("workout") || titleLower.includes("fitness") || titleLower.includes("gym")) contentType = "Fitness";
  else if (titleLower.includes("makeup") || titleLower.includes("beauty") || titleLower.includes("skincare")) contentType = "Beauty";
  else if (titleLower.includes("dance") || titleLower.includes("music") || titleLower.includes("song")) contentType = "Music/Dance";
  else if (titleLower.includes("funny") || titleLower.includes("comedy") || titleLower.includes("lol")) contentType = "Comedy";
  
  // Audience match score
  const audienceMatch = Math.min(100, 60 + prediction.score * 0.4);
  
  return {
    watchTimeScore,
    durationOptimal,
    engagementRate,
    likesToViewRatio,
    viralVelocity,
    predictedViews,
    contentType,
    audienceMatch,
  };
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
  const [enhancedMetrics, setEnhancedMetrics] = useState<EnhancedMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: t("tools.viral-predictor.errorTitle"),
        description: t("tools.viral-predictor.errorEmpty"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setVideoInfo(null);
    setEnhancedMetrics(null);

    try {
      // Step 1: Fetch video info
      setLoadingStep("Fetching video data...");
      const formData = new FormData();
      formData.append("url", url);
      const videoResult = await getVideoInfo(null, formData);

      if (videoResult.error || !videoResult.data) {
        throw new Error(videoResult.error || "Failed to fetch video");
      }

      setVideoInfo(videoResult.data);

      // Step 2: Analyze with AI
      setLoadingStep("Running AI analysis...");
      const analysis = await predictViralScore({
        videoTitle: videoResult.data.title,
        videoAuthor: videoResult.data.author,
        likes: videoResult.data.likes,
        duration: videoResult.data.duration,
        mode: roastMode ? "roast" : "standard",
      });

      setPrediction(analysis);
      
      // Step 3: Calculate enhanced metrics
      setLoadingStep("Calculating metrics...");
      const metrics = calculateEnhancedMetrics(videoResult.data, analysis);
      setEnhancedMetrics(metrics);
      
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || t("tools.viral-predictor.errorAnalyze"));
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const scoreBadge = prediction ? getScoreBadge(prediction.score) : null;

  return (
    <ToolLayout
      titleKey="tools.viral-predictor.title"
      descriptionKey="tools.viral-predictor.description"
      icon={<Flame className="w-10 h-10" />}
      gradient="from-orange-500 to-red-500"
      toolId="viral-predictor"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="outline" className="px-4 py-2">
            <BarChart3 className="w-4 h-4 mr-2" />
            AI Analysis
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Gauge className="w-4 h-4 mr-2" />
            10+ Metrics
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Predictions
          </Badge>
        </div>

        {/* Input Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              {t("tools.viral-predictor.formTitle")}
            </CardTitle>
            <CardDescription>Get comprehensive analysis with view predictions and optimization tips</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                TikTok Video URL
              </Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@username/video/..."
                className="h-14 text-lg"
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>

            {/* Roast Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10">
              <div className="flex items-center gap-3">
                <Skull className="w-5 h-5 text-orange-500" />
                <div>
                  <Label className="text-base font-medium">{t("tools.viral-predictor.roastMode")}</Label>
                  <p className="text-sm text-muted-foreground">Get brutally honest feedback (viewer discretion advised)</p>
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
                  Analyze Viral Potential
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
        {prediction && videoInfo && enhancedMetrics && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Video Preview + Main Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Preview */}
              <Card className="overflow-hidden border-0 shadow-xl lg:col-span-1">
                <div className="aspect-[9/16] relative">
                  <img
                    src={videoInfo.thumbnailUrl}
                    alt={videoInfo.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-medium text-sm line-clamp-2">{videoInfo.title}</p>
                    <p className="text-white/70 text-xs">@{videoInfo.author}</p>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-black/50 text-white">
                    <Timer className="w-3 h-3 mr-1" />
                    {videoInfo.duration}
                  </Badge>
                </div>
              </Card>

              {/* Main Score */}
              <Card className="overflow-hidden border-0 shadow-2xl lg:col-span-2">
                <div className={cn("p-1", getScoreGradient(prediction.score))}>
                  <div className="bg-card rounded-lg p-8">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl">{scoreBadge?.icon}</span>
                        <Badge className={cn("text-white text-lg px-6 py-2", scoreBadge?.color)}>
                          {scoreBadge?.label}
                        </Badge>
                      </div>
                      <div className={cn(
                        "text-7xl md:text-8xl font-bold font-headline bg-gradient-to-r bg-clip-text text-transparent",
                        getScoreColor(prediction.score)
                      )}>
                        {prediction.score}
                        <span className="text-3xl text-muted-foreground">/100</span>
                      </div>
                      <p className="text-xl text-muted-foreground">{prediction.verdict}</p>
                      
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{enhancedMetrics.predictedViews}</p>
                          <p className="text-xs text-muted-foreground">Predicted Views</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{enhancedMetrics.viralVelocity}</p>
                          <p className="text-xs text-muted-foreground">Viral Speed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{enhancedMetrics.engagementRate.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">Est. Engagement</p>
                        </div>
                        <div className="text-center">
                          <Badge variant="outline" className="text-sm">{enhancedMetrics.contentType}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">Content Type</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Roast (if enabled) */}
            {roastMode && prediction.roast && (
              <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-orange-500/20">
                      <Skull className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="font-bold text-xl">The Roast 🔥</h3>
                  </div>
                  <p className="text-lg italic text-muted-foreground leading-relaxed border-l-4 border-orange-500 pl-4">
                    "{prediction.roast}"
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Detailed Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className={cn(
                "border-0 shadow-lg",
                enhancedMetrics.durationOptimal ? "bg-green-500/5" : "bg-yellow-500/5"
              )}>
                <CardContent className="pt-6 text-center">
                  <Clock className={cn(
                    "w-8 h-8 mx-auto mb-2",
                    enhancedMetrics.durationOptimal ? "text-green-500" : "text-yellow-500"
                  )} />
                  <p className="font-bold text-lg">{videoInfo.duration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <Badge className={cn(
                    "mt-2",
                    enhancedMetrics.durationOptimal ? "bg-green-500" : "bg-yellow-500"
                  )}>
                    {enhancedMetrics.durationOptimal ? "Optimal" : "Review Length"}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-blue-500/5">
                <CardContent className="pt-6 text-center">
                  <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-bold text-lg">{videoInfo.likes}</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                  <Badge className="mt-2 bg-blue-500">
                    {enhancedMetrics.likesToViewRatio.toFixed(1)}% Rate
                  </Badge>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-purple-500/5">
                <CardContent className="pt-6 text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="font-bold text-lg">{enhancedMetrics.watchTimeScore}%</p>
                  <p className="text-xs text-muted-foreground">Watch Score</p>
                  <Progress value={enhancedMetrics.watchTimeScore} className="mt-2 h-1" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-pink-500/5">
                <CardContent className="pt-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                  <p className="font-bold text-lg">{enhancedMetrics.audienceMatch.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">Audience Match</p>
                  <Progress value={enhancedMetrics.audienceMatch} className="mt-2 h-1" />
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Content Analysis
                </CardTitle>
                <CardDescription>Detailed breakdown of your video's viral factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hook */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Hook Strength</span>
                      </div>
                      <Badge variant="outline" className="font-bold">{prediction.analysis.hook.score}/100</Badge>
                    </div>
                    <Progress value={prediction.analysis.hook.score} className="h-3" />
                    <p className="text-sm text-muted-foreground">{prediction.analysis.hook.feedback}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {prediction.analysis.hook.score >= 70 ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span className={prediction.analysis.hook.score >= 70 ? "text-green-500" : "text-red-500"}>
                        {prediction.analysis.hook.score >= 70 ? "Strong hook" : "Hook needs work"}
                      </span>
                    </div>
                  </div>

                  {/* Content Quality */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">Content Quality</span>
                      </div>
                      <Badge variant="outline" className="font-bold">{prediction.analysis.content.score}/100</Badge>
                    </div>
                    <Progress value={prediction.analysis.content.score} className="h-3" />
                    <p className="text-sm text-muted-foreground">{prediction.analysis.content.feedback}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {prediction.analysis.content.score >= 70 ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span className={prediction.analysis.content.score >= 70 ? "text-green-500" : "text-red-500"}>
                        {prediction.analysis.content.score >= 70 ? "High quality" : "Quality could improve"}
                      </span>
                    </div>
                  </div>

                  {/* Engagement Potential */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Engagement Potential</span>
                      </div>
                      <Badge variant="outline" className="font-bold">{prediction.analysis.engagement.score}/100</Badge>
                    </div>
                    <Progress value={prediction.analysis.engagement.score} className="h-3" />
                    <p className="text-sm text-muted-foreground">{prediction.analysis.engagement.feedback}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {prediction.analysis.engagement.score >= 70 ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span className={prediction.analysis.engagement.score >= 70 ? "text-green-500" : "text-red-500"}>
                        {prediction.analysis.engagement.score >= 70 ? "Will drive engagement" : "Add engagement triggers"}
                      </span>
                    </div>
                  </div>

                  {/* Trending Alignment */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">Trend Alignment</span>
                      </div>
                      <Badge variant="outline" className="font-bold">{prediction.analysis.trending.score}/100</Badge>
                    </div>
                    <Progress value={prediction.analysis.trending.score} className="h-3" />
                    <p className="text-sm text-muted-foreground">{prediction.analysis.trending.feedback}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {prediction.analysis.trending.score >= 70 ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span className={prediction.analysis.trending.score >= 70 ? "text-green-500" : "text-red-500"}>
                        {prediction.analysis.trending.score >= 70 ? "Trend-aligned" : "Consider trending elements"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Improvements */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Actionable Improvements
                </CardTitle>
                <CardDescription>Apply these changes to boost your viral potential</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prediction.improvements.map((improvement, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-muted-foreground">{improvement}</span>
                        <div className="flex items-center gap-1 mt-2">
                          <Zap className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-yellow-500">
                            +{Math.round((100 - prediction.score) / (prediction.improvements.length) * (1 + idx * 0.1))} potential points
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Viral Checklist */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500/5 to-emerald-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Viral Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: "Strong hook in first 3 seconds", check: prediction.analysis.hook.score >= 70 },
                    { label: "Optimal video length (15-60s)", check: enhancedMetrics.durationOptimal },
                    { label: "High engagement potential", check: prediction.analysis.engagement.score >= 70 },
                    { label: "Trend-aligned content", check: prediction.analysis.trending.score >= 70 },
                    { label: "Quality production value", check: prediction.analysis.content.score >= 70 },
                    { label: "Clear call-to-action", check: prediction.score >= 60 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      {item.check ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={item.check ? "text-foreground" : "text-muted-foreground"}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500"
                onClick={() => {
                  const text = `My TikTok got a ${prediction.score}/100 viral score! ${scoreBadge?.icon} Predicted views: ${enhancedMetrics.predictedViews}. Check yours at`;
                  navigator.clipboard.writeText(`${text} ${window.location.href}`);
                  toast({ title: t("share.copied") });
                }}
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share My Analysis
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
