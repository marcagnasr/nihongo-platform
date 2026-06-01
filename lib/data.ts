/**
 * data.ts — lesson & quiz content (TEMPORARY)
 *
 * Ported from the prototype's `src/utils/data.js`. Field names are kept
 * identical so porting the screens stays mechanical.
 *
 * This is seed data for now. In Phase 2 it gets loaded into the PostgreSQL
 * database (see prisma/schema.prisma in the plan) and the app reads from there
 * instead. The types below intentionally mirror that future schema:
 *   level    → Prisma enum Level (lowercased here for the prototype's CSS classes)
 *   topic    → becomes a Topic table row
 *   quizzes  → become QuizQuestion table rows, keyed by lesson id
 */

// ── Types ────────────────────────────────────────────────────────────

/** Difficulty level. Lowercase so it maps directly to CSS classes
 *  (`tag-beginner`, etc.). Maps to the Prisma `Level` enum in Phase 2. */
export type Level = "beginner" | "intermediate" | "advanced";

/** The four content categories. Becomes the `Topic` table in Phase 2. */
export type Topic = "Grammar" | "Vocabulary" | "Kanji" | "Conversation";

export interface Lesson {
  id: string;
  title: string;
  topic: Topic;
  level: Level;
  /** Human-readable run time, "MM:SS". */
  duration: string;
  isFree: boolean;
  /** Watch progress 0–100. Placeholder until real per-user progress (Phase 2). */
  progress: number;
  description: string;
}

export interface QuizQuestion {
  /** Seconds into the video when this question triggers. */
  time: number;
  question: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  correct: number;
  explanation: string;
}

/** Quiz questions keyed by the lesson id they belong to. */
export type QuizMap = Record<string, QuizQuestion[]>;

// ── Topic display metadata ───────────────────────────────────────────

/** Topics in display order (used by the Browse screen's sections). */
export const TOPICS: readonly Topic[] = [
  "Grammar",
  "Vocabulary",
  "Kanji",
  "Conversation",
] as const;

/** Decorative kanji shown next to each topic heading. */
export const TOPIC_KANA: Record<Topic, string> = {
  Grammar: "文",
  Vocabulary: "語",
  Kanji: "字",
  Conversation: "話",
};

// ── Content ──────────────────────────────────────────────────────────

export const QUIZZES: QuizMap = {
  "lesson-ha-ga": [
    {
      time: 20,
      question: "Which particle marks the topic of a sentence?",
      options: ["は (wa)", "が (ga)", "を (wo)", "に (ni)"],
      correct: 0,
      explanation:
        "Correct! は (wa) marks the topic — what we are talking about. が marks the grammatical subject.",
    },
    {
      time: 55,
      question: "In the sentence 猫が魚を食べた, what does が tell us?",
      options: [
        "The cat is the topic being discussed",
        "The cat is specifically the one who ate",
        "The fish is the subject",
        "This is a question sentence",
      ],
      correct: 1,
      explanation:
        "Right! が emphasises that it was specifically the cat (and not something else) that ate the fish.",
    },
    {
      time: 100,
      question: "私___学生です — fill in the blank.",
      options: ["が", "を", "は", "で"],
      correct: 2,
      explanation:
        "は is correct here — \"I\" is the topic of the sentence. We are talking about me.",
    },
  ],
};

export const LESSONS: Lesson[] = [
  {
    id: "lesson-ha-ga",
    title: "は vs が — Understanding the core difference",
    topic: "Grammar",
    level: "beginner",
    duration: "12:34",
    isFree: false,
    progress: 65,
    description:
      "The most common confusion point for beginners. Covered with real sentence examples.",
  },
  {
    id: "lesson-te-form",
    title: "て-form: the Swiss Army knife of Japanese",
    topic: "Grammar",
    level: "beginner",
    duration: "18:20",
    isFree: false,
    progress: 0,
    description:
      "Requests, sequences, and the key to connecting sentences naturally.",
  },
  {
    id: "lesson-conditionals",
    title: "Conditional forms: と、ば、たら、なら",
    topic: "Grammar",
    level: "intermediate",
    duration: "22:15",
    isFree: false,
    progress: 0,
    description: "Four conditionals. One clear framework to remember them all.",
  },
  {
    id: "lesson-n3-monono",
    title: "N3 Grammar: 〜ものの and 〜ながらも",
    topic: "Grammar",
    level: "advanced",
    duration: "16:08",
    isFree: false,
    progress: 0,
    description:
      "Concessive expressions with nuance that textbooks don't explain well.",
  },
  {
    id: "lesson-verbs-50",
    title: "Essential verbs: the first 50 you need",
    topic: "Vocabulary",
    level: "beginner",
    duration: "25:00",
    isFree: false,
    progress: 0,
    description:
      "The core action words that make up 80% of everyday speech.",
  },
  {
    id: "lesson-emotion-words",
    title: "Emotion words: beyond 嬉しい and 悲しい",
    topic: "Vocabulary",
    level: "intermediate",
    duration: "19:44",
    isFree: false,
    progress: 0,
    description: "Expand your emotional vocabulary and sound more natural.",
  },
  {
    id: "lesson-keigo",
    title: "Keigo verbs: the respectful substitutions",
    topic: "Vocabulary",
    level: "intermediate",
    duration: "17:30",
    isFree: false,
    progress: 0,
    description:
      "いらっしゃる、おっしゃる、なさる and the logic behind them.",
  },
  {
    id: "lesson-hiragana",
    title: "Hiragana complete: あ〜ん with stroke order",
    topic: "Kanji",
    level: "beginner",
    duration: "32:10",
    isFree: true,
    progress: 0,
    description:
      "Every hiragana character with correct stroke order and memory tricks.",
  },
  {
    id: "lesson-joyo-kanji",
    title: "First 80 Jōyō Kanji: radicals and meanings",
    topic: "Kanji",
    level: "beginner",
    duration: "28:55",
    isFree: false,
    progress: 0,
    description:
      "Learn the radicals that appear in hundreds of kanji — the right foundation.",
  },
  {
    id: "lesson-restaurant",
    title: "At a restaurant: ordering naturally",
    topic: "Conversation",
    level: "beginner",
    duration: "14:22",
    isFree: false,
    progress: 0,
    description:
      "Real dialogue, natural pacing. What to say, how to say it, what to expect back.",
  },
  {
    id: "lesson-casual-speech",
    title: "Casual speech patterns: dropping particles",
    topic: "Conversation",
    level: "advanced",
    duration: "20:48",
    isFree: false,
    progress: 0,
    description:
      "How real Japanese sounds vs textbook Japanese — and why both matter.",
  },
];

// ── Selectors ────────────────────────────────────────────────────────
// Small typed helpers so screens don't re-implement lookups. When the data
// moves to the database in Phase 2, these are the functions that get swapped
// to query Prisma — the screens calling them won't have to change.

/** Find a lesson by id, or `undefined` if not present. */
export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

/** Quiz questions for a lesson (empty array if none authored yet). */
export function getQuizForLesson(lessonId: string): QuizQuestion[] {
  return QUIZZES[lessonId] ?? [];
}

/** Lessons grouped by topic, in `TOPICS` display order. Used by Browse. */
export function lessonsByTopic(lessons: Lesson[] = LESSONS): [Topic, Lesson[]][] {
  return TOPICS.map((topic) => [
    topic,
    lessons.filter((lesson) => lesson.topic === topic),
  ]).filter(([, group]) => group.length > 0) as [Topic, Lesson[]][];
}
