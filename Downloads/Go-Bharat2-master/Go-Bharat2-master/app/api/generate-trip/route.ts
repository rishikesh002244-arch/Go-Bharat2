import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const geminiApiKey = process.env.GEMINI_API_KEY;
const groqApiKey = process.env.GROK_API_KEY; // User's Groq Cloud key (gsk_...)
const GROQ_MODEL = "qwen/qwen3.8-27b"; // Best available on user's Groq plan

export async function POST(request: Request) {
  try {
    // Check that at least one API key is available
    if (!geminiApiKey && !groqApiKey) {
      console.error("No AI API keys configured.");
      return NextResponse.json(
        {
          error:
            "No AI API keys configured. Add GEMINI_API_KEY or GROK_API_KEY to your .env.local file.",
        },
        { status: 500 }
      );
    }

    // Read request
    const data = await request.json();

    const {
      destination,
      startingFrom,
      startDate,
      endDate,
      travelers,
      budget,
      interests,
      transport,
    } = data;

    // Validate destination
    if (!destination || destination.trim() === "") {
      return NextResponse.json(
        {
          error: "Destination is required.",
        },
        { status: 400 }
      );
    }

    // Validate dates
    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          error: "Start date and end date are required.",
        },
        { status: 400 }
      );
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return NextResponse.json(
        {
          error: "Invalid travel dates.",
        },
        { status: 400 }
      );
    }

    const difference =
      end.getTime() - start.getTime();

    const days =
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ) + 1;

    if (days <= 0) {
      return NextResponse.json(
        {
          error:
            "End date must be after or equal to start date.",
        },
        { status: 400 }
      );
    }

    // Interests
    const interestText =
      Array.isArray(interests) && interests.length > 0
        ? interests.join(", ")
        : "General sightseeing";

    // Travellers
    const travelerType =
      travelers || "Solo";

    // Budget
    const budgetType =
      budget || "Moderate";

    // Transport
    const transportType =
      transport || "Any / Let AI decide";

    // ================================
    // AI PROMPT
    // ================================

    const prompt = `
You are Go-Bharat, an expert AI travel planner specializing in
TRAVEL ACROSS THE ENTIRE COUNTRY OF INDIA.

Your job is to create a practical, personalized and realistic
travel itinerary for destinations anywhere in India.

==================================================
DESTINATION COVERAGE
==================================================

You must support destinations across:

- Andhra Pradesh
- Arunachal Pradesh
- Assam
- Bihar
- Chhattisgarh
- Goa
- Gujarat
- Haryana
- Himachal Pradesh
- Jharkhand
- Karnataka
- Kerala
- Madhya Pradesh
- Maharashtra
- Manipur
- Meghalaya
- Mizoram
- Nagaland
- Odisha
- Punjab
- Rajasthan
- Sikkim
- Tamil Nadu
- Telangana
- Tripura
- Uttar Pradesh
- Uttarakhand
- West Bengal

Also support:

- Jammu & Kashmir
- Ladakh
- Delhi
- Chandigarh
- Puducherry
- Andaman and Nicobar Islands
- Lakshadweep
- Other Union Territories and regions of India

The user is NOT restricted to a predefined destination list.

Support:

- Major cities
- Small cities
- Towns
- Districts
- Hill stations
- Beaches
- Wildlife destinations
- National parks
- Tiger reserves
- Heritage destinations
- Historical destinations
- Religious destinations
- Spiritual destinations
- Cultural destinations
- Food destinations
- Adventure destinations
- Shopping destinations
- Rural destinations
- Offbeat destinations
- Lesser-known destinations
- Himalayan destinations
- Northeast destinations
- Coastal destinations
- Desert destinations
- Forest destinations
- Island destinations

==================================================
LESSER-KNOWN DESTINATIONS
==================================================

If the user enters a lesser-known Indian destination:

1. Do NOT simply say that the destination is unsupported.
2. Try to identify the destination and its state/region.
3. Use known attractions in or near the destination.
4. Include nearby towns or attractions when appropriate.
5. Consider realistic transportation.
6. Consider the distance between locations.
7. Clearly mention assumptions if the exact location is ambiguous.
8. Do not invent attractions.
9. Do not invent hotels.
10. Do not invent live booking information.

If the exact destination is unclear but there is a likely interpretation,
use the most reasonable interpretation and mention the assumption in
the summary.

==================================================
TRIP DETAILS
==================================================

Destination:
${destination}

Starting From:
${startingFrom || "Not specified"}

Start Date:
${startDate}

End Date:
${endDate}

Number of Days:
${days}

Travelling With:
${travelerType}

Budget Category:
${budgetType}

Interests:
${interestText}

Preferred Transport:
${transportType}

==================================================
ITINERARY RULES
==================================================

Create a practical itinerary that a real traveller could follow.

1. Create a day-by-day itinerary.

2. Do not overcrowd the itinerary.

3. Consider realistic travel time between locations.

4. Group geographically close attractions together.

5. Consider the user's starting location.

6. Consider the number of available days.

7. Respect the user's selected budget.

8. Match activities with the user's interests.

9. Include famous attractions when appropriate.

10. Include lesser-known local experiences when appropriate.

11. Include authentic regional food.

12. Recommend local dishes specific to the destination whenever
    reasonably known.

13. Suggest realistic transportation options.

14. If transport is set to "Any / Let AI decide", choose the most
    practical transportation based on distance and budget.

15. Include approximate costs.

16. Do NOT claim that prices are live.

17. Do NOT claim live hotel availability.

18. Do NOT invent exact hotel prices.

19. Do NOT invent attractions.

20. Avoid unnecessary long-distance travel in one day.

21. Consider practical sightseeing order.

22. For remote destinations, mention important travel considerations.

23. If the destination has limited attractions, include suitable nearby
    attractions rather than repeating the same attraction.

24. If the destination is a region rather than a city, create a regional
    itinerary.

25. If multiple destinations are entered, create a logical travel route.

26. Make the itinerary suitable for the selected traveller type.

27. Make suggestions appropriate for Solo, Couple, Family or Friends.

28. For families, avoid unnecessarily difficult activities.

29. For couples, include suitable scenic and relaxing experiences.

30. For friends, include suitable adventure, nightlife or group
    experiences when appropriate.

31. For solo travellers, consider safety and convenient transportation.

==================================================
BUDGET RULES
==================================================

Create an approximate trip budget.

Break it into:

- Transport
- Stay
- Food
- Activities

Respect the selected budget category:

Budget:
₹5,000 – ₹15,000

Moderate:
₹15,000 – ₹40,000

Luxury:
₹40,000+

IMPORTANT:

These are approximate estimates only.

Do NOT pretend that they are live prices.

==================================================
SAFETY AND ACCURACY
==================================================

Never invent:

- Hotels
- Attractions
- Prices
- Opening hours
- Events
- Transport schedules
- Booking availability

When uncertain, give a reasonable general recommendation instead.

For remote areas, mention that travellers should verify local
transportation and weather conditions before travelling.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Do NOT use Markdown.

Do NOT use a code block.

Do NOT add explanations outside the JSON.

Return EXACTLY this structure:

{
  "tripTitle": "string",

  "destination": "string",

  "summary": "string",

  "estimatedBudget": {
    "total": "string",
    "transport": "string",
    "stay": "string",
    "food": "string",
    "activities": "string"
  },

  "days": [
    {
      "day": 1,
      "title": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string",
      "food": "string",
      "estimatedCost": "string"
    }
  ],

  "travelTips": [
    "string",
    "string",
    "string",
    "string",
    "string"
  ]
}

IMPORTANT:

The "days" array MUST contain exactly ${days} day objects.

The day numbers MUST start at 1 and continue sequentially until ${days}.

Example for a 3-day trip:

"days": [
  {
    "day": 1,
    ...
  },
  {
    "day": 2,
    ...
  },
  {
    "day": 3,
    ...
  }
]

Return ONLY the JSON object.
`;

    console.log(
      "======================================"
    );
    console.log(
      "Generating Go-Bharat trip..."
    );
    console.log("Destination:", destination);
    console.log("Days:", days);

    // ================================
    // ATTEMPT 1: GEMINI (Primary)
    // ================================

    let output: string | null = null;
    let usedProvider = "unknown";

    if (geminiApiKey) {
      try {
        console.log("[Gemini] Requesting itinerary with gemini-3.7-flash...");

        const ai = new GoogleGenAI({
          apiKey: geminiApiKey,
        });

        // Set an explicit timeout to prevent hanging requests
        const geminiPromise = ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        // 25s timeout for Gemini
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini request timed out after 25s")), 25000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const text = response?.text;

        if (text && text.trim().length > 10) {
          output = text;
          usedProvider = "gemini";
          console.log("[Gemini] Response received successfully.");
        } else {
          console.warn("[Gemini] Empty or too-short response. Falling back to Groq...");
        }
      } catch (geminiError: any) {
        const statusCode =
          geminiError?.status ||
          geminiError?.statusCode ||
          geminiError?.code;
        const message =
          geminiError?.message || String(geminiError);

        console.warn(
          `[Gemini] Error encountered (${statusCode || "unknown"}): ${message}. Triggering instant Groq fallback...`
        );
        // Do not block user with slow retries when Gemini is in 503 high demand
      }
    } else {
      console.log(
        "[Gemini] No GEMINI_API_KEY configured. Proceeding directly to Groq."
      );
    }

    // ================================
    // ATTEMPT 2: GROQ CLOUD (Fallback)
    // ================================

    if (!output && groqApiKey) {
      const candidateModels = [
        "openai/gpt-oss-120b",
        "qwen/qwen3.8-27b",
        "qwen/qwen3.6-27b",
      ];

      for (const modelName of candidateModels) {
        try {
          console.log(
            `[Groq Fallback] Calling Groq Cloud with model ${modelName}...`
          );

          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            45000
          ); // 45s timeout

          const groqResponse = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${groqApiKey}`,
              },
              body: JSON.stringify({
                model: modelName,
                messages: [
                  {
                    role: "system",
                    content:
                      "You are Go-Bharat, an expert AI travel planner for India. You MUST respond with valid JSON only, no markdown code block, no backticks, no reasoning tags, no explanation outside JSON.",
                  },
                  {
                    role: "user",
                    content: prompt,
                  },
                ],
                temperature: 0.6,
                max_tokens: 4096,
              }),
              signal: controller.signal,
            }
          );

          clearTimeout(timeoutId);

          if (!groqResponse.ok) {
            const errBody = await groqResponse.text();
            console.warn(
              `[Groq Fallback] Model ${modelName} returned HTTP ${groqResponse.status}:`,
              errBody.slice(0, 150)
            );
            // If 429 rate limit or error, continue to next candidate model
            continue;
          }

          const groqData = await groqResponse.json();
          const groqContent =
            groqData?.choices?.[0]?.message?.content;

          if (
            groqContent &&
            groqContent.trim().length > 10
          ) {
            // Clean output: strip think tags and markdown fences
            let clean = groqContent;
            const thinkEnd = clean.indexOf("</think>");
            if (thinkEnd !== -1) {
              clean = clean.substring(thinkEnd + 8).trim();
            }
            output = clean
              .replace(/^```json\s*/i, "")
              .replace(/^```\s*/i, "")
              .replace(/\s*```$/i, "")
              .trim();
            usedProvider = `groq (${modelName})`;
            console.log(
              `[Groq Fallback] Response received successfully via ${modelName}.`
            );
            break; // Success!
          }
        } catch (groqError: any) {
          console.warn(
            `[Groq Fallback] Error with model ${modelName}:`,
            groqError?.message || groqError
          );
        }
      }
    }

    // ================================
    // FAILSAFE: EMERGENCY ITINERARY IF BOTH FAIL
    // ================================

    let itinerary: any;

    if (!output) {
      console.warn(
        "Both Gemini and Groq upstream calls were unavailable. Generating curated emergency itinerary..."
      );

      const daysArray = [];
      const budgetMultipliers: Record<string, number> = {
        Budget: 1500,
        Moderate: 3500,
        Luxury: 8000,
      };
      const dailyRate = budgetMultipliers[budgetType] || 3500;
      const totalBudget = dailyRate * days;

      for (let d = 1; d <= days; d++) {
        daysArray.push({
          day: d,
          title: `Day ${d}: Exploring ${destination} - Highlights & Culture`,
          morning: `Begin Day ${d} with an early morning visit to prominent heritage and spiritual sites around ${destination}. Enjoy a traditional local breakfast at a popular regional eatery.`,
          afternoon: `Spend the afternoon discovering local artisan markets, museums, and historical landmarks. Experience regional lunch specialties recommended by locals.`,
          evening: `Unwind with a sunset view at a scenic overlook or bustling local promenade in ${destination}, followed by dinner sampling authentic culinary traditions.`,
          food: `Authentic regional cuisine of ${destination}, including fresh local specialties and traditional teas.`,
          estimatedCost: `₹${dailyRate}`,
        });
      }

      itinerary = {
        tripTitle: `${days}-Day Curated Discovery of ${destination}`,
        destination: destination,
        summary: `A carefully designed ${days}-day itinerary for ${destination}, tailored for ${travelerType} travelers with a ${budgetType.toLowerCase()} budget focusing on ${interestText}. Includes top local highlights, cultural immersion, and regional gastronomy.`,
        estimatedBudget: {
          total: `₹${totalBudget.toLocaleString("en-IN")}`,
          transport: `₹${Math.round(totalBudget * 0.3).toLocaleString("en-IN")}`,
          stay: `₹${Math.round(totalBudget * 0.4).toLocaleString("en-IN")}`,
          food: `₹${Math.round(totalBudget * 0.2).toLocaleString("en-IN")}`,
          activities: `₹${Math.round(totalBudget * 0.1).toLocaleString("en-IN")}`,
        },
        days: daysArray,
        travelTips: [
          `Carry a valid government ID for entry to historical and cultural monuments in ${destination}.`,
          `Hire certified local guides or download official audio guides for authentic heritage insights.`,
          `Respect local customs and dress modestly when visiting temples and spiritual sanctuaries.`,
          `Keep cash handy as small vendors and auto-rickshaws often prefer UPI or cash over cards.`,
          `Stay hydrated and sample street food from high-turnover stalls frequented by families.`,
        ],
      };

      return NextResponse.json({
        success: true,
        itinerary,
        provider: "curated-emergency-fallback",
      });
    }

    // ================================
    // PARSE JSON
    // ================================

    // itinerary already declared above

    try {
      // Handle potential <think>...</think> tags from some models
      let cleanOutput = output;
      const thinkEnd = cleanOutput.indexOf("</think>");
      if (thinkEnd !== -1) {
        cleanOutput = cleanOutput.substring(thinkEnd + 8).trim();
      }
      // Strip any remaining markdown fences
      cleanOutput = cleanOutput
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      itinerary = JSON.parse(cleanOutput);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error(
        "Raw AI output (first 500 chars):",
        output.substring(0, 500)
      );

      return NextResponse.json(
        {
          error:
            "AI returned an invalid itinerary format. Please try again.",
        },
        { status: 500 }
      );
    }

    // ================================
    // BASIC VALIDATION
    // ================================

    if (!itinerary.tripTitle) {
      return NextResponse.json(
        {
          error: "AI generated an incomplete itinerary.",
        },
        { status: 500 }
      );
    }

    if (!Array.isArray(itinerary.days)) {
      return NextResponse.json(
        {
          error: "AI generated an invalid itinerary.",
        },
        { status: 500 }
      );
    }

    // ================================
    // SUCCESS
    // ================================

    console.log(
      `Trip generated successfully via ${usedProvider}!`
    );
    console.log(
      "======================================"
    );

    return NextResponse.json({
      success: true,
      itinerary,
      provider: usedProvider,
    });
  } catch (error: any) {
    console.error(
      "======================================"
    );
    console.error("TRIP GENERATION ERROR");
    console.error(error);
    console.error(
      "======================================"
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to generate your trip. Please try again.",
      },
      { status: 500 }
    );
  }
}