export type TaskType = 'task1' | 'task2';

export interface TaskDataRow {
  label: string;
  values: string[];
}

export interface IeltsTopic {
  id: string;
  taskType: TaskType;
  category: string;
  questionType: string;
  prompt: string;
  dataTable?: {
    headers: string[];
    rows: TaskDataRow[];
  };
}

export interface CriterionEvaluation {
  name: string;
  band: number;
  feedback: string;
}

export interface EssayCorrection {
  category: string;
  original: string;
  improved: string;
  explanation: string;
}

export interface EvaluationResult {
  overallBand: number;
  cefrLevel: string;
  examinerSummary: string;
  criteria: CriterionEvaluation[];
  corrections: EssayCorrection[];
  rewrittenEssay: string;
  rewriteHighlights: string[];
}
