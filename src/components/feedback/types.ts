export interface Theme {
  title: string;
  percentage: number;
  description: string;
  testimonials: string[];
  isNegative: boolean;
  improvements?: string[];
}

export interface AnalysisData {
  subject: string;
  question: string;
  totalResponses: number;
  summary: string;
  themes: Theme[];
}