"use client";

import { Check, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/use-i18n";
import { type Locale, locales } from "@/locales";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span>{currentLocale.flag}</span>
          <span>{currentLocale.code.toUpperCase()}</span>
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => setLocale(l.code as Locale)}>
            <div className="flex items-center w-full justify-between gap-4">
              <span>{l.flag} {l.name}</span>
              {locale === l.code && <Check className="h-4 w-4" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
