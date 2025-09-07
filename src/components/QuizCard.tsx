"use client";
import { useState } from "react";
import { sm2 } from "@/lib/sm2";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

type Card = {
  id: string;
  front: string;
  back: string;
  ef: number;
  interval: number;
  reps: number;
};

const gradeLabels = [
  { grade: 0, label: "Again", color: "bg-red-600 hover:bg-red-700" },
  { grade: 1, label: "Hard", color: "bg-orange-600 hover:bg-orange-700" },
  { grade: 2, label: "Good", color: "bg-yellow-600 hover:bg-yellow-700" },
  { grade: 3, label: "Easy", color: "bg-green-600 hover:bg-green-700" },
  { grade: 4, label: "Perfect", color: "bg-blue-600 hover:bg-blue-700" },
  { grade: 5, label: "Mastered", color: "bg-purple-600 hover:bg-purple-700" },
];

export default function QuizCard({ card }: { card: Card }) {
  const [show, setShow] = useState(false);
  const [state, setState] = useState(card);
  const [graded, setGraded] = useState(false);

  function grade(q: number) {
    const { ef, interval, reps } = sm2(state.ef, state.interval, state.reps, q);
    setState({ ...state, ef, interval, reps });
    setGraded(true);
    setShow(false);

    // TODO: Persist to database
    console.log("Card graded:", {
      cardId: card.id,
      grade: q,
      newState: { ef, interval, reps },
    });
  }

  function reset() {
    setShow(false);
    setGraded(false);
    setState(card);
  }

  return (
    <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/50 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Card Content */}
        <div className="min-h-[120px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-slate-100 mb-2">
              {state.front}
            </div>
            {show && (
              <div className="text-slate-300 border-t border-slate-700 pt-4 mt-4">
                {state.back}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {!show && !graded && (
            <button
              onClick={() => setShow(true)}
              className="px-6 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              Show Answer
            </button>
          )}

          {graded && (
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>

        {/* Grade Buttons */}
        {show && !graded && (
          <div className="space-y-3">
            <div className="text-sm text-slate-400 text-center">
              How well did you know this?
            </div>
            <div className="grid grid-cols-3 gap-2">
              {gradeLabels.map(({ grade, label, color }) => (
                <button
                  key={grade}
                  onClick={() => grade(grade)}
                  className={`px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
          <span>EF: {state.ef.toFixed(2)}</span>
          <span>Interval: {state.interval}d</span>
          <span>Reps: {state.reps}</span>
        </div>

        {/* Success Message */}
        {graded && (
          <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            Card reviewed! Next review in {state.interval} day
            {state.interval !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}


