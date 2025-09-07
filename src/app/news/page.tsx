import NewsFeed from "@/components/NewsFeed";
import { TrendingUp, Filter, Search } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="space-y-8 py-8">
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <TrendingUp className="w-8 h-8 text-orange-400" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Tech News
          </h1>
        </div>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Stay updated with the latest technology news, trends, and insights
          from top sources.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
          <Search className="w-4 h-4" />
          Search
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <div className="flex gap-2">
          {["All", "AI", "Web Dev", "Mobile", "DevOps"].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 rounded-full text-sm border border-slate-700 hover:border-slate-600 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <NewsFeed />
    </div>
  );
}

