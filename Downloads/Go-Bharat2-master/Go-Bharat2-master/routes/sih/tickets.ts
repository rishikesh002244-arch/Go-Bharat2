export type MockTicketInput = {
  placeId: string;
  placeName: string;
  visitorName: string;
  visitDate: string;
};

export type MockTicket = {
  ticketId: string;
  qrPayload: string;
  issuedAt: string;
  status: "demo-issued";
};

export function createMockTicket(input: MockTicketInput): MockTicket {
  const issuedAt = new Date().toISOString();
  const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ticketId = `SIH-${Date.now().toString(36).toUpperCase()}-${entropy}`;
  const safePlaceId = input.placeId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);

  return {
    ticketId,
    qrPayload: `GO-BHARAT|${ticketId}|${safePlaceId}|${input.visitDate}|DEMO`,
    issuedAt,
    status: "demo-issued",
  };
}

export function isValidMockTicketInput(value: unknown): value is MockTicketInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<MockTicketInput>;
  return (
    typeof input.placeId === "string" &&
    input.placeId.trim().length > 0 &&
    typeof input.placeName === "string" &&
    input.placeName.trim().length > 0 &&
    typeof input.visitorName === "string" &&
    input.visitorName.trim().length > 0 &&
    typeof input.visitDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(input.visitDate)
  );
}
