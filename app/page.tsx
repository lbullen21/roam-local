"use client";

import { useState } from "react";
import StepIndicator from "@/components/StepIndicator";
import LocationInput from "@/components/LocationInput";
import VibeSelector from "@/components/VibeSelector";
import ActivityCard from "@/components/ActivityCard";
import DiningCard from "@/components/DiningCard";
import Loader from "@/components/Loader";
import type {
  Activity,
  DiningSpot,
  GroupType,
  Vibe,
} from "@/lib/types";

type Step = 1 | 2 | 3 | 4;

const DEFAULT_LOCATION = "Bend, Oregon";
const MAX_ACTIVITIES = 2;

export default function HomePage() {
  const [step, setStep] = useState<Step>(1);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [group, setGroup] = useState<GroupType | undefined>(undefined);
  const [vibe, setVibe] = useState<Vibe | undefined>(undefined);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);

  const [dining, setDining] = useState<DiningSpot[]>([]);
  const [diningLoading, setDiningLoading] = useState(false);
  const [diningError, setDiningError] = useState<string | null>(null);

  const fetchActivities = async (
    loc: string,
    g: GroupType,
    v: Vibe
  ): Promise<void> => {
    setActivitiesLoading(true);
    setActivitiesError(null);
    setActivities([]);
    setSelectedActivityIds([]);
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: loc, groupType: g, vibe: v }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load activities.");
      setActivities(data.activities ?? []);
    } catch (err) {
      setActivitiesError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setActivitiesLoading(false);
    }
  };

  const fetchDining = async (chosen: Activity[]): Promise<void> => {
    if (!group || !vibe) return;
    setDiningLoading(true);
    setDiningError(null);
    setDining([]);
    try {
      const res = await fetch("/api/dining", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          groupType: group,
          vibe,
          activities: chosen,
          mealKind: "either",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load dining.");
      setDining(data.dining ?? []);
    } catch (err) {
      setDiningError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setDiningLoading(false);
    }
  };

  const handleLocationSubmit = (val: string) => {
    setLocation(val);
    setStep(2);
  };

  const handleVibeContinue = (g: GroupType, v: Vibe) => {
    setGroup(g);
    setVibe(v);
    setStep(3);
    void fetchActivities(location, g, v);
  };

  const toggleActivity = (id: string) => {
    setSelectedActivityIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_ACTIVITIES) return prev;
      return [...prev, id];
    });
  };

  const handleSeeDining = () => {
    const chosen = activities.filter((a) =>
      selectedActivityIds.includes(a.id)
    );
    setStep(4);
    void fetchDining(chosen);
  };

  const handleStartOver = () => {
    setStep(1);
    setActivities([]);
    setDining([]);
    setSelectedActivityIds([]);
    setActivitiesError(null);
    setDiningError(null);
  };

  return (
    <main className="min-h-screen pb-16">
      <header className="pt-10 pb-8 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral-600 mb-2">
            Roam Local
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 leading-tight">
            Your perfect summer day,
            <br />
            <span className="text-coral-500">curated by AI.</span>
          </h1>
          <p className="mt-4 text-stone-600 max-w-xl mx-auto">
            Outdoor adventures and local bites within 30 miles — picked for your
            vibe, your crew, today.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <StepIndicator current={step} />
        </div>

        {step === 1 && (
          <LocationInput
            initialValue={location}
            onSubmit={handleLocationSubmit}
          />
        )}

        {step === 2 && (
          <VibeSelector
            location={location}
            initialGroup={group}
            initialVibe={vibe}
            onBack={() => setStep(1)}
            onContinue={handleVibeContinue}
          />
        )}

        {step === 3 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-coral-600">
                  {location}
                </p>
                <h2 className="font-display text-3xl font-bold text-stone-900">
                  Pick 1–2 to anchor your day
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Selected {selectedActivityIds.length} of {MAX_ACTIVITIES}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="btn-ghost">
                  ← Back
                </button>
                {group && vibe && (
                  <button
                    onClick={() => fetchActivities(location, group, vibe)}
                    className="btn-secondary"
                    disabled={activitiesLoading}
                  >
                    ↻ Refresh
                  </button>
                )}
              </div>
            </div>

            {activitiesLoading && (
              <Loader label="Scouting the best spots nearby…" />
            )}

            {activitiesError && !activitiesLoading && (
              <ErrorBlock
                message={activitiesError}
                onRetry={() =>
                  group && vibe && fetchActivities(location, group, vibe)
                }
              />
            )}

            {!activitiesLoading && !activitiesError && activities.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activities.map((a) => (
                    <ActivityCard
                      key={a.id}
                      activity={a}
                      selected={selectedActivityIds.includes(a.id)}
                      disabled={
                        selectedActivityIds.length >= MAX_ACTIVITIES &&
                        !selectedActivityIds.includes(a.id)
                      }
                      onToggle={() => toggleActivity(a.id)}
                    />
                  ))}
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleSeeDining}
                    disabled={selectedActivityIds.length === 0}
                    className="btn-primary"
                  >
                    See dining picks →
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {step === 4 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-coral-600">
                  {location}
                </p>
                <h2 className="font-display text-3xl font-bold text-stone-900">
                  Where to eat
                </h2>
                <p className="text-stone-600 text-sm mt-1">
                  Picks that match the rest of your day.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(3)} className="btn-ghost">
                  ← Back
                </button>
                <button onClick={handleStartOver} className="btn-secondary">
                  Start over
                </button>
              </div>
            </div>

            <SelectedSummary
              activities={activities.filter((a) =>
                selectedActivityIds.includes(a.id)
              )}
            />

            {diningLoading && <Loader label="Plating up some local favorites…" />}

            {diningError && !diningLoading && (
              <ErrorBlock
                message={diningError}
                onRetry={() =>
                  fetchDining(
                    activities.filter((a) => selectedActivityIds.includes(a.id))
                  )
                }
              />
            )}

            {!diningLoading && !diningError && dining.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dining.map((d) => (
                  <DiningCard key={d.id} spot={d} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="text-center text-xs text-stone-500 mt-16">
        Crafted for sunny days. Suggestions generated by Claude — double-check
        hours and conditions before you go.
      </footer>
    </main>
  );
}

function ErrorBlock({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="card p-6 border-coral-200 bg-coral-50/80">
      <p className="font-bold text-coral-600 mb-1">Hmm, that didn&apos;t work</p>
      <p className="text-sm text-stone-700 mb-3">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try again
        </button>
      )}
    </div>
  );
}

function SelectedSummary({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) return null;
  return (
    <div className="card p-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-stone-500">
        Your day:
      </span>
      {activities.map((a) => (
        <span key={a.id} className="chip bg-leaf-400/20 text-leaf-600">
          ✓ {a.name}
        </span>
      ))}
    </div>
  );
}
