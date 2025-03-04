
import jsPDF from "jspdf";
import { ProgramData } from "./types";

export const generateProgramPDF = (program: ProgramData, programName: string) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set font
  doc.setFont("helvetica");

  // Title
  doc.setFontSize(24);
  doc.text(`Programme: ${programName}`, 20, 20);

  // Overview
  doc.setFontSize(16);
  doc.text("Aperçu du programme", 20, 35);
  
  doc.setFontSize(12);
  const overviewLines = doc.splitTextToSize(program.overview, 170);
  doc.text(overviewLines, 20, 45);
  
  let yPosition = 45 + overviewLines.length * 7;

  // Global Objectives
  doc.setFontSize(16);
  doc.text("Objectifs globaux", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  program.globalObjectives.forEach((objective, index) => {
    doc.text(`- ${objective}`, 20, yPosition);
    yPosition += 7;
  });
  
  yPosition += 5;

  // Target Audience
  doc.setFontSize(16);
  doc.text("Public cible", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  const audienceLines = doc.splitTextToSize(program.targetAudience, 170);
  doc.text(audienceLines, 20, yPosition);
  yPosition += audienceLines.length * 7 + 5;

  // Prerequisites
  doc.setFontSize(16);
  doc.text("Prérequis", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  const prerequisitesLines = doc.splitTextToSize(program.prerequisites, 170);
  doc.text(prerequisitesLines, 20, yPosition);
  yPosition += prerequisitesLines.length * 7 + 5;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Evaluation Methods
  doc.setFontSize(16);
  doc.text("Méthodes d'évaluation", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  program.evaluationMethods.forEach((method, index) => {
    doc.text(`- ${method}`, 20, yPosition);
    yPosition += 7;
  });
  
  yPosition += 10;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Modules
  doc.setFontSize(20);
  doc.text("Modules du programme", 20, yPosition);
  yPosition += 15;

  program.modules.forEach((module, moduleIndex) => {
    // Check if we need a new page
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.text(`Module ${moduleIndex + 1}: ${module.title}`, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.text(`Durée: ${module.duration}`, 25, yPosition);
    yPosition += 7;
    
    doc.text("Objectifs:", 25, yPosition);
    yPosition += 7;
    
    module.objectives.forEach(objective => {
      doc.text(`- ${objective}`, 30, yPosition);
      yPosition += 6;
    });
    
    doc.text("Contenu:", 25, yPosition);
    yPosition += 7;
    
    const contentLines = doc.splitTextToSize(module.content, 160);
    doc.text(contentLines, 30, yPosition);
    yPosition += contentLines.length * 6 + 5;
    
    doc.text("Activités:", 25, yPosition);
    yPosition += 7;
    
    module.activities.forEach(activity => {
      const activityLines = doc.splitTextToSize(`- ${activity}`, 160);
      doc.text(activityLines, 30, yPosition);
      yPosition += activityLines.length * 6;
    });
    
    doc.text("Ressources:", 25, yPosition);
    yPosition += 7;
    
    module.resources.forEach(resource => {
      const resourceLines = doc.splitTextToSize(`- ${resource}`, 160);
      doc.text(resourceLines, 30, yPosition);
      yPosition += resourceLines.length * 6;
    });
    
    yPosition += 10;
  });

  // Save the PDF
  doc.save(`programme-${programName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};
