export type PublicQuestion =
  | { number: number; type: "tfng"; prompt: string; options: string[] }
  | { number: number; type: "completion"; prompt: string; maxWords: number };

export type PublicPassage = {
  id: string;
  passageSlot: 1 | 2 | 3;
  topic: string;
  title: string;
  paragraphs: { label: string; text: string }[];
  questions: PublicQuestion[];
};

export type GradeResult = {
  correct: number;
  total: number;
  perQuestion: { number: number; correct: boolean }[];
};
