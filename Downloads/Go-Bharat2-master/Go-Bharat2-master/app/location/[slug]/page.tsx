"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import SafetyWidget, { SafetyData } from "@/components/SafetyWidget";
import { LOCATIONS, getLocationBySlug } from "@/lib/locations";

type TabKey = "places" | "hotels" | "food" | "culture" | "guides" | "safety";

const TABS: { key: TabKey; label: string }[] = [
  { key: "places", label: "Places" },
  { key: "hotels", label: "Hotels" },
  { key: "food", label: "Food" },
  { key: "culture", label: "Culture" },
  { key: "guides", label: "Guides" },
  { key: "safety", label: "Safety" },
];

export default function LocationPage() {
  const params = useParams();
  const slug = String(params.slug || "").toLowerCase();
  const location = getLocationBySlug(slug);

  const [tab, setTab] = useState<TabKey>("places");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [safety, setSafety] = useState<SafetyData | null>(null);
  const [safetyLoading, setSafetyLoading] = useState(false);

  useEffect(() => {
    if (!location) return;

    const fetchTab = async () => {
      setLoading(true);
      try {
        if (tab === "safety") {
          setSafetyLoading(true);
          const res = await fetch(`/api/safety?location=${slug}`);
          const data = await res.json();
          setSafety(data.data || null);
          setItems([]);
          setSafetyLoading(false);
        } else if (tab === "guides") {
          const res = await fetch(
            `/api/guides?location=${slug}&verified=true`
          );
          const data = await res.json();
          setItems(data.data || []);
        } else {
          const res = await fetch(`/api/${tab}?location=${slug}`);
          const data = await res.json();
          setItems(data.data || []);
        }
      } catch (err) {
        console.error("Location fetch error:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTab();
  }, [slug, tab, location]);

  if (!location) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-3xl font-black text-[#14213d]">
            Location not found
          </h1>
          <p className="mt-3 text-gray-600">
            We don&apos;t have a hub for &quot;{slug}&quot; yet.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {LOCATIONS.map((loc) => (
              <Link
                key={loc.slug}
                href={`/location/${loc.slug}`}
                className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#14213d]">
      <Navbar />

      <section className="relative h-[320px] overflow-hidden md:h-[400px]">
        <img
          src={location.image}
          alt={location.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1400px] px-6 pb-10 md:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-300">
              Location Hub · {location.state}
            </p>
            <h1 className="mt-2 text-4xl font-black text-white md:text-6xl">
              {location.name}
            </h1>
            <p className="mt-2 text-lg text-white/80">{location.tagline}</p>
          </div>
        </div>
      </section>

      <div className="sticky top-[72px] z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 py-3 md:px-12">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                tab === t.key
                  ? "bg-[#f97316] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-10 md:px-12">
        {tab === "safety" ? (
          <SafetyWidget data={safety} loading={safetyLoading || loading} />
        ) : loading ? (
          <LoadingSkeleton />
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-lg font-semibold text-gray-700">
              No {tab} listed for {location.name} yet.
            </p>
            {tab === "guides" && (
              <Link
                href="/guides/register"
                className="mt-4 inline-block rounded-full bg-[#f97316] px-6 py-3 text-sm font-bold text-white"
              >
                Register as a Guide
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tab === "guides"
              ? items.map((g) => <GuideCard key={g._id || g.govtLicenseId} guide={g} />)
              : items.map((item, idx) => (
                  <ContentCard key={item._id || item.name || item.title || idx} item={item} tab={tab} />
                ))}
          </div>
        )}

        {tab === "guides" && items.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/guides/register"
              className="text-sm font-bold text-[#f97316] hover:underline"
            >
              Are you a local guide? Apply for verification →
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ContentCard({ item, tab }: { item: any; tab: TabKey }) {
  const title = item.name || item.title;
  const subtitle =
    item.state ||
    item.destination ||
    item.famousIn ||
    item.region ||
    "";
  const meta =
    item.category ||
    item.budgetTier ||
    item.type ||
    item.priceRange ||
    "";

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {item.image && (
        <div className="h-48 overflow-hidden">
          <img
            src={item.image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-black leading-tight">{title}</h3>
          {item.rating && (
            <span className="shrink-0 rounded-full bg-orange-50 px-2 py-1 text-xs font-bold text-orange-600">
              ★ {item.rating}
            </span>
          )}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {subtitle}
          {meta ? ` · ${meta}` : ""}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
          {item.description || item.significance || ""}
        </p>
        {tab === "hotels" && item.pricePerNight && (
          <p className="mt-3 text-sm font-bold text-[#14213d]">
            ₹{item.pricePerNight.toLocaleString("en-IN")}/night
          </p>
        )}
      </div>
    </article>
  );
}

function GuideCard({ guide }: { guide: any }) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-lg font-black text-white">
          {guide.name?.charAt(0) || "G"}
        </div>
        <div>
          <h3 className="font-black text-[#14213d]">{guide.name}</h3>
          <p className="text-xs font-semibold text-emerald-600">✓ Verified Guide</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{guide.bio}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(guide.languages || []).map((lang: string) => (
          <span
            key={lang}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
          >
            {lang}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-500">
        {guide.experienceYears} yrs experience · License {guide.govtLicenseId}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#14213d]">{guide.contact}</p>
    </article>
  );
}
