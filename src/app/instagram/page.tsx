import type { Metadata } from "next";
import { PlatformDownloadPage } from "@/components/platform-download-page";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Download Instagram Reels Without Watermark — Free HD | Tiklink",
  description: "Download Instagram Reels without watermark in HD quality. Save any Instagram video, story, or reel for free. No signup, no app required.",
  keywords: "Instagram Reels downloader, download Instagram videos, save Instagram Reels, Instagram video downloader no watermark, free Instagram downloader",
  alternates: { canonical: "https://tiklink.ink/instagram" },
  openGraph: {
    title: "Download Instagram Reels Without Watermark — Free HD",
    description: "Save any Instagram Reel or video in HD quality. No watermark, no signup, completely free.",
    url: "https://tiklink.ink/instagram",
    siteName: "Tiklink",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tiklink Instagram Downloader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Instagram Reels Without Watermark | Tiklink",
    description: "Save Instagram Reels in HD. Free, fast, no signup.",
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
    question: "How do I download Instagram Reels?",
    answer: "Simply copy the Reel URL from Instagram, paste it into the input field above, and click Download. Your video will be ready in seconds.",
  },
  {
    question: "Can I download Instagram Reels without watermark?",
    answer: "Yes, Tiklink downloads Instagram Reels in their original quality without any added watermarks.",
  },
  {
    question: "Is it free to download Instagram Reels?",
    answer: "Yes, Tiklink is completely free to use. No signup, no hidden fees.",
  },
  {
    question: "Can I download private Instagram Reels?",
    answer: "No, only publicly available Reels can be downloaded. Private accounts' content is not accessible.",
  },
  {
    question: "What video quality can I download?",
    answer: "Tiklink downloads Instagram Reels in the highest available quality, typically 1080p HD.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tiklink Instagram Downloader",
  url: "https://tiklink.ink/instagram",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function InstagramPage() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="webapp-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <PlatformDownloadPage
        platformName="Instagram"
        platform="instagram"
        title="Download Instagram Reels"
        description="Save Instagram Reels in HD quality without watermark. Fast and free."
        placeholder="Paste Instagram Reel URL..."
        faqs={FAQS}
      />
    </>
  );
}
