// src/components/home/FullStackPathPreview.tsx
import { prisma } from "@/lib/db";
import LivePathGraph from "@/components/LivePathGraph";
import { BookOpen } from "lucide-react";

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
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-purple-400" />
          Full-Stack Development Path
        </h2>
        <div className="text-sm opacity-70">Unable to load path preview.</div>
      </section>
    );
  }

}
