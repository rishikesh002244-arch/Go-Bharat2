"use client";

import { useSIHLanguage } from "./LanguageProvider";

export default function LanguageToggle() {
  const { language, setLanguage, languages, t } = useSIHLanguage();

  return (
    <label className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-600 transition hover:border-orange-300">
      <span aria-hidden="true">🌐</span>
      <span className="sr-only">{t("language", "Language")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        className="max-w-20 bg-transparent outline-none cursor-pointer"
        aria-label={t("language", "Language")}
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
