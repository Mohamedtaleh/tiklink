import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tiklink Pro — Coming Soon",
  description: "Bulk downloads, no ads, priority speed. Tiklink Pro is coming soon.",
  alternates: { canonical: "/pro" },
};

const FEATURES = [
  {
    title: "Bulk Downloads",
    description: "Download entire profiles or collections at once. Save hours of manual work.",
  },
  {
    title: "No Ads",
    description: "Clean, distraction-free experience. Just you and your downloads.",
  },
  {
    title: "Priority Speed",
    description: "Faster processing and downloads with dedicated infrastructure.",
  },
];

export default function ProPage() {
  return (
    <div className="flex flex-col items-center px-6 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="hero-glow" />

      <span className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-4 animate-fade-in">
        Coming Soon
      </span>

      <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-center max-w-lg animate-fade-in">
        Tiklink Pro
      </h1>

      <p className="mt-4 text-base text-muted-foreground text-center max-w-md animate-fade-in-delay-1">
        Everything you love about Tiklink, supercharged.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-content animate-fade-in-delay-2">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="p-6 rounded-xl bg-surface border border-border"
          >
            <h3 className="text-base font-medium mb-1.5">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 animate-fade-in-delay-3">
        <Link
          href="/bulk"
          className="inline-flex items-center justify-center h-11 px-6 rounded-[10px] text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Try Bulk Downloader Free
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-11 px-6 rounded-[10px] text-sm font-medium bg-surface-2 border border-border hover:border-border-hover transition-colors"
        >
          Contact for Early Access
        </Link>
      </div>

      <p className="mt-8 text-xs text-muted-foreground animate-fade-in-delay-3">
        Free plan: 3 videos per session · Pro plan: 50 videos + no ads
      </p>
    </div>
  );
}
