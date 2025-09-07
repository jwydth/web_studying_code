export default function TestPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold text-blue-400 mb-4">Test Page</h1>
      <p className="text-lg text-slate-300">
        If you can see this with proper styling, Tailwind CSS is working!
      </p>
      <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <h2 className="text-xl font-semibold text-green-400 mb-2">
          Styling Test
        </h2>
        <p className="text-slate-400">
          This should have a dark background, green heading, and proper spacing.
        </p>
      </div>
    </div>
  );
}


