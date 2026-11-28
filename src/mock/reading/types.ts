export interface Option {
  value: string;
  label: string;
}

export interface Question {
  n: number;
  text: string;
  /** Допустимые варианты правильного ответа (регистр и пробелы не важны) */
  answer: string[];
}

export type InputKind = 'tfng' | 'letter' | 'mcq' | 'text';

export interface Group {
  title: string;
  instruction: string;
  /** Список вариантов над вопросами (например, окончания предложений A–G) */
  box?: string[];
  input: InputKind;
  /** Для tfng / letter / mcq. Для mcq у каждого вопроса свои варианты в mcqOptions */
  options?: Option[];
  mcqOptions?: Record<number, Option[]>;
  questions: Question[];
}

export interface Passage {
  title: string;
  intro?: string;
  paragraphs: { label?: string; text: string }[];
}

export interface Part {
  passage: Passage;
  groups: Group[];
}

export interface ReadingVariant {
  id: string;
  title: string;
  durationMinutes: number;
  parts: Part[];
}
