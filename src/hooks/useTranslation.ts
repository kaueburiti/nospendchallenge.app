import { useMemo } from 'react';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '@/i18n/en.json';

/**
 * Hook for handling translations across the app
 */
export const useTranslation = () => {
  // Initialize i18n
  const i18n = useMemo(() => {
    const i18nInstance = new I18n({
      en,
      // Add other languages here when needed
    });

    // Set the locale
    i18nInstance.locale = Localization.locale?.split('-')[0] || 'en';
    i18nInstance.enableFallback = true;
    i18nInstance.defaultLocale = 'en';

    return i18nInstance;
  }, []);

  /**
   * Translate a string
   * @param key The translation key
   * @param options Optional replacement parameters
   * @returns The translated string
   */
  const t = (key: string, options?: Record<string, any>): string => {
    if (!key) return '';
    return i18n.t(key, options);
  };

  return {
    t,
    i18n,
    locale: i18n.locale,
  };
};
