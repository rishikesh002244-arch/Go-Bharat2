"use client";

import { useState } from "react";
import { getCurrentCoordinates } from "./geolocation";

type EmergencyResult = {
  nearestPoliceStation: { name: string; phone: string; distanceKm: number };
  nearestHospital: { name: string; phone: string; distanceKm: number };
  disclaimer: string;
};

export default function SOSFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmergencyResult | null>(null);
  const [error, setError] = useState("");

  const requestHelp = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const coordinates = await getCurrentCoordinates();
      const response = await fetch("/api/sih/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coordinates),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not find nearby help.");
      setResult(data.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not request assistance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {isOpen && (
        <aside className="w-[min(22rem,calc(100vw-2.5rem))] rounded-3xl border border-red-200 bg-white p-5 shadow-2xl" aria-live="polite">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">Safety SOS</p>
              <h2 className="mt-1 text-lg font-black text-gray-900">Need urgent help?</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full bg-gray-100 px-2.5 py-1 text-sm font-bold" aria-label="Close safety panel">✕</button>
          </div>

          <p className="mt-2 text-sm leading-5 text-gray-600">
            Share your device location only to find mock nearby help. For a real emergency, call 112 immediately.
          </p>

          <div className="mt-4 flex gap-2">
            <a href="tel:112" className="flex-1 rounded-xl bg-red-600 px-3 py-3 text-center text-sm font-black text-white">Call 112</a>
            <button onClick={requestHelp} disabled={loading} className="flex-1 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-black text-red-700 disabled:opacity-60">
              {loading ? "Locating…" : "Find nearby help"}
            </button>
          </div>

          {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</p>}
          {result && (
            <div className="mt-3 space-y-2 text-sm">
              <a href={`tel:${result.nearestPoliceStation.phone}`} className="block rounded-xl bg-blue-50 p-3 text-blue-950">
                <strong>👮 {result.nearestPoliceStation.name}</strong><br />
                {result.nearestPoliceStation.distanceKm} km away · Call {result.nearestPoliceStation.phone}
              </a>
              <a href={`tel:${result.nearestHospital.phone}`} className="block rounded-xl bg-emerald-50 p-3 text-emerald-950">
                <strong>🏥 {result.nearestHospital.name}</strong><br />
                {result.nearestHospital.distanceKm} km away · Call {result.nearestHospital.phone}
              </a>
              <p className="px-1 text-[11px] text-gray-500">{result.disclaimer}</p>
            </div>
          )}
        </aside>
      )}

      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-red-600 text-sm font-black text-white shadow-xl shadow-red-600/40 transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
        aria-expanded={isOpen}
        aria-label="Open emergency SOS"
      >
        SOS
      </button>
    </div>
  );
}
