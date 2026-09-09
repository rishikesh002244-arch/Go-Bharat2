import { NextResponse } from "next/server";
import { listMarketplaceProducts } from "@/routes/sih/marketplace";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { products, isFallback } = await listMarketplaceProducts(
      searchParams.get("search") || undefined
    );

    return NextResponse.json({
      success: true,
      data: products,
      isFallback,
    });
  } catch (error) {
    console.error("[SIH Marketplace] Failed to load products", error);
    return NextResponse.json(
      { success: false, error: "Could not load local artisan goods." },
      { status: 500 }
    );
  }
}
