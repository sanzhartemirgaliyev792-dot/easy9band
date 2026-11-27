import raw from "./passages.slot1.json";

export type PassageSlot = 1 | 2 | 3;

export type TfngQuestion = {
  number: number;
  type: "tfng";
  prompt: string;
  options: string[];
  answer: string;
  evidenceParagraph: string;
  explanation: string;
};

export type CompletionQuestion = {
  number: number;
  type: "completion";
  maxWords: number;
  prompt: string;
  answer: string;
  acceptedAnswers: string[];
  evidenceParagraph: string;
  explanation: string;
};

export type Question = TfngQuestion | CompletionQuestion;

export type Passage = {
  id: string;
  passageSlot: PassageSlot;
  topic: string;
  title: string;
  paragraphs: { label: string; text: string }[];
  questions: Question[];
};

// ---- Публичные типы (то, что уходит клиенту: без ответов и подсказок) ----
export type PublicTfngQuestion = Omit<TfngQuestion, "answer" | "explanation" | "evidenceParagraph">;
export type PublicCompletionQuestion = Omit<
  CompletionQuestion,
  "answer" | "acceptedAnswers" | "explanation" | "evidenceParagraph"
>;
export type PublicQuestion = PublicTfngQuestion | PublicCompletionQuestion;
export type PublicPassage = Omit<Passage, "questions"> & { questions: PublicQuestion[] };

const ALL = raw as Passage[];

// ---- Валидация данных при старте ----
function validate(list: Passage[]): void {
  const ids = new Set<string>();
  for (const p of list) {
    if (ids.has(p.id)) throw new Error(`Duplicate passage id ${p.id}`);
    ids.add(p.id);
    const labels = new Set(p.paragraphs.map((x) => x.label));
    p.questions.forEach((q, i) => {
      if (q.number !== i + 1) throw new Error(`${p.id}: question numbering broken at ${q.number}`);
      if (!labels.has(q.evidenceParagraph)) throw new Error(`${p.id} Q${q.number}: bad evidenceParagraph`);
      if (q.type === "tfng" && !q.options.includes(q.answer)) {
        throw new Error(`${p.id} Q${q.number}: answer not in options`);
      }
      if (q.type === "completion" && !q.acceptedAnswers.includes(q.answer)) {
        throw new Error(`${p.id} Q${q.number}: answer not in acceptedAnswers`);
      }
    });
  }
}
validate(ALL);

// ---- Выбор пассажей ----
export const getPassageById = (id: string): Passage | undefined => ALL.find((p) => p.id === id);

export const getPassagesBySlot = (slot: PassageSlot): Passage[] =>
  ALL.filter((p) => p.passageSlot === slot);

export function pickRandomPassage(slot: PassageSlot, excludeId?: string): Passage {
  const pool = getPassagesBySlot(slot);
  if (pool.length === 0) throw new Error(`No passages for slot ${slot}`);
  const candidates = pool.length > 1 ? pool.filter((p) => p.id !== excludeId) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ---- Версия для клиента ----
function toPublicQuestion(q: Question): PublicQuestion {
  if (q.type === "tfng") {
    const { answer, explanation, evidenceParagraph, ...publicPart } = q;
    return publicPart;
  }
  const { answer, acceptedAnswers, explanation, evidenceParagraph, ...publicPart } = q;
  return publicPart;
}

export function toPublic(p: Passage): PublicPassage {
  return { ...p, questions: p.questions.map(toPublicQuestion) };
}

// ---- Проверка ответов (только на сервере) ----
const normalize = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, " ");

export function isQuestionCorrect(q: Question, userAnswer: string): boolean {
  const given = normalize(userAnswer);
  if (given === "") return false;
  if (q.type === "tfng") {
    return given === normalize(q.answer);
  }
  return q.acceptedAnswers.some((a) => normalize(a) === given);
}

export type GradeResult = {
  correct: number;
  total: number;
  perQuestion: { number: number; correct: boolean }[];
};

export function gradePassage(p: Passage, answers: Record<number, string>): GradeResult {
  const perQuestion = p.questions.map((q) => ({
    number: q.number,
    correct: isQuestionCorrect(q, answers[q.number] ?? ""),
  }));
  return {
    correct: perQuestion.filter((x) => x.correct).length,
    total: p.questions.length,
    perQuestion,
  };
}
