import type { GradeResult, PublicPassage } from "./types";

async function readJson<T>(res: Response): Promise<T> {
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && typeof (data as { error?: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Ошибка ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export async function fetchPassage(lastId?: string): Promise<PublicPassage> {
  const query = lastId ? `?lastId=${encodeURIComponent(lastId)}` : "";
  const res = await fetch(`/api/reading/start${query}`, { cache: "no-store" });
  const data = await readJson<{ passages: PublicPassage[] }>(res);
  const passage = data.passages[0];
  if (!passage) throw new Error("Сервер не вернул текст.");
  return passage;
}

export async function submitAnswers(
  passageId: string,
  answers: Record<number, string>,
): Promise<GradeResult> {
  const res = await fetch("/api/reading/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passageId, answers }),
  });
  return readJson<GradeResult>(res);
}
