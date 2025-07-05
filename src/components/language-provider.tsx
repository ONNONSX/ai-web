
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import ko from '@/locales/ko.json';
import ja from '@/locales/ja.json';
import zh from '@/locales/zh.json';

type Locale = 'ko' | 'en' | 'ja' | 'zh';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: { [key: string]: string | number }) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Locale, any> = { en, ko, ja, zh };

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('ko');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['en', 'ko', 'ja', 'zh'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = useCallback((key: string, options?: { [key: string]: string | number }): any => {
    let text: any = key.split('.').reduce((acc: any, currentKey: string) => {
      if (acc && typeof acc === 'object' && currentKey in acc) {
        return acc[currentKey];
      }
      return undefined;
    }, translations[locale]);

    if (text === undefined) {
      text = key.split('.').reduce((acc: any, currentKey: string) => {
        if (acc && typeof acc === 'object' && currentKey in acc) {
          return acc[currentKey];
        }
        return undefined;
      }, translations['en']) || key;
    }

    if (typeof text === 'string' && options) {
      Object.keys(options).forEach((k) => {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(options[k]));
      });
    }

    return text ?? key;
  }, [locale]);

  const value = { locale, setLocale, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
