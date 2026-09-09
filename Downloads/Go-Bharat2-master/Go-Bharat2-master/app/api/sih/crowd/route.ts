import { NextResponse } from "next/server";
import { getCrowdDensity } from "@/routes/sih/crowd";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId")?.trim();

  if (!locationId || !/^[a-zA-Z0-9_-]{1,100}$/.test(locationId)) {
    return NextResponse.json(
      { success: false, error: "A valid locationId is required." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data: getCrowdDensity(locationId) });
}
