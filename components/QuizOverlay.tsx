"use client";

/**
 * QuizOverlay.tsx — the in-video comprehension check, ported from Player.js.
 *
 * Controlled by the parent (the Player page owns the video timer and decides
 * WHEN to show a question). This component owns only the within-question
 * interaction: pick an option → lock the choices → show feedback → continue.
 *
 *   question   the question to show (null = nothing to render)
 *   visible    whether the overlay is shown (drives the fade)
 *   onAnswered called once with whether the chosen answer was correct
 *   onContinue called when the student dismisses the overlay to resume
 */

import { useState } from "react";
import type { QuizQuestion } from "@/lib/data";

interface QuizOverlayProps {
  question: QuizQuestion | null;
  visible: boolean;
  onAnswered?: (isCorrect: boolean) => void;
  onContinue?: () => void;
}

export default function QuizOverlay({
  question,
  visible,
  onAnswered,
  onContinue,
}: QuizOverlayProps) {
  const [chosen, setChosen] = useState<number | null>(null);

  // Reset the selection whenever a new question is shown. This is React's
  // "adjust state during render" pattern — preferred over a useEffect, which
  // would cause an extra render pass.
  const [prevQuestion, setPrevQuestion] = useState(question);
  if (question !== prevQuestion) {
    setPrevQuestion(question);
    setChosen(null);
  }

  if (!question) return null;

  const answered = chosen !== null;
  const isCorrect = chosen === question.correct;

  function choose(index: number) {
    if (answered || !question) return;
    setChosen(index);
    onAnswered?.(index === question.correct);
  }

  return (
    <div
      className={`quiz-overlay ${visible ? "visible" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Comprehension check"
      style={{ display: visible ? "flex" : "none" }}
    >
      <div className="quiz-box">
        <div className="quiz-label">⏸ Comprehension check</div>
        <div className="quiz-question">{question.question}</div>

        <div className="quiz-options">
          {question.options.map((option, i) => {
            let className = "quiz-option";
            if (answered && i === question.correct) className += " correct";
            else if (answered && i === chosen && !isCorrect)
              className += " wrong";
            return (
              <button
                key={i}
                type="button"
                className={className}
                disabled={answered}
                onClick={() => choose(i)}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div
          className={`quiz-feedback ${
            answered ? `show ${isCorrect ? "good" : "bad"}` : ""
          }`}
        >
          {answered &&
            (isCorrect ? "✓ " : "✗ Not quite. ") + question.explanation}
        </div>

        {answered && (
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
            onClick={onContinue}
          >
            Continue lesson →
          </button>
        )}
      </div>
    </div>
  );
}
