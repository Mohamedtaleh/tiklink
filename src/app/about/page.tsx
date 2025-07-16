// src/app/about/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import { Users, Target, Eye } from "lucide-react";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">{t('about.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('about.tagline')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto mb-16">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline">{t('about.mission.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('about.mission.text')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline">{t('about.vision.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('about.vision.text')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-headline">{t('about.team.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('about.team.text')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t('about.why.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            {t('about.why.p1')}
          </p>
          <p>
            {t('about.why.p2')}
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li><strong>{t('about.why.reasons.speed.title')}:</strong> {t('about.why.reasons.speed.text')}</li>
            <li><strong>{t('about.why.reasons.simplicity.title')}:</strong> {t('about.why.reasons.simplicity.text')}</li>
            <li><strong>{t('about.why.reasons.security.title')}:</strong> {t('about.why.reasons.security.text')}</li>
          </ul>
          <p>
            {t('about.why.p3')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
