"use client";

export default function Loader({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-16 h-16">
        <span
          className="absolute inset-0 rounded-full bg-sun-300/60 animate-ping"
          aria-hidden
        />
        <span
          className="absolute inset-2 rounded-full bg-coral-400 shadow-warm"
          aria-hidden
        />
      </div>
      <p className="text-stone-700 font-semibold">{label}</p>
    </div>
  );
}
