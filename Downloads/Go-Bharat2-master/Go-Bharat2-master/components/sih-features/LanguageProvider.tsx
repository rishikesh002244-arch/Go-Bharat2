"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SIHLanguageCode,
  SUPPORTED_SIH_LANGUAGES,
  translateStaticText,
} from "@/routes/sih/translation";

type LanguageContextValue = {
  language: SIHLanguageCode;
  setLanguage: (language: SIHLanguageCode) => void;
  languages: typeof SUPPORTED_SIH_LANGUAGES;
  t: (key: string, fallback: string) => string;
  translateText: (text: string) => Promise<string>;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const LANGUAGE_STORAGE_KEY = "go-bharat:sih-language";

export function SIHLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SIHLanguageCode>("en");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as SIHLanguageCode | null;
    if (!savedLanguage || !SUPPORTED_SIH_LANGUAGES.some((item) => item.code === savedLanguage)) return;

    // Deferring this client-only preference avoids a server/client hydration
    // mismatch while retaining the chosen language on the next visit.
    const timer = window.setTimeout(() => setLanguageState(savedLanguage), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
      },
      languages: SUPPORTED_SIH_LANGUAGES,
      // A synchronous wrapper for UI labels. It deliberately never remounts
      // callers, so pre-existing form state stays intact on language changes.
      t: (key, fallback) => translateStaticText(language, key, fallback),
      translateText: async (text) => {
        if (!text.trim() || language === "en") return text;

        try {
          const response = await fetch("/api/sih/translation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, sourceLanguage: "en", targetLanguage: language }),
          });
          const data = await response.json();
          return response.ok && data.success ? data.data.translatedText : text;
        } catch {
          return text;
        }
      },
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useSIHLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useSIHLanguage must be used inside SIHLanguageProvider");
  }
  return context;
}
