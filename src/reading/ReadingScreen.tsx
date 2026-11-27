import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPassage, submitAnswers } from "./api";
import type { GradeResult, PublicPassage, PublicQuestion } from "./types";

// Сейчас в тесте один пассаж. Когда подключим три, таймер переедет на уровень теста.
const TOTAL_SECONDS = 60 * 60;
const LAST_ID_KEY = "reading:lastPassageId:1";
const BLANK = "________";

const readLastId = (): string | undefined => {
  try {
    return localStorage.getItem(LAST_ID_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

const saveLastId = (id: string): void => {
  try {
    localStorage.setItem(LAST_ID_KEY, id);
  } catch {
    /* хранилище недоступно — не страшно */
  }
};

const formatTime = (seconds: number): string =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

type Group = { type: PublicQuestion["type"]; items: PublicQuestion[] };

function groupByType(questions: PublicQuestion[]): Group[] {
  const groups: Group[] = [];
  for (const q of questions) {
    const last = groups[groups.length - 1];
    if (last && last.type === q.type) last.items.push(q);
    else groups.push({ type: q.type, items: [q] });
  }
  return groups;
}

function instructionFor(group: Group): string {
  const first = group.items[0];
  if (first.type === "tfng") {
    return "Do the following statements agree with the information given in the passage? Choose TRUE if the statement agrees, FALSE if it contradicts, NOT GIVEN if there is no information on this.";
  }
  return `Complete the sentences. Write NO MORE THAN ${first.maxWords} WORDS for each answer.`;
}

type RowProps = {
  question: PublicQuestion;
  value: string;
  disabled: boolean;
  verdict: boolean | undefined;
  onChange: (value: string) => void;
};

function QuestionRow({ question, value, disabled, verdict, onChange }: RowProps) {
  const border =
    verdict === undefined
      ? "border-neutral-200 dark:border-neutral-800"
      : verdict
        ? "border-emerald-500 dark:border-emerald-400"
        : "border-red-500 dark:border-red-400";

  return (
    <li className={`border-l-4 ${border} rounded-r bg-white py-3 pl-4 pr-3 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100`}>
      <div className="flex gap-3">
        <span className="w-6 shrink-0 font-semibold">{question.number}</span>
        <div className="flex-1">
          {question.type === "tfng" ? (
            <fieldset disabled={disabled}>
              <legend className="mb-2">{question.prompt}</legend>
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {question.options.map((option) => (
                  <label key={option} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name={`q${question.number}`}
                      value={option}
                      checked={value === option}
                      onChange={() => onChange(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : (
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : (
            <CompletionPrompt question={question} value={value} disabled={disabled} onChange={onChange} />
          )}
          {verdict !== undefined && (
            <p className={`mt-2 text-sm font-medium ${verdict ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}
              {verdict ? "Верно" : "Неверно"}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

function CompletionPrompt({
  question,
  value,
  disabled,
  onChange,
}: {
  question: Extract<PublicQuestion, { type: "completion" }>;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const [before, after] = question.prompt.split(BLANK);
  const input = (
    <input
      type="text"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      aria-label={`Answer for question ${question.number}`}
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      className="mx-1 w-44 border-b-2 border-neutral-400 bg-transparent px-1 focus:border-neutral-900 focus:outline-none dark:border-neutral-600 dark:focus:border-neutral-100"
    />
  );
  if (after === undefined) {
    return (
      <div>
        <p className="mb-2">{question.prompt}</p>
        {input}
      </div>
    );
  }
  return (
    <p>
      {before}
      {input}
      {after}
    </p>
  );
}

export default function ReadingScreen() {
  const [passage, setPassage] = useState<PublicPassage | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoSubmitted = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAnswers({});
    autoSubmitted.current = false;
    try {
      const next = await fetchPassage(readLastId());
      setPassage(next);
      saveLastId(next.id);
      setSecondsLeft(TOTAL_SECONDS);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить текст.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = useCallback(async () => {
    if (!passage || result || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      setResult(await submitAnswers(passage.id, answers));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось проверить ответы.");
    } finally {
      setSubmitting(false);
    }
  }, [passage, result, submitting, answers]);

  // Таймер
  useEffect(() => {
    if (!passage || result) return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [passage, result]);

  // Автоотправка по истечении времени (один раз)
  useEffect(() => {
    if (secondsLeft === 0 && passage && !result && !autoSubmitted.current) {
      autoSubmitted.current = true;
      void handleSubmit();
    }
  }, [secondsLeft, passage, result, handleSubmit]);

  if (loading) {
    return <p className="p-6" role="status">Загружаем текст…</p>;
  }

  if (!passage) {
    return (
      <div className="p-6" role="alert">
        <p className="mb-3">{error ?? "Текст недоступен."}</p>
        <button type="button" onClick={() => void load()} className="rounded bg-neutral-900 px-4 py-2 text-white">
          Попробовать снова
        </button>
      </div>
    );
  }

  const verdicts = new Map(result?.perQuestion.map((r) => [r.number, r.correct]));
  const answeredCount = passage.questions.filter((q) => (answers[q.number] ?? "").trim() !== "").length;
  const done = result !== null;

  return (
    <div className="mx-auto max-w-7xl p-4">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div>
          <h1 className="text-xl font-semibold">Reading Passage 1</h1>
          <p className="text-sm text-neutral-600">
            Отвечено {answeredCount} из {passage.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`font-mono text-lg tabular-nums ${secondsLeft <= 300 && !done ? "text-red-700" : ""}`}
            aria-label="Оставшееся время"
          >
            {formatTime(secondsLeft)}
          </span>
          {done ? (
            <button type="button" onClick={() => void load()} className="rounded bg-neutral-900 px-4 py-2 text-white">
              Другой текст
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="rounded bg-neutral-900 px-4 py-2 text-white disabled:opacity-50"
            >
              {submitting ? "Проверяем…" : "Сдать ответы"}
            </button>
          )}
        </div>
      </header>

      {result && (
        <p className="mb-4 rounded bg-neutral-100 p-3 text-lg font-medium" role="status">
          Результат: {result.correct} из {result.total}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-red-800" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-3">
          <h2 className="mb-3 text-lg font-semibold">{passage.title}</h2>
          <div className="space-y-4 leading-relaxed">
            {passage.paragraphs.map((p) => (
              <p key={p.label}>
                <span className="mr-2 font-semibold">{p.label}</span>
                {p.text}
              </p>
            ))}
          </div>
        </article>

        <section className="lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-3">
          {groupByType(passage.questions).map((group) => {
            const first = group.items[0].number;
            const last = group.items[group.items.length - 1].number;
            return (
              <div key={first} className="mb-6">
                <h3 className="font-semibold">
                  Questions {first}–{last}
                </h3>
                <p className="mb-3 text-sm text-neutral-700">{instructionFor(group)}</p>
                <ul className="space-y-2">
                  {group.items.map((q) => (
                    <QuestionRow
                      key={q.number}
                      question={q}
                      value={answers[q.number] ?? ""}
                      disabled={done || submitting}
                      verdict={verdicts.get(q.number)}
                      onChange={(value) => setAnswers((prev) => ({ ...prev, [q.number]: value }))}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
