// src/app/terms/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";

export default function TermsPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-bold font-headline">{t('terms.title')}</CardTitle>
          <CardDescription>{t('terms.lastUpdated')}: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-lg dark:prose-invert max-w-none mx-auto text-muted-foreground space-y-6">
          <p>
            {t('terms.p1')}
          </p>

          <h2 className="text-xl font-semibold text-foreground">{t('terms.s1.title')}</h2>
          <p>
            {t('terms.s1.p1')}
          </p>

          <h2 className="text-xl font-semibold text-foreground">{t('terms.s2.title')}</h2>
          <p>
            {t('terms.s2.p1')}
          </p>
          <p>
            {t('terms.s2.p2')}
          </p>
          <ul className="list-disc list-inside pl-4">
            <li>{t('terms.s2.l1')}</li>
            <li>{t('terms.s2.l2')}</li>
            <li>{t('terms.s2.l3')}</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">{t('terms.s3.title')}</h2>
          <p>
            {t('terms.s3.p1')}
          </p>

          <h2 className="text-xl font-semibold text-foreground">{t('terms.s4.title')}</h2>
          <p>
            {t('terms.s4.p1')}
          </p>

          <h2 className="text-xl font-semibold text-foreground">{t('terms.s5.title')}</h2>
          <p>
            {t('terms.s5.p1')}
          </p>

          <h2 className="text-xl font-semibold text-foreground">{t('terms.s6.title')}</h2>
          <p>
            {t('terms.s6.p1')}
          </p>

          <h2 className="text-xl font-semibold text-foreground">{t('terms.s7.title')}</h2>
          <p dangerouslySetInnerHTML={{ __html: t('terms.s7.p1', { email: '<a href="mailto:legal@tiklink.com" class="text-primary hover:underline">legal@tiklink.com</a>' }) }} />
        </CardContent>
      </Card>
    </div>
  );
}
