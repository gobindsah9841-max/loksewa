export type NavSection =
  | "dashboard"
  | "syllabus"
  | "continue_learning"
  | "start_practice"
  | "mock_exam"
  | "previous_year"
  | "daily_challenge"
  | "current_affairs"
  | "important_questions"
  | "bookmarked_questions"
  | "incorrect_questions"
  | "my_performance"
  | "study_history"
  | "question_manager";

export interface PracticeSessionConfig {
  titleEn: string;
  titleNe: string;
  questionIds: number[];
  mode: string;
}
