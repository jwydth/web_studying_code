// src/app/learn/[lessonId]/page.tsx
import { prisma } from "@/lib/db";
import { readUserId } from "@/lib/user";
import ReactMarkdown from "react-markdown";

import HtmlPlayground from "@/components/HtmlPlayground";
import CssPlayground from "@/components/CssPlayground";
import JsPlayground from "@/components/JsPlayground";
import ReactLiveEditor from "@/components/ReactLiveEditor";

import MultipleChoiceQuiz, { MCQ } from "@/components/MultipleChoiceQuiz";
import ResourceList, { Resource } from "@/components/ResourceList";
import ProgressChecklist from "@/components/ProgressChecklist";
import ProgressPill from "@/components/ProgressPill";

// at the top
import AlgorithmViz from "@/components/AlgorithmViz";

type Props = { params: Promise<{ lessonId: string }> }; // Next requires Promise here in your app

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;
  const userId = await readUserId();

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return <div className="p-6">Lesson not found</div>;

  const lp = userId
    ? await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
        select: { percent: true, status: true },
      })
    : null;

  const currentPercent = lp?.percent ?? 0;

  // -------------------------
  // Frontend + Backend lessons
  // -------------------------
  const byId: Record<
    string,
    {
      quiz: MCQ[];
      resources: Resource[];
      extras: React.ReactNode;
      tasks: string[];
    }
  > = {
    /* ---------- Frontend ---------- */
    "html-intro": {
      quiz: [
        {
          id: "h1",
          question: "Which element wraps the dominant content?",
          choices: ["<section>", "<main>", "<body>", "<article>"],
          correctIndex: 1,
          explanation: "<main> is for the document’s main content.",
        },
      ],
      resources: [
        {
          title: "Responsive Web Design",
          provider: "freeCodeCamp",
          url: "https://www.freecodecamp.org/learn/2022/responsive-web-design",
          note: "Hands-on HTML/CSS path",
          level: "Beginner",
        },
        {
          title: "HTML — Docs & Guides",
          provider: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Try it live</h2>
          <HtmlPlayground />
        </>
      ),
      tasks: [
        "Add a <nav> with two links",
        "Create a list in <main>",
        "Style headings via CSS in the playground",
      ],
    },

    "css-intro": {
      quiz: [
        {
          id: "c1",
          question: "Which creates a two-column grid with equal widths?",
          choices: [
            "grid-template-columns: 1fr 2fr;",
            "grid-template-columns: repeat(2, 1fr);",
            "display: flex; flex-direction: column;",
            "justify-content: space-between;",
          ],
          correctIndex: 1,
          explanation: "repeat(2, 1fr) defines two equal columns.",
        },
      ],
      resources: [
        {
          title: "CSS Layout",
          provider: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout",
          note: "Flexbox & Grid",
        },
        {
          title: "Flexbox Froggy / Grid Garden",
          provider: "Games",
          url: "https://flexboxfroggy.com/",
          note: "Playful practice",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Experiment</h2>
          <CssPlayground />
        </>
      ),
      tasks: [
        "Switch to Grid and set 3 columns",
        "Center items",
        "Add a 24px gap",
      ],
    },

    "js-intro": {
      quiz: [
        {
          id: "j1",
          question: "What does `await` do inside an async function?",
          choices: [
            "Stops the entire program",
            "Pauses that function until the promise settles",
            "Turns a promise into a callback",
            "Retries a request automatically",
          ],
          correctIndex: 1,
          explanation:
            "It pauses the async function (not the thread) until the promise settles.",
        },
      ],
      resources: [
        {
          title: "Modern JavaScript Tutorial",
          provider: "javascript.info",
          url: "https://javascript.info/",
          note: "From basics to advanced",
        },
        {
          title: "Eloquent JavaScript",
          provider: "Book",
          url: "https://eloquentjavascript.net/",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Code & test</h2>
          <JsPlayground />
        </>
      ),
      tasks: ["Make all tests pass", "Log something meaningful to the console"],
    },

    "react-intro": {
      quiz: [
        {
          id: "r1",
          question: "Where should you store UI that changes over time?",
          choices: ["In props", "In local variables", "In useState", "In CSS"],
          correctIndex: 2,
          explanation: "State holds data that changes and causes re-renders.",
        },
      ],
      resources: [
        {
          title: "React Docs — Learn",
          provider: "react.dev",
          url: "https://react.dev/learn",
          note: "Official, modern React",
        },
        {
          title: "Learn Next.js",
          provider: "Vercel",
          url: "https://nextjs.org/learn",
          level: "Beginner",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Live React</h2>
          <ReactLiveEditor />
        </>
      ),
      tasks: [
        "Change the Counter to step by 5",
        "Add a Reset button",
        "Create a Greeting component",
      ],
    },

    /* ---------- Backend ---------- */
    "node-intro": {
      quiz: [
        {
          id: "n1",
          question: "What does the Node event loop do?",
          choices: [
            "Renders the DOM",
            "Schedules and processes async callbacks",
            "Compiles TypeScript",
            "Optimizes CSS",
          ],
          correctIndex: 1,
          explanation: "It processes the queue of callbacks and microtasks.",
        },
      ],
      resources: [
        {
          title: "Node.js Docs",
          provider: "nodejs.org",
          url: "https://nodejs.org/en/docs",
        },
        {
          title: "Event Loop",
          provider: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Try Node patterns</h2>
          <JsPlayground />
        </>
      ),
      tasks: [
        "Use fs/promises to read a file",
        "Log NODE_ENV from process.env",
        "Create and import a small module",
      ],
    },

    "express-intro": {
      quiz: [
        {
          id: "e1",
          question: "What does app.use(express.json()) do?",
          choices: [
            "Serves static files",
            "Parses JSON bodies into req.body",
            "Enables CORS by default",
            "Starts the server",
          ],
          correctIndex: 1,
          explanation:
            "It parses JSON request bodies so you can read req.body.",
        },
      ],
      resources: [
        {
          title: "Express Guide",
          provider: "expressjs.com",
          url: "https://expressjs.com/",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Experiment</h2>
          <JsPlayground />
        </>
      ),
      tasks: [
        "Add a /ping route returning {ok:true}",
        "Add a POST /echo that returns req.body",
        "Create middleware that logs method & path",
      ],
    },

    "postgres-setup": {
      quiz: [
        {
          id: "p1",
          question: "Which SQL ensures only unique emails?",
          choices: [
            "PRIMARY KEY(email)",
            "UNIQUE(email)",
            "INDEX(email)",
            "FOREIGN KEY(email)",
          ],
          correctIndex: 1,
          explanation: "UNIQUE enforces uniqueness on a column.",
        },
      ],
      resources: [
        {
          title: "PostgreSQL Docs",
          provider: "postgresql.org",
          url: "https://www.postgresql.org/docs/",
        },
        {
          title: "node-postgres",
          provider: "pg",
          url: "https://node-postgres.com/",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Practice SQL</h2>
          <p className="opacity-80">
            Run the CREATE TABLE / INSERT examples locally, then connect from
            Node.
          </p>
        </>
      ),
      tasks: [
        "Create a 'users' table with a UNIQUE email",
        "Insert two rows and SELECT them",
        "Connect from Node and count users",
      ],
    },

    "rest-design": {
      quiz: [
        {
          id: "r2",
          question:
            "Which status fits a successful POST that created a resource?",
          choices: ["200", "201", "204", "304"],
          correctIndex: 1,
          explanation: "201 Created is the canonical status.",
        },
      ],
      resources: [
        {
          title: "API Design Guide",
          provider: "Microsoft",
          url: "https://learn.microsoft.com/azure/architecture/best-practices/api-design",
        },
        { title: "JWT", provider: "jwt.io", url: "https://jwt.io/" },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Design & Secure</h2>
          <p className="opacity-80">
            Sketch your resources and add JWT auth to a protected route.
          </p>
        </>
      ),
      tasks: [
        "Design /users CRUD routes",
        "Return 201 + Location header on create",
        "Protect /me with a signed JWT",
      ],
    },
    // --- Full-Stack ---
    "ts-basics": {
      quiz: [
        {
          id: "ts1",
          question: "Which feature helps catch errors at compile time?",
          choices: ["Interfaces", "Type system", "Console.log", "JSX"],
          correctIndex: 1,
          explanation:
            "Type annotations and inference catch many mistakes before runtime.",
        },
      ],
      resources: [
        {
          title: "TS Handbook",
          provider: "TypeScript",
          url: "https://www.typescriptlang.org/docs/handbook/intro.html",
        },
        {
          title: "Effective TS",
          provider: "Book",
          url: "https://effectivetypescript.com/",
        },
      ],
      extras: null,
      tasks: [
        "Create a typed User interface",
        "Write a generic function",
        "Enable strict mode in tsconfig",
      ],
    },
    "nextjs-intro": {
      quiz: [
        {
          id: "nx1",
          question: "What’s the recommended data-fetching in App Router?",
          choices: [
            "getServerSideProps",
            "fetch in Server Components",
            "XMLHttpRequest",
            "Only client hooks",
          ],
          correctIndex: 1,
          explanation:
            "Server Components + `fetch` on the server is the modern pattern.",
        },
      ],
      resources: [
        {
          title: "Next.js Learn",
          provider: "Vercel",
          url: "https://nextjs.org/learn",
        },
        {
          title: "App Router Docs",
          provider: "Next.js",
          url: "https://nextjs.org/docs/app",
        },
      ],
      extras: null,
      tasks: [
        "Create a server component page",
        "Add a client component with interaction",
        "Use `fetch` in a server component",
      ],
    },
    "prisma-intro": {
      quiz: [
        {
          id: "pr1",
          question: "How do you generate the Prisma Client?",
          choices: [
            "npm run seed",
            "npx prisma generate",
            "npx prisma deploy",
            "npm run build",
          ],
          correctIndex: 1,
          explanation: "Run `npx prisma generate` after editing schema.",
        },
      ],
      resources: [
        {
          title: "Prisma Docs",
          provider: "Prisma",
          url: "https://www.prisma.io/docs",
        },
        {
          title: "Data Modeling",
          provider: "Prisma",
          url: "https://www.prisma.io/docs/orm/prisma-schema/data-model",
        },
      ],
      extras: null,
      tasks: [
        "Add a model to schema.prisma",
        "Run prisma migrate dev",
        "Query with Prisma Client in a server function",
      ],
    },
    "vercel-deploy": {
      quiz: [
        {
          id: "vc1",
          question: "Which environment does Vercel create by default on PRs?",
          choices: ["Production", "Preview", "Local", "Staging only"],
          correctIndex: 1,
          explanation: "Every PR gets a Preview deployment.",
        },
      ],
      resources: [
        {
          title: "Vercel Docs",
          provider: "Vercel",
          url: "https://vercel.com/docs",
        },
      ],
      extras: null,
      tasks: [
        "Connect repo to Vercel",
        "Set environment variables",
        "Verify Preview + Production deploys",
      ],
    },

    // --- DevOps & Cloud ---
    "docker-basics": {
      quiz: [
        {
          id: "dk1",
          question: "Which file defines how to build an image?",
          choices: [
            "docker-compose.yml",
            "Dockerfile",
            "package.json",
            ".dockerignore",
          ],
          correctIndex: 1,
          explanation: "The Dockerfile is the build recipe.",
        },
      ],
      resources: [
        {
          title: "Docker Docs",
          provider: "Docker",
          url: "https://docs.docker.com/",
        },
      ],
      extras: null,
      tasks: [
        "Write a Dockerfile",
        "Build and run a container",
        "Add a .dockerignore",
      ],
    },
    "aws-fundamentals": {
      quiz: [
        {
          id: "aw1",
          question: "What’s the principle for granting permissions in IAM?",
          choices: [
            "Admin by default",
            "Least privilege",
            "Full access to services",
            "ACLs only",
          ],
          correctIndex: 1,
          explanation: "Grant only the permissions required.",
        },
      ],
      resources: [
        {
          title: "AWS IAM",
          provider: "AWS",
          url: "https://docs.aws.amazon.com/iam/",
        },
      ],
      extras: null,
      tasks: [
        "Create an IAM user with least privilege",
        "Store AWS credentials securely",
        "Use an S3 bucket in a CLI or SDK example",
      ],
    },
    "cicd-pipelines": {
      quiz: [
        {
          id: "ci1",
          question: "Which tool can run CI in GitHub repos?",
          choices: [
            "TeamCity only",
            "GitHub Actions",
            "Jenkins only",
            "Bash scripts only",
          ],
          correctIndex: 1,
          explanation: "GitHub Actions integrates natively with GitHub.",
        },
      ],
      resources: [
        {
          title: "Actions Docs",
          provider: "GitHub",
          url: "https://docs.github.com/actions",
        },
      ],
      extras: null,
      tasks: [
        "Create a workflow file",
        "Add build & test steps",
        "Publish an artifact or deploy step",
      ],
    },
    "k8s-intro": {
      quiz: [
        {
          id: "k1",
          question: "What object keeps a desired number of Pods running?",
          choices: ["Service", "Deployment", "ConfigMap", "CRD"],
          correctIndex: 1,
          explanation: "Deployments manage ReplicaSets and pods.",
        },
      ],
      resources: [
        {
          title: "Kubernetes Docs",
          provider: "Kubernetes",
          url: "https://kubernetes.io/docs/home/",
        },
      ],
      extras: null,
      tasks: [
        "Write a Deployment manifest",
        "Expose it with a Service",
        "Roll a new version",
      ],
    },
    // inside byId: Record<string, {...}>
    "docker-intro": {
      quiz: [
        {
          id: "d1",
          question: "What is the difference between an image and a container?",
          choices: [
            "No difference",
            "Image is a template; container is a running instance",
            "Container is a template; image is running",
            "Image is only for VMs",
          ],
          correctIndex: 1,
          explanation:
            "An image is a template; a container is a running instance.",
        },
      ],
      resources: [
        {
          title: "Docker — Get Started",
          provider: "Docker Docs",
          url: "https://docs.docker.com/get-started/",
        },
        {
          title: "Play with Docker",
          provider: "Docker",
          url: "https://labs.play-with-docker.com/",
        },
      ],
      extras: null,
      tasks: [
        "Run an alpine container that echoes 'hello'",
        "Write a minimal Dockerfile for a Node app",
        "Map port 8080->80 for nginx",
      ],
    },

    "cicd-intro": {
      quiz: [
        {
          id: "ci1",
          question: "What does CI mainly ensure?",
          choices: [
            "Manual deployment",
            "Automated, repeatable build/test",
            "Only manual tests",
            "It replaces version control",
          ],
          correctIndex: 1,
          explanation: "CI automates build/test to keep main branch healthy.",
        },
      ],
      resources: [
        {
          title: "GitHub Actions — Docs",
          provider: "GitHub",
          url: "https://docs.github.com/actions",
        },
        {
          title: "CI/CD Concepts",
          provider: "CircleCI",
          url: "https://circleci.com/continuous-integration/",
        },
      ],
      extras: null,
      tasks: [
        "Create a GitHub Actions workflow that runs tests",
        "Add Node cache to speed up installs",
        "Add a build step",
      ],
    },

    "aws-intro": {
      quiz: [
        {
          id: "a1",
          question: "What is the best practice for granting AWS permissions?",
          choices: [
            "Give AdminAccess to everyone",
            "Use IAM users with inline policies only",
            "Use least privilege via roles/policies",
            "Hardcode credentials in source",
          ],
          correctIndex: 2,
          explanation: "Always follow least-privilege; prefer roles/policies.",
        },
      ],
      resources: [
        {
          title: "AWS IAM Best Practices",
          provider: "AWS",
          url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
        },
        {
          title: "S3 — Developer Guide",
          provider: "AWS",
          url: "https://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html",
        },
      ],
      extras: null,
      tasks: [
        "Create an IAM user/role with least-privilege",
        "Install & configure AWS CLI",
        "List S3 buckets with CLI",
      ],
    },
    // ========= DSA / Algorithms =========
    // --- DSA / Algorithms (keys must equal Prisma lesson.id) ---
    "arrays-two-pointers": {
      quiz: [
        {
          id: "a1",
          question:
            "Which method returns a shallow copy of a portion of an array?",
          choices: ["splice", "slice", "map", "reduce"],
          correctIndex: 1,
          explanation: "`slice` returns a shallow copy; `splice` mutates.",
        },
      ],
      resources: [
        {
          title: "MDN Array",
          provider: "MDN",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Animated walkthrough</h2>
          <AlgorithmViz exampleId="two-pointers" />
        </>
      ),
      tasks: ["Implement twoSum(nums, target)", "Reverse an array in-place"],
    },

    "linked-list-intro": {
      quiz: [
        {
          id: "ll1",
          question: "What does a singly linked list node contain?",
          choices: [
            "value only",
            "next pointer only",
            "value + next pointer",
            "index",
          ],
          correctIndex: 2,
          explanation:
            "Each node stores a value and a pointer to the next node.",
        },
      ],
      resources: [
        {
          title: "Linked List",
          provider: "GeeksforGeeks",
          url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">LL practice</h2>
          <JsPlayground />
        </>
      ),
      tasks: [
        "Reverse a singly linked list",
        "Detect a cycle (Floyd’s algorithm)",
      ],
    },

    "graph-bfs-dfs": {
      quiz: [
        {
          id: "g1",
          question: "Which traversal uses a queue?",
          choices: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"],
          correctIndex: 1,
          explanation: "BFS uses a queue; DFS uses a stack (often recursion).",
        },
      ],
      resources: [
        {
          title: "Graphs",
          provider: "CP-Algorithms",
          url: "https://cp-algorithms.com/graph/",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Graph practice</h2>
          <JsPlayground />
        </>
      ),
      tasks: [
        "BFS shortest path (unweighted)",
        "Detect cycle in directed graph (DFS)",
      ],
    },

    "sorting-intro": {
      quiz: [
        {
          id: "so1",
          question: "Which sorting algorithm is stable by default?",
          choices: ["Quick Sort", "Merge Sort", "Heap Sort", "Selection Sort"],
          correctIndex: 1,
          explanation: "Merge Sort is stable in its classic implementation.",
        },
      ],
      resources: [
        {
          title: "Sorting",
          provider: "VisuAlgo",
          url: "https://visualgo.net/en/sorting",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Sort practice</h2>
          <JsPlayground />
        </>
      ),
      tasks: ["Implement merge sort", "Compare average complexity of 3 sorts"],
    },

    "tree-traversal": {
      quiz: [
        {
          id: "t1",
          question: "What is the time complexity to search in a balanced BST?",
          choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correctIndex: 1,
          explanation: "Balanced BST search is O(log n).",
        },
      ],
      resources: [
        {
          title: "Trees",
          provider: "CP-Algorithms",
          url: "https://cp-algorithms.com/",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Tree practice</h2>
          <JsPlayground />
        </>
      ),
      tasks: ["Binary tree BFS (level order)", "BST insert + search"],
    },

    "dp-intro": {
      quiz: [
        {
          id: "dp1",
          question: "Dynamic programming typically uses…",
          choices: [
            "Randomization",
            "Memoization/tabulation",
            "Divide-only",
            "Greedy-in-all-cases",
          ],
          correctIndex: 1,
          explanation:
            "DP stores subproblem results (memoization) or builds tables (tabulation).",
        },
      ],
      resources: [
        {
          title: "DP Patterns",
          provider: "LeetCode Discuss",
          url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">DP practice</h2>
          <JsPlayground />
        </>
      ),
      tasks: ["Climbing stairs (memo & tab)", "0/1 Knapsack (tabulation)"],
    },

    "big-o-intro": {
      quiz: [
        {
          id: "bo1",
          question: "Which growth is faster as n→∞?",
          choices: ["O(n log n)", "O(n)", "O(log n)", "O(n^2)"],
          correctIndex: 3,
          explanation: "Among the choices, O(n^2) grows the fastest.",
        },
      ],
      resources: [
        {
          title: "Big-O Cheatsheet",
          provider: "bigocheatsheet.com",
          url: "https://www.bigocheatsheet.com/",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Complexity warm-ups</h2>
          <JsPlayground />
        </>
      ),
      tasks: [
        "Estimate complexities for common loops",
        "Compare two solutions asymptotically",
      ],
    },

    // add if present in DB
    "searching-intro": {
      quiz: [
        {
          id: "se1",
          question: "Binary search requires…",
          choices: ["Sorted array", "Linked list", "Hash map", "Heap"],
          correctIndex: 0,
          explanation: "Binary search works on sorted sequences.",
        },
      ],
      resources: [
        {
          title: "Binary Search",
          provider: "Khan Academy",
          url: "https://www.khanacademy.org/computing/computer-science/algorithms",
        },
      ],
      extras: (
        <>
          <h2 className="text-xl font-semibold">Animated walkthrough</h2>
          <AlgorithmViz exampleId="binary-search" />
        </>
      ),
      tasks: [
        "Implement binarySearch(nums, x)",
        "Find first and last position of x",
      ],
    },
  };

  const cfg = byId[lesson.id] ?? {
    quiz: [],
    resources: [],
    extras: null,
    tasks: [],
  };

  // Derive initial checked from saved percent
  const checkedCount = cfg.tasks.length
    ? Math.round((currentPercent / 100) * cfg.tasks.length)
    : 0;
  const initialChecked = cfg.tasks.map((_, i) => i < checkedCount);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <ProgressPill lessonId={lesson.id} initialPercent={currentPercent} />
      </header>

      <article className="prose prose-invert max-w-none">
        <ReactMarkdown>{lesson.contentMd}</ReactMarkdown>
      </article>

      {cfg.extras}

      {cfg.tasks.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Checklist</h3>
          <ProgressChecklist
            lessonId={lesson.id}
            tasks={cfg.tasks}
            initialChecked={initialChecked}
          />
        </section>
      )}

      {cfg.quiz.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Quick quiz</h2>
          <MultipleChoiceQuiz items={cfg.quiz} />
        </section>
      )}

      {cfg.resources.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Continue with these courses</h2>
          <ResourceList items={cfg.resources} />
        </section>
      )}
    </div>
  );
}
