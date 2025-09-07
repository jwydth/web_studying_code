"use client";
import * as React from "react";
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";

// Starter code shown in the editor
const starter = `function Counter(){
  const [n, setN] = React.useState(0)
  return (
    <div style={{display:'flex',gap:12,alignItems:'center'}}>
      <button onClick={()=>setN(n-1)}>–</button>
      <strong>{n}</strong>
      <button onClick={()=>setN(n+1)}>+</button>
    </div>
  )
}

render(<Counter />)
`;

export default function ReactLiveEditor({ code = starter }: { code?: string }) {
  // IMPORTANT: don't provide a custom "render" function.
  // react-live injects its own render() that mounts into <LivePreview/>.
  const scope = { React };

  return (
    <LiveProvider code={code} scope={scope} noInline>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border bg-white/5 overflow-hidden">
          <div className="text-xs opacity-70 p-2">React (JSX)</div>
          <LiveEditor className="p-2 text-sm leading-5" />
        </div>

        <div className="space-y-2">
          <div className="rounded-xl border bg-white/5 p-3">
            <div className="text-xs opacity-70 mb-1">Preview</div>
            <LivePreview />
          </div>

          {/* show runtime errors clearly */}
          <div className="rounded-xl border bg-red-500/10 text-red-300 text-xs p-2 min-h-6">
            <LiveError />
          </div>
        </div>
      </div>
    </LiveProvider>
  );
}
