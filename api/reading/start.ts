import { startReading } from '../../server/reading/readingCore.js';

export async function GET(request: Request): Promise<Response> {
  const lastId = new URL(request.url).searchParams.get('lastId');
  const { status, body } = startReading(lastId);
  // Ответ случайный — кэшировать его нельзя ни в браузере, ни на CDN.
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
