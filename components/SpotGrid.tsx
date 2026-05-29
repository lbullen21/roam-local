"use client";

import { Compass, MapPinned } from "lucide-react";
import type { Spot } from "@/lib/types";
import EmptyState from "./EmptyState";
import { SpotCardSkeleton } from "./Loader";
import SpotCard from "./SpotCard";

interface Props {
  spots: Spot[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function SpotGrid({ spots, loading, error, onRetry }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SpotCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={Compass}
        title="Hmm, that didn't work"
        message={error}
        action={{ label: "Try again", onClick: onRetry }}
      />
    );
  }

  if (spots.length === 0) {
    return (
      <EmptyState
        icon={MapPinned}
        title="No spots yet"
        message="Search a city to start discovering trails, natural spots, and restaurants nearby."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {spots.map((spot) => (
        <SpotCard key={spot.clientId} spot={spot} />
      ))}
    </div>
  );
}
