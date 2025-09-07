export type NodeId = string
export type Edge = { from: NodeId; to: NodeId }

export function topoOrder(nodes: NodeId[], edges: Edge[]): NodeId[] {
  const indeg = new Map(nodes.map(n => [n, 0]))
  for (const e of edges) indeg.set(e.to, (indeg.get(e.to) || 0) + 1)
  const q: NodeId[] = nodes.filter(n => (indeg.get(n) || 0) === 0)
  const order: NodeId[] = []
  while (q.length) {
    const n = q.shift()!
    order.push(n)
    for (const e of edges.filter(e => e.from === n)) {
      const d = (indeg.get(e.to) || 0) - 1
      indeg.set(e.to, d)
      if (d === 0) q.push(e.to)
    }
  }
  return order
}

export function nextUnlocked(
  order: NodeId[],
  done: Set<NodeId>
): NodeId[] {
  // return nodes whose all predecessors are done
  const unlocked: NodeId[] = []
  for (const n of order) if (!done.has(n)) unlocked.push(n)
  return unlocked
}

export function getNextLessons(
  skills: Array<{ id: string; name: string }>,
  edges: Edge[],
  completedLessons: Set<string>
): string[] {
  const skillOrder = topoOrder(skills.map(s => s.id), edges)
  return nextUnlocked(skillOrder, completedLessons)
}


