"use client";
import { useEffect, useState } from "react";
import { Bookmark, ExternalLink } from "lucide-react";

type Item = {
  source: string;
  title: string;
  url: string;
  publishedAt?: string;
  summary?: string;
};

export default function NewsFeed() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/news")
      .then((r) => r.json())
      .then(({ items }) => setItems(items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-3">
      {loading && (
        <div className="animate-pulse text-sm opacity-70">Loading news…</div>
      )}
      {items.map((it, i) => (
        <div
          key={i}
          className="group p-4 rounded-2xl border border-slate-800 hover:border-slate-700 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase opacity-60 mb-1">
                {it.source}
              </div>
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="font-semibold leading-tight text-slate-100 group-hover:text-blue-400 transition-colors">
                  {it.title}
                </h3>
              </a>
              {it.summary && (
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                  {it.summary}
                </p>
              )}
              {it.publishedAt && (
                <div className="text-xs opacity-60 mt-2">
                  {new Date(it.publishedAt).toLocaleString()}
                </div>
              )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


