"use client";

import { useState, useRef } from "react";
import { DollarSign, Users, Eye, Heart, TrendingUp, Gift, Briefcase, Play, Share2, Sparkles, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { cn } from "@/lib/utils";

interface EarningsBreakdown {
  creatorFund: { min: number; max: number };
  sponsorships: { min: number; max: number };
  gifts: { min: number; max: number };
  affiliate: { min: number; max: number };
  total: { min: number; max: number };
  tier: string;
  tierColor: string;
  cpm: { min: number; max: number };
}

const NICHES = [
  { value: "general", label: "General/Entertainment", cpmMultiplier: 1.0 },
  { value: "finance", label: "Finance/Business", cpmMultiplier: 2.5 },
  { value: "tech", label: "Tech/Software", cpmMultiplier: 2.0 },
  { value: "beauty", label: "Beauty/Fashion", cpmMultiplier: 1.8 },
  { value: "fitness", label: "Fitness/Health", cpmMultiplier: 1.5 },
  { value: "food", label: "Food/Cooking", cpmMultiplier: 1.3 },
  { value: "gaming", label: "Gaming", cpmMultiplier: 1.2 },
  { value: "education", label: "Education", cpmMultiplier: 1.6 },
  { value: "music", label: "Music/Dance", cpmMultiplier: 1.1 },
  { value: "lifestyle", label: "Lifestyle/Vlog", cpmMultiplier: 1.4 },
];

const COUNTRIES = [
  { value: "us", label: "United States", multiplier: 1.0 },
  { value: "uk", label: "United Kingdom", multiplier: 0.85 },
  { value: "ca", label: "Canada", multiplier: 0.75 },
  { value: "au", label: "Australia", multiplier: 0.80 },
  { value: "de", label: "Germany", multiplier: 0.70 },
  { value: "fr", label: "France", multiplier: 0.65 },
  { value: "br", label: "Brazil", multiplier: 0.25 },
  { value: "mx", label: "Mexico", multiplier: 0.20 },
  { value: "in", label: "India", multiplier: 0.15 },
  { value: "other", label: "Other", multiplier: 0.30 },
];

function calculateEarnings(
  followers: number, 
  avgViews: number, 
  engagementRate: number,
  niche: string,
  country: string
): EarningsBreakdown {
  const nicheData = NICHES.find(n => n.value === niche) || NICHES[0];
  const countryData = COUNTRIES.find(c => c.value === country) || COUNTRIES[0];
  
  // TikTok Creativity Program (replaced Creator Fund) - $0.50-$1.00 per 1000 qualified views
  // Only videos 1min+ qualify, estimate 30% of views qualify
  const qualifiedViews = avgViews * 0.3;
  const baseCPM = 0.70; // Average CPM
  const adjustedCPM = baseCPM * nicheData.cpmMultiplier * countryData.multiplier;
  
  const creatorFundMin = (qualifiedViews / 1000) * (adjustedCPM * 0.5) * 30;
  const creatorFundMax = (qualifiedViews / 1000) * (adjustedCPM * 1.5) * 30;

  // Sponsorship rates based on real industry data
  // Nano (1K-10K): $5-$25/post, Micro (10K-100K): $25-$125/post
  // Mid (100K-500K): $125-$1,250/post, Macro (500K-1M): $1,250-$2,500/post
  // Mega (1M+): $2,500-$10,000+/post
  let sponsorBase = 0;
  let sponsorMax = 0;
  
  if (followers >= 10000000) {
    sponsorBase = 15000;
    sponsorMax = 50000;
  } else if (followers >= 1000000) {
    sponsorBase = 2500;
    sponsorMax = 15000;
  } else if (followers >= 500000) {
    sponsorBase = 1250;
    sponsorMax = 3500;
  } else if (followers >= 100000) {
    sponsorBase = 250;
    sponsorMax = 1500;
  } else if (followers >= 10000) {
    sponsorBase = 50;
    sponsorMax = 250;
  } else if (followers >= 1000) {
    sponsorBase = 10;
    sponsorMax = 75;
  }
  
  // Engagement rate bonus (industry standard: 3-6% is good)
  const engagementMultiplier = engagementRate > 8 ? 2.0 : engagementRate > 6 ? 1.5 : engagementRate > 4 ? 1.2 : 1.0;
  const nicheSponsorship = nicheData.cpmMultiplier; // Finance/tech pays more
  
  // Assume 1-2 sponsored posts per month for smaller, 4-8 for larger creators
  const postsPerMonth = followers >= 100000 ? 4 : followers >= 10000 ? 2 : 1;
  
  const sponsorshipsMin = sponsorBase * engagementMultiplier * nicheSponsorship * postsPerMonth * 0.5;
  const sponsorshipsMax = sponsorMax * engagementMultiplier * nicheSponsorship * postsPerMonth;

  // Live Gifts - Based on actual TikTok data
  // Average gift value: $0.001-$0.05 per like on live
  // Estimate 1% of followers attend lives, with 5% gifting
  const liveViewers = followers * 0.01;
  const gifters = liveViewers * 0.05;
  const avgGiftValue = followers > 100000 ? 5 : followers > 10000 ? 2 : 0.5;
  
  const giftsMin = followers > 10000 ? gifters * avgGiftValue * 4 : 0; // 4 lives/month
  const giftsMax = followers > 10000 ? gifters * avgGiftValue * 8 * 2 : 0;

  // Affiliate/Shop commission - TikTok Shop averages 10-20% commission
  const affiliateConversion = 0.002; // 0.2% of viewers buy
  const avgOrderValue = 35;
  const commissionRate = 0.15;
  
  const affiliateMin = avgViews * affiliateConversion * avgOrderValue * commissionRate * 0.5 * 30;
  const affiliateMax = avgViews * affiliateConversion * avgOrderValue * commissionRate * 2 * 30;

  const totalMin = creatorFundMin + sponsorshipsMin + giftsMin + affiliateMin;
  const totalMax = creatorFundMax + sponsorshipsMax + giftsMax + affiliateMax;

  // Determine tier
  let tier = "Rising Star";
  let tierColor = "bg-blue-500";
  
  if (followers >= 10000000) {
    tier = "Mega Creator 👑";
    tierColor = "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500";
  } else if (followers >= 1000000) {
    tier = "Macro Influencer 🌟";
    tierColor = "bg-gradient-to-r from-orange-500 to-red-500";
  } else if (followers >= 100000) {
    tier = "Mid-Tier Creator 📈";
    tierColor = "bg-gradient-to-r from-green-500 to-emerald-500";
  } else if (followers >= 10000) {
    tier = "Micro Influencer 🚀";
    tierColor = "bg-gradient-to-r from-blue-500 to-cyan-500";
  } else if (followers >= 1000) {
    tier = "Nano Creator ⭐";
    tierColor = "bg-gradient-to-r from-gray-500 to-slate-500";
  }

  return {
    creatorFund: { min: Math.round(creatorFundMin), max: Math.round(creatorFundMax) },
    sponsorships: { min: Math.round(sponsorshipsMin), max: Math.round(sponsorshipsMax) },
    gifts: { min: Math.round(giftsMin), max: Math.round(giftsMax) },
    affiliate: { min: Math.round(affiliateMin), max: Math.round(affiliateMax) },
    total: { min: Math.round(totalMin), max: Math.round(totalMax) },
    tier,
    tierColor,
    cpm: { min: adjustedCPM * 0.5, max: adjustedCPM * 1.5 },
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
  const [niche, setNiche] = useState<string>("general");
  const [country, setCountry] = useState<string>("us");
  const [calculated, setCalculated] = useState(false);
  const [earnings, setEarnings] = useState<EarningsBreakdown | null>(null);

  const handleCalculate = () => {
    const result = calculateEarnings(followers, avgViews, engagementRate, niche, country);
    setEarnings(result);
    setCalculated(true);
    
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleShare = async () => {
    const shareData = {
      title: t("tools.money-calculator.shareTitle"),
      text: t("tools.money-calculator.shareText", { 
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
      titleKey="tools.money-calculator.title"
      descriptionKey="tools.money-calculator.description"
      icon={<DollarSign className="w-10 h-10" />}
      gradient="from-green-500 to-emerald-500"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Calculator Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              {t("tools.money-calculator.formTitle")}
            </CardTitle>
            <CardDescription>{t("tools.money-calculator.formDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Niche & Country Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Content Niche
                </Label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NICHES.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.label} {n.cpmMultiplier > 1.5 && "💰"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Higher-paying niches earn more from sponsorships</p>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  🌍 Primary Audience Location
                </Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">CPM rates vary by country</p>
              </div>
            </div>
            
            {/* Followers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {t("tools.money-calculator.followers")}
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
                  {t("tools.money-calculator.avgViews")}
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
                  {t("tools.money-calculator.engagementRate")}
                </Label>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {engagementRate.toFixed(1)}%
                  {engagementRate > 6 && " 🔥"}
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
                <span>0.1% (Low)</span>
                <span>3-6% (Good)</span>
                <span>20% (Viral)</span>
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              {t("tools.money-calculator.calculate")}
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
                      {t("tools.money-calculator.estimatedMonthly")}
                    </h3>
                    <div className="text-5xl md:text-6xl font-bold font-headline bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {formatCurrency(earnings.total.min)} - {formatCurrency(earnings.total.max)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("tools.money-calculator.perMonth")}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Info className="w-3 h-3" />
                      Estimated CPM: ${earnings.cpm.min.toFixed(2)} - ${earnings.cpm.max.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Creator Program */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Play className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="font-medium text-sm">Creativity Program</span>
                  </div>
                  <p className="text-xl font-bold">
                    {formatCurrency(earnings.creatorFund.min)} - {formatCurrency(earnings.creatorFund.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Videos 1min+ only
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
                    <span className="font-medium text-sm">Brand Deals</span>
                  </div>
                  <p className="text-xl font-bold">
                    {formatCurrency(earnings.sponsorships.min)} - {formatCurrency(earnings.sponsorships.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Biggest income source
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
                    <span className="font-medium text-sm">Live Gifts</span>
                  </div>
                  <p className="text-xl font-bold">
                    {formatCurrency(earnings.gifts.min)} - {formatCurrency(earnings.gifts.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {followers < 10000 ? "Need 10K+ followers" : "Based on live frequency"}
                  </p>
                </CardContent>
              </Card>

              {/* Affiliate */}
              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="font-medium text-sm">TikTok Shop</span>
                  </div>
                  <p className="text-xl font-bold">
                    {formatCurrency(earnings.affiliate.min)} - {formatCurrency(earnings.affiliate.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    10-20% commission
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
                      <h4 className="font-bold text-lg">{t("tools.money-calculator.yearlyProjection")}</h4>
                      <p className="text-sm text-muted-foreground">{t("tools.money-calculator.yearlyDesc")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {formatCurrency(earnings.total.min * 12)} - {formatCurrency(earnings.total.max * 12)}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("tools.money-calculator.perYear")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-2">Important Notes:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>TikTok Creativity Program requires 10K+ followers and videos 1 minute or longer</li>
                      <li>Brand deals vary significantly based on your specific metrics and negotiation skills</li>
                      <li>Actual earnings depend on content quality, posting consistency, and niche demand</li>
                      <li>These are estimates based on industry averages - your results may vary</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Button */}
            <div className="flex justify-center gap-4">
              <Button onClick={handleShare} size="lg" className="bg-gradient-to-r from-primary to-accent">
                <Share2 className="mr-2 h-5 w-5" />
                {t("tools.money-calculator.shareResults")}
              </Button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-12 border-0 bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold font-headline mb-4">{t("tools.money-calculator.howItWorks")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-500" />
                  Creativity Program (Beta)
                </h4>
                <p className="text-sm text-muted-foreground">
                  TikTok pays $0.50-$1.00 per 1,000 qualified views on videos 1 minute or longer. Must have 10K+ followers and 100K views in last 30 days to qualify.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  Brand Sponsorships
                </h4>
                <p className="text-sm text-muted-foreground">
                  The biggest income source for most creators. Rates depend on niche, engagement, and audience demographics. Finance/tech niches pay 2-3x more.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-500" />
                  Live Gifts & Diamonds
                </h4>
                <p className="text-sm text-muted-foreground">
                  Viewers send virtual gifts during lives. Creators keep about 50% of gift value. Regular live streaming can significantly boost this income.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  TikTok Shop & Affiliate
                </h4>
                <p className="text-sm text-muted-foreground">
                  Earn 10-20% commission on products sold through your videos. Top sellers make more from TikTok Shop than all other sources combined.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
