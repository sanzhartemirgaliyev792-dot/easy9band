import { getPassageById, gradePassage, pickRandomPassage, toPublic } from "./index.js";
import type { GradeResult, PublicPassage } from "./index.js";

type CoreResult<T> = { status: number; body: T | { error: string } };

const MAX_ANSWER_LENGTH = 200;

/** Выдаёт случайный текст для слота 1 без ответов и подсказок. */
export function startReading(lastId: string | null): CoreResult<{ passages: PublicPassage[] }> {
  try {
    const passage = pickRandomPassage(1, lastId ?? undefined);
    return { status: 200, body: { passages: [toPublic(passage)] } };
  } catch (err) {
    console.error("startReading failed:", err);
    return { status: 500, body: { error: "Не удалось загрузить текст." } };
  }
}

/** Проверяет ответы пользователя. Ответы и объяснения клиенту не отдаются. */
export function submitReading(body: unknown): CoreResult<GradeResult> {
  if (typeof body !== "object" || body === null) {
    return { status: 400, body: { error: "Некорректный запрос." } };
  }
  const { passageId, answers } = body as { passageId?: unknown; answers?: unknown };
  if (
    typeof passageId !== "string" ||
    typeof answers !== "object" ||
    answers === null ||
    Array.isArray(answers)
  ) {
    return { status: 400, body: { error: "Некорректный запрос." } };
  }

  const passage = getPassageById(passageId);
  if (!passage) {
    return { status: 404, body: { error: "Текст не найден." } };
  }

  const clean: Record<number, string> = {};
  for (const [key, value] of Object.entries(answers)) {
    const number = Number(key);
    if (Number.isInteger(number) && typeof value === "string") {
      clean[number] = value.slice(0, MAX_ANSWER_LENGTH);
    }
  }

  return { status: 200, body: gradePassage(passage, clean) };
}
