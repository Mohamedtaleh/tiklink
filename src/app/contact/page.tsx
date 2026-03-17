// src/app/contact/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">{t('contact.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('contact.tagline')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="text-center bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline">{t('contact.email.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('contact.email.text')}</p>
            <Button asChild>
              <Link href="mailto:support@tiklink.com">support@tiklink.ink</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="text-center bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <Twitter className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline">{t('contact.twitter.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('contact.twitter.text')}</p>
            <Button asChild>
              <Link href="https://twitter.com/tiklink" target="_blank" rel="noopener noreferrer">@tiklink</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="text-center bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline">{t('contact.feedback.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t('contact.feedback.text')}</p>
            <Button asChild>
              <Link href="mailto:feedback@tiklink.com">{t('contact.feedback.button')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
