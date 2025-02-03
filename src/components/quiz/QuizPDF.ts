import jsPDF from "jspdf";
import { QuizData } from "./types";

export const generateQuizPDF = (quiz: QuizData, quizName: string) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set font
  doc.setFont("helvetica");

  // Title
  doc.setFontSize(24);
  doc.text(`Quiz: ${quizName}`, 20, 20);

  let yPosition = 40;

  // Questions
  quiz.questions.forEach((question, index) => {
    // Question text
    doc.setFontSize(14);
    doc.text(`Question ${index + 1}: ${question.question}`, 20, yPosition);
    yPosition += 10;

    // Options
    doc.setFontSize(12);
    question.options.forEach((option, optionIndex) => {
      const letter = String.fromCharCode(65 + optionIndex);
      const isCorrect = optionIndex === question.correctAnswer;
      const optionText = `${letter}. ${option}${isCorrect ? ' ✓' : ''}`;
      doc.text(optionText, 25, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Save the PDF
  doc.save(`quiz-${quizName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};