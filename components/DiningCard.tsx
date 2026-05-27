"use client";

import type { DiningSpot } from "@/lib/types";

interface Props {
  spot: DiningSpot;
}

const KIND_STYLES: Record<DiningSpot["kind"], string> = {
  brunch: "bg-sun-200 text-sun-700",
  lunch: "bg-leaf-400/30 text-leaf-600",
  dinner: "bg-coral-400/20 text-coral-600",
};

export default function DiningCard({ spot }: Props) {
  return (
    <article className="card p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between gap-3">
        <span className={`chip ${KIND_STYLES[spot.kind]}`}>{spot.kind}</span>
        <span className="font-bold text-stone-700">{spot.priceRange}</span>
      </div>

      <h3 className="font-display text-xl font-bold text-stone-900 leading-snug">
        {spot.name}
      </h3>

      <p className="text-sm font-semibold text-stone-600">{spot.cuisine}</p>

      <div className="bg-coral-50 border border-coral-100 rounded-xl p-3 mt-auto">
        <p className="text-xs font-bold uppercase tracking-wide text-coral-600 mb-1">
          Why it fits
        </p>
        <p className="text-sm text-stone-800">{spot.reason}</p>
      </div>
    </article>
  );
}
