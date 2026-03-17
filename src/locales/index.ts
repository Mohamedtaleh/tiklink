import en from './en';
import fr from './fr';
import ar from './ar';
import es from './es';
import hi from './hi';
import id from './id';

export const dictionaries = {
  en,
  fr,
  ar,
  es,
  hi,
  id,
};

export const locales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
]

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof en;
