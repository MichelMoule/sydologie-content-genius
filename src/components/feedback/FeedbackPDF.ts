import jsPDF from "jspdf";
import { AnalysisData } from "./types";

export const generateFeedbackPDF = (analysis: AnalysisData) => {
  const pdf = new jsPDF();
  let yPosition = 20;
  const lineHeight = 10;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.width;

  // Configuration des styles
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.setTextColor(27, 77, 62); // sydologie.green

  // Titre principal
  pdf.text(`📊 Analyse des retours : ${analysis.subject}`, margin, yPosition);
  yPosition += lineHeight * 2;

  // Informations de base
  pdf.setFontSize(14);
  pdf.setTextColor(51, 51, 51);
  pdf.text(`❓ Question posée : ${analysis.question}`, margin, yPosition);
  yPosition += lineHeight;
  pdf.text(`👥 Nombre de réponses : ${analysis.totalResponses}`, margin, yPosition);
  yPosition += lineHeight * 2;

  // Résumé global
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(27, 77, 62);
  pdf.text("📝 Résumé global", margin, yPosition);
  yPosition += lineHeight;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(51, 51, 51);
  const summaryLines = pdf.splitTextToSize(analysis.summary, pageWidth - 2 * margin);
  pdf.text(summaryLines, margin, yPosition);
  yPosition += (summaryLines.length * lineHeight) + lineHeight * 1.5;

  // Analyse par thème
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(27, 77, 62);
  pdf.text("🎯 Analyse par thème", margin, yPosition);
  yPosition += lineHeight * 2;

  analysis.themes.forEach((theme) => {
    // Vérifier si on a besoin d'une nouvelle page
    if (yPosition > pdf.internal.pageSize.height - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    // Titre du thème avec pourcentage
    const emoji = theme.isNegative ? "⚠️" : "✅";
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    
    // Fix: Properly set text color based on theme
    if (theme.isNegative) {
      pdf.setTextColor(255, 75, 75);
    } else {
      pdf.setTextColor(27, 77, 62);
    }
    
    pdf.text(`${emoji} ${theme.title}`, margin, yPosition);
    
    // Pourcentage sur la même ligne, aligné à droite
    const percentageText = `${theme.percentage}%`;
    const percentageWidth = pdf.getStringUnitWidth(percentageText) * 16 / pdf.internal.scaleFactor;
    pdf.text(percentageText, pageWidth - margin - percentageWidth, yPosition);
    
    yPosition += lineHeight * 1.5;

    // Description du thème
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(51, 51, 51);
    const descLines = pdf.splitTextToSize(theme.description, pageWidth - 2 * margin);
    pdf.text(descLines, margin, yPosition);
    yPosition += (descLines.length * lineHeight) + lineHeight;

    // Témoignages
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(102, 102, 102);
    theme.testimonials.forEach((testimonial) => {
      if (yPosition > pdf.internal.pageSize.height - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Ajout d'une bordure grise à gauche pour les témoignages
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 5, yPosition - 5, margin + 5, yPosition + 15);
      
      const testLines = pdf.splitTextToSize(`"${testimonial}"`, pageWidth - 2 * margin - 15);
      pdf.text(testLines, margin + 10, yPosition);
      yPosition += (testLines.length * lineHeight) + 5;
    });

    // Suggestions d'amélioration pour les thèmes négatifs
    if (theme.isNegative && theme.improvements) {
      if (yPosition > pdf.internal.pageSize.height - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(255, 75, 75);
      pdf.text("💡 Suggestions d'amélioration:", margin, yPosition);
      yPosition += lineHeight * 1.5;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(51, 51, 51);
      theme.improvements.forEach((improvement) => {
        const bulletPoint = "•";
        const impLines = pdf.splitTextToSize(improvement, pageWidth - 2 * margin - 15);
        
        pdf.text(bulletPoint, margin + 5, yPosition);
        pdf.text(impLines, margin + 15, yPosition);
        
        yPosition += (impLines.length * lineHeight) + 5;
      });
    }

    yPosition += lineHeight * 1.5;
  });

  // Pied de page
  const today = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Rapport généré le ${today} via FEEDBAICK`, margin, pdf.internal.pageSize.height - 10);

  pdf.save(`analyse_${analysis.subject.toLowerCase().replace(/\s+/g, '_')}.pdf`);
};