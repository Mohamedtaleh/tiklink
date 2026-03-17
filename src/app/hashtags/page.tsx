import type { Metadata } from "next";
import { HashtagGeneratorClient } from "./client";

export const metadata: Metadata = {
  title: "TikTok Hashtag Generator — Trending Tags | Tiklink",
  description: "Generate trending TikTok hashtags for any niche. Free AI-powered hashtag generator with trending, medium, and niche tag recommendations.",
  alternates: { canonical: "/hashtags" },
  openGraph: {
    title: "TikTok Hashtag Generator — Trending Tags | Tiklink",
    description: "Generate trending TikTok hashtags for any niche. Free and AI-powered.",
    url: "/hashtags",
  },
};

export default function HashtagsPage() {
  return <HashtagGeneratorClient />;
}
