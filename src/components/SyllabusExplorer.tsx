"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Play,
  Plus,
  BookOpen,
  CheckCircle2,
  Trash2,
  Globe,
  Scale,
  Building2,
  BrainCircuit,
  Newspaper,
} from "lucide-react";
import type { SyllabusSubjectGroup } from "@/lib/dashboard-service";
import { UI_TEXT, type Lang } from "@/lib/i18n";

interface SyllabusExplorerProps {
  syllabus: SyllabusSubjectGroup[];
  lang: Lang;
  onSelectTopicPractice: (subjectId: number, topicId: number) => void;
  onSyllabusChanged: () => void;
}

export function SyllabusExplorer({
  syllabus,
  lang,
  onSelectTopicPractice,
  onSyllabusChanged,
}: SyllabusExplorerProps) {
  const t = UI_TEXT[lang];
  const [search, setSearch] = useState("");
  const [activeSubjectCode, setActiveSubjectCode] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Custom Topic form state
  const [newSubjectId, setNewSubjectId] = useState<number>(
    syllabus[0]?.id ?? 1
  );
  const [newSubCategory, setNewSubCategory] = useState("");
  const [newNameEn, setNewNameEn] = useState("");
  const [newNameNe, setNewNameNe] = useState("");
  const [newWeightage, setNewWeightage] = useState(5);
  const [creating, setCreating] = useState(false);

  const totalTopicsCount = useMemo(
    () => syllabus.reduce((acc, s) => acc + s.topicsCount, 0),
    [syllabus]
  );

  const filteredSyllabus = useMemo(() => {
    const q = search.trim().toLowerCase();
    return syllabus
      .filter(
        (s) => activeSubjectCode === "ALL" || s.code === activeSubjectCode
      )
      .map((s) => ({
        ...s,
        subCategories: s.subCategories
          .map((sc) => ({
            ...sc,
            topics: sc.topics.filter(
              (top) =>
                !q ||
                top.nameEn.toLowerCase().includes(q) ||
                top.nameNe.toLowerCase().includes(q) ||
                sc.nameEn.toLowerCase().includes(q) ||
                sc.nameNe.toLowerCase().includes(q)
            ),
          }))
          .filter((sc) => sc.topics.length > 0),
      }))
      .filter((s) => s.subCategories.length > 0);
  }, [syllabus, activeSubjectCode, search]);

  function getSubjectIcon(iconName: string) {
    switch (iconName) {
      case "Globe":
        return <Globe className="h-5 w-5" />;
      case "Scale":
        return <Scale className="h-5 w-5" />;
      case "Building2":
        return <Building2 className="h-5 w-5" />;
      case "BrainCircuit":
        return <BrainCircuit className="h-5 w-5" />;
      default:
        return <Newspaper className="h-5 w-5" />;
    }
  }

  async function handleCreateTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!newNameEn.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: newSubjectId,
          subCategoryEn: newSubCategory.trim() || "Custom Study Module",
          subCategoryNe: newSubCategory.trim() || "अतिरिक्त अध्ययन खण्ड",
          nameEn: newNameEn.trim(),
          nameNe: newNameNe.trim() || newNameEn.trim(),
          weightageMarks: newWeightage,
        }),
      });
      if (res.ok) {
        setNewNameEn("");
        setNewNameNe("");
        setNewSubCategory("");
        setShowAddModal(false);
        onSyllabusChanged();
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteTopic(topicId: number) {
    const res = await fetch(`/api/topics/${topicId}`, { method: "DELETE" });
    if (res.ok) {
      onSyllabusChanged();
    }
  }

  return (
    <div className="space-y-5">
      {/* Header & Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5 dark:border-slate-800 dark:bg-[#131C31]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t.syllabusLibrary}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === "ne"
                ? `संघीय र सातै प्रदेश लोक सेवा आयोगका ५ मुख्य विषय र ${totalTopicsCount} पाठ्यक्रम शीर्षकहरू`
                : `Complete hierarchical syllabus across 5 subjects and ${totalTopicsCount} topics for Federal & Provincial PSC`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal((v) => !v)}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#0F294A] px-3.5 text-xs font-semibold text-white hover:bg-[#1a3d6b] dark:bg-sky-500 dark:text-slate-950"
          >
            <Plus className="h-4 w-4" />
            {t.addTopic}
          </button>
        </div>

        {/* Add Custom Topic Inline Form */}
        {showAddModal && (
          <form
            onSubmit={handleCreateTopic}
            className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60"
          >
            <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
              {t.addTopic}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === "ne" ? "विषय" : "Subject"}
                </label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(Number(e.target.value))}
                  className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {syllabus.map((s) => (
                    <option key={s.id} value={s.id}>
                      {lang === "ne" ? s.nameNe : s.nameEn}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === "ne" ? "उप-समूह" : "Sub-Category"}
                </label>
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  placeholder="e.g. Nepal / Provincial Admin"
                  className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === "ne" ? "शीर्षक (अंग्रेजी)" : "Topic Name (English) *"}
                </label>
                <input
                  type="text"
                  required
                  value={newNameEn}
                  onChange={(e) => setNewNameEn(e.target.value)}
                  placeholder="e.g. Provincial Fiscal Transfer"
                  className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {lang === "ne" ? "शीर्षक (नेपाली)" : "Topic Name (Nepali)"}
                </label>
                <input
                  type="text"
                  value={newNameNe}
                  onChange={(e) => setNewNameNe(e.target.value)}
                  placeholder="उदा. प्रादेशिक वित्तीय हस्तान्तरण"
                  className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="min-h-[36px] rounded-lg border border-slate-300 px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                {lang === "ne" ? "रद्द गर्नुहोस्" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={creating}
                className="min-h-[36px] rounded-lg bg-[#C81E3D] px-4 text-xs font-semibold text-white"
              >
                {creating
                  ? "..."
                  : lang === "ne"
                    ? "सुरक्षित गर्नुहोस्"
                    : "Save Topic"}
              </button>
            </div>
          </form>
        )}

        {/* Subject Filter Tabs + Search */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveSubjectCode("ALL")}
              className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold transition-colors ${
                activeSubjectCode === "ALL"
                  ? "bg-[#0F294A] text-white dark:bg-sky-500 dark:text-slate-950"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {t.allSubjects} ({totalTopicsCount})
            </button>
            {syllabus.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => setActiveSubjectCode(s.code)}
                className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold transition-colors ${
                  activeSubjectCode === s.code
                    ? "bg-[#0F294A] text-white dark:bg-sky-500 dark:text-slate-950"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {lang === "ne" ? s.nameNe : s.nameEn} ({s.topicsCount})
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="min-h-[38px] w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-9 text-xs text-slate-800 focus:border-[#0F294A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Hierarchical Subject -> SubCategory -> Topic Tree */}
      {filteredSyllabus.map((subj) => (
        <div
          key={subj.id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5 dark:border-slate-800 dark:bg-[#131C31]"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: subj.accentColor }}
              >
                {getSubjectIcon(subj.iconName)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {lang === "ne" ? subj.nameNe : subj.nameEn}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "ne" ? subj.descriptionNe : subj.descriptionEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono-num rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {subj.topicsCount}{" "}
                {lang === "ne" ? "शीर्षकहरू" : "Topics"}
              </span>
              <span className="font-mono-num rounded-md bg-[#0F294A]/10 px-2.5 py-1 font-semibold text-[#0F294A] dark:bg-sky-500/15 dark:text-sky-300">
                {subj.totalQuestions} MCQs
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {subj.subCategories.map((sc) => (
              <div key={sc.nameEn}>
                <div className="mb-2.5 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#C81E3D]" />
                  <h4 className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                    {lang === "ne" ? sc.nameNe : sc.nameEn} ({sc.topics.length})
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {sc.topics.map((top) => (
                    <div
                      key={top.id}
                      className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 transition-all hover:border-[#0F294A] hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-sky-500/60 dark:hover:bg-slate-900"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {lang === "ne" ? top.nameNe : top.nameEn}
                          </div>
                          {top.sortOrder === 99 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTopic(top.id)}
                              title="Delete custom topic"
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {lang === "ne" ? top.nameEn : top.nameNe}
                        </div>
                      </div>

                      <div className="mt-3 pt-2">
                        {/* Mastery bar */}
                        <div className="mb-2 flex items-center justify-between text-[11px]">
                          <span className="font-mono-num text-slate-500 dark:text-slate-400">
                            {top.questionCount} MCQs · {top.weightageMarks} Marks
                          </span>
                          <span className="font-mono-num inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                            {top.masteryPct > 0 && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            {top.masteryPct}%
                          </span>
                        </div>
                        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all dark:bg-emerald-400"
                            style={{ width: `${top.masteryPct}%` }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onSelectTopicPractice(subj.id, top.id)
                          }
                          className="inline-flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#0F294A] transition-colors group-hover:border-[#0F294A] group-hover:bg-[#0F294A] group-hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300 dark:group-hover:border-sky-500 dark:group-hover:bg-sky-500 dark:group-hover:text-slate-950"
                        >
                          <Play className="h-3.5 w-3.5" />
                          {lang === "ne" ? "अभ्यास गर्नुहोस्" : "Practice Topic"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
