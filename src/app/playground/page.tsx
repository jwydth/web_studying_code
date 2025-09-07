import Playground from "@/components/Playground";
import { Code } from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div className="space-y-8 py-8">
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Code className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Code Playground
          </h1>
        </div>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Practice JavaScript, experiment with code, and see results instantly
          in your browser.
        </p>
      </header>

      <Playground />
    </div>
  );
}


