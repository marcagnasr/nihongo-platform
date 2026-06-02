"use client";

/**
 * Browse — lesson catalogue grouped by topic, filterable by level.
 * Ported from Browse.js.
 *
 * Reads lessons through lib/data selectors. In Phase 2 those selectors start
 * hitting the database; this screen won't need to change.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/Modal";
import { useToast } from "@/components/Toast";
import FilterBar from "@/components/FilterBar";
import LessonCard from "@/components/LessonCard";
import {
  LESSONS,
  TOPIC_KANA,
  lessonsByTopic,
  type Lesson,
  type Level,
} from "@/lib/data";

type FilterValue = "all" | Level;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function BrowsePage() {
  const router = useRouter();
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered =
    filter === "all" ? LESSONS : LESSONS.filter((l) => l.level === filter);
  const grouped = lessonsByTopic(filtered);

  function handleFilter(value: FilterValue) {
    setFilter(value);
    const label = FILTERS.find((f) => f.value === value)?.label ?? value;
    showToast(`Filtering: ${label}`);
  }

  function handleSelect(lesson: Lesson) {
    if (lesson.isFree) router.push("/player");
    else openModal("signup");
  }

  return (
    <section>
      <div className="page-header">
        <h1>All Lessons</h1>
        <p>
          100+ lessons organised by topic. Filter by level to find where you
          are.
        </p>
      </div>

      <FilterBar options={FILTERS} active={filter} onChange={handleFilter} />

      <div className="topics-container">
        {grouped.map(([topic, lessons]) => (
          <div className="topic-section" key={topic}>
            <h2>
              <span className="topic-kana">{TOPIC_KANA[topic]}</span> {topic}
            </h2>
            <div className="lessons-grid">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <p style={{ color: "var(--muted)", padding: "20px 0" }}>
            No lessons match that filter.
          </p>
        )}
      </div>
    </section>
  );
}
