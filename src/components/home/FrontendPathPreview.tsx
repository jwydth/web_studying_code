import { prisma } from "@/lib/db";
import LivePathGraph from "@/components/LivePathGraph";
import type { Node, Edge } from "reactflow";

export default async function FrontendPathPreview() {
  try {
    const path = await prisma.path.findUnique({
      where: { slug: "frontend-foundations" },
      include: { skills: true },
    });

    if (!path) return null;

    const nodes: Node[] = path.skills.map((s) => ({
      id: s.id,
      type: "skill",
      data: { label: s.name, href: "/paths/frontend-foundations" },
      position: { x: 0, y: 0 },
    }));

    const skillIds = path.skills.map((s) => s.id);
    const edgesDb = await prisma.skillEdge.findMany({
      where: { fromId: { in: skillIds }, toId: { in: skillIds } },
      select: { id: true, fromId: true, toId: true },
    });

    const edges: Edge[] = edgesDb.map((e) => ({
      id: e.id,
      source: e.fromId,
      target: e.toId,
    }));

    return (
      <div className="space-y-3">
        <LivePathGraph
          slug="frontend-foundations"
          initialNodes={nodes}
          edges={edges}
        />
        <div className="text-right">
          <a
            href="/paths/frontend-foundations"
            className="text-sky-400 hover:text-sky-300 text-sm font-medium"
          >
            Open Frontend path →
          </a>
        </div>

      </div>
    );
  } catch {
    const fallbackNodes: Node[] = [
      {
        id: "start",
        type: "skill",
        data: {
          label: "Sample Intro",
          href: "/paths/frontend-foundations",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "next",
        type: "skill",
        data: {
          label: "Sample Next Step",
          href: "/paths/frontend-foundations",
        },
        position: { x: 0, y: 0 },
      },
    ];
    const fallbackEdges: Edge[] = [
      { id: "start-next", source: "start", target: "next" },
    ];
    return (
      <div className="space-y-3">
        <LivePathGraph
          slug="frontend-foundations"
          initialNodes={fallbackNodes}
          edges={fallbackEdges}
        />
        <div className="text-center text-sm opacity-70">
          Showing sample data. Connect a database to see the full path.
        </div>
      </div>
    );
  }
}
