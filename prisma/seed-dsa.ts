import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding DSA & Algorithms...");

  // 1) Path
  const path = await prisma.path.upsert({
    where: { slug: "dsa-algorithms" },
    update: {},
    create: {
      slug: "dsa-algorithms",
      title: "DSA & Algorithms",
      summary:
        "Master Big-O, core data structures, and classic algorithms with hands-on practice.",
    },
  });

  // 2) Skills (use readable IDs so edges are easy)
  const skills = [
    { id: "complexity", name: "Big-O & Complexity", summary: "Analyze time & space." },
    { id: "arrays-strings", name: "Arrays & Strings", summary: "Sliding window, two-pointers." },
    { id: "linked-lists", name: "Linked Lists", summary: "Singly/doubly, cycle detection." },
    { id: "stacks-queues", name: "Stacks & Queues", summary: "Monotonic stacks, BFS queue." },
    { id: "hashing", name: "Hash Tables", summary: "Maps, sets, frequency tables." },
    { id: "trees", name: "Trees", summary: "Traversals, depth/height, properties." },
    { id: "bst", name: "Binary Search Trees", summary: "Insert/search/delete, invariants." },
    { id: "heaps", name: "Heaps / Priority Queue", summary: "Top-K, scheduling." },
    { id: "graphs", name: "Graphs", summary: "BFS/DFS, shortest path, topological sort." },
    { id: "sorting-searching", name: "Sorting & Searching", summary: "Merge/quick, binary search." },
    { id: "recursion-dp", name: "Recursion & DP", summary: "Memoization, tabulation." },
    { id: "greedy", name: "Greedy", summary: "Intervals, exchange arguments." },
    { id: "backtracking", name: "Backtracking", summary: "Subsets, permutations, N-queens." },
    { id: "practice", name: "Interview Practice", summary: "Mixed problems & strategies." },
  ];

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { id: s.id },
      update: {},
      create: { id: s.id, pathId: path.id, name: s.name, summary: s.summary },
    });
  }

  // 3) Skill dependency graph (edges)
  const edges: Array<[string, string]> = [
    ["complexity", "arrays-strings"],
    ["complexity", "linked-lists"],
    ["arrays-strings", "stacks-queues"],
    ["arrays-strings", "hashing"],
    ["arrays-strings", "sorting-searching"],
    ["linked-lists", "trees"],
    ["trees", "bst"],
    ["arrays-strings", "heaps"],
    ["trees", "graphs"],
    ["sorting-searching", "graphs"],
    ["arrays-strings", "recursion-dp"],
    ["recursion-dp", "backtracking"],
    ["hashing", "greedy"],
    ["graphs", "practice"],
    ["backtracking", "practice"],
    ["greedy", "practice"],
  ];

  for (const [fromId, toId] of edges) {
    await prisma.skillEdge.upsert({
      where: { id: `${fromId}->${toId}` },
      update: {},
      create: { id: `${fromId}->${toId}`, fromId, toId },
    });
  }

  // 4) A handful of starter lessons (you can add more later)
  type L = { id: string; title: string; order: number; skillId: string; md: string };
  const lessons: L[] = [
    {
      id: "big-o-intro",
      title: "Big-O Basics",
      order: 1,
      skillId: "complexity",
      md: `# Big-O Basics

Big-O describes how runtime (or memory) grows with input size *n*.

- **O(1)** constant  
- **O(log n)** logarithmic  
- **O(n)** linear  
- **O(n log n)** quasilinear  
- **O(n²)** quadratic

\`\`\`ts
// O(n): sum of array
function sum(a:number[]) {
  let s=0;
  for (const x of a) s += x;
  return s;
}
\`\`\`
`,
    },
    {
      id: "arrays-two-pointers",
      title: "Arrays: Two-Pointers",
      order: 1,
      skillId: "arrays-strings",
      md: `# Two-Pointers

Great for sorted arrays and window techniques.

\`\`\`ts
// O(n): two-sum in sorted array
function twoSumSorted(a:number[], target:number) {
  let i=0, j=a.length-1;
  while (i<j) {
    const s=a[i]+a[j];
    if (s===target) return [i,j];
    s<target ? i++ : j--;
  }
  return [-1,-1];
}
\`\`\`
`,
    },
    {
      id: "linked-list-intro",
      title: "Linked List Basics",
      order: 1,
      skillId: "linked-lists",
      md: `# Linked Lists

Nodes point to the next node. Great for O(1) insert/delete once you have the pointer.

\`\`\`ts
class Node { constructor(public val:number, public next:Node|null=null){} }
\`\`\`
`,
    },
    {
      id: "tree-traversal",
      title: "Tree Traversals",
      order: 1,
      skillId: "trees",
      md: `# Tree Traversals

DFS: preorder, inorder, postorder. BFS: level order.

\`\`\`ts
type T = { val:number; left?:T; right?:T }
function inorder(t?:T) {
  if (!t) return;
  inorder(t.left);
  console.log(t.val);
  inorder(t.right);
}
\`\`\`
`,
    },
    {
      id: "graph-bfs-dfs",
      title: "Graphs: BFS & DFS",
      order: 1,
      skillId: "graphs",
      md: `# Graphs: BFS & DFS

- Use **BFS** for shortest path in unweighted graphs.  
- Use **DFS** for reachability, cycles, topological ordering.
`,
    },
    {
      id: "dp-intro",
      title: "Dynamic Programming Intro",
      order: 1,
      skillId: "recursion-dp",
      md: `# DP Intro

Break problems into overlapping subproblems + optimal substructure.

\`\`\`ts
// Fibonacci with memo
function fib(n:number, memo:Record<number,number> = {}) {
  if (n<=1) return n;
  if (memo[n]!=null) return memo[n];
  return (memo[n]=fib(n-1,memo)+fib(n-2,memo));
}
\`\`\`
`,
    },
    {
      id: "sorting-intro",
      title: "Sorting & Binary Search",
      order: 1,
      skillId: "sorting-searching",
      md: `# Sorting & Binary Search

- Master comparisons and invariants.  
- Binary search works on *monotonic* predicates.
`,
    },
  ];

  for (const L of lessons) {
    await prisma.lesson.upsert({
      where: { id: L.id },
      update: {},
      create: {
        id: L.id,
        title: L.title,
        order: L.order,
        skillId: L.skillId,
        pathId: path.id,
        contentMd: L.md,
      },
    });
  }

  console.log("✅ DSA & Algorithms seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
