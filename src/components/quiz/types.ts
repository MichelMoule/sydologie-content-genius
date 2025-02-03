export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface QuizFormData {
  quizName: string;
  courseContent: string;
  difficultyLevel: string;
  numberOfQuestions: number;
}