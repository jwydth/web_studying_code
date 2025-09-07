// src/app/api/paths/[slug]/progress/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readUserId } from "@/lib/user";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;            // ✅ await params

  const userId = await readUserId();

  const path = await prisma.path.findUnique({
    where: { slug },
    include: {
      skills: {
        include: {
          lessons: { select: { id: true } },
        },
      },
    },
  });

  if (!path) {
    return NextResponse.json({ error: "path not found" }, { status: 404 });
  }

  const allLessonIds = path.skills.flatMap((s) => s.lessons.map((l) => l.id));

  const progress = userId
    ? await prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: allLessonIds } },
      select: { lessonId: true, percent: true },
    })
    : [];

  const pctByLesson = new Map(progress.map((p) => [p.lessonId, p.percent]));

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

  return NextResponse.json({ nodes });
}
