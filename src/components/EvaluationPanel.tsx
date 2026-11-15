import { useEffect, useState } from 'react';
import { ArrowRight, Check, Copy, AlertCircle, BookOpenCheck, Loader2 } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { EvaluationResult, TaskType } from '../types/ielts';

const LOADING_STATUSES = [
  'Изучаем структуру и логику ответа...',
  'Проверяем академическую лексику и грамматику...',
  'Экзаменатор выставляет баллы по 4 критериям IELTS...',
  'Генерируем идеальный вариант на Band 8.5...',
] as const;

function EvaluationLoader() {
  const [statusIndex, setStatusIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 2500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      id="evaluation-section"
      aria-live="polite"
      aria-busy="true"
      className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7 space-y-6"
    >
      {/* Active Examiner Progress Header */}
      <div className="space-y-4 pb-6 border-b border-white/[0.07]">
        <div className="flex items-start gap-4">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Идет проверка работы</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular text-zinc-300">
                Этап {statusIndex + 1} из {LOADING_STATUSES.length}
              </span>
            </div>

            <div className="min-h-[28px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusIndex}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm sm:text-base font-medium text-zinc-100"
                >
                  {LOADING_STATUSES[statusIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 4-Step Hairline Progress Indicator */}
        <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
          {LOADING_STATUSES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-colors duration-300 ${
                idx <= statusIndex ? 'bg-blue-500' : 'bg-white/[0.07]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Structural Skeleton Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {[
          'Task Response',
          'Coherence & Cohesion',
          'Lexical Resource',
          'Grammatical Range',
        ].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.06] bg-[#09090B]/60 p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-500">{label}</span>
              <div className="h-4 w-9 rounded bg-white/[0.07] animate-pulse" />
            </div>
            <div className="h-1 w-full rounded-full bg-white/[0.05]" />
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded bg-white/[0.05] animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-white/[0.04] animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-1">
        <div className="h-4 w-48 rounded bg-white/[0.07] animate-pulse" />
        <div className="h-20 w-full rounded-xl bg-white/[0.04] animate-pulse" />
      </div>
    </section>
  );
}

interface EvaluationPanelProps {
  taskType: TaskType;
  wordCount: number;
  isLoading: boolean;
  error: string | null;
  result: EvaluationResult | null;
  resultsByTask: Record<TaskType, EvaluationResult | null>;
  onSelectTask: (task: TaskType) => void;
  onClearResults: () => void;
}

function getBandTone(band: number): { bar: string; text: string; label: string } {
  if (band >= 7.5) {
    return { bar: 'bg-emerald-500', text: 'text-emerald-400', label: 'Высокий уровень' };
  }
  if (band >= 6.0) {
    return { bar: 'bg-blue-500', text: 'text-blue-400', label: 'Рабочий уровень' };
  }
  return { bar: 'bg-amber-500', text: 'text-amber-400', label: 'Требует доработки' };
}

function formatBand(band: number): string {
  return Number.isInteger(band) ? `${band}.0` : band.toFixed(1);
}

function calculateOverallWritingBand(task1Band: number, task2Band: number): number {
  const weightedAverage = (task1Band + 2 * task2Band) / 3;
  return Math.round(weightedAverage * 2 + 1e-9) / 2;
}

function getCefrFromBand(band: number): string {
  if (band >= 8.5) return 'C2';
  if (band >= 7.0) return 'C1';
  if (band >= 5.5) return 'B2';
  if (band >= 4.0) return 'B1';
  return 'A2';
}

export function EvaluationPanel({
  taskType,
  wordCount,
  isLoading,
  error,
  result,
  resultsByTask,
  onSelectTask,
  onClearResults,
}: EvaluationPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyImproved = async () => {
    if (!result?.rewrittenEssay) return;
    try {
      await navigator.clipboard.writeText(result.rewrittenEssay);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = result.rewrittenEssay;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return <EvaluationLoader />;
  }

  if (error) {
    return (
      <section
        id="evaluation-section"
        role="alert"
        className="rounded-2xl border border-red-500/30 bg-[#111114] p-6 sm:p-7"
      >
        <div className="flex items-start gap-3.5">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-zinc-100">Не удалось завершить проверку</h2>
            <p className="text-sm leading-relaxed text-zinc-300">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!result) {
    const firstCriterion = taskType === 'task1' ? 'Task Achievement' : 'Task Response';
    const minWords = taskType === 'task1' ? 150 : 250;
    const otherTaskKey: TaskType = taskType === 'task1' ? 'task2' : 'task1';
    const otherTaskResult = resultsByTask[otherTaskKey];

    return (
      <section
        id="evaluation-section"
        className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center gap-2.5 text-zinc-400 text-xs">
            <BookOpenCheck className="h-4 w-4 text-blue-400" />
            <span>Оценка экзаменатора IELTS</span>
            <span aria-hidden="true">·</span>
            <span>Band 0.0–9.0</span>
          </div>

          <h2 className="mt-3 text-xl font-semibold tracking-tight text-zinc-100">
            Разбор появится здесь после проверки
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Напишите ответ не короче {minWords} слов и нажмите «Проверить эссе». Система проведет строгий аудит по
            официальным критериям IELTS и перепишет текст на уровень Band 8.5 с сохранением ваших аргументов.
          </p>

          {otherTaskResult && (
            <p className="mt-3 text-xs text-blue-400">
              Оценка {otherTaskKey === 'task1' ? 'Task 1' : 'Task 2'} ({formatBand(otherTaskResult.overallBand)})
              сохранена · после проверки {taskType === 'task1' ? 'Task 1' : 'Task 2'} рассчитается общий Overall Writing
              Band.
            </p>
          )}

          <div className="mt-7 divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
            {[
              {
                title: firstCriterion,
                desc:
                  taskType === 'task1'
                    ? 'Наличие четкого Overview, отбор ключевых трендов и точность приведенных данных.'
                    : 'Полнота ответа на все части вопроса, ясная позиция и глубина аргументации.',
              },
              {
                title: 'Coherence & Cohesion',
                desc: 'Логика деления на абзацы, естественность связок и отсутствие шаблонных клише.',
              },
              {
                title: 'Lexical Resource',
                desc: 'Академические коллокации, точность словоупотребления и отсутствие повторов.',
              },
              {
                title: 'Grammatical Range & Accuracy',
                desc: 'Баланс сложных и простых структур, пунктуация, артикли и согласование времен.',
              },
            ].map((item) => (
              <div key={item.title} className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <div className="sm:w-56 shrink-0 text-sm font-medium text-zinc-200">{item.title}</div>
                <div className="text-xs leading-relaxed text-zinc-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-xs text-zinc-500 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>Формат разбора ошибок:</span>
          <span className="text-zinc-300">Было → Как лучше на Band 8.5</span>
          <span aria-hidden="true">·</span>
          <span>Полный переписанный текст с копированием в один клик</span>
        </div>
      </section>
    );
  }

  const overallTone = getBandTone(result.overallBand);
  const rewrittenWords = result.rewrittenEssay
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const task1Result = resultsByTask.task1;
  const task2Result = resultsByTask.task2;
  const hasBothEvaluated = Boolean(task1Result && task2Result);
  const combinedOverall =
    task1Result && task2Result
      ? calculateOverallWritingBand(task1Result.overallBand, task2Result.overallBand)
      : null;
  const combinedTone = combinedOverall !== null ? getBandTone(combinedOverall) : null;
  const otherTask: TaskType = taskType === 'task1' ? 'task2' : 'task1';

  return (
    <section id="evaluation-section" aria-live="polite" className="space-y-6">
      {/* Combined Overall Writing Score (shown once both Task 1 and Task 2 are evaluated) */}
      {hasBothEvaluated && combinedOverall !== null && combinedTone && task1Result && task2Result && (
        <div className="rounded-2xl border border-blue-500/25 bg-[#111114] p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="font-medium text-blue-400">Итог IELTS Writing</span>
                <span aria-hidden="true">·</span>
                <span>CEFR {getCefrFromBand(combinedOverall)}</span>
                <span aria-hidden="true">·</span>
                <span>Оба задания проверены</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-100">
                Overall Writing Band
              </h2>
              <p className="text-xs text-zinc-400">
                Рассчитано по официальной формуле IELTS: Task 1 (1/3) + Task 2 (2/3)
              </p>
            </div>

            <div className="shrink-0 flex sm:flex-col items-baseline sm:items-end justify-between gap-2 rounded-xl border border-white/[0.08] bg-[#09090B] px-5 py-3.5">
              <span className="text-[11px] font-medium text-zinc-400">Overall</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`font-mono-tabular text-4xl font-semibold tracking-tight ${combinedTone.text}`}>
                  {formatBand(combinedOverall)}
                </span>
                <span className="text-xs text-zinc-500 font-mono-tabular">/ 9.0</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-white/[0.07] rounded-xl border border-white/[0.07] bg-[#09090B]/70 overflow-hidden">
            {(
              [
                { key: 'task1' as const, label: 'Task 1 · Отчет (33%)', res: task1Result },
                { key: 'task2' as const, label: 'Task 2 · Эссе (67%)', res: task2Result },
              ] as const
            ).map((item) => {
              const isActive = taskType === item.key;
              const itemTone = getBandTone(item.res.overallBand);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onSelectTask(item.key)}
                  className={`px-4 py-3 text-left transition-colors cursor-pointer ${
                    isActive ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="text-[11px] text-zinc-400 flex items-center justify-between gap-2">
                    <span className="truncate">{item.label}</span>
                    {isActive && <span className="text-blue-400 shrink-0">Открыто</span>}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className={`font-mono-tabular text-xl font-semibold ${itemTone.text}`}>
                      {formatBand(item.res.overallBand)}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono-tabular">CEFR {item.res.cefrLevel}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClearResults}
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300 cursor-pointer"
            >
              Сбросить обе оценки
            </button>
          </div>
        </div>
      )}

      {/* 1. Individual Task Band Score Hero Panel */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-white/[0.07]">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span>{taskType === 'task1' ? 'Task 1 Report' : 'Task 2 Essay'}</span>
              <span aria-hidden="true">·</span>
              <span>CEFR {result.cefrLevel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">{wordCount} слов в оригинале</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
              Заключение экзаменатора ({taskType === 'task1' ? 'Task 1' : 'Task 2'})
            </h2>
            <p className="text-sm leading-relaxed text-zinc-300">{result.examinerSummary}</p>

            {!hasBothEvaluated && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onSelectTask(otherTask)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300 cursor-pointer"
                >
                  <span>
                    Оцените также {otherTask === 'task1' ? 'Task 1' : 'Task 2'}, чтобы получить общий Overall за весь
                    Writing
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="sm:text-right shrink-0 flex sm:flex-col items-baseline sm:items-end justify-between gap-2 rounded-xl border border-white/[0.08] bg-[#09090B] px-5 py-4">
            <span className="text-xs font-medium text-zinc-400">
              {taskType === 'task1' ? 'Task 1 Band' : 'Task 2 Band'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`font-mono-tabular text-4xl sm:text-5xl font-semibold tracking-tight ${overallTone.text}`}>
                {formatBand(result.overallBand)}
              </span>
              <span className="text-xs text-zinc-500 font-mono-tabular">/ 9.0</span>
            </div>
            <span className="hidden sm:inline text-xs text-zinc-400">{overallTone.label}</span>
          </div>
        </div>

        {/* 2. Four Official Criteria Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.criteria.map((criterion) => {
            const tone = getBandTone(criterion.band);
            const percentage = Math.min(100, Math.max(0, (criterion.band / 9) * 100));
            return (
              <div
                key={criterion.name}
                className="rounded-xl border border-white/[0.07] bg-[#09090B]/70 p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-medium text-zinc-100">{criterion.name}</h3>
                    <span className={`font-mono-tabular text-base font-semibold ${tone.text}`}>
                      {formatBand(criterion.band)}
                    </span>
                  </div>
                  <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className={`h-full rounded-full ${tone.bar} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-zinc-300">{criterion.feedback}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Grammar & Lexical Corrections List ("Было -> Как лучше на Band 8.5") */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-white/[0.07]">
          <h3 className="text-base sm:text-lg font-semibold text-zinc-100">
            Разбор ошибок и точек роста
          </h3>
          <span className="text-xs text-zinc-400 font-mono-tabular">
            {result.corrections.length} исправлений · Было → Band 8.5
          </span>
        </div>

        {result.corrections.length === 0 ? (
          <p className="pt-4 text-sm text-zinc-400">
            Критичных грамматических или лексических ошибок не обнаружено.
          </p>
        ) : (
          <ul className="divide-y divide-white/[0.07]">
            {result.corrections.map((item, idx) => (
              <li key={`${item.category}-${idx}`} className="py-4 first:pt-4 last:pb-1 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="font-mono-tabular text-zinc-500">0{idx + 1}.</span>
                  <span className="text-zinc-300 font-medium">{item.category}</span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm leading-relaxed">
                  <div className="rounded-lg bg-red-500/[0.07] border border-red-500/20 px-3.5 py-2.5 text-zinc-200">
                    <span className="block text-[11px] font-medium text-red-400 mb-1">Было</span>
                    <span className="line-through decoration-red-400/60 text-zinc-300">{item.original}</span>
                  </div>

                  <div className="flex items-center gap-2 pl-1 text-zinc-500" aria-hidden="true">
                    <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-[11px] text-zinc-400">Как лучше на Band 8.5</span>
                  </div>

                  <div className="rounded-lg bg-emerald-500/[0.07] border border-emerald-500/20 px-3.5 py-2.5 text-zinc-100">
                    {item.improved}
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-zinc-400">{item.explanation}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 4. Rewritten Essay on Band 8.5 + Copy Button */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-100">
              Переписанный вариант на уровень Band 8.5
            </h3>
            <p className="mt-0.5 text-xs text-zinc-400">
              Ваши исходные аргументы сохранены ·{' '}
              <span className="font-mono-tabular text-zinc-300">{rewrittenWords} слов</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyImproved}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-100 transition-colors hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Скопировано</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-zinc-300" />
                <span>Скопировать улучшенный текст</span>
              </>
            )}
          </button>
        </div>

        {result.rewriteHighlights && result.rewriteHighlights.length > 0 && (
          <div className="mt-4 pb-4 border-b border-white/[0.06] space-y-1.5">
            <div className="text-xs font-medium text-zinc-400">Что усилено в редакции Band 8.5:</div>
            <ul className="space-y-1 text-xs text-zinc-300">
              {result.rewriteHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5" aria-hidden="true">
                    ·
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-zinc-200 max-w-[70ch]">
          {result.rewrittenEssay
            .split(/\n{2,}/)
            .map((para) => para.trim())
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
      </div>
    </section>
  );
}
