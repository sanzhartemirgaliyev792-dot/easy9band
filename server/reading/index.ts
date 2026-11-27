import passagesSlot1 from './passages.slot1.json' with { type: 'json' };

export type Paragraph = {
  label: string;
  text: string;
};

export type Question =
  | {
      number: number;
      type: "tfng";
      prompt: string;
      options: string[];
      answer: string;
      acceptedAnswers?: string[];
      evidenceParagraph?: string;
      explanation?: string;
    }
  | {
      number: number;
      type: "completion";
      maxWords: number;
      prompt: string;
      answer: string;
      acceptedAnswers?: string[];
      evidenceParagraph?: string;
      explanation?: string;
    };

export type Passage = {
  id: string;
  passageSlot: 1 | 2 | 3;
  topic: string;
  title: string;
  paragraphs: Paragraph[];
  questions: Question[];
};

export type PublicQuestion =
  | { number: number; type: "tfng"; prompt: string; options: string[] }
  | { number: number; type: "completion"; prompt: string; maxWords: number };

export type PublicPassage = {
  id: string;
  passageSlot: 1 | 2 | 3;
  topic: string;
  title: string;
  paragraphs: Paragraph[];
  questions: PublicQuestion[];
};

export type GradeResult = {
  correct: number;
  total: number;
  perQuestion: { number: number; correct: boolean }[];
};

const passages = rawPassages as unknown as Passage[];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function getPassageById(id: string): Passage | undefined {
  return passages.find((p) => p.id === id);
}

export function pickRandomPassage(slot: 1 | 2 | 3, excludeId?: string): Passage {
  const pool = passages.filter((p) => p.passageSlot === slot);
  const candidates = pool.length > 0 ? pool : passages;
  const filtered = excludeId ? candidates.filter((p) => p.id !== excludeId) : candidates;
  const source = filtered.length > 0 ? filtered : candidates;
  const index = Math.floor(Math.random() * source.length);
  return source[index];
}

export function toPublic(passage: Passage): PublicPassage {
  return {
    id: passage.id,
    passageSlot: passage.passageSlot,
    topic: passage.topic,
    title: passage.title,
    paragraphs: passage.paragraphs.map((p) => ({ label: p.label, text: p.text })),
    questions: passage.questions.map((q) => {
      if (q.type === "tfng") {
        return {
          number: q.number,
          type: "tfng",
          prompt: q.prompt,
          options: [...q.options],
        };
      }
      return {
        number: q.number,
        type: "completion",
        prompt: q.prompt,
        maxWords: q.maxWords,
      };
    }),
  };
}

export function gradePassage(passage: Passage, answers: Record<number, string>): GradeResult {
  const perQuestion = passage.questions.map((q) => {
    const rawUserAnswer = answers[q.number] ?? "";
    const normalizedUser = normalize(rawUserAnswer);

    if (!normalizedUser) {
      return { number: q.number, correct: false };
    }

    if (q.type === "completion" && countWords(normalizedUser) > q.maxWords) {
      return { number: q.number, correct: false };
    }

    const allowed = [q.answer, ...(q.acceptedAnswers ?? [])].map((item) => normalize(item));
    const isCorrect = allowed.includes(normalizedUser);

    return { number: q.number, correct: isCorrect };
  });

  const correct = perQuestion.filter((item) => item.correct).length;

  return {
    correct,
    total: passage.questions.length,
    perQuestion,
  };
}
