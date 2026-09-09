"use client";

import { useEffect, useState } from "react";
import type { MarketplaceProduct } from "@/routes/sih/marketplace";

export default function MarketplaceExplorer() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
        const response = await fetch(`/api/sih/marketplace/products${query}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "Could not load the marketplace.");
        setProducts(data.data);
        setUsingFallback(Boolean(data.isFallback));
      } catch (loadError) {
        if (!controller.signal.aborted) setError(loadError instanceof Error ? loadError.message : "Could not load the marketplace.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    const timer = window.setTimeout(loadProducts, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [search]);

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-12 md:px-12">
      <section className="rounded-[2rem] bg-gradient-to-br from-orange-100 via-amber-50 to-white px-6 py-10 md:px-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">Direct from the makers</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-[#14213d] md:text-6xl">Local crafts, living stories, meaningful journeys.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">Discover small-batch goods and bookable cultural experiences that keep local craft communities at the centre of tourism.</p>
        <label className="mt-7 block max-w-xl">
          <span className="sr-only">Search local goods and experiences</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search crafts, states, or experiences" className="w-full rounded-2xl border border-orange-200 bg-white px-5 py-3.5 text-sm shadow-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200/40" />
        </label>
      </section>

      {usingFallback && <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Showing a built-in artisan catalog until MongoDB reconnects. No marketplace action is being recorded.</p>}
      {error && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[390px] animate-pulse rounded-3xl bg-gray-100" />)}
        </div>
      ) : products.length ? (
        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article key={product.id} className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-gray-800">{product.kind === "experience" ? "Experience" : "Craft"}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-bold text-orange-600">{product.category} · {product.artisan.state}</p>
                <h2 className="mt-1 text-lg font-black text-gray-900">{product.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-5 text-gray-600">{product.description}</p>
                <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-900">♻️ {product.sustainabilityNote}</div>
                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                  <div><p className="text-xs text-gray-500">By {product.artisan.name}</p><p className="mt-0.5 text-xl font-black text-[#14213d]">₹{product.price.toLocaleString("en-IN")}</p></div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600">{product.stockStatus.replaceAll("_", " ")}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-14 text-center text-gray-600">No artisans or experiences match that search.</div>
      )}
    </main>
  );
}
