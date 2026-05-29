"use client";

export function SpotCardSkeleton() {
  return (
    <div className="card flex flex-col h-full overflow-hidden">
      <div className="aspect-[16/10] bg-stone-100 animate-pulse" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 bg-stone-100 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-stone-100 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-stone-100 rounded animate-pulse w-full mt-2" />
        <div className="h-3 bg-stone-100 rounded animate-pulse w-5/6" />
      </div>
    </div>
  );
}

export default function Loader({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12"
      role="status"
      aria-live="polite"
    >
      <span className="inline-block h-6 w-6 rounded-full border-2 border-forest-200 border-t-forest-600 animate-spin" />
      <p className="text-sm text-stone-600">{label}</p>
    </div>
  );
}
