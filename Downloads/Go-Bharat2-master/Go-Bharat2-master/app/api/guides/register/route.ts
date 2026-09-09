import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Guide from "@/models/Guide";
import { inMemoryGuides, GuideItem } from "@/lib/sample-data";
import {
  getLocationBySlug,
  isValidGuideLicenseFormat,
  slugifyLocation,
} from "@/lib/locations";

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const name = String(body.name || "").trim();
    const locationInput = String(body.location || "").trim();
    const govtLicenseId = String(body.govtLicenseId || "").trim().toUpperCase();
    const contact = String(body.contact || "").trim();
    const bio = String(body.bio || "").trim();
    const profileImage = String(body.profileImage || "").trim();
    const experienceYears = Number(body.experienceYears) || 1;

    let languages: string[] = ["Hindi", "English"];
    if (Array.isArray(body.languages)) {
      languages = body.languages.map(String).filter(Boolean);
    } else if (typeof body.languages === "string" && body.languages.trim()) {
      languages = body.languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);
    }

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name." },
        { status: 400 }
      );
    }
    if (!locationInput) {
      return NextResponse.json(
        { success: false, error: "Please select or enter your location." },
        { status: 400 }
      );
    }
    if (!govtLicenseId) {
      return NextResponse.json(
        { success: false, error: "Government license ID is required." },
        { status: 400 }
      );
    }
    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact email or phone is required." },
        { status: 400 }
      );
    }

    const licenseFormatValid = isValidGuideLicenseFormat(govtLicenseId);
    if (!licenseFormatValid) {
      return NextResponse.json(
        {
          success: false,
          error:
            "License ID format looks invalid. Use an alphanumeric ID (6–24 chars), e.g. MOT-HP-2024-1234.",
        },
        { status: 400 }
      );
    }

    const known = getLocationBySlug(slugifyLocation(locationInput));
    const location = known?.name || locationInput;
    const locationSlug = known?.slug || slugifyLocation(locationInput);

    const payload = {
      name,
      location,
      locationSlug,
      languages,
      govtLicenseId,
      licenseFormatValid,
      isVerified: false,
      status: "pending" as const,
      profileImage,
      bio,
      contact,
      experienceYears: Math.min(50, Math.max(0, experienceYears)),
    };

    const mongooseConn = await connectToDatabase();

    if (mongooseConn) {
      const existing = await Guide.findOne({ govtLicenseId });
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: "A guide with this license ID is already registered.",
          },
          { status: 409 }
        );
      }

      const guide = await Guide.create(payload);
      return NextResponse.json(
        {
          success: true,
          message:
            "Application submitted. An admin will verify your license and approve your profile.",
          data: guide,
        },
        { status: 201 }
      );
    }

    if (inMemoryGuides.some((g) => g.govtLicenseId === govtLicenseId)) {
      return NextResponse.json(
        {
          success: false,
          error: "A guide with this license ID is already registered.",
        },
        { status: 409 }
      );
    }

    const memoryGuide: GuideItem = {
      ...payload,
      _id: `mem-guide-${Date.now()}`,
      createdAt: new Date(),
    };
    inMemoryGuides.push(memoryGuide);

    return NextResponse.json(
      {
        success: true,
        message:
          "Application submitted (preview mode). An admin can verify it from the dashboard.",
        data: memoryGuide,
        isFallback: true,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[Guide Register Error]:", error);
    const message =
      error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
