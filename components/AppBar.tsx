"use client";

import { Heart, ListChecks, Mountain } from "lucide-react";
import SearchBar from "./SearchBar";

interface Props {
  location: string;
  onLocationChange: (value: string) => void;
  showSearch?: boolean;
}

export default function AppBar({
  location,
  onLocationChange,
  showSearch = true,
}: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <a
          href="/"
          className="flex items-center gap-2 shrink-0 text-stone-900 hover:text-forest-600 transition-colors"
        >
          <Mountain className="h-6 w-6 text-forest-600" strokeWidth={2} />
          <span className="font-bold text-lg tracking-tight hidden sm:inline">
            Roam Local
          </span>
        </a>

        {showSearch && (
          <div className="flex-1 max-w-xl">
            <SearchBar
              initialValue={location}
              onSubmit={onLocationChange}
              size="sm"
            />
          </div>
        )}

        <nav className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            className="btn-ghost !px-3"
            aria-label="Favorites"
            title="Favorites — coming soon"
            disabled
          >
            <Heart className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="btn-ghost !px-3"
            aria-label="Itinerary"
            title="Itinerary — coming soon"
            disabled
          >
            <ListChecks className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
