"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Progress = {
  points: number;
  visitedLocationIds: string[];
  badges: Array<{ code: string; name: string; description: string; icon: string; tier: "bronze" | "silver" | "gold"; earnedAt: string }>;
  lastActivityAt: string;
};

const OFFBEAT_DEMOS = [
  { id: "majuli-island", name: "Majuli, Assam", detail: "River island culture" },
  { id: "mandi-himachal", name: "Mandi, Himachal Pradesh", detail: "Temple town" },
  { id: "araku-valley", name: "Araku Valley, Andhra Pradesh", detail: "Coffee & tribal culture" },
  { id: "chettinad-tamil-nadu", name: "Chettinad, Tamil Nadu", detail: "Heritage mansions" },
  { id: "zanskar-ladakh", name: "Zanskar, Ladakh", detail: "High-altitude village" },
];

const tierStyles = {
  bronze: "border-amber-200 bg-amber-50 text-amber-950",
  silver: "border-slate-200 bg-slate-50 text-slate-950",
  gold: "border-yellow-200 bg-yellow-50 text-yellow-950",
};

export default function DigitalPassport() {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [notice, setNotice] = useState("");

  const loadProgress = async () => {
    try {
      const response = await fetch("/api/sih/progress", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not load passport.");
      setProgress(data.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load passport.");
    }
  };

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => {
      void loadProgress();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [user]);

  const recordVisit = async (locationId: string) => {
    setSavingId(locationId);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/sih/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locationId }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not record visit.");
      setProgress(data.data.progress);
      setNotice(data.data.visitRecorded ? `+100 points! ${data.data.newlyEarned.map((badge: { icon: string; name: string }) => `${badge.icon} ${badge.name}`).join(" ")}` || "Visit recorded." : "This visit is already stamped in your passport.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not record visit.");
    } finally {
      setSavingId("");
    }
  };

  if (authLoading) return <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16"><div className="h-72 animate-pulse rounded-3xl bg-gray-100" /></main>;
  if (!user) return <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-20 text-center"><p className="text-5xl">🛂</p><h1 className="mt-5 text-4xl font-black">Your Digital Passport awaits</h1><p className="mt-3 text-gray-600">Sign in to collect sustainable tourism points and offbeat-location badges.</p><Link href="/login?redirect=/passport" className="mt-7 inline-block rounded-full bg-orange-500 px-6 py-3 text-sm font-black text-white">Sign in to start collecting</Link></main>;

  const visitedIds = new Set(progress?.visitedLocationIds || []);
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:px-12">
      <section className="overflow-hidden rounded-[2rem] bg-[#14213d] p-7 text-white shadow-xl md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-300">Sustainable Tourism Passport</p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6"><div><h1 className="text-4xl font-black md:text-5xl">Namaste, {user.name.split(" ")[0]} 👋</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Choose lesser-known locations, support local communities, and collect meaningful travel milestones.</p></div><div className="rounded-2xl bg-white/10 px-6 py-4 text-center backdrop-blur"><p className="text-3xl font-black text-orange-300">{progress?.points || 0}</p><p className="text-xs font-bold uppercase tracking-wider text-slate-300">Eco points</p></div></div>
      </section>

      {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p>}

      <section className="mt-8"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Badge cabinet</p><h2 className="mt-1 text-2xl font-black">Your earned badges</h2></div><p className="text-sm text-gray-500">{progress?.badges.length || 0} earned</p></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {progress?.badges.length ? progress.badges.map((badge) => <article key={badge.code} className={`rounded-3xl border p-5 ${tierStyles[badge.tier]}`}><p className="text-4xl">{badge.icon}</p><h3 className="mt-3 font-black">{badge.name}</h3><p className="mt-1 text-sm leading-5 opacity-80">{badge.description}</p></article>) : <div className="col-span-full rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">Your first offbeat visit unlocks the First Footprint badge.</div>}
        </div>
      </section>

      <section className="mt-10"><p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Demo visit stamps</p><h2 className="mt-1 text-2xl font-black">Support lesser-known destinations</h2><p className="mt-2 text-sm text-gray-600">For the SIH prototype, use these stamps to simulate a verified offbeat visit. A production app would enable them after geo-fenced check-in.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{OFFBEAT_DEMOS.map((location) => { const visited = visitedIds.has(location.id); return <article key={location.id} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4"><div><h3 className="font-black">{location.name}</h3><p className="text-sm text-gray-500">{location.detail}</p></div><button onClick={() => recordVisit(location.id)} disabled={visited || savingId === location.id} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${visited ? "bg-emerald-100 text-emerald-800" : "bg-orange-500 text-white"}`}>{savingId === location.id ? "Stamping…" : visited ? "✓ Stamped" : "Stamp visit"}</button></article>; })}</div>
      </section>
    </main>
  );
}
