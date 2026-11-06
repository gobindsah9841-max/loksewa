"use client";

import React, { useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  XCircle,
  Star,
  BookOpen,
  Edit3,
  Trash2,
  Languages,
  StickyNote,
  RotateCcw,
} from "lucide-react";
import type { EnrichedQuestion } from "@/lib/dashboard-service";
import { UI_TEXT, type Lang } from "@/lib/i18n";

interface QuestionCardProps {
  question: EnrichedQuestion;
  lang: Lang;
  indexNumber?: number;
  mode?: string;
  showPreviousMistake?: boolean;
  showCrudActions?: boolean;
  onAttemptSuccess?: () => void;
  onBookmarkToggled?: (
    questionId: number,
    bookmarked: boolean,
    bookmarkId: number | null,
    note: string
  ) => void;
  onEditQuestion?: (question: EnrichedQuestion) => void;
  onDeleteQuestion?: (questionId: number) => void;
  onToggleImportant?: (questionId: number, nextImportant: boolean) => void;
}

export function QuestionCard({
  question,
  lang,
  indexNumber,
  mode = "practice",
  showPreviousMistake = false,
  showCrudActions = false,
  onAttemptSuccess,
  onBookmarkToggled,
  onEditQuestion,
  onDeleteQuestion,
  onToggleImportant,
}: QuestionCardProps) {
  const t = UI_TEXT[lang];
  const [selectedOption, setSelectedOption] = useState<string | null>(
    showPreviousMistake ? question.lastSelectedOption : null
  );
  const [result, setResult] = useState<{
    isCorrect: boolean;
    correctOption: string;
    explanationEn: string;
    explanationNe: string;
  } | null>(
    showPreviousMistake && question.lastSelectedOption
      ? {
          isCorrect: Boolean(question.lastIsCorrect),
          correctOption: question.correctOption,
          explanationEn: question.explanationEn,
          explanationNe: question.explanationNe,
        }
      : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [showBothLanguages, setShowBothLanguages] = useState(false);

  // Bookmark & Personal Note state
  const [isBookmarked, setIsBookmarked] = useState(question.isBookmarked);
  const [bookmarkId, setBookmarkId] = useState<number | null>(
    question.bookmarkId
  );
  const [noteOpen, setNoteOpen] = useState(Boolean(question.personalNote));
  const [noteText, setNoteText] = useState(question.personalNote || "");
  const [savingNote, setSavingNote] = useState(false);
  const [noteSavedToast, setNoteSavedToast] = useState(false);

  const options = [
    {
      key: "A" as const,
      en: question.optionAEn,
      ne: question.optionANe,
    },
    {
      key: "B" as const,
      en: question.optionBEn,
      ne: question.optionBNe,
    },
    {
      key: "C" as const,
      en: question.optionCEn,
      ne: question.optionCNe,
    },
    {
      key: "D" as const,
      en: question.optionDEn,
      ne: question.optionDNe,
    },
  ];

  async function handleSelectOption(optKey: "A" | "B" | "C" | "D") {
    if (submitting || result) return;
    setSelectedOption(optKey);
    setSubmitting(true);

    // Optimistic verification
    const optimisticCorrect = question.correctOption === optKey;
    setResult({
      isCorrect: optimisticCorrect,
      correctOption: question.correctOption,
      explanationEn: question.explanationEn,
      explanationNe: question.explanationNe,
    });

    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          selectedOption: optKey,
          mode,
          timeSpentSec: 18,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult({
          isCorrect: data.isCorrect,
          correctOption: data.correctOption,
          explanationEn: data.explanationEn,
          explanationNe: data.explanationNe,
        });
        onAttemptSuccess?.();
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleResetAttempt() {
    setSelectedOption(null);
    setResult(null);
  }

  async function handleToggleBookmark() {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    if (nextState) setNoteOpen(true);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          toggle: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.bookmarked);
        setBookmarkId(data.bookmark?.id ?? null);
        onBookmarkToggled?.(
          question.id,
          data.bookmarked,
          data.bookmark?.id ?? null,
          noteText
        );
      }
    } catch {
      setIsBookmarked(!nextState);
    }
  }

  async function handleSaveNote(e: React.FormEvent) {
    e.preventDefault();
    setSavingNote(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          personalNote: noteText,
          toggle: false,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(true);
        setBookmarkId(data.bookmark?.id ?? bookmarkId);
        setNoteSavedToast(true);
        setTimeout(() => setNoteSavedToast(false), 2000);
        onBookmarkToggled?.(
          question.id,
          true,
          data.bookmark?.id ?? bookmarkId,
          noteText
        );
      }
    } finally {
      setSavingNote(false);
    }
  }

  const diffBadgeColor =
    question.difficulty === "easy"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
      : question.difficulty === "hard"
        ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
        : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors sm:p-6 dark:border-slate-800 dark:bg-[#131C31]">
      {/* Top Meta Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {typeof indexNumber === "number" && (
            <span className="font-mono-num inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[#0F294A] px-2 font-semibold text-white dark:bg-sky-500 dark:text-slate-950">
              Q{indexNumber}
            </span>
          )}
          <span className="rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-[#0F294A] dark:bg-slate-800 dark:text-sky-300">
            {lang === "ne" ? question.subjectNameNe : question.subjectNameEn}
          </span>
          <span className="rounded-md bg-slate-50 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
            {lang === "ne" ? question.topicNameNe : question.topicNameEn}
          </span>
          <span className="rounded-md border border-slate-200 px-2 py-0.5 font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {question.commission}
          </span>
          <span
            className={`rounded-md border px-2 py-0.5 font-medium capitalize ${diffBadgeColor}`}
          >
            {question.difficulty === "easy"
              ? t.easy
              : question.difficulty === "hard"
                ? t.hard
                : t.medium}
          </span>
          {question.isPreviousYear && (
            <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">
              {t.previousYearBadge}
              {question.previousYearInfo ? ` · ${question.previousYearInfo}` : ""}
            </span>
          )}
          {question.isImportant && (
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 font-semibold text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {t.importantBadge}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowBothLanguages((v) => !v)}
            title="Toggle Bilingual View (NE + EN)"
            className={`inline-flex min-h-[36px] items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors ${
              showBothLanguages
                ? "border-[#0F294A] bg-[#0F294A]/10 text-[#0F294A] dark:border-sky-400 dark:bg-sky-500/10 dark:text-sky-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Languages className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">NE/EN</span>
          </button>

          {onToggleImportant && (
            <button
              type="button"
              onClick={() =>
                onToggleImportant(question.id, !question.isImportant)
              }
              title={t.markImportant}
              className={`inline-flex min-h-[36px] items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors ${
                question.isImportant
                  ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Star
                className={`h-3.5 w-3.5 ${
                  question.isImportant ? "fill-amber-500 text-amber-500" : ""
                }`}
              />
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`inline-flex min-h-[36px] items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors ${
              isBookmarked
                ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Bookmark
              className={`h-3.5 w-3.5 ${
                isBookmarked ? "fill-amber-500 text-amber-500" : ""
              }`}
            />
            <span className="hidden sm:inline">
              {isBookmarked ? t.bookmarked : t.bookmark}
            </span>
          </button>

          {showCrudActions && onEditQuestion && (
            <button
              type="button"
              onClick={() => onEditQuestion(question)}
              title={t.editQuestion}
              className="inline-flex min-h-[36px] items-center rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          )}

          {showCrudActions && onDeleteQuestion && (
            <button
              type="button"
              onClick={() => onDeleteQuestion(question.id)}
              title={t.deleteQuestion}
              className="inline-flex min-h-[36px] items-center rounded-lg border border-rose-200 px-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Question Stem */}
      <div className="mb-4 space-y-1.5">
        <p className="text-base leading-relaxed font-semibold text-slate-900 sm:text-[17px] dark:text-slate-100">
          {lang === "ne" ? question.questionNe : question.questionEn}
        </p>
        {showBothLanguages && (
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {lang === "ne" ? question.questionEn : question.questionNe}
          </p>
        )}
      </div>

      {/* 4 MCQ Options */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          const isCorrectChoice = result?.correctOption === opt.key;
          const isWrongSelection =
            result && isSelected && result.correctOption !== opt.key;

          let optionStyle =
            "border-slate-200 bg-slate-50/70 hover:border-[#0F294A] hover:bg-white text-slate-800 dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:bg-slate-800";

          if (result) {
            if (isCorrectChoice) {
              optionStyle =
                "border-emerald-500 bg-emerald-50/90 text-emerald-950 ring-1 ring-emerald-500 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-100";
            } else if (isWrongSelection) {
              optionStyle =
                "border-rose-500 bg-rose-50/90 text-rose-950 ring-1 ring-rose-500 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-100";
            } else {
              optionStyle =
                "border-slate-200/70 bg-slate-50/40 text-slate-500 opacity-75 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
            }
          } else if (isSelected) {
            optionStyle =
              "border-[#0F294A] bg-[#0F294A]/5 text-[#0F294A] ring-1 ring-[#0F294A] dark:border-sky-400 dark:bg-sky-500/10 dark:text-sky-200";
          }

          return (
            <button
              key={opt.key}
              type="button"
              disabled={Boolean(result) || submitting}
              onClick={() => handleSelectOption(opt.key)}
              className={`flex min-h-[50px] w-full items-start justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${optionStyle}`}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`font-mono-num mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                    result && isCorrectChoice
                      ? "bg-emerald-600 text-white"
                      : result && isWrongSelection
                        ? "bg-rose-600 text-white"
                        : "bg-white text-slate-700 shadow-2xs ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
                  }`}
                >
                  {opt.key}
                </span>
                <div>
                  <div className="text-sm leading-snug font-medium">
                    {lang === "ne" ? opt.ne : opt.en}
                  </div>
                  {showBothLanguages && (
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {lang === "ne" ? opt.en : opt.ne}
                    </div>
                  )}
                </div>
              </div>

              {result && isCorrectChoice && (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              {result && isWrongSelection && (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation & Feedback Box */}
      {result && (
        <div
          className={`mt-4 rounded-xl border p-4 ${
            result.isCorrect
              ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-800/70 dark:bg-emerald-950/25"
              : "border-rose-200 bg-rose-50/70 dark:border-rose-800/70 dark:bg-rose-950/25"
          }`}
        >
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold">
              {result.isCorrect ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  {lang === "ne"
                    ? `सही उत्तर! (${result.correctOption})`
                    : `Correct Answer! (${result.correctOption})`}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                  <XCircle className="h-4 w-4" />
                  {lang === "ne"
                    ? `गलत उत्तर — सही उत्तर विकल्प (${result.correctOption}) हो`
                    : `Incorrect — Correct Answer is Option (${result.correctOption})`}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetAttempt}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <RotateCcw className="h-3 w-3" />
              {lang === "ne" ? "पुनः प्रयास" : "Try Again"}
            </button>
          </div>

          <div className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            <BookOpen className="mt-1 h-4 w-4 shrink-0 text-[#0F294A] dark:text-sky-400" />
            <div className="space-y-1">
              <div className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                {t.explanation}
              </div>
              <p>{lang === "ne" ? result.explanationNe : result.explanationEn}</p>
              {showBothLanguages && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "ne" ? result.explanationEn : result.explanationNe}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Personal Revision Note Editor (visible if bookmarked or toggled) */}
      {(isBookmarked || noteOpen) && (
        <form
          onSubmit={handleSaveNote}
          className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50/40 p-3 dark:border-amber-800/50 dark:bg-amber-950/15"
        >
          <div className="mb-1.5 flex items-center justify-between">
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300">
              <StickyNote className="h-3.5 w-3.5" />
              {t.personalNote}
            </label>
            {noteSavedToast && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {lang === "ne" ? "नोट सुरक्षित भयो!" : "Saved!"}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={
                lang === "ne"
                  ? "सम्झनका लागि मुख्य बुँदा वा धारा लेख्नुहोस्..."
                  : "Write constitutional article, date, or mnemonic note..."
              }
              className="min-h-[38px] flex-1 rounded-lg border border-amber-200 bg-white px-3 text-xs text-slate-800 focus:border-[#0F294A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={savingNote}
              className="min-h-[38px] rounded-lg bg-[#0F294A] px-3.5 text-xs font-semibold text-white hover:bg-[#1a3d6b] disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950"
            >
              {savingNote ? "..." : t.saveNote}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
