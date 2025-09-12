// src/app/paths/devops-cloud/page.tsx
import { prisma } from "@/lib/db";
import Link from "next/link";
import LivePathGraph from "@/components/LivePathGraph";
import type { Node, Edge } from "reactflow";

export const dynamic = "force-dynamic";

export default async function DevopsPathPage() {
  const slug = "devops-cloud";
  try {
    const path = await prisma.path.findUnique({
      where: { slug },
      include: { skills: { include: { lessons: true } } },
    });
    if (!path) return <div className="p-6">Path not found</div>;

    const lessons = path.skills
      .flatMap((s) => s.lessons)
      .sort((a, b) => a.order - b.order);

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    return (
      <div className="space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">{path.title}</h1>
          <p className="opacity-80">{path.summary}</p>
        </header>

        {/* Live graph with progress */}
        <LivePathGraph slug={slug} initialNodes={nodes} edges={edges} />


        {/* Lessons */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Lessons</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {lessons.map((l) => (
              <Link
                key={l.id}
                href={`/learn/${l.id}`}
                className="block p-4 rounded-2xl border hover:shadow-sm bg-white/5"
              >
                <div className="font-semibold">{l.title}</div>
                <div className="text-xs opacity-60">Order {l.order}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  } catch {
    return <div className="p-6">Unable to load path</div>;
  }
}
