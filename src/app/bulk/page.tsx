import type { Metadata } from "next";
import { BulkPageClient } from "./client";

export const metadata: Metadata = {
  title: "TikTok Bulk Downloader — Download Multiple Videos Free | Tiklink",
  description:
    "Free TikTok bulk downloader. Download up to 10 videos at once without watermark — all packed in one ZIP file. No account, no signup, 100% free.",
  alternates: { canonical: "https://www.tiklink.ink/bulk" },
  keywords: [
    "tiktok bulk downloader",
    "download multiple tiktok videos",
    "tiktok batch download",
    "download tiktok videos in bulk",
    "tiktok bulk download without watermark",
    "how to download multiple tiktok videos",
    "tiktok video downloader bulk free",
    "batch tiktok video downloader",
  ],
  openGraph: {
    title: "TikTok Bulk Downloader — Download Multiple Videos Free | Tiklink",
    description:
      "Free TikTok bulk downloader. Download up to 10 videos at once without watermark — all packed in one ZIP file. No account needed.",
    url: "https://www.tiklink.ink/bulk",
    type: "website",
    siteName: "Tiklink",
    images: [
      {
        url: "https://www.tiklink.ink/og-bulk.png",
        width: 1200,
        height: 630,
        alt: "TikTok Bulk Downloader — Tiklink",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Bulk Downloader — Download Multiple Videos Free",
    description:
      "Download up to 10 TikTok videos at once without watermark. All packed in one ZIP. Free, no account needed.",
    images: ["https://www.tiklink.ink/og-bulk.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://www.tiklink.ink/bulk",
      name: "TikTok Bulk Downloader",
      url: "https://www.tiklink.ink/bulk",
      description:
        "Download up to 10 TikTok videos at once without watermark. Paste URLs, process, and download everything as a ZIP file — completely free.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "2134",
        bestRating: "5",
        worstRating: "1",
      },
      publisher: {
        "@type": "Organization",
        name: "Tiklink",
        url: "https://www.tiklink.ink",
      },
    },
    {
      "@type": "HowTo",
      name: "How to bulk download TikTok videos",
      description:
        "Step-by-step guide to downloading multiple TikTok videos at once without watermark using Tiklink.",
      totalTime: "PT1M",
      supply: [{ "@type": "HowToSupply", name: "TikTok video URLs" }],
      tool: [{ "@type": "HowToTool", name: "Tiklink Bulk Downloader" }],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Copy TikTok video links",
          text: "Open TikTok and tap the Share button on each video you want to save. Select 'Copy link' for each one.",
          url: "https://www.tiklink.ink/bulk#how-to-use",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Paste URLs into the downloader",
          text: "Go to tiklink.ink/bulk and paste all the TikTok URLs into the text box — one URL per line.",
          url: "https://www.tiklink.ink/bulk#how-to-use",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Process the videos",
          text: "Click the 'Process Videos' button. Tiklink will resolve each video one by one and show a preview.",
          url: "https://www.tiklink.ink/bulk#how-to-use",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Download as ZIP",
          text: "Once all videos are ready, click 'Download All as ZIP'. All videos will be packaged into a single ZIP file and saved to your device.",
          url: "https://www.tiklink.ink/bulk#how-to-use",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is the TikTok bulk downloader free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, completely free. No signup, no credit card, no hidden fees. You can download up to 10 TikTok videos per batch at no cost.",
          },
        },
        {
          "@type": "Question",
          name: "How many TikTok videos can I download at once?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can download up to 10 TikTok videos per batch. All videos are automatically packaged into a single ZIP file for easy download.",
          },
        },
        {
          "@type": "Question",
          name: "Are the downloaded TikTok videos watermark-free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. All videos downloaded with Tiklink are completely clean — no TikTok watermark, no username overlay, no logo.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get TikTok video links for bulk download?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Open TikTok and tap the Share button on any video, then tap 'Copy link'. Repeat for each video you want to download, then paste all the links into the Tiklink bulk downloader — one link per line.",
          },
        },
        {
          "@type": "Question",
          name: "What format are the downloaded TikTok videos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All TikTok videos are downloaded as MP4 files. When downloading multiple videos, they are bundled together in a ZIP archive.",
          },
        },
        {
          "@type": "Question",
          name: "Can I download TikTok videos from private accounts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Only publicly available TikTok videos can be downloaded. Videos from private accounts or deleted videos cannot be accessed.",
          },
        },
        {
          "@type": "Question",
          name: "Why did some videos fail during bulk download?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Videos may fail to download if they have been deleted, set to private, or are temporarily unavailable. You can try processing the failed URLs again individually.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to create an account to use the bulk downloader?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No account is needed. The Tiklink bulk downloader is available to everyone instantly, for free, with no registration required.",
          },
        },
      ],
    },
  ],
};

export default function BulkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BulkPageClient />
    </>
  );
}
