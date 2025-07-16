"use client";

import {
  Copy,
  Download,
  QrCode,
  Share2,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "qrcode.react";

interface ShareButtonsProps {
  shareUrl: string;
  videoTitle: string;
}

const TelegramIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
    </svg>
  );
  

export function ShareButtons({ shareUrl, videoTitle }: ShareButtonsProps) {
  const { t } = useI18n();
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: t("share.copied"),
      description: t("share.copiedSuccess"),
    });
  };

  const shareText = t("share.text", { title: videoTitle });

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('share.title')}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <Button
          variant="outline"
          asChild
        >
          <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle />
            WhatsApp
          </a>
        </Button>
        <Button
          variant="outline"
          asChild
        >
          <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
            <TelegramIcon />
            Telegram
          </a>
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          <Copy />
          {t("share.copy")}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <QrCode />
              {t("share.qr")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[225px]">
            <DialogHeader>
              <DialogTitle>{t('share.qrTitle')}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              <QRCode value={shareUrl} size={160} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
