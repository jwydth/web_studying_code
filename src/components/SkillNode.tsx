"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Lock, Check } from "lucide-react";
import type { NodeProps } from "reactflow";

export type SkillNodeData = {
  label: string;
  href?: string;
  percent?: number; // 0..100
  status?: "locked" | "available" | "done";
};

export default function SkillNode({
  data,
  selected,
}: NodeProps<SkillNodeData>) {
  const router = useRouter();
  const status = data.status ?? "available";
  const percent = Math.max(0, Math.min(100, Math.round(data.percent ?? 0)));
  const clickable = !!data.href && status !== "locked";

  return (
    <div
      onClick={() => clickable && router.push(data.href!)}
      className={[
        "group w-[220px] cursor-pointer rounded-2xl px-4 py-3 shadow-lg ring-1 transition",
        "bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/10",
        selected ? "ring-sky-400/70" : "ring-white/10 hover:ring-white/20",
        !clickable && "cursor-default opacity-80",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl grid place-items-center bg-sky-500/15 ring-1 ring-sky-400/30">
          <BookOpen className="h-4 w-4 text-sky-300" />
        </div>
        <div className="font-semibold tracking-wide">{data.label}</div>
        {status === "locked" && <Lock className="ml-auto h-4 w-4 opacity-70" />}
        {status === "done" && (
          <Check className="ml-auto h-4 w-4 text-emerald-400" />
        )}
      </div>

      <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-1 text-[11px] opacity-70">{percent}% complete</div>
    </div>
  );
}
