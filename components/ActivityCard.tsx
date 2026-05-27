"use client";

import type { Activity } from "@/lib/types";

interface Props {
  activity: Activity;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}

const CATEGORY_EMOJI: Record<Activity["category"], string> = {
  hike: "🥾",
  park: "🌳",
  river: "🛶",
  lake: "🏊",
  viewpoint: "🌄",
  outdoor: "☀️",
};

const DIFFICULTY_COLORS: Record<NonNullable<Activity["difficulty"]>, string> = {
  easy: "bg-leaf-400/20 text-leaf-600",
  moderate: "bg-sun-200 text-sun-700",
  hard: "bg-coral-400/20 text-coral-600",
};

export default function ActivityCard({
  activity,
  selected,
  disabled,
  onToggle,
}: Props) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled && !selected}
      className={[
        "card text-left p-5 flex flex-col gap-3 transition-all w-full h-full",
        selected
          ? "ring-4 ring-coral-400 scale-[1.01]"
          : "hover:scale-[1.01] hover:shadow-warm",
        disabled && !selected ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {CATEGORY_EMOJI[activity.category] ?? "☀️"}
          </span>
          <span className="chip bg-sky-100 text-sky-300/100 text-sky-700">
            {activity.category}
          </span>
        </div>
        {selected && (
          <span className="chip bg-coral-500 text-white">✓ Picked</span>
        )}
      </div>

      <h3 className="font-display text-xl font-bold text-stone-900 leading-snug">
        {activity.name}
      </h3>

      <p className="text-sm text-stone-700 leading-relaxed">
        {activity.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        <span className="chip bg-stone-100 text-stone-600">
          🚗 {activity.driveTime}
        </span>
        {activity.difficulty && (
          <span
            className={`chip ${DIFFICULTY_COLORS[activity.difficulty]}`}
          >
            {activity.difficulty}
          </span>
        )}
      </div>

      <div className="bg-sun-50 border border-sun-200 rounded-xl p-3 mt-1">
        <p className="text-xs font-bold uppercase tracking-wide text-sun-700 mb-1">
          Why today?
        </p>
        <p className="text-sm text-stone-800">{activity.whyToday}</p>
      </div>
    </button>
  );
}
