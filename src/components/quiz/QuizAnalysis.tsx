import { QuizData } from "./types";

interface QuizAnalysisProps {
  quiz: QuizData;
}

export const QuizAnalysis = ({ quiz }: QuizAnalysisProps) => {
  return (
    <div className="space-y-8 p-6">
      {quiz.questions.map((question, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">
            Question {index + 1}: {question.question}
          </h3>
          <div className="space-y-2 mb-4">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`p-3 rounded-md ${
                  optionIndex === question.correctAnswer
                    ? "bg-green-100 border-green-500 border"
                    : "bg-gray-50"
                }`}
              >
                {String.fromCharCode(65 + optionIndex)}. {option}
                {optionIndex === question.correctAnswer && (
                  <span className="ml-2 text-green-600 font-semibold">
                    ✓ Réponse correcte
                  </span>
                )}
              </div>
            ))}
          </div>
          {question.feedback && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Feedback :</h4>
              <p className="text-blue-700">{question.feedback}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};