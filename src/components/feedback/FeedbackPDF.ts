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

  // Summary
  doc.setFontSize(16);
  doc.text(`Résumé: ${analysis.summary}`, 20, 40);

  // Themes
  doc.setFontSize(14);
  doc.text("Thèmes principaux:", 20, 60);
  analysis.themes.forEach((theme, index) => {
    const yPos = 70 + (index * 20);
    doc.text(`- ${theme.title} (${theme.percentage}%)`, 25, yPos);
    doc.text(`  ${theme.description}`, 25, yPos + 10);
  });

  // Save the PDF
  doc.save(`analyse-${trainingName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};