"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  FileCheck2,
  History,
  Flame,
  Newspaper,
  Star,
  Bookmark,
  AlertCircle,
  BarChart3,
  Clock,
  Sun,
  Moon,
  Languages,
  User,
  Menu,
  X,
  Plus,
  Search,
  ChevronRight,
  Award,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Database,
} from "lucide-react";
import type {
  DashboardPayload,
  EnrichedQuestion,
  ExamHistoryItem,
} from "@/lib/dashboard-service";
import { UI_TEXT, type Lang } from "@/lib/i18n";
import type { NavSection } from "./types";
import { QuestionCard } from "./QuestionCard";
import { PracticeWorkspace } from "./PracticeWorkspace";
import { MockExamRunner } from "./MockExamRunner";
import { SyllabusExplorer } from "./SyllabusExplorer";
import { QuestionBankModal } from "./QuestionBankModal";
import { ProfileSettingsModal } from "./ProfileSettingsModal";
import { CurrentAffairsSection } from "./CurrentAffairsSection";
import { PerformanceAnalyticsView } from "./PerformanceAnalyticsView";

interface LoksewaAppProps {
  initialData: DashboardPayload;
}

export function LoksewaApp({ initialData }: LoksewaAppProps) {
  const [data, setData] = useState<DashboardPayload>(initialData);
  const [lang, setLang] = useState<Lang>(
    initialData.user?.preferredLang === "ne" ? "ne" : "en"
  );
  const [theme, setTheme] = useState<"light" | "dark">(
    initialData.user?.preferredTheme === "dark" ? "dark" : "light"
  );
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Practice pre-selection when launched from Dashboard or Syllabus
  const [practiceSubjectId, setPracticeSubjectId] = useState<number | "all">(
    "all"
  );
  const [practiceTopicId, setPracticeTopicId] = useState<number | "all">(
    "all"
  );
  const [practiceKey, setPracticeKey] = useState(1);

  // Exam review from Study History
  const [reviewExam, setReviewExam] = useState<ExamHistoryItem | null>(null);

  // Question Bank CRUD Modal
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<EnrichedQuestion | null>(null);
  const [defaultModalTopicId, setDefaultModalTopicId] = useState<
    number | undefined
  >(undefined);

  // Student Exam Target & Profile Settings Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Question Bank Manager search
  const [qbSearch, setQbSearch] = useState("");
  const [qbSubjectFilter, setQbSubjectFilter] = useState<string>("all");

  const [refreshing, setRefreshing] = useState(false);

  const t = UI_TEXT[lang];

  // Sync theme class on <html>
  useEffect(() => {
    const savedTheme = localStorage.getItem("loksewa_theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
    const savedLang = localStorage.getItem("loksewa_lang");
    if (savedLang === "en" || savedLang === "ne") {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("loksewa_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("loksewa_lang", lang);
  }, [lang]);

  async function refreshDashboard() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (res.ok) {
        const fresh: DashboardPayload = await res.json();
        setData(fresh);
      }
    } finally {
      setRefreshing(false);
    }
  }

  async function handleToggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (data.user) {
      fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredTheme: nextTheme }),
      }).catch(() => {});
    }
  }

  async function handleToggleLang() {
    const nextLang = lang === "en" ? "ne" : "en";
    setLang(nextLang);
    if (data.user) {
      fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredLang: nextLang }),
      }).catch(() => {});
    }
  }

  function navigateTo(section: NavSection) {
    setActiveSection(section);
    setMobileMenuOpen(false);
    if (section !== "mock_exam") {
      setReviewExam(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function launchTopicPractice(subjectId: number | "all", topicId: number | "all") {
    setPracticeSubjectId(subjectId);
    setPracticeTopicId(topicId);
    setPracticeKey((k) => k + 1);
    navigateTo("start_practice");
  }

  async function handleDeleteQuestion(questionId: number) {
    const res = await fetch(`/api/questions/${questionId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await refreshDashboard();
    }
  }

  async function handleToggleImportant(
    questionId: number,
    nextImportant: boolean
  ) {
    const res = await fetch(`/api/questions/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isImportant: nextImportant }),
    });
    if (res.ok) {
      await refreshDashboard();
    }
  }

  async function handleDeleteExam(examId: number) {
    const res = await fetch(`/api/exams/${examId}`, { method: "DELETE" });
    if (res.ok) {
      await refreshDashboard();
    }
  }

  // Filtered subsets for the dedicated dashboard sections
  const previousYearQuestions = useMemo(
    () => data.questions.filter((q) => q.isPreviousYear),
    [data.questions]
  );
  const importantQuestions = useMemo(
    () => data.questions.filter((q) => q.isImportant),
    [data.questions]
  );
  const bookmarkedQuestions = useMemo(
    () => data.questions.filter((q) => q.isBookmarked),
    [data.questions]
  );
  const incorrectQuestions = useMemo(
    () => data.questions.filter((q) => q.isUnresolvedIncorrect),
    [data.questions]
  );
  const dailyChallengeQuestions = useMemo(
    () => data.questions.filter((q) => q.isDailyChallenge),
    [data.questions]
  );

  const managedQuestions = useMemo(() => {
    const qLower = qbSearch.trim().toLowerCase();
    return data.questions.filter((q) => {
      if (
        qbSubjectFilter !== "all" &&
        q.subjectId !== Number(qbSubjectFilter)
      ) {
        return false;
      }
      if (!qLower) return true;
      return (
        q.questionEn.toLowerCase().includes(qLower) ||
        q.questionNe.toLowerCase().includes(qLower) ||
        q.topicNameEn.toLowerCase().includes(qLower) ||
        q.topicNameNe.toLowerCase().includes(qLower)
      );
    });
  }, [data.questions, qbSearch, qbSubjectFilter]);

  // Sidebar navigation structure covering Overview, Syllabus, all 11 sections, and CRUD Manager
  const navGroups: Array<{
    groupLabel: string;
    items: Array<{
      id: NavSection;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
    }>;
  }> = [
    {
      groupLabel: lang === "ne" ? "मुख्य मेनु" : "Core Workspace",
      items: [
        {
          id: "dashboard",
          label: t.dashboardOverview,
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          id: "syllabus",
          label: t.syllabusLibrary,
          icon: <BookOpen className="h-4 w-4" />,
          badge: data.stats.totalTopicsCount,
        },
        {
          id: "continue_learning",
          label: t.continueLearning,
          icon: <Clock className="h-4 w-4" />,
          badge: data.continueLearning.length,
        },
        {
          id: "start_practice",
          label: t.startPractice,
          icon: <PlayCircle className="h-4 w-4" />,
          badge: data.questions.length,
        },
      ],
    },
    {
      groupLabel: lang === "ne" ? "परीक्षा र चुनौती" : "Examinations & Feeds",
      items: [
        {
          id: "mock_exam",
          label: t.fullMockExam,
          icon: <FileCheck2 className="h-4 w-4" />,
        },
        {
          id: "previous_year",
          label: t.previousYearQuestions,
          icon: <History className="h-4 w-4" />,
          badge: previousYearQuestions.length,
        },
        {
          id: "daily_challenge",
          label: t.dailyGkChallenge,
          icon: <Flame className="h-4 w-4" />,
        },
        {
          id: "current_affairs",
          label: t.currentAffairs,
          icon: <Newspaper className="h-4 w-4" />,
          badge: data.currentAffairs.length,
        },
      ],
    },
    {
      groupLabel: lang === "ne" ? "पुनरावलोकन र विश्लेषण" : "Revision & Analytics",
      items: [
        {
          id: "important_questions",
          label: t.importantQuestions,
          icon: <Star className="h-4 w-4" />,
          badge: importantQuestions.length,
        },
        {
          id: "bookmarked_questions",
          label: t.bookmarkedQuestions,
          icon: <Bookmark className="h-4 w-4" />,
          badge: bookmarkedQuestions.length,
        },
        {
          id: "incorrect_questions",
          label: t.incorrectQuestions,
          icon: <AlertCircle className="h-4 w-4" />,
          badge: incorrectQuestions.length,
        },
        {
          id: "my_performance",
          label: t.myPerformance,
          icon: <BarChart3 className="h-4 w-4" />,
        },
        {
          id: "study_history",
          label: t.studyHistory,
          icon: <Award className="h-4 w-4" />,
          badge: data.examHistory.length,
        },
        {
          id: "question_manager",
          label: t.questionManager,
          icon: <Database className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-[#0B1120] dark:text-slate-100">
      {/* TOP PERSISTENT HEADER */}
      <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-xs dark:border-slate-800 dark:bg-[#0B1120]/95">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-2 px-3 sm:px-6">
          {/* Left: Mobile Drawer Trigger + Brand */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden dark:border-slate-800 dark:text-slate-200"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => navigateTo("dashboard")}
              className="flex items-center gap-2.5 text-left"
            >
              {/* Custom Nepal Civic Shield SVG Emblem */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F294A] text-white shadow-xs dark:bg-sky-500 dark:text-slate-950">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-[#0F294A] dark:text-white">
                    {t.brandName}
                  </span>
                  <span className="hidden rounded bg-[#C81E3D] px-1.5 py-0.5 text-[10px] font-bold text-white sm:inline-block">
                    NEPAL
                  </span>
                </div>
                <p className="hidden text-[11px] text-slate-500 sm:block dark:text-slate-400">
                  {t.brandTagline}
                </p>
              </div>
            </button>
          </div>

          {/* Right Controls: Target Commission + Language NE/EN + Theme Light/Dark + User */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Active Commission Pill */}
            {data.user && (
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#0F294A] hover:border-[#0F294A] md:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {data.user.targetCommission}
              </button>
            )}

            {/* Bilingual Language Toggle */}
            <button
              type="button"
              onClick={handleToggleLang}
              aria-label="Toggle Nepali or English language"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 sm:px-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <Languages className="h-4 w-4 text-[#C81E3D]" />
              <span>{lang === "en" ? "नेपाली" : "EN"}</span>
            </button>

            {/* Light / Dark Theme Toggle */}
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label="Toggle Light or Dark Theme"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 text-[#0F294A]" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
              <span className="hidden md:inline">
                {theme === "light" ? "Dark" : "Light"}
              </span>
            </button>

            {/* Student Exam Target & Profile Button */}
            {data.user && (
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-xl bg-[#0F294A] px-3 text-xs font-semibold text-white hover:bg-[#1a3d6b] dark:bg-sky-500 dark:text-slate-950"
              >
                <User className="h-4 w-4" />
                <span className="hidden max-w-[110px] truncate sm:inline">
                  {data.user.name}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN SHELL: SIDEBAR + CONTENT */}
      <div className="mx-auto flex max-w-[1440px]">
        {/* DESKTOP LEFT SIDEBAR (256px) */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:block dark:border-slate-800 dark:bg-[#0E1629]">
          <nav className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.groupLabel}>
                <div className="mb-1.5 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  {group.groupLabel}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigateTo(item.id)}
                        className={`flex min-h-[40px] w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                          isActive
                            ? "bg-[#0F294A] text-white shadow-2xs dark:bg-sky-500 dark:text-slate-950"
                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          {item.icon}
                          <span className="truncate">{item.label}</span>
                        </span>
                        {typeof item.badge === "number" && (
                          <span
                            className={`font-mono-num rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* MOBILE SLIDE-OVER DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative z-50 h-full w-72 overflow-y-auto bg-white p-4 shadow-xl dark:bg-[#0E1629]">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <span className="text-sm font-bold text-[#0F294A] dark:text-white">
                  {t.brandName}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-5 pb-20">
                {navGroups.map((group) => (
                  <div key={group.groupLabel}>
                    <div className="mb-1.5 px-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      {group.groupLabel}
                    </div>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => navigateTo(item.id)}
                            className={`flex min-h-[42px] w-full items-center justify-between rounded-xl px-3 text-left text-xs font-semibold ${
                              isActive
                                ? "bg-[#0F294A] text-white dark:bg-sky-500 dark:text-slate-950"
                                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              {item.icon}
                              <span>{item.label}</span>
                            </span>
                            {typeof item.badge === "number" && (
                              <span className="font-mono-num rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT AREA */}
        <main className="min-w-0 flex-1 px-3 py-5 pb-24 sm:px-6 lg:pb-8">
          {/* ============================================================== */}
          {/* VIEW 1: MAIN DASHBOARD OVERVIEW (ALL 7 STATS + ALL 11 SECTIONS)*/}
          {/* ============================================================== */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Hero Welcome & Exam Readiness Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-[#131C31]">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F294A]/10 px-3 py-1 text-xs font-bold text-[#0F294A] dark:bg-sky-500/15 dark:text-sky-300">
                        {data.user?.targetCommission ||
                          "Federal (Loksewa Aayog)"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {data.user?.targetLevel ||
                          "Fifth Level - General Administration"}
                      </span>
                      {data.user && (
                        <span className="font-mono-num inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                          <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {data.user.streakDays} {t.dayStreak}
                        </span>
                      )}
                    </div>

                    <h1 className="mt-2.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                      {lang === "ne"
                        ? `नमस्ते, ${data.user?.name || "परीक्षार्थी"}! लोकसेवा तयारीमा स्वागत छ`
                        : `Welcome back, ${data.user?.name || "Aspirant"} — Loksewa Readiness Hub`}
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                      {lang === "ne"
                        ? "संघीय तथा सातै प्रदेश लोक सेवा आयोगको पाँचौं तह सामान्य प्रशासन र अन्य प्रतिस्पर्धात्मक परीक्षाको पूर्ण अभ्यास प्रणाली।"
                        : "Structured preparation for Federal Loksewa Aayog, all 7 Provincial PSCs (PPSC), and Fifth Level – General Administration."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => launchTopicPractice("all", "all")}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#0F294A] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#1a3d6b] dark:bg-sky-500 dark:text-slate-950"
                    >
                      <PlayCircle className="h-4 w-4" />
                      {t.startPractice}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo("mock_exam")}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#C81E3D] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#a81732]"
                    >
                      <FileCheck2 className="h-4 w-4" />
                      {t.fullMockExam}
                    </button>
                  </div>
                </div>
              </div>

              {/* 7 USEFUL STATISTICS: 5 PRIMARY KPI CARDS + 2 DIAGNOSTIC CARDS */}
              <section aria-label="Performance Statistics" className="space-y-3">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#131C31]">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                      {t.questionsAttempted}
                    </div>
                    <div className="font-mono-num mt-1.5 text-2xl font-bold text-slate-900 dark:text-white">
                      {data.stats.questionsAttempted}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {data.questions.length} {lang === "ne" ? "कुल बैंक" : "in bank"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#131C31]">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                      {t.correctAnswers}
                    </div>
                    <div className="font-mono-num mt-1.5 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                      {data.stats.correctAnswers}
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                      {lang === "ne" ? "सही समाधान" : "Verified right"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#131C31]">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                      {t.overallAccuracy}
                    </div>
                    <div className="font-mono-num mt-1.5 text-2xl font-bold text-[#0F294A] dark:text-sky-400">
                      {data.stats.overallAccuracy}%
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-[#0F294A] dark:bg-sky-400"
                        style={{ width: `${data.stats.overallAccuracy}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#131C31]">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                      {t.totalExamsCompleted}
                    </div>
                    <div className="font-mono-num mt-1.5 text-2xl font-bold text-slate-900 dark:text-white">
                      {data.stats.totalExamsCompleted}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {lang === "ne" ? "नमुना परीक्षा" : "Timed mocks"}
                    </div>
                  </div>

                  <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs sm:col-span-1 dark:border-slate-800 dark:bg-[#131C31]">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-400">
                      {t.studyProgress}
                    </div>
                    <div className="font-mono-num mt-1.5 text-2xl font-bold text-[#C81E3D] dark:text-rose-400">
                      {data.stats.studyProgressPct}%
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {data.stats.topicsCoveredCount}/{data.stats.totalTopicsCount}{" "}
                      {t.topicsMastered}
                    </div>
                  </div>
                </div>

                {/* Strongest Subjects & Weakest Subjects Bar */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200/90 bg-white px-4 py-3 dark:border-emerald-900/50 dark:bg-[#131C31]">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {t.strongestSubjects}:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {data.stats.strongestSubjects.length > 0 ? (
                        data.stats.strongestSubjects.map((s) => (
                          <span
                            key={s.subjectId}
                            className="font-mono-num rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          >
                            {lang === "ne" ? s.nameNe : s.nameEn} (
                            {s.accuracyPct}%)
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          {lang === "ne" ? "तथ्यांक संकलन हुँदैछ" : "Start practicing"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200/90 bg-white px-4 py-3 dark:border-rose-900/50 dark:bg-[#131C31]">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {t.weakestSubjects}:
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {data.stats.weakestSubjects.length > 0 ? (
                        data.stats.weakestSubjects.map((s) => (
                          <button
                            key={s.subjectId}
                            type="button"
                            onClick={() =>
                              launchTopicPractice(s.subjectId, "all")
                            }
                            className="font-mono-num rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300"
                          >
                            {lang === "ne" ? s.nameNe : s.nameEn} (
                            {s.accuracyPct}%) →
                          </button>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          {lang === "ne" ? "तथ्यांक संकलन हुँदैछ" : "Start practicing"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 1: CONTINUE LEARNING */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#0F294A] dark:text-sky-400" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      1. {t.continueLearning}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo("continue_learning")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F294A] hover:underline dark:text-sky-400"
                  >
                    {t.viewAll}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {data.continueLearning.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-xs text-slate-500 dark:border-slate-700">
                    {lang === "ne"
                      ? "कुनै पनि विषय छनौट गरी अभ्यास सुरु गर्नुहोस्, तपाईंको प्रगति यहाँ देखिनेछ।"
                      : "Select any subject or topic below to start learning and track your progress here."}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {data.continueLearning.slice(0, 3).map((item) => (
                      <div
                        key={item.topicId}
                        className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40"
                      >
                        <div>
                          <div className="text-[11px] font-bold text-[#C81E3D] dark:text-rose-400">
                            {lang === "ne"
                              ? item.subjectNameNe
                              : item.subjectNameEn}
                          </div>
                          <div className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                            {lang === "ne"
                              ? item.topicNameNe
                              : item.topicNameEn}
                          </div>
                          <div className="font-mono-num mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {item.questionsSolved} solved · {item.masteryPct}%
                            mastery
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                            <div
                              className="h-full rounded-full bg-emerald-600 dark:bg-emerald-400"
                              style={{ width: `${item.masteryPct}%` }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              launchTopicPractice(item.subjectId, item.topicId)
                            }
                            className="min-h-[36px] w-full rounded-lg bg-[#0F294A] text-xs font-semibold text-white hover:bg-[#1a3d6b] dark:bg-sky-500 dark:text-slate-950"
                          >
                            {t.resumePractice}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* SECTION 2: START PRACTICE (5 LOKSEWA SUBJECTS & 81 TOPICS) */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-[#C81E3D]" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      2. {t.startPractice} —{" "}
                      {lang === "ne"
                        ? "सम्पूर्ण विषयगत पुस्तकालय (८१ शीर्षक)"
                        : "Complete Subject & Topic Library (81 Topics)"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo("syllabus")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F294A] hover:underline dark:text-sky-400"
                  >
                    {lang === "ne" ? "सबै ८१ शीर्षक हेर्नुहोस्" : "Explore All 81 Topics"}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {data.syllabus.map((subj) => (
                    <div
                      key={subj.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-[#0F294A] dark:border-slate-800 dark:bg-slate-900/40"
                    >
                      <div>
                        <span
                          className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
                          style={{ backgroundColor: subj.accentColor }}
                        >
                          {subj.topicsCount}{" "}
                          {lang === "ne" ? "शीर्षक" : "Topics"}
                        </span>
                        <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                          {lang === "ne" ? subj.nameNe : subj.nameEn}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400">
                          {lang === "ne"
                            ? subj.descriptionNe
                            : subj.descriptionEn}
                        </p>
                      </div>

                      <div className="mt-3 pt-2">
                        <div className="font-mono-num mb-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          {subj.totalQuestions} MCQs
                        </div>
                        <button
                          type="button"
                          onClick={() => launchTopicPractice(subj.id, "all")}
                          className="min-h-[36px] w-full rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0F294A] hover:bg-[#0F294A] hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300"
                        >
                          {t.launchPractice}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTIONS 3, 4, 5: FULL MOCK EXAM + PREVIOUS YEAR + DAILY GK CHALLENGE */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* 3. Full Mock Examination */}
                <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F294A] uppercase dark:text-sky-400">
                        <FileCheck2 className="h-4 w-4" />
                        3. {t.fullMockExam}
                      </span>
                      <span className="font-mono-num rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        -20% Rule
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-white">
                      {lang === "ne"
                        ? "संघीय र प्रदेश लोकसेवा नमुना परीक्षा"
                        : "Timed Federal & PPSC Mock Simulator"}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {lang === "ne"
                        ? "वास्तविक परीक्षा जस्तै टाइमर, प्रश्न सूची, नकारात्मक अंकन र विस्तृत उत्तर कुञ्जीसहितको नमुना परीक्षा।"
                        : "Real CBT exam environment with live countdown timer, question palette, 20% negative marking, and instant solution review."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo("mock_exam")}
                    className="mt-4 min-h-[40px] w-full rounded-xl bg-[#0F294A] text-xs font-semibold text-white hover:bg-[#1a3d6b] dark:bg-sky-500 dark:text-slate-950"
                  >
                    {t.startMockExam}
                  </button>
                </section>

                {/* 4. Previous-Year Questions */}
                <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase dark:text-indigo-400">
                        <History className="h-4 w-4" />
                        4. {t.previousYearQuestions}
                      </span>
                      <span className="font-mono-num rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                        {previousYearQuestions.length} Qs
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-white">
                      {lang === "ne"
                        ? "विगतका वर्षमा सोधिएका प्रश्न संग्रह"
                        : "Loksewa & PPSC Past Paper Archive"}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {lang === "ne"
                        ? "नायब सुब्बा, खरिदार, शाखा अधिकृत र प्रदेश लोकसेवा (२०७८–२०८१) मा सोधिएका वास्तविक प्रश्नहरू।"
                        : "Authentic past examination questions from Nayab Subba, Kharidar, Section Officer & Provincial PSCs (2078–2081 BS)."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo("previous_year")}
                    className="mt-4 min-h-[40px] w-full rounded-xl border border-indigo-200 bg-indigo-50 text-xs font-semibold text-indigo-800 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
                  >
                    {lang === "ne"
                      ? "विगतका प्रश्न अभ्यास गर्नुहोस्"
                      : "Solve Past Paper Questions"}
                  </button>
                </section>

                {/* 5. Daily GK Challenge */}
                <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase dark:text-amber-400">
                        <Flame className="h-4 w-4" />
                        5. {t.dailyGkChallenge}
                      </span>
                      <span className="font-mono-num rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                        {dailyChallengeQuestions.length} Qs
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-white">
                      {lang === "ne"
                        ? "आजको विशेष १० प्रश्न दैनिक चुनौती"
                        : "Today's Curated Loksewa GK & IQ Sprint"}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {lang === "ne"
                        ? "दैनिक सामान्य ज्ञान, संविधान र बौद्धिक परीक्षण अभ्यास गरी आफ्नो अध्ययन निरन्तरता बढाउनुहोस्।"
                        : "Build daily exam consistency with high-yield GK, Constitution, and Mental Ability questions."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo("daily_challenge")}
                    className="mt-4 min-h-[40px] w-full rounded-xl bg-[#C81E3D] text-xs font-semibold text-white hover:bg-[#a81732]"
                  >
                    {t.startDailyChallenge}
                  </button>
                </section>
              </div>

              {/* SECTION 6: CURRENT AFFAIRS */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-amber-600" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      6. {t.currentAffairs}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo("current_affairs")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F294A] hover:underline dark:text-sky-400"
                  >
                    {t.viewAll} ({data.currentAffairs.length})
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {data.currentAffairs.slice(0, 2).map((ca) => (
                    <div
                      key={ca.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-amber-700 dark:text-amber-400">
                            {ca.category}
                          </span>
                          <span className="font-mono-num text-slate-500">
                            {ca.publishedDateBs}
                          </span>
                        </div>
                        <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                          {lang === "ne" ? ca.titleNe : ca.titleEn}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                          {lang === "ne" ? ca.summaryNe : ca.summaryEn}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigateTo("current_affairs")}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#0F294A] hover:underline dark:text-sky-400"
                      >
                        {lang === "ne"
                          ? "विस्तृत बुँदा र प्रश्न अभ्यास गर्नुहोस्"
                          : "Read Key Facts & Solve Linked MCQ"}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTIONS 7, 8, 9: IMPORTANT QUESTIONS + BOOKMARKED QUESTIONS + INCORRECT QUESTIONS */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* 7. Important Questions */}
                <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase dark:text-amber-400">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        7. {t.importantQuestions}
                      </span>
                      <span className="font-mono-num rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                        {importantQuestions.length}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {lang === "ne"
                        ? "लोकसेवा परीक्षामा बारम्बार सोधिने अति महत्त्वपूर्ण (VVI) प्रश्नहरूको विशेष संगालो।"
                        : "High-yield 'Most Probable' VVI questions curated for Fifth Level & Officer exams."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo("important_questions")}
                    className="mt-4 min-h-[38px] w-full rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {t.viewAll} ({importantQuestions.length})
                  </button>
                </section>

                {/* 8. Bookmarked Questions */}
                <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F294A] uppercase dark:text-sky-400">
                        <Bookmark className="h-4 w-4" />
                        8. {t.bookmarkedQuestions}
                      </span>
                      <span className="font-mono-num rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {bookmarkedQuestions.length}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {lang === "ne"
                        ? "तपाईंले सुरक्षित गर्नुभएका बुकमार्क प्रश्नहरू र व्यक्तिगत अध्ययन नोटहरू।"
                        : "Your saved revision questions paired with personal constitutional & formula notes."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo("bookmarked_questions")}
                    className="mt-4 min-h-[38px] w-full rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {t.viewAll} ({bookmarkedQuestions.length})
                  </button>
                </section>

                {/* 9. Incorrect Questions */}
                <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase dark:text-rose-400">
                        <AlertCircle className="h-4 w-4" />
                        9. {t.incorrectQuestions}
                      </span>
                      <span className="font-mono-num rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                        {incorrectQuestions.length}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {lang === "ne"
                        ? "पहिले गलत भएका प्रश्नहरू पुनः अभ्यास गरी गल्ती सुधार्ने विशेष खण्ड।"
                        : "Review every missed question with explanations and re-solve them to turn mistakes into mastery."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo("incorrect_questions")}
                    className="mt-4 min-h-[38px] w-full rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                  >
                    {t.reattemptIncorrect} ({incorrectQuestions.length})
                  </button>
                </section>
              </div>

              {/* SECTIONS 10 & 11: MY PERFORMANCE + STUDY HISTORY */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                {/* 10. My Performance */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-7 dark:border-slate-800 dark:bg-[#131C31]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-[#0F294A] dark:text-sky-400" />
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        10. {t.myPerformance}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo("my_performance")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F294A] hover:underline dark:text-sky-400"
                    >
                      {t.viewAll}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.stats.subjectPerformance.map((sp) => (
                      <div key={sp.subjectId}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {lang === "ne" ? sp.nameNe : sp.nameEn}
                          </span>
                          <span className="font-mono-num font-bold text-slate-700 dark:text-slate-300">
                            {sp.correct}/{sp.attempted} ({sp.accuracyPct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
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
                </section>

                {/* 11. Study History */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-5 dark:border-slate-800 dark:bg-[#131C31]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#C81E3D]" />
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        11. {t.studyHistory}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo("study_history")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F294A] hover:underline dark:text-sky-400"
                    >
                      {t.viewAll}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {data.examHistory.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500 dark:border-slate-700">
                      {lang === "ne"
                        ? "कुनै परीक्षा इतिहास छैन।"
                        : "No completed examinations yet."}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {data.examHistory.slice(0, 3).map((ex) => (
                        <div
                          key={ex.id}
                          className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                              {lang === "ne" ? ex.titleNe : ex.titleEn}
                            </div>
                            <div className="font-mono-num text-[11px] text-slate-500 dark:text-slate-400">
                              Net: {ex.netScore}/{ex.totalQuestions} ·{" "}
                              {ex.accuracyPct}%
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setReviewExam(ex);
                              setActiveSection("mock_exam");
                            }}
                            className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#0F294A] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300"
                          >
                            {lang === "ne" ? "हेर्नुहोस्" : "Review"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 2: COMPLETE SUBJECT & TOPIC LIBRARY (ALL 81 TOPICS)       */}
          {/* ============================================================== */}
          {activeSection === "syllabus" && (
            <SyllabusExplorer
              syllabus={data.syllabus}
              lang={lang}
              onSelectTopicPractice={(sId, tId) =>
                launchTopicPractice(sId, tId)
              }
              onSyllabusChanged={refreshDashboard}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 3: CONTINUE LEARNING FULL VIEW                            */}
          {/* ============================================================== */}
          {activeSection === "continue_learning" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.continueLearning}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "ne"
                    ? "तपाईंले अध्ययन गरिरहनुभएका शीर्षकहरू जहाँबाट छोड्नुभएको थियो त्यहीँबाट निरन्तरता दिनुहोस्।"
                    : "Resume any recently studied syllabus topic right where you left off."}
                </p>
              </div>

              {data.continueLearning.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#131C31]">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ne"
                      ? "अहिलेसम्म कुनै शीर्षक अध्ययन सुरु गरिएको छैन।"
                      : "No active study sessions yet."}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigateTo("syllabus")}
                    className="mt-3 min-h-[40px] rounded-lg bg-[#0F294A] px-4 text-xs font-semibold text-white dark:bg-sky-500 dark:text-slate-950"
                  >
                    {t.syllabusLibrary}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.continueLearning.map((item) => (
                    <div
                      key={item.topicId}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]"
                    >
                      <div>
                        <span className="text-xs font-bold text-[#C81E3D] dark:text-rose-400">
                          {lang === "ne"
                            ? item.subjectNameNe
                            : item.subjectNameEn}
                        </span>
                        <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                          {lang === "ne" ? item.topicNameNe : item.topicNameEn}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {lang === "ne"
                            ? item.subCategoryNe
                            : item.subCategoryEn}
                        </p>
                        <div className="font-mono-num mt-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {item.questionsSolved} Qs solved · {item.correctCount}{" "}
                          correct · {item.masteryPct}% mastery
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-emerald-600 dark:bg-emerald-400"
                            style={{ width: `${item.masteryPct}%` }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            launchTopicPractice(item.subjectId, item.topicId)
                          }
                          className="min-h-[40px] w-full rounded-xl bg-[#0F294A] text-xs font-semibold text-white hover:bg-[#1a3d6b] dark:bg-sky-500 dark:text-slate-950"
                        >
                          {t.resumePractice}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 4: START PRACTICE (INTERACTIVE CONTINUOUS MCQ WORKSPACE)  */}
          {/* ============================================================== */}
          {activeSection === "start_practice" && (
            <PracticeWorkspace
              key={`practice-${practiceKey}`}
              questions={data.questions}
              syllabus={data.syllabus}
              lang={lang}
              initialSubjectId={practiceSubjectId}
              initialTopicId={practiceTopicId}
              mode="practice"
              onAttemptSuccess={refreshDashboard}
              onOpenAddQuestion={(tId) => {
                setEditingQuestion(null);
                setDefaultModalTopicId(tId);
                setQuestionModalOpen(true);
              }}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 5: FULL MOCK EXAMINATION                                  */}
          {/* ============================================================== */}
          {activeSection === "mock_exam" && (
            <MockExamRunner
              lang={lang}
              syllabus={data.syllabus}
              allQuestions={data.questions}
              defaultCommission={
                data.user?.targetCommission || "Federal (Loksewa Aayog)"
              }
              initialReviewExam={reviewExam}
              onExamCompleted={refreshDashboard}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 6: PREVIOUS-YEAR QUESTIONS                                */}
          {/* ============================================================== */}
          {activeSection === "previous_year" && (
            <PracticeWorkspace
              key="previous-year-workspace"
              questions={previousYearQuestions}
              syllabus={data.syllabus}
              lang={lang}
              mode="previous_year"
              titleOverride={t.previousYearQuestions}
              onAttemptSuccess={refreshDashboard}
              onOpenAddQuestion={(tId) => {
                setEditingQuestion(null);
                setDefaultModalTopicId(tId);
                setQuestionModalOpen(true);
              }}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 7: DAILY GK CHALLENGE                                     */}
          {/* ============================================================== */}
          {activeSection === "daily_challenge" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-xs dark:border-amber-900/50 dark:bg-[#131C31]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                      <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      {data.user?.streakDays ?? 1} {t.dayStreak}
                    </span>
                    <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                      {t.dailyGkChallenge}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === "ne"
                        ? "आजको १० प्रश्नको समयबद्ध सामान्य ज्ञान र बौद्धिक परीक्षण चुनौती वा प्रत्यक्ष अभ्यास गर्नुहोस्।"
                        : "Take today's timed 10-question Loksewa Daily GK & IQ Challenge or practice the curated daily questions below."}
                    </p>
                  </div>

                  {data.stats.dailyChallengeCompleted && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      {t.completedToday}
                    </span>
                  )}
                </div>
              </div>

              <MockExamRunner
                lang={lang}
                syllabus={data.syllabus}
                allQuestions={data.questions}
                defaultCommission={
                  data.user?.targetCommission || "Federal (Loksewa Aayog)"
                }
                isDailyChallengeMode={true}
                onExamCompleted={refreshDashboard}
              />

              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {lang === "ne"
                    ? "आजका दैनिक चुनौती प्रश्नहरू (अभ्यास मोड)"
                    : "Today's Curated Daily Challenge Questions (Instant Practice)"}
                </h3>
                {dailyChallengeQuestions.map((q, idx) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    lang={lang}
                    indexNumber={idx + 1}
                    mode="daily_challenge"
                    onAttemptSuccess={refreshDashboard}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 8: CURRENT AFFAIRS                                        */}
          {/* ============================================================== */}
          {activeSection === "current_affairs" && (
            <CurrentAffairsSection
              currentAffairs={data.currentAffairs}
              lang={lang}
              onDataChanged={refreshDashboard}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 9: IMPORTANT QUESTIONS                                    */}
          {/* ============================================================== */}
          {activeSection === "important_questions" && (
            <PracticeWorkspace
              key="important-questions-workspace"
              questions={importantQuestions}
              syllabus={data.syllabus}
              lang={lang}
              mode="practice"
              titleOverride={t.importantQuestions}
              onAttemptSuccess={refreshDashboard}
              onOpenAddQuestion={(tId) => {
                setEditingQuestion(null);
                setDefaultModalTopicId(tId);
                setQuestionModalOpen(true);
              }}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 10: BOOKMARKED QUESTIONS                                  */}
          {/* ============================================================== */}
          {activeSection === "bookmarked_questions" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.bookmarkedQuestions} ({bookmarkedQuestions.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "ne"
                    ? "तपाईंले बुकमार्क गर्नुभएका प्रश्नहरू र व्यक्तिगत अध्ययन नोटहरू यहाँ सुरक्षित छन्।"
                    : "Review and practice your bookmarked questions along with your personal study notes."}
                </p>
              </div>

              {bookmarkedQuestions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-[#131C31]">
                  <Bookmark className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ne"
                      ? "कुनै प्रश्न बुकमार्क गरिएको छैन।"
                      : "No bookmarked questions yet."}
                  </p>
                  <button
                    type="button"
                    onClick={() => launchTopicPractice("all", "all")}
                    className="mt-3 min-h-[38px] rounded-lg bg-[#0F294A] px-4 text-xs font-semibold text-white dark:bg-sky-500 dark:text-slate-950"
                  >
                    {t.startPractice}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookmarkedQuestions.map((q, idx) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      lang={lang}
                      indexNumber={idx + 1}
                      mode="practice"
                      onAttemptSuccess={refreshDashboard}
                      onBookmarkToggled={() => refreshDashboard()}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 11: INCORRECT QUESTIONS                                   */}
          {/* ============================================================== */}
          {activeSection === "incorrect_questions" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-rose-200 bg-white p-5 shadow-xs dark:border-rose-900/50 dark:bg-[#131C31]">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.incorrectQuestions} ({incorrectQuestions.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === "ne"
                    ? "पहिले गलत उत्तर दिइएका प्रश्नहरू। तल 'पुनः प्रयास' थिचेर सही उत्तर मिलाएपछि यो सूचीबाट हट्नेछ।"
                    : "Questions you missed in previous attempts. Click 'Try Again' on any card and answer correctly to clear it from your error bank!"}
                </p>
              </div>

              {incorrectQuestions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-emerald-300 bg-white p-10 text-center dark:border-emerald-800 dark:bg-[#131C31]">
                  <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {lang === "ne"
                      ? "बधाई छ! तपाईंको गलत प्रश्न सूची खाली छ।"
                      : "Great job! You have zero unresolved incorrect questions."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incorrectQuestions.map((q, idx) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      lang={lang}
                      indexNumber={idx + 1}
                      mode="incorrect_review"
                      showPreviousMistake={true}
                      onAttemptSuccess={refreshDashboard}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 12: MY PERFORMANCE & VIEW 13: STUDY HISTORY               */}
          {/* ============================================================== */}
          {(activeSection === "my_performance" ||
            activeSection === "study_history") && (
            <PerformanceAnalyticsView
              data={data}
              lang={lang}
              focusTab={
                activeSection === "study_history" ? "history" : "performance"
              }
              onPracticeSubject={(sId) => launchTopicPractice(sId, "all")}
              onReviewExam={(ex) => {
                setReviewExam(ex);
                setActiveSection("mock_exam");
              }}
              onDeleteExam={handleDeleteExam}
            />
          )}

          {/* ============================================================== */}
          {/* VIEW 14: QUESTION BANK CRUD MANAGER                            */}
          {/* ============================================================== */}
          {activeSection === "question_manager" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#131C31]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t.questionManager}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === "ne"
                        ? `कुल ${data.questions.length} प्रश्नहरू — नयाँ प्रश्न थप्नुहोस्, सम्पादन गर्नुहोस् वा हटाउनुहोस्`
                        : `Manage all ${data.questions.length} bilingual Loksewa MCQs — Create, Edit, Flag Important, or Delete`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingQuestion(null);
                      setDefaultModalTopicId(undefined);
                      setQuestionModalOpen(true);
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#C81E3D] px-4 text-xs font-semibold text-white hover:bg-[#a81732]"
                  >
                    <Plus className="h-4 w-4" />
                    {t.addQuestion}
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={qbSearch}
                      onChange={(e) => setQbSearch(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="min-h-[40px] w-full rounded-xl border border-slate-200 bg-slate-50 pr-3 pl-9 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <select
                    value={qbSubjectFilter}
                    onChange={(e) => setQbSubjectFilter(e.target.value)}
                    className="min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="all">{t.allSubjects}</option>
                    {data.syllabus.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {lang === "ne" ? s.nameNe : s.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {managedQuestions.map((q, idx) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    lang={lang}
                    indexNumber={idx + 1}
                    showCrudActions={true}
                    onAttemptSuccess={refreshDashboard}
                    onEditQuestion={(item) => {
                      setEditingQuestion(item);
                      setQuestionModalOpen(true);
                    }}
                    onDeleteQuestion={handleDeleteQuestion}
                    onToggleImportant={handleToggleImportant}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (ANDROID & SMALL SCREENS) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed right-0 bottom-0 left-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-xs lg:hidden dark:border-slate-800 dark:bg-[#0B1120]/95"
      >
        <div className="grid h-16 grid-cols-5">
          {[
            {
              id: "dashboard" as NavSection,
              label: lang === "ne" ? "होम" : "Home",
              icon: <LayoutDashboard className="h-5 w-5" />,
            },
            {
              id: "syllabus" as NavSection,
              label: lang === "ne" ? "पाठ्यक्रम" : "Syllabus",
              icon: <BookOpen className="h-5 w-5" />,
            },
            {
              id: "start_practice" as NavSection,
              label: lang === "ne" ? "अभ्यास" : "Practice",
              icon: <PlayCircle className="h-5 w-5" />,
            },
            {
              id: "mock_exam" as NavSection,
              label: lang === "ne" ? "परीक्षा" : "Mock Exam",
              icon: <FileCheck2 className="h-5 w-5" />,
            },
            {
              id: "my_performance" as NavSection,
              label: lang === "ne" ? "नतिजा" : "Analytics",
              icon: <BarChart3 className="h-5 w-5" />,
            },
          ].map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigateTo(tab.id)}
                className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                  isActive
                    ? "text-[#C81E3D] dark:text-sky-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* MODALS */}
      {questionModalOpen && (
        <QuestionBankModal
          lang={lang}
          syllabus={data.syllabus}
          editingQuestion={editingQuestion}
          defaultTopicId={defaultModalTopicId}
          onClose={() => setQuestionModalOpen(false)}
          onSaved={refreshDashboard}
        />
      )}

      {profileModalOpen && data.user && (
        <ProfileSettingsModal
          user={data.user}
          lang={lang}
          onClose={() => setProfileModalOpen(false)}
          onProfileUpdated={refreshDashboard}
        />
      )}

      {/* Subtle background sync indicator */}
      {refreshing && (
        <div className="fixed right-4 bottom-20 z-40 rounded-full bg-[#0F294A] px-3 py-1.5 text-[11px] font-semibold text-white shadow-md lg:bottom-5 dark:bg-sky-500 dark:text-slate-950">
          {lang === "ne" ? "अपडेट हुँदैछ..." : "Syncing progress..."}
        </div>
      )}
    </div>
  );
}
