import jsPDF from "jspdf";
import { AnalysisData } from "./types";

export const generateFeedbackPDF = (analysis: AnalysisData) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
    putOnlyUsedFonts: true,
    floatPrecision: 16
  });

  // Add Unicode font support
  pdf.addFont("helvetica", "normal");
  
  let yPosition = 20;
  const lineHeight = 7;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const maxWidth = pageWidth - (2 * margin);

  // Helper function to calculate text height
  const calculateTextHeight = (text: string, fontSize: number = 12, indent: number = 0) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth - indent);
    return lines.length * lineHeight;
  };

  // Helper function to check if we need a new page
  const checkAndAddNewPage = (neededHeight: number) => {
    if (yPosition + neededHeight > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Helper function to add text and return new Y position
  const addText = (text: string, y: number, options: {
    fontSize?: number;
    isBold?: boolean;
    color?: [number, number, number];
    indent?: number;
    isHeader?: boolean;
  } = {}) => {
    const {
      fontSize = 12,
      isBold = false,
      color = [0, 0, 0],
      indent = 0,
      isHeader = false
    } = options;

    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    pdf.setTextColor(color[0], color[1], color[2]);

    const lines = pdf.splitTextToSize(text, maxWidth - indent);
    const textHeight = lines.length * lineHeight;
    
    // Check if we need a new page before adding text
    if (!isHeader && checkAndAddNewPage(textHeight)) {
      y = 20;
    }
    
    if (isHeader) {
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, y - 5, maxWidth, 10 + textHeight, 'F');
    }
    
    lines.forEach((line: string, index: number) => {
      pdf.text(line, margin + indent, y + (index * lineHeight));
    });
    
    return y + textHeight + (isHeader ? 5 : 0);
  };

  // Title (training name)
  yPosition = addText(analysis.subject, yPosition, { 
    fontSize: 24, 
    isBold: true,
    isHeader: true 
  });
  yPosition += lineHeight;

  // Question and responses count
  yPosition = addText("Question posée : " + analysis.question, yPosition);
  yPosition = addText("Nombre de réponses : " + analysis.totalResponses, yPosition);
  yPosition += lineHeight * 2;

  // Global summary
  yPosition = addText("Résumé global", yPosition, { 
    fontSize: 18, 
    isBold: true 
  });
  yPosition = addText(analysis.summary, yPosition);
  yPosition += lineHeight * 2;

  // Themes analysis
  yPosition = addText("Analyse par thème", yPosition, { 
    fontSize: 18, 
    isBold: true 
  });
  yPosition += lineHeight;

  // Process each theme
  analysis.themes.forEach((theme) => {
    // Calculate total height needed for this theme
    let contentHeight = 0;
    contentHeight += calculateTextHeight(`${theme.title}`, 16);
    contentHeight += calculateTextHeight(theme.description);
    contentHeight += calculateTextHeight("Témoignages représentatifs :", 14);
    theme.testimonials.forEach((testimonial) => {
      contentHeight += calculateTextHeight(`• ${testimonial}`, 12, 5);
    });

    if (theme.isNegative && theme.improvements) {
      contentHeight += lineHeight;
      contentHeight += calculateTextHeight("Suggestions d'amélioration :", 14);
      theme.improvements.forEach((improvement) => {
        contentHeight += calculateTextHeight(`• ${improvement}`, 12, 5);
      });
    }

    // Add padding
    contentHeight += lineHeight * 3;

    // Check if we need a new page
    if (checkAndAddNewPage(contentHeight)) {
      yPosition = 20;
    }

    const startY = yPosition - 5;

    const bgColor: [number, number, number] = theme.isNegative ? 
      [254, 242, 242] : 
      [240, 253, 244];
    
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    pdf.rect(margin, startY, maxWidth, contentHeight, 'F');

    const themeIcon = theme.isNegative ? "!" : "✓";
    yPosition = addText(
      `${themeIcon} ${theme.title}`,
      yPosition,
      { fontSize: 16, isBold: true }
    );
    
    pdf.text(
      `${theme.percentage}%`,
      pageWidth - margin - 10,
      yPosition - lineHeight
    );

    yPosition += lineHeight;
    yPosition = addText(theme.description, yPosition);
    yPosition += lineHeight;

    yPosition = addText("Témoignages représentatifs :", yPosition, { 
      fontSize: 14,
      isBold: true 
    });
    theme.testimonials.forEach((testimonial) => {
      yPosition = addText(`• ${testimonial}`, yPosition, { indent: 5 });
    });

    if (theme.isNegative && theme.improvements) {
      yPosition += lineHeight;
      yPosition = addText("Suggestions d'amélioration :", yPosition, { 
        fontSize: 14,
        isBold: true 
      });
      theme.improvements.forEach((improvement) => {
        yPosition = addText(`• ${improvement}`, yPosition, { indent: 5 });
      });
    }

    yPosition += lineHeight * 2;
  });

  const today = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Rapport généré le ${today} via Sydologie.ai`,
    margin,
    pdf.internal.pageSize.height - 10
  );

  const filename = `analyse_${analysis.subject.toLowerCase().replace(/\s+/g, '_')}.pdf`;
  pdf.save(filename);
};