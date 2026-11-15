import { useEffect } from 'react';
import { X } from 'lucide-react';

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BAND_GUIDE = [
  {
    band: '8.5 – 9.0',
    cefr: 'C2',
    summary:
      'Исчерпывающий, глубоко аргументированный ответ, безупречная связность без механических шаблонов, точные академические коллокации и естественное разнообразие сложных грамматических конструкций практически без ошибок.',
  },
  {
    band: '7.5 – 8.0',
    cefr: 'C1',
    summary:
      'Полноценное раскрытие всех частей задания, логичная прогрессия идей, широкий словарный запас с редкими неточностями в стиле, уверенное владение сложными предложениями с редкими мелкими опечатками.',
  },
  {
    band: '6.5 – 7.0',
    cefr: 'B2–C1',
    summary:
      'Ясная позиция и уместные примеры, понятная структура абзацев, достаточная лексика для рассуждения на абстрактные темы, но встречаются ошибки в артиклях, предлогах, согласовании или предсказуемые связки.',
  },
  {
    band: '5.5 – 6.0',
    cefr: 'B2',
    summary:
      'Задание выполнено частично или неравномерно; идеи иногда повторяются; лексика базовая; заметные грамматические ошибки в сложных конструкциях, однако общий смысл остается понятным.',
  },
];

export function RubricModal({ isOpen, onClose }: RubricModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rubric-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#111114] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h2 id="rubric-modal-title" className="text-lg font-semibold text-zinc-100">
              Официальная шкала оценивания IELTS Writing
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Итоговый балл — среднее арифметическое 4 критериев, округленное до 0.5 (.25 → .5, .75 → целое вверх)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть шкалу"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-white/[0.06]">
          {BAND_GUIDE.map((item) => (
            <div key={item.band} className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="sm:w-32 shrink-0">
                <div className="font-mono-tabular text-base font-semibold text-zinc-100">{item.band}</div>
                <div className="text-xs text-zinc-500">CEFR {item.cefr}</div>
              </div>
              <p className="text-sm leading-relaxed text-zinc-300">{item.summary}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-400">
          <div>
            <span className="font-medium text-zinc-200">Task 1 (минимум 150 слов):</span> обзор ключевых трендов
            (Overview), точные сравнения данных без домысливания причин.
          </div>
          <div>
            <span className="font-medium text-zinc-200">Task 2 (минимум 250 слов):</span> четкая позиция на протяжении
            всего эссе, развернутые аргументы и релевантные примеры.
          </div>
        </div>
      </div>
    </div>
  );
}
