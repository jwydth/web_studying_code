"use client";
import { useState } from "react";

export type JsTest = { name: string; expr: string }; // expr should evaluate to true

export default function JsPlayground({
  initialCode = `// Implement sum(a,b) and make tests pass:
function sum(a, b){ return a + b }
console.log('sum(2,3)=', sum(2,3))`,
  tests = [
    { name: "sum(2,3) === 5", expr: "sum(2,3) === 5" },
    { name: "sum(-1,1) === 0", expr: "sum(-1,1) === 0" },
  ],
}: {
  initialCode?: string;
  tests?: JsTest[];
}) {
  const [code, setCode] = useState(initialCode);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<
    { name: string; ok: boolean }[] | null
  >(null);

  const run = () => {
    setLogs([]);
    setResults(null);

    // Build the script that runs inside the iframe
    const testCode = tests
      .map(
        (t, i) =>
          `try{ _res[${i}]={name:${JSON.stringify(t.name)}, ok:Boolean(${
            t.expr
          })} }catch(e){ _res[${i}]={name:${JSON.stringify(
            t.name
          )}, ok:false} }`
      )
      .join("\n");

    const html = `<!doctype html>
<html><head><meta charset="utf-8"></head><body>
<script>
  (function(){
    const out = [];
    const push = (v) => out.push(String(v));
    const origLog = console.log;
    console.log = (...a)=>{ push(a.map(x => (typeof x==='object'? JSON.stringify(x) : String(x))).join(' ')); origLog(...a) };

    try {
      ${code}
      const _res = [];
      ${testCode}
      parent.postMessage({ __jsplay: true, out, res: _res }, '*');
    } catch (e) {
      parent.postMessage({ __jsplay: true, out: [e.message], res: null }, '*');
    }
  })();
<\/script>
</body></html>`;

    // Create sandboxed iframe and load via srcdoc (no doc.open/write needed)
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const onMsg = (e: MessageEvent) => {
      if ((e.data as any)?.__jsplay) {
        setLogs((e.data as any).out || []);
        setResults((e.data as any).res || null);
        cleanup();
      }
    };

    const cleanup = () => {
      window.removeEventListener("message", onMsg);
      // small timeout to let browser finish painting logs
      setTimeout(() => iframe.remove(), 0);
    };

    window.addEventListener("message", onMsg);
    // load the HTML; this avoids races with contentDocument being null
    iframe.srcdoc = html;
  };

  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="rounded-xl border bg-white/5 p-2">
        <div className="text-xs opacity-70 mb-2">JavaScript</div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 bg-transparent outline-none"
        />
        <button onClick={run} className="mt-2 px-3 py-1 rounded-lg border">
          Run ▶
        </button>
      </div>

      <div className="space-y-2">
        <div className="rounded-xl border bg-black text-white text-xs p-2 h-28 overflow-auto">
          {logs.length ? (
            logs.map((l, i) => <div key={i}>{l}</div>)
          ) : (
            <div className="opacity-60">Console output…</div>
          )}
        </div>

        <div className="rounded-xl border bg-white/5 p-2">
          <div className="text-sm font-medium mb-1">Tests</div>
          {!results ? (
            <div className="text-xs opacity-70">Run to see test results.</div>
          ) : (
            <ul className="text-sm">
              {results.map((r, i) => (
                <li
                  key={i}
                  className={r.ok ? "text-green-400" : "text-red-400"}
                >
                  {r.ok ? "✓" : "✗"} {r.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
