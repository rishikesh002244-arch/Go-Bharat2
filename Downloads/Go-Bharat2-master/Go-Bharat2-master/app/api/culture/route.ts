import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Culture from "@/models/Culture";
import { sampleCulture } from "@/lib/sample-data";
import { buildLocationOrFilter, matchesLocation } from "@/lib/locations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const state = searchParams.get("state");
    const search = searchParams.get("search");
    const location = searchParams.get("location");

    const mongooseConn = await connectToDatabase();

    if (mongooseConn) {
      const count = await Culture.countDocuments();
      if (count === 0) {
        console.log("[Go-Bharat] Auto-seeding Culture collection...");
        await Culture.insertMany(sampleCulture);
      }

      const query: Record<string, unknown> = {};
      if (type && type !== "All") {
        query.type = type;
      }
      if (state) {
        query.state = new RegExp(state, "i");
      }
      if (location) {
        const locFilter = buildLocationOrFilter(location, [
          "state",
          "region",
          "title",
          "description",
          "significance",
        ]);
        if (locFilter) Object.assign(query, locFilter);
      }
      if (search) {
        query.$or = [
          { title: new RegExp(search, "i") },
          { state: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
          { significance: new RegExp(search, "i") },
        ];
      }

      const cultures = await Culture.find(query).lean();
      return NextResponse.json({
        success: true,
        count: cultures.length,
        data: cultures,
      });
    }

    let filtered = [...sampleCulture];
    if (type && type !== "All") {
      filtered = filtered.filter((c) => c.type === type);
    }
    if (state) {
      filtered = filtered.filter((c) =>
        c.state.toLowerCase().includes(state.toLowerCase())
      );
    }
    if (location) {
      filtered = filtered.filter((c) =>
        matchesLocation(location, [
          c.state,
          c.region,
          c.title,
          c.description,
          c.significance,
        ])
      );
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.significance.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("[Culture API Error]:", error);
    return NextResponse.json({
      success: true,
      data: sampleCulture,
      isFallback: true,
      errorNotice: "Serving cached heritage data",
    });
  }
}
