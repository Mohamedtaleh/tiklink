"use client";

import { useState } from "react";
import { User, Sparkles, Copy, Check, Loader2, Wand2, Lightbulb, RefreshCw, Instagram, Youtube, Twitter, Globe, Zap, Star, Heart, Target, Edit3, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { generateBio, type GenerateBioOutput } from "@/ai/flows/generate-bio";
import { cn } from "@/lib/utils";

// Platform-specific character limits
const PLATFORMS = [
  { value: "tiktok", label: "TikTok", icon: "🎵", maxChars: 80, color: "from-pink-500 to-purple-500" },
  { value: "instagram", label: "Instagram", icon: "📸", maxChars: 150, color: "from-purple-500 to-pink-500" },
  { value: "youtube", label: "YouTube", icon: "🎬", maxChars: 1000, color: "from-red-500 to-red-600" },
  { value: "twitter", label: "X (Twitter)", icon: "🐦", maxChars: 160, color: "from-blue-400 to-blue-500" },
  { value: "linkedin", label: "LinkedIn", icon: "💼", maxChars: 220, color: "from-blue-600 to-blue-700" },
];

const NICHES = [
  { value: "comedy", label: "Comedy & Entertainment", icon: "😂", examples: ["comedian", "funny videos", "skits"] },
  { value: "fitness", label: "Fitness & Health", icon: "💪", examples: ["personal trainer", "gym motivation", "workout tips"] },
  { value: "beauty", label: "Beauty & Skincare", icon: "💄", examples: ["makeup artist", "skincare routine", "beauty tips"] },
  { value: "fashion", label: "Fashion & Style", icon: "👗", examples: ["outfit ideas", "style tips", "fashion hauls"] },
  { value: "food", label: "Food & Cooking", icon: "🍳", examples: ["recipes", "food reviews", "cooking tips"] },
  { value: "gaming", label: "Gaming", icon: "🎮", examples: ["streamer", "game reviews", "esports"] },
  { value: "music", label: "Music & Dance", icon: "🎵", examples: ["musician", "dancer", "covers"] },
  { value: "education", label: "Education & Tips", icon: "📚", examples: ["tutor", "life hacks", "how-to"] },
  { value: "lifestyle", label: "Lifestyle & Vlog", icon: "✨", examples: ["daily vlog", "life updates", "motivation"] },
  { value: "tech", label: "Tech & Gadgets", icon: "📱", examples: ["tech reviews", "app tips", "gadgets"] },
  { value: "business", label: "Business & Finance", icon: "💼", examples: ["entrepreneur", "investing", "side hustle"] },
  { value: "travel", label: "Travel & Adventure", icon: "✈️", examples: ["travel tips", "destinations", "adventure"] },
  { value: "art", label: "Art & Creative", icon: "🎨", examples: ["artist", "designer", "creative"] },
  { value: "parenting", label: "Parenting & Family", icon: "👶", examples: ["mom life", "parenting tips", "family"] },
  { value: "pets", label: "Pets & Animals", icon: "🐕", examples: ["pet parent", "animal lover", "dog/cat content"] },
];

const VIBES = [
  { value: "funny", label: "Funny & Playful", icon: "😄", desc: "Light-hearted, humorous tone" },
  { value: "professional", label: "Professional", icon: "💼", desc: "Polished, business-like tone" },
  { value: "mysterious", label: "Mysterious & Intriguing", icon: "🌙", desc: "Curious, captivating tone" },
  { value: "inspirational", label: "Inspirational", icon: "⭐", desc: "Motivating, uplifting tone" },
  { value: "sarcastic", label: "Sarcastic & Witty", icon: "😏", desc: "Clever, slightly edgy tone" },
  { value: "friendly", label: "Friendly & Approachable", icon: "🤗", desc: "Warm, welcoming tone" },
  { value: "bold", label: "Bold & Confident", icon: "🔥", desc: "Strong, assertive tone" },
  { value: "aesthetic", label: "Aesthetic & Minimal", icon: "🌸", desc: "Clean, stylish tone" },
  { value: "quirky", label: "Quirky & Unique", icon: "🦄", desc: "Offbeat, memorable tone" },
  { value: "casual", label: "Casual & Chill", icon: "😎", desc: "Relaxed, easygoing tone" },
];

const EMOJI_SUGGESTIONS: Record<string, string[]> = {
  comedy: ["😂", "🤣", "💀", "😭", "🎭", "🤪", "😜"],
  fitness: ["💪", "🏋️", "🔥", "⚡", "🏃", "💯", "🎯"],
  beauty: ["💄", "💋", "✨", "🌸", "💅", "🪞", "💖"],
  fashion: ["👗", "👠", "🛍️", "✨", "💅", "🔥", "💫"],
  food: ["🍳", "🍕", "🍰", "😋", "🥘", "👨‍🍳", "🔥"],
  gaming: ["🎮", "🕹️", "🏆", "⚔️", "🎯", "💀", "🔥"],
  music: ["🎵", "🎤", "🎸", "💃", "🎧", "🎹", "✨"],
  education: ["📚", "🎓", "💡", "🧠", "✏️", "📖", "🔬"],
  lifestyle: ["✨", "🌸", "☀️", "💫", "🌿", "🦋", "💖"],
  tech: ["📱", "💻", "🤖", "⚡", "🔥", "🚀", "💡"],
  business: ["💼", "📈", "💰", "🚀", "💡", "⚡", "🎯"],
  travel: ["✈️", "🌍", "🏝️", "📸", "🗺️", "🌅", "⛰️"],
  art: ["🎨", "✨", "🖌️", "🌈", "💫", "🌸", "🖼️"],
  parenting: ["👶", "❤️", "👨‍👩‍👧", "🏠", "💕", "🌟", "🤗"],
  pets: ["🐕", "🐈", "❤️", "🐾", "🦮", "🐱", "💕"],
};

export default function BioGeneratorPage() {
  const { t, locale } = useI18n();
  const { toast } = useToast();

  const [platform, setPlatform] = useState("tiktok");
  const [niche, setNiche] = useState("comedy");
  const [vibe, setVibe] = useState("funny");
  const [keywords, setKeywords] = useState("");
  const [customBio, setCustomBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateBioOutput | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedPlatform = PLATFORMS.find((p) => p.value === platform) || PLATFORMS[0];
  const selectedNiche = NICHES.find((n) => n.value === niche);
  const selectedVibe = VIBES.find((v) => v.value === vibe);

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

  const getCharCountColor = (count: number, max: number) => {
    const percentage = (count / max) * 100;
    if (percentage > 100) return "text-red-500";
    if (percentage > 90) return "text-yellow-500";
    return "text-green-500";
  };

  const suggestedEmojis = EMOJI_SUGGESTIONS[niche] || EMOJI_SUGGESTIONS.comedy;

  return (
    <ToolLayout
      titleKey="tools.bio-generator.title"
      descriptionKey="tools.bio-generator.description"
      icon={<User className="w-10 h-10" />}
      gradient="from-pink-500 to-rose-500"
      toolId="bio-generator"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="outline" className="px-4 py-2">
            <Globe className="w-4 h-4 mr-2" />
            5 Platforms
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Target className="w-4 h-4 mr-2" />
            15 Niches
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered
          </Badge>
        </div>

        {/* Generator Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Wand2 className="w-6 h-6 text-accent" />
              Create Your Perfect Bio
            </CardTitle>
            <CardDescription>Generate platform-optimized bios with the perfect character count</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Platform Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Choose Platform
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {PLATFORMS.map((p) => (
                  <Button
                    key={p.value}
                    variant={platform === p.value ? "default" : "outline"}
                    className={cn(
                      "h-auto py-3 flex flex-col gap-1",
                      platform === p.value && `bg-gradient-to-r ${p.color}`
                    )}
                    onClick={() => setPlatform(p.value)}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-xs">{p.label}</span>
                    <span className="text-[10px] opacity-70">{p.maxChars} chars</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Niche Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Your Niche
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
                {selectedNiche && (
                  <p className="text-xs text-muted-foreground">
                    Examples: {selectedNiche.examples.join(", ")}
                  </p>
                )}
              </div>

              {/* Vibe Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Tone & Vibe
                </Label>
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
                {selectedVibe && (
                  <p className="text-xs text-muted-foreground">{selectedVibe.desc}</p>
                )}
              </div>
            </div>

            {/* Keywords Input */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary" />
                Keywords (optional)
              </Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., your name, location, catchphrase, website..."
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                Add specific words or phrases you want included in your bio
              </p>
            </div>

            {/* Emoji Suggestions */}
            <div className="space-y-2">
              <Label className="text-sm">Suggested Emojis for {selectedNiche?.label}</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedEmojis.map((emoji, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xl h-10 w-10 p-0"
                    onClick={() => {
                      navigator.clipboard.writeText(emoji);
                      toast({ title: `${emoji} copied!` });
                    }}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className={cn(
                "w-full h-14 text-lg font-bold bg-gradient-to-r",
                selectedPlatform.color,
                "hover:opacity-90"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate {selectedPlatform.label} Bios
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Platform Info */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className={cn("p-1 bg-gradient-to-r", selectedPlatform.color)}>
                <div className="bg-card rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedPlatform.icon}</span>
                      <div>
                        <h3 className="font-bold">{selectedPlatform.label} Bio</h3>
                        <p className="text-sm text-muted-foreground">
                          Maximum {selectedPlatform.maxChars} characters
                        </p>
                      </div>
                    </div>
                    <Badge className={cn("bg-gradient-to-r", selectedPlatform.color)}>
                      Optimized
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Generated Bios */}
            <div className="grid grid-cols-1 gap-4">
              {result.bios.map((bio, idx) => {
                const charCount = bio.text.length;
                const isOverLimit = charCount > selectedPlatform.maxChars;
                
                return (
                  <Card
                    key={idx}
                    className={cn(
                      "border-0 shadow-lg transition-all hover:shadow-xl cursor-pointer group relative overflow-hidden",
                      copiedIndex === idx && "ring-2 ring-green-500",
                      isOverLimit && "border-2 border-amber-500/50"
                    )}
                    onClick={() => copyBio(bio.text, idx)}
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
                            <Badge variant="outline" className="text-xs">
                              {bio.style}
                            </Badge>
                            <span className={cn("text-xs font-medium", getCharCountColor(charCount, selectedPlatform.maxChars))}>
                              {charCount}/{selectedPlatform.maxChars} chars
                            </span>
                            {isOverLimit && (
                              <Badge variant="outline" className="text-amber-500 border-amber-500 text-xs">
                                Over limit - edit needed
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-lg font-medium leading-relaxed">
                            {bio.text}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Emojis:</span>
                              <span className="text-lg">{bio.emojis}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Character usage</span>
                              <span className={getCharCountColor(charCount, selectedPlatform.maxChars)}>
                                {Math.round((charCount / selectedPlatform.maxChars) * 100)}%
                              </span>
                            </div>
                            <Progress
                              value={Math.min(100, (charCount / selectedPlatform.maxChars) * 100)}
                              className={cn(
                                "h-2",
                                isOverLimit && "bg-red-200"
                              )}
                            />
                          </div>
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
                );
              })}
            </div>

            {/* Custom Bio Editor */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Edit3 className="w-5 h-5 text-primary" />
                  Customize Your Bio
                </CardTitle>
                <CardDescription>Edit any bio above or write your own</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  placeholder="Paste or write your custom bio here..."
                  className="min-h-[100px] text-lg"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-medium", getCharCountColor(customBio.length, selectedPlatform.maxChars))}>
                      {customBio.length}/{selectedPlatform.maxChars} characters
                    </span>
                    {customBio.length > selectedPlatform.maxChars && (
                      <Badge variant="destructive" className="text-xs">
                        {customBio.length - selectedPlatform.maxChars} over limit
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!customBio}
                    onClick={() => {
                      navigator.clipboard.writeText(customBio);
                      toast({ title: "Custom bio copied!" });
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <Progress
                  value={Math.min(100, (customBio.length / selectedPlatform.maxChars) * 100)}
                  className={cn("h-2", customBio.length > selectedPlatform.maxChars && "bg-red-200")}
                />
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
                Generate More Options
              </Button>
            </div>

            {/* Tips */}
            <Card className="border-0 bg-gradient-to-r from-pink-500/5 to-rose-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Bio Best Practices
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
                    Include a clear call-to-action (CTA) like "Follow for more!"
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    Update your bio regularly to stay fresh and relevant
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform-specific tips */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">{selectedPlatform.icon}</span>
                  {selectedPlatform.label}-Specific Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {platform === "tiktok" && (
                    <>
                      <p>• <strong>Keep it short:</strong> TikTok bios are limited to 80 characters, so every word counts</p>
                      <p>• <strong>Use emojis:</strong> They add personality and save character space</p>
                      <p>• <strong>Add your niche:</strong> Let viewers know what content to expect</p>
                      <p>• <strong>Include a CTA:</strong> Tell people what to do (follow, check links, etc.)</p>
                    </>
                  )}
                  {platform === "instagram" && (
                    <>
                      <p>• <strong>Use line breaks:</strong> Make your bio scannable and easy to read</p>
                      <p>• <strong>Include contact info:</strong> Add your email or business category</p>
                      <p>• <strong>Link strategically:</strong> Use your one link wisely (consider a link tree)</p>
                      <p>• <strong>Add location:</strong> Helps with local discoverability</p>
                    </>
                  )}
                  {platform === "youtube" && (
                    <>
                      <p>• <strong>Front-load keywords:</strong> First 100-150 chars appear in search results</p>
                      <p>• <strong>Include upload schedule:</strong> Let subscribers know when to expect content</p>
                      <p>• <strong>Add social links:</strong> Cross-promote your other platforms</p>
                      <p>• <strong>Use sections:</strong> Organize with emojis or bullet points</p>
                    </>
                  )}
                  {platform === "twitter" && (
                    <>
                      <p>• <strong>Be memorable:</strong> Your bio is prime real estate for personality</p>
                      <p>• <strong>Use relevant keywords:</strong> Helps with Twitter search</p>
                      <p>• <strong>Pin your best tweet:</strong> Complements your bio message</p>
                      <p>• <strong>Add location & website:</strong> Use dedicated fields, not bio space</p>
                    </>
                  )}
                  {platform === "linkedin" && (
                    <>
                      <p>• <strong>Professional tone:</strong> Balance personality with professionalism</p>
                      <p>• <strong>Include credentials:</strong> Mention relevant experience or certifications</p>
                      <p>• <strong>Value proposition:</strong> Explain what you offer or help with</p>
                      <p>• <strong>Keywords matter:</strong> Include industry-relevant terms for search</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
