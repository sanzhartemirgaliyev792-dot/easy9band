import { evaluateEssay } from '../server/evaluateCore.js';

export async function POST(request: Request): Promise<Response> {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Некорректный запрос.' }, { status: 400 });
  }
  const { status, body: payload } = await evaluateEssay(body);
  return Response.json(payload, { status });
}
