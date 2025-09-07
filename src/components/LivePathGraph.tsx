"use client";
import { useEffect, useState, useCallback } from "react";
import PathGraph from "@/components/PathGraph";
import type { Node, Edge } from "reactflow";

export default function LivePathGraph({
  slug,
  initialNodes,
  edges,
}: {
  slug: string;
  initialNodes: Node[];
  edges: Edge[];
}) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  // force-remount PathGraph so defaultNodes re-apply cleanly
  const [version, setVersion] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/paths/${slug}/progress`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data?.nodes)) {
        setNodes(data.nodes);
        setVersion((v) => v + 1);
      }
    } catch {
      // ignore
    }
  }, [slug]);

  // 1) Fetch once on mount/slug change
  useEffect(() => {
    refresh();
  }, [refresh]);

  // 2) Refresh whenever the tab regains focus (common user flow)
  useEffect(() => {
    const onFocus = () => refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  // 3) Still update live when a lesson saves progress
  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("progress-updated", handler as EventListener);
    return () =>
      window.removeEventListener("progress-updated", handler as EventListener);
  }, [refresh]);

  return <PathGraph key={version} nodesInput={nodes} edgesInput={edges} />;
}
