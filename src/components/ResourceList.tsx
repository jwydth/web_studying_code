import Link from "next/link";

export type Resource = {
  title: string;
  provider: string;
  url: string;
  note?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
};

export default function ResourceList({ items }: { items: Resource[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {items.map((r, i) => (
        <Link
          key={i}
          href={r.url}
          target="_blank"
          className="p-4 rounded-2xl border bg-white/5 hover:bg-white/10"
        >
          <div className="text-sm uppercase opacity-60">
            {r.provider}
            {r.level ? ` · ${r.level}` : ""}
          </div>
          <div className="font-semibold">{r.title}</div>
          {r.note && <div className="text-sm opacity-80 mt-1">{r.note}</div>}
        </Link>
      ))}
    </div>
  );
}
