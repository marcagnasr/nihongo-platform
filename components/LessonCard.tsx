"use client";

/**
 * LessonCard.tsx — a single lesson tile, used on Browse (and reusable elsewhere).
 *
 * Presentational: it renders the lesson and reports clicks via `onSelect`.
 * The PARENT decides what a click does (open the signup modal for locked
 * lessons, navigate for free ones), so this card stays reusable.
 */

import type { Lesson } from "@/lib/data";
import { getQuizForLesson } from "@/lib/data";
import ProgressBar from "./ProgressBar";

interface LessonCardProps {
  lesson: Lesson;
  onSelect?: (lesson: Lesson) => void;
}

const levelLabel = (level: string) =>
  level.charAt(0).toUpperCase() + level.slice(1);

export default function LessonCard({ lesson, onSelect }: LessonCardProps) {
  const locked = !lesson.isFree;
  // Fall back to 3 (the prototype's placeholder) until real quizzes are authored.
  const quizCount = getQuizForLesson(lesson.id).length || 3;

  return (
    <div
      className="lesson-card"
      data-locked={locked}
      onClick={() => onSelect?.(lesson)}
    >
      <div className="lesson-card-meta">
        <span className={`lesson-tag tag-${lesson.level}`}>
          {levelLabel(lesson.level)}
        </span>
        {lesson.isFree && <span className="lesson-tag tag-free">Free</span>}
      </div>

      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>

      <div className="lesson-card-footer">
        <span className="duration">⏱ {lesson.duration}</span>
        {locked ? (
          <span className="lock-icon">🔒</span>
        ) : (
          <span>{quizCount} quizzes</span>
        )}
      </div>

      {lesson.progress > 0 && <ProgressBar value={lesson.progress} mini />}
    </div>
  );
}
