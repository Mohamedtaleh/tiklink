import type { Metadata } from "next";
import { PlatformDownloadPage } from "@/components/platform-download-page";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Download YouTube Shorts Without Watermark — Free HD | Tiklink",
  description: "Download YouTube Shorts without watermark in HD quality. Save any YouTube Short video for free. No signup, no app required.",
  keywords: "YouTube Shorts downloader, download YouTube Shorts, save YouTube videos, YouTube video downloader no watermark, free YouTube downloader",
  alternates: { canonical: "https://www.tiklink.ink/youtube" },
  openGraph: {
    title: "Download YouTube Shorts Without Watermark — Free HD",
    description: "Save any YouTube Shorts video in HD quality. No watermark, no signup, completely free.",
    url: "https://www.tiklink.ink/youtube",
    siteName: "Tiklink",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tiklink YouTube Downloader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download YouTube Shorts Without Watermark | Tiklink",
    description: "Save YouTube Shorts in HD. Free, fast, no signup.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

const FAQS = [
  {
    question: "How do I download YouTube Shorts?",
    answer: "Copy the YouTube Shorts URL, paste it above, and click Download. The video will be saved to your device instantly.",
  },
  {
    question: "Can I download YouTube Shorts in HD?",
    answer: "Yes, Tiklink downloads YouTube Shorts in the highest available quality.",
  },
  {
    question: "Is downloading YouTube Shorts free?",
    answer: "Yes, completely free. No account needed, no limits on downloads.",
  },
  {
    question: "Can I extract audio from YouTube Shorts?",
    answer: "Yes, when available, you'll see a Download Audio option alongside the video download.",
  },
  {
    question: "Do I need to install any software?",
    answer: "No, Tiklink works entirely in your browser. No app or extension needed.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tiklink YouTube Downloader",
  url: "https://www.tiklink.ink/youtube",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function YouTubePage() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="webapp-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <PlatformDownloadPage
        platformName="YouTube"
        platform="youtube"
        title="Download YouTube Shorts"
        description="Save YouTube Shorts in HD quality without watermark. Fast and free."
        placeholder="Paste YouTube Shorts URL..."
        faqs={FAQS}
      />
    </>
  );
}
