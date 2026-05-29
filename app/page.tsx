"use client";

import { useState } from "react";
import AppBar from "@/components/AppBar";
import FilterChips, { type Filters } from "@/components/FilterChips";
import SearchBar from "@/components/SearchBar";
import SpotGrid from "@/components/SpotGrid";
import type { Spot } from "@/lib/types";

const POPULAR_CITIES = [
  "Bend, Oregon",
  "Asheville, North Carolina",
  "Boulder, Colorado",
  "Austin, Texas",
  "Portland, Maine",
  "Moab, Utah",
];

const INITIAL_FILTERS: Filters = {
  kind: "all",
  vibe: "any",
  group: "any",
};

export default function HomePage() {
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpots = async (loc: string, f: Filters) => {
    setLoading(true);
    setError(null);
    try {
      const kinds =
        f.kind === "all" ? (["outdoor", "dining"] as const) : ([f.kind] as const);
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: loc,
          kinds,
          vibe: f.vibe,
          groupType: f.group,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load spots.");
      setSpots(data.spots ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSpots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (loc: string) => {
    setLocation(loc);
    void fetchSpots(loc, filters);
  };

  const handleFilterChange = (next: Filters) => {
    setFilters(next);
    if (location) void fetchSpots(location, next);
  };

  const visibleSpots =
    filters.kind === "all"
      ? spots
      : spots.filter((s) => s.kind === filters.kind);

  const hasLocation = location.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <AppBar
        location={location}
        onLocationChange={handleSearch}
        showSearch={hasLocation}
      />

      {!hasLocation ? (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h1 className="font-bold text-4xl sm:text-5xl text-stone-900 tracking-tight mb-4">
            Discover your next day outside.
          </h1>
          <p className="text-stone-600 text-lg mb-10 max-w-xl mx-auto">
            Trails, parks, viewpoints, and the local restaurants that fit the
            day — curated for the place you're heading.
          </p>

          <div className="max-w-xl mx-auto mb-8">
            <SearchBar
              size="lg"
              placeholder="Search a city, e.g. Bend, Oregon"
              onSubmit={handleSearch}
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
              Popular destinations
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => handleSearch(city)}
                  className="chip hover:bg-forest-50 hover:text-forest-700 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 lg:shrink-0">
              <div className="lg:sticky lg:top-20">
                <FilterChips value={filters} onChange={handleFilterChange} />
              </div>
            </aside>

            <section className="flex-1 min-w-0">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-bold text-2xl text-stone-900 tracking-tight">
                    {visibleSpots.length > 0
                      ? `${visibleSpots.length} spots near ${location}`
                      : `Exploring ${location}`}
                  </h2>
                  <p className="text-sm text-stone-600 mt-0.5">
                    Trails, natural spots, and dining within ~30 miles.
                  </p>
                </div>
                <button
                  onClick={() => fetchSpots(location, filters)}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Refresh
                </button>
              </div>

              <SpotGrid
                spots={visibleSpots}
                loading={loading}
                error={error}
                onRetry={() => fetchSpots(location, filters)}
              />
            </section>
          </div>
        </main>
      )}

      <footer className="mt-16 border-t border-stone-200 py-8">
        <p className="text-center text-xs text-stone-500 max-w-2xl mx-auto px-4">
          Suggestions generated by Claude. Double-check hours, trail conditions,
          and reservations before you go.
        </p>
      </footer>
    </div>
  );
}
