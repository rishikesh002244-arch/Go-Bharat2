export type SIHLanguageCode = "en" | "hi" | "ta" | "te" | "bn";

export const SUPPORTED_SIH_LANGUAGES: Array<{
  code: SIHLanguageCode;
  label: string;
  nativeLabel: string;
}> = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
];

type StaticTranslations = Record<SIHLanguageCode, Record<string, string>>;

/**
 * Static labels are local and synchronous, so changing language never resets
 * an existing form or itinerary. Add keys here gradually as screens adopt t().
 */
export const SIH_STATIC_TRANSLATIONS: StaticTranslations = {
  en: {},
  hi: {
    home: "होम",
    locations: "स्थान",
    places: "घूमने की जगहें",
    marketplace: "बाज़ार",
    passport: "डिजिटल पासपोर्ट",
    planTrip: "यात्रा बनाएँ",
    emergency: "आपातकालीन सहायता",
    language: "भाषा",
  },
  ta: {
    home: "முகப்பு",
    locations: "இடங்கள்",
    places: "சுற்றுலாத் தலங்கள்",
    marketplace: "சந்தை",
    passport: "டிஜிட்டல் பாஸ்போர்ட்",
    planTrip: "பயணத்தை திட்டமிடுங்கள்",
    emergency: "அவசர உதவி",
    language: "மொழி",
  },
  te: {
    home: "హోమ్",
    locations: "ప్రాంతాలు",
    places: "చూడవలసిన ప్రదేశాలు",
    marketplace: "మార్కెట్",
    passport: "డిజిటల్ పాస్‌పోర్ట్",
    planTrip: "ప్రయాణాన్ని ప్లాన్ చేయండి",
    emergency: "అత్యవసర సహాయం",
    language: "భాష",
  },
  bn: {
    home: "হোম",
    locations: "অবস্থান",
    places: "দর্শনীয় স্থান",
    marketplace: "বাজার",
    passport: "ডিজিটাল পাসপোর্ট",
    planTrip: "ভ্রমণ পরিকল্পনা",
    emergency: "জরুরি সহায়তা",
    language: "ভাষা",
  },
};

export function translateStaticText(
  language: SIHLanguageCode,
  key: string,
  fallback: string
) {
  return SIH_STATIC_TRANSLATIONS[language]?.[key] || fallback;
}

export async function translateWithBhashini(
  text: string,
  targetLanguage: SIHLanguageCode,
  sourceLanguage: SIHLanguageCode = "en"
) {
  if (targetLanguage === sourceLanguage) {
    return { translatedText: text, provider: "source" as const };
  }

  const endpoint = process.env.BHASHINI_TRANSLATION_URL;
  const apiKey = process.env.BHASHINI_API_KEY;

  if (!endpoint || !apiKey) {
    return { translatedText: text, provider: "local-fallback" as const };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ sourceLanguage, targetLanguage, text }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error("Bhashini translation service is unavailable");
  }

  const payload = await response.json();
  const translatedText =
    payload.translatedText || payload.translation || payload.output?.[0]?.target;

  if (typeof translatedText !== "string" || !translatedText.trim()) {
    throw new Error("Bhashini returned an invalid translation response");
  }

  return { translatedText, provider: "bhashini" as const };
}
