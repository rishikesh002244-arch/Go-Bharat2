import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Food from "@/models/Food";
import { sampleFood } from "@/lib/sample-data";
import { buildLocationOrFilter, matchesLocation } from "@/lib/locations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const region = searchParams.get("region");
    const search = searchParams.get("search");
    const location = searchParams.get("location");

    const mongooseConn = await connectToDatabase();

    if (mongooseConn) {
      const count = await Food.countDocuments();
      if (count === 0) {
        console.log("[Go-Bharat] Auto-seeding Food collection...");
        await Food.insertMany(sampleFood);
      }

      const query: Record<string, unknown> = {};
      if (type && type !== "All") {
        query.type = type;
      }
      if (region && region !== "All") {
        query.region = region;
      }
      if (location) {
        const locFilter = buildLocationOrFilter(location, [
          "state",
          "famousIn",
          "name",
          "description",
        ]);
        if (locFilter) Object.assign(query, locFilter);
      }
      if (search) {
        query.$or = [
          { name: new RegExp(search, "i") },
          { state: new RegExp(search, "i") },
          { famousIn: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
        ];
      }

      const foods = await Food.find(query).lean();
      return NextResponse.json({
        success: true,
        count: foods.length,
        data: foods,
      });
    }

    let filtered = [...sampleFood];
    if (type && type !== "All") {
      filtered = filtered.filter((f) => f.type === type);
    }
    if (region && region !== "All") {
      filtered = filtered.filter((f) => f.region === region);
    }
    if (location) {
      filtered = filtered.filter((f) =>
        matchesLocation(location, [f.state, f.famousIn, f.name, f.description])
      );
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.state.toLowerCase().includes(q) ||
          f.famousIn.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("[Food API Error]:", error);
    return NextResponse.json({
      success: true,
      data: sampleFood,
      isFallback: true,
      errorNotice: "Serving cached culinary data",
    });
  }
}
