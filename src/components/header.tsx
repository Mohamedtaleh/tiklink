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
  Crown
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

const TOOLS = [
  { href: "/tools/money-calculator", icon: DollarSign, labelKey: "tools.money-calculator.title", color: "text-green-500", gradient: "from-green-500 to-emerald-500", popular: true },
  { href: "/tools/viral-predictor", icon: Flame, labelKey: "tools.viral-predictor.title", color: "text-orange-500", gradient: "from-orange-500 to-red-500", popular: true },
  { href: "/tools/hashtag-generator", icon: Hash, labelKey: "tools.hashtag-generator.title", color: "text-blue-500", gradient: "from-blue-500 to-cyan-500", popular: true },
  { href: "/tools/best-time-to-post", icon: Clock, labelKey: "tools.best-time-to-post.title", color: "text-purple-500", gradient: "from-purple-500 to-pink-500" },
  { href: "/tools/bio-generator", icon: User, labelKey: "tools.bio-generator.title", color: "text-pink-500", gradient: "from-pink-500 to-rose-500", popular: true },
  { href: "/tools/stats-card", icon: Award, labelKey: "tools.stats-card.title", color: "text-amber-500", gradient: "from-amber-500 to-orange-500" },
];

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
            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-10 px-4 rounded-xl hover:bg-primary/5">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium">{t('header.nav.tools')}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2 glass border-border/50">
                <DropdownMenuLabel className="flex items-center gap-2 text-base px-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t('header.nav.freeTools')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <div className="grid grid-cols-1 gap-1 py-1">
                  {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <DropdownMenuItem key={tool.href} asChild className="p-0">
                        <Link 
                          href={tool.href} 
                          className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow",
                            tool.gradient
                          )}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{t(tool.labelKey)}</span>
                          {tool.popular && (
                            <Badge className="ml-auto bg-gradient-to-r from-accent to-orange-400 text-white text-[10px] px-2 py-0 border-0">
                              Popular
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild className="p-0">
                  <Link 
                    href="/tools" 
                    className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Wrench className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold">{t('header.nav.allTools')}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </Link>
                </DropdownMenuItem>
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
                    <Link href="/" className="flex items-center gap-2 mb-8" onClick={handleLinkClick}>
                        <Icons.logo className="h-10 w-auto" />
                    </Link>
                    
                    {/* Tools Section */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-primary" />
                        {t('header.nav.freeTools')}
                      </h3>
                      <nav className="flex flex-col gap-1">
                        {TOOLS.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <Button 
                              key={tool.href} 
                              variant="ghost" 
                              asChild 
                              className="justify-start h-12 px-3 rounded-xl hover:bg-primary/5"
                            >
                              <Link href={tool.href} onClick={handleLinkClick} className="flex items-center w-full">
                                <div className={cn(
                                  "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mr-3",
                                  tool.gradient
                                )}>
                                  <Icon className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-medium">{t(tool.labelKey)}</span>
                                {tool.popular && (
                                  <Crown className="ml-auto w-4 h-4 text-amber-500" />
                                )}
                              </Link>
                            </Button>
                          );
                        })}
                        <Link 
                          href="/tools" 
                          onClick={handleLinkClick}
                          className="flex items-center justify-between mt-2 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
                        >
                          <span className="font-semibold text-sm">{t('header.nav.allTools')}</span>
                          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </nav>
                    </div>

                    <div className="border-t border-border/50 pt-6">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
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
