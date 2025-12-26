"use client";

import { useState, useEffect } from "react";
import { X, Gift, Sparkles, Mail, Bell, ArrowRight, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NewsletterPopupProps {
  trigger?: "exit" | "scroll" | "time" | "manual";
  delay?: number;
  scrollPercentage?: number;
}

export function NewsletterPopup({
  trigger = "time",
  delay = 30000,
  scrollPercentage = 60,
}: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Check if already shown or subscribed
    const hasShown = localStorage.getItem("newsletter-shown");
    const hasSubscribed = localStorage.getItem("newsletter-subscribed");
    if (hasShown || hasSubscribed) return;

    if (trigger === "time") {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("newsletter-shown", "true");
      }, delay);
      return () => clearTimeout(timer);
    }

    if (trigger === "scroll") {
      const handleScroll = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled >= scrollPercentage) {
          setIsOpen(true);
          localStorage.setItem("newsletter-shown", "true");
          window.removeEventListener("scroll", handleScroll);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    if (trigger === "exit") {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsOpen(true);
          localStorage.setItem("newsletter-shown", "true");
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [trigger, delay, scrollPercentage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Simulate API call - replace with actual newsletter signup
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setStatus("success");
    localStorage.setItem("newsletter-subscribed", "true");
    
    // Close after success
    setTimeout(() => setIsOpen(false), 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-lg border-0 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-primary" />

        <CardContent className="pt-10 pb-8 px-6">
          {status === "success" ? (
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold font-headline mb-2">You're In! 🎉</h3>
              <p className="text-muted-foreground">
                Check your inbox for your free TikTok Growth Guide
              </p>
            </div>
          ) : (
            <>
              {/* Badge */}
              <div className="text-center mb-6">
                <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 text-sm">
                  <Gift className="w-4 h-4 mr-2" />
                  FREE Gift Inside
                </Badge>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold font-headline mb-3">
                  Get the TikTok Growth Guide 📈
                </h3>
                <p className="text-muted-foreground">
                  Join 10,000+ creators getting weekly tips on how to go viral and grow your following
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Zap, text: "Viral Strategies" },
                  { icon: Sparkles, text: "AI Tips & Tricks" },
                  { icon: Bell, text: "New Tools Alert" },
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm"
                  >
                    <benefit.icon className="w-4 h-4 text-primary" />
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 text-lg"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subscribing...
                    </div>
                  ) : (
                    <>
                      Get Free Guide
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-4">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Exit intent popup variant
export function ExitIntentPopup() {
  return <NewsletterPopup trigger="exit" />;
}

// Inline newsletter signup
export function InlineNewsletter({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    localStorage.setItem("newsletter-subscribed", "true");
  };

  if (status === "success") {
    return (
      <div className={cn("p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 text-center", className)}>
        <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="font-bold text-green-600">You're subscribed! 🎉</p>
      </div>
    );
  }

  return (
    <div className={cn("p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-5 h-5 text-primary" />
        <h4 className="font-bold">Get TikTok Tips Weekly</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Join 10,000+ creators growing their TikTok
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
          Subscribe
        </Button>
      </form>
    </div>
  );
}
