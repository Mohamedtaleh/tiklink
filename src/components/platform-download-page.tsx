"use client";

import { VideoDownloaderForm } from "./video-downloader-form";
import type { Platform } from "@/lib/platform-detect";
import {
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
  XIcon,
  FacebookIcon,
} from "@/components/platform-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PLATFORM_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  twitter: XIcon,
  facebook: FacebookIcon,
};

interface FAQ {
  question: string;
  answer: string;
}

interface PlatformDownloadPageProps {
  platformName: string;
  platform: Platform;
  title: string;
  description: string;
  placeholder: string;
  faqs: FAQ[];
}

export function PlatformDownloadPage({
  platformName,
  platform,
  title,
  description,
  placeholder,
  faqs,
}: PlatformDownloadPageProps) {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="hero-glow" />

        {PLATFORM_ICON[platform] && (() => {
          const Icon = PLATFORM_ICON[platform];
          return (
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Icon className="h-5 w-5 fill-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-[0.2em]">
                {platformName}
              </span>
            </div>
          );
        })()}

        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-center max-w-2xl animate-fade-in">
          {title}
        </h1>

        <p className="mt-4 text-base text-muted-foreground text-center max-w-md animate-fade-in-delay-1">
          {description}
        </p>

        <div className="w-full mt-10 animate-fade-in-delay-2">
          <VideoDownloaderForm
            defaultPlatform={platform}
            placeholder={placeholder}
          />
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="px-6 py-16 md:py-24 border-t border-border">
          <div className="mx-auto max-w-content max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-center mb-10">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-sm font-medium text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </div>
  );
}
