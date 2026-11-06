import { asc, desc, eq } from "drizzle-orm";
import {
  db,
  subjects,
  topics,
  questions,
  currentAffairs,
  userQuestionAttempts,
  userBookmarks,
  mockExamSessions,
  studyProgress,
} from "@/db";
import type { PublicUser } from "./auth";

export interface EnrichedQuestion {
  id: number;
  subjectId: number;
  subjectCode: string;
  subjectNameEn: string;
  subjectNameNe: string;
  topicId: number;
  topicSlug: string;
  topicNameEn: string;
  topicNameNe: string;
  subCategoryEn: string;
  subCategoryNe: string;
  questionEn: string;
  questionNe: string;
  optionAEn: string;
  optionANe: string;
  optionBEn: string;
  optionBNe: string;
  optionCEn: string;
  optionCNe: string;
  optionDEn: string;
  optionDNe: string;
  correctOption: "A" | "B" | "C" | "D";
  explanationEn: string;
  explanationNe: string;
  difficulty: "easy" | "medium" | "hard";
  commission: string;
  examLevel: string;
  isPreviousYear: boolean;
  previousYearInfo: string | null;
  isImportant: boolean;
  isDailyChallenge: boolean;
  createdByUserId: number | null;
  isBookmarked: boolean;
  bookmarkId: number | null;
  personalNote: string;
  lastSelectedOption: string | null;
  lastIsCorrect: boolean | null;
  isUnresolvedIncorrect: boolean;
}

export interface SyllabusTopicItem {
  id: number;
  subjectId: number;
  subCategoryEn: string;
  subCategoryNe: string;
  nameEn: string;
  nameNe: string;
  slug: string;
  weightageMarks: number;
  sortOrder: number;
  questionCount: number;
  questionsSolved: number;
  masteryPct: number;
}

export interface SyllabusSubjectGroup {
  id: number;
  code: string;
  nameEn: string;
  nameNe: string;
  descriptionEn: string;
  descriptionNe: string;
  iconName: string;
  accentColor: string;
  sortOrder: number;
  totalQuestions: number;
  topicsCount: number;
  subCategories: Array<{
    nameEn: string;
    nameNe: string;
    topics: SyllabusTopicItem[];
  }>;
}

export interface EnrichedCurrentAffair {
  id: number;
  titleEn: string;
  titleNe: string;
  summaryEn: string;
  summaryNe: string;
  keyPointsEn: string[];
  keyPointsNe: string[];
  category: string;
  publishedDateBs: string;
  publishedDateAd: string;
  linkedQuestionId: number | null;
  linkedQuestion: EnrichedQuestion | null;
  isImportant: boolean;
}

export interface SubjectPerformanceMetric {
  subjectId: number;
  code: string;
  nameEn: string;
  nameNe: string;
  accentColor: string;
  totalQuestionsInBank: number;
  attempted: number;
  correct: number;
  accuracyPct: number;
  topicsCount: number;
  topicsStudied: number;
}

export interface ContinueLearningItem {
  topicId: number;
  topicSlug: string;
  topicNameEn: string;
  topicNameNe: string;
  subCategoryEn: string;
  subCategoryNe: string;
  subjectId: number;
  subjectCode: string;
  subjectNameEn: string;
  subjectNameNe: string;
  questionsSolved: number;
  correctCount: number;
  masteryPct: number;
  lastStudiedAt: string;
  totalQuestionsInTopic: number;
}

export interface ExamHistoryItem {
  id: number;
  titleEn: string;
  titleNe: string;
  commission: string;
  examType: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  negativeMarking: boolean;
  netScore: string;
  accuracyPct: number;
  durationMinutes: number;
  timeTakenSeconds: number;
  status: string;
  questionIds: number[];
  answers: Record<string, string>;
  startedAt: string;
  completedAt: string | null;
}

export interface DashboardPayload {
  user: PublicUser | null;
  stats: {
    questionsAttempted: number;
    correctAnswers: number;
    overallAccuracy: number;
    totalExamsCompleted: number;
    studyProgressPct: number;
    topicsCoveredCount: number;
    totalTopicsCount: number;
    bookmarkedCount: number;
    incorrectCount: number;
    dailyChallengeCompleted: boolean;
    weakestSubjects: SubjectPerformanceMetric[];
    strongestSubjects: SubjectPerformanceMetric[];
    subjectPerformance: SubjectPerformanceMetric[];
    difficultyBreakdown: Array<{
      difficulty: string;
      attempted: number;
      correct: number;
      accuracyPct: number;
    }>;
  };
  continueLearning: ContinueLearningItem[];
  syllabus: SyllabusSubjectGroup[];
  questions: EnrichedQuestion[];
  currentAffairs: EnrichedCurrentAffair[];
  examHistory: ExamHistoryItem[];
}

export async function getDashboardPayload(
  user: PublicUser | null
): Promise<DashboardPayload> {
  const [allSubjects, allTopics, allQuestions, allCurrentAffairs] =
    await Promise.all([
      db.select().from(subjects).orderBy(asc(subjects.sortOrder)),
      db.select().from(topics).orderBy(asc(topics.sortOrder)),
      db.select().from(questions).orderBy(asc(questions.id)),
      db.select().from(currentAffairs).orderBy(desc(currentAffairs.id)),
    ]);

  const userAttempts = user
    ? await db
        .select()
        .from(userQuestionAttempts)
        .where(eq(userQuestionAttempts.userId, user.id))
        .orderBy(asc(userQuestionAttempts.attemptedAt))
    : [];

  const bookmarks = user
    ? await db
        .select()
        .from(userBookmarks)
        .where(eq(userBookmarks.userId, user.id))
    : [];

  const exams = user
    ? await db
        .select()
        .from(mockExamSessions)
        .where(eq(mockExamSessions.userId, user.id))
        .orderBy(desc(mockExamSessions.startedAt))
    : [];

  const progressRows = user
    ? await db
        .select()
        .from(studyProgress)
        .where(eq(studyProgress.userId, user.id))
        .orderBy(desc(studyProgress.lastStudiedAt))
    : [];

  const subjectById = new Map(allSubjects.map((s) => [s.id, s]));
  const topicById = new Map(allTopics.map((t) => [t.id, t]));
  const bookmarkByQuestionId = new Map(
    bookmarks.map((b) => [b.questionId, b])
  );
  const progressByTopicId = new Map(progressRows.map((p) => [p.topicId, p]));

  // Latest attempt per question & attempt history
  const latestAttemptByQuestionId = new Map<
    number,
    { selectedOption: string; isCorrect: boolean }
  >();
  for (const att of userAttempts) {
    latestAttemptByQuestionId.set(att.questionId, {
      selectedOption: att.selectedOption,
      isCorrect: att.isCorrect,
    });
  }

  // Question counts per topic & subject
  const questionCountByTopicId = new Map<number, number>();
  const questionCountBySubjectId = new Map<number, number>();
  for (const q of allQuestions) {
    questionCountByTopicId.set(
      q.topicId,
      (questionCountByTopicId.get(q.topicId) ?? 0) + 1
    );
    questionCountBySubjectId.set(
      q.subjectId,
      (questionCountBySubjectId.get(q.subjectId) ?? 0) + 1
    );
  }

  // Enrich Questions
  const enrichedQuestions: EnrichedQuestion[] = allQuestions.map((q) => {
    const subj = subjectById.get(q.subjectId);
    const top = topicById.get(q.topicId);
    const bm = bookmarkByQuestionId.get(q.id);
    const latestAtt = latestAttemptByQuestionId.get(q.id);

    return {
      id: q.id,
      subjectId: q.subjectId,
      subjectCode: subj?.code ?? "GK",
      subjectNameEn: subj?.nameEn ?? "General Knowledge",
      subjectNameNe: subj?.nameNe ?? "सामान्य ज्ञान",
      topicId: q.topicId,
      topicSlug: top?.slug ?? "general",
      topicNameEn: top?.nameEn ?? "General",
      topicNameNe: top?.nameNe ?? "सामान्य",
      subCategoryEn: top?.subCategoryEn ?? "General",
      subCategoryNe: top?.subCategoryNe ?? "सामान्य",
      questionEn: q.questionEn,
      questionNe: q.questionNe,
      optionAEn: q.optionAEn,
      optionANe: q.optionANe,
      optionBEn: q.optionBEn,
      optionBNe: q.optionBNe,
      optionCEn: q.optionCEn,
      optionCNe: q.optionCNe,
      optionDEn: q.optionDEn,
      optionDNe: q.optionDNe,
      correctOption: (q.correctOption as "A" | "B" | "C" | "D") || "A",
      explanationEn: q.explanationEn,
      explanationNe: q.explanationNe,
      difficulty: (q.difficulty as "easy" | "medium" | "hard") || "medium",
      commission: q.commission,
      examLevel: q.examLevel,
      isPreviousYear: q.isPreviousYear,
      previousYearInfo: q.previousYearInfo,
      isImportant: q.isImportant,
      isDailyChallenge: q.isDailyChallenge,
      createdByUserId: q.createdByUserId ?? null,
      isBookmarked: Boolean(bm),
      bookmarkId: bm?.id ?? null,
      personalNote: bm?.personalNote ?? "",
      lastSelectedOption: latestAtt?.selectedOption ?? null,
      lastIsCorrect: latestAtt ? latestAtt.isCorrect : null,
      isUnresolvedIncorrect: latestAtt ? !latestAtt.isCorrect : false,
    };
  });

  const enrichedQuestionById = new Map(
    enrichedQuestions.map((q) => [q.id, q])
  );

  // Build Syllabus Hierarchy
  const syllabus: SyllabusSubjectGroup[] = allSubjects.map((s) => {
    const subjTopics = allTopics.filter((t) => t.subjectId === s.id);
    const subCatMap = new Map<
      string,
      { nameEn: string; nameNe: string; topics: SyllabusTopicItem[] }
    >();

    for (const t of subjTopics) {
      if (!subCatMap.has(t.subCategoryEn)) {
        subCatMap.set(t.subCategoryEn, {
          nameEn: t.subCategoryEn,
          nameNe: t.subCategoryNe,
          topics: [],
        });
      }
      const prog = progressByTopicId.get(t.id);
      subCatMap.get(t.subCategoryEn)!.topics.push({
        id: t.id,
        subjectId: t.subjectId,
        subCategoryEn: t.subCategoryEn,
        subCategoryNe: t.subCategoryNe,
        nameEn: t.nameEn,
        nameNe: t.nameNe,
        slug: t.slug,
        weightageMarks: t.weightageMarks,
        sortOrder: t.sortOrder,
        questionCount: questionCountByTopicId.get(t.id) ?? 0,
        questionsSolved: prog?.questionsSolved ?? 0,
        masteryPct: prog?.masteryPct ?? 0,
      });
    }

    return {
      id: s.id,
      code: s.code,
      nameEn: s.nameEn,
      nameNe: s.nameNe,
      descriptionEn: s.descriptionEn,
      descriptionNe: s.descriptionNe,
      iconName: s.iconName,
      accentColor: s.accentColor,
      sortOrder: s.sortOrder,
      totalQuestions: questionCountBySubjectId.get(s.id) ?? 0,
      topicsCount: subjTopics.length,
      subCategories: Array.from(subCatMap.values()),
    };
  });

  // Build Current Affairs
  const enrichedCurrentAffairs: EnrichedCurrentAffair[] = allCurrentAffairs.map(
    (ca) => {
      let parsedEn: string[] = [];
      let parsedNe: string[] = [];
      try {
        parsedEn = JSON.parse(ca.keyPointsEn);
      } catch {
        parsedEn = [ca.keyPointsEn];
      }
      try {
        parsedNe = JSON.parse(ca.keyPointsNe);
      } catch {
        parsedNe = [ca.keyPointsNe];
      }

      return {
        id: ca.id,
        titleEn: ca.titleEn,
        titleNe: ca.titleNe,
        summaryEn: ca.summaryEn,
        summaryNe: ca.summaryNe,
        keyPointsEn: parsedEn,
        keyPointsNe: parsedNe,
        category: ca.category,
        publishedDateBs: ca.publishedDateBs,
        publishedDateAd: ca.publishedDateAd,
        linkedQuestionId: ca.linkedQuestionId ?? null,
        linkedQuestion: ca.linkedQuestionId
          ? enrichedQuestionById.get(ca.linkedQuestionId) ?? null
          : null,
        isImportant: ca.isImportant,
      };
    }
  );

  // Build Continue Learning list
  const continueLearning: ContinueLearningItem[] = progressRows
    .map((p) => {
      const top = topicById.get(p.topicId);
      if (!top) return null;
      const subj = subjectById.get(top.subjectId);
      if (!subj) return null;
      return {
        topicId: top.id,
        topicSlug: top.slug,
        topicNameEn: top.nameEn,
        topicNameNe: top.nameNe,
        subCategoryEn: top.subCategoryEn,
        subCategoryNe: top.subCategoryNe,
        subjectId: subj.id,
        subjectCode: subj.code,
        subjectNameEn: subj.nameEn,
        subjectNameNe: subj.nameNe,
        questionsSolved: p.questionsSolved,
        correctCount: p.correctCount,
        masteryPct: p.masteryPct,
        lastStudiedAt: p.lastStudiedAt.toISOString(),
        totalQuestionsInTopic: questionCountByTopicId.get(top.id) ?? 0,
      };
    })
    .filter((item): item is ContinueLearningItem => item !== null);

  // Build Exam History
  const examHistory: ExamHistoryItem[] = exams.map((e) => {
    let qIds: number[] = [];
    let ans: Record<string, string> = {};
    try {
      qIds = JSON.parse(e.questionIdsJson);
    } catch {
      qIds = [];
    }
    try {
      ans = JSON.parse(e.answersJson);
    } catch {
      ans = {};
    }
    return {
      id: e.id,
      titleEn: e.titleEn,
      titleNe: e.titleNe,
      commission: e.commission,
      examType: e.examType,
      totalQuestions: e.totalQuestions,
      attemptedQuestions: e.attemptedQuestions,
      correctAnswers: e.correctAnswers,
      wrongAnswers: e.wrongAnswers,
      negativeMarking: e.negativeMarking,
      netScore: e.netScore,
      accuracyPct: e.accuracyPct,
      durationMinutes: e.durationMinutes,
      timeTakenSeconds: e.timeTakenSeconds,
      status: e.status,
      questionIds: qIds,
      answers: ans,
      startedAt: e.startedAt.toISOString(),
      completedAt: e.completedAt ? e.completedAt.toISOString() : null,
    };
  });

  // Compute Performance Statistics
  const questionsAttempted = userAttempts.length;
  const correctAnswers = userAttempts.filter((a) => a.isCorrect).length;
  const overallAccuracy =
    questionsAttempted > 0
      ? Math.round((correctAnswers / questionsAttempted) * 100)
      : 0;
  const totalExamsCompleted = exams.filter(
    (e) => e.status === "completed"
  ).length;

  const topicsCoveredCount = progressRows.filter(
    (p) => p.questionsSolved > 0
  ).length;
  const totalTopicsCount = allTopics.length;
  const studyProgressPct =
    totalTopicsCount > 0
      ? Math.min(
          100,
          Math.max(
            topicsCoveredCount > 0
              ? Math.round((topicsCoveredCount / totalTopicsCount) * 100)
              : 0,
            0
          )
        )
      : 0;

  const incorrectCount = enrichedQuestions.filter(
    (q) => q.isUnresolvedIncorrect
  ).length;

  // Subject-wise Performance
  const attemptsBySubjectId = new Map<
    number,
    { attempted: number; correct: number }
  >();
  const difficultyMap = new Map<
    string,
    { attempted: number; correct: number }
  >([
    ["easy", { attempted: 0, correct: 0 }],
    ["medium", { attempted: 0, correct: 0 }],
    ["hard", { attempted: 0, correct: 0 }],
  ]);

  for (const att of userAttempts) {
    const q = enrichedQuestionById.get(att.questionId);
    if (!q) continue;
    const prevSubj = attemptsBySubjectId.get(q.subjectId) ?? {
      attempted: 0,
      correct: 0,
    };
    prevSubj.attempted += 1;
    if (att.isCorrect) prevSubj.correct += 1;
    attemptsBySubjectId.set(q.subjectId, prevSubj);

    const diffStats = difficultyMap.get(q.difficulty) ?? {
      attempted: 0,
      correct: 0,
    };
    diffStats.attempted += 1;
    if (att.isCorrect) diffStats.correct += 1;
    difficultyMap.set(q.difficulty, diffStats);
  }

  const subjectPerformance: SubjectPerformanceMetric[] = allSubjects.map((s) => {
    const subjTopics = allTopics.filter((t) => t.subjectId === s.id);
    const studiedInSubj = subjTopics.filter((t) =>
      progressByTopicId.has(t.id)
    ).length;
    const attStats = attemptsBySubjectId.get(s.id) ?? {
      attempted: 0,
      correct: 0,
    };
    const accuracyPct =
      attStats.attempted > 0
        ? Math.round((attStats.correct / attStats.attempted) * 100)
        : 0;

    return {
      subjectId: s.id,
      code: s.code,
      nameEn: s.nameEn,
      nameNe: s.nameNe,
      accentColor: s.accentColor,
      totalQuestionsInBank: questionCountBySubjectId.get(s.id) ?? 0,
      attempted: attStats.attempted,
      correct: attStats.correct,
      accuracyPct,
      topicsCount: subjTopics.length,
      topicsStudied: studiedInSubj,
    };
  });

  const attemptedSubjects = subjectPerformance.filter((s) => s.attempted > 0);
  const weakestSubjects = [...attemptedSubjects]
    .sort((a, b) => a.accuracyPct - b.accuracyPct)
    .slice(0, 2);
  const strongestSubjects = [...attemptedSubjects]
    .sort((a, b) => b.accuracyPct - a.accuracyPct)
    .slice(0, 2);

  const dailyChallengeCompleted = exams.some(
    (e) => e.examType === "daily_challenge" && e.status === "completed"
  );

  const difficultyBreakdown = Array.from(difficultyMap.entries()).map(
    ([difficulty, d]) => ({
      difficulty,
      attempted: d.attempted,
      correct: d.correct,
      accuracyPct:
        d.attempted > 0 ? Math.round((d.correct / d.attempted) * 100) : 0,
    })
  );

  return {
    user,
    stats: {
      questionsAttempted,
      correctAnswers,
      overallAccuracy,
      totalExamsCompleted,
      studyProgressPct,
      topicsCoveredCount,
      totalTopicsCount,
      bookmarkedCount: bookmarks.length,
      incorrectCount,
      dailyChallengeCompleted,
      weakestSubjects,
      strongestSubjects,
      subjectPerformance,
      difficultyBreakdown,
    },
    continueLearning,
    syllabus,
    questions: enrichedQuestions,
    currentAffairs: enrichedCurrentAffairs,
    examHistory,
  };
}
