import { Check, X } from 'lucide-react';
import type { Question, QuestionGroup } from '../data/testTypes';
import { isCorrect } from '../lib/scoring';

interface QuestionGroupViewProps {
  group: QuestionGroup;
  answers: Record<number, string>;
  onChange: (n: number, value: string) => void;
  submitted: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const BINARY_OPTIONS: Record<string, string[]> = {
  tfng: ['TRUE', 'FALSE', 'NOT GIVEN'],
  ynng: ['YES', 'NO', 'NOT GIVEN'],
};

function GapField({
  question,
  value,
  disabled,
  onChange,
}: {
  question: Question;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const input = (
    <input
      type="text"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      aria-label={`Ответ на вопрос ${question.n}`}
      className="mx-1 inline-block w-36 rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-950 outline-none transition-colors focus:border-blue-500 disabled:opacity-70 dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-zinc-100"
    />
  );

  const parts = question.text.split('_____');
  if (parts.length < 2) {
    return (
      <div className="space-y-2">
        <p className="text-sm leading-6 text-neutral-900 dark:text-zinc-200">{question.text}</p>
        {input}
      </div>
    );
  }

  return (
    <p className="text-sm leading-8 text-neutral-900 dark:text-zinc-200">
      {parts[0]}
      {input}
      {parts[1]}
    </p>
  );
}

function correctAnswerLabel(group: QuestionGroup, question: Question): string {
  if (group.type === 'mcq' && question.options) {
    const index = LETTERS.indexOf(question.answer);
    return index >= 0 ? `${question.answer}. ${question.options[index]}` : question.answer;
  }
  if (group.type === 'match') {
    const choice = group.choices?.find((c) => c.key === question.answer);
    return choice ? `${choice.key} — ${choice.label}` : question.answer;
  }
  return question.answer;
}

export function QuestionGroupView({ group, answers, onChange, submitted }: QuestionGroupViewProps) {
  const first = group.questions[0].n;
  const last = group.questions[group.questions.length - 1].n;

  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-white/[0.07] dark:bg-white/[0.02]">
      <div>
        <h3 className="font-display text-sm font-semibold text-neutral-950 dark:text-zinc-100">
          Questions {first}–{last}
        </h3>
        <p className="mt-1 text-sm leading-6 text-neutral-800 dark:text-zinc-400">{group.instruction}</p>
      </div>

      {group.type === 'match' && group.choices && (
        <ul className="grid gap-1.5 rounded-xl border border-neutral-200 bg-white p-3 text-sm text-neutral-900 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-zinc-300">
          {group.choices.map((choice) => (
            <li key={choice.key} className="flex gap-3">
              <span className="w-8 shrink-0 font-mono-tabular text-neutral-600 dark:text-zinc-500">{choice.key}</span>
              <span>{choice.label}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-3">
        {group.questions.map((question) => {
          const given = answers[question.n] ?? '';
          const ok = submitted && isCorrect(group, question, given);
          const frame = !submitted
          ? 'border-neutral-200 bg-white dark:border-white/[0.07] dark:bg-transparent'
          : ok
            ? 'border-emerald-500/40 bg-emerald-500/[0.08] dark:border-emerald-500/30 dark:bg-emerald-500/[0.05]'
            : 'border-red-500/40 bg-red-500/[0.08] dark:border-red-500/30 dark:bg-red-500/[0.05]';

          return (
            <div key={question.n} className={`rounded-xl border p-3 ${frame}`}>
              <div className="flex items-start gap-3">
                <span className="w-6 shrink-0 pt-0.5 font-mono-tabular text-xs text-neutral-700 dark:text-zinc-500">{question.n}</span>
                <div className="min-w-0 flex-1 space-y-2">
                  {group.type === 'gap' ? (
                    <GapField
                      question={question}
                      value={given}
                      disabled={submitted}
                      onChange={(value) => onChange(question.n, value)}
                    />
                  ) : (
                    <p className="text-sm leading-6 text-neutral-950 dark:text-zinc-200">{question.text}</p>
                  )}

                  {(group.type === 'tfng' || group.type === 'ynng') && (
                    <div className="flex flex-wrap gap-2">
                      {BINARY_OPTIONS[group.type].map((option) => (
                        <button
                          key={option}
                          type="button"
                          disabled={submitted}
                          aria-pressed={given === option}
                          onClick={() => onChange(question.n, option)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer disabled:cursor-default ${
                            given === option
                              ? 'border-blue-500 bg-blue-600 text-white'
                              : 'border-neutral-300 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.08]'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {group.type === 'mcq' && question.options && (
                    <div className="space-y-1.5">
                      {question.options.map((option, index) => {
                        const letter = LETTERS[index];
                        return (
                          <button
                            key={letter}
                            type="button"
                            disabled={submitted}
                            aria-pressed={given === letter}
                            onClick={() => onChange(question.n, letter)}
                          className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors cursor-pointer disabled:cursor-default ${
                            given === letter
                              ? 'border-blue-500 bg-blue-600/15 text-neutral-950 dark:bg-blue-600/20 dark:text-zinc-50'
                              : 'border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-zinc-300 dark:hover:bg-white/[0.06]'
                          }`}
                          >
                            <span className="font-mono-tabular text-neutral-600 dark:text-zinc-500">{letter}</span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {group.type === 'match' && group.choices && (
                    <select
                      value={given}
                      disabled={submitted}
                      onChange={(e) => onChange(question.n, e.target.value)}
                      aria-label={`Ответ на вопрос ${question.n}`}
                      className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-950 outline-none focus:border-blue-500 disabled:opacity-70 dark:border-white/[0.12] dark:bg-[#111114] dark:text-zinc-100"
                    >
                      <option value="">Выберите…</option>
                      {group.choices.map((choice) => (
                        <option key={choice.key} value={choice.key}>
                          {choice.key}
                        </option>
                      ))}
                    </select>
                  )}

                  {submitted && !ok && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">Правильный ответ: {correctAnswerLabel(group, question)}</p>
                  )}
                </div>

                {submitted &&
                  (ok ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-label="Верно" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-label="Неверно" />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
