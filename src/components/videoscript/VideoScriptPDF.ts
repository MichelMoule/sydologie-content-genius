
import { jsPDF } from "jspdf";
import { VideoScriptData } from "./types";

export const generateVideoScriptPDF = (scriptData: VideoScriptData, scriptName: string) => {
  const doc = new jsPDF();
  let y = 20;
  const lineHeight = 7;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);
  
  // Helper function for text wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };
  
  // Helper function to check if we need a new page
  const checkForNewPage = (currentY: number, spaceNeeded: number): number => {
    if (currentY + spaceNeeded > 280) {
      doc.addPage();
      return 20;
    }
    return currentY;
  };
  
  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  y = addWrappedText(scriptData.title, margin, y, contentWidth, lineHeight * 1.5);
  
  // Basic info
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  y += lineHeight;
  doc.text(`Public cible: ${scriptData.targetAudience}`, margin, y);
  y += lineHeight;
  doc.text(`Durée: ${scriptData.duration}`, margin, y);
  y += lineHeight * 1.5;
  
  // Learning objectives
  doc.setFont("helvetica", "bold");
  doc.text("Objectifs d'apprentissage:", margin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  
  scriptData.learningObjectives.forEach(objective => {
    y = checkForNewPage(y, lineHeight);
    doc.text(`• ${objective}`, margin + 5, y);
    y += lineHeight;
  });
  
  y += lineHeight * 0.5;
  
  // Overview
  y = checkForNewPage(y, lineHeight * 3);
  doc.setFont("helvetica", "bold");
  doc.text("Aperçu:", margin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  y = addWrappedText(scriptData.overview, margin, y, contentWidth, lineHeight);
  
  y += lineHeight * 1.5;
  
  // Script sections
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  y = checkForNewPage(y, lineHeight * 2);
  doc.text("SCRIPT", margin, y);
  y += lineHeight * 1.5;
  
  scriptData.script.forEach((section, index) => {
    y = checkForNewPage(y, lineHeight * 6);
    
    // Section title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${section.section} (${section.duration})`, margin, y);
    y += lineHeight * 1.5;
    
    // Narration
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Narration:", margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    y = addWrappedText(section.narration, margin, y, contentWidth, lineHeight);
    y += lineHeight;
    
    // Visual notes
    y = checkForNewPage(y, lineHeight * 3);
    doc.setFont("helvetica", "bold");
    doc.text("Visuels:", margin, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");
    y = addWrappedText(section.visualNotes, margin, y, contentWidth, lineHeight);
    
    // Separator
    if (index < scriptData.script.length - 1) {
      y += lineHeight;
      y = checkForNewPage(y, lineHeight * 3);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += lineHeight * 1.5;
    }
  });
  
  // Additional notes if present
  if (scriptData.additionalNotes) {
    y = checkForNewPage(y, lineHeight * 4);
    y += lineHeight;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Notes supplémentaires:", margin, y);
    y += lineHeight;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    y = addWrappedText(scriptData.additionalNotes, margin, y, contentWidth, lineHeight);
  }
  
  // Save the PDF
  const filename = `script-video-${scriptName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
  doc.save(filename);
};
