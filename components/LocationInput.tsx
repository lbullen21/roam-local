"use client";

import { useState } from "react";

interface Props {
  initialValue: string;
  onSubmit: (value: string) => void;
}

const SUGGESTIONS = [
  "Bend, Oregon",
  "Asheville, North Carolina",
  "Boulder, Colorado",
  "Austin, Texas",
  "Portland, Maine",
];

export default function LocationInput({ initialValue, onSubmit }: Props) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <div className="card p-6 sm:p-8 w-full max-w-xl mx-auto">
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
        Where are you roaming today?
      </h2>
      <p className="text-stone-600 mb-6">
        We&apos;ll suggest outdoor escapes and tasty stops within 30 miles.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="location" className="sr-only">
          Location
        </label>
        <input
          id="location"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="City, State"
          className="w-full px-5 py-3 rounded-full border-2 border-sun-200 bg-white/80 text-lg focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200"
        />
        <button type="submit" className="btn-primary w-full">
          Plan my day →
        </button>
      </form>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-2">
          Try one of these
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setValue(s);
                onSubmit(s);
              }}
              className="chip bg-sun-100 text-sun-700 hover:bg-sun-200"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
