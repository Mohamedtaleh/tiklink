"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight, Gift, Zap, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Top banner for promotions
export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary via-accent to-primary text-white py-2 px-4 text-center text-sm">
      <div className="container mx-auto flex items-center justify-center gap-2 flex-wrap">
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">
          🚀 NEW: AI Caption Generator & Script Writer are here!
        </span>
        <Link href="/tools/caption-generator">
          <Badge className="bg-white/20 hover:bg-white/30 text-white cursor-pointer">
            Try Free →
          </Badge>
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Scroll progress indicator with CTA
export function ScrollProgressCTA() {
  const [progress, setProgress] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const percentage = Math.min(100, (scrolled / documentHeight) * 100);
      setProgress(percentage);
      setShowCTA(percentage > 30 && percentage < 90);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Progress bar at top */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-muted">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Side CTA */}
      {showCTA && (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block animate-in slide-in-from-left duration-500">
          <Link href="/tools">
            <div className="bg-card border shadow-xl rounded-2xl p-4 hover:shadow-2xl transition-all hover:-translate-y-1 group cursor-pointer max-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">Free Tools</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                8 AI-powered tools to grow your TikTok
              </p>
              <div className="flex items-center text-primary text-xs font-medium">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  );
}

// Stats counter animation
export function LiveStats() {
  const [stats, setStats] = useState({
    users: 523847,
    downloads: 2847291,
    tools: 8,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users + Math.floor(Math.random() * 3),
        downloads: prev.downloads + Math.floor(Math.random() * 10),
        tools: prev.tools,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-muted-foreground">
          <span className="font-bold text-foreground">
            {stats.users.toLocaleString()}
          </span>{" "}
          users online
        </span>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <span className="text-muted-foreground">
          <span className="font-bold text-foreground">
            {stats.downloads.toLocaleString()}
          </span>{" "}
          downloads
        </span>
      </div>
    </div>
  );
}

// Testimonial carousel for social proof
const TESTIMONIALS = [
  { text: "Best TikTok tools I've found! 🔥", author: "@sarah_creates" },
  { text: "Helped me grow from 1K to 100K followers!", author: "@dancequeen" },
  { text: "The viral predictor is scary accurate", author: "@techbro_mike" },
  { text: "Saved me hours every week", author: "@contentqueen" },
  { text: "Finally tools that actually work", author: "@marketingpro" },
];

export function TestimonialTicker() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 text-sm bg-muted/50 rounded-full px-4 py-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <div className="animate-in fade-in duration-500" key={current}>
        <span className="italic text-muted-foreground">
          "{TESTIMONIALS[current].text}"
        </span>
        <span className="text-primary font-medium ml-2">
          {TESTIMONIALS[current].author}
        </span>
      </div>
    </div>
  );
}
