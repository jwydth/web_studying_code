"use client";
import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

const nodeTypes = {
  skill: ({ data }: { data: any }) => (
    <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg">
      <div className="text-sm font-medium text-slate-100">{data.label}</div>
      {data.completed && (
        <div className="text-xs text-green-400 mt-1">✓ Completed</div>
      )}
    </div>
  ),
};

export default function SkillMap() {
  const nodes: Node[] = useMemo(
    () => [
      {
        id: "html",
        position: { x: 0, y: 0 },
        data: { label: "HTML Basics" },
        type: "skill",
      },
      {
        id: "css",
        position: { x: 200, y: 0 },
        data: { label: "CSS Styling" },
        type: "skill",
      },
      {
        id: "js",
        position: { x: 400, y: 0 },
        data: { label: "JavaScript" },
        type: "skill",
      },
      {
        id: "react",
        position: { x: 600, y: 0 },
        data: { label: "React" },
        type: "skill",
      },
      {
        id: "nextjs",
        position: { x: 800, y: 0 },
        data: { label: "Next.js" },
        type: "skill",
      },
    ],
    []
  );

  const edges: Edge[] = useMemo(
    () => [
      { id: "e1", source: "html", target: "css", type: "smoothstep" },
      { id: "e2", source: "css", target: "js", type: "smoothstep" },
      { id: "e3", source: "js", target: "react", type: "smoothstep" },
      { id: "e4", source: "react", target: "nextjs", type: "smoothstep" },
    ],
    []
  );

  return (
    <div className="h-[400px] rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          style: { stroke: "#64748b", strokeWidth: 2 },
        }}
      >
        <MiniMap
          nodeColor="#1e293b"
          nodeStrokeColor="#64748b"
          nodeBorderRadius={8}
          maskColor="rgba(0, 0, 0, 0.8)"
        />
        <Controls
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
          }}
        />
        <Background color="#0f172a" gap={20} />
      </ReactFlow>
    </div>
  );
}


