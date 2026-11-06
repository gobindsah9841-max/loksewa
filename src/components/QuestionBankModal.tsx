"use client";

import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import type {
  EnrichedQuestion,
  SyllabusSubjectGroup,
} from "@/lib/dashboard-service";
import { COMMISSIONS, UI_TEXT, type Lang } from "@/lib/i18n";

interface QuestionBankModalProps {
  lang: Lang;
  syllabus: SyllabusSubjectGroup[];
  editingQuestion: EnrichedQuestion | null;
  defaultTopicId?: number;
  onClose: () => void;
  onSaved: () => void;
}

export function QuestionBankModal({
  lang,
  syllabus,
  editingQuestion,
  defaultTopicId,
  onClose,
  onSaved,
}: QuestionBankModalProps) {
  const t = UI_TEXT[lang];

  const allTopics = useMemo(() => {
    const list: Array<{
      id: number;
      subjectName: string;
      nameEn: string;
      nameNe: string;
    }> = [];
    for (const s of syllabus) {
      for (const sc of s.subCategories) {
        for (const top of sc.topics) {
          list.push({
            id: top.id,
            subjectName: lang === "ne" ? s.nameNe : s.nameEn,
            nameEn: top.nameEn,
            nameNe: top.nameNe,
          });
        }
      }
    }
    return list;
  }, [syllabus, lang]);

  const [topicId, setTopicId] = useState<number>(
    editingQuestion?.topicId ?? defaultTopicId ?? allTopics[0]?.id ?? 1
  );
  const [questionEn, setQuestionEn] = useState(
    editingQuestion?.questionEn ?? ""
  );
  const [questionNe, setQuestionNe] = useState(
    editingQuestion?.questionNe ?? ""
  );
  const [optionAEn, setOptionAEn] = useState(
    editingQuestion?.optionAEn ?? ""
  );
  const [optionANe, setOptionANe] = useState(
    editingQuestion?.optionANe ?? ""
  );
  const [optionBEn, setOptionBEn] = useState(
    editingQuestion?.optionBEn ?? ""
  );
  const [optionBNe, setOptionBNe] = useState(
    editingQuestion?.optionBNe ?? ""
  );
  const [optionCEn, setOptionCEn] = useState(
    editingQuestion?.optionCEn ?? ""
  );
  const [optionCNe, setOptionCNe] = useState(
    editingQuestion?.optionCNe ?? ""
  );
  const [optionDEn, setOptionDEn] = useState(
    editingQuestion?.optionDEn ?? ""
  );
  const [optionDNe, setOptionDNe] = useState(
    editingQuestion?.optionDNe ?? ""
  );
  const [correctOption, setCorrectOption] = useState<"A" | "B" | "C" | "D">(
    editingQuestion?.correctOption ?? "A"
  );
  const [explanationEn, setExplanationEn] = useState(
    editingQuestion?.explanationEn ?? ""
  );
  const [explanationNe, setExplanationNe] = useState(
    editingQuestion?.explanationNe ?? ""
  );
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    editingQuestion?.difficulty ?? "medium"
  );
  const [commission, setCommission] = useState(
    editingQuestion?.commission ?? "Federal"
  );
  const [isPreviousYear, setIsPreviousYear] = useState(
    editingQuestion?.isPreviousYear ?? false
  );
  const [previousYearInfo, setPreviousYearInfo] = useState(
    editingQuestion?.previousYearInfo ?? ""
  );
  const [isImportant, setIsImportant] = useState(
    editingQuestion?.isImportant ?? true
  );
  const [isDailyChallenge, setIsDailyChallenge] = useState(
    editingQuestion?.isDailyChallenge ?? false
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (
      !questionEn.trim() ||
      !optionAEn.trim() ||
      !optionBEn.trim() ||
      !optionCEn.trim() ||
      !optionDEn.trim()
    ) {
      setError("Question text and all 4 options (A–D) are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        topicId,
        questionEn: questionEn.trim(),
        questionNe: questionNe.trim() || questionEn.trim(),
        optionAEn: optionAEn.trim(),
        optionANe: optionANe.trim() || optionAEn.trim(),
        optionBEn: optionBEn.trim(),
        optionBNe: optionBNe.trim() || optionBEn.trim(),
        optionCEn: optionCEn.trim(),
        optionCNe: optionCNe.trim() || optionCEn.trim(),
        optionDEn: optionDEn.trim(),
        optionDNe: optionDNe.trim() || optionDEn.trim(),
        correctOption,
        explanationEn:
          explanationEn.trim() || "Verified Loksewa preparation answer.",
        explanationNe:
          explanationNe.trim() ||
          explanationEn.trim() ||
          "प्रमाणित लोकसेवा तयारी उत्तर।",
        difficulty,
        commission,
        isPreviousYear,
        previousYearInfo: isPreviousYear ? previousYearInfo.trim() : null,
        isImportant,
        isDailyChallenge,
      };

      const url = editingQuestion
        ? `/api/questions/${editingQuestion.id}`
        : "/api/questions";
      const method = editingQuestion ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save question");
        return;
      }

      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-[#131C31]">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {editingQuestion ? t.editQuestion : t.addQuestion}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ne" ? "शीर्षक (Topic)" : "Syllabus Topic *"}
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(Number(e.target.value))}
                className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {allTopics.map((top) => (
                  <option key={top.id} value={top.id}>
                    [{top.subjectName}]{" "}
                    {lang === "ne" ? top.nameNe : top.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ne" ? "कठिनाइ स्तर" : "Difficulty"}
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as "easy" | "medium" | "hard")
                }
                className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="easy">{t.easy}</option>
                <option value="medium">{t.medium}</option>
                <option value="hard">{t.hard}</option>
              </select>
            </div>
          </div>

          {/* Question Text EN & NE */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Question (English) *
              </label>
              <textarea
                rows={2}
                required
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                placeholder="Enter MCQ stem in English..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                प्रश्न (नेपाली - Optional)
              </label>
              <textarea
                rows={2}
                value={questionNe}
                onChange={(e) => setQuestionNe(e.target.value)}
                placeholder="नेपालीमा प्रश्न लेख्नुहोस्..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* 4 Options */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Option A (EN) *
              </label>
              <input
                type="text"
                required
                value={optionAEn}
                onChange={(e) => setOptionAEn(e.target.value)}
                className="min-h-[38px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <input
                type="text"
                value={optionANe}
                onChange={(e) => setOptionANe(e.target.value)}
                placeholder="विकल्प क (नेपाली)"
                className="mt-1 min-h-[34px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Option B (EN) *
              </label>
              <input
                type="text"
                required
                value={optionBEn}
                onChange={(e) => setOptionBEn(e.target.value)}
                className="min-h-[38px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <input
                type="text"
                value={optionBNe}
                onChange={(e) => setOptionBNe(e.target.value)}
                placeholder="विकल्प ख (नेपाली)"
                className="mt-1 min-h-[34px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Option C (EN) *
              </label>
              <input
                type="text"
                required
                value={optionCEn}
                onChange={(e) => setOptionCEn(e.target.value)}
                className="min-h-[38px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <input
                type="text"
                value={optionCNe}
                onChange={(e) => setOptionCNe(e.target.value)}
                placeholder="विकल्प ग (नेपाली)"
                className="mt-1 min-h-[34px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Option D (EN) *
              </label>
              <input
                type="text"
                required
                value={optionDEn}
                onChange={(e) => setOptionDEn(e.target.value)}
                className="min-h-[38px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <input
                type="text"
                value={optionDNe}
                onChange={(e) => setOptionDNe(e.target.value)}
                placeholder="विकल्प घ (नेपाली)"
                className="mt-1 min-h-[34px] w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Correct Option & Commission */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ne" ? "सही उत्तर विकल्प" : "Correct Option *"}
              </label>
              <select
                value={correctOption}
                onChange={(e) =>
                  setCorrectOption(
                    e.target.value as "A" | "B" | "C" | "D"
                  )
                }
                className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-400"
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {lang === "ne" ? "आयोग" : "Commission"}
              </label>
              <select
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {COMMISSIONS.map((c) => (
                  <option key={c.id} value={c.shortEn}>
                    {lang === "ne" ? c.ne : c.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Explanation EN & NE */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Explanation (English)
              </label>
              <textarea
                rows={2}
                value={explanationEn}
                onChange={(e) => setExplanationEn(e.target.value)}
                placeholder="Constitutional article, historical fact, or formula..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                व्याख्या (नेपाली)
              </label>
              <textarea
                rows={2}
                value={explanationNe}
                onChange={(e) => setExplanationNe(e.target.value)}
                placeholder="उत्तरको विस्तृत व्याख्या नेपालीमा..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Tags & Flags */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/50">
            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              {t.importantBadge}
            </label>

            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isDailyChallenge}
                onChange={(e) => setIsDailyChallenge(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              {t.dailyGkChallenge}
            </label>

            <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isPreviousYear}
                onChange={(e) => setIsPreviousYear(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              {t.previousYearBadge}
            </label>

            {isPreviousYear && (
              <input
                type="text"
                value={previousYearInfo}
                onChange={(e) => setPreviousYearInfo(e.target.value)}
                placeholder="e.g. Loksewa Nayab Subba 2080 BS"
                className="min-h-[34px] flex-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] rounded-lg border border-slate-300 px-4 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              {lang === "ne" ? "रद्द गर्नुहोस्" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="min-h-[40px] rounded-lg bg-[#0F294A] px-5 text-xs font-semibold text-white hover:bg-[#1a3d6b] disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950"
            >
              {saving
                ? "..."
                : editingQuestion
                  ? lang === "ne"
                    ? "अपडेट गर्नुहोस्"
                    : "Update Question"
                  : lang === "ne"
                    ? "प्रश्न थप्नुहोस्"
                    : "Save Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
