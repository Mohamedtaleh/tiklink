"use client";

import Link from "next/link";
import { Icons } from "./icons";
import { useI18n } from "@/hooks/use-i18n";

export function Footer() {
  const { t } = useI18n();

  const sections = [
    {
      title: t("footer.sections.download"),
      links: [
        { href: "/", label: t("footer.links.home") },
        { href: "/instagram", label: t("footer.links.instagram") },
        { href: "/youtube", label: t("footer.links.youtube") },
        { href: "/mp3", label: t("footer.links.mp3") },
      ],
    },
    {
      title: t("footer.sections.tools"),
      links: [
        { href: "/captions", label: t("footer.links.captions") },
        { href: "/hashtags", label: t("footer.links.hashtags") },
        { href: "/pro", label: t("footer.links.pro") },
      ],
    },
    {
      title: t("footer.sections.company"),
      links: [
        { href: "/about", label: t("header.nav.about") },
        { href: "/blog", label: t("header.nav.blog") },
        { href: "/contact", label: t("header.nav.contact") },
        { href: "/privacy", label: t("header.nav.privacy") },
        { href: "/terms", label: t("header.nav.terms") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-content px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Icons.logo className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              {t("footer.tagline")}
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Tiklink. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
