"use client";

import Link from "next/link";
import { DollarSign, Clock, Hash, Flame, BarChart3, User, AtSign, Award, Sparkles, ArrowRight, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    id: "money-calculator",
    href: "/tools/money-calculator",
    icon: DollarSign,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/5",
    popular: true,
    new: false,
  },
  {
    id: "viral-predictor",
    href: "/tools/viral-predictor",
    icon: Flame,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/10 to-red-500/5",
    popular: true,
    new: true,
  },
  {
    id: "hashtag-generator",
    href: "/tools/hashtag-generator",
    icon: Hash,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/5",
    popular: true,
    new: false,
  },
  {
    id: "best-time-to-post",
    href: "/tools/best-time-to-post",
    icon: Clock,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/5",
    popular: false,
    new: false,
  },
  {
    id: "profile-analyzer",
    href: "/tools/profile-analyzer",
    icon: BarChart3,
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-500/10 to-purple-500/5",
    popular: true,
    new: false,
  },
  {
    id: "bio-generator",
    href: "/tools/bio-generator",
    icon: User,
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-500/10 to-rose-500/5",
    popular: false,
    new: true,
  },
  {
    id: "username-checker",
    href: "/tools/username-checker",
    icon: AtSign,
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-500/10 to-blue-500/5",
    popular: false,
    new: false,
  },
  {
    id: "stats-card",
    href: "/tools/stats-card",
    icon: Award,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/5",
    popular: false,
    new: true,
  },
];

export default function ToolsPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-gradient-to-br from-primary to-accent shadow-2xl shadow-primary/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4 tracking-tight">
            {t("tools.page.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("tools.page.description")}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{t("tools.page.freeToUse")}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>{t("tools.page.aiPowered")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} href={tool.href}>
                  <Card className={cn(
                    "h-full border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer group overflow-hidden",
                    `bg-gradient-to-br ${tool.bgGradient}`
                  )}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn(
                          "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                          tool.gradient
                        )}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex gap-2">
                          {tool.popular && (
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              {t("tools.page.popular")}
                            </Badge>
                          )}
                          {tool.new && (
                            <Badge className="bg-green-500 text-white">
                              {t("tools.page.new")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors">
                        {t(`tools.${tool.id}.title`)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2 mb-4">
                        {t(`tools.${tool.id}.shortDesc`)}
                      </CardDescription>
                      <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        <span>{t("tools.page.tryNow")}</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            {t("tools.page.ctaTitle")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("tools.page.ctaDescription")}
          </p>
          <Link href="/">
            <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              {t("tools.page.downloadVideos")}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
