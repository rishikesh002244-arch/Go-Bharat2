import { NextResponse } from "next/server";
import {
  findNearestEmergencyFacilities,
  isValidCoordinates,
} from "@/routes/sih/emergency";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isValidCoordinates(body)) {
      return NextResponse.json(
        { success: false, error: "Valid latitude and longitude are required." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: findNearestEmergencyFacilities(body),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to process the emergency request." },
      { status: 400 }
    );
  }
}
