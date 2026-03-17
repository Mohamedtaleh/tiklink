"use client";

import { useState } from "react";
import { Layers, ShieldCheck, Zap, ChevronDown } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { BulkDownloader } from "@/components/bulk-downloader";
import { cn } from "@/lib/utils";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium">{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="text-sm text-muted-foreground leading-relaxed pb-4">{answer}</p>
      )}
    </div>
  );
}

export function BulkPageClient() {
  const { t } = useI18n();

  const features = [
    { icon: Layers, title: t("bulk.batchTitle"), desc: t("bulk.batchDesc") },
    { icon: ShieldCheck, title: t("bulk.noWatermarkTitle"), desc: t("bulk.noWatermarkDesc") },
    { icon: Zap, title: t("bulk.freeTitle"), desc: t("bulk.freeDesc") },
  ];

  const steps = [
    t("bulk.step1"),
    t("bulk.step2"),
    t("bulk.step3"),
    t("bulk.step4"),
  ];

  const faqs = [
    { q: t("bulk.faq1q"), a: t("bulk.faq1a") },
    { q: t("bulk.faq2q"), a: t("bulk.faq2a") },
    { q: t("bulk.faq3q"), a: t("bulk.faq3a") },
    { q: t("bulk.faq4q"), a: t("bulk.faq4a") },
    { q: t("bulk.faq5q"), a: t("bulk.faq5a") },
    { q: t("bulk.faq6q"), a: t("bulk.faq6a") },
    { q: t("bulk.faq7q"), a: t("bulk.faq7a") },
    { q: t("bulk.faq8q"), a: t("bulk.faq8a") },
  ];

  return (
    <div className="flex flex-col items-center px-6 pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="hero-glow" />

      <div className="w-full max-w-2xl">
        {/* Page header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-4 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
            {t("bulk.badge")}
          </span>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
            {t("bulk.title")}
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t("bulk.subtitle")}
          </p>
        </div>

        {/* Bulk downloader */}
        <BulkDownloader />

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 pt-12 border-t border-border">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-2 p-4 rounded-xl bg-surface border border-border">
              <f.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <p className="text-sm font-medium">{f.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How to use */}
        <div className="mt-12" id="how-to-use">
          <h2 className="text-lg font-semibold tracking-tight mb-6">{t("bulk.howToTitle")}</h2>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQ */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-lg font-semibold tracking-tight mb-2">{t("bulk.faqTitle")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{t("bulk.faqSubtitle")}</p>
          <div className="rounded-xl bg-surface border border-border px-5">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
