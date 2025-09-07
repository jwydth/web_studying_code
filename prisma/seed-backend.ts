// prisma/seed-backend.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Backend API Development...");

  const backend = await prisma.path.upsert({
    where: { slug: "backend-api" },
    update: {},
    create: {
      slug: "backend-api",
      title: "Backend API Development",
      summary:
        "Learn to build robust APIs with Node.js, Express, PostgreSQL, and REST best practices.",
    },
  });

  // ---- Skills
  const node = await prisma.skill.upsert({
    where: { id: "nodejs" },
    update: {},
    create: {
      id: "nodejs",
      pathId: backend.id,
      name: "Node.js",
      summary: "Runtime fundamentals and modules.",
    },
  });

  const express = await prisma.skill.upsert({
    where: { id: "express" },
    update: {},
    create: {
      id: "express",
      pathId: backend.id,
      name: "Express",
      summary: "HTTP routing, middleware, and controllers.",
    },
  });

  const postgres = await prisma.skill.upsert({
    where: { id: "postgresql" },
    update: {},
    create: {
      id: "postgresql",
      pathId: backend.id,
      name: "PostgreSQL",
      summary: "Relational schemas, SQL, and connections.",
    },
  });

  const rest = await prisma.skill.upsert({
    where: { id: "rest-apis" },
    update: {},
    create: {
      id: "rest-apis",
      pathId: backend.id,
      name: "REST APIs",
      summary: "Designing, documenting, and securing APIs.",
    },
  });

  // ---- DAG (prereqs)
  await prisma.skillEdge.upsert({
    where: { id: "node-to-express" },
    update: {},
    create: { id: "node-to-express", fromId: node.id, toId: express.id },
  });
  await prisma.skillEdge.upsert({
    where: { id: "node-to-postgres" },
    update: {},
    create: { id: "node-to-postgres", fromId: node.id, toId: postgres.id },
  });
  await prisma.skillEdge.upsert({
    where: { id: "express-to-rest" },
    update: {},
    create: { id: "express-to-rest", fromId: express.id, toId: rest.id },
  });
  await prisma.skillEdge.upsert({
    where: { id: "postgres-to-rest" },
    update: {},
    create: { id: "postgres-to-rest", fromId: postgres.id, toId: rest.id },
  });

  // ---- Lessons
  const lessons: Array<{
    id: string;
    title: string;
    contentMd: string;
    order: number;
    skillId: string;
  }> = [
      {
        id: "node-intro",
        title: "Node.js Fundamentals",
        order: 1,
        skillId: node.id,
        contentMd: `# Node.js Fundamentals

Node.js lets you run JavaScript on the server. You’ll learn the module system, the event loop, and how to read env vars.

## Hello CLI

\`\`\`bash
node -e "console.log('Hello from Node', process.version)"
\`\`\`

## Read a file

\`\`\`js
import { readFile } from 'node:fs/promises';
const txt = await readFile('README.md', 'utf8');
console.log(txt.slice(0, 80));
\`\`\`
`,
      },
      {
        id: "express-intro",
        title: "Express Basics",
        order: 1,
        skillId: express.id,
        contentMd: `# Express Basics

Express is a minimal web framework for Node.

## Minimal server

\`\`\`js
import express from 'express';
const app = express();
app.get('/ping', (req, res) => res.json({ ok: true }));
app.listen(3000, () => console.log('http://localhost:3000'));
\`\`\`

## Middleware

\`\`\`js
app.use(express.json());
app.post('/echo', (req, res) => res.json({ body: req.body }));
\`\`\`
`,
      },
      {
        id: "postgres-setup",
        title: "PostgreSQL Setup & Queries",
        order: 1,
        skillId: postgres.id,
        contentMd: `# PostgreSQL Setup & Queries

Install Postgres and a client (psql or GUI). Practice basic SQL.

## Create table and insert

\`\`\`sql
CREATE TABLE users(
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users(id, email) VALUES ('u1', 'a@example.com');
\`\`\`

## Node client

\`\`\`js
import pkg from 'pg';
const { Pool } = pkg;
const db = new Pool({ connectionString: process.env.DATABASE_URL });
const { rows } = await db.query('SELECT count(*) FROM users');
console.log(rows[0]);
\`\`\`
`,
      },
      {
        id: "rest-design",
        title: "REST API Design & Auth (JWT)",
        order: 2,
        skillId: rest.id,
        contentMd: `# REST API Design & Auth

Design resource-oriented URLs and use proper status codes. Protect endpoints with JWT.

## Routes

- \`GET /users\`
- \`POST /users\`
- \`GET /users/:id\`
- \`PATCH /users/:id\`
- \`DELETE /users/:id\`

## JWT auth (sketch)

\`\`\`js
import jwt from 'jsonwebtoken';

const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

app.get('/me', (req, res) => {
  const auth = req.headers.authorization ?? '';
  const [, t] = auth.split(' ');
  try {
    const payload = jwt.verify(t, process.env.JWT_SECRET);
    res.json({ ok: true, userId: payload.sub });
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
});
\`\`\`
`,
      },
    ];

  for (const l of lessons) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: {},
      create: { ...l, pathId: backend.id },
    });
  }

  console.log("✅ Backend path seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
