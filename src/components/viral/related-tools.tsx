"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

const ALL_TOOLS = [
  {
    id: "caption-generator",
    href: "/tools/caption-generator",
    icon: "💬",
    gradient: "from-violet-500 to-purple-500",
    category: "ai",
    isNew: true,
  },
  {
    id: "script-generator",
    href: "/tools/script-generator",
    icon: "📝",
    gradient: "from-cyan-500 to-blue-500",
    category: "ai",
    isNew: true,
  },
  {
    id: "viral-predictor",
    href: "/tools/viral-predictor",
    icon: "🔥",
    gradient: "from-orange-500 to-red-500",
    category: "analytics",
    popular: true,
  },
  {
    id: "money-calculator",
    href: "/tools/money-calculator",
    icon: "💰",
    gradient: "from-green-500 to-emerald-500",
    category: "analytics",
    popular: true,
  },
  {
    id: "hashtag-generator",
    href: "/tools/hashtag-generator",
    icon: "#️⃣",
    gradient: "from-blue-500 to-cyan-500",
    category: "content",
    popular: true,
  },
  {
    id: "best-time-to-post",
    href: "/tools/best-time-to-post",
    icon: "⏰",
    gradient: "from-purple-500 to-pink-500",
    category: "analytics",
  },
  {
    id: "bio-generator",
    href: "/tools/bio-generator",
    icon: "✍️",
    gradient: "from-pink-500 to-rose-500",
    category: "content",
    popular: true,
  },
  {
    id: "stats-card",
    href: "/tools/stats-card",
    icon: "🏆",
    gradient: "from-amber-500 to-orange-500",
    category: "content",
    popular: true,
  },
];

interface RelatedToolsProps {
  currentToolId: string;
  title?: string;
  maxItems?: number;
}

export function RelatedTools({ currentToolId, title, maxItems = 4 }: RelatedToolsProps) {
  const { t } = useI18n();

  // Filter out current tool and get related ones
  const currentTool = ALL_TOOLS.find((tool) => tool.id === currentToolId);
  const relatedTools = ALL_TOOLS.filter((tool) => tool.id !== currentToolId)
    .sort((a, b) => {
      // Prioritize: same category > new > popular
      const aScore =
        (a.category === currentTool?.category ? 3 : 0) +
        (a.isNew ? 2 : 0) +
        (a.popular ? 1 : 0);
      const bScore =
        (b.category === currentTool?.category ? 3 : 0) +
        (b.isNew ? 2 : 0) +
        (b.popular ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, maxItems);

  return (
    <div className="w-full py-12 mt-8 border-t">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          Keep Growing
        </Badge>
        <h3 className="text-2xl md:text-3xl font-bold font-headline">
          {title || "Try These Tools Next"}
        </h3>
        <p className="text-muted-foreground mt-2">
          Creators who used this tool also loved these
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedTools.map((tool) => (
          <Link key={tool.id} href={tool.href}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group overflow-hidden relative">
              {(tool.isNew || tool.popular) && (
                <div className="absolute top-2 right-2 z-10">
                  {tool.isNew ? (
                    <Badge className="bg-green-500 text-white text-xs animate-pulse">
                      NEW
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500 text-white text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              )}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br",
                  tool.gradient.replace("from-", "from-").replace("to-", "to-") + "/10"
                )}
              />
              <CardContent className="pt-6 text-center relative">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform text-2xl",
                    tool.gradient
                  )}
                >
                  {tool.icon}
                </div>
                <h4 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">
                  {t(`tools.${tool.id}.title`)}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {t(`tools.${tool.id}.shortDesc`)}
                </p>
                <div className="flex items-center justify-center text-primary text-xs font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Try Now</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link href="/tools">
          <Button variant="outline" size="lg" className="gap-2">
            View All 8 Free Tools
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
