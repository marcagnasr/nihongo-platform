// TEMPORARY placeholder — replaced by the real Home screen in the
// "pages" step of Phase 1. Exists only to visually confirm that the
// design system (fonts + colour tokens) is wired up correctly.

export default function Home() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 2rem" }}>
      <p className="nav-logo" style={{ fontSize: 28, marginBottom: 8 }}>
        日本語<span>。</span>
      </p>
      <h1
        style={{
          fontFamily: "var(--font-shippori)",
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.15,
          marginBottom: 16,
        }}
      >
        Design system{" "}
        <em style={{ color: "var(--red)", fontStyle: "normal" }}>live</em>.
      </h1>
      <p
        style={{
          color: "var(--muted)",
          fontSize: 17,
          marginBottom: 32,
          maxWidth: 480,
        }}
      >
        Shippori Mincho headings, DM Sans body, DM Mono numbers — and the full
        colour palette ported from the prototype. This page is a placeholder.
      </p>

      <div className="hero-actions" style={{ marginBottom: 40 }}>
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-outline">Outline</button>
        <button className="btn btn-red">Red</button>
      </div>

      <div className="lessons-grid">
        <div className="lesson-card">
          <div className="lesson-card-meta">
            <span className="lesson-tag tag-beginner">Beginner</span>
            <span className="lesson-tag tag-free">Free</span>
          </div>
          <h3>Sample lesson card</h3>
          <p>This card uses the ported component styles directly.</p>
          <div className="lesson-card-footer">
            <span className="duration">12:34</span>
            <span className="lock-icon">🔒</span>
          </div>
        </div>
        <div className="lesson-card">
          <div className="lesson-card-meta">
            <span className="lesson-tag tag-intermediate">Intermediate</span>
          </div>
          <h3>Token check</h3>
          <p>Paper background, ink text, red accent, teal &amp; gold tags.</p>
          <div className="progress-bar" style={{ marginTop: 12 }}>
            <div
              className="progress-bar-fill fill-teal"
              style={{ width: "60%" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
