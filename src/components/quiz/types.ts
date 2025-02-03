export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  feedback: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface QuizFormData {
  quizName: string;
  courseContent: string;
  courseFile: File | null;
  quizType: string;
  learningObjectives: string;
  difficultyLevel: string;
  numberOfQuestions: number;
}