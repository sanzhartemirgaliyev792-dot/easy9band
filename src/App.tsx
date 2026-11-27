import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Send,
  Shuffle,
  Trash2,
} from 'lucide-react';
import { IELTS_TOPICS_2026 } from './data/topics2026';
import type { EvaluationResult, IeltsTopic, TaskType } from './types/ielts';
import { RubricModal } from './components/RubricModal';
import { EvaluationPanel } from './components/EvaluationPanel';
import { ListeningTest } from './components/ListeningTest';
import ReadingScreen from './reading/ReadingScreen';

const DRAFT_STORAGE_PREFIX = 'ielts_essay_draft_';
const RESULTS_STORAGE_KEY = 'ielts_evaluation_results_v1';

const TASK_CONFIG: Record<TaskType, { durationSeconds: number; minWords: number; label: string }> = {
  task1: { durationSeconds: 20 * 60, minWords: 150, label: 'Task 1' },
  task2: { durationSeconds: 40 * 60, minWords: 250, label: 'Task 2' },
};

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function formatTimer(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatTableForPrompt(topic: IeltsTopic): string {
  if (!topic.dataTable) return '';
  const headerLine = topic.dataTable.headers.join(' | ');
  const rows = topic.dataTable.rows.map((r) => `${r.label} | ${r.values.join(' | ')}`).join('\n');
  return `${headerLine}\n${rows}`;
}

type AppModule = 'writing' | 'reading' | 'listening';

const MODULES: { id: AppModule; label: string }[] = [
  { id: 'writing', label: 'Writing' },
  { id: 'reading', label: 'Reading' },
  { id: 'listening', label: 'Listening' },
];

export default function App() {
  const [activeModule, setActiveModule] = useState<AppModule>('writing');
  const [taskType, setTaskType] = useState<TaskType>('task2');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('easy9band_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore storage errors
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('easy9band_theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const taskTopics = useMemo(
    () => IELTS_TOPICS_2026.filter((t) => t.taskType === taskType),
    [taskType],
  );

  const [topicByTask, setTopicByTask] = useState<Record<TaskType, IeltsTopic>>(() => ({
    task1: IELTS_TOPICS_2026.find((t) => t.taskType === 'task1') ?? IELTS_TOPICS_2026[0],
    task2: IELTS_TOPICS_2026.find((t) => t.taskType === 'task2') ?? IELTS_TOPICS_2026[0],
  }));

  const selectedTopic = topicByTask[taskType];

  const [isCustomPromptMode, setIsCustomPromptMode] = useState(false);
  const [customPromptText, setCustomPromptText] = useState('');

  const [essayByTask, setEssayByTask] = useState<Record<TaskType, string>>(() => {
    try {
      return {
        task1: localStorage.getItem(`${DRAFT_STORAGE_PREFIX}task1`) ?? '',
        task2: localStorage.getItem(`${DRAFT_STORAGE_PREFIX}task2`) ?? '',
      };
    } catch {
      return { task1: '', task2: '' };
    }
  });

  const [secondsLeft, setSecondsLeft] = useState<number>(TASK_CONFIG.task2.durationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [isRubricOpen, setIsRubricOpen] = useState(false);

  const [evaluatingTask, setEvaluatingTask] = useState<TaskType | null>(null);
  const [errorsByTask, setErrorsByTask] = useState<Record<TaskType, string | null>>({
    task1: null,
    task2: null,
  });
  const [resultsByTask, setResultsByTask] = useState<Record<TaskType, EvaluationResult | null>>(() => {
    try {
      const saved = localStorage.getItem(RESULTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Record<TaskType, EvaluationResult | null>>;
        return {
          task1: parsed.task1 ?? null,
          task2: parsed.task2 ?? null,
        };
      }
    } catch {
      // Ignore invalid JSON
    }
    return { task1: null, task2: null };
  });

  const evaluationRef = useRef<HTMLDivElement | null>(null);

  const currentEssay = essayByTask[taskType];
  const wordCount = useMemo(() => countWords(currentEssay), [currentEssay]);
  const { minWords, durationSeconds } = TASK_CONFIG[taskType];
  const meetsMinWords = wordCount >= minWords;
  const isEvaluating = evaluatingTask === taskType;
  const evaluationError = errorsByTask[taskType];
  const evaluationResult = resultsByTask[taskType];

  // Persist essay drafts safely
  useEffect(() => {
    try {
      localStorage.setItem(`${DRAFT_STORAGE_PREFIX}${taskType}`, currentEssay);
    } catch {
      // Ignore storage quota errors
    }
  }, [currentEssay, taskType]);

  // Persist evaluation results safely
  useEffect(() => {
    try {
      localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(resultsByTask));
    } catch {
      // Ignore storage quota errors
    }
  }, [resultsByTask]);

  // Countdown timer tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isTimerRunning]);

  const handleTaskChange = (nextTask: TaskType) => {
    if (nextTask === taskType) return;
    setTaskType(nextTask);
    setIsTimerRunning(false);
    setSecondsLeft(TASK_CONFIG[nextTask].durationSeconds);
    setIsCustomPromptMode(false);
  };

  const handleRandomTopic = () => {
    setIsCustomPromptMode(false);
    const candidates = taskTopics.filter((t) => t.id !== selectedTopic.id);
    const pool = candidates.length > 0 ? candidates : taskTopics;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const nextTopic = pool[randomIndex];
    setTopicByTask((prev) => ({
      ...prev,
      [taskType]: nextTopic,
    }));
  };

  const handleToggleCustomPrompt = () => {
    if (!isCustomPromptMode) {
      setCustomPromptText(selectedTopic.prompt);
      setIsCustomPromptMode(true);
    } else {
      setIsCustomPromptMode(false);
    }
  };

  const handleEssayChange = (value: string) => {
    setEssayByTask((prev) => ({
      ...prev,
      [taskType]: value,
    }));
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSecondsLeft(durationSeconds);
  };

  const handleEvaluate = async () => {
    const targetTask = taskType;
    const activePrompt = isCustomPromptMode ? customPromptText.trim() : selectedTopic.prompt;

    if (!activePrompt) {
      setErrorsByTask((prev) => ({
        ...prev,
        [targetTask]: 'Введите формулировку темы эссе перед отправкой на проверку.',
      }));
      return;
    }

    if (wordCount < 10) {
      setErrorsByTask((prev) => ({
        ...prev,
        [targetTask]: 'Напишите хотя бы 10 слов, чтобы экзаменатор мог оценить вашу работу.',
      }));
      return;
    }

    setEvaluatingTask(targetTask);
    setErrorsByTask((prev) => ({ ...prev, [targetTask]: null }));

    if (window.innerWidth < 1024 && evaluationRef.current) {
      window.setTimeout(() => {
        evaluationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: targetTask,
          topicPrompt: activePrompt,
          tableDataText: !isCustomPromptMode ? formatTableForPrompt(selectedTopic) : '',
          essayText: currentEssay,
          wordCount,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || `Ошибка сервера (${response.status})`);
      }

      setResultsByTask((prev) => ({
        ...prev,
        [targetTask]: payload as EvaluationResult,
      }));

      if (window.innerWidth < 1024 && evaluationRef.current) {
        window.setTimeout(() => {
          evaluationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка при проверке эссе.';
      setErrorsByTask((prev) => ({ ...prev, [targetTask]: message }));
    } finally {
      setEvaluatingTask((prev) => (prev === targetTask ? null : prev));
    }
  };

  const handleClearResults = () => {
    setResultsByTask({ task1: null, task2: null });
    setErrorsByTask({ task1: null, task2: null });
  };

  const timerIsLow = secondsLeft > 0 && secondsLeft <= 120;
  const timerExpired = secondsLeft === 0;
  const wordProgressPercent = Math.min(100, Math.round((wordCount / minWords) * 100));

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#09090B] dark:text-[#F4F4F5] flex flex-col">
      {/* Three-zone Top Navigation Bar */}
      <header className="border-b border-neutral-200 dark:border-white/[0.07] bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8 h-16">
          <a
            href="#editor-section"
            className="font-display text-base sm:text-lg font-semibold tracking-tight text-black dark:text-zinc-100 whitespace-nowrap shrink-0"
          >
            IELTS Studio
          </a>

          <div
            role="tablist"
            aria-label="Раздел IELTS"
            className="flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-white/[0.09] bg-neutral-100 dark:bg-white/[0.03] p-1"
          >
            {MODULES.map((module) => (
              <button
                key={module.id}
                type="button"
                role="tab"
                aria-selected={activeModule === module.id}
                onClick={() => setActiveModule(module.id)}
                className={`rounded-md px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  activeModule === module.id
                    ? 'bg-white text-black shadow-xs dark:bg-white/[0.1] dark:text-zinc-100'
                    : 'text-neutral-700 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {module.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {activeModule === 'writing' ? (
              <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-700 dark:text-zinc-400">
                <a
                  href="#editor-section"
                  className="transition-colors hover:text-neutral-950 dark:hover:text-zinc-100 whitespace-nowrap shrink-0"
                >
                  Тренажер
                </a>
                <a
                  href="#evaluation-section"
                  className="transition-colors hover:text-neutral-950 dark:hover:text-zinc-100 whitespace-nowrap shrink-0"
                >
                  Разбор
                </a>
                <button
                  type="button"
                  onClick={() => setIsRubricOpen(true)}
                  className="transition-colors hover:text-neutral-950 dark:hover:text-zinc-100 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Шкала IELTS
                </button>
              </nav>
            ) : (
              <div className="hidden md:block w-[200px]" aria-hidden="true" />
            )}

            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              className="rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-neutral-200 sm:text-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 whitespace-nowrap shrink-0"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Two-Column Studio Workspace */}
      {activeModule === 'reading' && <ReadingScreen />}
      {activeModule === 'listening' && <ListeningTest />}

      {activeModule === 'writing' && (
        <main className="mx-auto w-full max-w-[1380px] flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white text-black dark:bg-transparent dark:text-inherit">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: Writing Workspace */}
            <section id="editor-section" className="lg:col-span-7 space-y-5">
              {/* Toolbar: Task 1 / Task 2 Segmented Switcher & Random Topic Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                  role="tablist"
                  aria-label="Выбор задания IELTS Writing"
                  className="inline-flex items-center rounded-xl border border-neutral-200 bg-neutral-100 dark:border-white/[0.08] dark:bg-[#111114] p-1 self-start"
                >
                  {(['task1', 'task2'] as const).map((type) => {
                    const active = taskType === type;
                    const savedScore = resultsByTask[type]?.overallBand;
                    return (
                      <button
                        key={type}
                        role="tab"
                        aria-selected={active}
                        type="button"
                        onClick={() => handleTaskChange(type)}
                        className={`min-h-[38px] rounded-lg px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-white text-neutral-950 shadow-xs dark:bg-white/[0.1] dark:text-zinc-100'
                            : 'text-neutral-700 hover:text-neutral-950 dark:text-zinc-400 dark:hover:text-zinc-200'
                        }`}
                      >
                        {type === 'task1' ? 'Task 1 · 20 мин' : 'Task 2 · 40 мин'}
                        {savedScore !== undefined && (
                          <span className="ml-1.5 font-mono-tabular text-blue-600 dark:text-blue-400">
                            · {Number.isInteger(savedScore) ? `${savedScore}.0` : savedScore.toFixed(1)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleRandomTopic}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-white/[0.1] dark:bg-[#111114] dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:border-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Shuffle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Сгенерировать случайную тему эссе</span>
                </button>
              </div>

              {/* Topic Prompt Container */}
              <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/[0.08] dark:bg-[#111114] p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-zinc-400">
                    <span className="text-neutral-950 dark:text-zinc-200 font-medium">
                      {isCustomPromptMode ? 'Пользовательская тема' : selectedTopic.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{isCustomPromptMode ? TASK_CONFIG[taskType].label : selectedTopic.questionType}</span>
                    <span aria-hidden="true">·</span>
                    <span>IELTS 2026</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleCustomPrompt}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 transition-colors hover:text-neutral-950 dark:text-zinc-400 dark:hover:text-zinc-100 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>{isCustomPromptMode ? 'Вернуть тему из базы' : 'Ввести свою тему'}</span>
                  </button>
                </div>

                {isCustomPromptMode ? (
                  <textarea
                    value={customPromptText}
                    onChange={(e) => setCustomPromptText(e.target.value)}
                    rows={3}
                    placeholder="Вставьте формулировку задания IELTS Writing сюда…"
                    className="w-full rounded-xl border border-neutral-300 bg-white p-3.5 text-sm leading-relaxed text-neutral-950 placeholder:text-neutral-400 dark:border-white/[0.1] dark:bg-[#09090B] dark:text-zinc-100 dark:placeholder:text-zinc-600 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                ) : (
                  <>
                    <p className="text-[15px] sm:text-base leading-[1.65] text-neutral-950 dark:text-zinc-100">
                      {selectedTopic.prompt}
                    </p>

                    {selectedTopic.dataTable && (
                      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-white/[0.07] dark:bg-[#09090B]">
                        <table className="w-full border-collapse text-left text-xs sm:text-sm">
                          <thead>
                            <tr className="border-b border-neutral-200 text-neutral-700 dark:border-white/[0.07] dark:text-zinc-400">
                              {selectedTopic.dataTable.headers.map((header, idx) => (
                                <th
                                  key={header}
                                  className={`px-3.5 py-2.5 font-medium ${
                                    idx > 0 ? 'text-right font-mono-tabular' : ''
                                  }`}
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 dark:divide-white/[0.05]">
                            {selectedTopic.dataTable.rows.map((row) => (
                              <tr key={row.label} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02]">
                                <td className="px-3.5 py-2.5 font-medium text-neutral-950 dark:text-zinc-200">{row.label}</td>
                                {row.values.map((val, idx) => (
                                  <td
                                    key={idx}
                                    className="px-3.5 py-2.5 text-right font-mono-tabular text-neutral-800 dark:text-zinc-300"
                                  >
                                    {val}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Editor Container: Timer + Word Count + Textarea + Primary CTA */}
              <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/[0.08] dark:bg-[#111114] overflow-hidden">
                {/* Timer & Word Count Control Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-white/[0.07] px-4 sm:px-6 py-3.5">
                  {/* Timer Controls */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-baseline gap-2 pr-1">
                      <span
                        className={`font-mono-tabular text-lg font-semibold tracking-tight ${
                          timerExpired
                            ? 'text-red-600 dark:text-red-400'
                            : timerIsLow
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-neutral-950 dark:text-zinc-100'
                        }`}
                      >
                        {formatTimer(secondsLeft)}
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-zinc-500">
                        {timerExpired ? 'Время вышло' : isTimerRunning ? 'Идет отсчет' : 'Таймер'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsTimerRunning((prev) => !prev)}
                        disabled={timerExpired}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-900 transition-colors hover:bg-neutral-200 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.09] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause className="h-3.5 w-3.5" />
                            <span>Пауза</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            <span>Старт</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleResetTimer}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950 dark:border-white/[0.08] dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-zinc-200 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Сброс</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Word Count */}
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-xs text-neutral-700 dark:text-zinc-400 flex items-center gap-2">
                      <span className="font-mono-tabular text-sm font-semibold text-neutral-950 dark:text-zinc-100">
                        {wordCount}
                      </span>
                      <span className="font-mono-tabular text-neutral-600 dark:text-zinc-500">/ {minWords}+ слов</span>
                      <span aria-hidden="true">·</span>
                      {meetsMinWords ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Объем достигнут
                        </span>
                      ) : (
                        <span className="text-neutral-700 dark:text-zinc-400">До минимума: {minWords - wordCount}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtle 2px word progress bar */}
                <div className="h-0.5 w-full bg-neutral-200 dark:bg-white/[0.04]">
                  <div
                    className={`h-full transition-all duration-200 ${
                      meetsMinWords ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${wordProgressPercent}%` }}
                  />
                </div>

                {/* Textarea */}
                <div className="p-4 sm:p-6">
                  <label htmlFor="ielts-essay-input" className="sr-only">
                    Поле ввода эссе IELTS
                  </label>
                  <textarea
                    id="ielts-essay-input"
                    value={currentEssay}
                    onChange={(e) => handleEssayChange(e.target.value)}
                    spellCheck={false}
                    placeholder={
                      taskType === 'task1'
                        ? 'Начните аналитический отчет на английском: Introduction, Overview ключевых трендов и 2 абзаца детальных сравнений…'
                        : 'Начните эссе на английском: Introduction с четкой позицией, два аргументированных Body Paragraphs и Conclusion…'
                    }
                    className="min-h-[300px] sm:min-h-[380px] w-full resize-y bg-transparent text-[15px] sm:text-base leading-[1.75] text-neutral-950 placeholder:text-neutral-400 dark:text-zinc-100 dark:placeholder:text-zinc-600 focus:outline-none"
                  />
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-50 dark:border-white/[0.07] dark:bg-[#0D0D10] px-4 sm:px-6 py-4">
                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    {currentEssay.trim().length > 0 ? (
                      <button
                        type="button"
                        onClick={() => handleEssayChange('')}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-200 hover:text-neutral-950 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-zinc-200 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Очистить текст</span>
                      </button>
                    ) : (
                      <span className="text-xs text-neutral-600 dark:text-zinc-500">Черновик сохраняется автоматически</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsRubricOpen(true)}
                      className="md:hidden text-xs font-medium text-neutral-700 hover:text-neutral-950 dark:text-zinc-400 dark:hover:text-zinc-200 underline underline-offset-4"
                    >
                      Шкала IELTS
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleEvaluate}
                    disabled={isEvaluating}
                    className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Проверяем работу…</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Проверить эссе</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Right Column: Examiner Feedback & Band 8.5 Rewrite */}
            <div ref={evaluationRef} className="lg:col-span-5">
              <EvaluationPanel
                taskType={taskType}
                wordCount={wordCount}
                isLoading={isEvaluating}
                error={evaluationError}
                result={evaluationResult}
                resultsByTask={resultsByTask}
                onSelectTask={handleTaskChange}
                onClearResults={handleClearResults}
              />
            </div>
          </div>
        </main>
      )}

      <RubricModal isOpen={isRubricOpen} onClose={() => setIsRubricOpen(false)} />
    </div>
  );
}
