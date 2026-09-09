"use client";

import { useEffect, useState } from "react";
import type { CrowdDensity } from "@/routes/sih/crowd";

const styles = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  High: "border-red-200 bg-red-50 text-red-800",
};

export default function CrowdDensityBadge({ locationId }: { locationId: string }) {
  const [crowd, setCrowd] = useState<CrowdDensity | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadCrowd = async () => {
      try {
        const response = await fetch(`/api/sih/crowd?locationId=${encodeURIComponent(locationId)}`, { signal: controller.signal });
        const data = await response.json();
        if (response.ok && data.success) setCrowd(data.data);
      } catch {
        // The badge is intentionally optional: a failed crowd API must never block Places.
      }
    };
    loadCrowd();
    return () => controller.abort();
  }, [locationId]);

  if (!crowd) {
    return <span className="inline-flex animate-pulse rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-400">Crowd loading</span>;
  }

  return (
    <span title={`${crowd.estimatedVisitors} simulated visitors. ${crowd.suggestion}`} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[crowd.level]}`}>
      <span aria-hidden="true">●</span> Crowd: {crowd.level}
    </span>
  );
}
