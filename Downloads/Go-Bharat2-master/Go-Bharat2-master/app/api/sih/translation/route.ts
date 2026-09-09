import { NextResponse } from "next/server";
import {
  SIHLanguageCode,
  SUPPORTED_SIH_LANGUAGES,
  translateWithBhashini,
} from "@/routes/sih/translation";

const languageCodes = new Set(SUPPORTED_SIH_LANGUAGES.map((language) => language.code));

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const targetLanguage = body.targetLanguage as SIHLanguageCode;
    const sourceLanguage = (body.sourceLanguage || "en") as SIHLanguageCode;

    if (!text || text.length > 5000 || !languageCodes.has(targetLanguage) || !languageCodes.has(sourceLanguage)) {
      return NextResponse.json(
        { success: false, error: "Provide text and supported language codes." },
        { status: 400 }
      );
    }

    const result = await translateWithBhashini(text, targetLanguage, sourceLanguage);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[SIH Translation] Translation failed", error);
    return NextResponse.json(
      { success: false, error: "Translation is temporarily unavailable." },
      { status: 503 }
    );
  }
}
