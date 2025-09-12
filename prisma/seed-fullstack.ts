// prisma/seed-fullstack.ts
import { PrismaClient } from "@prisma/client";
import { pathToFileURL } from "node:url";
import nodePath from "node:path";

/** Importable seeder:
 *   import seedFullstack from "./seed-fullstack";
 *   await seedFullstack(prisma);
 */
export default async function seedFullstack(prisma: PrismaClient) {
  console.log("🌱 Seeding: Full-Stack Mastery…");

  // 1) Path
  const pathRow = await prisma.path.upsert({
    where: { slug: "fullstack-mastery" },
    update: {},
    create: {
      slug: "fullstack-mastery",
      title: "Full-Stack Mastery",
      summary:
        "Complete full-stack development with modern frameworks and deployment.",
    },
  });

  // Helpers
  const upsertSkill = (id: string, name: string, summary: string) =>
    prisma.skill.upsert({
      where: { id },
      update: {},
      create: { id, pathId: pathRow.id, name, summary },
    });

  const upsertEdge = (id: string, fromId: string, toId: string) =>
    prisma.skillEdge.upsert({
      where: { id },
      update: {},
      create: { id, fromId, toId },
    });

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
        pathId: pathRow.id,
        skillId,
        title,
        order,
        contentMd: md,
      },
    });

  // 2) Skills
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

  // 3) Edges (TS -> Next -> Prisma -> Vercel)
  await upsertEdge("fs-edge-ts-next", tsSkill.id, nextSkill.id);
  await upsertEdge("fs-edge-next-prisma", nextSkill.id, prismaSkill.id);
  await upsertEdge("fs-edge-prisma-vercel", prismaSkill.id, vercelSkill.id);

  // 4) Lessons
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

/** Allow running this file directly: `tsx prisma/seed-fullstack.ts` */
const isDirect =
  process.argv[1] &&
  import.meta.url === pathToFileURL(nodePath.resolve(process.argv[1]!)).href;

if (isDirect) {
  const prisma = new PrismaClient();
  seedFullstack(prisma)
    .catch((e) => {
      console.error("❌ Seed error:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
