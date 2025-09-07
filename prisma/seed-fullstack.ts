// prisma/seed-fullstack.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding: Full-Stack Mastery…");

  // 1) Path
  const path = await prisma.path.upsert({
    where: { slug: "fullstack-mastery" },
    update: {},
    create: {
      slug: "fullstack-mastery",
      title: "Full-Stack Mastery",
      summary:
        "Complete full-stack development with modern frameworks and deployment.",
    },
  });

  // Helper to make upserts easier
  const upsertSkill = (id: string, name: string, summary: string) =>
    prisma.skill.upsert({
      where: { id },
      update: {},
      create: { id, pathId: path.id, name, summary },
    });

  // 2) Skills (IDs are fixed strings to allow repeatable upserts)
  const tsSkill = await upsertSkill(
    "fs-ts",
    "TypeScript",
    "Type-safe JavaScript for large-scale apps."
  );
  const nextSkill = await upsertSkill(
    "fs-next",
    "Next.js",
    "React framework for app router, SSR/SSG and server actions."
  );
  const prismaSkill = await upsertSkill(
    "fs-prisma",
    "Prisma",
    "Type-safe ORM for Node & TypeScript."
  );
  const vercelSkill = await upsertSkill(
    "fs-vercel",
    "Vercel",
    "Fast, global deployments for your full-stack apps."
  );

  // 3) Edges (TypeScript -> Next.js -> Prisma -> Vercel)
  const upsertEdge = (id: string, fromId: string, toId: string) =>
    prisma.skillEdge.upsert({
      where: { id },
      update: {},
      create: { id, fromId, toId },
    });

  await upsertEdge("fs-edge-ts-next", tsSkill.id, nextSkill.id);
  await upsertEdge("fs-edge-next-prisma", nextSkill.id, prismaSkill.id);
  await upsertEdge("fs-edge-prisma-vercel", prismaSkill.id, vercelSkill.id);

  // 4) Lessons (one per skill is enough for progress to compute)
  const upsertLesson = (
    id: string,
    skillId: string,
    title: string,
    order: number,
    md: string
  ) =>
    prisma.lesson.upsert({
      where: { id },
      update: {},
      create: {
        id,
        pathId: path.id,
        skillId,
        title,
        order,
        contentMd: md,
      },
    });

  await upsertLesson(
    "fs-ts-intro",
    tsSkill.id,
    "TypeScript Fundamentals",
    1,
    `# TypeScript Fundamentals

- Why types help
- Basic types, interfaces, generics
- Narrowing & unions

\`\`\`ts
type User = { id: string; name: string }
function greet(u: User) { return "Hi " + u.name }
\`\`\`
`
  );

  await upsertLesson(
    "fs-next-intro",
    nextSkill.id,
    "Next.js App Router Basics",
    1,
    `# Next.js App Router

- Routing & layouts
- Server vs Client components
- Data fetching patterns
`
  );

  await upsertLesson(
    "fs-prisma-intro",
    prismaSkill.id,
    "Prisma ORM Basics",
    1,
    `# Prisma Basics

- Schema, models, relations
- Migrate & generate
- CRUD with Prisma Client
`
  );

  await upsertLesson(
    "fs-vercel-deploy",
    vercelSkill.id,
    "Deploy to Vercel",
    1,
    `# Deploy to Vercel

- Project settings
- Environment variables
- Preview & Production
`
  );

  console.log("✅ Full-Stack Mastery seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
