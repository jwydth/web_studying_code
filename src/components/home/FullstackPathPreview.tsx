// src/components/home/FullStackPathPreview.tsx
import { prisma } from "@/lib/db";
import LivePathGraph from "@/components/LivePathGraph";
import { BookOpen } from "lucide-react";
import type { Node, Edge } from "reactflow";

export default async function FullStackPathPreview() {
  const slug = "fullstack-mastery"; // <- exact slug you seeded
  try {
    const path = await prisma.path.findUnique({
      where: { slug },
      select: { id: true },
    });

    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-purple-400" />
          Full-Stack Development Path
        </h2>
        {path ? (
          <LivePathGraph slug={slug} initialNodes={[]} edges={[]} />
        ) : (
          <div className="text-sm opacity-70">
            Path “{slug}” not found. Seed it first (e.g., run your full-stack
            seed script).
          </div>
        )}
      </section>
    );
  } catch {
    const fallbackNodes: Node[] = [
      {
        id: "start",
        type: "skill",
        data: { label: "Sample Intro", href: `/paths/${slug}` },
        position: { x: 0, y: 0 },
      },
      {
        id: "next",
        type: "skill",
        data: { label: "Sample Next Step", href: `/paths/${slug}` },
        position: { x: 0, y: 0 },
      },
    ];
    const fallbackEdges: Edge[] = [
      { id: "start-next", source: "start", target: "next" },
    ];
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-purple-400" />
          Full-Stack Development Path
        </h2>
        <LivePathGraph slug={slug} initialNodes={fallbackNodes} edges={fallbackEdges} />
        <div className="text-center text-sm opacity-70">
          Showing sample data. Connect a database to see the full path.
        </div>
      </section>
    );
  }

}
