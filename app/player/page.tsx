"use client";

/**
 * Player — video lesson player with in-video quizzes. Ported from Player.js.
 *
 * Phase 1 simulates the video with a timer (real Bunny.net video lands in
 * Phase 4). The orchestration lives here; the quiz UI is the reusable
 * <QuizOverlay> component.
 *
 * Implementation note: the ticking timer reads the latest progress / quiz
 * index from refs (not state), because a setInterval closure would otherwise
 * capture stale values. State mirrors the refs purely so React re-renders.
 */

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/Toast";
import QuizOverlay from "@/components/QuizOverlay";
import { getLessonById, getQuizForLesson } from "@/lib/data";

const LESSON_ID = "lesson-ha-ga";
const TOTAL_SECONDS = 120;
const TICK_MS = 200; // fake video advances 1s per tick

const PLAYLIST = [
  "は vs が — core difference",
  "て-form conjugation",
  "Conditional forms: と ば たら なら",
  "Passive and causative forms",
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PlayerPage() {
  const { showToast } = useToast();
  const lesson = getLessonById(LESSON_ID);
  const quizzes = getQuizForLesson(LESSON_ID);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [quizVisible, setQuizVisible] = useState(false);

  // Refs mirror the values the interval/keyboard handlers need to read live.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);
  const quizIndexRef = useRef(0);
  const playingRef = useRef(false);
  const startedRef = useRef(false);
  const quizVisibleRef = useRef(false);

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    playingRef.current = false;
    setPlaying(false);
  }

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    playingRef.current = true;
    setPlaying(true);
    timerRef.current = setInterval(() => {
      const next = Math.min(progressRef.current + 1, TOTAL_SECONDS);
      progressRef.current = next;
      setProgress(next);

      const qi = quizIndexRef.current;
      if (qi < quizzes.length && next >= quizzes[qi].time) {
        stopTimer();
        quizVisibleRef.current = true;
        setQuizVisible(true);
      } else if (next >= TOTAL_SECONDS) {
        stopTimer();
        showToast("🎉 Lesson complete! Great work.");
      }
    }, TICK_MS);
  }

  function togglePlay() {
    if (playingRef.current) stopTimer();
    else startTimer();
  }

  function start() {
    setStarted(true);
    startedRef.current = true;
    progressRef.current = 0;
    setProgress(0);
    quizIndexRef.current = 0;
    setQuizIndex(0);
    setAnswered(0);
    setCorrect(0);
    quizVisibleRef.current = false;
    setQuizVisible(false);
    startTimer();
  }

  function handleAnswered(isCorrect: boolean) {
    setAnswered((a) => a + 1);
    if (isCorrect) setCorrect((c) => c + 1);
  }

  function handleContinue() {
    quizVisibleRef.current = false;
    setQuizVisible(false);
    const nextIndex = quizIndexRef.current + 1;
    quizIndexRef.current = nextIndex;
    setQuizIndex(nextIndex);
    // Step past the trigger point so the same quiz doesn't immediately re-fire.
    const next = Math.min(progressRef.current + 1, TOTAL_SECONDS);
    progressRef.current = next;
    setProgress(next);
    startTimer();
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const p = Math.floor(pct * TOTAL_SECONDS);
    progressRef.current = p;
    setProgress(p);
  }

  // Spacebar toggles play/pause (when started and no quiz is showing).
  // Bound once; reads live values from refs.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== " ") return;
      if (!startedRef.current || quizVisibleRef.current) return;
      e.preventDefault();
      togglePlay();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop the ticker if the user navigates away.
  useEffect(() => () => stopTimer(), []);

  const pct = (progress / TOTAL_SECONDS) * 100;
  const scoreDisplay =
    answered === 0 ? "—" : `${Math.round((correct / answered) * 100)}%`;

  return (
    <section>
      <div className="player-layout">
        <div>
          <div className="video-wrap">
            {!started && (
              <div className="video-placeholder">
                <div
                  style={{
                    fontFamily: "var(--font-shippori)",
                    fontSize: 14,
                    color: "#888",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  {lesson?.title ?? "Lesson"}
                </div>
                <button
                  className="play-btn-big"
                  aria-label="Play video"
                  onClick={start}
                >
                  ▶
                </button>
                <div className="video-title-overlay">
                  Click to simulate playing
                </div>
              </div>
            )}

            {started && (
              <div className="video-progress">
                <div className="progress-track" onClick={seek}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                  <div className="progress-thumb" style={{ left: `${pct}%` }} />
                </div>
                <div className="video-controls">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <button
                      className="vid-btn"
                      aria-label="Play/Pause"
                      onClick={togglePlay}
                    >
                      {playing ? "⏸" : "▶"}
                    </button>
                    <span className="video-time">
                      {formatTime(progress)} / 2:00
                    </span>
                  </div>
                  <div className="vid-btns">
                    <button className="vid-btn" title="Subtitles">
                      CC
                    </button>
                    <button className="vid-btn" title="Settings">
                      ⚙
                    </button>
                    <button className="vid-btn" title="Fullscreen">
                      ⛶
                    </button>
                  </div>
                </div>
              </div>
            )}

            <QuizOverlay
              question={quizVisible ? quizzes[quizIndex] : null}
              visible={quizVisible}
              onAnswered={handleAnswered}
              onContinue={handleContinue}
            />
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="sidebar">
          <div className="sidebar-card lesson-info">
            <div className="sidebar-title">Now playing</div>
            <h2>{lesson?.title}</h2>
            <p style={{ marginTop: 8 }}>Grammar · Beginner · 3 quiz checkpoints</p>
            <div className="lesson-stats">
              <div className="lesson-stat">
                <div className="lesson-stat-num">{lesson?.duration}</div>
                <div className="lesson-stat-lbl">Duration</div>
              </div>
              <div className="lesson-stat">
                <div className="lesson-stat-num">{scoreDisplay}</div>
                <div className="lesson-stat-lbl">Quiz score</div>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">Lesson notes</div>
            <div className="notes-area">
              <p>
                <strong>は (wa)</strong> — marks the <em>topic</em>. What
                we&apos;re talking about.
              </p>
              <br />
              <p>
                <strong>が (ga)</strong> — marks the <em>subject</em>. Who or
                what does the action.
              </p>
              <br />
              <p>
                Key insight: は can imply contrast. が emphasises the subject
                specifically.
              </p>
              <br />
              <p style={{ color: "var(--red)", fontWeight: 500 }}>
                ✦ Watch for the quiz at 4:32 and 9:10
              </p>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">Up next in Grammar</div>
            {PLAYLIST.map((name, i) => (
              <div
                className={`playlist-item ${i === 0 ? "active" : ""}`}
                key={name}
              >
                <span className="playlist-num">0{i + 1}</span>
                <span className="playlist-name">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
