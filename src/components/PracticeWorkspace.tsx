"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  ListChecks,
  RotateCcw,
  Plus,
  Filter,
} from "lucide-react";
import type {
  EnrichedQuestion,
  SyllabusSubjectGroup,
} from "@/lib/dashboard-service";
import { COMMISSIONS, UI_TEXT, type Lang } from "@/lib/i18n";
import { QuestionCard } from "./QuestionCard";

interface PracticeWorkspaceProps {
  questions: EnrichedQuestion[];
  syllabus: SyllabusSubjectGroup[];
  lang: Lang;
  initialSubjectId?: number | "all";
  initialTopicId?: number | "all";
  mode?: string;
  titleOverride?: string;
  showPreviousMistake?: boolean;
  onAttemptSuccess: () => void;
  onOpenAddQuestion: (defaultTopicId?: number) => void;
}

export function PracticeWorkspace({
  questions,
  syllabus,
  lang,
  initialSubjectId = "all",
  initialTopicId = "all",
  mode = "practice",
  titleOverride,
  showPreviousMistake = false,
  onAttemptSuccess,
  onOpenAddQuestion,
}: PracticeWorkspaceProps) {
  const t = UI_TEXT[lang];
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | "all">(
    initialSubjectId
  );
  const [selectedTopicId, setSelectedTopicId] = useState<number | "all">(
    initialTopicId
  );
  const [selectedCommission, setSelectedCommission] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"focused" | "stream">("focused");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Build available topics based on selectedSubjectId
  const availableTopics = useMemo(() => {
    const list: Array<{ id: number; nameEn: string; nameNe: string }> = [];
    for (const subj of syllabus) {
      if (selectedSubjectId !== "all" && subj.id !== selectedSubjectId) {
        continue;
      }
      for (const sc of subj.subCategories) {
        for (const top of sc.topics) {
          list.push({
            id: top.id,
            nameEn: top.nameEn,
            nameNe: top.nameNe,
          });
        }
      }
    }
    return list;
  }, [syllabus, selectedSubjectId]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedSubjectId !== "all" && q.subjectId !== selectedSubjectId) {
        return false;
      }
      if (selectedTopicId !== "all" && q.topicId !== selectedTopicId) {
        return false;
      }
      if (
        selectedCommission !== "all" &&
        !q.commission
          .toLowerCase()
          .includes(selectedCommission.replace(" PPSC", "").toLowerCase())
      ) {
        return false;
      }
      if (
        selectedDifficulty !== "all" &&
        q.difficulty !== selectedDifficulty
      ) {
        return false;
      }
      return true;
    });
  }, [
    questions,
    selectedSubjectId,
    selectedTopicId,
    selectedCommission,
    selectedDifficulty,
  ]);

  const safeIndex =
    filteredQuestions.length > 0
      ? Math.min(currentIndex, filteredQuestions.length - 1)
      : 0;
  const activeQuestion = filteredQuestions[safeIndex] ?? null;

  function handleResetFilters() {
    setSelectedSubjectId("all");
    setSelectedTopicId("all");
    setSelectedCommission("all");
    setSelectedDifficulty("all");
    setCurrentIndex(0);
  }

  return (
    <div className="space-y-4">
      {/* Header & Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {titleOverride || t.startPractice}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === "ne"
                ? `कुल ${filteredQuestions.length} प्रश्नहरू अभ्यासका लागि उपलब्ध छन्`
                : `${filteredQuestions.length} bilingual Loksewa MCQs available in current filter`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode("focused")}
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors ${
                  viewMode === "focused"
                    ? "bg-[#0F294A] text-white dark:bg-sky-500 dark:text-slate-950"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                {lang === "ne" ? "एक-एक प्रश्न" : "Card Mode"}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("stream")}
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors ${
                  viewMode === "stream"
                    ? "bg-[#0F294A] text-white dark:bg-sky-500 dark:text-slate-950"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <ListChecks className="h-3.5 w-3.5" />
                {lang === "ne" ? "निरन्तर सूची" : "Continuous List"}
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                onOpenAddQuestion(
                  selectedTopicId !== "all" ? selectedTopicId : undefined
                )
              }
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#C81E3D] px-3 text-xs font-semibold text-white hover:bg-[#a81732]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.addQuestion}</span>
            </button>
          </div>
        </div>

        {/* 4 Filter Controls */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              {lang === "ne" ? "विषय छान्नुहोस्" : "Subject"}
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                const val =
                  e.target.value === "all" ? "all" : Number(e.target.value);
                setSelectedSubjectId(val);
                setSelectedTopicId("all");
                setCurrentIndex(0);
              }}
              className="min-h-[42px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 focus:border-[#0F294A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">{t.allSubjects}</option>
              {syllabus.map((s) => (
                <option key={s.id} value={s.id}>
                  {lang === "ne" ? s.nameNe : s.nameEn} ({s.totalQuestions})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              {lang === "ne" ? "शीर्षक (Topic)" : "Topic"}
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                );
                setCurrentIndex(0);
              }}
              className="min-h-[42px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 focus:border-[#0F294A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">
                {lang === "ne"
                  ? `सबै शीर्षकहरू (${availableTopics.length})`
                  : `All Topics (${availableTopics.length})`}
              </option>
              {availableTopics.map((top) => (
                <option key={top.id} value={top.id}>
                  {lang === "ne" ? top.nameNe : top.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              {lang === "ne" ? "लोक सेवा आयोग" : "Commission"}
            </label>
            <select
              value={selectedCommission}
              onChange={(e) => {
                setSelectedCommission(e.target.value);
                setCurrentIndex(0);
              }}
              className="min-h-[42px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 focus:border-[#0F294A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">{t.allCommissions}</option>
              {COMMISSIONS.map((c) => (
                <option key={c.id} value={c.shortEn}>
                  {lang === "ne" ? c.ne : c.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              {lang === "ne" ? "कठिनाइ स्तर" : "Difficulty"}
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentIndex(0);
              }}
              className="min-h-[42px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 focus:border-[#0F294A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">{t.allDifficulties}</option>
              <option value="easy">{t.easy}</option>
              <option value="medium">{t.medium}</option>
              <option value="hard">{t.hard}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State or Questions */}
      {filteredQuestions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#131C31]">
          <Filter className="mx-auto mb-3 h-10 w-10 text-slate-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {lang === "ne"
              ? "यो छनौटमा प्रश्नहरू फेला परेनन्"
              : "No questions match the selected filters"}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
            {lang === "ne"
              ? "सबै प्रश्नहरू हेर्न फिल्टर रिसेट गर्नुहोस् वा यस शीर्षकमा नयाँ प्रश्न थप्नुहोस्।"
              : "Reset your active filters to explore all 81 Loksewa syllabus topics or add a custom practice MCQ to this topic."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {lang === "ne" ? "फिल्टर रिसेट गर्नुहोस्" : "Reset Filters"}
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenAddQuestion(
                  selectedTopicId !== "all" ? selectedTopicId : undefined
                )
              }
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#0F294A] px-4 text-xs font-semibold text-white hover:bg-[#1a3d6b] dark:bg-sky-500 dark:text-slate-950"
            >
              <Plus className="h-3.5 w-3.5" />
              {t.addQuestion}
            </button>
          </div>
        </div>
      ) : viewMode === "focused" && activeQuestion ? (
        <div className="space-y-3">
          {/* Progress Bar & Navigator */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-[#131C31]">
            <div className="flex items-center gap-3">
              <span className="font-mono-num text-xs font-bold text-[#0F294A] dark:text-sky-400">
                {safeIndex + 1} / {filteredQuestions.length}
              </span>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200 sm:w-48 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-[#0F294A] transition-all dark:bg-sky-400"
                  style={{
                    width: `${Math.round(
                      ((safeIndex + 1) / filteredQuestions.length) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safeIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
                {t.previous}
              </button>
              <button
                type="button"
                disabled={safeIndex >= filteredQuestions.length - 1}
                onClick={() =>
                  setCurrentIndex((i) =>
                    Math.min(filteredQuestions.length - 1, i + 1)
                  )
                }
                className="inline-flex min-h-[38px] items-center gap-1 rounded-lg bg-[#0F294A] px-3.5 text-xs font-semibold text-white hover:bg-[#1a3d6b] disabled:opacity-40 dark:bg-sky-500 dark:text-slate-950"
              >
                {t.next}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <QuestionCard
            key={activeQuestion.id}
            question={activeQuestion}
            lang={lang}
            indexNumber={safeIndex + 1}
            mode={mode}
            showPreviousMistake={showPreviousMistake}
            onAttemptSuccess={onAttemptSuccess}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              lang={lang}
              indexNumber={idx + 1}
              mode={mode}
              showPreviousMistake={showPreviousMistake}
              onAttemptSuccess={onAttemptSuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
}
