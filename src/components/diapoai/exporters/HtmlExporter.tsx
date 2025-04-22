
import { ThemeColors } from "../types/ThemeColors";
import { generateHtmlTemplate } from "./html/template";
import { downloadHtmlFile } from "./html/htmlDownloader";

interface HtmlExporterProps {
  slidesHtml: string;
  colors: ThemeColors;
}

export const HtmlExporter = ({ slidesHtml, colors }: HtmlExporterProps) => {
  const downloadHtml = () => {
    if (!slidesHtml) return;

    const fullHtml = generateHtmlTemplate(slidesHtml, colors);
    downloadHtmlFile(fullHtml);
  };

  return { downloadHtml };
};
