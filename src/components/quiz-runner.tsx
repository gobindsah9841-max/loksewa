import { Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Question } from "@/lib/catalog";
import { plain, shuffle } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";

const LETTERS = ["A", "B", "C", "D"];

function clock(total: number): string {
  const s = Math.max(0, total);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

function marks(correct: number, wrong: number): number {
  return Math.round((2 * correct - 0.4 * wrong) * 10) / 10;
}

export function QuizRunner({
  title,
  mode,
  timed,
  questions,
}: {
  title: string;
  mode: "practice" | "exam";
  timed: boolean;
  questions: Question[];
}) {
  const record = useProgress((s) => s.record);
  const toggleSaved = useProgress((s) => s.toggleSaved);
  const addTest = useProgress((s) => s.addTest);
  const records = useProgress((s) => s.records);

  const [items, setItems] = useState(questions);
  const [picks, setPicks] = useState<number[]>(() => questions.map(() => -1));
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [warn, setWarn] = useState(false);
  const [left, setLeft] = useState(timed ? questions.length * 54 : 0);
  const [openReview, setOpenReview] = useState<number | null>(0);
  const picksRef = useRef(picks);
  const itemsRef = useRef(items);
  const recorded = useRef(false);
  picksRef.current = picks;
  itemsRef.current = items;

  useEffect(() => {
    if (!timed || done || mode !== "exam") return;
    const id = window.setInterval(() => {
      setLeft((value) => (value <= 0 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [timed, done, mode]);

  useEffect(() => {
    if (timed && mode === "exam" && !done && left === 0) finish();
    // finish reads refs; re-created each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, timed, mode, done]);

  function finish() {
    if (recorded.current) return;
    recorded.current = true;
    const current = picksRef.current;
    const list = itemsRef.current;
    let c = 0;
    let w = 0;
    let b = 0;
    current.forEach((pick, i) => {
      const q = list[i];
      if (!q) return;
      if (pick < 0) b += 1;
      else if (pick === q.answer) c += 1;
      else w += 1;
      if (mode === "exam" && pick >= 0) record(q.key, pick === q.answer);
    });
    if (mode === "exam") {
      addTest({
        at: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        title,
        n: list.length,
        c,
        w,
        b,
      });
    }
    setDone(true);
    setOpenReview(0);
  }

  function choose(option: number) {
    if (done) return;
    if (mode === "practice" && picks[index]! >= 0) return;
    const q = items[index];
    if (!q) return;
    setPicks((prev) => {
      const next = prev.slice();
      next[index] = option;
      picksRef.current = next;
      return next;
    });
    if (mode === "practice") record(q.key, option === q.answer);
  }

  function reset(nextItems: Question[]) {
    const blank = nextItems.map(() => -1);
    recorded.current = false;
    picksRef.current = blank;
    itemsRef.current = nextItems;
    setItems(nextItems);
    setPicks(blank);
    setIndex(0);
    setDone(false);
    setWarn(false);
    setLeft(timed ? nextItems.length * 54 : 0);
  }

  const question = items[index];
  const answered = picks.filter((p) => p >= 0).length;
  const rightSoFar = picks.reduce((n, p, i) => n + (p >= 0 && p === items[i]?.answer ? 1 : 0), 0);

  if (done) {
    let c = 0;
    let w = 0;
    let b = 0;
    picks.forEach((p, i) => {
      if (p < 0) b += 1;
      else if (p === items[i]?.answer) c += 1;
      else w += 1;
    });
    const score = marks(c, w);
    const missed = items.filter((q, i) => picks[i] !== q.answer);
    return (
      <div className="flex flex-col gap-4">
        <section className="rounded-2xl border border-line bg-card px-5 py-6 text-center">
          {mode === "exam" ? (
            <>
              <p className="font-display text-4xl text-fg">
                {score} <span className="text-xl text-muted">/ {items.length * 2}</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {c} right · {w} wrong · {b} blank. Right answers score 2. A wrong answer costs 0.4. A blank costs nothing.
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-4xl text-fg">
                {c} <span className="text-xl text-muted">of {items.length}</span>
              </p>
              <p className="mt-2 text-sm text-muted">right on the first try</p>
            </>
          )}
        </section>
        <div className="grid gap-2">
          <button
            type="button"
            className="min-h-12 rounded-xl bg-crimson font-semibold text-on-crimson"
            onClick={() => reset(shuffle(items))}
          >
            Try these again
          </button>
          <button
            type="button"
            disabled={!missed.length}
            className="min-h-12 rounded-xl border border-line bg-card font-semibold text-fg disabled:opacity-40"
            onClick={() => reset(missed)}
          >
            Only the ones missed ({missed.length})
          </button>
          <Link
            to="/"
            className="flex min-h-12 items-center justify-center rounded-xl border border-line font-semibold text-fg"
          >
            Back to the book
          </Link>
        </div>
        <h2 className="font-display text-xl">Review</h2>
        <ul className="flex flex-col gap-2">
          {items.map((q, i) => {
            const pick = picks[i] ?? -1;
            const ok = pick === q.answer;
            const blank = pick < 0;
            const open = openReview === i;
            return (
              <li key={q.key} className="overflow-hidden rounded-xl border border-line bg-card">
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-3 py-3 text-left"
                  onClick={() => setOpenReview(open ? null : i)}
                >
                  <span
                    className={
                      "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold " +
                      (blank ? "bg-surface text-muted" : ok ? "bg-ok-bg text-ok" : "bg-bad-bg text-bad")
                    }
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm leading-snug">{plain(q.stem)}</span>
                </button>
                {open ? <QuestionBody q={q} pick={pick} reveal locked onChoose={() => undefined} /> : null}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (!question) return null;
  const pick = picks[index] ?? -1;
  const saved = !!records[question.key]?.saved;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 text-sm text-muted">
        <span>
          {index + 1} of {items.length}
          {mode === "practice" ? ` · ${rightSoFar} right` : ` · ${answered} answered`}
        </span>
        {timed && mode === "exam" ? (
          <span className={left <= 60 ? "font-semibold text-bad" : "font-semibold text-gold"}>{clock(left)}</span>
        ) : null}
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full bg-crimson"
          style={{ width: `${((index + (pick >= 0 ? 1 : 0)) / items.length) * 100}%` }}
        />
      </div>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-gold">
          {question.source}
          {question.label ? ` · ${question.label}` : ""}
        </p>
        <button
          type="button"
          aria-label={saved ? "Remove bookmark" : "Bookmark question"}
          aria-pressed={saved}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line"
          onClick={() => toggleSaved(question.key)}
        >
          <Bookmark className={saved ? "size-5 fill-gold text-gold" : "size-5 text-muted"} />
        </button>
      </div>
      <QuestionBody
        q={question}
        pick={pick}
        reveal={mode === "practice" && pick >= 0}
        locked={mode === "practice" && pick >= 0}
        onChoose={choose}
      />
      {mode === "practice" ? (
        pick >= 0 ? (
          <button
            type="button"
            className="min-h-12 rounded-xl bg-crimson font-semibold text-on-crimson"
            onClick={() => {
              if (index + 1 >= items.length) finish();
              else setIndex(index + 1);
            }}
          >
            {index + 1 >= items.length ? "See the result" : "Next question"}
          </button>
        ) : null
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={index === 0}
              className="min-h-12 rounded-xl border border-line bg-card font-semibold disabled:opacity-40"
              onClick={() => setIndex(index - 1)}
            >
              Back
            </button>
            <button
              type="button"
              disabled={pick < 0}
              className="min-h-12 rounded-xl border border-line bg-card font-semibold disabled:opacity-40"
              onClick={() =>
                setPicks((prev) => {
                  const next = prev.slice();
                  next[index] = -1;
                  picksRef.current = next;
                  return next;
                })
              }
            >
              Clear
            </button>
            <button
              type="button"
              disabled={index + 1 >= items.length}
              className="min-h-12 rounded-xl border border-line bg-card font-semibold disabled:opacity-40"
              onClick={() => setIndex(index + 1)}
            >
              Next
            </button>
          </div>
          <div className="grid grid-cols-8 gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={
                  "h-9 rounded-md text-sm " +
                  (i === index
                    ? "bg-gold font-semibold text-on-gold"
                    : picks[i]! >= 0
                      ? "bg-surface text-fg"
                      : "border border-line text-muted")
                }
              >
                {i + 1}
              </button>
            ))}
          </div>
          {warn ? (
            <p className="rounded-xl bg-surface px-3 py-3 text-sm text-muted">
              {items.length - answered} still blank. A blank is safer than a guess. Tap finish again to submit.
            </p>
          ) : null}
          <button
            type="button"
            className="min-h-12 rounded-xl bg-crimson font-semibold text-on-crimson"
            onClick={() => {
              if (answered < items.length && !warn) {
                setWarn(true);
                return;
              }
              finish();
            }}
          >
            Finish the test
          </button>
        </>
      )}
      <p className="text-xs leading-relaxed text-muted">
        Practice questions for this book. They are not verified past-paper questions. Check changing figures before the examination.
      </p>
    </div>
  );
}

function QuestionBody({
  q,
  pick,
  reveal,
  locked,
  onChoose,
}: {
  q: Question;
  pick: number;
  reveal: boolean;
  locked: boolean;
  onChoose: (option: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {q.html ? (
        <div className="stem font-display text-xl leading-snug" dangerouslySetInnerHTML={{ __html: q.stem }} />
      ) : (
        <p className="font-display text-xl leading-snug">{q.stem}</p>
      )}
      <div className="grid gap-2">
        {q.options.map((option, i) => {
          const chosen = pick === i;
          const correct = reveal && i === q.answer;
          const wrong = reveal && chosen && i !== q.answer;
          return (
            <button
              key={i}
              type="button"
              disabled={locked}
              onClick={() => onChoose(i)}
              className={
                "flex min-h-12 items-start gap-3 rounded-xl border px-3 py-3 text-left " +
                (correct
                  ? "border-ok bg-ok-bg"
                  : wrong
                    ? "border-bad bg-bad-bg"
                    : chosen
                      ? "border-gold bg-card"
                      : "border-line bg-card")
              }
            >
              <span className="mt-0.5 font-semibold text-gold">{LETTERS[i]}</span>
              <span className="leading-snug">{option}</span>
            </button>
          );
        })}
      </div>
      {reveal ? (
        <div className={"rounded-xl px-4 py-3 text-sm leading-relaxed " + (pick === q.answer ? "bg-ok-bg" : "bg-bad-bg")}>
          <p className="font-semibold">Answer {LETTERS[q.answer]}</p>
          <p className="mt-1">{q.explanation}</p>
        </div>
      ) : null}
    </div>
  );
}
