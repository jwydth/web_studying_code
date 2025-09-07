import QuizCard from "@/components/QuizCard";
import { Brain, RotateCcw } from "lucide-react";

const sampleCards = [
  {
    id: "1",
    front: "What is the purpose of the `useState` hook in React?",
    back: "useState is a React hook that allows you to add state to functional components. It returns an array with two elements: the current state value and a function to update it.",
    ef: 2.5,
    interval: 0,
    reps: 0,
  },
  {
    id: "2",
    front: "What is the difference between `let` and `const` in JavaScript?",
    back: "let allows you to declare variables that can be reassigned, while const declares variables that cannot be reassigned after initialization. Both are block-scoped.",
    ef: 2.5,
    interval: 0,
    reps: 0,
  },
  {
    id: "3",
    front: "What is a CSS selector?",
    back: "A CSS selector is a pattern used to select and style HTML elements. It can be an element name, class, ID, or more complex patterns like attribute selectors.",
    ef: 2.5,
    interval: 0,
    reps: 0,
  },
  {
    id: "4",
    front: "What is the purpose of the DOCTYPE declaration in HTML?",
    back: "The DOCTYPE declaration tells the browser which version of HTML the page is written in. It must be the first line of an HTML document.",
    ef: 2.5,
    interval: 0,
    reps: 0,
  },
];

export default function QuizPage() {
  return (
    <div className="space-y-8 py-8">
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Spaced Repetition Quiz
          </h1>
        </div>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Test your knowledge with our smart quiz system that adapts to your
          learning pace.
        </p>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        {sampleCards.map((card) => (
          <QuizCard key={card.id} card={card} />
        ))}
      </div>

      <div className="text-center">
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
          <RotateCcw className="w-4 h-4" />
          Load More Cards
        </button>
      </div>
    </div>
  );
}

