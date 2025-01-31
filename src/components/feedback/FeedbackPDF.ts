import jsPDF from "jspdf";
import { AnalysisData } from "./types";

export const generateFeedbackPDF = (analysis: AnalysisData) => {
  // Initialize PDF with Unicode support
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Add Unicode font support
  pdf.addFont("helvetica", "normal");
  
  let yPosition = 20;
  const lineHeight = 7;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.width;
  const maxWidth = pageWidth - (2 * margin);

  // Helper function to add text and return new Y position
  const addText = (text: string, y: number, options: {
    fontSize?: number;
    isBold?: boolean;
    color?: [number, number, number];
    indent?: number;
  } = {}) => {
    const {
      fontSize = 12,
      isBold = false,
      color = [0, 0, 0],
      indent = 0
    } = options;

    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    pdf.setTextColor(color[0], color[1], color[2]);

    const lines = pdf.splitTextToSize(text, maxWidth - indent);
    pdf.text(lines, margin + indent, y);
    
    return y + (lines.length * lineHeight);
  };

  // Title
  yPosition = addText(
    `Analyse des retours : ${analysis.subject}`,
    yPosition,
    { fontSize: 24, isBold: true, color: [27, 77, 62] }
  );
  yPosition += lineHeight;

  // Basic information
  yPosition = addText(
    `Question posée : ${analysis.question}`,
    yPosition,
    { fontSize: 14 }
  );
  yPosition = addText(
    `Nombre de réponses : ${analysis.totalResponses}`,
    yPosition,
    { fontSize: 14 }
  );
  yPosition += lineHeight;

  // Global summary
  yPosition = addText(
    "Résumé global",
    yPosition,
    { fontSize: 18, isBold: true, color: [27, 77, 62] }
  );
  yPosition = addText(analysis.summary, yPosition);
  yPosition += lineHeight * 2;

  // Themes analysis
  yPosition = addText(
    "Analyse par thème",
    yPosition,
    { fontSize: 18, isBold: true, color: [27, 77, 62] }
  );
  yPosition += lineHeight;

  // Process each theme
  analysis.themes.forEach((theme) => {
    // Check if we need a new page
    if (yPosition > pdf.internal.pageSize.height - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    // Theme header
    const themeColor: [number, number, number] = theme.isNegative ? [255, 75, 75] : [27, 77, 62];
    const themeIcon = theme.isNegative ? "⚠️" : "✅";
    
    yPosition = addText(
      `${themeIcon} ${theme.title} (${theme.percentage}%)`,
      yPosition,
      { fontSize: 16, isBold: true, color: themeColor }
    );
    yPosition += lineHeight;

    // Theme description
    yPosition = addText(theme.description, yPosition);
    yPosition += lineHeight;

    // Testimonials
    yPosition = addText(
      "Témoignages représentatifs :",
      yPosition,
      { fontSize: 14, isBold: true }
    );
    yPosition += lineHeight / 2;

    theme.testimonials.forEach((testimonial) => {
      yPosition = addText(`• ${testimonial}`, yPosition, { indent: 5 });
    });

    // Improvements for negative themes
    if (theme.isNegative && theme.improvements) {
      yPosition += lineHeight;
      yPosition = addText(
        "Suggestions d'amélioration :",
        yPosition,
        { fontSize: 14, isBold: true }
      );
      yPosition += lineHeight / 2;

      theme.improvements.forEach((improvement) => {
        yPosition = addText(`• ${improvement}`, yPosition, { indent: 5 });
      });
    }

    yPosition += lineHeight * 2;
  });

  // Footer
  const today = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Rapport généré le ${today} via FEEDBAICK`,
    margin,
    pdf.internal.pageSize.height - 10
  );

  // Save the PDF
  const filename = `analyse_${analysis.subject.toLowerCase().replace(/\s+/g, '_')}.pdf`;
  pdf.save(filename);
};