// src/components/header.tsx
"use client";

import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { Icons } from "./icons";
import { useI18n } from "@/hooks/use-i18n";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Newspaper, Info, Mail, ShieldCheck, FileText } from "lucide-react";
import { useState } from "react";

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
        <nav className="hidden md:flex gap-2 md:order-2">
            <Button variant="ghost" asChild>
                <Link href="/blog">{t('header.nav.blog')}</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/about">{t('header.nav.about')}</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/privacy">{t('header.nav.privacy')}</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/terms">{t('header.nav.terms')}</Link>
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
            <SheetContent side="left" className="w-[280px]">
                <div className="p-4">
                    <Link href="/" className="flex items-center gap-2 mb-8" onClick={handleLinkClick}>
                        <Icons.logo className="h-10 w-auto" />
                    </Link>
                    <nav className="flex flex-col gap-4">
                        <NavLink href="/blog" onNavigate={handleLinkClick}>
                            <Newspaper className="mr-2 h-5 w-5" />
                            {t('header.nav.blog')}
                        </NavLink>
                        <NavLink href="/about" onNavigate={handleLinkClick}>
                            <Info className="mr-2 h-5 w-5" />
                            {t('header.nav.about')}
                        </NavLink>
                        <NavLink href="/privacy" onNavigate={handleLinkClick}>
                            <ShieldCheck className="mr-2 h-5 w-5" />
                            {t('header.nav.privacy')}
                        </NavLink>
                        <NavLink href="/terms" onNavigate={handleLinkClick}>
                            <FileText className="mr-2 h-5 w-5" />
                            {t('header.nav.terms')}
                        </NavLink>
                        <NavLink href="/contact" onNavigate={handleLinkClick}>
                            <Mail className="mr-2 h-5 w-5" />
                            {t('header.nav.contact')}
                        </NavLink>
                    </nav>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
