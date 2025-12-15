"use client";

import { useState } from "react";
import { Hash, Sparkles, TrendingUp, Target, Copy, Check, Loader2, Zap, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { generateHashtags, type GenerateHashtagsOutput } from "@/ai/flows/generate-hashtags";
import { cn } from "@/lib/utils";

const STYLES = [
  { value: "mixed", label: "Mixed (Recommended)", icon: "✨" },
  { value: "trending", label: "Trending Focus", icon: "🔥" },
  { value: "niche", label: "Niche Focus", icon: "🎯" },
];

export default function HashtagGeneratorPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("mixed");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateHashtagsOutput | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: t("tools.hashtag.errorTitle"),
        description: t("tools.hashtag.errorEmpty"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await generateHashtags({
        topic: topic.trim(),
        language: locale,
        style,
      });
      setResult(data);
    } catch (error) {
      console.error("Hashtag generation failed:", error);
      toast({
        title: t("tools.hashtag.errorTitle"),
        description: t("tools.hashtag.errorGenerate"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyHashtags = (hashtags: { tag: string }[] | string[], section: string) => {
    const tags = hashtags.map((h) => (typeof h === "string" ? h : h.tag)).join(" ");
    navigator.clipboard.writeText(tags);
    setCopiedSection(section);
    toast({
      title: t("share.copied"),
      description: t("tools.hashtag.copiedDesc"),
    });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyAllHashtags = () => {
    if (!result) return;
    const allTags = [
      ...result.trending.map((h) => h.tag),
      ...result.medium.map((h) => h.tag),
      ...result.niche.map((h) => h.tag),
    ].join(" ");
    navigator.clipboard.writeText(allTags);
    setCopiedSection("all");
    toast({
      title: t("share.copied"),
      description: t("tools.hashtag.copiedAllDesc"),
    });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <ToolLayout
      titleKey="tools.hashtag.title"
      descriptionKey="tools.hashtag.description"
      icon={<Hash className="w-10 h-10" />}
      gradient="from-blue-500 to-cyan-500"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Generator Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              {t("tools.hashtag.formTitle")}
            </CardTitle>
            <CardDescription>{t("tools.hashtag.formDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                {t("tools.hashtag.topicLabel")}
              </Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t("tools.hashtag.topicPlaceholder")}
                className="h-14 text-lg"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>

            {/* Style Select */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                {t("tools.hashtag.styleLabel")}
              </Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.icon} {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("tools.hashtag.generating")}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t("tools.hashtag.generate")}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Recommended Tags */}
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1">
                <div className="bg-card rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{t("tools.hashtag.recommended")}</h3>
                        <p className="text-sm text-muted-foreground">{t("tools.hashtag.recommendedDesc")}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyHashtags(result.recommended, "recommended")}
                    >
                      {copiedSection === "recommended" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.recommended.map((tag, idx) => (
                      <Badge
                        key={idx}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm px-4 py-2 cursor-pointer hover:opacity-80"
                        onClick={() => {
                          navigator.clipboard.writeText(tag);
                          toast({ title: t("share.copied") });
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* All Hashtags Tabs */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t("tools.hashtag.allHashtags")}</CardTitle>
                  <CardDescription>{t("tools.hashtag.clickToCopy")}</CardDescription>
                </div>
                <Button variant="outline" onClick={copyAllHashtags}>
                  {copiedSection === "all" ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {t("tools.hashtag.copyAll")}
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="trending">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="trending" className="gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {t("tools.hashtag.trending")}
                    </TabsTrigger>
                    <TabsTrigger value="medium" className="gap-2">
                      <Star className="w-4 h-4" />
                      {t("tools.hashtag.medium")}
                    </TabsTrigger>
                    <TabsTrigger value="niche" className="gap-2">
                      <Target className="w-4 h-4" />
                      {t("tools.hashtag.niche")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="trending" className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-muted-foreground">{t("tools.hashtag.trendingDesc")}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyHashtags(result.trending, "trending")}
                      >
                        {copiedSection === "trending" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {result.trending.map((tag, idx) => (
                        <Card
                          key={idx}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            navigator.clipboard.writeText(tag.tag);
                            toast({ title: t("share.copied") });
                          }}
                        >
                          <CardContent className="p-3 text-center">
                            <p className="font-medium text-sm truncate">{tag.tag}</p>
                            <p className="text-xs text-muted-foreground">{tag.posts} posts</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="medium" className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-muted-foreground">{t("tools.hashtag.mediumDesc")}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyHashtags(result.medium, "medium")}
                      >
                        {copiedSection === "medium" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {result.medium.map((tag, idx) => (
                        <Card
                          key={idx}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            navigator.clipboard.writeText(tag.tag);
                            toast({ title: t("share.copied") });
                          }}
                        >
                          <CardContent className="p-3 text-center">
                            <p className="font-medium text-sm truncate">{tag.tag}</p>
                            <p className="text-xs text-muted-foreground">{tag.posts} posts</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="niche" className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-muted-foreground">{t("tools.hashtag.nicheDesc")}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyHashtags(result.niche, "niche")}
                      >
                        {copiedSection === "niche" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {result.niche.map((tag, idx) => (
                        <Card
                          key={idx}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            navigator.clipboard.writeText(tag.tag);
                            toast({ title: t("share.copied") });
                          }}
                        >
                          <CardContent className="p-3 text-center">
                            <p className="font-medium text-sm truncate">{tag.tag}</p>
                            <p className="text-xs text-muted-foreground">{tag.posts} posts</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t("tools.hashtag.tips")}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {t("tools.hashtag.tip1")}</li>
                  <li>• {t("tools.hashtag.tip2")}</li>
                  <li>• {t("tools.hashtag.tip3")}</li>
                  <li>• {t("tools.hashtag.tip4")}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
