"use client";

import { useEffect, useState } from "react";

type OfflineItinerary = {
  tripTitle?: string;
  destination?: string;
  summary?: string;
  days?: Array<{ day?: number; title?: string; morning?: string; afternoon?: string; evening?: string }>;
  savedAt: string;
};

const OFFLINE_ITINERARY_KEY = "go-bharat:sih-last-itinerary";

export default function OfflineItinerarySnapshot({ currentItinerary }: { currentItinerary: unknown | null }) {
  const [snapshot, setSnapshot] = useState<OfflineItinerary | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    try {
      const stored = window.localStorage.getItem(OFFLINE_ITINERARY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as OfflineItinerary;
        timer = window.setTimeout(() => setSnapshot(parsed), 0);
      }
    } catch {
      window.localStorage.removeItem(OFFLINE_ITINERARY_KEY);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!currentItinerary) return;
    const nextSnapshot: OfflineItinerary = {
      ...(currentItinerary as Omit<OfflineItinerary, "savedAt">),
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(OFFLINE_ITINERARY_KEY, JSON.stringify(nextSnapshot));
    const timer = window.setTimeout(() => setSnapshot(nextSnapshot), 0);
    return () => window.clearTimeout(timer);
  }, [currentItinerary]);

  if (currentItinerary || !snapshot) return null;

  return (
    <section className="mx-auto mb-10 max-w-6xl rounded-3xl border border-sky-200 bg-sky-50 p-6 text-sky-950 md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Available offline</p>
      <h2 className="mt-2 text-2xl font-black">{snapshot.tripTitle || "Your last saved itinerary"}</h2>
      <p className="mt-2 text-sm leading-6">{snapshot.summary || "This itinerary was stored on this device when it was generated."}</p>
      <p className="mt-3 text-xs font-semibold text-sky-800">Saved {new Date(snapshot.savedAt).toLocaleString("en-IN")}</p>
      {snapshot.days?.length ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {snapshot.days.map((day, index) => (
            <article key={`${day.day || index}-${day.title || "day"}`} className="rounded-2xl border border-sky-100 bg-white p-4">
              <p className="text-xs font-black text-sky-700">DAY {day.day || index + 1}</p>
              <h3 className="mt-1 font-black">{day.title || "Travel day"}</h3>
              <p className="mt-2 text-sm text-gray-700">{day.morning || day.afternoon || day.evening || "Details are available in your saved plan."}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
