"use client";

import { useState, useRef } from "react";
import { DollarSign, Users, Eye, Heart, TrendingUp, Gift, Briefcase, Play, Share2, Sparkles, Info, AlertCircle, Globe, Calculator, Zap, Crown, Target, BarChart3, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/tools/tool-layout";
import { cn } from "@/lib/utils";

interface EarningsBreakdown {
  creatorFund: { min: number; max: number; eligible: boolean };
  sponsorships: { min: number; max: number; perPost: { min: number; max: number } };
  gifts: { min: number; max: number; eligible: boolean };
  affiliate: { min: number; max: number };
  total: { min: number; max: number };
  tier: string;
  tierColor: string;
  tierIcon: string;
  cpm: { min: number; max: number };
  engagementRating: string;
  potentialGrowth: number;
}

// 2024 Updated TikTok Creator Program Rates by Country (USD per 1000 qualified views)
const COUNTRY_CPM_RATES: Record<string, { min: number; max: number; name: string; flag: string; currency: string; exchangeRate: number }> = {
  us: { min: 0.50, max: 1.00, name: "United States", flag: "🇺🇸", currency: "USD", exchangeRate: 1 },
  uk: { min: 0.40, max: 0.80, name: "United Kingdom", flag: "🇬🇧", currency: "GBP", exchangeRate: 0.79 },
  ca: { min: 0.35, max: 0.70, name: "Canada", flag: "🇨🇦", currency: "CAD", exchangeRate: 1.36 },
  au: { min: 0.40, max: 0.75, name: "Australia", flag: "🇦🇺", currency: "AUD", exchangeRate: 1.53 },
  de: { min: 0.35, max: 0.65, name: "Germany", flag: "🇩🇪", currency: "EUR", exchangeRate: 0.92 },
  fr: { min: 0.30, max: 0.60, name: "France", flag: "🇫🇷", currency: "EUR", exchangeRate: 0.92 },
  es: { min: 0.25, max: 0.50, name: "Spain", flag: "🇪🇸", currency: "EUR", exchangeRate: 0.92 },
  it: { min: 0.25, max: 0.50, name: "Italy", flag: "🇮🇹", currency: "EUR", exchangeRate: 0.92 },
  br: { min: 0.08, max: 0.20, name: "Brazil", flag: "🇧🇷", currency: "BRL", exchangeRate: 4.97 },
  mx: { min: 0.06, max: 0.15, name: "Mexico", flag: "🇲🇽", currency: "MXN", exchangeRate: 17.15 },
  in: { min: 0.02, max: 0.08, name: "India", flag: "🇮🇳", currency: "INR", exchangeRate: 83.12 },
  id: { min: 0.03, max: 0.10, name: "Indonesia", flag: "🇮🇩", currency: "IDR", exchangeRate: 15750 },
  ph: { min: 0.04, max: 0.12, name: "Philippines", flag: "🇵🇭", currency: "PHP", exchangeRate: 55.8 },
  ae: { min: 0.45, max: 0.85, name: "UAE", flag: "🇦🇪", currency: "AED", exchangeRate: 3.67 },
  sa: { min: 0.40, max: 0.80, name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", exchangeRate: 3.75 },
  jp: { min: 0.30, max: 0.60, name: "Japan", flag: "🇯🇵", currency: "JPY", exchangeRate: 149.5 },
  kr: { min: 0.25, max: 0.55, name: "South Korea", flag: "🇰🇷", currency: "KRW", exchangeRate: 1320 },
  sg: { min: 0.40, max: 0.75, name: "Singapore", flag: "🇸🇬", currency: "SGD", exchangeRate: 1.34 },
  za: { min: 0.10, max: 0.25, name: "South Africa", flag: "🇿🇦", currency: "ZAR", exchangeRate: 18.5 },
  ng: { min: 0.03, max: 0.10, name: "Nigeria", flag: "🇳🇬", currency: "NGN", exchangeRate: 1550 },
};

// 2024 Niche-specific sponsorship multipliers (based on industry data)
const NICHES = [
  { value: "general", label: "General/Entertainment", icon: "🎭", sponsorMultiplier: 1.0, cpmMultiplier: 1.0, demandLevel: "Medium" },
  { value: "finance", label: "Finance/Investing", icon: "💰", sponsorMultiplier: 3.0, cpmMultiplier: 2.5, demandLevel: "Very High" },
  { value: "tech", label: "Tech/Software", icon: "💻", sponsorMultiplier: 2.5, cpmMultiplier: 2.0, demandLevel: "High" },
  { value: "beauty", label: "Beauty/Skincare", icon: "💄", sponsorMultiplier: 2.2, cpmMultiplier: 1.8, demandLevel: "Very High" },
  { value: "fashion", label: "Fashion/Style", icon: "👗", sponsorMultiplier: 2.0, cpmMultiplier: 1.7, demandLevel: "High" },
  { value: "fitness", label: "Fitness/Gym", icon: "💪", sponsorMultiplier: 1.8, cpmMultiplier: 1.5, demandLevel: "High" },
  { value: "health", label: "Health/Wellness", icon: "🧘", sponsorMultiplier: 2.0, cpmMultiplier: 1.6, demandLevel: "High" },
  { value: "food", label: "Food/Cooking", icon: "🍳", sponsorMultiplier: 1.5, cpmMultiplier: 1.3, demandLevel: "Medium" },
  { value: "gaming", label: "Gaming", icon: "🎮", sponsorMultiplier: 1.4, cpmMultiplier: 1.2, demandLevel: "Medium" },
  { value: "education", label: "Education/Learning", icon: "📚", sponsorMultiplier: 1.8, cpmMultiplier: 1.6, demandLevel: "High" },
  { value: "music", label: "Music/Dance", icon: "🎵", sponsorMultiplier: 1.2, cpmMultiplier: 1.1, demandLevel: "Medium" },
  { value: "lifestyle", label: "Lifestyle/Vlog", icon: "✨", sponsorMultiplier: 1.5, cpmMultiplier: 1.4, demandLevel: "Medium" },
  { value: "parenting", label: "Parenting/Family", icon: "👶", sponsorMultiplier: 1.8, cpmMultiplier: 1.5, demandLevel: "High" },
  { value: "travel", label: "Travel", icon: "✈️", sponsorMultiplier: 1.7, cpmMultiplier: 1.4, demandLevel: "High" },
  { value: "pets", label: "Pets/Animals", icon: "🐕", sponsorMultiplier: 1.4, cpmMultiplier: 1.2, demandLevel: "Medium" },
];

// 2024 Sponsorship rates per post (based on industry benchmarks)
const SPONSORSHIP_RATES = {
  nano: { followers: [1000, 10000], perPost: { min: 10, max: 100 }, postsPerMonth: 1 },
  micro: { followers: [10000, 50000], perPost: { min: 100, max: 500 }, postsPerMonth: 2 },
  midTier: { followers: [50000, 100000], perPost: { min: 500, max: 1500 }, postsPerMonth: 3 },
  macro: { followers: [100000, 500000], perPost: { min: 1500, max: 5000 }, postsPerMonth: 4 },
  mega: { followers: [500000, 1000000], perPost: { min: 5000, max: 15000 }, postsPerMonth: 5 },
  celebrity: { followers: [1000000, 10000000], perPost: { min: 15000, max: 50000 }, postsPerMonth: 6 },
  superstar: { followers: [10000000, Infinity], perPost: { min: 50000, max: 250000 }, postsPerMonth: 8 },
};

function calculateEarnings(
  followers: number,
  avgViews: number,
  engagementRate: number,
  niche: string,
  country: string,
  postsPerWeek: number
): EarningsBreakdown {
  const nicheData = NICHES.find((n) => n.value === niche) || NICHES[0];
  const countryData = COUNTRY_CPM_RATES[country] || COUNTRY_CPM_RATES.us;

  // Eligibility checks
  const creatorProgramEligible = followers >= 10000;
  const liveGiftsEligible = followers >= 1000;

  // TikTok Creativity Program (2024 rates)
  // Only videos 1min+ qualify, estimate 40% of videos are 1min+
  const monthlyViews = avgViews * postsPerWeek * 4;
  const qualifiedViews = monthlyViews * 0.4;
  const baseCpmMin = countryData.min * nicheData.cpmMultiplier;
  const baseCpmMax = countryData.max * nicheData.cpmMultiplier;

  const creatorFundMin = creatorProgramEligible ? (qualifiedViews / 1000) * baseCpmMin : 0;
  const creatorFundMax = creatorProgramEligible ? (qualifiedViews / 1000) * baseCpmMax : 0;

  // Sponsorship calculation
  let sponsorTier = SPONSORSHIP_RATES.nano;
  if (followers >= 10000000) sponsorTier = SPONSORSHIP_RATES.superstar;
  else if (followers >= 1000000) sponsorTier = SPONSORSHIP_RATES.celebrity;
  else if (followers >= 500000) sponsorTier = SPONSORSHIP_RATES.mega;
  else if (followers >= 100000) sponsorTier = SPONSORSHIP_RATES.macro;
  else if (followers >= 50000) sponsorTier = SPONSORSHIP_RATES.midTier;
  else if (followers >= 10000) sponsorTier = SPONSORSHIP_RATES.micro;

  // Engagement rate bonus (industry standard: 4-6% is good, 8%+ is excellent)
  const engagementMultiplier = engagementRate >= 10 ? 2.0 : engagementRate >= 8 ? 1.7 : engagementRate >= 6 ? 1.4 : engagementRate >= 4 ? 1.2 : 1.0;

  const sponsorPerPostMin = Math.round(sponsorTier.perPost.min * nicheData.sponsorMultiplier * engagementMultiplier);
  const sponsorPerPostMax = Math.round(sponsorTier.perPost.max * nicheData.sponsorMultiplier * engagementMultiplier);
  const sponsorshipsMin = sponsorPerPostMin * Math.max(1, Math.floor(sponsorTier.postsPerMonth * 0.5));
  const sponsorshipsMax = sponsorPerPostMax * sponsorTier.postsPerMonth;

  // Live Gifts calculation (TikTok takes 50%, creator gets 50%)
  // Average: 0.5-2% of followers attend lives, 2-5% of those gift
  const liveViewers = followers * 0.01;
  const gifters = liveViewers * 0.03;
  const avgGiftValue = followers > 500000 ? 15 : followers > 100000 ? 8 : followers > 10000 ? 3 : 1;
  const livesPerMonth = 4;

  const giftsMin = liveGiftsEligible ? Math.round(gifters * avgGiftValue * livesPerMonth * 0.5) : 0;
  const giftsMax = liveGiftsEligible ? Math.round(gifters * avgGiftValue * livesPerMonth * 2 * 0.5) : 0;

  // TikTok Shop & Affiliate (10-20% commission, 0.1-0.3% conversion rate)
  const conversionRate = 0.002;
  const avgOrderValue = 40;
  const commissionRate = 0.15;
  const affiliateMin = Math.round(monthlyViews * conversionRate * 0.5 * avgOrderValue * commissionRate);
  const affiliateMax = Math.round(monthlyViews * conversionRate * 1.5 * avgOrderValue * commissionRate);

  const totalMin = creatorFundMin + sponsorshipsMin + giftsMin + affiliateMin;
  const totalMax = creatorFundMax + sponsorshipsMax + giftsMax + affiliateMax;

  // Determine tier
  let tier = "Aspiring Creator";
  let tierColor = "bg-slate-500";
  let tierIcon = "⭐";

  if (followers >= 10000000) {
    tier = "Mega Celebrity";
    tierColor = "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600";
    tierIcon = "👑";
  } else if (followers >= 1000000) {
    tier = "Macro Influencer";
    tierColor = "bg-gradient-to-r from-orange-500 to-red-500";
    tierIcon = "🔥";
  } else if (followers >= 500000) {
    tier = "Rising Star";
    tierColor = "bg-gradient-to-r from-purple-500 to-pink-500";
    tierIcon = "⚡";
  } else if (followers >= 100000) {
    tier = "Mid-Tier Creator";
    tierColor = "bg-gradient-to-r from-green-500 to-emerald-500";
    tierIcon = "📈";
  } else if (followers >= 10000) {
    tier = "Micro Influencer";
    tierColor = "bg-gradient-to-r from-blue-500 to-cyan-500";
    tierIcon = "🚀";
  } else if (followers >= 1000) {
    tier = "Nano Creator";
    tierColor = "bg-gradient-to-r from-gray-500 to-slate-600";
    tierIcon = "✨";
  }

  // Engagement rating
  let engagementRating = "Needs Improvement";
  if (engagementRate >= 10) engagementRating = "Exceptional 🔥";
  else if (engagementRate >= 8) engagementRating = "Excellent";
  else if (engagementRate >= 6) engagementRating = "Very Good";
  else if (engagementRate >= 4) engagementRating = "Good";
  else if (engagementRate >= 2) engagementRating = "Average";

  // Growth potential (based on engagement and niche demand)
  const potentialGrowth = Math.min(100, Math.round((engagementRate / 10) * 50 + (nicheData.sponsorMultiplier / 3) * 50));

  return {
    creatorFund: { min: Math.round(creatorFundMin), max: Math.round(creatorFundMax), eligible: creatorProgramEligible },
    sponsorships: { min: Math.round(sponsorshipsMin), max: Math.round(sponsorshipsMax), perPost: { min: sponsorPerPostMin, max: sponsorPerPostMax } },
    gifts: { min: giftsMin, max: giftsMax, eligible: liveGiftsEligible },
    affiliate: { min: affiliateMin, max: affiliateMax },
    total: { min: Math.round(totalMin), max: Math.round(totalMax) },
    tier,
    tierColor,
    tierIcon,
    cpm: { min: baseCpmMin, max: baseCpmMax },
    engagementRating,
    potentialGrowth,
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function formatCurrency(num: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
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
  const [postsPerWeek, setPostsPerWeek] = useState<number>(5);
  const [calculated, setCalculated] = useState(false);
  const [earnings, setEarnings] = useState<EarningsBreakdown | null>(null);
  const [showLocalCurrency, setShowLocalCurrency] = useState(false);

  const selectedCountry = COUNTRY_CPM_RATES[country];
  const selectedNiche = NICHES.find((n) => n.value === niche);

  const handleCalculate = () => {
    const result = calculateEarnings(followers, avgViews, engagementRate, niche, country, postsPerWeek);
    setEarnings(result);
    setCalculated(true);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const displayCurrency = (amount: number) => {
    if (showLocalCurrency && selectedCountry.currency !== "USD") {
      return formatCurrency(amount * selectedCountry.exchangeRate, selectedCountry.currency);
    }
    return formatCurrency(amount);
  };

  const handleShare = async () => {
    const shareData = {
      title: t("tools.money-calculator.shareTitle"),
      text: t("tools.money-calculator.shareText", {
        min: formatCurrency(earnings?.total.min || 0),
        max: formatCurrency(earnings?.total.max || 0),
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
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="outline" className="px-4 py-2">
            <BarChart3 className="w-4 h-4 mr-2" />
            2024 Industry Data
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Globe className="w-4 h-4 mr-2" />
            20+ Countries
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Target className="w-4 h-4 mr-2" />
            15 Niches
          </Badge>
        </div>

        {/* Calculator Form */}
        <Card className="shadow-2xl shadow-primary/10 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
              <Calculator className="w-6 h-6 text-accent" />
              {t("tools.money-calculator.formTitle")}
            </CardTitle>
            <CardDescription>Get accurate 2024 earnings estimates based on real creator data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Niche & Country Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Content Niche
                </Label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NICHES.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {n.icon} {n.label}
                          </span>
                          {n.sponsorMultiplier >= 2 && <Badge className="ml-2 bg-green-500 text-xs">High Paying</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedNiche && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Sponsor demand:</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedNiche.demandLevel}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Primary Audience Location
                </Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COUNTRY_CPM_RATES).map(([code, data]) => (
                      <SelectItem key={code} value={code}>
                        {data.flag} {data.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  CPM: ${selectedCountry.min.toFixed(2)} - ${selectedCountry.max.toFixed(2)} per 1K views
                </p>
              </div>
            </div>

            {/* Followers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {t("tools.money-calculator.followers")}
                </Label>
                <Badge variant="secondary" className="text-lg px-4 py-1 font-bold">
                  {formatNumber(followers)}
                </Badge>
              </div>
              <Slider value={[followers]} onValueChange={(v) => setFollowers(v[0])} min={1000} max={50000000} step={1000} className="py-4" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1K</span>
                <span>100K</span>
                <span>1M</span>
                <span>10M</span>
                <span>50M</span>
              </div>
            </div>

            {/* Average Views */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Average Views Per Video
                </Label>
                <Badge variant="secondary" className="text-lg px-4 py-1 font-bold">
                  {formatNumber(avgViews)}
                </Badge>
              </div>
              <Slider value={[avgViews]} onValueChange={(v) => setAvgViews(v[0])} min={100} max={10000000} step={100} className="py-4" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100</span>
                <span>10K</span>
                <span>100K</span>
                <span>1M</span>
                <span>10M</span>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Engagement Rate
                </Label>
                <Badge variant="secondary" className="text-lg px-4 py-1 font-bold">
                  {engagementRate.toFixed(1)}%
                  {engagementRate >= 8 && " 🔥"}
                </Badge>
              </div>
              <Slider value={[engagementRate]} onValueChange={(v) => setEngagementRate(v[0])} min={0.5} max={20} step={0.1} className="py-4" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-red-500">0.5% Low</span>
                <span className="text-yellow-500">3% Average</span>
                <span className="text-green-500">6% Good</span>
                <span className="text-emerald-500">10%+ Excellent</span>
              </div>
            </div>

            {/* Posts Per Week */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Posts Per Week
                </Label>
                <Badge variant="secondary" className="text-lg px-4 py-1 font-bold">
                  {postsPerWeek} posts
                </Badge>
              </div>
              <Slider value={[postsPerWeek]} onValueChange={(v) => setPostsPerWeek(v[0])} min={1} max={21} step={1} className="py-4" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1/week</span>
                <span>1/day</span>
                <span>2/day</span>
                <span>3/day</span>
              </div>
            </div>

            <Button onClick={handleCalculate} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Calculator className="mr-2 h-5 w-5" />
              Calculate My Earnings
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {calculated && earnings && (
          <div ref={resultRef} className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {/* Main Earnings Card */}
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className={cn("p-1", earnings.tierColor)}>
                <div className="bg-card rounded-lg p-8">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-4xl">{earnings.tierIcon}</span>
                      <Badge className={cn("text-white px-6 py-2 text-lg", earnings.tierColor)}>{earnings.tier}</Badge>
                    </div>
                    <h3 className="text-xl font-medium text-muted-foreground">Estimated Monthly Earnings</h3>
                    <div className="text-5xl md:text-7xl font-bold font-headline bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {displayCurrency(earnings.total.min)} - {displayCurrency(earnings.total.max)}
                    </div>
                    <p className="text-sm text-muted-foreground">per month in {showLocalCurrency ? selectedCountry.currency : "USD"}</p>

                    {selectedCountry.currency !== "USD" && (
                      <Button variant="outline" size="sm" onClick={() => setShowLocalCurrency(!showLocalCurrency)}>
                        <Coins className="w-4 h-4 mr-2" />
                        Show in {showLocalCurrency ? "USD" : selectedCountry.currency}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Engagement Rating</p>
                  <p className="text-lg font-bold text-primary">{earnings.engagementRating}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your CPM Range</p>
                  <p className="text-lg font-bold">${earnings.cpm.min.toFixed(2)} - ${earnings.cpm.max.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Per Sponsored Post</p>
                  <p className="text-lg font-bold text-purple-500">
                    {displayCurrency(earnings.sponsorships.perPost.min)} - {displayCurrency(earnings.sponsorships.perPost.max)}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Growth Potential</p>
                  <div className="flex items-center justify-center gap-2">
                    <Progress value={earnings.potentialGrowth} className="h-2 w-16" />
                    <span className="font-bold">{earnings.potentialGrowth}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Creator Program */}
              <Card className={cn("border-0 shadow-lg", earnings.creatorFund.eligible ? "bg-gradient-to-br from-blue-500/10 to-blue-500/5" : "bg-muted/50 opacity-75")}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("p-2 rounded-lg", earnings.creatorFund.eligible ? "bg-blue-500/20" : "bg-gray-500/20")}>
                      <Play className={cn("w-5 h-5", earnings.creatorFund.eligible ? "text-blue-500" : "text-gray-500")} />
                    </div>
                    <span className="font-medium text-sm">Creativity Program</span>
                  </div>
                  <p className="text-xl font-bold">
                    {displayCurrency(earnings.creatorFund.min)} - {displayCurrency(earnings.creatorFund.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{earnings.creatorFund.eligible ? "For 1min+ videos only" : "⚠️ Need 10K+ followers"}</p>
                </CardContent>
              </Card>

              {/* Sponsorships */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Briefcase className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="font-medium text-sm">Brand Deals</span>
                    <Badge className="bg-purple-500 text-white text-xs">Top Earner</Badge>
                  </div>
                  <p className="text-xl font-bold">
                    {displayCurrency(earnings.sponsorships.min)} - {displayCurrency(earnings.sponsorships.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedNiche?.demandLevel} demand in {selectedNiche?.label}</p>
                </CardContent>
              </Card>

              {/* Live Gifts */}
              <Card className={cn("border-0 shadow-lg", earnings.gifts.eligible ? "bg-gradient-to-br from-pink-500/10 to-pink-500/5" : "bg-muted/50 opacity-75")}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("p-2 rounded-lg", earnings.gifts.eligible ? "bg-pink-500/20" : "bg-gray-500/20")}>
                      <Gift className={cn("w-5 h-5", earnings.gifts.eligible ? "text-pink-500" : "text-gray-500")} />
                    </div>
                    <span className="font-medium text-sm">Live Gifts</span>
                  </div>
                  <p className="text-xl font-bold">
                    {displayCurrency(earnings.gifts.min)} - {displayCurrency(earnings.gifts.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{earnings.gifts.eligible ? "Based on 4 lives/month" : "⚠️ Need 1K+ followers"}</p>
                </CardContent>
              </Card>

              {/* Affiliate */}
              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="font-medium text-sm">TikTok Shop</span>
                  </div>
                  <p className="text-xl font-bold">
                    {displayCurrency(earnings.affiliate.min)} - {displayCurrency(earnings.affiliate.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">10-20% commission rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Yearly Projection */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Yearly Potential</h4>
                      <p className="text-sm text-muted-foreground">If you maintain current performance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      {displayCurrency(earnings.total.min * 12)} - {displayCurrency(earnings.total.max * 12)}
                    </p>
                    <p className="text-sm text-muted-foreground">per year</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Methodology */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-2">How We Calculate (2024 Data)</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>
                        <strong>Creativity Program:</strong> $0.50-$1.00 per 1,000 qualified views (US rates). Requires 10K+ followers, 100K views/30 days, and videos 1min+
                      </li>
                      <li>
                        <strong>Brand Deals:</strong> Based on 2024 influencer marketing benchmarks. Rates vary by niche ({selectedNiche?.sponsorMultiplier}x multiplier for {selectedNiche?.label})
                      </li>
                      <li>
                        <strong>Live Gifts:</strong> TikTok takes 50%, you keep 50%. Based on average gift values and live frequency
                      </li>
                      <li>
                        <strong>TikTok Shop:</strong> 10-20% commission with ~0.2% conversion rate industry average
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Button */}
            <div className="flex justify-center gap-4">
              <Button onClick={handleShare} size="lg" className="bg-gradient-to-r from-primary to-accent">
                <Share2 className="mr-2 h-5 w-5" />
                Share My Results
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
