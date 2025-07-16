
"use client";

import React, { createContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { dictionaries, type Locale } from '@/locales';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
};

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLocale = localStorage.getItem('locale') as Locale | null;
    if (storedLocale && dictionaries[storedLocale]) {
      setLocale(storedLocale);
    } else {
        const browserLang = navigator.language.split('-')[0] as Locale;
        if(dictionaries[browserLang]) {
            setLocale(browserLang);
        }
    }
  }, []);

  useEffect(() => {
    if(isMounted) {
        localStorage.setItem('locale', locale);
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale, isMounted]);

  const t = (key: string, replacements?: Record<string, string>): string => {
    const dictionary = dictionaries[locale] || dictionaries.en;
    let translation = key.split('.').reduce((o, i) => (o as any)?.[i], dictionary) as string | undefined;

    if (translation === undefined) {
      // Fallback to English if translation is missing
      translation = key.split('.').reduce((o, i) => (o as any)?.[i], dictionaries.en) as string;
    }

    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            translation = (translation || '').replace(new RegExp(`{{${rKey}}}`, 'g'), replacements[rKey]);
        });
    }

    return translation || key;
  };
  
  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  if (!isMounted) {
    return null;
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
