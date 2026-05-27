"use client";

import { useState } from "react";
import type { GroupType, Vibe } from "@/lib/types";

interface Props {
  location: string;
  initialGroup?: GroupType;
  initialVibe?: Vibe;
  onBack: () => void;
  onContinue: (group: GroupType, vibe: Vibe) => void;
}

const GROUPS: { id: GroupType; label: string; emoji: string }[] = [
  { id: "solo", label: "Solo", emoji: "🧍" },
  { id: "couple", label: "Couple", emoji: "💞" },
  { id: "friends", label: "Friends", emoji: "👯" },
  { id: "family-with-kids", label: "Family + kids", emoji: "👨‍👩‍👧" },
  { id: "dog-friendly", label: "With dog", emoji: "🐕" },
];

const VIBES: { id: Vibe; label: string; emoji: string }[] = [
  { id: "relaxed", label: "Relaxed", emoji: "😌" },
  { id: "adventurous", label: "Adventurous", emoji: "🧗" },
  { id: "scenic", label: "Scenic", emoji: "🏞️" },
  { id: "active", label: "Active", emoji: "🚴" },
  { id: "romantic", label: "Romantic", emoji: "🌅" },
  { id: "kid-friendly", label: "Kid-friendly", emoji: "🪁" },
];

export default function VibeSelector({
  location,
  initialGroup,
  initialVibe,
  onBack,
  onContinue,
}: Props) {
  const [group, setGroup] = useState<GroupType | null>(initialGroup ?? null);
  const [vibe, setVibe] = useState<Vibe | null>(initialVibe ?? null);

  const canContinue = group && vibe;

  return (
    <div className="card p-6 sm:p-8 w-full max-w-2xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-wide text-coral-600 mb-1">
        {location}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-6">
        What&apos;s the mood today?
      </h2>

      <section className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600 mb-3">
          Who&apos;s with you?
        </h3>
        <div className="flex flex-wrap gap-2">
          {GROUPS.map((g) => {
            const active = group === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setGroup(g.id)}
                className={[
                  "px-4 py-2 rounded-full border-2 font-semibold transition-all",
                  active
                    ? "bg-coral-500 text-white border-coral-500 shadow-warm"
                    : "bg-white text-stone-700 border-stone-200 hover:border-coral-300",
                ].join(" ")}
              >
                <span className="mr-1.5">{g.emoji}</span>
                {g.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600 mb-3">
          Pick a vibe
        </h3>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => {
            const active = vibe === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setVibe(v.id)}
                className={[
                  "px-4 py-2 rounded-full border-2 font-semibold transition-all",
                  active
                    ? "bg-sun-400 text-stone-900 border-sun-500 shadow-warm"
                    : "bg-white text-stone-700 border-stone-200 hover:border-sun-300",
                ].join(" ")}
              >
                <span className="mr-1.5">{v.emoji}</span>
                {v.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="btn-ghost">
          ← Back
        </button>
        <button
          onClick={() => canContinue && onContinue(group!, vibe!)}
          disabled={!canContinue}
          className="btn-primary"
        >
          Find activities →
        </button>
      </div>
    </div>
  );
}
