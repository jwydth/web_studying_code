// src/app/api/progress/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureUserIdInRoute } from "@/lib/user";
import { ProgressStatus } from "@prisma/client";

interface ProgressBody {
  lessonId?: string;
  percent?: number;
  status?: ProgressStatus;
}

export async function POST(req: Request) {
  const userId = await ensureUserIdInRoute(); // sets uid cookie if missing

  let body: ProgressBody = {};
  try {
    body = (await req.json()) as ProgressBody;
  } catch {
    // ignore malformed JSON; we'll validate below
  }

  const { lessonId, percent, status } = body || {};
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  const pct = Math.max(0, Math.min(100, Math.round(Number(percent ?? 0))));
  const st =
    status ??
    (pct >= 100
      ? ProgressStatus.DONE
      : pct > 0
        ? ProgressStatus.IN_PROGRESS
        : ProgressStatus.NOT_STARTED);

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { percent: pct, status: st },
    create: { userId, lessonId, percent: pct, status: st },
  });

  return NextResponse.json({ ok: true, progress });
}
