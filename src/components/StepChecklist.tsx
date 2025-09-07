"use client";
import { useEffect, useState } from "react";

export default function StepChecklist({
  storageKey,
  steps,
}: {
  storageKey: string;
  steps: string[];
}) {
  const [done, setDone] = useState<boolean[]>(Array(steps.length).fill(false));
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setDone(JSON.parse(saved));
    } catch {}
  }, [storageKey]);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(done));
    } catch {}
  }, [done, storageKey]);

  return (
    <div className="p-4 rounded-2xl border bg-white/5 space-y-2">
      <div className="font-medium">Your tasks</div>
      {steps.map((s, i) => (
        <label key={i} className="flex gap-2 items-start">
          <input
            type="checkbox"
            checked={done[i]}
            onChange={(e) =>
              setDone((d) =>
                d.map((v, idx) => (idx === i ? e.target.checked : v))
              )
            }
          />
          <span className={done[i] ? "line-through opacity-60" : ""}>{s}</span>
        </label>
      ))}
    </div>
  );
}
