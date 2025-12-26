"use client";

import Link from "next/link";
import { ArrowRight, Flame, TrendingUp, Zap, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

const POPULAR_TOOLS = [
  {
    id: "caption-generator",
    href: "/tools/caption-generator",
    icon: "💬",
    gradient: "from-violet-500 to-purple-500",
    badge: "NEW",
    badgeColor: "bg-green-500",
  },
  {
    id: "viral-predictor",
    href: "/tools/viral-predictor",
    icon: "🔥",
    gradient: "from-orange-500 to-red-500",
    badge: "HOT",
    badgeColor: "bg-orange-500",
  },
  {
    id: "money-calculator",
    href: "/tools/money-calculator",
    icon: "💰",
    gradient: "from-green-500 to-emerald-500",
    badge: "#1",
    badgeColor: "bg-yellow-500",
  },
  {
    id: "hashtag-generator",
    href: "/tools/hashtag-generator",
    icon: "#️⃣",
    gradient: "from-blue-500 to-cyan-500",
  },
];

interface PopularToolsSidebarProps {
  currentToolId?: string;
  className?: string;
}

export function PopularToolsSidebar({ currentToolId, className }: PopularToolsSidebarProps) {
  const { t } = useI18n();

  const tools = POPULAR_TOOLS.filter((tool) => tool.id !== currentToolId).slice(0, 4);

  return (
    <Card className={cn("border-0 shadow-xl sticky top-24", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Popular Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tools.map((tool) => (
          <Link key={tool.id} href={tool.href}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group cursor-pointer">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg shadow group-hover:scale-110 transition-transform",
                  tool.gradient
                )}
              >
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {t(`tools.${tool.id}.title`)}
                  </p>
                  {tool.badge && (
                    <Badge className={cn("text-white text-[10px] px-1.5 py-0", tool.badgeColor)}>
                      {tool.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {t(`tools.${tool.id}.shortDesc`).slice(0, 40)}...
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}

        <Link href="/tools">
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all text-center">
            <p className="text-sm font-medium text-primary">
              View All 8 Tools →
            </p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

// Compact version for embedding in content
export function PopularToolsInline({ currentToolId }: { currentToolId?: string }) {
  const { t } = useI18n();
  const tools = POPULAR_TOOLS.filter((tool) => tool.id !== currentToolId).slice(0, 3);

  return (
    <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h4 className="font-bold">Trending Tools</h4>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {tools.map((tool) => (
          <Link key={tool.id} href={tool.href}>
            <div className="text-center p-3 rounded-xl hover:bg-background/50 transition-all group">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mx-auto text-xl shadow group-hover:scale-110 transition-transform",
                  tool.gradient
                )}
              >
                {tool.icon}
              </div>
              <p className="text-xs font-medium mt-2 group-hover:text-primary transition-colors">
                {t(`tools.${tool.id}.title`)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
