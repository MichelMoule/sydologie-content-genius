import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { AnalysisData } from "./types";
import { generateFeedbackPDF } from "./FeedbackPDF";

interface FeedbackAnalysisProps {
  analysis: AnalysisData;
}

export const FeedbackAnalysis = ({ analysis }: FeedbackAnalysisProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">{analysis.subject}</h2>
        <p className="text-gray-600 mb-2">❓ Question posée : {analysis.question}</p>
        <p className="text-gray-600">👥 Nombre de réponses : {analysis.totalResponses}</p>
      </div>

      <div className="prose prose-sm max-w-none">
        <h3 className="text-xl font-semibold mb-4">📝 Résumé global</h3>
        <p>{analysis.summary}</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">🎯 Analyse par thème</h3>
        {analysis.themes.map((theme, index) => (
          <div 
            key={index}
            className={`p-6 rounded-lg ${
              theme.isNegative ? 'bg-red-50' : 'bg-green-50'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold">
                {theme.isNegative ? "⚠️" : "✅"} {theme.title}
              </h4>
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-white">
                {theme.percentage}%
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{theme.description}</p>
            
            <div className="space-y-2">
              <h5 className="font-medium">💬 Témoignages représentatifs :</h5>
              <ul className="list-disc pl-5 space-y-2">
                {theme.testimonials.map((testimonial, tIndex) => (
                  <li key={tIndex} className="text-gray-600">
                    {testimonial}
                  </li>
                ))}
              </ul>
            </div>

            {theme.isNegative && theme.improvements && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium mb-2">💡 Suggestions d'amélioration :</h5>
                <ul className="list-disc pl-5 space-y-2">
                  {theme.improvements.map((improvement, iIndex) => (
                    <li key={iIndex} className="text-gray-600">
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};