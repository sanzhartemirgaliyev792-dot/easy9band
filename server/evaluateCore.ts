import { GoogleGenAI, Type } from '@google/genai';

const MODEL_CANDIDATES = ['gemini-3.1-flash-lite'] as const;

const SYSTEM_INSTRUCTION = `You are a strict, conservative British IELTS Examiner evaluating IELTS Writing Task 1 and Task 2 under official IELTS band descriptors.
Оценивай строго и объективно по 4 критериям IELTS Writing (на русском языке, кратко и по делу):
1. Task Achievement (Task 1) / Task Response (Task 2)
2. Coherence & Cohesion
3. Lexical Resource
4. Grammatical Range & Accuracy

Правила калибровки:
- Не завышай баллы. Обычная работа без глубокого анализа, сильных коллокаций и сложного синтаксиса — реалистично 6.0–7.0.
- 8.0+ ставь только за сильную работу с точной лексикой и сложным синтаксисом.
- При сомнении между двумя значениями на 0.5 выбирай меньшее.
- Учитывай объём слов (<150 для Task 1, <250 для Task 2 снижает Task Achievement / Task Response).
- Баллы критериев: 0.0–9.0 с шагом 0.5. overallBand — среднее 4 критериев, округлённое до ближайшего 0.5 (.25 -> .5, .75 -> вверх).
- В feedback и examinerSummary приводи конкретные цитаты из текста кандидата и объясняй, почему балл не выше.
- В corrections дай до 4 ключевых правок (Было -> Как лучше на Band 8.5 + краткое пояснение).
- В rewrittenEssay перепиши эссе на уровень Band 8.5+, сохранив смысл и идеи автора. Раздели абзацы через \\n\\n.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallBand: {
      type: Type.NUMBER,
      description: 'Итоговый общий балл IELTS Band Score (от 0.0 до 9.0 с шагом 0.5).',
    },
    cefrLevel: {
      type: Type.STRING,
      description: 'Уровень CEFR, например "B2", "C1" или "C2".',
    },
    examinerSummary: {
      type: Type.STRING,
      description: 'Краткое строгое резюме экзаменатора на русском языке (2–3 предложения).',
    },
    criteria: {
      type: Type.ARRAY,
      description: 'Оценка строго по 4 официальным критериям IELTS.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description:
              'Официальное название критерия (Task Response / Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy).',
          },
          band: {
            type: Type.NUMBER,
            description: 'Балл по критерию от 0.0 до 9.0 с шагом 0.5.',
          },
          feedback: {
            type: Type.STRING,
            description: 'Краткий разбор по критерию на русском языке с примерами из текста.',
          },
        },
        required: ['name', 'band', 'feedback'],
      },
    },
    corrections: {
      type: Type.ARRAY,
      description: 'Список ключевых правок в формате Было -> Как лучше на Band 8.5.',
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: 'Категория: "Грамматика", "Лексика" или "Стиль и связность".',
          },
          original: {
            type: Type.STRING,
            description: 'Фрагмент из текста пользователя (Было).',
          },
          improved: {
            type: Type.STRING,
            description: 'Улучшенный вариант на Band 8.5 (Как лучше на Band 8.5).',
          },
          explanation: {
            type: Type.STRING,
            description: 'Краткое пояснение на русском языке.',
          },
        },
        required: ['category', 'original', 'improved', 'explanation'],
      },
    },
    rewrittenEssay: {
      type: Type.STRING,
      description: 'Переписанное на уровень Band 8.5 эссе на английском языке с сохранением идей автора.',
    },
    rewriteHighlights: {
      type: Type.ARRAY,
      description: '2–3 ключевых приёма улучшения до Band 8.5 (на русском).',
      items: {
        type: Type.STRING,
      },
    },
  },
  required: [
    'overallBand',
    'cefrLevel',
    'examinerSummary',
    'criteria',
    'corrections',
    'rewrittenEssay',
    'rewriteHighlights',
  ],
};

interface EvaluateBody {
  taskType?: 'task1' | 'task2';
  topicPrompt?: string;
  tableDataText?: string;
  essayText?: string;
  wordCount?: number;
}

export interface EvaluateResult {
  status: number;
  body: unknown;
}

const MAX_ESSAY_CHARS = 20_000;
const MAX_PROMPT_CHARS = 6_000;

function getStatus(err: unknown): number {
  if (typeof err === 'object' && err !== null) {
    const anyErr = err as { status?: unknown; code?: unknown; error?: { code?: unknown } };
    if (typeof anyErr.status === 'number') return anyErr.status;
    if (typeof anyErr.code === 'number') return anyErr.code;
    if (typeof anyErr.error?.code === 'number') return anyErr.error.code;
  }
  return 0;
}

export async function evaluateEssay(rawBody: unknown): Promise<EvaluateResult> {
  try {
    const body = (rawBody ?? {}) as EvaluateBody;
    const taskType = body.taskType === 'task1' ? 'task1' : 'task2';
    const topicPrompt = typeof body.topicPrompt === 'string' ? body.topicPrompt.trim() : '';
    const tableDataText = typeof body.tableDataText === 'string' ? body.tableDataText.trim() : '';
    const essayText = typeof body.essayText === 'string' ? body.essayText.trim() : '';
    const wordCount = typeof body.wordCount === 'number' ? body.wordCount : 0;

    if (!topicPrompt) {
      return { status: 400, body: { error: 'Укажите тему или задание эссе перед проверкой.' } };
    }
    if (!essayText || essayText.length < 20) {
      return { status: 400, body: { error: 'Текст эссе слишком короткий для объективной оценки.' } };
    }
    if (essayText.length > MAX_ESSAY_CHARS || topicPrompt.length > MAX_PROMPT_CHARS || tableDataText.length > MAX_PROMPT_CHARS) {
      return { status: 400, body: { error: 'Текст слишком длинный для проверки. Сократите его и попробуйте снова.' } };
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set on the server.');
      return { status: 500, body: { error: 'Сервис проверки временно недоступен. Пожалуйста, попробуйте позже.' } };
    }

    const ai = new GoogleGenAI({ apiKey });

    const taskLabel =
      taskType === 'task1' ? 'IELTS Writing Task 1 (Academic Report, min 150 words)' : 'IELTS Writing Task 2 (Essay, min 250 words)';
    const userPrompt = [
      `Тип задания: ${taskLabel}`,
      `Тема:\n${topicPrompt}`,
      tableDataText ? `Данные таблицы:\n${tableDataText}` : '',
      `Слов: ${wordCount}`,
      `Эссе:\n"""\n${essayText}\n"""`,
    ]
      .filter(Boolean)
      .join('\n\n');

    let response;
    let lastError: unknown;
    const maxAttemptsPerModel = 2;

    for (const modelName of MODEL_CANDIDATES) {
      let shouldTryNextModel = false;

      for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.1,
              maxOutputTokens: 2200,
              responseMimeType: 'application/json',
              responseSchema: RESPONSE_SCHEMA,
            },
          });
          lastError = undefined;
          break;
        } catch (attemptErr: unknown) {
          lastError = attemptErr;
          const msg = attemptErr instanceof Error ? attemptErr.message : String(attemptErr);
          const errStatus = getStatus(attemptErr);

          if (errStatus === 404 || msg.includes('404') || msg.includes('NOT_FOUND')) {
            shouldTryNextModel = true;
            break;
          }

          if (errStatus === 429 || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
            shouldTryNextModel = true;
            break;
          }

          const isTransient503 =
            errStatus === 503 || msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('overloaded');

          if (isTransient503) {
            if (attempt < maxAttemptsPerModel) {
              await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
              continue;
            }
            shouldTryNextModel = true;
            break;
          }

          throw attemptErr;
        }
      }

      if (response) break;
      if (!shouldTryNextModel) break;
    }

    if (!response && lastError) {
      throw lastError;
    }

    const rawText = response?.text?.trim();
    if (!rawText) {
      return { status: 502, body: { error: 'Модель вернула пустой ответ. Попробуйте повторить проверку.' } };
    }

    return { status: 200, body: JSON.parse(rawText) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const status = getStatus(err);

    console.error('Evaluation failed:', message);

    if (status === 429 || message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      return { status: 429, body: { error: 'Сервис сейчас перегружен запросами. Подождите немного и попробуйте снова.' } };
    }
    if (status === 503 || message.includes('503') || message.includes('UNAVAILABLE')) {
      return { status: 503, body: { error: 'Сервис временно перегружен. Пожалуйста, повторите проверку через несколько секунд.' } };
    }
    return { status: 500, body: { error: 'Не удалось выполнить проверку. Пожалуйста, попробуйте ещё раз чуть позже.' } };
  }
}
