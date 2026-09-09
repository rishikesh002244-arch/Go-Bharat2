import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import LocationSafety from "@/models/LocationSafety";
import { sampleSafety } from "@/lib/sample-data";
import { getLocationBySlug } from "@/lib/locations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");

    if (!location) {
      return NextResponse.json(
        { success: false, error: "location query parameter is required." },
        { status: 400 }
      );
    }

    const slug = location.toLowerCase();
    const mongooseConn = await connectToDatabase();

    if (mongooseConn) {
      const count = await LocationSafety.countDocuments();
      if (count === 0) {
        console.log("[Go-Bharat] Auto-seeding LocationSafety collection...");
        await LocationSafety.insertMany(sampleSafety);
      }

      let safety = await LocationSafety.findOne({ locationSlug: slug }).lean();

      if (!safety) {
        const loc = getLocationBySlug(slug);
        if (loc) {
          safety = await LocationSafety.findOne({
            location: new RegExp(loc.name, "i"),
          }).lean();
        }
      }

      if (safety) {
        return NextResponse.json({ success: true, data: safety });
      }
    }

    const fallback =
      sampleSafety.find((s) => s.locationSlug === slug) ||
      sampleSafety.find((s) =>
        s.location.toLowerCase().includes(slug.replace(/-/g, " "))
      );

    if (!fallback) {
      return NextResponse.json({
        success: true,
        data: {
          location: getLocationBySlug(slug)?.name || location,
          locationSlug: slug,
          emergencyContacts: {
            police: "100",
            ambulance: "108",
            touristHelpline: "1363",
            fire: "101",
          },
          generalPrecautions: [
            "Keep copies of ID and hotel bookings handy.",
            "Use licensed transport and registered guides.",
            "Share your itinerary with someone you trust.",
          ],
          healthWarnings: [
            "Carry a basic first-aid kit and any personal medication.",
            "Drink bottled or purified water.",
          ],
          localScamsToAvoid: [
            "Be wary of unsolicited 'helpers' at stations and tourist spots.",
            "Agree on prices before hiring taxis or guides.",
          ],
        },
        isFallback: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: fallback,
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("[Safety API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch safety information." },
      { status: 500 }
    );
  }
}
