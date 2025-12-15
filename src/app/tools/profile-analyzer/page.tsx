"use client";

import { useState } from "react";
import { User, BarChart3, TrendingUp, Heart, Eye, Users, Loader2, Target, Award, Calendar, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { cn } from "@/lib/utils";

interface ProfileAnalysis {
  username: string;
  displayName: string;
  followers: number;
  following: number;
  likes: number;
  videos: number;
  engagementRate: number;
  avgViews: number;
  avgLikes: number;
  tier: string;
  tierColor: string;
  scores: {
    engagement: number;
    consistency: number;
    growth: number;
    quality: number;
  };
  strengths: string[];
  improvements: string[];
  bestPostingTimes: string[];
  estimatedReach: number;
}

function generateMockAnalysis(username: string): ProfileAnalysis {
  // Generate realistic-looking mock data based on username
  const seed = username.length * 1000;
  const followers = Math.floor((Math.random() * seed * 100) + 10000);
  const following = Math.floor(Math.random() * 500 + 100);
  const videos = Math.floor(Math.random() * 200 + 20);
  const likes = Math.floor(followers * (Math.random() * 10 + 5));
  const engagementRate = Math.random() * 15 + 2;
  const avgViews = Math.floor(followers * (Math.random() * 0.3 + 0.1));
  const avgLikes = Math.floor(avgViews * (Math.random() * 0.15 + 0.05));

  let tier = "Rising Star";
  let tierColor = "bg-blue-500";
  
  if (followers >= 10000000) {
    tier = "Mega Influencer";
    tierColor = "bg-gradient-to-r from-purple-500 to-pink-500";
  } else if (followers >= 1000000) {
    tier = "Macro Influencer";
    tierColor = "bg-gradient-to-r from-orange-500 to-red-500";
  } else if (followers >= 100000) {
    tier = "Mid-Tier Creator";
    tierColor = "bg-gradient-to-r from-green-500 to-emerald-500";
  } else if (followers >= 10000) {
    tier = "Micro Influencer";
    tierColor = "bg-gradient-to-r from-blue-500 to-cyan-500";
  }

  return {
    username,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    followers,
    following,
    likes,
    videos,
    engagementRate: Math.round(engagementRate * 100) / 100,
    avgViews,
    avgLikes,
    tier,
    tierColor,
    scores: {
      engagement: Math.floor(Math.random() * 30 + 70),
      consistency: Math.floor(Math.random() * 40 + 50),
      growth: Math.floor(Math.random() * 35 + 55),
      quality: Math.floor(Math.random() * 25 + 65),
    },
    strengths: [
      "Strong engagement rate above industry average",
      "Consistent posting schedule",
      "High-quality video production",
    ],
    improvements: [
      "Consider posting during peak hours (6-9 PM)",
      "Add more trending sounds to videos",
      "Engage more with comments in first hour",
      "Try longer-form content (60+ seconds)",
    ],
    bestPostingTimes: ["Tuesday 7PM", "Thursday 8PM", "Saturday 6PM"],
    estimatedReach: Math.floor(followers * 1.5),
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default function ProfileAnalyzerPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!username.trim()) {
      toast({
        title: t("tools.profile-analyzer.errorTitle"),
        description: t("tools.profile-analyzer.errorEmpty"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const cleanUsername = username.replace("@", "").trim();
    const result = generateMockAnalysis(cleanUsername);
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <ToolLayout
      titleKey="tools.profile-analyzer.title"
      descriptionKey="tools.profile-analyzer.description"
      icon={<BarChart3 className="w-10 h-10" />}
      gradient="from-violet-500 to-purple-500"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Input Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <User className="w-6 h-6 text-accent" />
              {t("tools.profile-analyzer.formTitle")}
            </CardTitle>
            <CardDescription>{t("tools.profile-analyzer.formDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("tools.profile-analyzer.usernamePlaceholder")}
                  className="h-14 text-lg pl-8"
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isLoading || !username.trim()}
                className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("tools.profile-analyzer.analyzing")}
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-5 w-5" />
                    {t("tools.profile-analyzer.analyze")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Profile Header */}
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className={cn("p-1", analysis.tierColor)}>
                <div className="bg-card rounded-lg p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                      {analysis.displayName.charAt(0)}
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h2 className="text-2xl font-bold">{analysis.displayName}</h2>
                      <p className="text-muted-foreground">@{analysis.username}</p>
                      <Badge className={cn("mt-2 text-white", analysis.tierColor)}>
                        {analysis.tier}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-2xl font-bold">{formatNumber(analysis.followers)}</p>
                        <p className="text-xs text-muted-foreground">{t("tools.profile-analyzer.followers")}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{formatNumber(analysis.following)}</p>
                        <p className="text-xs text-muted-foreground">{t("tools.profile-analyzer.following")}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{formatNumber(analysis.likes)}</p>
                        <p className="text-xs text-muted-foreground">{t("tools.profile-analyzer.likes")}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{analysis.videos}</p>
                        <p className="text-xs text-muted-foreground">{t("tools.profile-analyzer.videos")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-green-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">{t("tools.profile-analyzer.engagementRate")}</span>
                  </div>
                  <p className="text-3xl font-bold">{analysis.engagementRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("tools.profile-analyzer.aboveAverage")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">{t("tools.profile-analyzer.avgViews")}</span>
                  </div>
                  <p className="text-3xl font-bold">{formatNumber(analysis.avgViews)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("tools.profile-analyzer.perVideo")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500/10 to-pink-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-pink-500" />
                    <span className="text-sm font-medium">{t("tools.profile-analyzer.avgLikes")}</span>
                  </div>
                  <p className="text-3xl font-bold">{formatNumber(analysis.avgLikes)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("tools.profile-analyzer.perVideo")}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-medium">{t("tools.profile-analyzer.estimatedReach")}</span>
                  </div>
                  <p className="text-3xl font-bold">{formatNumber(analysis.estimatedReach)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("tools.profile-analyzer.monthly")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Scores */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  {t("tools.profile-analyzer.performanceScores")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("tools.profile-analyzer.engagement")}</span>
                      <span className="font-bold">{analysis.scores.engagement}/100</span>
                    </div>
                    <Progress value={analysis.scores.engagement} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("tools.profile-analyzer.consistency")}</span>
                      <span className="font-bold">{analysis.scores.consistency}/100</span>
                    </div>
                    <Progress value={analysis.scores.consistency} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("tools.profile-analyzer.growth")}</span>
                      <span className="font-bold">{analysis.scores.growth}/100</span>
                    </div>
                    <Progress value={analysis.scores.growth} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("tools.profile-analyzer.quality")}</span>
                      <span className="font-bold">{analysis.scores.quality}/100</span>
                    </div>
                    <Progress value={analysis.scores.quality} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-green-500" />
                    {t("tools.profile-analyzer.strengths")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500/5 to-amber-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-orange-500" />
                    {t("tools.profile-analyzer.improvements")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-500">→</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Best Posting Times */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {t("tools.profile-analyzer.bestPostingTimes")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {analysis.bestPostingTimes.map((time, idx) => (
                    <Badge key={idx} variant="secondary" className="px-4 py-2 text-sm">
                      {time}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-purple-500"
                onClick={() => {
                  const text = `Check out @${analysis.username}'s TikTok analytics! ${analysis.engagementRate}% engagement rate 📊`;
                  navigator.clipboard.writeText(`${text} ${window.location.href}`);
                  toast({ title: t("share.copied") });
                }}
              >
                <Share2 className="mr-2 h-5 w-5" />
                {t("tools.profile-analyzer.shareResults")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
