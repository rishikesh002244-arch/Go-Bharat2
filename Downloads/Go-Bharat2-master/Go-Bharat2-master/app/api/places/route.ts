import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Place from "@/models/Place";
import { samplePlaces } from "@/lib/sample-data";
import { buildLocationOrFilter, matchesLocation } from "@/lib/locations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const state = searchParams.get("state");
    const location = searchParams.get("location");

    const mongooseConn = await connectToDatabase();

    if (mongooseConn) {
      const count = await Place.countDocuments();
      if (count === 0) {
        console.log("[Go-Bharat] Auto-seeding Places collection...");
        await Place.insertMany(samplePlaces);
      }

      const query: Record<string, unknown> = {};
      if (category && category !== "All") {
        query.category = category;
      }
      if (state) {
        query.state = new RegExp(state, "i");
      }
      if (location) {
        const locFilter = buildLocationOrFilter(location, [
          "name",
          "state",
          "region",
          "description",
        ]);
        if (locFilter) Object.assign(query, locFilter);
      }
      if (search) {
        query.$or = [
          { name: new RegExp(search, "i") },
          { state: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
        ];
      }

      const places = await Place.find(query).sort({ rating: -1 }).lean();
      return NextResponse.json({
        success: true,
        count: places.length,
        data: places,
      });
    }

    let filtered = [...samplePlaces];
    if (category && category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (state) {
      filtered = filtered.filter((p) =>
        p.state.toLowerCase().includes(state.toLowerCase())
      );
    }
    if (location) {
      filtered = filtered.filter((p) =>
        matchesLocation(location, [p.name, p.state, p.region, p.description])
      );
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("[Places API Error]:", error);
    return NextResponse.json({
      success: true,
      data: samplePlaces,
      isFallback: true,
      errorNotice: "Serving cached catalog data",
    });
  }
}
