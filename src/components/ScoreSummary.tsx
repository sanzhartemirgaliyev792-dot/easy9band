interface ScoreSummaryProps {
  title: string;
  raw: number;
  total: number;
  band: number;
  parts: { label: string; raw: number; total: number }[];
}

export function ScoreSummary({ title, raw, total, band, parts }: ScoreSummaryProps) {
  return (
    <section className="rounded-2xl border border-blue-500/25 bg-blue-500/[0.05] p-5 sm:p-6">
      <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">{title}</p>
          <p className="mt-1 font-display text-4xl font-semibold text-zinc-50">Band {band.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">Правильных ответов</p>
          <p className="mt-1 font-mono-tabular text-2xl text-zinc-100">
            {raw} / {total}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {parts.map((part) => (
          <span
            key={part.label}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300"
          >
            {part.label}: <span className="font-mono-tabular text-zinc-100">{part.raw}/{part.total}</span>
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-zinc-500">
        Band рассчитан по ориентировочной таблице пересчёта для 40 вопросов. На реальном экзамене таблица немного
        отличается от теста к тесту.
      </p>
    </section>
  );
}
