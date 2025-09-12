import Link from "next/link";
import { BookOpen, Clock, Users, ArrowRight } from "lucide-react";

const paths = [
  {
    id: "frontend-foundations",
    title: "Frontend Development Foundations",
    description:
      "Master the fundamentals of modern frontend development with HTML, CSS, JavaScript, and React.",
    duration: "8-12 weeks",
    difficulty: "Beginner",
    students: 1250,
    skills: ["HTML", "CSS", "JavaScript", "React"],
    color: "from-blue-500 to-purple-600",
  },
  {
    id: "backend-api",
    title: "Backend API Development",
    description:
      "Learn to build robust APIs with Node.js, Express, and databases.",
    duration: "10-14 weeks",
    difficulty: "Intermediate",
    students: 890,
    skills: ["Node.js", "Express", "PostgreSQL", "REST APIs"],
    color: "from-green-500 to-teal-600",
  },
  {
    id: "fullstack-mastery",
    title: "Full-Stack Mastery",
    description:
      "Complete full-stack development with modern frameworks and deployment.",
    duration: "16-20 weeks",
    difficulty: "Advanced",
    students: 456,
    skills: ["Next.js", "TypeScript", "Prisma", "Vercel"],
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "devops-cloud",
    title: "DevOps & Cloud Computing",
    description:
      "Deploy, scale, and manage applications in the cloud with modern DevOps practices.",
    duration: "12-16 weeks",
    difficulty: "Intermediate",
    students: 678,
    skills: ["Docker", "AWS", "CI/CD", "Kubernetes"],
    color: "from-orange-500 to-red-600",
  },
];

export default function PathsPage() {
  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Learning Paths
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Choose your journey and master new skills with structured, interactive
          learning paths.
        </p>
      </header>

      {/* Paths Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {paths.map((path) => (
          <div
            key={path.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700 transition-all duration-300"
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-5 group-hover:opacity-10 transition-opacity`}
            />

            <div className="relative p-8 space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-100 group-hover:text-white transition-colors">
                  {path.title}
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  {path.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {path.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {path.students.toLocaleString()} students
                </div>
                <div className="px-2 py-1 rounded-full bg-slate-800 text-slate-300 text-xs">
                  {path.difficulty}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-300">
                  Skills you&apos;ll learn:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/paths/${path.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium transition-colors group-hover:bg-slate-700"
              >
                <BookOpen className="w-4 h-4" />
                Start Learning
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <section className="text-center py-12 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <h2 className="text-2xl font-bold mb-4">
          Ready to start your coding journey?
        </h2>
        <p className="text-slate-400 mb-6 max-w-lg mx-auto">
          Join thousands of learners who are already building their skills with
          our interactive paths.
        </p>
        <button className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors font-medium">
          Get Started Free
        </button>
      </section>
    </div>
  );
}
