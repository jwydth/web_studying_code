// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

// Import the default functions you exported earlier
import seedFrontend from "./seed-frontend";
import seedBackend from "./seed-backend";
import seedDevops from "./seed-devops";
import seedFullstack from "./seed-fullstack";
import seedDsa from "./seed-dsa";

type Runner = { name: string; run: (p: PrismaClient) => Promise<void> };

const runners: Runner[] = [
  { name: "frontend", run: seedFrontend },
  { name: "backend", run: seedBackend },
  { name: "devops", run: seedDevops },
  { name: "fullstack", run: seedFullstack },
  { name: "dsa", run: seedDsa },
];

async function main() {
  const prisma = new PrismaClient();
  const only = new Set(process.argv.slice(2).map(s => s.toLowerCase()).filter(Boolean));
  const tStart = Date.now();

  try {
    for (const r of runners) {
      if (only.size && !only.has(r.name)) continue;
      const t0 = Date.now();
      console.log(`\n▶ Seeding ${r.name}…`);
      await r.run(prisma);
      console.log(`✅ ${r.name} done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    }
    console.log(`\n🎉 All seeds completed in ${((Date.now() - tStart) / 1000).toFixed(1)}s`);
  } catch (err) {
    console.error("\n❌ Error seeding database:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
