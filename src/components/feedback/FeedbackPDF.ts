import jsPDF from "jspdf";
import { AnalysisData } from "./types";

export const generateFeedbackPDF = (analysis: AnalysisData, trainingName: string) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set font
  doc.setFont("helvetica");

  // Title
  doc.setFontSize(24);
  doc.text(`Analyse des retours: ${trainingName}`, 20, 20);

  // Sentiment score
  doc.setFontSize(16);
  doc.text(`Score de sentiment: ${analysis.sentimentScore}/10`, 20, 40);

  // Key themes
  doc.setFontSize(14);
  doc.text("Thèmes principaux:", 20, 60);
  analysis.keyThemes.forEach((theme, index) => {
    doc.text(`- ${theme}`, 25, 70 + (index * 10));
  });

  // Recommendations
  const recommendationsY = 70 + (analysis.keyThemes.length * 10) + 10;
  doc.text("Recommandations:", 20, recommendationsY);
  analysis.recommendations.forEach((rec, index) => {
    doc.text(`- ${rec}`, 25, recommendationsY + 10 + (index * 10));
  });

  // Save the PDF
  doc.save(`analyse-${trainingName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};