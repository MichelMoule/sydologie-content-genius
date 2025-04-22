
import { ThemeColors } from "../types/ThemeColors";
import { generateHtmlTemplate } from "./html/template";
import { downloadHtmlFile } from "./html/htmlDownloader";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook for HTML export functionality
 */
export const useHtmlExporter = (slidesHtml: string | null, colors: ThemeColors) => {
  const { toast } = useToast();

  const downloadHtml = () => {
    if (!slidesHtml) return;

    const fullHtml = generateHtmlTemplate(slidesHtml, colors);
    downloadHtmlFile(fullHtml);

    // Add toast notification for successful export
    toast({
      title: "Export réussi",
      description: "Votre présentation HTML a été téléchargée avec succès.",
      variant: "default"
    });
  };

  return { downloadHtml };
};
