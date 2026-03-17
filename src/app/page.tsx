"use client";

import { VideoDownloaderForm } from "@/components/video-downloader-form";
import {
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
  XIcon,
  FacebookIcon,
} from "@/components/platform-icons";
import Link from "next/link";
import { useI18n } from "@/hooks/use-i18n";

const PLATFORMS = [
  { name: "TikTok", href: "/", icon: TikTokIcon },
  { name: "Instagram", href: "/instagram", icon: InstagramIcon },
  { name: "YouTube", href: "/youtube", icon: YouTubeIcon },
  { name: "X", href: "/", icon: XIcon },
  { name: "Facebook", href: "/", icon: FacebookIcon },
];

export default function Home() {
  const { t } = useI18n();

  const steps = [
    { number: "1", title: t("pages.home.steps.paste.title"), description: t("pages.home.steps.paste.desc") },
    { number: "2", title: t("pages.home.steps.download.title"), description: t("pages.home.steps.download.desc") },
    { number: "3", title: t("pages.home.steps.done.title"), description: t("pages.home.steps.done.desc") },
  ];

  const tools = [
    { href: "/captions", title: t("pages.home.tools.captions.title"), description: t("pages.home.tools.captions.desc") },
    { href: "/hashtags", title: t("pages.home.tools.hashtags.title"), description: t("pages.home.tools.hashtags.desc") },
    { href: "/mp3", title: t("pages.home.tools.mp3.title"), description: t("pages.home.tools.mp3.desc") },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="hero-glow" />

        {/* New feature announcement chip */}
        <Link
          href="/bulk"
          className="group inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 animate-fade-in"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">New</span>
          <span className="w-px h-3 bg-primary/30" />
          <span className="text-xs font-medium text-foreground">Bulk Downloader — download multiple videos at once</span>
          <span className="text-primary text-xs transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </Link>

        <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] mb-4 animate-fade-in">
          {t("pages.home.badge")}
        </p>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-center max-w-2xl animate-fade-in">
          {t("pages.home.title")}
        </h1>

        <p className="mt-4 text-lg text-muted-foreground text-center max-w-md animate-fade-in-delay-1">
          {t("pages.home.subtitle")}
        </p>

        <div className="w-full mt-10 animate-fade-in-delay-2">
          <VideoDownloaderForm />
        </div>

        <div className="flex items-center gap-4 mt-8 animate-fade-in-delay-3">
          {PLATFORMS.map((platform) => (
            <Link
              key={platform.name}
              href={platform.href}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-all duration-200"
            >
              <platform.icon className="h-4 w-4 fill-current opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="text-xs font-medium hidden sm:inline">{platform.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-content">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-12">
            {t("pages.home.howTitle")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step) => (
              <div key={step.number} className="text-center md:text-left">
                <span className="inline-block text-3xl font-semibold text-primary mb-3">
                  {step.number}
                </span>
                <h3 className="text-lg font-medium mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="px-6 py-16 md:py-24 border-t border-border">
        <div className="mx-auto max-w-content">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {t("pages.home.moreTools")}
            </h2>
            <Link
              href="/captions"
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              {t("pages.home.exploreTools")} →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-6 rounded-xl bg-surface border border-border hover:border-border-hover transition-all duration-200"
              >
                <h3 className="text-base font-medium mb-1.5 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
