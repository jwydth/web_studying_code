// src/components/ProgressPill.tsx
"use client";
import { useEffect, useState } from "react";

export default function ProgressPill({
  lessonId,
  initialPercent,
}: {
  lessonId: string;
  initialPercent: number;
}) {
  const [percent, setPercent] = useState(initialPercent);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ lessonId: string; percent: number }>;
      if (ce.detail?.lessonId === lessonId) setPercent(ce.detail.percent);
    };
    window.addEventListener("progress-updated", handler as EventListener);
    return () =>
      window.removeEventListener("progress-updated", handler as EventListener);
  }, [lessonId]);

  return (
    <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
      {percent}% complete
    </div>
  );
}
