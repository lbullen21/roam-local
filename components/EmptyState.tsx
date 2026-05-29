"use client";

import type { LucideIcon } from "lucide-react";

interface Props {
  icon?: LucideIcon;
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, message, action }: Props) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-12 px-6 border-dashed">
      {Icon && (
        <div className="mb-3 h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center">
          <Icon className="h-6 w-6 text-stone-500" />
        </div>
      )}
      <h3 className="font-semibold text-stone-900 mb-1">{title}</h3>
      {message && <p className="text-sm text-stone-600 max-w-md">{message}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-primary mt-4">
          {action.label}
        </button>
      )}
    </div>
  );
}
