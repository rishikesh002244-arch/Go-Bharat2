import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Guide from "@/models/Guide";
import { inMemoryGuides } from "@/lib/sample-data";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/jwt";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    let body: { action?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const action = body.action;
    if (action !== "verify" && action !== "reject") {
      return NextResponse.json(
        { success: false, error: "Action must be 'verify' or 'reject'." },
        { status: 400 }
      );
    }

    const updates =
      action === "verify"
        ? { isVerified: true, status: "verified" as const }
        : { isVerified: false, status: "rejected" as const };

    const mongooseConn = await connectToDatabase();

    if (mongooseConn) {
      const guide = await Guide.findByIdAndUpdate(id, updates, {
        new: true,
      }).lean();

      if (!guide) {
        return NextResponse.json(
          { success: false, error: "Guide not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          action === "verify"
            ? "Guide verified successfully."
            : "Guide application rejected.",
        data: guide,
      });
    }

    const idx = inMemoryGuides.findIndex((g) => g._id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, error: "Guide not found." },
        { status: 404 }
      );
    }

    inMemoryGuides[idx] = { ...inMemoryGuides[idx], ...updates };
    return NextResponse.json({
      success: true,
      message:
        action === "verify"
          ? "Guide verified successfully."
          : "Guide application rejected.",
      data: inMemoryGuides[idx],
      isFallback: true,
    });
  } catch (error: unknown) {
    console.error("[Guide Verify Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update guide status." },
      { status: 500 }
    );
  }
}
