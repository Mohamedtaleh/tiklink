// src/components/header.tsx
"use client";

import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { Icons } from "./icons";
import { useI18n } from "@/hooks/use-i18n";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
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
  BarChart3,
  User,
  AtSign,
  Award,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { useState } from "react";
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
  { href: "/tools/money-calculator", icon: DollarSign, labelKey: "tools.money-calculator.title", color: "text-green-500" },
  { href: "/tools/viral-predictor", icon: Flame, labelKey: "tools.viral-predictor.title", color: "text-orange-500" },
  { href: "/tools/hashtag-generator", icon: Hash, labelKey: "tools.hashtag-generator.title", color: "text-blue-500" },
  { href: "/tools/best-time-to-post", icon: Clock, labelKey: "tools.best-time-to-post.title", color: "text-purple-500" },
  { href: "/tools/profile-analyzer", icon: BarChart3, labelKey: "tools.profile-analyzer.title", color: "text-violet-500" },
  { href: "/tools/bio-generator", icon: User, labelKey: "tools.bio-generator.title", color: "text-pink-500" },
  { href: "/tools/username-checker", icon: AtSign, labelKey: "tools.username-checker.title", color: "text-cyan-500" },
  { href: "/tools/stats-card", icon: Award, labelKey: "tools.stats-card.title", color: "text-amber-500" },
];

const NavLink = ({ href, children, onNavigate }: { href: string; children: React.ReactNode; onNavigate: () => void; }) => (
    <Button variant="ghost" asChild>
        <Link href={href} onClick={onNavigate}>{children}</Link>
    </Button>
);

export function Header() {
  const { t } = useI18n();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/50 border-b">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:order-1 rtl:md:order-3 rtl:md:-mr-2 rtl:md:ml-0 rtl:mr-[-10px] rtl:md:mr-0 rtl:md:ml-[-10px]">
          <Icons.logo className="h-12 w-auto" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-1 md:order-2">
            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  <Sparkles className="w-4 h-4 text-accent" />
                  {t('header.nav.tools')}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {t('header.nav.freeTools')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <DropdownMenuItem key={tool.href} asChild>
                      <Link href={tool.href} className="flex items-center gap-3 cursor-pointer">
                        <Icon className={cn("w-4 h-4", tool.color)} />
                        <span>{t(tool.labelKey)}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/tools" className="flex items-center gap-3 cursor-pointer font-medium">
                    <Wrench className="w-4 h-4 text-primary" />
                    <span>{t('header.nav.allTools')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" asChild>
                <Link href="/blog">{t('header.nav.blog')}</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/about">{t('header.nav.about')}</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/contact">{t('header.nav.contact')}</Link>
            </Button>
        </nav>

        <div className="flex items-center gap-2 md:gap-4 md:order-3 rtl:md:order-1">
          <LanguageSwitcher />
          <ThemeToggle />
          
          {/* Mobile Navigation Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <div className="p-4">
                    <Link href="/" className="flex items-center gap-2 mb-8" onClick={handleLinkClick}>
                        <Icons.logo className="h-10 w-auto" />
                    </Link>
                    
                    {/* Tools Section */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {t('header.nav.freeTools')}
                      </h3>
                      <nav className="flex flex-col gap-1">
                        {TOOLS.map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <Button key={tool.href} variant="ghost" asChild className="justify-start">
                              <Link href={tool.href} onClick={handleLinkClick}>
                                <Icon className={cn("mr-3 h-4 w-4", tool.color)} />
                                {t(tool.labelKey)}
                              </Link>
                            </Button>
                          );
                        })}
                      </nav>
                    </div>

                    <div className="border-t pt-4">
                      <nav className="flex flex-col gap-1">
                          <NavLink href="/blog" onNavigate={handleLinkClick}>
                              <Newspaper className="mr-3 h-4 w-4" />
                              {t('header.nav.blog')}
                          </NavLink>
                          <NavLink href="/about" onNavigate={handleLinkClick}>
                              <Info className="mr-3 h-4 w-4" />
                              {t('header.nav.about')}
                          </NavLink>
                          <NavLink href="/privacy" onNavigate={handleLinkClick}>
                              <ShieldCheck className="mr-3 h-4 w-4" />
                              {t('header.nav.privacy')}
                          </NavLink>
                          <NavLink href="/terms" onNavigate={handleLinkClick}>
                              <FileText className="mr-3 h-4 w-4" />
                              {t('header.nav.terms')}
                          </NavLink>
                          <NavLink href="/contact" onNavigate={handleLinkClick}>
                              <Mail className="mr-3 h-4 w-4" />
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
