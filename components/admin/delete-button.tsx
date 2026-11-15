'use client';

import { useState } from 'react';

/** Two-step delete: first click asks, second click submits. Avoids blocking browser dialogs. */
export function DeleteButton({ children, confirmText = 'Are you sure?', compact = false }: { children: React.ReactNode; confirmText?: string; compact?: boolean }) {
  const [armed, setArmed] = useState(false);
  const base = compact ? 'h-10 px-3 text-sm' : 'h-11 px-4 text-sm';
  if (!armed) {
    return (
      <button type="button" onClick={() => setArmed(true)} className={`inline-flex items-center gap-1.5 rounded-full border border-line font-medium text-red-700 hover:bg-red-500/10 dark:text-red-300 ${base}`}>
        {children}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span className="hidden text-sm text-muted sm:inline">{confirmText}</span>
      <button type="submit" className={`inline-flex items-center rounded-full bg-red-600 font-semibold text-white hover:bg-red-700 ${base}`}>
        Yes, delete
      </button>
      <button type="button" onClick={() => setArmed(false)} className={`inline-flex items-center rounded-full border border-line font-medium text-heading ${base}`}>
        Cancel
      </button>
    </span>
  );
}
