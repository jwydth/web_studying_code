"use client";
import { JSX, useEffect, useMemo, useRef, useState } from "react";

/**
 * Minimal framework for animated code walkthroughs.
 * - Highlights the current line with a moving gutter cursor (animated).
 * - Run / Pause / Step / Reset controls with speed.
 * - Hover any line to see a tooltip explanation.
 * - Shows an algorithm "state" panel (e.g., array with i/j/mid pointers).
 */

type Step = {
  line: number; // 1-based line number to highlight
  note?: string; // optional annotation for this step
  delay?: number; // ms delay override for this step
  state?: Record<string, any>; // variables you want to visualize
};

type Example = {
  id: string;
  title: string;
  code: string; // raw source shown to the user
  explanations?: Record<number, string>; // per-line hover tooltips
  steps: Step[]; // precomputed execution steps
  renderState?: (s: Record<string, any>) => JSX.Element | null;
};

type Props = {
  exampleId: string;
  examples?: Record<string, Example>;
  className?: string;
  autoStart?: boolean;
  initialSpeedMs?: number; // time per step
};

/* ----------------------- Built-in Examples ----------------------- */

/** Two Pointers on a sorted array: find pair that sums to target */
const EX_TWO_POINTERS: Example = {
  id: "two-pointers",
  title: "Two Pointers (sorted two-sum)",
  code: `function twoSumSorted(arr, target) {
  let i = 0;                 // left pointer
  let j = arr.length - 1;    // right pointer

  while (i < j) {
    const sum = arr[i] + arr[j];

    if (sum === target) {
      return [i, j];
    } else if (sum < target) {
      i++;                   // need a larger sum
    } else {
      j--;                   // need a smaller sum
    }
  }

  return null;
}

// Example:
const arr = [1, 2, 3, 5, 8, 13, 21];
twoSumSorted(arr, 26);`,
  explanations: {
    1: "Function header. Assumes the array is SORTED.",
    2: "Initialize left pointer i to the start.",
    3: "Initialize right pointer j to the end.",
    5: "Loop until the pointers meet.",
    6: "Compute the current pair sum.",
    8: "If sum matches the target, return indices.",
    10: "If sum is too small, move i right to increase sum.",
    12: "If sum is too large, move j left to decrease sum.",
    16: "No pair found; return null.",
    20: "Sample input.",
    21: "Call the function with arr and target 26.",
  },
  steps: [
    { line: 1, state: {} },
    {
      line: 2,
      state: { i: 0, j: 6, arr: [1, 2, 3, 5, 8, 13, 21], target: 26 },
    },
    {
      line: 3,
      state: { i: 0, j: 6, arr: [1, 2, 3, 5, 8, 13, 21], target: 26 },
    },
    { line: 5, state: { i: 0, j: 6 } },
    { line: 6, state: { i: 0, j: 6, sum: 1 + 21 } },
    { line: 10, state: { i: 1, j: 6 } },
    { line: 5, state: { i: 1, j: 6 } },
    { line: 6, state: { i: 1, j: 6, sum: 2 + 21 } },
    { line: 10, state: { i: 2, j: 6 } },
    { line: 5, state: { i: 2, j: 6 } },
    { line: 6, state: { i: 2, j: 6, sum: 3 + 21 } },
    { line: 10, state: { i: 3, j: 6 } },
    { line: 5, state: { i: 3, j: 6 } },
    { line: 6, state: { i: 3, j: 6, sum: 5 + 21 } },
    { line: 8, state: { i: 3, j: 6, sum: 26, result: [3, 6] } },
  ],
  renderState: (s) => (
    <ArrayViz arr={s.arr} i={s.i} j={s.j} mid={undefined} target={s.target} />
  ),
};

/** Binary Search example */
const EX_BINARY_SEARCH: Example = {
  id: "binary-search",
  title: "Binary Search",
  code: `function binarySearch(arr, x) {
  let lo = 0;
  let hi = arr.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === x) return mid;
    if (arr[mid] < x) lo = mid + 1;
    else hi = mid - 1;
  }

  return -1;
}

// Example:
const arr = [1, 3, 5, 7, 9, 11, 13];
binarySearch(arr, 9);`,
  explanations: {
    1: "Classic binary search on a sorted array.",
    2: "Start lo at the first index.",
    3: "Start hi at the last index.",
    5: "Loop while the search space is non-empty.",
    6: "Pick the middle index.",
    7: "Check if the middle value equals x.",
    8: "If middle is too small, search the right half.",
    9: "Otherwise, search the left half.",
    12: "Not found.",
    16: "Sample input.",
    17: "Search for 9.",
  },
  steps: [
    { line: 1, state: {} },
    { line: 2, state: { lo: 0, hi: 6, x: 9, arr: [1, 3, 5, 7, 9, 11, 13] } },
    { line: 3, state: { lo: 0, hi: 6, x: 9, arr: [1, 3, 5, 7, 9, 11, 13] } },
    { line: 5, state: { lo: 0, hi: 6 } },
    { line: 6, state: { lo: 0, hi: 6, mid: 3 } },
    { line: 7, state: { mid: 3, val: 7 } },
    { line: 8, state: { lo: 4, hi: 6 } },
    { line: 5, state: { lo: 4, hi: 6 } },
    { line: 6, state: { lo: 4, hi: 6, mid: 5 } },
    { line: 7, state: { mid: 5, val: 11 } },
    { line: 9, state: { lo: 4, hi: 4 } },
    { line: 5, state: { lo: 4, hi: 4 } },
    { line: 6, state: { lo: 4, hi: 4, mid: 4 } },
    { line: 7, state: { mid: 4, val: 9, result: 4 } },
  ],
  renderState: (s) => (
    <ArrayViz
      arr={s.arr}
      i={undefined}
      j={undefined}
      mid={s.mid}
      target={s.x}
      lo={s.lo}
      hi={s.hi}
    />
  ),
};

const BUILTIN: Record<string, Example> = {
  [EX_TWO_POINTERS.id]: EX_TWO_POINTERS,
  [EX_BINARY_SEARCH.id]: EX_BINARY_SEARCH,
};

/* ----------------------- Small array renderer ----------------------- */

function ArrayViz({
  arr,
  i,
  j,
  mid,
  lo,
  hi,
  target,
}: {
  arr?: number[];
  i?: number;
  j?: number;
  mid?: number;
  lo?: number;
  hi?: number;
  target?: number;
}) {
  if (!arr) return null;
  return (
    <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      <div className="mb-2 text-xs text-slate-400">
        {target !== undefined && (
          <>
            target: <span className="text-slate-200">{String(target)}</span>
          </>
        )}
        {lo !== undefined && (
          <>
            {" "}
            &middot; lo=<span className="text-slate-200">{lo}</span>
          </>
        )}
        {hi !== undefined && (
          <>
            {" "}
            &middot; hi=<span className="text-slate-200">{hi}</span>
          </>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {arr.map((v, idx) => {
          const isI = i === idx;
          const isJ = j === idx;
          const isM = mid === idx;
          const isLO = lo === idx;
          const isHI = hi === idx;
          return (
            <div key={idx} className="relative">
              <div
                className={[
                  "w-12 h-12 flex items-center justify-center rounded-lg border text-sm",
                  "border-slate-800 bg-slate-800/60 text-slate-200",
                  isI || isJ || isM ? "ring-2 ring-blue-500" : "",
                ].join(" ")}
              >
                {v}
              </div>
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 whitespace-nowrap">
                {isI && "i"}
                {isJ && "j"}
                {isM && "mid"}
                {isLO && "lo"}
                {isHI && "hi"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------- Main Visualizer ----------------------- */

export default function AlgorithmViz({
  exampleId,
  examples,
  className,
  autoStart = false,
  initialSpeedMs = 900,
}: Props) {
  const library = useMemo(
    () => ({ ...BUILTIN, ...(examples || {}) }),
    [examples]
  );
  const ex = library[exampleId];

  const [idx, setIdx] = useState(0); // current step index
  const [playing, setPlaying] = useState(autoStart);
  const [speed, setSpeed] = useState(initialSpeedMs);
  const [hoverLine, setHoverLine] = useState<number | null>(null);

  const steps = ex?.steps || [];
  const active = steps[idx];
  const done = idx >= steps.length - 1;

  // Run loop
  useEffect(() => {
    if (!playing || done) return;
    const delay = active?.delay ?? speed;
    const t = setTimeout(
      () => setIdx((n) => Math.min(n + 1, steps.length - 1)),
      delay
    );
    return () => clearTimeout(t);
  }, [playing, idx, speed, active?.delay, steps.length, done]);

  // --- NEW: measure the actual rendered row height so cursor aligns perfectly
  const measurerRef = useRef<HTMLDivElement>(null);
  const [rowH, setRowH] = useState(24);

  useEffect(() => {
    if (!measurerRef.current) return;
    const el = measurerRef.current;
    const styles = window.getComputedStyle(el);
    const lh = parseFloat(styles.lineHeight);
    const rectH = el.getBoundingClientRect().height;
    const computed = Number.isFinite(lh) && lh > 0 ? lh : rectH || 24;
    setRowH(computed);
  }, []);

  // Cursor Y offset in px
  const cursorY = useMemo(() => {
    const line = active?.line ?? 1;
    return (line - 1) * rowH;
  }, [active?.line, rowH]);

  if (!ex) {
    return (
      <div className="rounded-xl border border-red-800/50 bg-red-900/20 p-4 text-red-200">
        Unknown example: <code>{exampleId}</code>
      </div>
    );
  }

  const lines = ex.code.split("\n");

  return (
    <div
      className={[
        "rounded-2xl border border-slate-800 bg-slate-900/50 p-4",
        className,
      ].join(" ")}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-slate-100">{ex.title}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-lg bg-blue-600/80 px-3 py-1 text-sm text-white hover:bg-blue-600"
          >
            {playing ? "Pause" : "Run"}
          </button>
          <button
            onClick={() => setIdx((n) => Math.min(n + 1, steps.length - 1))}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-100 hover:bg-slate-700"
          >
            Step
          </button>
          <button
            onClick={() => {
              setIdx(0);
              setPlaying(false);
            }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-100 hover:bg-slate-700"
          >
            Reset
          </button>

          <div className="ml-2 flex items-center gap-2 text-xs text-slate-400">
            Speed
            <input
              type="range"
              min={200}
              max={1500}
              step={50}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Code panel */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        {/* moving gutter cursor: high-contrast cyan gradient + glow bar */}
        <div
          className="pointer-events-none absolute left-0 top-0 z-0 w-full"
          style={{
            transform: `translateY(${cursorY}px)`,
            transition: "transform 220ms ease",
            height: rowH,
          }}
        >
          {/* soft gradient sweep across the current row */}
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(34,211,238,.42) 0%, rgba(34,211,238,.22) 38%, rgba(34,211,238,.10) 70%, transparent 100%)",
            }}
          />
          {/* bright left accent bar + glow */}
          <div className="absolute left-0 top-0 h-full w-[3px] bg-cyan-400/95 shadow-[0_0_14px_rgba(34,211,238,.9)]" />
        </div>

        {/* code lines */}
        <div className="relative z-10">
          {/* hidden row to measure line height accurately */}
          <div
            ref={measurerRef}
            className="invisible absolute -top-10 left-0 w-full font-mono text-[13px] leading-6"
          >
            <div className="flex items-start gap-3 px-3">
              <div className="w-7" />
              <div className="flex-1">X</div>
            </div>
          </div>

          {lines.map((text, i) => {
            const line = i + 1;
            const isActive = active?.line === line;
            const explain = ex.explanations?.[line];
            return (
              <div
                key={i}
                onMouseEnter={() => setHoverLine(line)}
                onMouseLeave={() =>
                  setHoverLine((l) => (l === line ? null : l))
                }
                className={[
                  "group relative flex items-start gap-3 px-3 transition-colors",
                  "font-mono text-[13px]",
                  isActive
                    ? "bg-cyan-500/18 text-slate-100 ring-1 ring-cyan-400/25"
                    : "text-slate-300/90",
                ].join(" ")}
                style={{ height: rowH, lineHeight: `${rowH}px` }}
              >
                <div className="select-none w-7 text-right text-slate-500">
                  {line}
                </div>
                <div className="flex-1 whitespace-pre">{text}</div>

                {/* hover tooltip */}
                {explain && hoverLine === line && (
                  <div className="absolute left-[55%] z-20 mt-6 w-72 rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-slate-200 shadow-xl">
                    {explain}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step note + state */}
      {(active?.note || active?.state) && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-sm text-slate-200">
            <div className="mb-1 text-xs uppercase tracking-wide text-slate-400">
              Step
            </div>
            <div>
              Line{" "}
              <span className="text-blue-300 font-semibold">{active.line}</span>
            </div>
            {active.note && (
              <div className="mt-1 text-slate-300">{active.note}</div>
            )}
          </div>
          <div>{ex.renderState?.(active.state || {}) ?? null}</div>
        </div>
      )}
    </div>
  );
}
