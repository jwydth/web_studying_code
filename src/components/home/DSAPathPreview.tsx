import { prisma } from "@/lib/db";
import LivePathGraph from "@/components/LivePathGraph";
import Link from "next/link";
// If your lucide version doesn't have Binary, swap to Sigma or Braces.
import { Binary } from "lucide-react";
import type { Node, Edge } from "reactflow";

export default async function DSAPathPreview() {
  const slug = "dsa-algorithms";
  try {
    // Light guard so the section still renders if you haven’t seeded yet
    const exists = await prisma.path.findUnique({
      where: { slug },
      select: { id: true, title: true },
    });

    return (
      <section className="w-full space-y-4">
        {/* Title row — same vibe as DevOps */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="inline-grid h-7 w-7 place-items-center rounded-lg
                           bg-gradient-to-br from-fuchsia-500/30 to-sky-500/30
                           ring-1 ring-white/10"
            >
              <Binary className="h-4 w-4 text-fuchsia-300" />
            </span>
            <h2 className="text-xl md:text-2xl font-semibold">
              DSA &amp; Algorithms Path
            </h2>
          </div>

          <Link
            href="/paths/dsa-algorithms"
            className="text-sm opacity-80 hover:opacity-100"
          >
            View Path →
          </Link>
        </div>

        {/* Full-width graph container (same look as DevOps) */}
        <div className="rounded-3xl border border-white/10 bg-white/5">
          <LivePathGraph slug={slug} initialNodes={[]} edges={[]} />
        </div>

        {!exists && (
          <p className="text-xs opacity-70">
            Path not found. Seed with <code>npx tsx prisma/seed-dsa.ts</code>.
          </p>
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
      <section className="w-full space-y-4">
        <div className="flex items-center gap-3">
          <span
            className="inline-grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500/30 to-sky-500/30 ring-1 ring-white/10"
          >
            <Binary className="h-4 w-4 text-fuchsia-300" />
          </span>
          <h2 className="text-xl md:text-2xl font-semibold">
            DSA &amp; Algorithms Path
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5">
          <LivePathGraph
            slug={slug}
            initialNodes={fallbackNodes}
            edges={fallbackEdges}
          />
        </div>
        <div className="text-center text-sm opacity-70">
          Showing sample data. Connect a database to see the full path.
        </div>
      </section>
    );
  }

}
