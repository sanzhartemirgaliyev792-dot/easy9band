export type QuestionType = 'tfng' | 'ynng' | 'mcq' | 'gap' | 'match';

export interface Question {
  /** Сквозной номер вопроса в тесте (1–40) */
  n: number;
  /** Текст вопроса. Для типа gap пропуск обозначается как _____ */
  text: string;
  /** Для mcq: тексты вариантов A, B, C, D (по порядку) */
  options?: string[];
  /** Правильный ответ: TRUE / YES / A / vii / слово */
  answer: string;
  /** Дополнительные допустимые ответы (для gap) */
  accept?: string[];
}

export interface QuestionGroup {
  instruction: string;
  type: QuestionType;
  /** Для match: список вариантов (заголовки, области парка и т.д.) */
  choices?: { key: string; label: string }[];
  questions: Question[];
}

export interface ReadingPassage {
  id: string;
  title: string;
  paragraphs: { label?: string; text: string }[];
  groups: QuestionGroup[];
}

export interface ScriptLine {
  speaker: string;
  text: string;
}

export interface ListeningSection {
  id: string;
  title: string;
  context: string;
  speakers: Record<string, 'female' | 'male'>;
  script: ScriptLine[];
  groups: QuestionGroup[];
}
