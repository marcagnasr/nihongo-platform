"use client";

/**
 * Admin — lesson manager. Ported from Admin.js.
 *
 * The prototype filtered table rows by poking the DOM. Here the search is
 * React state and we render only the matching rows — same result, no DOM
 * surgery. Metrics and the quiz editor are static placeholders for now
 * (real data + editing land in Phase 4 / Phase 6).
 */

import { useState } from "react";
import { useToast } from "@/components/Toast";
import { getLessonById } from "@/lib/data";

type Status = "free" | "active" | "draft";

interface AdminRow {
  id: string;
  quizzes: number;
  completions: number;
  status: Status;
}

const ROWS: AdminRow[] = [
  { id: "lesson-ha-ga", quizzes: 3, completions: 38, status: "free" },
  { id: "lesson-te-form", quizzes: 4, completions: 29, status: "active" },
  { id: "lesson-conditionals", quizzes: 5, completions: 17, status: "active" },
  { id: "lesson-n3-monono", quizzes: 2, completions: 8, status: "draft" },
  { id: "lesson-verbs-50", quizzes: 6, completions: 41, status: "active" },
  { id: "lesson-hiragana", quizzes: 5, completions: 52, status: "free" },
];

const STATUS_LABEL: Record<Status, string> = {
  free: "Free",
  active: "Published",
  draft: "Draft",
};
const STATUS_CLASS: Record<Status, string> = {
  free: "status-free",
  active: "status-active",
  draft: "status-draft",
};

const ADMIN_STATS: [string, string, string][] = [
  ["47", "Active subscribers", "↑ 6 this month"],
  ["$940", "Monthly revenue", "↑ $120 vs last month"],
  ["94", "Published lessons", "12 drafts unpublished"],
  ["312", "Quiz answers this week", "71% correct rate"],
];

const QUIZ_CHECKPOINTS: [string, string, string][] = [
  ["2:15", "Which particle marks the topic of a sentence?", "Multiple choice · 4 options"],
  ["4:32", "In the sentence 猫が魚を食べた, what does が tell us?", "Multiple choice · 4 options"],
  ["9:10", "Fill in the blank: 私___学生です (I am a student)", "Fill in the blank"],
];

const levelLabel = (level: string) =>
  level.charAt(0).toUpperCase() + level.slice(1);

export default function AdminPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [timestamp, setTimestamp] = useState("4:32");

  const rows = ROWS.map((row) => ({ ...row, lesson: getLessonById(row.id) }))
    .filter((row) => row.lesson)
    .filter((row) =>
      row.lesson!.title.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <section>
      <div className="admin-layout">
        <div className="admin-header">
          <h1>Admin — Lesson Manager</h1>
          <button
            className="btn btn-primary"
            onClick={() => showToast("✦ New lesson form would open here")}
          >
            + Add new lesson
          </button>
        </div>

        <div className="admin-stats">
          {ADMIN_STATS.map(([num, lbl, trend]) => (
            <div className="admin-card" key={lbl}>
              <div className="admin-card-big">{num}</div>
              <div className="admin-card-lbl">{lbl}</div>
              <div className="admin-card-trend">{trend}</div>
            </div>
          ))}
        </div>

        {/* Lessons table */}
        <div className="table-wrap" style={{ marginBottom: 24 }}>
          <div className="table-head">
            <h3>Lessons</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => showToast("Opening filter panel...")}
              >
                Filter
              </button>
              <input
                type="text"
                placeholder="Search lessons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "6px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "var(--font-dm-sans)",
                }}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Topic</th>
                <th>Level</th>
                <th>Quizzes</th>
                <th>Completions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 500 }}>{row.lesson!.title}</td>
                  <td>{row.lesson!.topic}</td>
                  <td>
                    <span className={`lesson-tag tag-${row.lesson!.level}`}>
                      {levelLabel(row.lesson!.level)}
                    </span>
                  </td>
                  <td>{row.quizzes}</td>
                  <td>{row.completions}</td>
                  <td>
                    <span className={`status-pill ${STATUS_CLASS[row.status]}`}>
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() =>
                        showToast(`Opening editor for: ${row.lesson!.title}`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quiz editor */}
        <div className="quiz-editor">
          <div className="quiz-editor-header">
            <h3>Quiz Editor — は vs が (Lesson 1)</h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => showToast("✦ Question saved!")}
            >
              + Add question
            </button>
          </div>
          <div className="quiz-editor-body">
            <div className="quiz-video-side">
              <div className="quiz-timeline">
                <div style={{ fontSize: 28, opacity: 0.3 }}>▶</div>
                <div style={{ fontSize: 13, opacity: 0.6 }}>Video preview</div>
                <div style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>
                  Click a timestamp to jump
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                Add question at timestamp:
              </div>
              <div className="timestamp-row">
                <input
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                />
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    showToast(`✦ Jumped to ${timestamp} in video preview`)
                  }
                >
                  Go to time
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => showToast(`✦ Quiz added at ${timestamp}!`)}
                >
                  Add quiz here
                </button>
              </div>
              <div
                style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}
              >
                Tip: Play the video, pause at the moment you want to ask a
                question, then click &quot;Add quiz here&quot;.
              </div>
            </div>

            <div className="quiz-list-side">
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 4,
                }}
              >
                3 quiz checkpoints
              </div>
              {QUIZ_CHECKPOINTS.map(([ts, q, type]) => (
                <div className="quiz-item-admin" key={ts}>
                  <div className="quiz-item-timestamp">⏱ {ts}</div>
                  <div className="quiz-item-q">{q}</div>
                  <div className="quiz-item-type">{type}</div>
                </div>
              ))}
              <button
                className="btn btn-outline btn-sm"
                style={{ marginTop: 4 }}
                onClick={() => showToast("Reordering quiz questions...")}
              >
                Reorder questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
