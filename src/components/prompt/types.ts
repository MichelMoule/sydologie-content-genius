
export interface PromptFormData {
  mode: 'generate' | 'improve';
  need: string;
  context?: string;
  audience?: string;
  tone?: string;
  complexity?: string;
  prompt?: string;
}

export interface GeneratedPromptSection {
  title: string;
  content: string;
  purpose: string;
}

export interface GeneratedPrompt {
  prompt: string;
  explanation: string;
  sections: GeneratedPromptSection[];
}

export interface PromptImprovement {
  type: string;
  description: string;
  reason: string;
}

export interface ImprovedPrompt {
  score: number;
  evaluation: {
    strengths: string[];
    weaknesses: string[];
  };
  improvedPrompt: string;
  improvements: PromptImprovement[];
}

export type PromptResult = GeneratedPrompt | ImprovedPrompt;
