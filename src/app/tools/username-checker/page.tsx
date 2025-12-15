"use client";

import { useState } from "react";
import { AtSign, Check, X, Loader2, Sparkles, RefreshCw, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { cn } from "@/lib/utils";

interface PlatformResult {
  platform: string;
  icon: string;
  available: boolean | null;
  url: string;
  color: string;
}

interface UsernameResult {
  username: string;
  platforms: PlatformResult[];
  suggestions: string[];
}

const PLATFORMS = [
  { name: "TikTok", icon: "🎵", color: "bg-black", baseUrl: "https://tiktok.com/@" },
  { name: "Instagram", icon: "📸", color: "bg-gradient-to-r from-purple-500 to-pink-500", baseUrl: "https://instagram.com/" },
  { name: "Twitter/X", icon: "𝕏", color: "bg-black", baseUrl: "https://twitter.com/" },
  { name: "YouTube", icon: "▶️", color: "bg-red-500", baseUrl: "https://youtube.com/@" },
  { name: "Twitch", icon: "💜", color: "bg-purple-500", baseUrl: "https://twitch.tv/" },
  { name: "Snapchat", icon: "👻", color: "bg-yellow-400", baseUrl: "https://snapchat.com/add/" },
];

function generateSuggestions(base: string): string[] {
  const suggestions: string[] = [];
  const suffixes = ["_", "official", "real", "the", "its", "im", "hey"];
  const prefixes = ["the", "its", "im", "hey", ""];
  const numbers = ["1", "2", "99", "00", "x", ""];
  
  // Add variations
  suggestions.push(`${base}_official`);
  suggestions.push(`the${base}`);
  suggestions.push(`${base}x`);
  suggestions.push(`real${base}`);
  suggestions.push(`${base}99`);
  suggestions.push(`hey${base}`);
  suggestions.push(`its${base}`);
  suggestions.push(`${base}_`);
  
  // Filter unique and return top 8
  return [...new Set(suggestions)].slice(0, 8);
}

function checkAvailability(): boolean {
  // Simulate random availability (in real app, this would call APIs)
  return Math.random() > 0.5;
}

export default function UsernameCheckerPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UsernameResult | null>(null);

  const handleCheck = async () => {
    if (!username.trim()) {
      toast({
        title: t("tools.username-checker.errorTitle"),
        description: t("tools.username-checker.errorEmpty"),
        variant: "destructive",
      });
      return;
    }

    const cleanUsername = username.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    
    if (cleanUsername.length < 3) {
      toast({
        title: t("tools.username-checker.errorTitle"),
        description: t("tools.username-checker.errorShort"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API calls to check availability
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const platforms: PlatformResult[] = PLATFORMS.map((p) => ({
      platform: p.name,
      icon: p.icon,
      available: checkAvailability(),
      url: p.baseUrl + cleanUsername,
      color: p.color,
    }));

    setResult({
      username: cleanUsername,
      platforms,
      suggestions: generateSuggestions(cleanUsername),
    });
    
    setIsLoading(false);
  };

  const copyUsername = (name: string) => {
    navigator.clipboard.writeText(name);
    toast({ title: t("share.copied") });
  };

  const availableCount = result?.platforms.filter((p) => p.available).length || 0;
  const totalCount = result?.platforms.length || 0;

  return (
    <ToolLayout
      titleKey="tools.username-checker.title"
      descriptionKey="tools.username-checker.description"
      icon={<AtSign className="w-10 h-10" />}
      gradient="from-cyan-500 to-blue-500"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Input Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              {t("tools.username-checker.formTitle")}
            </CardTitle>
            <CardDescription>{t("tools.username-checker.formDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("tools.username-checker.placeholder")}
                  className="h-14 text-lg pl-8"
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                />
              </div>
              <Button
                onClick={handleCheck}
                disabled={isLoading || !username.trim()}
                className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("tools.username-checker.checking")}
                  </>
                ) : (
                  <>
                    <AtSign className="mr-2 h-5 w-5" />
                    {t("tools.username-checker.check")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Summary */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className={cn(
                "p-1 bg-gradient-to-r",
                availableCount === totalCount ? "from-green-500 to-emerald-500" :
                availableCount > totalCount / 2 ? "from-yellow-500 to-orange-500" :
                "from-red-500 to-rose-500"
              )}>
                <div className="bg-card rounded-lg p-6 text-center">
                  <h2 className="text-3xl font-bold font-headline mb-2">@{result.username}</h2>
                  <p className="text-lg text-muted-foreground">
                    {t("tools.username-checker.availableOn", { count: availableCount.toString(), total: totalCount.toString() })}
                  </p>
                </div>
              </div>
            </Card>

            {/* Platform Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.platforms.map((platform) => (
                <Card 
                  key={platform.platform}
                  className={cn(
                    "border-0 shadow-lg transition-all hover:shadow-xl",
                    platform.available ? "bg-green-500/5" : "bg-red-500/5"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg",
                          platform.color
                        )}>
                          {platform.icon}
                        </div>
                        <div>
                          <p className="font-medium">{platform.platform}</p>
                          <p className="text-xs text-muted-foreground">@{result.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {platform.available ? (
                          <Badge className="bg-green-500 text-white">
                            <Check className="w-3 h-3 mr-1" />
                            {t("tools.username-checker.available")}
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <X className="w-3 h-3 mr-1" />
                            {t("tools.username-checker.taken")}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => window.open(platform.url, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Suggestions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t("tools.username-checker.suggestions")}
                </CardTitle>
                <CardDescription>{t("tools.username-checker.suggestionsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {result.suggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        setUsername(suggestion);
                        handleCheck();
                      }}
                    >
                      @{suggestion}
                      <Copy 
                        className="w-3 h-3 opacity-50 hover:opacity-100" 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyUsername(suggestion);
                        }}
                      />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Check Another */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setUsername("");
                  setResult(null);
                }}
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                {t("tools.username-checker.checkAnother")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
