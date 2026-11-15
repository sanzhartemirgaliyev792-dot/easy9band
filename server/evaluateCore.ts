import { GoogleGenAI, Type } from '@google/genai';

const MODEL_CANDIDATES = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'] as const;

const SYSTEM_INSTRUCTION = `You are a strict, professional, and authoritative British IELTS Examiner evaluating IELTS Writing Task 1 and Task 2 submissions with absolute academic rigor.
Оценивай работу строго по 4 официальным критериям IELTS Writing:
1. Task Achievement (для Task 1) или Task Response (для Task 2)
2. Coherence & Cohesion
3. Lexical Resource
4. Grammatical Range & Accuracy

Принципы строгого оценивания:
- Никогда не завышай баллы ("Do not inflate scores"). Оценивай максимально принципиально, как старший британский экзаменатор.
- Будь предельно критичен к грамматическим ошибкам (артикли, предлоги, времена, согласование подлежащего и сказуемого, пунктуация), неестественным для носителя формулировкам и калькой с других языков ("unnatural phrasing"), слабому раскрытию темы или отсутствию четкого Overview в Task 1 ("poor task achievement"), а также к слабой логической связности, резким переходам и механическим клише-связкам ("weak coherence").
- Учитывай требование к объему: если в Task 1 заметно меньше 150 слов или в Task 2 заметно меньше 250 слов, строго снижай оценку по первому критерию (Task Achievement / Task Response).
- Баллы по каждому из 4 критериев выставляй строго по официальным дескрипторам IELTS в диапазоне от 0.0 до 9.0 с шагом 0.5 (например, 5.0, 5.5, 6.0, 6.5, 7.0).
- Выведи общий Band Score (overallBand), рассчитанный строго по официальным правилам округления IELTS (среднее арифметическое 4 критериев, округленное до ближайших 0.5: .25 -> .5, .75 -> целое вверх).
- В поле examinerSummary и в feedback по каждому из 4 критериев на русском языке подробно и конструктивно объясни, **почему были снижены баллы** (какие именно дефекты помешали получить более высокий Band), обязательно подкрепляя разбор точными английскими цитатами из работы кандидата.
- В разделе разбора ошибок (corrections) выдели конкретные грамматические, лексические и стилистические ошибки из текста пользователя в формате «Было» (точная цитата) -> «Как лучше на Band 8.5» (точная и естественная академическая формулировка британского стандарта) + краткое пояснение причины снижения балла.
- В самом конце (rewrittenEssay) полностью перепиши работу кандидата на эталонный уровень **Band 8.5+** на безупречном академическом британском английском, обязательно сохранив исходные идеи, позицию и аргументы пользователя, но устранив все ошибки и подняв структуру, связность, лексику и грамматический диапазон до уровня Band 8.5+. Раздели эталонный текст на четкие абзацы через двойной перенос строки.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallBand: {
      type: Type.NUMBER,
      description: 'Итоговый общий балл IELTS Band Score (от 0.0 до 9.0 с шагом 0.5).',
    },
    cefrLevel: {
      type: Type.STRING,
      description: 'Соответствующий уровень CEFR, например "B2", "C1" или "C2".',
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
              'Официальное название критерия на английском (Task Response / Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy).',
          },
          band: {
            type: Type.NUMBER,
            description: 'Балл по критерию от 0.0 до 9.0 с шагом 0.5.',
          },
          feedback: {
            type: Type.STRING,
            description: 'Конструктивный разбор по критерию на русском языке с примерами из текста.',
          },
        },
        required: ['name', 'band', 'feedback'],
      },
    },
    corrections: {
      type: Type.ARRAY,
      description: 'Список конкретных ошибок из текста пользователя в формате Было -> Как лучше на Band 8.5.',
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: 'Категория ошибки: "Грамматика", "Лексика" или "Стиль и связность".',
          },
          original: {
            type: Type.STRING,
            description: 'Точный фрагмент с ошибкой или слабой формулировкой из текста пользователя (Было).',
          },
          improved: {
            type: Type.STRING,
            description: 'Улучшенный вариант на уровень Band 8.5 (Как лучше на Band 8.5).',
          },
          explanation: {
            type: Type.STRING,
            description: 'Краткое пояснение ошибки на русском языке.',
          },
        },
        required: ['category', 'original', 'improved', 'explanation'],
      },
    },
    rewrittenEssay: {
      type: Type.STRING,
      description:
        'Полностью переписанное на уровень Band 8.5 эссе на английском языке, сохраняющее исходные аргументы пользователя.',
    },
    rewriteHighlights: {
      type: Type.ARRAY,
      description: '2–3 ключевых приема, примененных при улучшении эссе до Band 8.5 (на русском).',
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
  return typeof err === 'object' && err !== null && 'status' in err && typeof (err as { status?: unknown }).status === 'number'
    ? (err as { status: number }).status
    : 0;
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
      `Формулировка темы:\n${topicPrompt}`,
      tableDataText ? `Исходные данные таблицы:\n${tableDataText}` : '',
      `Количество слов у кандидата: ${wordCount}`,
      `Текст работы кандидата:\n\"\"\"\n${essayText}\n\"\"\"`,
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

    // Подробности пишем только в серверный лог, пользователю показываем нейтральные сообщения.
    console.error('Evaluation failed:', message);

    if (status === 429 || message.includes('RESOURCE_EXHAUSTED')) {
      return { status: 429, body: { error: 'Сервис сейчас перегружен запросами. Подождите немного и попробуйте снова.' } };
    }
    if (status === 503 || message.includes('503') || message.includes('UNAVAILABLE')) {
      return { status: 503, body: { error: 'Сервис временно перегружен. Пожалуйста, повторите проверку через несколько секунд.' } };
    }
    return { status: 500, body: { error: 'Не удалось выполнить проверку. Пожалуйста, попробуйте ещё раз чуть позже.' } };
  }
}
