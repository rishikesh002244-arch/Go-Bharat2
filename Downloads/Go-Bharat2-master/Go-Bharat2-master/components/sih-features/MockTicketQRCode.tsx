"use client";

import { useState } from "react";
import QRCode from "qrcode";

type Ticket = {
  ticketId: string;
  qrPayload: string;
  issuedAt: string;
};

export default function MockTicketQRCode({
  placeId,
  placeName,
}: {
  placeId: string;
  placeName: string;
}) {
  const [visitorName, setVisitorName] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const issueTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/sih/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId, placeName, visitorName, visitDate }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not issue the demo ticket.");

      const nextTicket = data.data as Ticket;
      const image = await QRCode.toDataURL(nextTicket.qrPayload, {
        width: 220,
        margin: 1,
        errorCorrectionLevel: "M",
        color: { dark: "#14213d", light: "#ffffff" },
      });
      setTicket(nextTicket);
      setQrImage(image);
    } catch (ticketError) {
      setError(ticketError instanceof Error ? ticketError.message : "Could not issue the demo ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-xs font-black text-indigo-800 transition hover:bg-indigo-100"
      >
        🎟️ {isOpen ? "Close smart ticket" : "Get demo smart ticket"}
      </button>

      {isOpen && (
        <div className="mt-3 rounded-2xl border border-indigo-100 bg-white p-4">
          {ticket && qrImage ? (
            <div className="text-center">
              <img src={qrImage} alt={`Mock QR ticket ${ticket.ticketId}`} className="mx-auto h-44 w-44 rounded-xl border border-gray-100" />
              <p className="mt-3 text-xs font-black text-gray-900">{ticket.ticketId}</p>
              <p className="mt-1 text-[11px] text-gray-500">Demo ticket for {placeName}. QR is generated locally.</p>
              <button type="button" onClick={() => setTicket(null)} className="mt-3 text-xs font-bold text-indigo-700 hover:underline">Issue another ticket</button>
            </div>
          ) : (
            <form onSubmit={issueTicket} className="space-y-2.5">
              <p className="text-xs font-bold text-gray-700">Generate a mock QR ticket for a timed visit.</p>
              <input value={visitorName} onChange={(event) => setVisitorName(event.target.value)} required maxLength={80} placeholder="Visitor name" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-400" />
              <input value={visitDate} onChange={(event) => setVisitDate(event.target.value)} required type="date" min={new Date().toISOString().slice(0, 10)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-400" />
              {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
              <button disabled={loading} className="w-full rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-black text-white disabled:opacity-60">{loading ? "Generating…" : "Generate QR ticket"}</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
