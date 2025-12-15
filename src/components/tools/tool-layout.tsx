"use client";

import { ReactNode } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  children: ReactNode;
  titleKey: string;
  descriptionKey: string;
  icon: ReactNode;
  gradient?: string;
}

export function ToolLayout({ 
  children, 
  titleKey, 
  descriptionKey, 
  icon,
  gradient = "from-primary to-accent"
}: ToolLayoutProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={cn(
        "relative overflow-hidden py-16 md:py-24",
        "bg-gradient-to-br from-primary/10 via-accent/5 to-background"
      )}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className={cn(
            "inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6",
            "bg-gradient-to-br shadow-2xl shadow-primary/20",
            gradient
          )}>
            <div className="text-white">{icon}</div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline mb-4 tracking-tight">
            {t(titleKey)}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(descriptionKey)}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </section>
    </div>
  );
}
