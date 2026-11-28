import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Dumbbell,
  Headphones,
  Moon,
  PenTool,
  Sun,
} from 'lucide-react';

export type ModuleTarget = 'writing' | 'reading' | 'listening';

interface HomeScreenProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onStartModule: (module: ModuleTarget, mode: 'mock' | 'training') => void;
}

const SLOGANS = [
  'IELTS — easy. Target Band 9.',
  'Academic English made sharp.',
  'Turn your Band into real goals.',
] as const;

export function HomeScreen({ theme, onToggleTheme, onStartModule }: HomeScreenProps) {
  const [selectedFlow, setSelectedFlow] = useState<'mock' | 'training' | null>(null);
  const [activeSlogan, setActiveSlogan] = useState(0);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between bg-[#F7F7F8] text-neutral-950 dark:bg-[#09090B] dark:text-zinc-100 transition-colors">
      {/* Subtle Ambient Glow (modern luxury glass feel) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-180px] left-1/2 -translate-x-1/2 h-[420px] w-[780px] rounded-full bg-blue-600/10 blur-[130px] dark:bg-blue-500/15"
      />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-6 flex items-center justify-between">
        <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-500 dark:text-zinc-500">
          easy9band
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white/80 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-neutral-700 transition-colors hover:bg-white dark:border-white/[0.09] dark:bg-[#111114]/80 dark:text-zinc-300 dark:hover:bg-white/[0.06] cursor-pointer"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5 text-neutral-700" />
              <span>Dark</span>
            </>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14 flex flex-col items-center text-center">
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-blue-600 dark:text-blue-400">
          IELTS Preparation Agent
        </p>

        <h1 className="mt-3 text-5xl sm:text-7xl font-semibold tracking-[-0.03em] text-neutral-950 dark:text-white">
          easy<span className="text-blue-600 dark:text-blue-500">9</span>band
        </h1>

        {/* Two Smooth-Cornered Glass Cards */}
        <div className="mt-10 sm:mt-12 w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
          {/* MOCK TESTS */}
          <button
            type="button"
            onClick={() => setSelectedFlow((prev) => (prev === 'mock' ? null : 'mock'))}
            className={`group relative rounded-3xl border p-7 sm:p-9 backdrop-blur-xl transition-all cursor-pointer flex flex-col justify-between min-h-[215px] ${
              selectedFlow === 'mock'
                ? 'border-blue-500/80 bg-white/95 shadow-[0_0_40px_-12px_rgba(37,99,235,0.35)] dark:border-blue-500/60 dark:bg-[#13151C]/90 dark:shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]'
                : 'border-neutral-200/85 bg-white/75 hover:border-neutral-300 hover:bg-white/95 dark:border-white/[0.09] dark:bg-[#111114]/75 dark:hover:border-white/[0.18] dark:hover:bg-[#14151B]/85'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-100/70 dark:border-white/[0.08] dark:bg-white/[0.04]">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </span>
              <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-neutral-400 dark:text-zinc-500">
                Timed Mode
              </span>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-[28px] font-semibold tracking-[-0.02em] uppercase text-neutral-950 dark:text-zinc-100">
                  Mock Tests
                </h2>
                <ArrowRight className="h-5 w-5 text-neutral-400 transition-transform duration-200 group-hover:translate-x-1 dark:text-zinc-500" />
              </div>
              <p className="mt-1.5 text-xs sm:text-[13px] text-neutral-500 dark:text-zinc-400">
                Экзаменационный темп, таймер и проверка без подсказок.
              </p>
            </div>
          </button>

          {/* TRAINING */}
          <button
            type="button"
            onClick={() => setSelectedFlow((prev) => (prev === 'training' ? null : 'training'))}
            className={`group relative rounded-3xl border p-7 sm:p-9 backdrop-blur-xl transition-all cursor-pointer flex flex-col justify-between min-h-[215px] ${
              selectedFlow === 'training'
                ? 'border-blue-500/80 bg-white/95 shadow-[0_0_40px_-12px_rgba(37,99,235,0.35)] dark:border-blue-500/60 dark:bg-[#13151C]/90 dark:shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]'
                : 'border-neutral-200/85 bg-white/75 hover:border-neutral-300 hover:bg-white/95 dark:border-white/[0.09] dark:bg-[#111114]/75 dark:hover:border-white/[0.18] dark:hover:bg-[#14151B]/85'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-100/70 dark:border-white/[0.08] dark:bg-white/[0.04]">
                <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </span>
              <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-neutral-400 dark:text-zinc-500">
                Guided Practice
              </span>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-[28px] font-semibold tracking-[-0.02em] uppercase text-neutral-950 dark:text-zinc-100">
                  Training
                </h2>
                <ArrowRight className="h-5 w-5 text-neutral-400 transition-transform duration-200 group-hover:translate-x-1 dark:text-zinc-500" />
              </div>
              <p className="mt-1.5 text-xs sm:text-[13px] text-neutral-500 dark:text-zinc-400">
                Разбор ошибок, дотяжка до сильного Band и тренировка по секциям.
              </p>
            </div>
          </button>
        </div>

        {/* Section Picker when Mock Tests or Training is selected */}
        {selectedFlow && (
          <div className="mt-5 w-full rounded-2xl border border-neutral-200/85 bg-white/85 backdrop-blur-xl p-4 sm:p-5 dark:border-white/[0.09] dark:bg-[#111114]/85 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-600 dark:text-zinc-300">
                {selectedFlow === 'mock' ? 'Секция для Mock Test' : 'Секция для тренировки'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedFlow(null)}
                className="text-xs text-neutral-400 hover:text-neutral-800 dark:text-zinc-500 dark:hover:text-zinc-200 cursor-pointer"
              >
                Закрыть
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onStartModule('writing', selectedFlow)}
                className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-neutral-50/80 px-4 py-3 text-left transition-colors hover:border-blue-500/60 hover:bg-white dark:border-white/[0.07] dark:bg-[#09090B]/70 dark:hover:border-blue-500/50 cursor-pointer"
              >
                <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-900 dark:text-zinc-100">
                  <PenTool className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Writing
                </span>
                <ArrowRight className="h-4 w-4 text-neutral-400 dark:text-zinc-500" />
              </button>

              <button
                type="button"
                onClick={() => onStartModule('reading', selectedFlow)}
                className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-neutral-50/80 px-4 py-3 text-left transition-colors hover:border-blue-500/60 hover:bg-white dark:border-white/[0.07] dark:bg-[#09090B]/70 dark:hover:border-blue-500/50 cursor-pointer"
              >
                <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-900 dark:text-zinc-100">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Reading
                </span>
                <ArrowRight className="h-4 w-4 text-neutral-400 dark:text-zinc-500" />
              </button>

              <button
                type="button"
                onClick={() => onStartModule('listening', selectedFlow)}
                className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-neutral-50/80 px-4 py-3 text-left transition-colors hover:border-blue-500/60 hover:bg-white dark:border-white/[0.07] dark:bg-[#09090B]/70 dark:hover:border-blue-500/50 cursor-pointer"
              >
                <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-900 dark:text-zinc-100">
                  <Headphones className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Listening
                </span>
                <ArrowRight className="h-4 w-4 text-neutral-400 dark:text-zinc-500" />
              </button>
            </div>
          </div>
        )}

        {/* Project Description Below Cards */}
        <p className="mt-9 max-w-2xl text-xs sm:text-[13px] leading-relaxed text-neutral-500 dark:text-zinc-400">
          <span className="font-medium text-neutral-800 dark:text-zinc-200">easy9band</span> — твой
          инструмент для прокачки академического английского, где строгая практика и разбор ошибок
          работают на твои мечты и цели.
        </p>
      </main>

      {/* Small Luxury-Style Slogans Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 pb-6 pt-4 border-t border-neutral-200/70 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] tracking-[0.08em] text-neutral-400 dark:text-zinc-500">
        <button
          type="button"
          onClick={() => setActiveSlogan((prev) => (prev + 1) % SLOGANS.length)}
          title="Нажми, чтобы переключить слоган"
          className="hover:text-neutral-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
        >
          {SLOGANS[activeSlogan]}
        </button>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {SLOGANS.map((s, idx) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveSlogan(idx)}
              className={`transition-colors cursor-pointer ${
                activeSlogan === idx
                  ? 'text-neutral-700 dark:text-zinc-300'
                  : 'hover:text-neutral-600 dark:hover:text-zinc-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
