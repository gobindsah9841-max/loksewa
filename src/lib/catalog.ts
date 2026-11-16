import chaptersJson from "@/data/chapters.json";
import geographyJson from "@/data/geography.json";
import readsJson from "@/data/reads.json";
import type { QuizSearch } from "@/lib/quiz-search";
import type { Rec } from "@/lib/progress";

type RawQ = {
  id: string;
  label?: string;
  stem: string;
  options: string[];
  answer: number;
  explanation: string;
  batch?: number;
};

type RawChapter = {
  num: number;
  title: string;
  nep: string;
  slug: string;
  topics: { id: string; title: string; questions: RawQ[] }[];
};

export type Question = {
  key: string;
  id: string;
  stem: string;
  html: boolean;
  options: string[];
  answer: number;
  explanation: string;
  label: string;
  topic: string;
  chapter: number | null;
  batch: number | null;
  source: string;
};

export type Topic = { id: string; title: string; questions: Question[] };

export type Chapter = {
  num: number;
  title: string;
  nep: string;
  slug: string;
  topics: Topic[];
  questions: Question[];
};

export type ReadMeta = {
  slug: string;
  title: string;
  nep: string;
  kind: string;
  ch: number;
  file: string;
};

const rawChapters = (chaptersJson as { built: string; version: string; chapters: RawChapter[] }).chapters;

export const bookBuilt = (chaptersJson as { built: string }).built;
export const bookVersion = (chaptersJson as { version: string }).version;

function toQuestion(source: string, chapter: number | null, topic: string, q: RawQ, html: boolean): Question {
  return {
    key: `${source}:${q.id}`,
    id: q.id,
    stem: q.stem,
    html,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
    label: q.label ?? "",
    topic,
    chapter,
    batch: q.batch ?? null,
    source,
  };
}

export const chapters: Chapter[] = rawChapters.map((ch) => {
  const topics: Topic[] = ch.topics.map((t) => {
    const title = t.id === "T" ? t.title : `${t.id}  ${t.title}`;
    return {
      id: t.id,
      title,
      questions: t.questions.map((q) => toQuestion(ch.title, ch.num, title, q, true)),
    };
  });
  return {
    num: ch.num,
    title: ch.title,
    nep: ch.nep,
    slug: ch.slug,
    topics,
    questions: topics.flatMap((t) => t.questions),
  };
});

const geoRaw = geographyJson as { questions: RawQ[] };

export const geographyQuestions: Question[] = geoRaw.questions.map((q) =>
  toQuestion("Geography Master", null, `Batch ${q.batch ?? ""}`, { ...q }, false),
);

export const reads = readsJson as ReadMeta[];

export const bookQuestionCount = chapters.reduce((n, c) => n + c.questions.length, 0);
export const totalQuestionCount = bookQuestionCount + geographyQuestions.length;

export function chapterByNum(num: number): Chapter | undefined {
  return chapters.find((c) => c.num === num);
}

export function readBySlug(slug: string): ReadMeta | undefined {
  return reads.find((r) => r.slug === slug);
}

export function geoBatchCounts(): { batch: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const q of geographyQuestions) {
    if (q.batch == null) continue;
    counts.set(q.batch, (counts.get(q.batch) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([batch, count]) => ({ batch, count }));
}

export function plain(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/"/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function shuffle<T>(list: T[]): T[] {
  const next = list.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = next[i];
    next[i] = next[j]!;
    next[j] = swap!;
  }
  return next;
}

export function collectQuestions(
  search: QuizSearch,
  records: Record<string, Rec>,
): { title: string; questions: Question[] } | { error: string } {
  let questions: Question[] = [];
  let title = "Practice";

  if (search.bank === "geo") {
    title = "Geography Master";
    questions = geographyQuestions;
    if (search.batch) {
      const batch = Number(search.batch);
      questions = questions.filter((q) => q.batch === batch);
      title = `Geography · batch ${batch}`;
    }
  } else if (search.bank === "mix") {
    title = "Mixed test";
    const ids = new Set(search.chs.split(",").filter(Boolean));
    if (ids.has("geo")) questions = questions.concat(geographyQuestions);
    for (const chapter of chapters) {
      if (ids.has(String(chapter.num))) questions = questions.concat(chapter.questions);
    }
    if (!ids.size) return { error: "Choose at least one chapter." };
  } else {
    const chapter = chapterByNum(Number(search.bank));
    if (!chapter) return { error: "That set is not in the book." };
    title = chapter.title;
    questions = chapter.questions;
    if (search.topic) {
      const topic = chapter.topics.find((t) => t.id === search.topic);
      if (!topic) return { error: "That topic is not in this chapter." };
      questions = topic.questions;
      title = topic.title;
    }
  }

  if (search.only === "wrong") {
    questions = questions.filter((q) => {
      const rec = records[q.key];
      return !!rec && rec.tries > 0 && !rec.lastCorrect;
    });
    title += " · missed";
    if (!questions.length) return { error: "No missed questions in this set yet." };
  } else if (search.only === "saved") {
    questions = questions.filter((q) => records[q.key]?.saved);
    title += " · saved";
    if (!questions.length) return { error: "No saved questions yet. Bookmark one while you practice." };
  }

  if (!questions.length) return { error: "This set has no questions." };
  return { title, questions };
}

export function searchQuestions(query: string): Question[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];
  const all = chapters.flatMap((c) => c.questions).concat(geographyQuestions);
  const hits: Question[] = [];
  for (const q of all) {
    const hay = `${plain(q.stem)} ${q.options.join(" ")} ${q.source}`.toLowerCase();
    if (hay.includes(needle)) hits.push(q);
    if (hits.length === 15) break;
  }
  return hits;
}
