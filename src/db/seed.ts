import { count, eq } from "drizzle-orm";
import {
  db,
  subjects,
  topics,
  questions,
  currentAffairs,
  users,
  userQuestionAttempts,
  userBookmarks,
  mockExamSessions,
  studyProgress,
} from "./index";
import { SUBJECT_SEEDS, TOPIC_SEEDS } from "./seeds/syllabus";
import { GK_QUESTION_SEEDS } from "./seeds/questions-gk";
import {
  CORE_QUESTION_SEEDS,
  CURRENT_AFFAIRS_SEEDS,
} from "./seeds/questions-core";
import { hashPassword } from "@/lib/auth";

const globalForSeed = globalThis as typeof globalThis & {
  __loksewaSeedPromise?: Promise<void> | null;
};

async function runSeed(): Promise<void> {
  const [{ value: subjectCount }] = await db
    .select({ value: count() })
    .from(subjects);

  if (subjectCount > 0) {
    return;
  }

  // 1. Insert Subjects
  const insertedSubjects = await db
    .insert(subjects)
    .values(SUBJECT_SEEDS)
    .onConflictDoNothing()
    .returning();

  const allSubjects =
    insertedSubjects.length > 0
      ? insertedSubjects
      : await db.select().from(subjects);

  const subjectByCode = new Map(allSubjects.map((s) => [s.code, s.id]));

  // 2. Insert 81 Topics
  const topicRows = TOPIC_SEEDS.map((t) => ({
    subjectId: subjectByCode.get(t.subjectCode)!,
    subCategoryEn: t.subCategoryEn,
    subCategoryNe: t.subCategoryNe,
    nameEn: t.nameEn,
    nameNe: t.nameNe,
    slug: t.slug,
    weightageMarks: t.weightageMarks,
    sortOrder: t.sortOrder,
  }));

  await db.insert(topics).values(topicRows).onConflictDoNothing();
  const allTopics = await db.select().from(topics);
  const topicBySlug = new Map(allTopics.map((t) => [t.slug, t]));

  // 3. Insert Questions
  const allQuestionSeeds = [...GK_QUESTION_SEEDS, ...CORE_QUESTION_SEEDS];
  const questionRows = allQuestionSeeds
    .map((q) => {
      const topic = topicBySlug.get(q.topicSlug);
      if (!topic) return null;
      return {
        subjectId: topic.subjectId,
        topicId: topic.id,
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
        correctOption: q.correctOption,
        explanationEn: q.explanationEn,
        explanationNe: q.explanationNe,
        difficulty: q.difficulty,
        commission: q.commission,
        examLevel: q.examLevel,
        isPreviousYear: Boolean(q.isPreviousYear),
        previousYearInfo: q.previousYearInfo ?? null,
        isImportant: Boolean(q.isImportant),
        isDailyChallenge: Boolean(q.isDailyChallenge),
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  await db.insert(questions).values(questionRows);
  const allQuestions = await db.select().from(questions);

  const firstQuestionByTopicId = new Map<number, number>();
  for (const q of allQuestions) {
    if (!firstQuestionByTopicId.has(q.topicId)) {
      firstQuestionByTopicId.set(q.topicId, q.id);
    }
  }

  // 4. Insert Current Affairs
  const caRows = CURRENT_AFFAIRS_SEEDS.map((ca) => {
    const topic = topicBySlug.get(ca.linkedTopicSlug);
    const linkedQId = topic
      ? firstQuestionByTopicId.get(topic.id) ?? null
      : null;
    return {
      titleEn: ca.titleEn,
      titleNe: ca.titleNe,
      summaryEn: ca.summaryEn,
      summaryNe: ca.summaryNe,
      keyPointsEn: JSON.stringify(ca.keyPointsEn),
      keyPointsNe: JSON.stringify(ca.keyPointsNe),
      category: ca.category,
      publishedDateBs: ca.publishedDateBs,
      publishedDateAd: ca.publishedDateAd,
      linkedQuestionId: linkedQId,
      isImportant: ca.isImportant,
    };
  });

  await db.insert(currentAffairs).values(caRows);

  // 5. Insert Demo Users
  const demoPasswordHash = hashPassword("Loksewa@2082");
  await db
    .insert(users)
    .values([
      {
        name: "Aarav Sharma",
        email: "aarav@loksewapro.np",
        passwordHash: demoPasswordHash,
        role: "student",
        targetCommission: "Federal (Loksewa Aayog)",
        targetLevel: "Fifth Level - General Administration",
        preferredLang: "en",
        preferredTheme: "light",
        streakDays: 12,
      },
      {
        name: "Sita Gurung",
        email: "sita@loksewapro.np",
        passwordHash: demoPasswordHash,
        role: "student",
        targetCommission: "Gandaki PPSC",
        targetLevel: "Fifth Level - General Administration",
        preferredLang: "ne",
        preferredTheme: "light",
        streakDays: 7,
      },
    ])
    .onConflictDoNothing();

  const [aarav] = await db
    .select()
    .from(users)
    .where(eq(users.email, "aarav@loksewapro.np"))
    .limit(1);

  if (!aarav || allQuestions.length === 0) return;

  // 6. Seed Realistic Mock Exam Sessions for Aarav
  const sampleExamQuestions = allQuestions.slice(0, 20);
  const exam1Ids = sampleExamQuestions.map((q) => q.id);
  const exam1Answers: Record<string, string> = {};
  sampleExamQuestions.forEach((q, idx) => {
    // 16 correct, 4 wrong -> 80% accuracy, net score = 16 - 4*0.2 = 15.20
    if (idx < 16) {
      exam1Answers[String(q.id)] = q.correctOption;
    } else {
      exam1Answers[String(q.id)] = q.correctOption === "A" ? "B" : "A";
    }
  });

  const exam2Questions = allQuestions.slice(20, 35);
  const exam2Ids = exam2Questions.map((q) => q.id);
  const exam2Answers: Record<string, string> = {};
  exam2Questions.forEach((q, idx) => {
    // 11 correct, 4 wrong -> 73% accuracy, net score = 11 - 4*0.2 = 10.20
    if (idx < 11) {
      exam2Answers[String(q.id)] = q.correctOption;
    } else {
      exam2Answers[String(q.id)] = q.correctOption === "C" ? "D" : "C";
    }
  });

  const now = Date.now();
  const insertedExams = await db
    .insert(mockExamSessions)
    .values([
      {
        userId: aarav.id,
        titleEn: "Federal Fifth Level (Nayab Subba / Kharidar) Mock Test #1",
        titleNe: "संघीय पाँचौं तह (नायब सुब्बा / खरिदार) नमुना परीक्षा #१",
        commission: "Federal (Loksewa Aayog)",
        examType: "full_mock",
        totalQuestions: 20,
        attemptedQuestions: 20,
        correctAnswers: 16,
        wrongAnswers: 4,
        negativeMarking: true,
        netScore: "15.20",
        accuracyPct: 80,
        durationMinutes: 20,
        timeTakenSeconds: 890,
        status: "completed",
        questionIdsJson: JSON.stringify(exam1Ids),
        answersJson: JSON.stringify(exam1Answers),
        startedAt: new Date(now - 3 * 24 * 60 * 60 * 1000),
        completedAt: new Date(now - 3 * 24 * 60 * 60 * 1000 + 890 * 1000),
      },
      {
        userId: aarav.id,
        titleEn: "Bagmati PPSC Fifth Level General Administration Sprint",
        titleNe: "बागमती प्रदेश लोकसेवा पाँचौं तह सामान्य प्रशासन अभ्यास परीक्षा",
        commission: "Bagmati PPSC",
        examType: "full_mock",
        totalQuestions: 15,
        attemptedQuestions: 15,
        correctAnswers: 11,
        wrongAnswers: 4,
        negativeMarking: true,
        netScore: "10.20",
        accuracyPct: 73,
        durationMinutes: 15,
        timeTakenSeconds: 710,
        status: "completed",
        questionIdsJson: JSON.stringify(exam2Ids),
        answersJson: JSON.stringify(exam2Answers),
        startedAt: new Date(now - 1 * 24 * 60 * 60 * 1000),
        completedAt: new Date(now - 1 * 24 * 60 * 60 * 1000 + 710 * 1000),
      },
    ])
    .returning();

  // 7. Seed Question Attempts across subjects (strong in Constitution & GK, weaker in IQ & Public Admin)
  const attemptRows: Array<{
    userId: number;
    questionId: number;
    selectedOption: string;
    isCorrect: boolean;
    mode: string;
    examSessionId: number | null;
    timeSpentSec: number;
    attemptedAt: Date;
  }> = [];

  sampleExamQuestions.forEach((q, idx) => {
    const isCorrect = idx < 16;
    attemptRows.push({
      userId: aarav.id,
      questionId: q.id,
      selectedOption: exam1Answers[String(q.id)],
      isCorrect,
      mode: "mock_exam",
      examSessionId: insertedExams[0]?.id ?? null,
      timeSpentSec: 22 + (idx % 12),
      attemptedAt: new Date(now - 3 * 24 * 60 * 60 * 1000 + idx * 30000),
    });
  });

  // Add Constitution & Public Admin & IQ attempts so Strongest & Weakest subjects are distinct and realistic
  const constQuestions = allQuestions.filter(
    (q) => q.subjectId === subjectByCode.get("CONST")
  );
  const pubAdminQuestions = allQuestions.filter(
    (q) => q.subjectId === subjectByCode.get("PUB_ADMIN")
  );
  const iqQuestions = allQuestions.filter(
    (q) => q.subjectId === subjectByCode.get("IQ")
  );

  constQuestions.slice(0, 8).forEach((q, idx) => {
    attemptRows.push({
      userId: aarav.id,
      questionId: q.id,
      selectedOption: q.correctOption,
      isCorrect: true,
      mode: "practice",
      examSessionId: null,
      timeSpentSec: 19,
      attemptedAt: new Date(now - 2 * 24 * 60 * 60 * 1000 + idx * 25000),
    });
  });

  pubAdminQuestions.slice(0, 6).forEach((q, idx) => {
    const isCorrect = idx < 4;
    attemptRows.push({
      userId: aarav.id,
      questionId: q.id,
      selectedOption: isCorrect
        ? q.correctOption
        : q.correctOption === "A"
          ? "B"
          : "A",
      isCorrect,
      mode: "practice",
      examSessionId: null,
      timeSpentSec: 25,
      attemptedAt: new Date(now - 18 * 60 * 60 * 1000 + idx * 20000),
    });
  });

  iqQuestions.slice(0, 7).forEach((q, idx) => {
    const isCorrect = idx < 3; // 3/7 = 43% accuracy -> Weakest subject!
    attemptRows.push({
      userId: aarav.id,
      questionId: q.id,
      selectedOption: isCorrect
        ? q.correctOption
        : q.correctOption === "A"
          ? "C"
          : "A",
      isCorrect,
      mode: "practice",
      examSessionId: null,
      timeSpentSec: 34,
      attemptedAt: new Date(now - 6 * 60 * 60 * 1000 + idx * 20000),
    });
  });

  await db.insert(userQuestionAttempts).values(attemptRows);

  // 8. Seed Bookmarks with study notes
  const bookmarkTargets = [
    {
      q: allQuestions[0],
      note: "Important: 1,47,516 sq. km updated map published on 2077 Jestha 7 BS (+335 sq. km).",
    },
    {
      q: constQuestions[0],
      note: "Article 274 - Amendment requires 2/3 majority of both Federal Houses.",
    },
    {
      q: constQuestions[3],
      note: "Schedules 5 (Fed 35), 6 (Prov 21), 7 (Fed+Prov 25), 8 (Local 22), 9 (All 3: 15).",
    },
    {
      q: pubAdminQuestions[2],
      note: "Civil Service Act 2049 Sec 33: 58 years compulsory retirement age.",
    },
    {
      q: iqQuestions[0],
      note: "n(n+1) series pattern — verify second-order difference first.",
    },
  ].filter((b) => Boolean(b.q));

  await db.insert(userBookmarks).values(
    bookmarkTargets.map((b, idx) => ({
      userId: aarav.id,
      questionId: b.q.id,
      personalNote: b.note,
      createdAt: new Date(now - (5 - idx) * 12 * 60 * 60 * 1000),
    }))
  );

  // 9. Seed Study Progress for "Continue Learning"
  const progressSlugs = [
    {
      slug: "fundamental-rights",
      solved: 8,
      correct: 7,
      mastery: 88,
      hoursAgo: 2,
    },
    {
      slug: "civil-service",
      solved: 6,
      correct: 4,
      mastery: 67,
      hoursAgo: 5,
    },
    {
      slug: "number-series",
      solved: 5,
      correct: 2,
      mastery: 40,
      hoursAgo: 8,
    },
    {
      slug: "geography-of-nepal",
      solved: 10,
      correct: 9,
      mastery: 90,
      hoursAgo: 14,
    },
    {
      slug: "national-current-affairs",
      solved: 4,
      correct: 3,
      mastery: 75,
      hoursAgo: 24,
    },
  ];

  const progressRows = progressSlugs
    .map((p) => {
      const topic = topicBySlug.get(p.slug);
      if (!topic) return null;
      return {
        userId: aarav.id,
        topicId: topic.id,
        lastQuestionId: firstQuestionByTopicId.get(topic.id) ?? null,
        questionsSolved: p.solved,
        correctCount: p.correct,
        masteryPct: p.mastery,
        lastStudiedAt: new Date(now - p.hoursAgo * 60 * 60 * 1000),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  await db.insert(studyProgress).values(progressRows);
}

export async function ensureDatabaseSeeded(): Promise<void> {
  if (!globalForSeed.__loksewaSeedPromise) {
    globalForSeed.__loksewaSeedPromise = runSeed().catch((err) => {
      globalForSeed.__loksewaSeedPromise = null;
      throw err;
    });
  }
  await globalForSeed.__loksewaSeedPromise;
}
