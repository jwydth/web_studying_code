// src/app/paths/frontend-foundations/page.tsx
import { prisma } from "@/lib/db";
import { readUserId } from "@/lib/user";
import Link from "next/link";
import LivePathGraph from "@/components/LivePathGraph";

export default async function FrontendPathPage() {
  const userId = await readUserId();

  const path = await prisma.path.findUnique({
    where: { slug: "frontend-foundations" },
    include: {
      skills: {
        include: {
          lessons: { select: { id: true, order: true, title: true } },
          outgoing: true, // Skill prerequisites (SkillEdge from -> to)
        },
      },
    },
  });
  if (!path) return <div className="p-6">Path not found</div>;

  // collect lesson progress for this user
  const allLessonIds = path.skills.flatMap((s) => s.lessons.map((l) => l.id));
  const progress = userId
    ? await prisma.lessonProgress.findMany({
        where: { userId, lessonId: { in: allLessonIds } },
        select: { lessonId: true, percent: true },
      })
    : [];
  const pctByLesson = new Map(progress.map((p) => [p.lessonId, p.percent]));

  // initial nodes (percent per skill = avg of its lessons)
  const nodes = path.skills.map((s) => {
    const ids = s.lessons.map((l) => l.id);
    const sum = ids.reduce((acc, id) => acc + (pctByLesson.get(id) ?? 0), 0);
    const percent = ids.length ? Math.round(sum / ids.length) : 0;

    return {
      id: s.id,
      type: "skill",
      position: { x: 0, y: 0 }, // laid out in PathGraph
      data: {
        label: s.name,
        href: `/paths/${path.slug}`,
        status: percent >= 100 ? "done" : "available",
        percent,
      },
    };
  });

  // edges from explicit prerequisites; fallback to simple chain if none
  const edges = path.skills.some((s) => s.outgoing.length > 0)
    ? path.skills.flatMap((s) =>
        s.outgoing.map((e) => ({
          id: e.id,
          source: e.fromId,
          target: e.toId,
        }))
      )
    : (() => {
        const ordered = [...path.skills].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const es = [];
        for (let i = 0; i < ordered.length - 1; i++) {
          es.push({
            id: `auto-${i}`,
            source: ordered[i].id,
            target: ordered[i + 1].id,
          });
        }
        return es;
      })();

  // lessons list
  const lessons = path.skills
    .flatMap((s) => s.lessons)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{path.title}</h1>
        <p className="opacity-80">{path.summary}</p>
      </header>

      {/* Graph section (live-updating on progress) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Frontend Development Path</h2>
        <div className="rounded-3xl border border-white/10">
          {/* @ts-expect-error Server -> Client boundary is expected */}
          <LivePathGraph slug={path.slug} initialNodes={nodes} edges={edges} />
        </div>
      </section>

      {/* Lessons grid */}
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
}
