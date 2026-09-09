"use client";

import React from "react";

export interface SafetyData {
  location: string;
  locationSlug: string;
  emergencyContacts: {
    police: string;
    ambulance: string;
    touristHelpline: string;
    fire?: string;
  };
  generalPrecautions: string[];
  healthWarnings: string[];
  localScamsToAvoid: string[];
}

interface SafetyWidgetProps {
  data: SafetyData | null;
  loading?: boolean;
}

export default function SafetyWidget({ data, loading }: SafetyWidgetProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4 rounded-3xl border border-red-100 bg-red-50/40 p-6">
        <div className="h-6 w-48 rounded bg-red-100" />
        <div className="h-20 rounded bg-red-100/70" />
        <div className="h-32 rounded bg-red-100/50" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        Safety advisory unavailable for this location.
      </div>
    );
  }

  const contacts = [
    { label: "Police", value: data.emergencyContacts.police, icon: "🚓" },
    { label: "Ambulance", value: data.emergencyContacts.ambulance, icon: "🚑" },
    {
      label: "Tourist Helpline",
      value: data.emergencyContacts.touristHelpline,
      icon: "📞",
    },
    {
      label: "Fire",
      value: data.emergencyContacts.fire || "101",
      icon: "🔥",
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-orange-50 shadow-sm">
      <div className="border-b border-red-100 bg-red-600/95 px-6 py-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-100">
          Travel Safety
        </p>
        <h3 className="mt-1 text-2xl font-black">
          Precautions for {data.location}
        </h3>
        <p className="mt-1 text-sm text-red-100">
          Localized emergency numbers, health tips, and common scams to avoid.
        </p>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-4">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={`tel:${c.value}`}
            className="flex items-center gap-3 rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-sm transition hover:border-red-300"
          >
            <span className="text-2xl">{c.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {c.label}
              </p>
              <p className="text-lg font-black text-[#14213d]">{c.value}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="grid gap-6 px-6 pb-6 md:grid-cols-3">
        <SafetyList
          title="General Precautions"
          items={data.generalPrecautions}
          accent="orange"
        />
        <SafetyList
          title="Health Warnings"
          items={data.healthWarnings}
          accent="red"
        />
        <SafetyList
          title="Scams to Avoid"
          items={data.localScamsToAvoid}
          accent="amber"
        />
      </div>
    </div>
  );
}

function SafetyList({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: "orange" | "red" | "amber";
}) {
  const dot =
    accent === "red"
      ? "bg-red-500"
      : accent === "amber"
        ? "bg-amber-500"
        : "bg-orange-500";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 p-5">
      <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-[#14213d]">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-gray-700">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
