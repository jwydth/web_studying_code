import NewsFeed from "@/components/NewsFeed";
import Playground from "@/components/Playground";
import QuizCard from "@/components/QuizCard";
import { Code, BookOpen, TrendingUp, Brain } from "lucide-react";
import FrontendPathPreview from "@/components/home/FrontendPathPreview";
import BackendPathPreview from "@/components/home/BackendPathPreview";
import FullstackPathPreview from "@/components/home/FullstackPathPreview";
import DevopsPathPreview from "@/components/home/DevopsPathPreview";

export default function Home() {
  const sampleCard = {
    id: "1",
    front: "What is the purpose of the `useState` hook in React?",
    back: "useState adds state to function components: [state, setState].",
    ef: 2.5,
    interval: 0,
    reps: 0,
  };

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
        {/* @ts-expect-error Server->Client boundary is fine */}
        <FrontendPathPreview />
      </section>

      {/* Backend */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-green-400" />
          Backend API Development Path
        </h2>
        {/* @ts-expect-error Server->Client boundary is fine */}
        <BackendPathPreview />
      </section>

      {/* Full-Stack Path */}
      <section>
        {/* @ts-expect-error Server → Client */}
        <FullstackPathPreview />
      </section>

      <section>
        {/* @ts-expect-error Server → Client */}
        <DevopsPathPreview />
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
