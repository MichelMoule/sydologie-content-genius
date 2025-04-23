
import { useEffect, useRef } from "react";
import { SlidesContainer } from "./preview/SlidesContainer";
import { ThemeColors } from "./types/ThemeColors";
import { useRevealInit } from "./hooks/useRevealInit";
import { OutlineSection } from "./types";

interface RevealPreviewProps {
  slidesHtml: string;
  outline?: OutlineSection[] | null;
  transition?: string;
  colors: ThemeColors;
}

export const RevealPreview = ({
  slidesHtml,
  outline,
  transition = "slide",
  colors
}: RevealPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize Reveal.js with the correct parameter structure
  useRevealInit({
    containerRef,
    slidesHtml,
    colors,
    transition
  });
  
  return (
    <div className="reveal-preview">
      <SlidesContainer ref={containerRef} slidesHtml={slidesHtml} outline={outline} />
    </div>
  );
};
