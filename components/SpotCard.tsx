"use client";

import {
  Coffee,
  MapPin,
  Mountain,
  Sun,
  TreePine,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import type { OutdoorSubcategory, Spot } from "@/lib/types";

interface Props {
  spot: Spot;
}

const OUTDOOR_ICONS: Record<OutdoorSubcategory, LucideIcon> = {
  hike: Mountain,
  park: TreePine,
  river: Waves,
  lake: Waves,
  viewpoint: Mountain,
  outdoor: Sun,
};

const OUTDOOR_BANNER: Record<OutdoorSubcategory, string> = {
  hike: "from-forest-600 to-forest-400",
  park: "from-forest-500 to-forest-300",
  river: "from-sky-600 to-sky-400",
  lake: "from-sky-500 to-sky-300",
  viewpoint: "from-forest-700 to-forest-500",
  outdoor: "from-forest-500 to-forest-400",
};

const DIFFICULTY_STYLES: Record<"easy" | "moderate" | "hard", string> = {
  easy: "bg-forest-50 text-forest-700 border border-forest-200",
  moderate: "bg-amber-50 text-amber-700 border border-amber-200",
  hard: "bg-clay-500/10 text-clay-600 border border-clay-500/20",
};

function CategoryLabel({ spot }: { spot: Spot }) {
  if (spot.kind === "outdoor") {
    return (
      <span className="capitalize">{spot.subcategory}</span>
    );
  }
  return <span>Restaurant</span>;
}

function MetadataRow({ spot }: { spot: Spot }) {
  const items: React.ReactNode[] = [];

  items.push(
    <span key="drive" className="inline-flex items-center gap-1">
      <MapPin className="h-3.5 w-3.5" />
      {spot.driveTime}
    </span>
  );

  if (spot.kind === "outdoor") {
    if (spot.length) {
      items.push(<span key="length">{spot.length}</span>);
    }
    if (spot.elevationGain) {
      items.push(<span key="elev">{spot.elevationGain} gain</span>);
    }
  } else {
    items.push(<span key="cuisine">{spot.cuisine}</span>);
    items.push(<span key="price">{spot.priceRange}</span>);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
      {items.map((item, idx) => (
        <span key={idx} className="inline-flex items-center gap-1">
          {idx > 0 && <span className="text-stone-300">·</span>}
          {item}
        </span>
      ))}
    </div>
  );
}

export default function SpotCard({ spot }: Props) {
  const banner =
    spot.kind === "outdoor"
      ? OUTDOOR_BANNER[spot.subcategory]
      : "from-clay-500 to-clay-400";

  const Icon: LucideIcon =
    spot.kind === "outdoor"
      ? OUTDOOR_ICONS[spot.subcategory]
      : spot.mealKind === "brunch"
        ? Coffee
        : Utensils;

  return (
    <article className="card card-hover flex flex-col h-full cursor-pointer group">
      <div
        className={`relative aspect-[16/10] bg-gradient-to-br ${banner} flex items-center justify-center overflow-hidden`}
      >
        {spot.photoUrl ? (
          <Image
            src={spot.photoUrl}
            alt={spot.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Icon className="h-12 w-12 text-white/80" strokeWidth={1.5} />
        )}
        <span className="absolute top-3 left-3 chip bg-white/95 text-stone-800 backdrop-blur-sm z-10">
          <CategoryLabel spot={spot} />
        </span>
        {spot.photoUrl && spot.photoAttribution && (
          <a
            href={spot.photoAttribution.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 right-2 text-[10px] text-white/90 bg-black/30 backdrop-blur-sm rounded px-1.5 py-0.5 hover:bg-black/50 transition-colors z-10"
          >
            {spot.photoAttribution.name}
          </a>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="font-semibold text-base text-stone-900 leading-snug tracking-tight group-hover:text-forest-600 transition-colors">
          {spot.name}
        </h3>

        <MetadataRow spot={spot} />

        {spot.kind === "outdoor" && spot.difficulty && (
          <div>
            <span
              className={`chip capitalize ${DIFFICULTY_STYLES[spot.difficulty]}`}
            >
              {spot.difficulty}
            </span>
          </div>
        )}

        <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
          {spot.description}
        </p>

        {spot.tagline && (
          <p className="text-xs text-forest-700 mt-auto pt-2 border-t border-stone-100 italic">
            {spot.tagline}
          </p>
        )}
      </div>
    </article>
  );
}
