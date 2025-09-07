import { prisma } from "@/lib/db";
import Link from "next/link";
import LivePathGraph from "@/components/LivePathGraph";

export default async function FullStackPathPage() {
  const path = await prisma.path.findUnique({
    where: { slug: "fullstack-mastery" },
    include: { skills: { include: { lessons: true } } },
  });
  if (!path) return <div className="p-6">Path not found</div>;

  const lessons = path.skills
    .flatMap((s) => s.lessons)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{path.title}</h1>
        <p className="opacity-80">{path.summary}</p>
      </header>

      {/* @ts-expect-error Server -> Client bridge */}
      <LivePathGraph slug="fullstack-mastery" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Lessons</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {lessons.map((l) => (
            <Link
              key={l.id}
              href={`/learn/${l.id}`}
              className="block p-4 rounded-2xl border bg-white/5 hover:shadow-sm"
            >
              <div className="font-semibold">{l.title}</div>
              <div className="text-xs opacity-60">Order {l.order}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
