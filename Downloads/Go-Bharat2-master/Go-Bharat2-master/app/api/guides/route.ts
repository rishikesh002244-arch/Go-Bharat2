import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Guide from "@/models/Guide";
import { inMemoryGuides } from "@/lib/sample-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const verifiedOnly = searchParams.get("verified") !== "false";
    const status = searchParams.get("status");

    const mongooseConn = await connectToDatabase();

    if (mongooseConn) {
      const query: Record<string, unknown> = {};

      if (status) {
        query.status = status;
      } else if (verifiedOnly) {
        query.isVerified = true;
        query.status = "verified";
      }

      if (location) {
        query.locationSlug = location.toLowerCase();
      }

      const guides = await Guide.find(query).sort({ createdAt: -1 }).lean();
      return NextResponse.json({
        success: true,
        count: guides.length,
        data: guides,
      });
    }

    let filtered = [...inMemoryGuides];
    if (status) {
      filtered = filtered.filter((g) => g.status === status);
    } else if (verifiedOnly) {
      filtered = filtered.filter((g) => g.isVerified && g.status === "verified");
    }
    if (location) {
      filtered = filtered.filter(
        (g) => g.locationSlug === location.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("[Guides API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch guides" },
      { status: 500 }
    );
  }
}
