"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Award, Download, Share2, Palette, Sparkles, Loader2, Eye, Heart, Users, Play, TrendingUp, Image as ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "gradient-purple", label: "Purple Dream", gradient: "from-purple-600 via-pink-500 to-orange-400" },
  { value: "gradient-blue", label: "Ocean Blue", gradient: "from-blue-600 via-cyan-500 to-teal-400" },
  { value: "gradient-green", label: "Forest", gradient: "from-green-600 via-emerald-500 to-lime-400" },
  { value: "gradient-sunset", label: "Sunset", gradient: "from-orange-500 via-red-500 to-pink-500" },
  { value: "gradient-dark", label: "Dark Mode", gradient: "from-gray-900 via-gray-800 to-gray-700" },
  { value: "gradient-neon", label: "Neon Nights", gradient: "from-violet-600 via-fuchsia-500 to-pink-400" },
  { value: "gradient-gold", label: "Golden", gradient: "from-yellow-500 via-amber-500 to-orange-500" },
  { value: "tiktok", label: "TikTok Style", gradient: "from-[#00f2ea] via-black to-[#ff0050]" },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default function StatsCardPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [followers, setFollowers] = useState(100000);
  const [likes, setLikes] = useState(500000);
  const [views, setViews] = useState(2000000);
  const [videos, setVideos] = useState(50);
  const [theme, setTheme] = useState("gradient-purple");
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: t("tools.stats-card.errorTitle"),
          description: "Please upload an image file (JPG, PNG, GIF)",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t("tools.stats-card.errorTitle"),
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectedTheme = THEMES.find((t) => t.value === theme);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement("a");
      link.download = `tiktok-stats-${username || "card"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast({
        title: t("tools.stats-card.downloaded"),
        description: t("tools.stats-card.downloadedDesc"),
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: t("tools.stats-card.errorTitle"),
        description: t("tools.stats-card.errorDownload"),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const text = t("tools.stats-card.shareText", { username: username || "Creator" });
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("tools.stats-card.shareTitle"),
          text,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      toast({ title: t("share.copied") });
    }
  };

  return (
    <ToolLayout
      titleKey="tools.stats-card.title"
      descriptionKey="tools.stats-card.description"
      icon={<Award className="w-10 h-10" />}
      gradient="from-amber-500 to-orange-500"
      toolId="stats-card"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                {t("tools.stats-card.customize")}
              </CardTitle>
              <CardDescription>{t("tools.stats-card.customizeDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label>{t("tools.stats-card.username")}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="yourname"
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Profile Photo
                </Label>
                <div className="space-y-3">
                  {profileImage ? (
                    <div className="relative inline-block">
                      <img 
                        src={profileImage} 
                        alt="Profile preview" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                        type="button"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {profileImage ? "Change Photo" : "Upload Photo"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload your profile photo (JPG, PNG, max 5MB)
                </p>
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <Label>{t("tools.stats-card.theme")}</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-4 h-4 rounded bg-gradient-to-r", t.gradient)} />
                          {t.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Followers */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{t("tools.stats-card.followers")}</Label>
                  <span className="text-sm font-medium">{formatNumber(followers)}</span>
                </div>
                <Slider
                  value={[followers]}
                  onValueChange={(v) => setFollowers(v[0])}
                  min={0}
                  max={50000000}
                  step={1000}
                />
              </div>

              {/* Likes */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{t("tools.stats-card.likes")}</Label>
                  <span className="text-sm font-medium">{formatNumber(likes)}</span>
                </div>
                <Slider
                  value={[likes]}
                  onValueChange={(v) => setLikes(v[0])}
                  min={0}
                  max={100000000}
                  step={1000}
                />
              </div>

              {/* Views */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{t("tools.stats-card.views")}</Label>
                  <span className="text-sm font-medium">{formatNumber(views)}</span>
                </div>
                <Slider
                  value={[views]}
                  onValueChange={(v) => setViews(v[0])}
                  min={0}
                  max={500000000}
                  step={10000}
                />
              </div>

              {/* Videos */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{t("tools.stats-card.videos")}</Label>
                  <span className="text-sm font-medium">{videos}</span>
                </div>
                <Slider
                  value={[videos]}
                  onValueChange={(v) => setVideos(v[0])}
                  min={1}
                  max={1000}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t("tools.stats-card.preview")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Stats Card Preview */}
                <div
                  ref={cardRef}
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br",
                    selectedTheme?.gradient
                  )}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                  </div>

                  <div className="relative z-10 text-white">
                    {/* Header */}
                    <div className="text-center mb-8">
                      {/* Profile Image */}
                      <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold mb-4 overflow-hidden border-4 border-white/30">
                        {profileImage ? (
                          <img 
                            src={profileImage} 
                            alt={username || "Profile"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{username ? username.charAt(0).toUpperCase() : "?"}</span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold">@{username || "username"}</h2>
                      <p className="text-white/70 text-sm mt-1">{t("tools.stats-card.tiktokCreator")}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Users className="w-6 h-6 mx-auto mb-2 opacity-80" />
                        <p className="text-2xl font-bold">{formatNumber(followers)}</p>
                        <p className="text-xs text-white/70">{t("tools.stats-card.followers")}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Heart className="w-6 h-6 mx-auto mb-2 opacity-80" />
                        <p className="text-2xl font-bold">{formatNumber(likes)}</p>
                        <p className="text-xs text-white/70">{t("tools.stats-card.likes")}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Eye className="w-6 h-6 mx-auto mb-2 opacity-80" />
                        <p className="text-2xl font-bold">{formatNumber(views)}</p>
                        <p className="text-xs text-white/70">{t("tools.stats-card.views")}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Play className="w-6 h-6 mx-auto mb-2 opacity-80" />
                        <p className="text-2xl font-bold">{videos}</p>
                        <p className="text-xs text-white/70">{t("tools.stats-card.videos")}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">TikTok Stats</span>
                      </div>
                      <span className="text-xs text-white/50">tiklink.ink</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Download className="mr-2 h-5 w-5" />
                )}
                {t("tools.stats-card.download")}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 h-12"
              >
                <Share2 className="mr-2 h-5 w-5" />
                {t("tools.stats-card.share")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
