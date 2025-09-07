// src/components/HtmlPlayground.tsx
"use client";
import { useLayoutEffect, useRef, useState } from "react";

export default function HtmlPlayground() {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState("<h1>Hello, world!</h1>");
  const [css, setCss] = useState(
    "body{font-family:system-ui;padding:1rem} h1{letter-spacing:.5px}"
  );
  const [js, setJs] = useState('console.log("JS is running!")');

  // Keep right column the same height as left
  useLayoutEffect(() => {
    if (!leftRef.current || !rightRef.current) return;
    const apply = () => {
      rightRef.current!.style.height = leftRef.current!.offsetHeight + "px";
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(leftRef.current);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  // Build the preview document
  const srcDoc = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    try { ${js} } catch(e) { console.error(e); }
  <\/script>
</body>
</html>`;

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* LEFT: editors */}
      <div ref={leftRef} className="space-y-3">
        <Editor label="HTML" value={html} onChange={setHtml} />
        <Editor label="CSS" value={css} onChange={setCss} />
        <Editor label="JS" value={js} onChange={setJs} />
      </div>

      {/* RIGHT: preview (height matched to left) */}
      <div
        ref={rightRef}
        className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col overflow-hidden"
        style={{ height: 0 }} // gets set by the effect
      >
        <div className="text-sm font-semibold mb-2 opacity-80">Preview</div>
        <iframe
          title="preview"
          className="flex-1 rounded-lg border border-white/10 bg-white/5"
          sandbox="allow-scripts"
          srcDoc={srcDoc}
        />
        <div className="mt-3 h-28 rounded-lg border border-white/10 bg-black/70 text-green-400 p-2 text-xs overflow-auto">
          {/* If you pipe console to this div, you can show logs here */}
          <em>Open DevTools console to see logs.</em>
        </div>
      </div>
    </div>
  );
}

function Editor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="px-3 py-1.5 text-xs font-semibold opacity-70">
        {label}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-36 bg-transparent outline-none px-3 pb-3 resize-vertical"
        spellCheck={false}
      />
    </div>
  );
}
