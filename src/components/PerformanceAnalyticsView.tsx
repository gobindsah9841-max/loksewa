"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  Eye,
  Trash2,
  Play,
  BarChart3,
  History,
} from "lucide-react";
import type {
  DashboardPayload,
  ExamHistoryItem,
} from "@/lib/dashboard-service";
import { UI_TEXT, type Lang } from "@/lib/i18n";

interface PerformanceAnalyticsViewProps {
  data: DashboardPayload;
  lang: Lang;
  focusTab?: "performance" | "history";
  onPracticeSubject: (subjectId: number) => void;
  onReviewExam: (exam: ExamHistoryItem) => void;
  onDeleteExam: (examId: number) => void;
}

export function PerformanceAnalyticsView({
  data,
  lang,
  focusTab = "performance",
  onPracticeSubject,
  onReviewExam,
  onDeleteExam,
}: PerformanceAnalyticsViewProps) {
  const t = UI_TEXT[lang];
  const { stats, examHistory } = data;

  function formatDuration(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  }

  return (
    <div className="space-y-5">
      {/* Performance Section */}
      {focusTab === "performance" && (
        <>
          {/* Strongest vs Weakest Subject Callouts */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Strongest Subjects */}
            <div className="rounded-xl border border-emerald-200 bg-white p-5 shadow-xs dark:border-emerald-900/60 dark:bg-[#131C31]">
              <div className="mb-3 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <TrendingUp className="h-5 w-5" />
                <h3 className="text-base font-bold">{t.strongestSubjects}</h3>
              </div>

              {stats.strongestSubjects.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "ne"
                    ? "सबैभन्दा सबल विषय पहिचान गर्न केही प्रश्नहरू अभ्यास गर्नुहोस्।"
                    : "Solve practice MCQs across subjects to identify your strongest areas."}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {stats.strongestSubjects.map((s) => (
                    <div
                      key={s.subjectId}
                      className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 px-3.5 py-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {lang === "ne" ? s.nameNe : s.nameEn}
                        </div>
                        <div className="font-mono-num text-[11px] text-slate-500 dark:text-slate-400">
                          {s.correct}/{s.attempted}{" "}
                          {lang === "ne" ? "सही उत्तर" : "correct"}
                        </div>
                      </div>
                      <span className="font-mono-num rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                        {s.accuracyPct}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weakest Subjects */}
            <div className="rounded-xl border border-rose-200 bg-white p-5 shadow-xs dark:border-rose-900/60 dark:bg-[#131C31]">
              <div className="mb-3 flex items-center gap-2 text-rose-700 dark:text-rose-400">
                <TrendingDown className="h-5 w-5" />
                <h3 className="text-base font-bold">{t.weakestSubjects}</h3>
              </div>

              {stats.weakestSubjects.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "ne"
                    ? "कमजोर विषय पत्ता लगाउन कम्तीमा एक विषयमा अभ्यास गर्नुहोस्।"
                    : "Attempt questions in multiple subjects to highlight areas needing improvement."}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {stats.weakestSubjects.map((s) => (
                    <div
                      key={s.subjectId}
                      className="flex items-center justify-between gap-2 rounded-xl border border-rose-100 bg-rose-50/50 px-3.5 py-2.5 dark:border-rose-900/40 dark:bg-rose-950/20"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {lang === "ne" ? s.nameNe : s.nameEn}
                        </div>
                        <div className="font-mono-num text-[11px] text-slate-500 dark:text-slate-400">
                          {s.correct}/{s.attempted} · {s.accuracyPct}%{" "}
                          {lang === "ne" ? "शुद्धता" : "accuracy"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onPracticeSubject(s.subjectId)}
                        className="inline-flex min-h-[34px] items-center gap-1 rounded-lg bg-[#C81E3D] px-3 text-xs font-semibold text-white hover:bg-[#a81732]"
                      >
                        <Play className="h-3 w-3" />
                        {lang === "ne" ? "अभ्यास" : "Improve"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subject-by-Subject Accuracy & Syllabus Progress */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#0F294A] dark:text-sky-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {lang === "ne"
                  ? "विषयगत कार्यसम्पादन र पाठ्यक्रम प्रगति"
                  : "Subject-Wise Accuracy & Syllabus Coverage"}
              </h3>
            </div>

            <div className="space-y-4">
              {stats.subjectPerformance.map((sp) => (
                <div
                  key={sp.subjectId}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {lang === "ne" ? sp.nameNe : sp.nameEn}
                      </span>
                      <span className="font-mono-num ml-2 text-xs text-slate-500 dark:text-slate-400">
                        ({sp.topicsStudied}/{sp.topicsCount}{" "}
                        {lang === "ne" ? "शीर्षक" : "topics"})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono-num text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {sp.correct}/{sp.attempted} Qs ({sp.accuracyPct}%)
                      </span>
                      <button
                        type="button"
                        onClick={() => onPracticeSubject(sp.subjectId)}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#0F294A] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300"
                      >
                        {lang === "ne" ? "अभ्यास" : "Practice"}
                      </button>
                    </div>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${sp.accuracyPct}%`,
                        backgroundColor: sp.accentColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
            <h3 className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100">
              {lang === "ne"
                ? "कठिनाइ स्तर अनुसार शुद्धता (Difficulty Breakdown)"
                : "Accuracy by Question Difficulty"}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.difficultyBreakdown.map((d) => (
                <div
                  key={d.difficulty}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="text-xs font-bold text-slate-500 uppercase dark:text-slate-400">
                    {d.difficulty === "easy"
                      ? t.easy
                      : d.difficulty === "hard"
                        ? t.hard
                        : t.medium}
                  </div>
                  <div className="font-mono-num mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {d.accuracyPct}%
                  </div>
                  <div className="font-mono-num text-xs text-slate-500 dark:text-slate-400">
                    {d.correct} / {d.attempted} correct
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Study History Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-[#C81E3D]" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.studyHistory}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "ne"
                  ? "सम्पन्न नमुना परीक्षा र दैनिक चुनौतीहरूको अभिलेख"
                  : "Chronological log of completed Mock Examinations and Daily GK Challenges"}
              </p>
            </div>
          </div>
          <span className="font-mono-num rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {examHistory.length} {lang === "ne" ? "परीक्षा" : "Sessions"}
          </span>
        </div>

        {examHistory.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {lang === "ne"
              ? "अहिलेसम्म कुनै नमुना परीक्षा सम्पन्न भएको छैन। माथिबाट नमुना परीक्षा सुरु गर्नुहोस्!"
              : "No examinations completed yet. Launch a Full Mock Examination or Daily GK Challenge to build your study history."}
          </div>
        ) : (
          <div className="space-y-3">
            {examHistory.map((ex) => (
              <div
                key={ex.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#0F294A] px-2 py-0.5 text-[11px] font-bold text-white dark:bg-sky-500 dark:text-slate-950">
                      <Award className="h-3 w-3" />
                      {ex.commission}
                    </span>
                    <span className="font-mono-num text-xs text-slate-500 dark:text-slate-400">
                      {new Date(ex.startedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {lang === "ne" ? ex.titleNe : ex.titleEn}
                  </div>
                  <div className="font-mono-num flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <span>
                      Score: <strong>{ex.netScore}</strong>/{ex.totalQuestions}
                    </span>
                    <span>
                      Accuracy: <strong>{ex.accuracyPct}%</strong>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDuration(ex.timeTakenSeconds)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onReviewExam(ex)}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#0F294A] px-3.5 text-xs font-semibold text-white hover:bg-[#1a3d6b] dark:bg-sky-500 dark:text-slate-950"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {lang === "ne" ? "उत्तर हेर्नुहोस्" : "Review Answers"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteExam(ex.id)}
                    title="Delete exam record"
                    className="inline-flex min-h-[38px] items-center rounded-lg border border-rose-200 px-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
