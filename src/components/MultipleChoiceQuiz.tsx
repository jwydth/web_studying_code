"use client";
import { useState } from "react";

export type MCQ = {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
};

export default function MultipleChoiceQuiz({ items }: { items: MCQ[] }) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const onPick = (id: string, idx: number) =>
    setAnswers((a) => ({ ...a, [id]: idx }));

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const picked = answers[item.id];
        const correct = picked !== undefined && picked === item.correctIndex;
        return (
          <div key={item.id} className="p-4 rounded-2xl border bg-white/5">
            <div className="font-medium mb-2">{item.question}</div>
            <div className="grid gap-2">
              {item.choices.map((c, i) => {
                const isPicked = picked === i;
                const isCorrect = i === item.correctIndex;
                const style =
                  picked == null
                    ? "border"
                    : isCorrect
                    ? "border border-green-600 bg-green-600/10"
                    : isPicked
                    ? "border border-red-600 bg-red-600/10"
                    : "border opacity-70";
                return (
                  <button
                    key={i}
                    onClick={() => onPick(item.id, i)}
                    className={`text-left px-3 py-2 rounded-lg ${style}`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            {picked != null && item.explanation && (
              <div
                className={`text-sm mt-2 ${
                  correct ? "text-green-400" : "text-red-300"
                }`}
              >
                {item.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
