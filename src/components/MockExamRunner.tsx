"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  Send,
  ChevronLeft,
  ChevronRight,
  Award,
  Play,
  BookOpen,
  Grid,
} from "lucide-react";
import type {
  EnrichedQuestion,
  ExamHistoryItem,
  SyllabusSubjectGroup,
} from "@/lib/dashboard-service";
import { COMMISSIONS, UI_TEXT, type Lang } from "@/lib/i18n";

interface MockExamRunnerProps {
  lang: Lang;
  syllabus: SyllabusSubjectGroup[];
  allQuestions: EnrichedQuestion[];
  defaultCommission: string;
  initialReviewExam?: ExamHistoryItem | null;
  isDailyChallengeMode?: boolean;
  onExamCompleted: () => void;
}

interface ActiveExamState {
  examId: number;
  titleEn: string;
  titleNe: string;
  commission: string;
  negativeMarking: boolean;
  durationMinutes: number;
  questions: EnrichedQuestion[];
  answers: Record<string, "A" | "B" | "C" | "D">;
  flagged: Record<number, boolean>;
  currentIndex: number;
  secondsLeft: number;
  startedAtMs: number;
}

export function MockExamRunner({
  lang,
  syllabus,
  allQuestions,
  defaultCommission,
  initialReviewExam = null,
  isDailyChallengeMode = false,
  onExamCompleted,
}: MockExamRunnerProps) {
  const t = UI_TEXT[lang];

  // Exam configurator state
  const [commission, setCommission] = useState(
    defaultCommission || "Federal (Loksewa Aayog)"
  );
  const [subjectId, setSubjectId] = useState<string>("all");
  const [questionCount, setQuestionCount] = useState<number>(
    isDailyChallengeMode ? 10 : 20
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(
    isDailyChallengeMode ? 10 : 20
  );
  const [negativeMarking, setNegativeMarking] = useState<boolean>(true);
  const [starting, setStarting] = useState(false);

  // Active exam or completed review state
  const [activeExam, setActiveExam] = useState<ActiveExamState | null>(null);
  const [completedReview, setCompletedReview] = useState<{
    exam: ExamHistoryItem;
    questions: EnrichedQuestion[];
  } | null>(() => {
    if (!initialReviewExam) return null;
    const qMap = new Map(allQuestions.map((q) => [q.id, q]));
    const qs = initialReviewExam.questionIds
      .map((id) => qMap.get(id))
      .filter((q): q is EnrichedQuestion => Boolean(q));
    return { exam: initialReviewExam, questions: qs };
  });
  const [submitting, setSubmitting] = useState(false);
  const [showMobilePalette, setShowMobilePalette] = useState(false);

  // Sync if initialReviewExam changes externally (e.g., clicked from Study History)
  useEffect(() => {
    if (initialReviewExam) {
      const qMap = new Map(allQuestions.map((q) => [q.id, q]));
      const qs = initialReviewExam.questionIds
        .map((id) => qMap.get(id))
        .filter((q): q is EnrichedQuestion => Boolean(q));
      setCompletedReview({ exam: initialReviewExam, questions: qs });
      setActiveExam(null);
    }
  }, [initialReviewExam, allQuestions]);

  const activeExamId = activeExam?.examId ?? null;
  const activeSecondsLeft = activeExam?.secondsLeft ?? null;

  const handleSubmitExam = useCallback(async () => {
    if (!activeExam || submitting) return;
    setSubmitting(true);
    const elapsedSec = Math.max(
      1,
      Math.round((Date.now() - activeExam.startedAtMs) / 1000)
    );
    try {
      const res = await fetch(`/api/exams/${activeExam.examId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: activeExam.answers,
          timeTakenSeconds: elapsedSec,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const finishedExam: ExamHistoryItem = {
          id: data.exam.id,
          titleEn: data.exam.titleEn,
          titleNe: data.exam.titleNe,
          commission: data.exam.commission,
          examType: data.exam.examType,
          totalQuestions: data.exam.totalQuestions,
          attemptedQuestions: data.exam.attemptedQuestions,
          correctAnswers: data.exam.correctAnswers,
          wrongAnswers: data.exam.wrongAnswers,
          negativeMarking: data.exam.negativeMarking,
          netScore: data.exam.netScore,
          accuracyPct: data.exam.accuracyPct,
          durationMinutes: data.exam.durationMinutes,
          timeTakenSeconds: data.exam.timeTakenSeconds,
          status: data.exam.status,
          questionIds: data.exam.questionIds || [],
          answers: data.exam.answers || {},
          startedAt: data.exam.startedAt,
          completedAt: data.exam.completedAt,
        };
        setCompletedReview({
          exam: finishedExam,
          questions: activeExam.questions,
        });
        setActiveExam(null);
        onExamCompleted();
      }
    } finally {
      setSubmitting(false);
    }
  }, [activeExam, submitting, onExamCompleted]);

  // Countdown timer effect
  useEffect(() => {
    if (!activeExamId) return;
    const interval = setInterval(() => {
      setActiveExam((prev) => {
        if (!prev) return null;
        if (prev.secondsLeft <= 1) {
          clearInterval(interval);
          return { ...prev, secondsLeft: 0 };
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeExamId]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (activeExamId && activeSecondsLeft === 0 && !submitting) {
      handleSubmitExam();
    }
  }, [activeExamId, activeSecondsLeft, submitting, handleSubmitExam]);

  async function handleStartExam(overrides?: {
    titleEn?: string;
    titleNe?: string;
    examType?: string;
    qCount?: number;
    durMins?: number;
    subjId?: string;
    comm?: string;
  }) {
    setStarting(true);
    setCompletedReview(null);
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn: overrides?.titleEn,
          titleNe: overrides?.titleNe,
          examType:
            overrides?.examType ||
            (isDailyChallengeMode ? "daily_challenge" : "full_mock"),
          commission: overrides?.comm || commission,
          subjectId: overrides?.subjId ?? subjectId,
          questionCount: overrides?.qCount ?? questionCount,
          durationMinutes: overrides?.durMins ?? durationMinutes,
          negativeMarking,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const qs: EnrichedQuestion[] = data.questions || [];
        const dur = data.exam.durationMinutes || 20;
        setActiveExam({
          examId: data.exam.id,
          titleEn: data.exam.titleEn,
          titleNe: data.exam.titleNe,
          commission: data.exam.commission,
          negativeMarking: data.exam.negativeMarking,
          durationMinutes: dur,
          questions: qs,
          answers: {},
          flagged: {},
          currentIndex: 0,
          secondsLeft: dur * 60,
          startedAtMs: Date.now(),
        });
      }
    } finally {
      setStarting(false);
    }
  }

  function formatTimer(totalSec: number): string {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // 1. RENDER POST-EXAM SCORECARD & SOLUTION REVIEW
  if (completedReview) {
    const { exam, questions } = completedReview;
    const unattempted = exam.totalQuestions - exam.attemptedQuestions;
    const negativeDeducted = exam.negativeMarking
      ? (exam.wrongAnswers * 0.2).toFixed(2)
      : "0.00";

    return (
      <div className="space-y-5">
        {/* Scorecard Summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-[#131C31]">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Award className="h-3.5 w-3.5" />
                {lang === "ne" ? "परीक्षा नतिजा विवरण" : "Examination Scorecard"}
              </span>
              <h2 className="mt-2 text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">
                {lang === "ne" ? exam.titleNe : exam.titleEn}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {exam.commission} ·{" "}
                {exam.negativeMarking
                  ? t.negativeMarkingNote
                  : lang === "ne"
                    ? "नकारात्मक अंकन छैन"
                    : "No Negative Marking"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCompletedReview(null)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#0F294A] px-4 text-xs font-semibold text-white hover:bg-[#1a3d6b] dark:bg-sky-500 dark:text-slate-950"
            >
              <Play className="h-3.5 w-3.5" />
              {lang === "ne" ? "नयाँ परीक्षा दिनुहोस्" : "Take Another Exam"}
            </button>
          </div>

          {/* 5 Result Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                {lang === "ne" ? "खुद प्राप्ताङ्क" : "Net Score"}
              </div>
              <div className="font-mono-num mt-1 text-2xl font-bold text-[#0F294A] dark:text-sky-400">
                {exam.netScore}
                <span className="text-xs font-normal text-slate-400">
                  /{exam.totalQuestions}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                {t.overallAccuracy}
              </div>
              <div className="font-mono-num mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {exam.accuracyPct}%
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-800/60 dark:bg-emerald-950/20">
              <div className="text-[11px] font-semibold text-emerald-700 uppercase dark:text-emerald-400">
                {t.correctAnswers}
              </div>
              <div className="font-mono-num mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                +{exam.correctAnswers}
              </div>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 dark:border-rose-800/60 dark:bg-rose-950/20">
              <div className="text-[11px] font-semibold text-rose-700 uppercase dark:text-rose-400">
                {lang === "ne" ? "गलत / घटाइएको" : "Wrong / Penalty"}
              </div>
              <div className="font-mono-num mt-1 text-2xl font-bold text-rose-700 dark:text-rose-300">
                {exam.wrongAnswers}{" "}
                <span className="text-xs font-semibold">
                  (-{negativeDeducted})
                </span>
              </div>
            </div>

            <div className="col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 sm:col-span-1 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                {lang === "ne" ? "समय / नछोइएको" : "Time / Skipped"}
              </div>
              <div className="font-mono-num mt-1 text-lg font-bold text-slate-800 dark:text-slate-200">
                {formatTimer(exam.timeTakenSeconds)} · {unattempted}
              </div>
            </div>
          </div>
        </div>

        {/* Question-by-Question Answer Sheet & Explanation */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {lang === "ne"
              ? "प्रश्नोत्तर पुनरावलोकन र विस्तृत व्याख्या"
              : "Complete Solution & Answer Sheet Review"}
          </h3>

          {questions.map((q, idx) => {
            const userChoice = exam.answers[String(q.id)] || null;
            const isCorrect = userChoice === q.correctOption;

            return (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#131C31]"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono-num rounded bg-[#0F294A] px-2 py-0.5 font-bold text-white dark:bg-sky-500 dark:text-slate-950">
                      Q{idx + 1}
                    </span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {lang === "ne" ? q.topicNameNe : q.topicNameEn}
                    </span>
                  </div>
                  {!userChoice ? (
                    <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {lang === "ne" ? "उत्तर नदिइएको" : "Unattempted"}
                    </span>
                  ) : isCorrect ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {lang === "ne"
                        ? `सही (${userChoice})`
                        : `Correct (${userChoice})`}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                      <XCircle className="h-3.5 w-3.5" />
                      {lang === "ne"
                        ? `तपाईंको उत्तर: ${userChoice} | सही: ${q.correctOption}`
                        : `Your Answer: ${userChoice} | Correct: ${q.correctOption}`}
                    </span>
                  )}
                </div>

                <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {lang === "ne" ? q.questionNe : q.questionEn}
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(
                    [
                      { k: "A", en: q.optionAEn, ne: q.optionANe },
                      { k: "B", en: q.optionBEn, ne: q.optionBNe },
                      { k: "C", en: q.optionCEn, ne: q.optionCNe },
                      { k: "D", en: q.optionDEn, ne: q.optionDNe },
                    ] as const
                  ).map((o) => {
                    const isRight = q.correctOption === o.k;
                    const isPickedWrong = userChoice === o.k && !isRight;
                    return (
                      <div
                        key={o.k}
                        className={`rounded-lg border px-3 py-2 text-xs ${
                          isRight
                            ? "border-emerald-500 bg-emerald-50/80 font-semibold text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200"
                            : isPickedWrong
                              ? "border-rose-400 bg-rose-50/80 text-rose-900 dark:border-rose-600 dark:bg-rose-950/40 dark:text-rose-200"
                              : "border-slate-200 bg-slate-50/50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-400"
                        }`}
                      >
                        <span className="font-mono-num mr-2 font-bold">
                          {o.k}.
                        </span>
                        {lang === "ne" ? o.ne : o.en}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#0F294A] dark:text-sky-400" />
                  <span>
                    {lang === "ne" ? q.explanationNe : q.explanationEn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. RENDER ACTIVE TIMED EXAMINATION CONSOLE
  if (activeExam) {
    const currentQ = activeExam.questions[activeExam.currentIndex];
    const answeredCount = Object.keys(activeExam.answers).length;
    const isLowTime = activeExam.secondsLeft < 120;

    return (
      <div className="space-y-4">
        {/* Top Exam Control Bar */}
        <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-[#131C31]">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeExam.commission}
            </div>
            <h2 className="text-sm font-bold text-slate-900 sm:text-base dark:text-slate-100">
              {lang === "ne" ? activeExam.titleNe : activeExam.titleEn}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              className={`font-mono-num inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-bold ${
                isLowTime
                  ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                  : "border-slate-200 bg-slate-50 text-[#0F294A] dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300"
              }`}
            >
              <Clock className="h-4 w-4" />
              {formatTimer(activeExam.secondsLeft)}
            </div>

            <button
              type="button"
              onClick={() => setShowMobilePalette((v) => !v)}
              className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 lg:hidden dark:border-slate-700 dark:text-slate-200"
            >
              <Grid className="h-4 w-4" />
              {answeredCount}/{activeExam.questions.length}
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitExam}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#C81E3D] px-4 text-xs font-semibold text-white hover:bg-[#a81732] disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" />
              {submitting ? "..." : t.submitExam}
            </button>
          </div>
        </div>

        {/* Main Exam Grid: Question Area + Palette */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            {currentQ && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num rounded-md bg-[#0F294A] px-2.5 py-1 text-xs font-bold text-white dark:bg-sky-500 dark:text-slate-950">
                      Question {activeExam.currentIndex + 1} of{" "}
                      {activeExam.questions.length}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {lang === "ne"
                        ? currentQ.subjectNameNe
                        : currentQ.subjectNameEn}{" "}
                      ·{" "}
                      {lang === "ne"
                        ? currentQ.topicNameNe
                        : currentQ.topicNameEn}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveExam((prev) =>
                        prev
                          ? {
                              ...prev,
                              flagged: {
                                ...prev.flagged,
                                [currentQ.id]: !prev.flagged[currentQ.id],
                              },
                            }
                          : null
                      )
                    }
                    className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold ${
                      activeExam.flagged[currentQ.id]
                        ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-300"
                        : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {t.markForReview}
                  </button>
                </div>

                <p className="mb-5 text-base leading-relaxed font-semibold text-slate-900 sm:text-[17px] dark:text-slate-100">
                  {lang === "ne" ? currentQ.questionNe : currentQ.questionEn}
                </p>

                <div className="space-y-2.5">
                  {(
                    [
                      {
                        key: "A" as const,
                        en: currentQ.optionAEn,
                        ne: currentQ.optionANe,
                      },
                      {
                        key: "B" as const,
                        en: currentQ.optionBEn,
                        ne: currentQ.optionBNe,
                      },
                      {
                        key: "C" as const,
                        en: currentQ.optionCEn,
                        ne: currentQ.optionCNe,
                      },
                      {
                        key: "D" as const,
                        en: currentQ.optionDEn,
                        ne: currentQ.optionDNe,
                      },
                    ] as const
                  ).map((opt) => {
                    const isPicked =
                      activeExam.answers[String(currentQ.id)] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() =>
                          setActiveExam((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  answers: {
                                    ...prev.answers,
                                    [String(currentQ.id)]: opt.key,
                                  },
                                }
                              : null
                          )
                        }
                        className={`flex min-h-[50px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                          isPicked
                            ? "border-[#0F294A] bg-[#0F294A]/8 text-[#0F294A] ring-1 ring-[#0F294A] dark:border-sky-400 dark:bg-sky-500/15 dark:text-sky-200"
                            : "border-slate-200 bg-slate-50/70 text-slate-800 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200"
                        }`}
                      >
                        <span
                          className={`font-mono-num inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                            isPicked
                              ? "bg-[#0F294A] text-white dark:bg-sky-400 dark:text-slate-950"
                              : "bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="text-sm font-medium">
                          {lang === "ne" ? opt.ne : opt.en}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Question Nav */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveExam((prev) => {
                        if (!prev) return null;
                        const nextAns = { ...prev.answers };
                        delete nextAns[String(currentQ.id)];
                        return { ...prev, answers: nextAns };
                      })
                    }
                    className="min-h-[38px] rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    {t.clearResponse}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={activeExam.currentIndex === 0}
                      onClick={() =>
                        setActiveExam((prev) =>
                          prev
                            ? {
                                ...prev,
                                currentIndex: Math.max(
                                  0,
                                  prev.currentIndex - 1
                                ),
                              }
                            : null
                        )
                      }
                      className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t.previous}
                    </button>

                    {activeExam.currentIndex <
                    activeExam.questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveExam((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  currentIndex: Math.min(
                                    prev.questions.length - 1,
                                    prev.currentIndex + 1
                                  ),
                                }
                              : null
                          )
                        }
                        className="inline-flex min-h-[40px] items-center gap-1 rounded-lg bg-[#0F294A] px-4 text-xs font-semibold text-white dark:bg-sky-500 dark:text-slate-950"
                      >
                        {t.next}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleSubmitExam}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#C81E3D] px-4 text-xs font-semibold text-white"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {t.submitExam}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Question Palette Sidebar */}
          <div
            className={`lg:col-span-4 ${
              showMobilePalette ? "block" : "hidden lg:block"
            }`}
          >
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
              <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.questionPalette}
              </h3>

              <div className="mb-4 grid grid-cols-3 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-emerald-600" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {t.answered} ({answeredCount})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-amber-500" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {t.markedForReview} (
                    {Object.values(activeExam.flagged).filter(Boolean).length})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-slate-200 dark:bg-slate-700" />
                  <span className="text-slate-600 dark:text-slate-300">
                    {t.unanswered} (
                    {activeExam.questions.length - answeredCount})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {activeExam.questions.map((q, idx) => {
                  const isCurrent = idx === activeExam.currentIndex;
                  const isAns = Boolean(activeExam.answers[String(q.id)]);
                  const isFlag = Boolean(activeExam.flagged[q.id]);

                  let btnClass =
                    "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300";
                  if (isFlag) {
                    btnClass = "bg-amber-500 text-white";
                  } else if (isAns) {
                    btnClass = "bg-emerald-600 text-white";
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setActiveExam((prev) =>
                          prev ? { ...prev, currentIndex: idx } : null
                        );
                        setShowMobilePalette(false);
                      }}
                      className={`font-mono-num min-h-[38px] rounded-lg text-xs font-bold transition-all ${btnClass} ${
                        isCurrent
                          ? "ring-2 ring-[#0F294A] ring-offset-1 dark:ring-sky-400"
                          : ""
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. RENDER EXAM LAUNCHER & PRESET TEMPLATES
  return (
    <div className="space-y-5">
      {/* Featured Exam Presets */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
          <div>
            <span className="inline-flex items-center rounded-md bg-[#0F294A]/10 px-2.5 py-1 text-xs font-bold text-[#0F294A] dark:bg-sky-500/15 dark:text-sky-300">
              {lang === "ne" ? "संघीय लोक सेवा आयोग" : "Federal Loksewa Aayog"}
            </span>
            <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-slate-100">
              {lang === "ne"
                ? "पाँचौं तह (नायब सुब्बा / खरिदार) प्रथम पत्र पूर्ण नमुना परीक्षा"
                : "Fifth Level (Nayab Subba / Kharidar) First Paper Full Mock"}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {lang === "ne"
                ? "सामान्य ज्ञान, संविधान, सार्वजनिक प्रशासन, बौद्धिक परीक्षण (IQ) र समसामयिक समेटिएको समयबद्ध परीक्षा।"
                : "Balanced full-syllabus timed test covering GK, Constitution, Public Administration, Mental Ability (IQ), and Current Affairs."}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            <span className="font-mono-num text-xs font-semibold text-slate-600 dark:text-slate-300">
              25 Qs · 25 Mins · -20%
            </span>
            <button
              type="button"
              disabled={starting}
              onClick={() =>
                handleStartExam({
                  titleEn:
                    "Federal Fifth Level (Nayab Subba / Kharidar) First Paper Mock",
                  titleNe:
                    "संघीय पाँचौं तह (नायब सुब्बा / खरिदार) प्रथम पत्र नमुना परीक्षा",
                  comm: "Federal (Loksewa Aayog)",
                  qCount: 25,
                  durMins: 25,
                  subjId: "all",
                })
              }
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#0F294A] px-4 text-xs font-semibold text-white hover:bg-[#1a3d6b] disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950"
            >
              <Play className="h-3.5 w-3.5" />
              {starting ? "..." : t.startMockExam}
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
          <div>
            <span className="inline-flex items-center rounded-md bg-[#C81E3D]/10 px-2.5 py-1 text-xs font-bold text-[#C81E3D] dark:bg-rose-500/15 dark:text-rose-300">
              {lang === "ne"
                ? "सातै प्रदेश लोक सेवा आयोग (PPSC)"
                : "All 7 Provincial PSCs (PPSC)"}
            </span>
            <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-slate-100">
              {lang === "ne"
                ? "प्रदेश निजामती सेवा पाँचौं तह सामान्य प्रशासन नमुना परीक्षा"
                : "Provincial Civil Service Fifth Level General Admin Mock"}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {lang === "ne"
                ? "कोशी, मधेश, बागमती, गण्डकी, लुम्बिनी, कर्णाली र सुदूरपश्चिम प्रदेशको पाठ्यक्रम अनुसारको नमुना परीक्षा।"
                : "Designed for Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, and Sudurpashchim PPSC Fifth Level candidates."}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            <span className="font-mono-num text-xs font-semibold text-slate-600 dark:text-slate-300">
              20 Qs · 20 Mins · -20%
            </span>
            <button
              type="button"
              disabled={starting}
              onClick={() =>
                handleStartExam({
                  titleEn: `${commission} — Fifth Level General Administration Mock`,
                  titleNe: `${commission} — पाँचौं तह सामान्य प्रशासन नमुना परीक्षा`,
                  comm: commission,
                  qCount: 20,
                  durMins: 20,
                  subjId: "all",
                })
              }
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#C81E3D] px-4 text-xs font-semibold text-white hover:bg-[#a81732] disabled:opacity-60"
            >
              <Play className="h-3.5 w-3.5" />
              {starting ? "..." : t.startMockExam}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Mock Exam Builder */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {isDailyChallengeMode
              ? t.dailyGkChallenge
              : lang === "ne"
                ? "अनुकूलित नमुना परीक्षा निर्माण गर्नुहोस् (Custom Exam Builder)"
                : "Custom Timed Examination Builder"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.negativeMarkingNote}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ne" ? "लक्षित आयोग" : "Target Commission"}
            </label>
            <select
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              className="min-h-[42px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {COMMISSIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {lang === "ne" ? c.ne : c.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ne" ? "विषय क्षेत्र" : "Subject Scope"}
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="min-h-[42px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">{t.allSubjects}</option>
              {syllabus.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {lang === "ne" ? s.nameNe : s.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ne" ? "प्रश्न संख्या" : "Number of Questions"}
            </label>
            <select
              value={questionCount}
              onChange={(e) => {
                const val = Number(e.target.value);
                setQuestionCount(val);
                setDurationMinutes(val);
              }}
              className="min-h-[42px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value={10}>10 Questions (10 Mins)</option>
              <option value={15}>15 Questions (15 Mins)</option>
              <option value={20}>20 Questions (20 Mins)</option>
              <option value={30}>30 Questions (30 Mins)</option>
              <option value={50}>50 Questions (45 Mins)</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="mb-2 flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={negativeMarking}
                onChange={(e) => setNegativeMarking(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0F294A]"
              />
              {lang === "ne"
                ? "२०% नकारात्मक अंकन लागू गर्नुहोस्"
                : "Enable 20% Negative Marking"}
            </label>

            <button
              type="button"
              disabled={starting}
              onClick={() => handleStartExam()}
              className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#0F294A] px-4 text-xs font-semibold text-white hover:bg-[#1a3d6b] disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950"
            >
              <Play className="h-4 w-4" />
              {starting
                ? lang === "ne"
                  ? "तयार हुँदैछ..."
                  : "Preparing Exam..."
                : isDailyChallengeMode
                  ? t.startDailyChallenge
                  : t.startMockExam}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
