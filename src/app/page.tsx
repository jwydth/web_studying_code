import NewsFeed from "@/components/NewsFeed";
import Playground from "@/components/Playground";
import { Code, BookOpen, TrendingUp } from "lucide-react";
import FrontendPathPreview from "@/components/home/FrontendPathPreview";
import BackendPathPreview from "@/components/home/BackendPathPreview";
import FullstackPathPreview from "@/components/home/FullstackPathPreview";
import DevopsPathPreview from "@/components/home/DevopsPathPreview";
import DSAPathPreview from "@/components/home/DSAPathPreview";

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      {/* ...hero & features... */}

      {/* News */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-orange-400" />
          Trending Tech News
        </h2>
        <NewsFeed />
      </section>

      {/* Frontend (only once) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-green-400" />
          Frontend Development Path
        </h2>
        <FrontendPathPreview />
      </section>

      {/* Backend */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-green-400" />
          Backend API Development Path
        </h2>
        <BackendPathPreview />
      </section>

      {/* Full-Stack Path */}
      <section>
        <FullstackPathPreview />
      </section>

      <section>
        <DevopsPathPreview />
      </section>

      <section className="mt-10 space-y-6">
        <DSAPathPreview />
      </section>

      {/* Code playground below, larger card */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Code className="w-6 h-6 text-blue-400" />
          Code Playground
        </h2>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 shadow-lg ring-1 ring-white/5">
          {/* If you add the optional height prop below, pass it here */}
          {/* <Playground height={560} /> */}
          <Playground />
        </div>
      </div>
    </div>
  );
}
