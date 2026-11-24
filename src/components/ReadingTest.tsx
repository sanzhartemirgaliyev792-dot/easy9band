import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, Send } from 'lucide-react';
import { READING_PASSAGES } from '../data/reading';
import { READING_BANDS, bandFromRaw, isCorrect } from '../lib/scoring';
import { QuestionGroupView } from './QuestionGroupView';
import { ScoreSummary } from './ScoreSummary';

const DURATION_SECONDS = 60 * 60;

function formatTimer(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function ReadingTest() {
  const [passageIndex, setPassageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft === 0) setIsRunning(false);
  }, [secondsLeft]);

  const passage = READING_PASSAGES[passageIndex];

  const stats = useMemo(() => {
    const perPassage = READING_PASSAGES.map((p) => {
      let raw = 0;
      let total = 0;
      let answered = 0;
      for (const group of p.groups) {
        for (const question of group.questions) {
          total += 1;
          if ((answers[question.n] ?? '').trim()) answered += 1;
          if (isCorrect(group, question, answers[question.n])) raw += 1;
        }
      }
      return { label: p.title, raw, total, answered };
    });
    const raw = perPassage.reduce((sum, p) => sum + p.raw, 0);
    const total = perPassage.reduce((sum, p) => sum + p.total, 0);
    const answered = perPassage.reduce((sum, p) => sum + p.answered, 0);
    return { perPassage, raw, total, answered };
  }, [answers]);

  const handleChange = (n: number, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [n]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setIsRunning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setSecondsLeft(DURATION_SECONDS);
    setIsRunning(false);
    setPassageIndex(0);
  };

  const timerIsLow = secondsLeft > 0 && secondsLeft <= 300;

  return (
    <main className="mx-auto w-full max-w-[1380px] flex-1 space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-xl border border-white/[0.07] bg-white/[0.02] p-1">
          {READING_PASSAGES.map((p, index) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPassageIndex(index)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                index === passageIndex ? 'bg-white/[0.1] text-zinc-100' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Passage {index + 1}
              <span className="ml-2 font-mono-tabular text-xs text-zinc-500">
                {stats.perPassage[index].answered}/{stats.perPassage[index].total}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`font-mono-tabular text-xl ${timerIsLow ? 'text-red-400' : 'text-zinc-100'}`}
            aria-label="Оставшееся время"
          >
            {formatTimer(secondsLeft)}
          </span>
          <button
            type="button"
            onClick={() => setIsRunning((v) => !v)}
            disabled={submitted || secondsLeft === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? 'Пауза' : 'Старт'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Сброс
          </button>
          {!submitted && (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              Проверить ответы
            </button>
          )}
        </div>
      </div>

      {submitted && (
        <ScoreSummary
          title="Reading"
          raw={stats.raw}
          total={stats.total}
          band={bandFromRaw(stats.raw, READING_BANDS)}
          parts={stats.perPassage.map((p, index) => ({ label: `Passage ${index + 1}`, raw: p.raw, total: p.total }))}
        />
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Passage */}
        <article className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <h2 className="font-display text-xl font-semibold text-zinc-50">{passage.title}</h2>
          <div className="mt-4 space-y-4">
            {passage.paragraphs.map((paragraph, index) => (
              <div key={index} className="flex gap-3">
                {paragraph.label && (
                  <span className="w-5 shrink-0 pt-0.5 font-mono-tabular text-xs font-semibold text-blue-400">
                    {paragraph.label}
                  </span>
                )}
                <p className="text-[15px] leading-7 text-zinc-300">{paragraph.text}</p>
              </div>
            ))}
          </div>
        </article>

        {/* Questions */}
        <div className="space-y-4">
          {passage.groups.map((group) => (
            <QuestionGroupView
              key={group.questions[0].n}
              group={group}
              answers={answers}
              onChange={handleChange}
              submitted={submitted}
            />
          ))}
        </div>
      </div>

      <p className="text-xs leading-5 text-zinc-500">
        Тексты и вопросы написаны специально для тренировки. Факты и цифры в них упрощены или вымышлены, поэтому их
        нельзя использовать как справочную информацию.
      </p>
    </main>
  );
}
