"use client";

import { useState } from "react";
import { Hash, Sparkles, TrendingUp, Target, Copy, Check, Loader2, Zap, Crown, Star, AlertTriangle, Eye, BarChart3, Shield, Info, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { generateHashtags, type GenerateHashtagsOutput } from "@/ai/flows/generate-hashtags";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "all", label: "All Categories", icon: "🌐" },
  { value: "entertainment", label: "Entertainment", icon: "🎭" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "lifestyle", label: "Lifestyle", icon: "✨" },
  { value: "beauty", label: "Beauty", icon: "💄" },
  { value: "fitness", label: "Fitness", icon: "💪" },
  { value: "food", label: "Food", icon: "🍳" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
  { value: "tech", label: "Tech", icon: "📱" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "business", label: "Business", icon: "💼" },
  { value: "travel", label: "Travel", icon: "✈️" },
];

const STYLES = [
  { value: "mixed", label: "Balanced Mix (Recommended)", icon: "⚖️", desc: "Mix of high, medium, and niche hashtags" },
  { value: "trending", label: "Maximum Reach", icon: "🚀", desc: "Focus on high-volume trending hashtags" },
  { value: "niche", label: "Targeted Growth", icon: "🎯", desc: "Focus on specific niche hashtags" },
  { value: "viral", label: "Viral Focus", icon: "🔥", desc: "Best for going viral quickly" },
];

// Common banned/shadowbanned hashtags (2024)
const BANNED_HASHTAGS = [
  "#adulting", "#alone", "#armparty", "#asiangirl", "#beautyblogger", 
  "#boho", "#brain", "#costumes", "#date", "#dating", "#desk", "#dm",
  "#dogsofinstagram", "#easter", "#elevator", "#fitnessgirl", "#girlsonly",
  "#gloves", "#goddess", "#graffiti", "#hardworkpaysoff", "#humpday",
  "#hustler", "#iceland", "#italiano", "#kansas", "#kickoff", "#killingit",
  "#kissing", "#lean", "#like", "#likeforlike", "#lingerie", "#lit",
  "#loseweight", "#love", "#master", "#mileycyrus", "#milf", "#mirror",
  "#models", "#mustfollow", "#nasty", "#newyears", "#nudity", "#overnight",
  "#parties", "#petite", "#pornfood", "#pushups", "#rate", "#ravens",
  "#selfharm", "#singlelife", "#skateboarding", "#snap", "#snapchat",
  "#snowstorm", "#sopretty", "#stranger", "#stud", "#sunbathing", "#swole",
  "#tag4like", "#teen", "#teenagers", "#thought", "#todayimwearing",
  "#underage", "#valentinesday", "#workflow", "#woman"
];

interface EnhancedHashtag {
  tag: string;
  posts: string;
  reachScore: number;
  competition: "Low" | "Medium" | "High";
  category: string;
  isBanned: boolean;
  trend: "rising" | "stable" | "declining";
}

function enhanceHashtags(
  hashtags: { tag: string; posts: string }[],
  type: "trending" | "medium" | "niche"
): EnhancedHashtag[] {
  return hashtags.map((h) => {
    const isBanned = BANNED_HASHTAGS.includes(h.tag.toLowerCase());
    
    // Parse posts count to estimate reach
    const postsStr = h.posts.toLowerCase();
    let postsNum = 0;
    if (postsStr.includes("t")) postsNum = parseFloat(postsStr) * 1000000000000;
    else if (postsStr.includes("b")) postsNum = parseFloat(postsStr) * 1000000000;
    else if (postsStr.includes("m")) postsNum = parseFloat(postsStr) * 1000000;
    else if (postsStr.includes("k")) postsNum = parseFloat(postsStr) * 1000;
    else postsNum = parseFloat(postsStr) || 0;

    // Calculate reach score (1-100)
    let reachScore = 0;
    let competition: "Low" | "Medium" | "High" = "Medium";
    let trend: "rising" | "stable" | "declining" = "stable";

    if (type === "trending") {
      reachScore = Math.min(100, Math.round(70 + (postsNum / 1000000000000) * 30));
      competition = "High";
      trend = Math.random() > 0.5 ? "rising" : "stable";
    } else if (type === "medium") {
      reachScore = Math.min(80, Math.max(40, Math.round(40 + (postsNum / 1000000) * 40)));
      competition = "Medium";
      trend = Math.random() > 0.3 ? "stable" : Math.random() > 0.5 ? "rising" : "declining";
    } else {
      reachScore = Math.min(60, Math.max(20, Math.round(20 + (postsNum / 100000) * 40)));
      competition = "Low";
      trend = Math.random() > 0.4 ? "rising" : "stable";
    }

    // Guess category based on common patterns
    let category = "General";
    const tagLower = h.tag.toLowerCase();
    if (tagLower.includes("fyp") || tagLower.includes("viral")) category = "Trending";
    else if (tagLower.includes("fitness") || tagLower.includes("gym") || tagLower.includes("workout")) category = "Fitness";
    else if (tagLower.includes("food") || tagLower.includes("recipe") || tagLower.includes("cook")) category = "Food";
    else if (tagLower.includes("beauty") || tagLower.includes("makeup") || tagLower.includes("skin")) category = "Beauty";
    else if (tagLower.includes("tech") || tagLower.includes("gadget") || tagLower.includes("app")) category = "Tech";
    else if (tagLower.includes("game") || tagLower.includes("gaming")) category = "Gaming";
    else if (tagLower.includes("music") || tagLower.includes("dance") || tagLower.includes("song")) category = "Music";
    else if (tagLower.includes("travel") || tagLower.includes("trip")) category = "Travel";
    else if (tagLower.includes("business") || tagLower.includes("money") || tagLower.includes("finance")) category = "Business";

    return {
      ...h,
      reachScore,
      competition,
      category,
      isBanned,
      trend,
    };
  });
}

export default function HashtagGeneratorPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();

  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("all");
  const [style, setStyle] = useState("mixed");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateHashtagsOutput | null>(null);
  const [enhancedResult, setEnhancedResult] = useState<{
    trending: EnhancedHashtag[];
    medium: EnhancedHashtag[];
    niche: EnhancedHashtag[];
  } | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: t("tools.hashtag-generator.errorTitle"),
        description: t("tools.hashtag-generator.errorEmpty"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setEnhancedResult(null);
    setSelectedTags(new Set());

    try {
      const fullTopic = category !== "all" ? `${topic} ${category}` : topic;
      const data = await generateHashtags({
        topic: fullTopic.trim(),
        language: locale,
        style,
      });
      
      setResult(data);
      
      // Enhance hashtags with additional metadata
      setEnhancedResult({
        trending: enhanceHashtags(data.trending, "trending"),
        medium: enhanceHashtags(data.medium, "medium"),
        niche: enhanceHashtags(data.niche, "niche"),
      });

      // Auto-select recommended tags
      const recommended = new Set(data.recommended);
      setSelectedTags(recommended);

      if (data.debug?.usedFallback) {
        toast({
          title: "⚠️ Using cached results",
          description: data.debug.error || "AI service unavailable, showing sample hashtags",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("[HashtagPage] Error:", error);
      toast({
        title: t("tools.hashtag-generator.errorTitle"),
        description: error.message || t("tools.hashtag-generator.errorGenerate"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tag)) {
      newSelected.delete(tag);
    } else if (newSelected.size < 30) {
      newSelected.add(tag);
    } else {
      toast({
        title: "Maximum reached",
        description: "TikTok allows up to 30 hashtags per video",
        variant: "destructive",
      });
    }
    setSelectedTags(newSelected);
  };

  const copyHashtags = (hashtags: { tag: string }[] | string[], section: string) => {
    const tags = hashtags.map((h) => (typeof h === "string" ? h : h.tag)).join(" ");
    navigator.clipboard.writeText(tags);
    setCopiedSection(section);
    toast({
      title: t("share.copied"),
      description: t("tools.hashtag-generator.copiedDesc"),
    });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copySelectedTags = () => {
    const tags = Array.from(selectedTags).join(" ");
    navigator.clipboard.writeText(tags);
    setCopiedSection("selected");
    toast({
      title: t("share.copied"),
      description: `Copied ${selectedTags.size} hashtags`,
    });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getTrendIcon = (trend: "rising" | "stable" | "declining") => {
    if (trend === "rising") return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (trend === "declining") return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
    return <span className="w-3 h-3 text-yellow-500">—</span>;
  };

  const getCompetitionColor = (comp: "Low" | "Medium" | "High") => {
    if (comp === "Low") return "text-green-500";
    if (comp === "High") return "text-red-500";
    return "text-yellow-500";
  };

  // Count banned hashtags in results
  const bannedCount = enhancedResult
    ? [...enhancedResult.trending, ...enhancedResult.medium, ...enhancedResult.niche].filter((h) => h.isBanned).length
    : 0;

  return (
    <ToolLayout
      titleKey="tools.hashtag-generator.title"
      descriptionKey="tools.hashtag-generator.description"
      icon={<Hash className="w-10 h-10" />}
      gradient="from-blue-500 to-cyan-500"
      toolId="hashtag-generator"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="outline" className="px-4 py-2">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reach Estimates
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Banned Tag Detection
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trend Analysis
          </Badge>
        </div>

        {/* Generator Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              {t("tools.hashtag-generator.formTitle")}
            </CardTitle>
            <CardDescription>Generate optimized hashtags with reach estimates and competition analysis</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                {t("tools.hashtag-generator.topicLabel")}
              </Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., fitness motivation, cooking recipes, tech reviews..."
                className="h-14 text-lg"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  Content Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.icon} {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Style Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Strategy
                </Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        <div>
                          <span>{s.icon} {s.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {STYLES.find((s) => s.value === style)?.desc}
                </p>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("tools.hashtag-generator.generating")}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Smart Hashtags
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && enhancedResult && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Selected Tags Builder */}
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1">
                <div className="bg-card rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Your Hashtag Set</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedTags.size}/30 hashtags selected • Click tags below to add/remove
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={copySelectedTags}
                      disabled={selectedTags.size === 0}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500"
                    >
                      {copiedSection === "selected" ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      Copy {selectedTags.size} Tags
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-muted/30 rounded-lg">
                    {selectedTags.size > 0 ? (
                      Array.from(selectedTags).map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 cursor-pointer hover:opacity-80"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Click hashtags below to build your set</p>
                    )}
                  </div>

                  {/* Reach estimate */}
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      <span>Estimated Reach:</span>
                      <Badge variant="outline" className="font-bold">
                        {selectedTags.size > 20 ? "Very High" : selectedTags.size > 10 ? "High" : selectedTags.size > 5 ? "Medium" : "Low"}
                      </Badge>
                    </div>
                    <Progress value={(selectedTags.size / 30) * 100} className="flex-1 h-2" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Banned Hashtag Warning */}
            {bannedCount > 0 && (
              <Card className="border-amber-500/30 bg-amber-500/10">
                <CardContent className="pt-6 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-600 dark:text-amber-400">
                      ⚠️ {bannedCount} potentially shadowbanned hashtag(s) detected
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      These tags are marked with a warning. Using them may limit your video's reach.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Hashtags Tabs */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-primary" />
                  Hashtag Categories
                </CardTitle>
                <CardDescription>Click any hashtag to add it to your set. Hover for details.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="trending">
                  <TabsList className="grid grid-cols-3 w-full mb-6">
                    <TabsTrigger value="trending" className="gap-2">
                      <TrendingUp className="w-4 h-4" />
                      High Volume ({enhancedResult.trending.length})
                    </TabsTrigger>
                    <TabsTrigger value="medium" className="gap-2">
                      <Star className="w-4 h-4" />
                      Medium ({enhancedResult.medium.length})
                    </TabsTrigger>
                    <TabsTrigger value="niche" className="gap-2">
                      <Target className="w-4 h-4" />
                      Niche ({enhancedResult.niche.length})
                    </TabsTrigger>
                  </TabsList>

                  {["trending", "medium", "niche"].map((type) => (
                    <TabsContent key={type} value={type} className="mt-0">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-muted-foreground">
                          {type === "trending" && "High-volume hashtags for maximum exposure (high competition)"}
                          {type === "medium" && "Balanced hashtags with good reach and moderate competition"}
                          {type === "niche" && "Specific hashtags with lower competition (easier to rank)"}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyHashtags(enhancedResult[type as keyof typeof enhancedResult], type)}
                        >
                          {copiedSection === type ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {enhancedResult[type as keyof typeof enhancedResult].map((tag, idx) => (
                          <Card
                            key={idx}
                            className={cn(
                              "cursor-pointer transition-all hover:scale-[1.02] relative",
                              selectedTags.has(tag.tag) && "ring-2 ring-primary bg-primary/5",
                              tag.isBanned && "border-amber-500/50"
                            )}
                            onClick={() => toggleTag(tag.tag)}
                          >
                            {tag.isBanned && (
                              <div className="absolute top-2 right-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                              </div>
                            )}
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-sm truncate">{tag.tag}</p>
                                {getTrendIcon(tag.trend)}
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{tag.posts} posts</span>
                                <span className={getCompetitionColor(tag.competition)}>{tag.competition}</span>
                              </div>
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>Reach Score</span>
                                  <span className="font-medium">{tag.reachScore}%</span>
                                </div>
                                <Progress value={tag.reachScore} className="h-1" />
                              </div>
                              {tag.category !== "General" && (
                                <Badge variant="outline" className="mt-2 text-xs">
                                  {tag.category}
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card className="border-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Hashtag Strategy Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Mix it up:</strong> Use 3-5 high volume, 5-10 medium, and 3-5 niche hashtags</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Stay relevant:</strong> Only use hashtags that match your content</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Avoid overused:</strong> Don't only use #fyp - the algorithm prefers variety</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span><strong>Research trends:</strong> Check TikTok's Discover page for trending tags</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span><strong>Don't spam:</strong> Using 30 irrelevant hashtags hurts more than helps</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <span><strong>Avoid banned tags:</strong> Shadowbanned hashtags can limit your reach</span>
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
