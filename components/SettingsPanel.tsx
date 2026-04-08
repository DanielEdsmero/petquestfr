'use client';

import { useState } from 'react';

export function SettingsPanel() {
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-base font-semibold">Settings</h3>
      <label className="mt-4 flex items-center justify-between text-sm">
        <span>Reduce motion</span>
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(event) => setReducedMotion(event.target.checked)}
        />
      </label>
    </section>
  );
}
