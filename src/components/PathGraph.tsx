"use client";

import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "@dagrejs/dagre";
import SkillNode from "./SkillNode"; // ← your styled node component

const nodeTypes = { skill: SkillNode };

function layout(nodesArg?: Node[], edgesArg?: Edge[]) {
  const nodes: Node[] = Array.isArray(nodesArg) ? nodesArg : [];
  const edges: Edge[] = Array.isArray(edgesArg) ? edgesArg : [];
  if (nodes.length === 0) return { nodes: [], edges: [] };

  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR", // ← left-to-right
    nodesep: 80,
    ranksep: 120,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((n) => g.setNode(n.id, { width: 220, height: 64 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);

  const laid = nodes.map((n) => {
    const p = g.node(n.id) as { x: number; y: number } | undefined;
    const x = p?.x ?? 0;
    const y = p?.y ?? 0;
    return { ...n, position: { x: x - 110, y: y - 32 } };
  });

  return { nodes: laid, edges };
}

export default function PathGraph({
  nodesInput,
  edgesInput,
}: {
  nodesInput?: Node[];
  edgesInput?: Edge[];
}) {
  const { nodes, edges } = useMemo(
    () => layout(nodesInput, edgesInput),
    [nodesInput, edgesInput]
  );

  if (!nodes || nodes.length === 0) {
    return (
      <div className="h-[520px] rounded-3xl border border-white/10 grid place-items-center text-sm text-slate-400">
        No nodes to render. Seed skills/edges, then refresh.
      </div>
    );
  }

  return (
    <div className="h-[520px] rounded-3xl border border-white/10">
      <ReactFlow
        defaultNodes={nodes}
        defaultEdges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#60a5fa",
          },
          animated: true,
          style: { stroke: "rgb(96 165 250)", strokeWidth: 2 },
        }}
        panOnDrag
        zoomOnScroll
        fitView
        proOptions={{ hideAttribution: false }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(148,163,184,.35)"
        />
        <MiniMap
          position="bottom-right"
          zoomable
          pannable
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,.08)",
          }}
          maskColor="rgba(2,6,23,.6)"
          nodeColor={() => "#60a5fa"}
        />
        <Controls
          position="bottom-left"
          className="rf-controls rf-controls--sm" // <- add this
          showZoom
          showFitView
          showInteractive
        />
      </ReactFlow>
    </div>
  );
}
