"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { Icons } from "./icons";
import { useI18n } from "@/hooks/use-i18n";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const TOOLS = [
    { href: "/captions", label: t("nav.toolItems.captions.title"), description: t("nav.toolItems.captions.desc") },
    { href: "/hashtags", label: t("nav.toolItems.hashtags.title"), description: t("nav.toolItems.hashtags.desc") },
    { href: "/mp3", label: t("nav.toolItems.mp3.title"), description: t("nav.toolItems.mp3.desc") },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-content px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Icons.logo className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t("nav.download")}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  ["/captions", "/hashtags", "/mp3"].includes(pathname)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t("nav.tools")}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[240px] p-2" sideOffset={8}>
              {TOOLS.map((tool) => (
                <DropdownMenuItem key={tool.href} asChild className="p-0">
                  <Link
                    href={tool.href}
                    className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg cursor-pointer"
                  >
                    <span className="text-sm font-medium">{tool.label}</span>
                    <span className="text-xs text-muted-foreground">{tool.description}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/bulk"
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              pathname === "/bulk" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Bulk Download
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">New</span>
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 px-0 text-muted-foreground">
                <Menu className="h-4 w-4" />
                <span className="sr-only">{t("nav.openMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="p-6">
                <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setIsSheetOpen(false)}>
                  <Icons.logo className="h-9 w-auto" />
                </Link>

                <nav className="flex flex-col gap-1">
                  <Link
                    href="/"
                    onClick={() => setIsSheetOpen(false)}
                    className={cn(
                      "px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      pathname === "/" ? "text-foreground bg-surface-2" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t("nav.download")}
                  </Link>

                  <div className="mt-4 mb-2 px-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                      {t("nav.tools")}
                    </span>
                  </div>

                  {TOOLS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setIsSheetOpen(false)}
                      className={cn(
                        "px-3 py-2.5 rounded-lg transition-colors",
                        pathname === tool.href ? "text-foreground bg-surface-2" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="text-sm font-medium">{tool.label}</span>
                    </Link>
                  ))}

                  <div className="mt-4 pt-4 border-t border-border">
                    <Link
                      href="/bulk"
                      onClick={() => setIsSheetOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                        pathname === "/bulk" ? "text-foreground bg-surface-2" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Bulk Download
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">New</span>
                    </Link>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-1">
                    {[
                      { href: "/blog", label: t("header.nav.blog") },
                      { href: "/about", label: t("header.nav.about") },
                      { href: "/contact", label: t("header.nav.contact") },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsSheetOpen(false)}
                        className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
