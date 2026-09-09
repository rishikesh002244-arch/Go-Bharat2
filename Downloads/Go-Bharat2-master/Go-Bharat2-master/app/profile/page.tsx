"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useAuth } from "@/context/AuthContext";

interface ProfileData {
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  savedTrips?: any[];
  createdAt?: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?redirect=/profile");
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me?full=1", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || "Could not load profile.");
          setProfile({
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            savedTrips: [],
          });
        } else {
          setProfile(data.user);
        }
      } catch {
        setError("Network error loading profile.");
        setProfile({
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          savedTrips: [],
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-20">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const trips = profile.savedTrips || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#14213d]">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f97316]">
          Your Account
        </p>
        <h1 className="mt-2 text-4xl font-black">Profile</h1>
        <p className="mt-2 text-gray-600">
          Details stored securely in the Go-Bharat database.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f97316] text-2xl font-black text-white uppercase">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info label="User ID" value={profile.userId} />
            <Info
              label="Role"
              value={
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    profile.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {profile.role}
                </span>
              }
            />
            <Info label="Email" value={profile.email} />
            <Info
              label="Member since"
              value={
                profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"
              }
            />
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/plan-trip"
              className="rounded-full bg-[#f97316] px-5 py-2.5 text-sm font-bold text-white"
            >
              Plan a Trip
            </Link>
            {profile.role === "admin" && (
              <Link
                href="/admin/guides"
                className="rounded-full border border-purple-200 bg-purple-50 px-5 py-2.5 text-sm font-bold text-purple-700"
              >
                Admin · Guides
              </Link>
            )}
            <button
              onClick={() => logout()}
              className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        <section className="mt-10">
          <h3 className="text-xl font-black">Saved / Generated Itineraries</h3>
          <p className="mt-1 text-sm text-gray-500">
            Trips linked to your account from Plan Trip.
          </p>

          {trips.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-gray-600">No saved itineraries yet.</p>
              <Link
                href="/plan-trip"
                className="mt-4 inline-block text-sm font-bold text-[#f97316]"
              >
                Create your first AI itinerary →
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {trips.map((trip: any, idx: number) => (
                <div
                  key={trip.id || idx}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <h4 className="font-bold">
                    {trip.destination || trip.title || `Trip ${idx + 1}`}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {typeof trip === "string"
                      ? trip
                      : trip.summary || JSON.stringify(trip).slice(0, 120)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-[#14213d]">{value}</dd>
    </div>
  );
}
