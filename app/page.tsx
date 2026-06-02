"use client";

/**
 * Home — landing page (hero, features, pricing). Ported from Home.js.
 *
 * Client component because the CTAs open the auth modal and navigate.
 * Plain navigations use the router; modal triggers use useModal().
 */

import { useRouter } from "next/navigation";
import { useModal } from "@/components/Modal";

const FEATURES: [string, string, string][] = [
  [
    "⏸",
    "In-video quizzes",
    "The video pauses at key moments and asks you to answer a question before continuing. You can't zone out and pretend you understood.",
  ],
  [
    "🧠",
    "Adaptive recommendations",
    "After every lesson, the platform analyses your quiz scores and suggests exactly what to study next — targeting your actual weak spots.",
  ],
  [
    "📈",
    "Progress you can see",
    "Your dashboard shows completion by topic, quiz scores over time, learning streaks, and a clear picture of where you're strong and where to focus.",
  ],
  [
    "🔁",
    "Spaced repetition",
    "Vocabulary and kanji you get wrong come back at the right intervals. The science of forgetting, used in your favour.",
  ],
  [
    "👩‍🏫",
    "Live sessions",
    "Book a 1-on-1 session directly with the teacher. Pick a time, pay, get a Zoom link — all from inside the platform.",
  ],
  [
    "🗂",
    "Topic + level structure",
    "Lessons organised by topic first (Grammar, Vocabulary, Kanji) so you go deep on what matters to you, at your own level.",
  ],
];

const PRICE_FEATURES = [
  "Unlimited access to all 100+ lessons",
  "In-video quizzes on every lesson",
  "Personalised progress dashboard",
  "AI-powered study recommendations",
  "Spaced repetition vocabulary review",
  "Live session booking (billed separately)",
];

interface PreviewItem {
  num: string;
  name: string;
  tags: { label: string; cls: string }[];
  free?: boolean;
}

const PREVIEW_ITEMS: PreviewItem[] = [
  {
    num: "01",
    name: "Hiragana: あ〜お",
    tags: [
      { label: "Beginner", cls: "tag-beginner" },
      { label: "Free", cls: "tag-free" },
    ],
    free: true,
  },
  {
    num: "02",
    name: "は vs が — the core difference",
    tags: [{ label: "Beginner", cls: "tag-beginner" }],
  },
  {
    num: "03",
    name: "て-form conjugation",
    tags: [{ label: "Intermediate", cls: "tag-intermediate" }],
  },
  {
    num: "04",
    name: "N3 Grammar:〜ものの",
    tags: [{ label: "Advanced", cls: "tag-advanced" }],
  },
  {
    num: "05",
    name: "Reading Kanji in context",
    tags: [{ label: "Intermediate", cls: "tag-intermediate" }],
  },
];

export default function Home() {
  const router = useRouter();
  const { openModal } = useModal();

  return (
    <section>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div className="hero-kana" aria-hidden="true">
          語
        </div>
        <div className="hero">
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "var(--red-light)",
                color: "var(--red)",
                fontSize: 12,
                fontWeight: 600,
                padding: "5px 12px",
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              ✦ Interactive Japanese learning
            </div>
            <h1>
              Learn Japanese
              <br />
              the way it <em>sticks</em>
            </h1>
            <p>
              Video lessons that pause and quiz you mid-lesson. Track your
              progress. Get personalised recommendations. Built by a real
              teacher, not an algorithm.
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-red"
                onClick={() => router.push("/lessons")}
              >
                Browse lessons →
              </button>
              <button
                className="btn btn-outline"
                onClick={() => router.push("/player")}
              >
                Watch a free lesson
              </button>
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 13,
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <span style={{ color: "var(--success)", fontWeight: 600 }}>✓</span>{" "}
              7-day free trial &nbsp;·&nbsp;
              <span style={{ color: "var(--success)", fontWeight: 600 }}>✓</span>{" "}
              Cancel anytime &nbsp;·&nbsp;
              <span style={{ color: "var(--success)", fontWeight: 600 }}>✓</span>{" "}
              100+ lessons
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-title">
              <div className="dot" /> Popular lessons
            </div>
            <div className="lesson-preview">
              {PREVIEW_ITEMS.map((item) => (
                <div
                  key={item.num}
                  className="lesson-preview-item"
                  onClick={() =>
                    item.free ? router.push("/player") : openModal("signup")
                  }
                >
                  <span className="lesson-num">{item.num}</span>
                  <span className="lesson-name">{item.name}</span>
                  {item.tags.map((tag) => (
                    <span key={tag.label} className={`lesson-tag ${tag.cls}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <button
              className="btn btn-outline"
              style={{ width: "100%", marginTop: 14, justifyContent: "center" }}
              onClick={() => router.push("/lessons")}
            >
              View all lessons →
            </button>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="features-inner">
          <h2>Built differently</h2>
          <div className="features-grid">
            {FEATURES.map(([icon, title, desc]) => (
              <div className="feature-card" key={title}>
                <div className="feature-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pricing-strip">
        <h2>Simple pricing</h2>
        <p>One plan. Everything included. Cancel whenever.</p>
        <div className="pricing-card">
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              marginBottom: 4,
              fontWeight: 500,
            }}
          >
            Monthly membership
          </div>
          <div className="price-amount">$20</div>
          <div className="price-period">per month</div>
          <div className="price-features">
            {PRICE_FEATURES.map((feature) => (
              <div className="price-feature" key={feature}>
                {feature}
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: 12 }}
            onClick={() => openModal("signup")}
          >
            Start 7-day free trial
          </button>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
            No credit card needed for trial.
          </div>
        </div>
      </div>
    </section>
  );
}
