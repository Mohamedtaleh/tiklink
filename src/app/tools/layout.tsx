import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Tiklink Tools",
    default: "Free TikTok Tools | Tiklink",
  },
  description: "Powerful free AI tools for TikTok creators. Calculate earnings, generate hashtags, predict viral content, analyze profiles, and more.",
  keywords: "TikTok tools, TikTok money calculator, TikTok hashtag generator, TikTok viral predictor, TikTok analytics, TikTok bio generator",
  openGraph: {
    title: "Free TikTok Tools | Tiklink",
    description: "Powerful free AI tools for TikTok creators. Grow your TikTok presence with our suite of tools.",
    type: "website",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
