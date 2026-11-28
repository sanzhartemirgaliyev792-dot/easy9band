import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { VARIANT_1 } from './variant1';
import type { Group, Question } from './types';

const variant = VARIANT_1;
const STORAGE_KEY = `mock_reading_${variant.id}`;
const DURATION_SEC = variant.durationMinutes * 60;

interface Saved {
  endsAt: number | null;
  answers: Record<number, string>;
  submitted: boolean;
}

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Saved;
  } catch {
    // ignore
  }
  return { endsAt: null, answers: {}, submitted: false };
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[“”″]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, '')
    .trim();

const isCorrect = (q: Question, a?: string) => !!a && q.answer.some((x) => norm(x) === norm(a));

// Academic Reading: raw score -> band (приблизительная шкала)
const BAND_TABLE: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6],
  [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5],
];
const toBand = (raw: number) => BAND_TABLE.find(([min]) => raw >= min)?.[1] ?? 2;
const fmtBand = (b: number) => (Number.isInteger(b) ? `${b}.0` : b.toFixed(1));

const fmtTime = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

const ALL_QUESTIONS: Question[] = variant.parts.flatMap((p) => p.groups.flatMap((g) => g.questions));

export function MockReading({ onExit }: { onExit: () => void }) {
  const [saved] = useState<Saved>(loadSaved);
  const [endsAt, setEndsAt] = useState<number | null>(saved.endsAt);
  const [answers, setAnswers] = useState<Record<number, string>>(saved.answers);
  const [submitted, setSubmitted] = useState(saved.submitted);
  const [partIdx, setPartIdx] = useState(0);
  const [now, setNow] = useState(Date.now());

  // сохраняем всё при каждом изменении
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ endsAt, answers, submitted }));
    } catch {
      // ignore
    }
  }, [endsAt, answers, submitted]);

  // тик таймера
  useEffect(() => {
    if (!endsAt || submitted) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [endsAt, submitted]);

  // автосдача по окончании времени
  useEffect(() => {
    if (endsAt && !submitted && now >= endsAt) setSubmitted(true);
  }, [now, endsAt, submitted]);

  const secondsLeft = endsAt ? Math.max(0, Math.floor((endsAt - now) / 1000)) : DURATION_SEC;
  const answeredCount = ALL_QUESTIONS.filter((q) => answers[q.n]?.trim()).length;

  const setAnswer = (n: number, v: string) => setAnswers((p) => ({ ...p, [n]: v }));

  const start = () => {
    const t = Date.now();
    setNow(t);
    setEndsAt(t + DURATION_SEC * 1000);
  };

  const handleSubmit = () => {
    const left = ALL_QUESTIONS.length - answeredCount;
    const msg = left > 0 ? `Без ответа осталось вопросов: ${left}. Сдать работу?` : 'Сдать работу?';
    if (window.confirm(msg)) setSubmitted(true);
  };

  const restart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setAnswers({});
    setEndsAt(null);
    setSubmitted(false);
    setPartIdx(0);
  };

  const jumpTo = (n: number) => {
    const idx = variant.parts.findIndex((p) => p.groups.some((g) => g.questions.some((q) => q.n === n)));
    if (idx >= 0) setPartIdx(idx);
    window.setTimeout(
      () => document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      60,
    );
  };

  const result = useMemo(() => {
    const score = ALL_QUESTIONS.filter((q) => isCorrect(q, answers[q.n])).length;
    return { score, band: toBand(score) };
  }, [answers]);

  const shell = 'min-h-screen bg-white text-black dark:bg-[#09090B] dark:text-[#F4F4F5]';
  const card = 'rounded-2xl border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#111114]';

  /* ---------- Стартовый экран ---------- */
  if (!endsAt && !submitted) {
    return (
      <div className={`${shell} flex items-center justify-center p-6`}>
        <div className={`${card} max-w-lg w-full p-8 space-y-5`}>
          <h1 className="font-display text-2xl font-semibold">{variant.title}</h1>
          <ul className="space-y-1.5 text-sm text-neutral-700 dark:text-zinc-400">
            <li>• 3 текста, 40 вопросов</li>
            <li>• {variant.durationMinutes} минут на всё, как на реальном экзамене</li>
            <li>• Ответы сохраняются автоматически, при перезагрузке страницы таймер не сбрасывается</li>
            <li>• По окончании времени работа сдаётся сама</li>
          </ul>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={start}
              className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-500 cursor-pointer"
            >
              Начать тест
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-xl border border-neutral-300 dark:border-white/[0.1] px-5 py-3 text-sm cursor-pointer"
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Результаты ---------- */
  if (submitted) {
    return (
      <div className={`${shell} p-4 sm:p-8`}>
        <div className="mx-auto max-w-3xl space-y-6">
          <div className={`${card} p-8 text-center space-y-2`}>
            <p className="text-sm text-neutral-600 dark:text-zinc-400">{variant.title}</p>
            <p className="font-display text-5xl font-semibold">
              {result.score}
              <span className="text-2xl text-neutral-500"> / {ALL_QUESTIONS.length}</span>
            </p>
            <p className="text-lg">
              Примерный Band: <span className="font-semibold text-blue-600 dark:text-blue-400">{fmtBand(result.band)}</span>
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={restart}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 cursor-pointer"
              >
                Пройти заново
              </button>
              <button
                type="button"
                onClick={onExit}
                className="rounded-xl border border-neutral-300 dark:border-white/[0.1] px-5 py-2.5 text-sm cursor-pointer"
              >
                В меню
              </button>
            </div>
          </div>

          <div className={`${card} overflow-hidden`}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/[0.07] text-neutral-600 dark:text-zinc-400">
                  <th className="px-4 py-3 font-medium">№</th>
                  <th className="px-4 py-3 font-medium">Ваш ответ</th>
                  <th className="px-4 py-3 font-medium">Правильно</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-white/[0.05]">
                {ALL_QUESTIONS.map((q) => {
                  const ok = isCorrect(q, answers[q.n]);
                  return (
                    <tr key={q.n}>
                      <td className="px-4 py-2.5 font-mono-tabular">{q.n}</td>
                      <td className="px-4 py-2.5">{answers[q.n]?.trim() || <span className="text-neutral-400">—</span>}</td>
                      <td className="px-4 py-2.5">{q.answer[0]}</td>
                      <td className="px-4 py-2.5">
                        {ok ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Сам тест ---------- */
  const part = variant.parts[partIdx];
  const timerLow = secondsLeft <= 300;

  const renderQuestion = (g: Group, q: Question) => {
    const value = answers[q.n] ?? '';
    const options = g.input === 'mcq' ? g.mcqOptions?.[q.n] ?? [] : g.options ?? [];
    return (
      <div key={q.n} id={`q-${q.n}`} className="flex gap-3">
        <span className="font-mono-tabular text-sm font-semibold w-7 shrink-0 pt-0.5">{q.n}</span>
        <div className="flex-1 space-y-2">
          <p className="text-sm leading-relaxed">{q.text}</p>

          {g.input === 'text' && (
            <input
              type="text"
              value={value}
              onChange={(e) => setAnswer(q.n, e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="w-full max-w-xs rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-white/[0.1] dark:bg-[#09090B] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          )}

          {g.input === 'tfng' && (
            <div className="flex flex-wrap gap-2">
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setAnswer(q.n, value === o.value ? '' : o.value)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer ${
                    value === o.value
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-neutral-300 dark:border-white/[0.1] hover:bg-neutral-100 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}

          {g.input === 'letter' && (
            <div className="flex flex-wrap gap-1.5">
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setAnswer(q.n, value === o.value ? '' : o.value)}
                  className={`h-8 w-8 rounded-lg border text-xs font-medium cursor-pointer ${
                    value === o.value
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-neutral-300 dark:border-white/[0.1] hover:bg-neutral-100 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}

          {g.input === 'mcq' && (
            <div className="space-y-1.5">
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setAnswer(q.n, value === o.value ? '' : o.value)}
                  className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-sm cursor-pointer ${
                    value === o.value
                      ? 'border-blue-600 bg-blue-600/10'
                      : 'border-neutral-300 dark:border-white/[0.1] hover:bg-neutral-100 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="font-semibold">{o.value}</span>
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${shell} flex h-screen flex-col`}>
      {/* Верхняя панель */}
      <header className="flex items-center justify-between gap-3 border-b border-neutral-200 dark:border-white/[0.07] px-4 py-3">
       <div className="w-16" aria-hidden="true" />

        <div
          className={`inline-flex items-center gap-2 font-mono-tabular text-lg font-semibold ${
            timerLow ? 'text-red-600 dark:text-red-400' : ''
          }`}
        >
          <Clock className="h-4 w-4" />
          {fmtTime(secondsLeft)}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 cursor-pointer"
        >
          Сдать ({answeredCount}/{ALL_QUESTIONS.length})
        </button>
      </header>

      {/* Вкладки частей */}
      <div className="flex gap-1 border-b border-neutral-200 dark:border-white/[0.07] px-4 py-2">
        {variant.parts.map((p, i) => {
          const qs = p.groups.flatMap((g) => g.questions);
          const done = qs.filter((q) => answers[q.n]?.trim()).length;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setPartIdx(i)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium cursor-pointer ${
                i === partIdx
                  ? 'bg-neutral-100 dark:bg-white/[0.1]'
                  : 'text-neutral-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-100'
              }`}
            >
              Part {i + 1}{' '}
              <span className="font-mono-tabular text-xs text-neutral-500">
                {done}/{qs.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Текст + вопросы */}
      <main className="grid flex-1 min-h-0 grid-cols-1 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">
        <section className="p-5 sm:p-8 lg:overflow-y-auto lg:border-r border-neutral-200 dark:border-white/[0.07]">
          <h2 className="font-display text-xl font-semibold mb-2">{part.passage.title}</h2>
          {part.passage.intro && (
            <p className="mb-4 text-sm italic text-neutral-600 dark:text-zinc-400">{part.passage.intro}</p>
          )}
          <div className="space-y-4 text-[15px] leading-[1.7]">
            {part.passage.paragraphs.map((p, i) => (
              <p key={i}>
                {p.label && <span className="mr-2 font-semibold">{p.label}</span>}
                {p.text}
              </p>
            ))}
          </div>
        </section>

        <section className="p-5 sm:p-8 space-y-8 lg:overflow-y-auto">
          {part.groups.map((g, gi) => (
            <div key={gi} className="space-y-4">
              <div>
                <h3 className="font-semibold">{g.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-zinc-400">{g.instruction}</p>
              </div>
              {g.box && (
                <div className="rounded-xl border border-neutral-200 dark:border-white/[0.08] bg-neutral-50 dark:bg-white/[0.03] p-3 text-sm space-y-1">
                  {g.box.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              )}
              <div className="space-y-5">{g.questions.map((q) => renderQuestion(g, q))}</div>
            </div>
          ))}
        </section>
      </main>

      {/* Навигатор по вопросам */}
      <footer className="border-t border-neutral-200 dark:border-white/[0.07] px-4 py-2.5 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {ALL_QUESTIONS.map((q) => (
            <button
              key={q.n}
              type="button"
              onClick={() => jumpTo(q.n)}
              className={`h-7 w-7 rounded-md text-xs font-mono-tabular cursor-pointer ${
                answers[q.n]?.trim()
                  ? 'bg-blue-600 text-white'
                  : 'border border-neutral-300 dark:border-white/[0.1] text-neutral-600 dark:text-zinc-400'
              }`}
            >
              {q.n}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
