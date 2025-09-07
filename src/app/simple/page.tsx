export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-5xl font-bold text-center mb-8">CodeStudy</h1>
        <p className="text-xl text-center text-slate-400 mb-12">
          Interactive coding paths, spaced repetition quizzes, and curated tech
          news.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
            <h3 className="font-semibold text-slate-100 mb-2">
              Interactive Coding
            </h3>
            <p className="text-sm text-slate-400">
              Practice with live code editors
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
            <h3 className="font-semibold text-slate-100 mb-2">Guided Paths</h3>
            <p className="text-sm text-slate-400">
              Follow structured learning roadmaps
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
            <h3 className="font-semibold text-slate-100 mb-2">Smart Quizzes</h3>
            <p className="text-sm text-slate-400">Spaced repetition system</p>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
            <h3 className="font-semibold text-slate-100 mb-2">Tech News</h3>
            <p className="text-sm text-slate-400">
              Stay updated with industry news
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


