"use client";

import type { GroupType, SpotKind, Vibe } from "@/lib/types";

export interface Filters {
  kind: SpotKind | "all";
  vibe: Vibe;
  group: GroupType;
}

interface Props {
  value: Filters;
  onChange: (next: Filters) => void;
}

const KINDS: { id: Filters["kind"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "outdoor", label: "Outdoors" },
  { id: "dining", label: "Dining" },
];

const VIBES: { id: Vibe; label: string }[] = [
  { id: "any", label: "Any vibe" },
  { id: "relaxed", label: "Relaxed" },
  { id: "adventurous", label: "Adventurous" },
  { id: "scenic", label: "Scenic" },
  { id: "active", label: "Active" },
  { id: "romantic", label: "Romantic" },
  { id: "kid-friendly", label: "Kid-friendly" },
];

const GROUPS: { id: GroupType; label: string }[] = [
  { id: "any", label: "Any group" },
  { id: "solo", label: "Solo" },
  { id: "couple", label: "Couple" },
  { id: "friends", label: "Friends" },
  { id: "family-with-kids", label: "Family" },
  { id: "dog-friendly", label: "Dog-friendly" },
];

function ChipGroup<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { id: T; label: string }[];
  selected: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt.id === selected;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`chip transition-colors ${active ? "chip-active" : "hover:bg-stone-200"}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function FilterChips({ value, onChange }: Props) {
  return (
    <div className="space-y-5">
      <section>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
          Show
        </h4>
        <ChipGroup
          options={KINDS}
          selected={value.kind}
          onSelect={(id) => onChange({ ...value, kind: id })}
        />
      </section>

      <section>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
          Vibe
        </h4>
        <ChipGroup
          options={VIBES}
          selected={value.vibe}
          onSelect={(id) => onChange({ ...value, vibe: id })}
        />
      </section>

      <section>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
          Group
        </h4>
        <ChipGroup
          options={GROUPS}
          selected={value.group}
          onSelect={(id) => onChange({ ...value, group: id })}
        />
      </section>
    </div>
  );
}
