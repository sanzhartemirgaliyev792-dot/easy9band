import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Headphones, RotateCcw, Send, Square, Play } from 'lucide-react';
import { LISTENING_SECTIONS } from '../data/listening';
import type { ListeningSection } from '../data/testTypes';
import { LISTENING_BANDS, bandFromRaw, isCorrect } from '../lib/scoring';
import { QuestionGroupView } from './QuestionGroupView';
import { ScoreSummary } from './ScoreSummary';

const FEMALE_HINTS = /female|zira|samantha|susan|hazel|karen|moira|serena|fiona|libby|sonia|jenny|aria|kate|victoria/i;
const MALE_HINTS = /\bmale\b|david|daniel|george|mark|ryan|guy|alex|oliver|thomas|arthur|james|fred/i;

function buildQueue(section: ListeningSection, voices: SpeechSynthesisVoice[]): SpeechSynthesisUtterance[] {
  const english = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('en'));
  const british = english.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('en-gb'));
  const pool = british.length > 0 ? british : english;
  const find = (hint: RegExp) => pool.find((v) => hint.test(v.name)) ?? english.find((v) => hint.test(v.name));

  const voiceFor = { female: find(FEMALE_HINTS), male: find(MALE_HINTS) };
  const fallback = pool[0] ?? english[0];

  const queue: SpeechSynthesisUtterance[] = [];
  for (const line of section.script) {
    const gender = section.speakers[line.speaker] ?? 'female';
    const specific = voiceFor[gender];
    // Длинные реплики режем на предложения: так надёжнее работает озвучка в Chrome
    const sentences = line.text.match(/[^.!?]+[.!?]*/g) ?? [line.text];

    for (const sentence of sentences) {
      const text = sentence.trim();
      if (!text) continue;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.92;
      const voice = specific ?? fallback;
      if (voice) utterance.voice = voice;
      // Если отдельного голоса под пол нет, различаем говорящих высотой тона
      if (!specific) utterance.pitch = gender === 'female' ? 1.2 : 0.8;
      queue.push(utterance);
    }
  }
  return queue;
}

export function ListeningTest() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [examMode, setExamMode] = useState(false);
  const [plays, setPlays] = useState<Record<string, number>>({});
  const runIdRef = useRef(0);

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const section = LISTENING_SECTIONS[sectionIndex];

  const stop = useCallback(() => {
    runIdRef.current += 1;
    if (supported) window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [supported]);

  useEffect(() => {
    if (supported) window.speechSynthesis.getVoices(); // запускает загрузку списка голосов
    return () => {
      runIdRef.current += 1;
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  const play = () => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const runId = ++runIdRef.current;
    const queue = buildQueue(section, synth.getVoices());
    if (queue.length === 0) return;

    setPlays((prev) => ({ ...prev, [section.id]: (prev[section.id] ?? 0) + 1 }));
    setIsPlaying(true);

    let index = 0;
    const next = () => {
      if (runIdRef.current !== runId) return;
      if (index >= queue.length) {
        setIsPlaying(false);
        return;
      }
      const utterance = queue[index++];
      utterance.onend = next;
      utterance.onerror = () => {
        if (runIdRef.current === runId) setIsPlaying(false);
      };
      synth.speak(utterance);
    };
    next();
  };

  const stats = useMemo(() => {
    const perSection = LISTENING_SECTIONS.map((s) => {
      let raw = 0;
      let total = 0;
      let answered = 0;
      for (const group of s.groups) {
        for (const question of group.questions) {
          total += 1;
          if ((answers[question.n] ?? '').trim()) answered += 1;
          if (isCorrect(group, question, answers[question.n])) raw += 1;
        }
      }
      return { label: s.title, raw, total, answered };
    });
    return {
      perSection,
      raw: perSection.reduce((sum, s) => sum + s.raw, 0),
      total: perSection.reduce((sum, s) => sum + s.total, 0),
    };
  }, [answers]);

  const handleChange = (n: number, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [n]: value }));
  };

  const handleSubmit = () => {
    stop();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    stop();
    setAnswers({});
    setSubmitted(false);
    setPlays({});
    setSectionIndex(0);
  };

  const playsInSection = plays[section.id] ?? 0;
  const playLocked = examMode && playsInSection >= 1 && !isPlaying;

  return (
    <main className="mx-auto w-full max-w-[1380px] flex-1 space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-xl border border-white/[0.07] bg-white/[0.02] p-1">
          {LISTENING_SECTIONS.map((s, index) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                stop();
                setSectionIndex(index);
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                index === sectionIndex ? 'bg-white/[0.1] text-zinc-100' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {s.title}
              <span className="ml-2 font-mono-tabular text-xs text-zinc-500">
                {stats.perSection[index].answered}/{stats.perSection[index].total}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
          title="Listening"
          raw={stats.raw}
          total={stats.total}
          band={bandFromRaw(stats.raw, LISTENING_BANDS)}
          parts={stats.perSection.map((s) => ({ label: s.label, raw: s.raw, total: s.total }))}
        />
      )}

      {/* Audio player */}
      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Headphones className="mt-1 h-5 w-5 text-blue-400" />
            <div>
              <h2 className="font-display text-lg font-semibold text-zinc-50">{section.title}</h2>
              <p className="mt-0.5 text-sm text-zinc-400">{section.context}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={examMode}
                onChange={(e) => setExamMode(e.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
              Режим экзамена: одно прослушивание
            </label>
            {isPlaying ? (
              <button
                type="button"
                onClick={stop}
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.05] px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.1] cursor-pointer"
              >
                <Square className="h-4 w-4" />
                Стоп
              </button>
            ) : (
              <button
                type="button"
                onClick={play}
                disabled={!supported || playLocked}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                <Play className="h-4 w-4" />
                {playsInSection > 0 ? 'Послушать ещё раз' : 'Слушать'}
              </button>
            )}
          </div>
        </div>

        {!supported && (
          <p className="mt-4 text-sm text-red-400">
            Ваш браузер не поддерживает озвучку текста. Откройте сайт в Chrome, Edge или Safari.
          </p>
        )}
        {playLocked && (
          <p className="mt-4 text-xs text-zinc-500">
            В режиме экзамена запись звучит один раз. Отключите режим, чтобы слушать повторно.
          </p>
        )}
        <p className="mt-4 text-xs leading-5 text-zinc-500">
          Записи озвучивает синтезатор речи вашего браузера, поэтому голоса звучат иначе, чем на экзамене, а текст
          читается быстрее и ровнее. Для тренировки восприятия на слух этого достаточно.
        </p>
      </section>

      {/* Questions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {section.groups.map((group) => (
          <div key={group.questions[0].n} className={section.groups.length === 1 ? 'lg:col-span-2' : ''}>
            <QuestionGroupView group={group} answers={answers} onChange={handleChange} submitted={submitted} />
          </div>
        ))}
      </div>

      {submitted && (
        <details className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <summary className="cursor-pointer text-sm font-medium text-zinc-200">
            Текст записи ({section.title})
          </summary>
          <div className="mt-4 space-y-3">
            {section.script.map((line, index) => (
              <p key={index} className="text-sm leading-6 text-zinc-300">
                <span className="mr-2 font-semibold text-blue-400">{line.speaker}:</span>
                {line.text}
              </p>
            ))}
          </div>
        </details>
      )}

      <p className="text-xs leading-5 text-zinc-500">
        Диалоги и лекции написаны специально для тренировки, а упомянутые в них места и люди вымышлены.
      </p>
    </main>
  );
}
