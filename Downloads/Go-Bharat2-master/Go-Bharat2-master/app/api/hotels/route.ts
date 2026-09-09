import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import { sampleHotels } from "@/lib/sample-data";
import { buildLocationOrFilter, matchesLocation } from "@/lib/locations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const budget = searchParams.get("budget");
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const location = searchParams.get("location");

    const mongooseConn = await connectToDatabase();

    if (mongooseConn) {
      const count = await Hotel.countDocuments();
      if (count === 0) {
        console.log("[Go-Bharat] Auto-seeding Hotels collection...");
        await Hotel.insertMany(sampleHotels);
      }

      const query: Record<string, unknown> = {};
      if (budget && budget !== "All") {
        query.budgetTier = budget;
      }
      if (city) {
        query.destination = new RegExp(city, "i");
      }
      if (location) {
        const locFilter = buildLocationOrFilter(location, [
          "destination",
          "state",
          "name",
          "address",
        ]);
        if (locFilter) Object.assign(query, locFilter);
      }
      if (search) {
        query.$or = [
          { name: new RegExp(search, "i") },
          { destination: new RegExp(search, "i") },
          { state: new RegExp(search, "i") },
        ];
      }

      const hotels = await Hotel.find(query).sort({ rating: -1 }).lean();
      return NextResponse.json({
        success: true,
        count: hotels.length,
        data: hotels,
      });
    }

    let filtered = [...sampleHotels];
    if (budget && budget !== "All") {
      filtered = filtered.filter((h) => h.budgetTier === budget);
    }
    if (city) {
      filtered = filtered.filter((h) =>
        h.destination.toLowerCase().includes(city.toLowerCase())
      );
    }
    if (location) {
      filtered = filtered.filter((h) =>
        matchesLocation(location, [
          h.destination,
          h.state,
          h.name,
          h.address,
        ])
      );
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.destination.toLowerCase().includes(q) ||
          h.state.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("[Hotels API Error]:", error);
    return NextResponse.json({
      success: true,
      data: sampleHotels,
      isFallback: true,
      errorNotice: "Serving cached catalog data",
    });
  }
}
