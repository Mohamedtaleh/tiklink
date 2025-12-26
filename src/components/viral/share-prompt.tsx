"use client";

import { useState, useEffect } from "react";
import { Share2, Twitter, Copy, Check, X, Link2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SharePromptProps {
  title: string;
  text: string;
  url?: string;
  trigger?: "scroll" | "result" | "manual";
  delay?: number;
  className?: string;
}

export function SharePrompt({
  title,
  text,
  url,
  trigger = "result",
  delay = 2000,
  className,
}: SharePromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    if (trigger === "result") {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [trigger, delay]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${text} ${shareUrl}`);
    setCopied(true);
    toast({ title: "Copied!", description: "Link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch (err) {
        // User cancelled
      }
    }
  };

  if (!isVisible && trigger !== "manual") return null;

  return (
    <Card
      className={cn(
        "border-0 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500",
        "bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5",
        className
      )}
    >
      <CardContent className="py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-lg">{title}</h4>
              <p className="text-sm text-muted-foreground">
                Share your results with friends!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTwitterShare}
              className="gap-2"
            >
              <Twitter className="w-4 h-4" />
              <span className="hidden sm:inline">Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsAppShare}
              className="gap-2 bg-green-500/10 hover:bg-green-500/20 border-green-500/30"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTelegramShare}
              className="gap-2 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30"
            >
              <Send className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">Telegram</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
            </Button>
            {"share" in navigator && (
              <Button
                size="sm"
                onClick={handleNativeShare}
                className="gap-2 bg-gradient-to-r from-primary to-accent"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Floating share bar for mobile
export function FloatingShareBar({
  text,
  url,
}: {
  text: string;
  url?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 md:hidden animate-in slide-in-from-right duration-300">
      <Button
        size="lg"
        onClick={handleShare}
        className="rounded-full w-14 h-14 shadow-xl bg-gradient-to-r from-primary to-accent"
      >
        <Share2 className="w-6 h-6" />
      </Button>
    </div>
  );
}
