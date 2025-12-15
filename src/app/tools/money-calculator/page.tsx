"use client";

import { useState, useRef } from "react";
import type { Metadata } from "next";
import { DollarSign, Users, Eye, Heart, TrendingUp, Gift, Briefcase, Play, Share2, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

interface EarningsBreakdown {
  creatorFund: { min: number; max: number };
  sponsorships: { min: number; max: number };
  gifts: { min: number; max: number };
  total: { min: number; max: number };
  tier: string;
  tierColor: string;
}

function calculateEarnings(followers: number, avgViews: number, engagementRate: number): EarningsBreakdown {
  // Creator Fund: $0.02 - $0.04 per 1000 views
  const creatorFundMin = (avgViews / 1000) * 0.02 * 30; // Monthly
  const creatorFundMax = (avgViews / 1000) * 0.04 * 30;

  // Sponsorships: Based on followers and engagement
  const baseRate = followers / 100; // $1 per 100 followers base
  const engagementMultiplier = engagementRate > 5 ? 2 : engagementRate > 3 ? 1.5 : 1;
  const sponsorshipsMin = baseRate * engagementMultiplier * 0.5;
  const sponsorshipsMax = baseRate * engagementMultiplier * 2;

  // Live Gifts: Estimated based on engagement and followers
  const giftsMin = followers > 10000 ? (avgViews / 1000) * 0.5 : 0;
  const giftsMax = followers > 10000 ? (avgViews / 1000) * 2 : 0;

  const totalMin = creatorFundMin + sponsorshipsMin + giftsMin;
  const totalMax = creatorFundMax + sponsorshipsMax + giftsMax;

  // Determine tier
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
  } else if (followers >= 1000) {
    tier = "Nano Influencer";
    tierColor = "bg-gradient-to-r from-gray-500 to-slate-500";
  }

  return {
    creatorFund: { min: Math.round(creatorFundMin), max: Math.round(creatorFundMax) },
    sponsorships: { min: Math.round(sponsorshipsMin), max: Math.round(sponsorshipsMax) },
    gifts: { min: Math.round(giftsMin), max: Math.round(giftsMax) },
    total: { min: Math.round(totalMin), max: Math.round(totalMax) },
    tier,
    tierColor,
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export default function MoneyCalculatorPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);
  
  const [followers, setFollowers] = useState<number>(100000);
  const [avgViews, setAvgViews] = useState<number>(50000);
  const [engagementRate, setEngagementRate] = useState<number>(5);
  const [calculated, setCalculated] = useState(false);
  const [earnings, setEarnings] = useState<EarningsBreakdown | null>(null);

  const handleCalculate = () => {
    const result = calculateEarnings(followers, avgViews, engagementRate);
    setEarnings(result);
    setCalculated(true);
    
    // Scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleShare = async () => {
    const shareData = {
      title: t("tools.moneyCalculator.shareTitle"),
      text: t("tools.moneyCalculator.shareText", { 
        min: formatCurrency(earnings?.total.min || 0),
        max: formatCurrency(earnings?.total.max || 0)
      }),
      url: window.location.href,
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      toast({
        title: t("share.copied"),
        description: t("share.copiedSuccess"),
      });
    }
  };

  return (
    <ToolLayout
      titleKey="tools.moneyCalculator.title"
      descriptionKey="tools.moneyCalculator.description"
      icon={<DollarSign className="w-10 h-10" />}
      gradient="from-green-500 to-emerald-500"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Calculator Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              {t("tools.moneyCalculator.formTitle")}
            </CardTitle>
            <CardDescription>{t("tools.moneyCalculator.formDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Followers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {t("tools.moneyCalculator.followers")}
                </Label>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {formatNumber(followers)}
                </Badge>
              </div>
              <Slider
                value={[followers]}
                onValueChange={(v) => setFollowers(v[0])}
                min={1000}
                max={50000000}
                step={1000}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1K</span>
                <span>50M</span>
              </div>
            </div>

            {/* Average Views */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  {t("tools.moneyCalculator.avgViews")}
                </Label>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {formatNumber(avgViews)}
                </Badge>
              </div>
              <Slider
                value={[avgViews]}
                onValueChange={(v) => setAvgViews(v[0])}
                min={100}
                max={10000000}
                step={100}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100</span>
                <span>10M</span>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  {t("tools.moneyCalculator.engagementRate")}
                </Label>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {engagementRate.toFixed(1)}%
                </Badge>
              </div>
              <Slider
                value={[engagementRate]}
                onValueChange={(v) => setEngagementRate(v[0])}
                min={0.1}
                max={20}
                step={0.1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.1%</span>
                <span>20%</span>
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              {t("tools.moneyCalculator.calculate")}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {calculated && earnings && (
          <div ref={resultRef} className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Main Earnings Card */}
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className={cn("p-1", earnings.tierColor)}>
                <div className="bg-card rounded-lg p-6">
                  <div className="text-center space-y-4">
                    <Badge className={cn("text-white px-4 py-1", earnings.tierColor)}>
                      {earnings.tier}
                    </Badge>
                    <h3 className="text-xl font-medium text-muted-foreground">
                      {t("tools.moneyCalculator.estimatedMonthly")}
                    </h3>
                    <div className="text-5xl md:text-6xl font-bold font-headline bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {formatCurrency(earnings.total.min)} - {formatCurrency(earnings.total.max)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("tools.moneyCalculator.perMonth")}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Creator Fund */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Play className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="font-medium">{t("tools.moneyCalculator.creatorFund")}</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(earnings.creatorFund.min)} - {formatCurrency(earnings.creatorFund.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("tools.moneyCalculator.creatorFundDesc")}
                  </p>
                </CardContent>
              </Card>

              {/* Sponsorships */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Briefcase className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="font-medium">{t("tools.moneyCalculator.sponsorships")}</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(earnings.sponsorships.min)} - {formatCurrency(earnings.sponsorships.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("tools.moneyCalculator.sponsorshipsDesc")}
                  </p>
                </CardContent>
              </Card>

              {/* Live Gifts */}
              <Card className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-pink-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-pink-500/20">
                      <Gift className="w-5 h-5 text-pink-500" />
                    </div>
                    <span className="font-medium">{t("tools.moneyCalculator.liveGifts")}</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(earnings.gifts.min)} - {formatCurrency(earnings.gifts.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("tools.moneyCalculator.liveGiftsDesc")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Yearly Projection */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t("tools.moneyCalculator.yearlyProjection")}</h4>
                      <p className="text-sm text-muted-foreground">{t("tools.moneyCalculator.yearlyDesc")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {formatCurrency(earnings.total.min * 12)} - {formatCurrency(earnings.total.max * 12)}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("tools.moneyCalculator.perYear")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Button */}
            <div className="flex justify-center gap-4">
              <Button onClick={handleShare} size="lg" className="bg-gradient-to-r from-primary to-accent">
                <Share2 className="mr-2 h-5 w-5" />
                {t("tools.moneyCalculator.shareResults")}
              </Button>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-muted-foreground max-w-2xl mx-auto">
              {t("tools.moneyCalculator.disclaimer")}
            </p>
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-12 border-0 bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold font-headline mb-4">{t("tools.moneyCalculator.howItWorks")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-500" />
                  {t("tools.moneyCalculator.creatorFund")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("tools.moneyCalculator.creatorFundInfo")}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  {t("tools.moneyCalculator.sponsorships")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("tools.moneyCalculator.sponsorshipsInfo")}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-500" />
                  {t("tools.moneyCalculator.liveGifts")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("tools.moneyCalculator.liveGiftsInfo")}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  {t("tools.moneyCalculator.growthTips")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("tools.moneyCalculator.growthTipsInfo")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
