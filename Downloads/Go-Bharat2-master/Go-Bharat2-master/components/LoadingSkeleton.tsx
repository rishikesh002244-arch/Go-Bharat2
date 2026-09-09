import React from "react";

interface LoadingSkeletonProps {
  count?: number;
  type?: "card" | "hotel" | "food";
}

export default function LoadingSkeleton({
  count = 6,
  type = "card",
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm"
        >
          {/* IMAGE SKELETON */}
          <div className="h-56 w-full bg-gray-200" />

          {/* CONTENT SKELETON */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded-full bg-gray-200" />
              <div className="h-4 w-12 rounded-full bg-gray-200" />
            </div>

            <div className="h-6 w-3/4 rounded-lg bg-gray-200" />

            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-5/6 rounded bg-gray-200" />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <div className="h-5 w-20 rounded bg-gray-200" />
              <div className="h-8 w-24 rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
