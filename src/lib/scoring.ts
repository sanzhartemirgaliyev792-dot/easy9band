import type { Question, QuestionGroup } from '../data/testTypes';

/** Приводит ответ к виду без регистра, пробелов и знаков: "6.30 pm" -> "630pm", "off-peak" -> "offpeak" */
export function normalizeAnswer(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function isCorrect(group: QuestionGroup, question: Question, given: string | undefined): boolean {
  if (!given) return false;

  if (group.type === 'gap') {
    const normalizedGiven = normalizeAnswer(given);
    if (!normalizedGiven) return false;
    return [question.answer, ...(question.accept ?? [])].some((a) => normalizeAnswer(a) === normalizedGiven);
  }

  return given === question.answer;
}

type BandTable = ReadonlyArray<readonly [minRaw: number, band: number]>;

/** Academic Reading, 40 вопросов (ориентировочная таблица) */
export const READING_BANDS: BandTable = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5],
  [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5],
];

/** Listening, 40 вопросов (ориентировочная таблица) */
export const LISTENING_BANDS: BandTable = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5],
  [16, 5], [13, 4.5], [11, 4], [8, 3.5], [6, 3], [4, 2.5],
];

export function bandFromRaw(raw: number, table: BandTable): number {
  for (const [minRaw, band] of table) {
    if (raw >= minRaw) return band;
  }
  return raw >= 2 ? 2 : raw >= 1 ? 1 : 0;
}
