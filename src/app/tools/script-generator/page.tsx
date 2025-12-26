"use client";

import { useState } from "react";
import { FileText, Sparkles, Copy, Check, Loader2, Zap, Clock, Video, Target, RefreshCw, Star, TrendingUp, Lightbulb, Music, Play, MessageSquare, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
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
import { generateScript, type GenerateScriptOutput } from "@/ai/flows/generate-script";
import { cn } from "@/lib/utils";

const NICHES = [
  { value: "general", label: "General/Entertainment", icon: "🎭" },
  { value: "comedy", label: "Comedy & Skits", icon: "😂" },
  { value: "tutorial", label: "How-To & Tutorial", icon: "📚" },
  { value: "storytime", label: "Storytime", icon: "📖" },
  { value: "fitness", label: "Fitness & Health", icon: "💪" },
  { value: "beauty", label: "Beauty & Skincare", icon: "💄" },
  { value: "food", label: "Food & Recipes", icon: "🍳" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
  { value: "music", label: "Music & Dance", icon: "🎵" },
  { value: "tech", label: "Tech & Reviews", icon: "📱" },
  { value: "business", label: "Business & Finance", icon: "💼" },
  { value: "travel", label: "Travel & Vlogs", icon: "✈️" },
  { value: "motivation", label: "Motivation & Advice", icon: "🚀" },
  { value: "news", label: "News & Commentary", icon: "📰" },
  { value: "reaction", label: "Reactions", icon: "😱" },
];

const DURATIONS = [
  { value: "15", label: "15 seconds", icon: "⚡", desc: "Quick hook - Perfect for trends & hooks" },
  { value: "30", label: "30 seconds", icon: "🎯", desc: "Short form - Ideal for tips & quick content" },
  { value: "60", label: "60 seconds", icon: "📈", desc: "Standard - Great for storytelling & tutorials" },
  { value: "180", label: "3 minutes", icon: "🎬", desc: "Long form - Deep dives & detailed content" },
];

const STYLES = [
  { value: "talking-head", label: "Talking Head", icon: "🗣️", desc: "Speaking directly to camera" },
  { value: "voiceover", label: "Voiceover", icon: "🎙️", desc: "Voice over b-roll footage" },
  { value: "tutorial", label: "Step-by-Step", icon: "📋", desc: "Instructional with demonstrations" },
  { value: "story", label: "Storytelling", icon: "📖", desc: "Narrative-driven content" },
  { value: "skit", label: "Skit/Comedy", icon: "🎭", desc: "Acting and comedy scenes" },
  { value: "montage", label: "Montage/Trend", icon: "🎵", desc: "Quick cuts to trending sounds" },
];

export default function ScriptGeneratorPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();

  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("general");
  const [duration, setDuration] = useState("30");
  const [style, setStyle] = useState("talking-head");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateScriptOutput | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a video topic or idea",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await generateScript({
        topic: topic.trim(),
        niche,
        duration,
        style,
        language: locale,
      });
      setResult(data);
      setExpandedSection(0); // Auto-expand first section

      if (data.debug?.usedFallback) {
        toast({
          title: "⚠️ Using cached template",
          description: data.debug.error || "AI service unavailable, showing template script",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Script generation failed:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyScript = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast({ title: "Copied!" });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyFullScript = () => {
    if (!result) return;
    
    const fullScript = [
      `🎬 ${result.title}`,
      "",
      `⚡ Hook: ${result.hook}`,
      "",
      "📝 Full Script:",
      ...result.sections.map((s) => `[${s.timestamp}] ${s.script}`),
      "",
      `📹 Visual Notes:`,
      ...result.sections.map((s) => `[${s.timestamp}] ${s.visualSuggestion}`),
      "",
      `🎵 Suggested Sounds: ${result.trendingSounds.join(", ")}`,
    ].join("\n");
    
    navigator.clipboard.writeText(fullScript);
    toast({ title: "Full script copied!" });
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case "hook": return "from-red-500 to-orange-500";
      case "content": return "from-blue-500 to-cyan-500";
      case "cta": return "from-green-500 to-emerald-500";
      case "transition": return "from-purple-500 to-pink-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "hook": return <Zap className="w-4 h-4" />;
      case "content": return <MessageSquare className="w-4 h-4" />;
      case "cta": return <Target className="w-4 h-4" />;
      case "transition": return <TrendingUp className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const selectedDuration = DURATIONS.find((d) => d.value === duration);
  const selectedStyle = STYLES.find((s) => s.value === style);

  return (
    <ToolLayout
      titleKey="tools.script-generator.title"
      descriptionKey="tools.script-generator.description"
      icon={<FileText className="w-10 h-10" />}
      gradient="from-cyan-500 to-blue-500"
      toolId="script-generator"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="outline" className="px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            Timed Sections
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Video className="w-4 h-4 mr-2" />
            Visual Guides
          </Badge>
        </div>

        {/* Generator Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Generate Video Script
            </CardTitle>
            <CardDescription>Create structured scripts with hooks, timing, and visual cues</CardDescription>
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
                placeholder="e.g., 3 productivity tips for students, how to make pasta, my weight loss journey..."
                className="h-14 text-lg"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <p className="text-xs text-muted-foreground">
                Be specific about what you want to create - the more detail, the better the script
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Niche Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Content Type
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

              {/* Style Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  Video Style
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
                {selectedStyle && (
                  <p className="text-xs text-muted-foreground">{selectedStyle.desc}</p>
                )}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Video Duration
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DURATIONS.map((d) => (
                  <Button
                    key={d.value}
                    variant={duration === d.value ? "default" : "outline"}
                    className={cn(
                      "h-auto py-4 flex flex-col gap-1",
                      duration === d.value && "bg-gradient-to-r from-cyan-500 to-blue-500"
                    )}
                    onClick={() => setDuration(d.value)}
                  >
                    <span className="text-2xl">{d.icon}</span>
                    <span className="font-bold">{d.label}</span>
                    <span className="text-[10px] opacity-70 text-center">{d.desc.split(" - ")[0]}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Generate {selectedDuration?.label} Script
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Script Header */}
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-1">
                <div className="bg-card rounded-lg p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        {result.totalDuration} seconds
                      </Badge>
                      <h2 className="text-2xl font-bold">{result.title}</h2>
                      <p className="text-muted-foreground">{result.wordCount} words • {result.sections.length} sections</p>
                    </div>
                    <Button onClick={copyFullScript} className="bg-gradient-to-r from-cyan-500 to-blue-500">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Full Script
                    </Button>
                  </div>

                  {/* Hook Preview */}
                  <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-red-500" />
                      <span className="font-bold text-red-500">Your Hook (First 3 Seconds)</span>
                    </div>
                    <p className="text-lg font-medium">{result.hook}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Timeline Progress */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">Script Timeline</span>
                </div>
                <div className="flex items-center gap-1">
                  {result.sections.map((section, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-3 rounded-full bg-gradient-to-r cursor-pointer transition-all hover:h-4",
                        getSectionColor(section.type)
                      )}
                      style={{ flex: section.duration }}
                      onClick={() => setExpandedSection(idx)}
                      title={`${section.type}: ${section.duration}s`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>0:00</span>
                  <span>{Math.floor(result.totalDuration / 60)}:{(result.totalDuration % 60).toString().padStart(2, "0")}</span>
                </div>
              </CardContent>
            </Card>

            {/* Script Sections */}
            <div className="space-y-4">
              {result.sections.map((section, idx) => (
                <Card
                  key={idx}
                  className={cn(
                    "border-0 shadow-lg transition-all overflow-hidden",
                    expandedSection === idx && "ring-2 ring-primary"
                  )}
                >
                  <div
                    className={cn(
                      "p-1 bg-gradient-to-r cursor-pointer",
                      getSectionColor(section.type)
                    )}
                    onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                  >
                    <div className="bg-card rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg bg-gradient-to-r text-white",
                            getSectionColor(section.type)
                          )}>
                            {getSectionIcon(section.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{section.timestamp}</Badge>
                              <span className="font-bold capitalize">{section.type}</span>
                              <Badge className="text-xs">{section.duration}s</Badge>
                            </div>
                            {expandedSection !== idx && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {section.script}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyScript(section.script, `section-${idx}`);
                            }}
                          >
                            {copiedSection === `section-${idx}` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          {expandedSection === idx ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {expandedSection === idx && (
                        <div className="mt-4 space-y-4 animate-in fade-in-50 duration-300">
                          <div className="p-4 rounded-lg bg-muted/50">
                            <Label className="text-sm text-muted-foreground mb-2 block">
                              📝 Script (What to Say)
                            </Label>
                            <p className="text-lg font-medium leading-relaxed">{section.script}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-primary/5">
                            <Label className="text-sm text-muted-foreground mb-2 block">
                              📹 Visual Guide (What to Show)
                            </Label>
                            <p className="text-muted-foreground">{section.visualSuggestion}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Trending Sounds */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Music className="w-5 h-5 text-pink-500" />
                  Suggested Sounds
                </CardTitle>
                <CardDescription>Trending sounds that fit your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {result.trendingSounds.map((sound, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="px-4 py-2 cursor-pointer hover:bg-pink-500/10"
                      onClick={() => {
                        navigator.clipboard.writeText(sound);
                        toast({ title: "Sound name copied!" });
                      }}
                    >
                      <Music className="w-3 h-3 mr-2 text-pink-500" />
                      {sound}
                    </Badge>
                  ))}
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
                Generate New Script
              </Button>
            </div>

            {/* Tips */}
            <Card className="border-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Filming Tips
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
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
