"use client";

import React, { useState } from "react";
import {
  Newspaper,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import type { EnrichedCurrentAffair } from "@/lib/dashboard-service";
import { UI_TEXT, type Lang } from "@/lib/i18n";
import { QuestionCard } from "./QuestionCard";

interface CurrentAffairsSectionProps {
  currentAffairs: EnrichedCurrentAffair[];
  lang: Lang;
  onDataChanged: () => void;
}

const CA_CATEGORIES = [
  "All",
  "Economy & Budget",
  "Province & Local",
  "International",
  "National",
];

export function CurrentAffairsSection({
  currentAffairs,
  lang,
  onDataChanged,
}: CurrentAffairsSectionProps) {
  const t = UI_TEXT[lang];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] =
    useState<EnrichedCurrentAffair | null>(null);

  // Form states
  const [titleEn, setTitleEn] = useState("");
  const [titleNe, setTitleNe] = useState("");
  const [summaryEn, setSummaryEn] = useState("");
  const [summaryNe, setSummaryNe] = useState("");
  const [keyPointsText, setKeyPointsText] = useState("");
  const [category, setCategory] = useState("National");
  const [publishedDateBs, setPublishedDateBs] = useState("2082 Baisakh");

  // Optional inline exam-oriented MCQ
  const [includeMcq, setIncludeMcq] = useState(true);
  const [mcqQuestionEn, setMcqQuestionEn] = useState("");
  const [mcqOptionA, setMcqOptionA] = useState("");
  const [mcqOptionB, setMcqOptionB] = useState("");
  const [mcqOptionC, setMcqOptionC] = useState("");
  const [mcqOptionD, setMcqOptionD] = useState("");
  const [mcqCorrect, setMcqCorrect] = useState<"A" | "B" | "C" | "D">("A");

  const [saving, setSaving] = useState(false);

  const filtered = currentAffairs.filter(
    (ca) => selectedCategory === "All" || ca.category === selectedCategory
  );

  function openNewForm() {
    setEditingItem(null);
    setTitleEn("");
    setTitleNe("");
    setSummaryEn("");
    setSummaryNe("");
    setKeyPointsText("");
    setCategory("National");
    setPublishedDateBs("2082 Baisakh");
    setIncludeMcq(true);
    setMcqQuestionEn("");
    setMcqOptionA("");
    setMcqOptionB("");
    setMcqOptionC("");
    setMcqOptionD("");
    setMcqCorrect("A");
    setShowForm(true);
  }

  function openEditForm(item: EnrichedCurrentAffair) {
    setEditingItem(item);
    setTitleEn(item.titleEn);
    setTitleNe(item.titleNe);
    setSummaryEn(item.summaryEn);
    setSummaryNe(item.summaryNe);
    setKeyPointsText(item.keyPointsEn.join("\n"));
    setCategory(item.category);
    setPublishedDateBs(item.publishedDateBs);
    setIncludeMcq(false);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titleEn.trim() || !summaryEn.trim()) return;
    setSaving(true);
    try {
      const points = keyPointsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      if (editingItem) {
        const res = await fetch(`/api/current-affairs/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titleEn: titleEn.trim(),
            titleNe: titleNe.trim() || titleEn.trim(),
            summaryEn: summaryEn.trim(),
            summaryNe: summaryNe.trim() || summaryEn.trim(),
            keyPointsEn: points.length > 0 ? points : [summaryEn.trim()],
            keyPointsNe: points.length > 0 ? points : [summaryEn.trim()],
            category,
            publishedDateBs,
          }),
        });
        if (res.ok) {
          setShowForm(false);
          onDataChanged();
        }
      } else {
        const res = await fetch("/api/current-affairs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titleEn: titleEn.trim(),
            titleNe: titleNe.trim() || titleEn.trim(),
            summaryEn: summaryEn.trim(),
            summaryNe: summaryNe.trim() || summaryEn.trim(),
            keyPointsEn: points.length > 0 ? points : [summaryEn.trim()],
            keyPointsNe: points.length > 0 ? points : [summaryEn.trim()],
            category,
            publishedDateBs,
            mcq:
              includeMcq && mcqQuestionEn.trim() && mcqOptionA.trim()
                ? {
                    questionEn: mcqQuestionEn.trim(),
                    optionAEn: mcqOptionA.trim(),
                    optionBEn: mcqOptionB.trim(),
                    optionCEn: mcqOptionC.trim(),
                    optionDEn: mcqOptionD.trim(),
                    correctOption: mcqCorrect,
                    explanationEn: summaryEn.trim(),
                  }
                : undefined,
          }),
        });
        if (res.ok) {
          setShowForm(false);
          onDataChanged();
        }
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/current-affairs/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onDataChanged();
    }
  }

  return (
    <div className="space-y-5">
      {/* Header & Category Filter */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5 dark:border-slate-800 dark:bg-[#131C31]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t.currentAffairs}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === "ne"
                ? "परीक्षामुखी समसामयिक बुलेटिन र संलग्न बहुवैकल्पिक प्रश्नहरू (MCQs)"
                : "Exam-oriented Nepal & International current affairs briefs paired with Loksewa MCQs"}
            </p>
          </div>

          <button
            type="button"
            onClick={openNewForm}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#C81E3D] px-3.5 text-xs font-semibold text-white hover:bg-[#a81732]"
          >
            <Plus className="h-4 w-4" />
            {t.addCurrentAffair}
          </button>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {CA_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[34px] rounded-lg px-3 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-[#0F294A] text-white dark:bg-sky-500 dark:text-slate-950"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add/Edit Current Affairs Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60"
          >
            <div className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
              {editingItem ? "Edit Current Affairs Brief" : t.addCurrentAffair}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Headline (English) *
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Monetary Policy 2081/82 Key Highlights"
                  className="min-h-[38px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Category & BS Date
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="min-h-[38px] flex-1 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="National">National</option>
                    <option value="Economy & Budget">Economy & Budget</option>
                    <option value="Province & Local">Province & Local</option>
                    <option value="International">International</option>
                  </select>
                  <input
                    type="text"
                    value={publishedDateBs}
                    onChange={(e) => setPublishedDateBs(e.target.value)}
                    className="min-h-[38px] w-28 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Summary (English) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={summaryEn}
                  onChange={(e) => setSummaryEn(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Exam Bullet Points (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={keyPointsText}
                  onChange={(e) => setKeyPointsText(e.target.value)}
                  placeholder="Point 1&#10;Point 2"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>

            {!editingItem && (
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[#0F294A] dark:text-sky-300">
                  <input
                    type="checkbox"
                    checked={includeMcq}
                    onChange={(e) => setIncludeMcq(e.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                  Attach Exam-Oriented Practice MCQ to this Current Affairs Brief
                </label>

                {includeMcq && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      value={mcqQuestionEn}
                      onChange={(e) => setMcqQuestionEn(e.target.value)}
                      placeholder="Exam MCQ Stem (e.g. What is the inflation target in Monetary Policy 2081/82?)"
                      className="min-h-[36px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                      <input
                        type="text"
                        value={mcqOptionA}
                        onChange={(e) => setMcqOptionA(e.target.value)}
                        placeholder="Option A"
                        className="min-h-[34px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                      />
                      <input
                        type="text"
                        value={mcqOptionB}
                        onChange={(e) => setMcqOptionB(e.target.value)}
                        placeholder="Option B"
                        className="min-h-[34px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                      />
                      <input
                        type="text"
                        value={mcqOptionC}
                        onChange={(e) => setMcqOptionC(e.target.value)}
                        placeholder="Option C"
                        className="min-h-[34px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                      />
                      <input
                        type="text"
                        value={mcqOptionD}
                        onChange={(e) => setMcqOptionD(e.target.value)}
                        placeholder="Option D"
                        className="min-h-[34px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                      />
                      <select
                        value={mcqCorrect}
                        onChange={(e) =>
                          setMcqCorrect(
                            e.target.value as "A" | "B" | "C" | "D"
                          )
                        }
                        className="min-h-[34px] rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-900"
                      >
                        <option value="A">Ans: A</option>
                        <option value="B">Ans: B</option>
                        <option value="C">Ans: C</option>
                        <option value="D">Ans: D</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="min-h-[36px] rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="min-h-[36px] rounded-lg bg-[#0F294A] px-4 text-xs font-semibold text-white dark:bg-sky-500 dark:text-slate-950"
              >
                {saving ? "..." : "Save Current Affair"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Current Affairs Feed */}
      <div className="space-y-5">
        {filtered.map((ca) => (
          <article
            key={ca.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]"
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                  <Newspaper className="h-3.5 w-3.5" />
                  {ca.category}
                </span>
                <span className="font-mono-num inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {ca.publishedDateBs} ({ca.publishedDateAd})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditForm(ca)}
                  className="inline-flex min-h-[32px] items-center rounded-lg border border-slate-200 px-2.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(ca.id)}
                  className="inline-flex min-h-[32px] items-center rounded-lg border border-rose-200 px-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100">
              {lang === "ne" ? ca.titleNe : ca.titleEn}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {lang === "ne" ? ca.summaryNe : ca.summaryEn}
            </p>

            {/* Exam Key Points */}
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="mb-2 text-[11px] font-bold tracking-wider text-[#0F294A] uppercase dark:text-sky-400">
                {lang === "ne"
                  ? "परीक्षाका लागि मुख्य बुँदाहरू (Key Exam Facts)"
                  : "High-Yield Exam Takeaways"}
              </div>
              <ul className="space-y-1.5">
                {(lang === "ne" ? ca.keyPointsNe : ca.keyPointsEn).map(
                  (pt, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{pt}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Linked Exam-Oriented MCQ */}
            {ca.linkedQuestion && (
              <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="mb-2 text-xs font-bold text-[#C81E3D] dark:text-rose-400">
                  {lang === "ne"
                    ? "सम्बन्धित परीक्षामुखी प्रश्न अभ्यास गर्नुहोस्:"
                    : "Exam-Oriented Practice Question:"}
                </div>
                <QuestionCard
                  question={ca.linkedQuestion}
                  lang={lang}
                  mode="practice"
                  onAttemptSuccess={onDataChanged}
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
