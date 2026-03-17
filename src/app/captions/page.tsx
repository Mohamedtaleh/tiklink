import type { Metadata } from "next";
import { CaptionGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "AI Caption Generator for TikTok & Instagram | Tiklink",
  description: "Generate viral captions with AI for TikTok, Instagram, and YouTube. Free AI-powered caption generator with hashtags and engagement optimization.",
  alternates: { canonical: "/captions" },
  openGraph: {
    title: "AI Caption Generator for TikTok & Instagram | Tiklink",
    description: "Generate viral captions with AI. Free, fast, optimized for engagement.",
    url: "/captions",
  },
};

export default function CaptionsPage() {
  return <CaptionGeneratorClient />;
}
