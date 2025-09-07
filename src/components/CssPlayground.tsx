"use client";
import { useState } from "react";

type Mode = "flex" | "grid";

export default function CssPlayground() {
  const [mode, setMode] = useState<Mode>("flex");

  const [flex, setFlex] = useState({
    direction: "row",
    justify: "flex-start",
    align: "stretch",
    wrap: "nowrap",
    gap: 12,
  });

  const [grid, setGrid] = useState({
    cols: 3,
    gap: 12,
    justifyItems: "stretch",
    alignItems: "stretch",
  });

  const items = Array.from({ length: 8 }).map((_, i) => (
    <div
      key={i}
      className="rounded-lg px-3 py-2 text-xs font-medium"
      style={{
        background: "rgba(148,163,184,.18)",
        border: "1px solid rgba(148,163,184,.25)",
      }}
    >
      Item {i + 1}
    </div>
  ));

  const containerStyle: React.CSSProperties =
    mode === "flex"
      ? {
          display: "flex",
          flexDirection: flex.direction as any,
          justifyContent: flex.justify as any,
          alignItems: flex.align as any,
          flexWrap: flex.wrap as any,
          gap: flex.gap,
          minHeight: 180,
        }
      : {
          display: "grid",
          gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
          gap: grid.gap,
          justifyItems: grid.justifyItems as any,
          alignItems: grid.alignItems as any,
          minHeight: 180,
        };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("flex")}
          className={`px-3 py-1 rounded-lg border ${
            mode === "flex" ? "bg-white/10" : ""
          }`}
        >
          Flexbox
        </button>
        <button
          onClick={() => setMode("grid")}
          className={`px-3 py-1 rounded-lg border ${
            mode === "grid" ? "bg-white/10" : ""
          }`}
        >
          Grid
        </button>
      </div>

      {mode === "flex" ? (
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl border bg-white/5 p-3 space-y-2">
            <Row label="direction">
              <Select
                value={flex.direction}
                onChange={(v) => setFlex((s) => ({ ...s, direction: v }))}
                options={["row", "row-reverse", "column", "column-reverse"]}
              />
            </Row>
            <Row label="justify-content">
              <Select
                value={flex.justify}
                onChange={(v) => setFlex((s) => ({ ...s, justify: v }))}
                options={[
                  "flex-start",
                  "center",
                  "flex-end",
                  "space-between",
                  "space-around",
                  "space-evenly",
                ]}
              />
            </Row>
            <Row label="align-items">
              <Select
                value={flex.align}
                onChange={(v) => setFlex((s) => ({ ...s, align: v }))}
                options={[
                  "stretch",
                  "flex-start",
                  "center",
                  "flex-end",
                  "baseline",
                ]}
              />
            </Row>
            <Row label="wrap">
              <Select
                value={flex.wrap}
                onChange={(v) => setFlex((s) => ({ ...s, wrap: v }))}
                options={["nowrap", "wrap", "wrap-reverse"]}
              />
            </Row>
            <Row label="gap">
              <input
                type="range"
                min={0}
                max={48}
                value={flex.gap}
                onChange={(e) =>
                  setFlex((s) => ({ ...s, gap: +e.target.value }))
                }
                className="tw-range"
              />
              <span className="text-xs opacity-70 w-8 text-right">
                {flex.gap}px
              </span>
            </Row>
          </div>

          <div className="rounded-xl border bg-white/5 p-3">
            <div className="rounded-lg p-3" style={containerStyle}>
              {items}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl border bg-white/5 p-3 space-y-2">
            <Row label="columns">
              <input
                type="range"
                min={1}
                max={6}
                value={grid.cols}
                onChange={(e) =>
                  setGrid((s) => ({ ...s, cols: +e.target.value }))
                }
                className="tw-range"
              />
              <span className="text-xs opacity-70 w-8 text-right">
                {grid.cols}
              </span>
            </Row>
            <Row label="justify-items">
              <Select
                value={grid.justifyItems}
                onChange={(v) => setGrid((s) => ({ ...s, justifyItems: v }))}
                options={["stretch", "start", "center", "end"]}
              />
            </Row>
            <Row label="align-items">
              <Select
                value={grid.alignItems}
                onChange={(v) => setGrid((s) => ({ ...s, alignItems: v }))}
                options={["stretch", "start", "center", "end"]}
              />
            </Row>
            <Row label="gap">
              <input
                type="range"
                min={0}
                max={48}
                value={grid.gap}
                onChange={(e) =>
                  setGrid((s) => ({ ...s, gap: +e.target.value }))
                }
                className="tw-range"
              />
              <span className="text-xs opacity-70 w-8 text-right">
                {grid.gap}px
              </span>
            </Row>
          </div>

          <div className="rounded-xl border bg-white/5 p-3">
            <div className="rounded-lg p-3" style={containerStyle}>
              {items}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs w-32 opacity-70">{label}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="tw-select"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
