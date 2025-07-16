// src/app/privacy/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";

export default function PrivacyPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
        <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold font-headline">{t('privacy.title')}</CardTitle>
                <CardDescription>{t('privacy.lastUpdated')}: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none mx-auto text-muted-foreground space-y-6">
                <p>
                    {t('privacy.p1')}
                </p>

                <h2 className="text-xl font-semibold text-foreground">{t('privacy.s1.title')}</h2>
                <p>
                    {t('privacy.s1.p1')}
                </p>
                <p>
                    {t('privacy.s1.p2')}
                </p>
                <ul className="list-disc list-inside pl-4">
                    <li>{t('privacy.s1.l1')}</li>
                    <li>{t('privacy.s1.l2')}</li>
                    <li>{t('privacy.s1.l3')}</li>
                    <li>{t('privacy.s1.l4')}</li>
                </ul>

                <h2 className="text-xl font-semibold text-foreground">{t('privacy.s2.title')}</h2>
                <p>
                    {t('privacy.s2.p1')}
                </p>

                <h2 className="text-xl font-semibold text-foreground">{t('privacy.s3.title')}</h2>
                <p>
                    {t('privacy.s3.p1')}
                </p>
                <ul className="list-disc list-inside pl-4">
                    <li><strong>{t('privacy.s3.l1.title')}:</strong> {t('privacy.s3.l1.text')}</li>
                    <li><strong>{t('privacy.s3.l2.title')}:</strong> {t('privacy.s3.l2.text')}</li>
                </ul>
                <p>
                    {t('privacy.s3.p2')}
                </p>

                <h2 className="text-xl font-semibold text-foreground">{t('privacy.s4.title')}</h2>
                <p>
                    {t('privacy.s4.p1')}
                </p>

                <h2 className="text-xl font-semibold text-foreground">{t('privacy.s5.title')}</h2>
                <p>
                    {t('privacy.s5.p1')}
                </p>

                <h2 className="text-xl font-semibold text-foreground">{t('privacy.s6.title')}</h2>
                <p>
                    {t('privacy.s6.p1')}
                </p>

                <h2 className="text-xl font-semibold text-foreground">{t('privacy.s7.title')}</h2>
                <p dangerouslySetInnerHTML={{ __html: t('privacy.s7.p1', { email: '<a href="mailto:support@tiklink.ink" class="text-primary hover:underline">support@tiklink.ink</a>' }) }} />
            </CardContent>
        </Card>
    </div>
  );
}
