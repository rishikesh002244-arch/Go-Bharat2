import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";

const GROQ_API_KEY = process.env.GROK_API_KEY; // Groq Cloud key (gsk_...)
const GROQ_MODEL = "qwen/qwen3.8-27b"; // Fast, high-quality model on Groq

// Curated fallbacks for graceful degradation when Groq API is unreachable or key is unset
const FALLBACK_TRAVEL_TIPS = [
  "When exploring Rajasthan's majestic forts in Jaipur and Jodhpur, hire a government-certified guide at the gate or use official audio guides for authentic historical context.",
  "In Kerala, consider taking the local public ferry from Alleppey to Kottayam for just ₹25 — it traverses the same pristine backwaters as luxury houseboats with stunning authentic village views.",
  "For Varanasi, attend the morning Subah-e-Banaras at Assi Ghat at 5:00 AM for soulful classical ragas and yoga before heading to Dashashwamedh Ghat for the grand evening Aarti.",
  "When trekking in Himachal Pradesh or Ladakh, always allow 24-48 hours for gradual acclimatization at higher altitudes and carry electrolyte hydration powders.",
  "Street food rule of thumb: Follow the local crowds! Stalls with high turnover and sizzling fresh cooking (like Chandni Chowk in Delhi or Sarafa Bazaar in Indore) offer the safest and most delicious authentic flavors."
];

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Safeguard (15 requests/min per IP)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "grok-client";

    const rateLimit = checkRateLimit(`grok_${ip}`, 15, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `AI request rate limit reached. Please wait ${rateLimit.resetInSeconds} seconds before asking again.`,
        },
        { status: 429 }
      );
    }

    // 2. Validate payload
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { prompt, history, topic } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "A travel query or prompt is required." },
        { status: 400 }
      );
    }

    // Guard against prompt flooding
    const cleanPrompt = prompt.trim().slice(0, 1500);

    // 3. Fallback check if GROQ_API_KEY is not configured
    if (!GROQ_API_KEY) {
      console.warn(
        "[Go-Bharat AI Guide] GROK_API_KEY is not configured. Returning graceful fallback advice."
      );
      const randomTip =
        FALLBACK_TRAVEL_TIPS[
          Math.floor(Math.random() * FALLBACK_TRAVEL_TIPS.length)
        ];

      return NextResponse.json({
        success: true,
        message: `Namaste! Here is a curated Go-Bharat travel tip for your query:\n\n${randomTip}\n\n(Tip: Add GROK_API_KEY to your .env.local file to unlock full real-time AI responses.)`,
        isFallback: true,
        model: "fallback-curated",
      });
    }

    // 4. Build Messages for Groq Cloud API (OpenAI-compatible)
    const systemInstruction = `You are "Go-Bharat AI Guide", an elite, culturally respectful, and immensely knowledgeable Indian travel specialist. 
Your goal is to provide concise, accurate, and inspiring advice about traveling in India.
- Cover all 28 states and 8 union territories.
- Emphasize local etiquette, cultural respect, hidden spots, transport options, and regional food specialties.
- Keep answers engaging, formatted with clear bullet points where helpful, and practically useful.
- Always include approximate rupee (₹) estimates when mentioning costs.
- Do NOT use <think> tags or internal reasoning in your response. Respond directly.`;

    const messages = [
      { role: "system", content: systemInstruction },
    ];

    // Append conversation history if provided
    if (Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({
            role: msg.role,
            content: String(msg.content).slice(0, 1000),
          });
        }
      }
    }

    messages.push({ role: "user", content: cleanPrompt });

    // 5. Call Groq Cloud API with candidate model rotation
    const candidateModels = [
      "openai/gpt-oss-120b",
      "qwen/qwen3.6-27b",
      "qwen/qwen3.8-27b",
    ];

    let aiResponseContent: string | null = null;
    let selectedModel = candidateModels[0];

    for (const model of candidateModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const groqResponse = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model,
              messages,
              temperature: 0.7,
              max_tokens: 800,
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!groqResponse.ok) {
          const errorText = await groqResponse.text();
          console.warn(
            `[Go-Bharat AI Guide] Groq model ${model} returned ${groqResponse.status}:`,
            errorText.slice(0, 150)
          );
          continue; // Try next candidate
        }

        const groqData = await groqResponse.json();
        let content = groqData?.choices?.[0]?.message?.content;

        if (content && content.trim().length > 5) {
          // Strip <think>...</think> tags if present
          const thinkEnd = content.indexOf("</think>");
          if (thinkEnd !== -1) {
            content = content.substring(thinkEnd + 8).trim();
          }
          aiResponseContent = content;
          selectedModel = model;
          break;
        }
      } catch (err: any) {
        console.warn(`[Go-Bharat AI Guide] Error on model ${model}:`, err?.message || err);
      }
    }

    if (aiResponseContent) {
      return NextResponse.json({
        success: true,
        message: aiResponseContent,
        model: selectedModel,
      });
    }

    // Graceful error fallback response if all models fail
    const randomTip =
      FALLBACK_TRAVEL_TIPS[
        Math.floor(Math.random() * FALLBACK_TRAVEL_TIPS.length)
      ];
    return NextResponse.json({
      success: true,
      message: `The live AI service is momentarily busy. Here is an expert Go-Bharat recommendation:\n\n${randomTip}`,
      isFallback: true,
      errorNotice: "Groq upstream temporary rate limit",
    });

  } catch (error: any) {
    console.error("[Go-Bharat AI Guide] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Unable to connect to the AI travel guide. Please try again later.",
      },
      { status: 500 }
    );
  }
}
