// src/components/ProgressChecklist.tsx
"use client";
import { useState } from "react";

export default function ProgressChecklist({
  lessonId,
  tasks,
  initialChecked = [],
}: {
  lessonId: string;
  tasks: string[];
  initialChecked?: boolean[];
}) {
  const [checked, setChecked] = useState<boolean[]>(
    initialChecked.length ? initialChecked : tasks.map(() => false)
  );

  async function save(lessonId: string, percent: number) {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          percent,
          status:
            percent === 100
              ? "DONE"
              : percent > 0
              ? "IN_PROGRESS"
              : "NOT_STARTED",
        }),
      });
      // 🔔 tell the page that progress changed
      window.dispatchEvent(
        new CustomEvent("progress-updated", { detail: { lessonId, percent } })
      );
    } catch {
      // optional: toast
    }
  }

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];

      const done = next.filter(Boolean).length;
      const percent = Math.round((done / tasks.length) * 100);
      void save(lessonId, percent);
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-white/10 p-4 space-y-3 bg-white/5">
      <div className="font-semibold">Your tasks</div>
      {tasks.map((t, i) => (
        <label key={i} className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={!!checked[i]}
            onChange={() => toggle(i)}
            className="h-4 w-4 accent-indigo-500"
          />
          <span>{t}</span>
        </label>
      ))}
      <div className="text-xs opacity-70">
        Progress saves automatically as you tick items.
      </div>
    </div>
  );
}
