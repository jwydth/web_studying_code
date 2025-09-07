import PathGraph from "@/components/PathGraph";
import { prisma } from "@/lib/db";
import type { Edge, Node } from "reactflow";

export default async function FrontendGraph() {
  const path = await prisma.path.findUnique({
    where: { slug: "frontend-foundations" },
    include: { skills: true },
  });
  if (!path) return null;

  const skills = path.skills;
  const edgesDb = await prisma.skillEdge.findMany({
    where: {
      fromId: { in: skills.map((s) => s.id) },
      toId: { in: skills.map((s) => s.id) },
    },
  });

  // map skills to graph nodes
  const nodes: Node[] = skills.map((s) => ({
    id: s.id,
    type: "skill",
    position: { x: 0, y: 0 }, // Dagre will set
    data: {
      label: s.name,
      href: `/paths/${path.slug}?skill=${s.id}`, // or jump to first lesson if you prefer
      status: "available", // TODO: compute from LessonProgress
      percent: 0, // TODO: compute from completed lessons
    },
  }));

  // map edges
  const edges: Edge[] = edgesDb.map((e) => ({
    id: e.id,
    source: e.fromId,
    target: e.toId,
  }));

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Frontend Development Path</h2>
      {/* @ts-expect-error Server Component child */}
      <PathGraph nodesInput={nodes} edgesInput={edges} />
    </section>
  );
}
