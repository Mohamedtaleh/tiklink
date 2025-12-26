// src/components/header.tsx
"use client";

import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { Icons } from "./icons";
import { useI18n } from "@/hooks/use-i18n";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { 
  Menu, 
  Newspaper, 
  Info, 
  Mail, 
  ShieldCheck, 
  FileText, 
  Wrench,
  DollarSign,
  Flame,
  Hash,
  Clock,
  User,
  Award,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Crown,
  MessageSquare,
  FileVideo,
  Zap,
  TrendingUp,
  Star,
  Rocket,
  Target
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Categorized tools for better organization
const TOOL_CATEGORIES = [
  {
    id: "ai-content",
    label: "AI Content Creation",
    icon: Sparkles,
    color: "text-purple-500",
    tools: [
      { 
        href: "/tools/caption-generator", 
        icon: MessageSquare, 
        labelKey: "tools.caption-generator.title", 
        descKey: "tools.caption-generator.shortDesc",
        gradient: "from-violet-500 to-purple-500", 
        badge: "New",
        badgeColor: "bg-green-500"
      },
      { 
        href: "/tools/script-generator", 
        icon: FileVideo, 
        labelKey: "tools.script-generator.title", 
        descKey: "tools.script-generator.shortDesc",
        gradient: "from-cyan-500 to-blue-500",
        badge: "New",
        badgeColor: "bg-green-500"
      },
      { 
        href: "/tools/bio-generator", 
        icon: User, 
        labelKey: "tools.bio-generator.title", 
        descKey: "tools.bio-generator.shortDesc",
        gradient: "from-pink-500 to-rose-500",
        badge: "AI",
        badgeColor: "bg-purple-500"
      },
      { 
        href: "/tools/hashtag-generator", 
        icon: Hash, 
        labelKey: "tools.hashtag-generator.title", 
        descKey: "tools.hashtag-generator.shortDesc",
        gradient: "from-blue-500 to-cyan-500",
        badge: "AI",
        badgeColor: "bg-purple-500"
      },
    ]
  },
  {
    id: "analytics",
    label: "Analytics & Insights",
    icon: TrendingUp,
    color: "text-green-500",
    tools: [
      { 
        href: "/tools/viral-predictor", 
        icon: Flame, 
        labelKey: "tools.viral-predictor.title", 
        descKey: "tools.viral-predictor.shortDesc",
        gradient: "from-orange-500 to-red-500",
        badge: "Hot",
        badgeColor: "bg-orange-500"
      },
      { 
        href: "/tools/money-calculator", 
        icon: DollarSign, 
        labelKey: "tools.money-calculator.title", 
        descKey: "tools.money-calculator.shortDesc",
        gradient: "from-green-500 to-emerald-500",
        badge: "Popular",
        badgeColor: "bg-amber-500"
      },
      { 
        href: "/tools/best-time-to-post", 
        icon: Clock, 
        labelKey: "tools.best-time-to-post.title", 
        descKey: "tools.best-time-to-post.shortDesc",
        gradient: "from-purple-500 to-pink-500",
      },
    ]
  },
  {
    id: "creator-tools",
    label: "Creator Tools",
    icon: Award,
    color: "text-amber-500",
    tools: [
      { 
        href: "/tools/stats-card", 
        icon: Award, 
        labelKey: "tools.stats-card.title", 
        descKey: "tools.stats-card.shortDesc",
        gradient: "from-amber-500 to-orange-500",
      },
    ]
  }
];

// Flat list for mobile
const ALL_TOOLS = TOOL_CATEGORIES.flatMap(cat => cat.tools);

const NavLink = ({ href, children, onNavigate }: { href: string; children: React.ReactNode; onNavigate: () => void; }) => (
    <Button variant="ghost" asChild className="justify-start h-12 px-4 rounded-xl hover:bg-primary/5">
        <Link href={href} onClick={onNavigate}>{children}</Link>
    </Button>
);

export function Header() {
  const { t } = useI18n();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300",
      isScrolled 
        ? "glass shadow-premium border-b border-border/50" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:order-1 rtl:md:order-3 rtl:md:-mr-2 rtl:md:ml-0 rtl:mr-[-10px] rtl:md:mr-0 rtl:md:ml-[-10px] group">
          <Icons.logo className="h-12 w-auto transition-transform group-hover:scale-105" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-1 md:order-2">
            {/* Tools Mega Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-10 px-4 rounded-xl hover:bg-primary/5 group">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">{t('header.nav.tools')}</span>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] px-1.5 py-0 border-0">
                    8
                  </Badge>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:rotate-180 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="w-[580px] p-0 glass border-border/50 shadow-2xl overflow-hidden"
                sideOffset={12}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{t('header.nav.freeTools')}</h3>
                        <p className="text-xs text-muted-foreground">AI-powered tools to grow your TikTok</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      <Star className="w-3 h-3 mr-1 fill-primary" />
                      100% Free
                    </Badge>
                  </div>
                </div>

                {/* Categories */}
                <div className="p-3 max-h-[60vh] overflow-y-auto">
                  {TOOL_CATEGORIES.map((category, catIdx) => {
                    const CategoryIcon = category.icon;
                    return (
                      <div key={category.id} className={cn(catIdx > 0 && "mt-4")}>
                        {/* Category Header */}
                        <div className="flex items-center gap-2 px-2 mb-2">
                          <CategoryIcon className={cn("w-4 h-4", category.color)} />
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {category.label}
                          </span>
                          <div className="flex-1 h-px bg-border/50 ml-2" />
                        </div>

                        {/* Tools Grid */}
                        <div className="grid grid-cols-2 gap-1">
                          {category.tools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                              <DropdownMenuItem key={tool.href} asChild className="p-0 focus:bg-transparent">
                                <Link 
                                  href={tool.href} 
                                  className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-primary/5 transition-all group/item"
                                >
                                  <div className={cn(
                                    "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm group-hover/item:shadow-lg group-hover/item:scale-105 transition-all flex-shrink-0",
                                    tool.gradient
                                  )}>
                                    <Icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm truncate">{t(tool.labelKey)}</span>
                                      {tool.badge && (
                                        <Badge className={cn("text-[9px] px-1.5 py-0 border-0 text-white", tool.badgeColor)}>
                                          {tool.badge}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                      {t(tool.descKey)}
                                    </p>
                                  </div>
                                </Link>
                              </DropdownMenuItem>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer CTA */}
                <div className="p-3 border-t border-border/50 bg-muted/30">
                  <Link 
                    href="/tools" 
                    className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all group/cta border border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-sm">{t('header.nav.allTools')}</span>
                        <p className="text-[11px] text-muted-foreground">Explore all creator tools</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <span className="text-xs font-medium">View All</span>
                      <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild className="h-10 px-4 rounded-xl hover:bg-primary/5">
                <Link href="/blog" className="font-medium">{t('header.nav.blog')}</Link>
            </Button>
            <Button variant="ghost" asChild className="h-10 px-4 rounded-xl hover:bg-primary/5">
                <Link href="/about" className="font-medium">{t('header.nav.about')}</Link>
            </Button>
            <Button variant="ghost" asChild className="h-10 px-4 rounded-xl hover:bg-primary/5">
                <Link href="/contact" className="font-medium">{t('header.nav.contact')}</Link>
            </Button>
        </nav>

        <div className="flex items-center gap-2 md:gap-3 md:order-3 rtl:md:order-1">
          <LanguageSwitcher />
          <ThemeToggle />
          
          {/* Mobile Navigation Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden rounded-xl h-10 w-10 border-border/50">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] overflow-y-auto glass p-0 border-r-border/50">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 mb-6" onClick={handleLinkClick}>
                        <Icons.logo className="h-10 w-auto" />
                    </Link>
                    
                    {/* Featured Tools Banner */}
                    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold">New AI Tools</span>
                        <Badge className="bg-green-500 text-white text-[9px] px-1.5 py-0 border-0">2 New</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Caption & Script generators now available!</p>
                    </div>

                    {/* Tools by Category */}
                    {TOOL_CATEGORIES.map((category, catIdx) => {
                      const CategoryIcon = category.icon;
                      return (
                        <div key={category.id} className={cn("mb-6", catIdx > 0 && "pt-4 border-t border-border/50")}>
                          <h3 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wider">
                            <CategoryIcon className={cn("w-4 h-4", category.color)} />
                            {category.label}
                          </h3>
                          <nav className="flex flex-col gap-1">
                            {category.tools.map((tool) => {
                              const Icon = tool.icon;
                              return (
                                <Button 
                                  key={tool.href} 
                                  variant="ghost" 
                                  asChild 
                                  className="justify-start h-auto py-3 px-3 rounded-xl hover:bg-primary/5"
                                >
                                  <Link href={tool.href} onClick={handleLinkClick} className="flex items-center w-full">
                                    <div className={cn(
                                      "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mr-3 shadow-sm",
                                      tool.gradient
                                    )}>
                                      <Icon className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{t(tool.labelKey)}</span>
                                        {tool.badge && (
                                          <Badge className={cn("text-[9px] px-1.5 py-0 border-0 text-white", tool.badgeColor)}>
                                            {tool.badge}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                </Button>
                              );
                            })}
                          </nav>
                        </div>
                      );
                    })}

                    {/* All Tools Link */}
                    <Link 
                      href="/tools" 
                      onClick={handleLinkClick}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all group border border-primary/20 mb-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Wrench className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-sm">{t('header.nav.allTools')}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <div className="border-t border-border/50 pt-6">
                      <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                        Navigation
                      </h3>
                      <nav className="flex flex-col gap-1">
                          <NavLink href="/blog" onNavigate={handleLinkClick}>
                              <Newspaper className="mr-3 h-5 w-5 text-primary" />
                              {t('header.nav.blog')}
                          </NavLink>
                          <NavLink href="/about" onNavigate={handleLinkClick}>
                              <Info className="mr-3 h-5 w-5 text-primary" />
                              {t('header.nav.about')}
                          </NavLink>
                          <NavLink href="/privacy" onNavigate={handleLinkClick}>
                              <ShieldCheck className="mr-3 h-5 w-5 text-primary" />
                              {t('header.nav.privacy')}
                          </NavLink>
                          <NavLink href="/terms" onNavigate={handleLinkClick}>
                              <FileText className="mr-3 h-5 w-5 text-primary" />
                              {t('header.nav.terms')}
                          </NavLink>
                          <NavLink href="/contact" onNavigate={handleLinkClick}>
                              <Mail className="mr-3 h-5 w-5 text-primary" />
                              {t('header.nav.contact')}
                          </NavLink>
                      </nav>
                    </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
