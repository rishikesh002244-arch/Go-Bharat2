"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useAuth } from "@/context/AuthContext";

interface GuideRow {
  _id: string;
  name: string;
  location: string;
  locationSlug: string;
  languages: string[];
  govtLicenseId: string;
  licenseFormatValid: boolean;
  isVerified: boolean;
  status: "pending" | "verified" | "rejected";
  bio: string;
  contact: string;
  experienceYears: number;
}

export default function AdminGuidesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [guides, setGuides] = useState<GuideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "verified" | "rejected" | "all">(
    "pending"
  );
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?redirect=/admin/guides");
      return;
    }
    if (user.role !== "admin") {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const url =
        filter === "all"
          ? "/api/guides?verified=false"
          : `/api/guides?status=${filter}&verified=false`;

      const res = await fetch(url);
      const data = await res.json();
      setGuides(data.data || []);
    } catch {
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchGuides();
  }, [user, filter]);

  const updateStatus = async (id: string, action: "verify" | "reject") => {
    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch(`/api/guides/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage(data.error || "Update failed.");
      } else {
        setMessage(data.message);
        fetchGuides();
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setBusyId(null);
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-20">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#14213d]">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f97316]">
              Admin
            </p>
            <h1 className="mt-2 text-4xl font-black">Guide Verification</h1>
            <p className="mt-2 text-gray-600">
              Review license format flags and manually approve or reject
              applications.
            </p>
          </div>
          <Link
            href="/guides/register"
            className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700"
          >
            View registration form
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(["pending", "verified", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${
                filter === f
                  ? "bg-[#14213d] text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {message && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {loading ? (
            <LoadingSkeleton />
          ) : guides.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
              No {filter === "all" ? "" : filter} guide applications.
            </div>
          ) : (
            guides.map((guide) => (
              <article
                key={guide._id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">{guide.name}</h3>
                    <p className="text-sm text-gray-500">
                      {guide.location} · {guide.experienceYears} yrs ·{" "}
                      {(guide.languages || []).join(", ")}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-semibold">License:</span>{" "}
                      {guide.govtLicenseId}{" "}
                      {guide.licenseFormatValid ? (
                        <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                          Format OK
                        </span>
                      ) : (
                        <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                          Format Check Failed
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{guide.contact}</p>
                    {guide.bio && (
                      <p className="mt-3 text-sm text-gray-600">{guide.bio}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        guide.status === "verified"
                          ? "bg-emerald-100 text-emerald-700"
                          : guide.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {guide.status}
                    </span>
                    {guide.status !== "verified" && (
                      <button
                        disabled={busyId === guide._id}
                        onClick={() => updateStatus(guide._id, "verify")}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                      >
                        Verify
                      </button>
                    )}
                    {guide.status !== "rejected" && (
                      <button
                        disabled={busyId === guide._id}
                        onClick={() => updateStatus(guide._id, "reject")}
                        className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-600 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                    <Link
                      href={`/location/${guide.locationSlug}`}
                      className="text-xs font-semibold text-[#f97316]"
                    >
                      View location →
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
