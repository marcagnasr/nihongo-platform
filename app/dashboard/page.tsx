"use client";

/**
 * Dashboard — logged-in student home. Ported from Dashboard.js.
 *
 * Phase 1 stats are hardcoded (same as the prototype). Phase 5 replaces them
 * with real data computed from the database.
 */

import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import ProgressBar from "@/components/ProgressBar";

type Fill = "teal" | "gold" | "red";

const STATS: [string, string, string, string][] = [
  ["23", "Lessons completed", "↑ 4 this week", "var(--success)"],
  ["7🔥", "Day streak", "Personal best!", "var(--success)"],
  ["74%", "Overall quiz avg", "↓ particles drag it down", "var(--warn)"],
  ["4.2h", "Study time this week", "↑ 40min vs last week", "var(--success)"],
];

interface TopicRow {
  name: string;
  avg: string;
  scoreClass: string;
  lessons: string;
  pct: number;
  fill: Fill;
}

const TOPIC_ROWS: TopicRow[] = [
  { name: "Grammar", avg: "74%", scoreClass: "score-mid", lessons: "8/24", pct: 33, fill: "teal" },
  { name: "Vocabulary", avg: "88%", scoreClass: "score-good", lessons: "5/18", pct: 28, fill: "teal" },
  { name: "Kanji", avg: "61%", scoreClass: "score-low", lessons: "6/22", pct: 27, fill: "gold" },
  { name: "Conversation", avg: "91%", scoreClass: "score-good", lessons: "4/16", pct: 25, fill: "teal" },
];

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <section>
      <div className="dash-layout">
        <div className="dash-greeting">
          <h1>おはようございます 👋</h1>
          <p>
            You&apos;re on a 7-day streak. Keep it up — consistency is
            everything in language learning.
          </p>
        </div>

        <div className="stats-row">
          {STATS.map(([num, lbl, sub, color]) => (
            <div className="stat-card" key={lbl}>
              <div className="stat-card-num">{num}</div>
              <div className="stat-card-lbl">{lbl}</div>
              <div className="stat-card-sub" style={{ color }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Continue learning */}
            <div className="dash-card">
              <h3>
                Continue learning{" "}
                <a onClick={() => router.push("/lessons")}>browse all →</a>
              </h3>
              <div className="continue-item" onClick={() => router.push("/player")}>
                <div className="continue-thumb">▶</div>
                <div className="continue-meta" style={{ flex: 1 }}>
                  <h4>は vs が — core difference</h4>
                  <p>Grammar · Beginner · 65% watched</p>
                  <ProgressBar value={65} fill="teal" />
                </div>
                <button className="btn btn-primary btn-sm">Resume</button>
              </div>
              <div className="continue-item" onClick={() => router.push("/player")}>
                <div className="continue-thumb" style={{ background: "var(--teal)" }}>
                  ▶
                </div>
                <div className="continue-meta" style={{ flex: 1 }}>
                  <h4>て-form conjugation</h4>
                  <p>Grammar · Beginner · Not started</p>
                  <ProgressBar value={0} fill="teal" />
                </div>
                <button className="btn btn-outline btn-sm">Start</button>
              </div>
            </div>

            {/* AI recommendation */}
            <div className="dash-card">
              <h3>🤖 AI recommendation</h3>
              <div className="ai-rec">
                <div className="ai-rec-label">
                  Based on your recent quiz scores
                </div>
                <h4>You should revisit: Particle usage</h4>
                <p>
                  You scored 55% on は vs が questions last week. The lesson on
                  particle nuance will specifically target the gaps your answers
                  revealed.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => router.push("/player")}
                >
                  Go to recommended lesson →
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => showToast("Loading next recommendation...")}
                >
                  Show me something else
                </button>
              </div>
            </div>

            {/* Progress by topic */}
            <div className="dash-card">
              <h3>Progress by topic</h3>
              <div className="topic-progress">
                {TOPIC_ROWS.map((row) => (
                  <div className="tp-row" key={row.name}>
                    <div className="tp-header">
                      <span className="tp-name">{row.name}</span>
                      <span
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <span className={`score-badge ${row.scoreClass}`}>
                          {row.avg} quiz avg
                        </span>
                        <span className="tp-pct">{row.lessons} lessons</span>
                      </span>
                    </div>
                    <ProgressBar value={row.pct} fill={row.fill} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Streak */}
            <div className="dash-card">
              <h3>This week</h3>
              <div className="streak-row">
                {WEEK.map((day, i) => (
                  <div
                    className={`streak-day ${
                      i < 6 ? "streak-active" : "streak-today"
                    }`}
                    key={i}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div
                style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}
              >
                Every day this week ✦
              </div>
            </div>

            {/* Vocab review */}
            <div className="dash-card">
              <h3>Vocabulary review 🔁</h3>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  marginBottom: 12,
                }}
              >
                12 words due for review today based on your quiz mistakes.
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    background: "var(--red-light)",
                    borderRadius: 7,
                    padding: "10px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontFamily: "var(--font-shippori)", fontSize: 18 }}
                  >
                    粒子
                  </span>
                  <span style={{ fontSize: 12, color: "var(--red)" }}>
                    Missed 3×
                  </span>
                </div>
                <div
                  style={{
                    background: "var(--warn-bg)",
                    borderRadius: 7,
                    padding: "10px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontFamily: "var(--font-shippori)", fontSize: 18 }}
                  >
                    難しい
                  </span>
                  <span style={{ fontSize: 12, color: "var(--warn)" }}>
                    Missed 2×
                  </span>
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => showToast("Opening vocabulary review...")}
              >
                Start review session →
              </button>
            </div>

            {/* Live session */}
            <div className="dash-card">
              <h3>Book a live session</h3>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  marginBottom: 14,
                  lineHeight: 1.6,
                }}
              >
                Next availability: <strong>Tomorrow 10:00am</strong>
              </div>
              <button
                className="btn btn-outline"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => showToast("📅 Opening booking calendar...")}
              >
                View my schedule →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
