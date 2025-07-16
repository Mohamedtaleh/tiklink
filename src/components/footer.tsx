
"use client";

import { useI18n } from "@/hooks/use-i18n";
import Link from "next/link";
import { Icons } from "./icons";

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
            <Link href="/">
                <Icons.logo className="h-12 w-auto" />
            </Link>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
                <Link href="/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</Link>
                <Link href="/contact" className="hover:text-primary transition-colors">{t('footer.contact')}</Link>
            </div>
            <p className="text-sm text-muted-foreground text-center">
                © {currentYear} {t('appName')}. {t('footer.rights')}
            </p>
        </div>
      </div>
    </footer>
  );
}
