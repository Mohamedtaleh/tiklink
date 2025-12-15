"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, Twitter, Copy, Check } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface ShareResultCardProps {
  children: React.ReactNode;
  shareText?: string;
  fileName?: string;
}

export function ShareResultCard({ children, shareText, fileName = "tiklink-result" }: ShareResultCardProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      toast({
        title: t("tools.share.downloaded"),
        description: t("tools.share.downloadedDesc"),
      });
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({
      title: t("share.copied"),
      description: t("share.copiedSuccess"),
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = shareText || t("tools.share.defaultText");
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-4">
      <div ref={cardRef} className="relative">
        {children}
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={handleDownload} disabled={isDownloading} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? t("tools.share.downloading") : t("tools.share.download")}
        </Button>
        <Button onClick={handleShareTwitter} variant="outline">
          <Twitter className="mr-2 h-4 w-4" />
          {t("tools.share.twitter")}
        </Button>
        <Button onClick={handleCopyLink} variant="outline">
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? t("share.copied") : t("tools.share.copyLink")}
        </Button>
      </div>
    </div>
  );
}
