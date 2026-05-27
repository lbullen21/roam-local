"use client";

interface Step {
  id: number;
  label: string;
}

const STEPS: Step[] = [
  { id: 1, label: "Location" },
  { id: 2, label: "Vibe" },
  { id: 3, label: "Activities" },
  { id: 4, label: "Dining" },
];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center gap-2 sm:gap-4 justify-center">
        {STEPS.map((step, idx) => {
          const isActive = step.id === current;
          const isDone = step.id < current;
          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    isActive
                      ? "bg-coral-500 text-white shadow-warm"
                      : isDone
                        ? "bg-leaf-500 text-white"
                        : "bg-white text-stone-500 border border-stone-200",
                  ].join(" ")}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isDone ? "✓" : step.id}
                </span>
                <span
                  className={[
                    "text-sm font-semibold hidden sm:inline",
                    isActive
                      ? "text-stone-900"
                      : isDone
                        ? "text-leaf-600"
                        : "text-stone-500",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <span
                  className={[
                    "block h-0.5 w-6 sm:w-12 rounded-full",
                    isDone ? "bg-leaf-500" : "bg-stone-200",
                  ].join(" ")}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
