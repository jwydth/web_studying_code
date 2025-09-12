// src/components/home/DevopsPathPreview.tsx
import { prisma } from "@/lib/db";
import LivePathGraph from "@/components/LivePathGraph";
import { ServerCog } from "lucide-react";

export default async function DevopsPathPreview() {
  const slug = "devops-cloud";
  try {
    const exists = await prisma.path.findUnique({
      where: { slug },
      select: { id: true },
    });

    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ServerCog className="w-6 h-6 text-sky-400" />
          DevOps & Cloud Path
        </h2>
        {exists ? (
          <LivePathGraph slug={slug} initialNodes={[]} edges={[]} />
        ) : (
          <div className="text-sm opacity-70">
            Path &quot;devops-cloud&quot; not found. Run{' '}
            <code>npx tsx prisma/seed-devops.ts</code>.
          </div>
        )}
      </section>
    );
  } catch {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <ServerCog className="w-6 h-6 text-sky-400" />
          DevOps & Cloud Path
        </h2>
        <div className="text-sm opacity-70">Unable to load path preview.</div>
      </section>
    );
  }

}
