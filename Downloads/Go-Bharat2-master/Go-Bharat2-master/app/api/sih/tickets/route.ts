import { NextResponse } from "next/server";
import {
  createMockTicket,
  isValidMockTicketInput,
} from "@/routes/sih/tickets";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isValidMockTicketInput(body)) {
      return NextResponse.json(
        { success: false, error: "Place, visitor name, and a valid visit date are required." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: createMockTicket(body) });
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not issue the mock ticket." },
      { status: 400 }
    );
  }
}
