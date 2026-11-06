import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("student"),
  targetCommission: text("target_commission")
    .notNull()
    .default("Federal (Loksewa Aayog)"),
  targetLevel: text("target_level")
    .notNull()
    .default("Fifth Level - General Administration"),
  preferredLang: text("preferred_lang").notNull().default("en"),
  preferredTheme: text("preferred_theme").notNull().default("light"),
  streakDays: integer("streak_days").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameNe: text("name_ne").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionNe: text("description_ne").notNull(),
  iconName: text("icon_name").notNull(),
  accentColor: text("accent_color").notNull(),
  sortOrder: integer("sort_order").notNull().default(1),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  subCategoryEn: text("sub_category_en").notNull(),
  subCategoryNe: text("sub_category_ne").notNull(),
  nameEn: text("name_en").notNull(),
  nameNe: text("name_ne").notNull(),
  slug: text("slug").notNull().unique(),
  weightageMarks: integer("weightage_marks").notNull().default(5),
  sortOrder: integer("sort_order").notNull().default(1),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  topicId: integer("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  questionEn: text("question_en").notNull(),
  questionNe: text("question_ne").notNull(),
  optionAEn: text("option_a_en").notNull(),
  optionANe: text("option_a_ne").notNull(),
  optionBEn: text("option_b_en").notNull(),
  optionBNe: text("option_b_ne").notNull(),
  optionCEn: text("option_c_en").notNull(),
  optionCNe: text("option_c_ne").notNull(),
  optionDEn: text("option_d_en").notNull(),
  optionDNe: text("option_d_ne").notNull(),
  correctOption: text("correct_option").notNull(),
  explanationEn: text("explanation_en").notNull(),
  explanationNe: text("explanation_ne").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  commission: text("commission").notNull().default("Federal"),
  examLevel: text("exam_level")
    .notNull()
    .default("Fifth Level - General Administration"),
  isPreviousYear: boolean("is_previous_year").notNull().default(false),
  previousYearInfo: text("previous_year_info"),
  isImportant: boolean("is_important").notNull().default(false),
  isDailyChallenge: boolean("is_daily_challenge").notNull().default(false),
  createdByUserId: integer("created_by_user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const currentAffairs = pgTable("current_affairs", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleNe: text("title_ne").notNull(),
  summaryEn: text("summary_en").notNull(),
  summaryNe: text("summary_ne").notNull(),
  keyPointsEn: text("key_points_en").notNull(),
  keyPointsNe: text("key_points_ne").notNull(),
  category: text("category").notNull().default("National"),
  publishedDateBs: text("published_date_bs").notNull(),
  publishedDateAd: text("published_date_ad").notNull(),
  linkedQuestionId: integer("linked_question_id").references(
    () => questions.id,
    { onDelete: "set null" }
  ),
  isImportant: boolean("is_important").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userQuestionAttempts = pgTable("user_question_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  selectedOption: text("selected_option").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  mode: text("mode").notNull().default("practice"),
  examSessionId: integer("exam_session_id"),
  timeSpentSec: integer("time_spent_sec").notNull().default(18),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
});

export const userBookmarks = pgTable("user_bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  personalNote: text("personal_note").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mockExamSessions = pgTable("mock_exam_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  titleEn: text("title_en").notNull(),
  titleNe: text("title_ne").notNull(),
  commission: text("commission").notNull().default("Federal"),
  examType: text("exam_type").notNull().default("full_mock"),
  totalQuestions: integer("total_questions").notNull(),
  attemptedQuestions: integer("attempted_questions").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  wrongAnswers: integer("wrong_answers").notNull().default(0),
  negativeMarking: boolean("negative_marking").notNull().default(true),
  netScore: text("net_score").notNull().default("0.00"),
  accuracyPct: integer("accuracy_pct").notNull().default(0),
  durationMinutes: integer("duration_minutes").notNull().default(45),
  timeTakenSeconds: integer("time_taken_seconds").notNull().default(0),
  status: text("status").notNull().default("completed"),
  questionIdsJson: text("question_ids_json").notNull().default("[]"),
  answersJson: text("answers_json").notNull().default("{}") ,
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const studyProgress = pgTable("study_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  topicId: integer("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  lastQuestionId: integer("last_question_id"),
  questionsSolved: integer("questions_solved").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  masteryPct: integer("mastery_pct").notNull().default(0),
  lastStudiedAt: timestamp("last_studied_at").defaultNow().notNull(),
});
