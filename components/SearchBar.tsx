"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface Props {
  initialValue?: string;
  placeholder?: string;
  size?: "sm" | "lg";
  onSubmit: (value: string) => void;
}

export default function SearchBar({
  initialValue = "",
  placeholder = "Search by city, trail, or vibe",
  size = "sm",
  onSubmit,
}: Props) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  };

  const padding = size === "lg" ? "py-4 px-5 text-base" : "py-2.5 px-4 text-sm";

  return (
    <form onSubmit={handleSubmit} className="search-bar !p-0 overflow-hidden">
      <div className={`flex items-center gap-2 flex-1 ${padding}`}>
        <Search className="h-4 w-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-stone-900 placeholder:text-stone-400"
        />
      </div>
      <button
        type="submit"
        className={`shrink-0 ${size === "lg" ? "py-3 px-6 text-sm" : "py-2 px-4 text-xs"} bg-forest-500 text-white font-semibold rounded-full m-1 hover:bg-forest-600 transition-colors`}
      >
        Search
      </button>
    </form>
  );
}
