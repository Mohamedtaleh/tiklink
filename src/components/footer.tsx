
"use client";

import { useI18n } from "@/hooks/use-i18n";
import Link from "next/link";
import { Icons } from "./icons";
import { Heart, Sparkles, ArrowUp, Globe, Mail, Shield, FileText, Newspaper, Wrench } from "lucide-react";
import { Button } from "./ui/button";

const TOOLS_LINKS = [
  { href: "/tools/money-calculator", labelKey: "Money Calculator" },
  { href: "/tools/viral-predictor", labelKey: "Viral Predictor" },
  { href: "/tools/hashtag-generator", labelKey: "Hashtag Generator" },
  { href: "/tools/bio-generator", labelKey: "Bio Generator" },
];

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-background" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      
      <div className="container relative mx-auto px-4 pt-16 pb-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4 group">
              <Icons.logo className="h-12 w-auto transition-transform group-hover:scale-105" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The #1 TikTok video downloader & creator toolkit. Download videos without watermark and access powerful AI tools.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4 text-primary" />
              <span>Available in 6+ languages</span>
            </div>
          </div>

          {/* Tools section */}
          <div>
            <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Free Tools
            </h3>
            <ul className="space-y-3">
              {TOOLS_LINKS.map((tool) => (
                <li key={tool.href}>
                  <Link 
                    href={tool.href} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {tool.labelKey}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/tools" 
                  className="text-primary font-medium text-sm hover:underline flex items-center gap-1"
                >
                  View all tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company section */}
          <div>
            <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-primary" />
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal section */}
          <div>
            <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left flex items-center gap-1">
              © {currentYear} {t('appName')}. {t('footer.rights')}
              <span className="inline-flex items-center ml-2 text-foreground">
                Made with <Heart className="w-4 h-4 mx-1 text-red-500 fill-red-500" /> for creators
              </span>
            </p>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={scrollToTop}
              className="rounded-full h-10 w-10 p-0 shadow-premium hover:shadow-premium-lg transition-all hover:-translate-y-1"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="sr-only">Back to top</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
