/**
 * Service d'intégration avec l'API SlideSpeak pour la génération de diaporamas
 */
import { supabase } from "@/integrations/supabase/client";

// Types pour l'API SlideSpeak
export interface SlideSpeakGenerateParams {
  plain_text: string;
  length?: number;
  template?: string;
  language?: string;
  fetch_images?: boolean;
  tone?: "default" | "casual" | "professional" | "funny" | "educational" | "sales_pitch";
  verbosity?: "concise" | "standard" | "text-heavy";
  custom_user_instructions?: string;
  include_cover?: boolean;
  include_table_of_contents?: boolean;
  use_branding_logo?: boolean;
  use_branding_color?: boolean;
}

export interface SlideSpeakSlideConfig {
  title: string;
  layout: string;
  item_amount: string;
  content_description: string;
}

export interface SlideSpeakSlideBySlideParams {
  slides: SlideSpeakSlideConfig[];
  template?: string;
}

export interface SlideSpeakTaskResponse {
  task_id: string;
}

export interface SlideSpeakTaskResult {
  task_status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILURE";
  task_result?: {
    url: string;
  };
  error?: string;
}

export interface SlideSpeakTemplate {
  name: string;
  images: {
    cover: string;
    content: string;
  };
}

/**
 * Service pour interagir avec l'API SlideSpeak
 */
export const slideSpeakService = {
  /**
   * Génère une présentation basée sur un contenu texte
   */
  async generatePresentation(params: SlideSpeakGenerateParams): Promise<SlideSpeakTaskResponse> {
    try {
      // Force specific parameters
      const enhancedParams = {
        ...params,
        length: 10, // Fixed to 10 slides
        use_branding_logo: true,
        fetch_images: true,
        include_cover: true,
        include_table_of_contents: true,
      };

      const { data, error } = await supabase.functions.invoke('slidespeak-generate', {
        body: enhancedParams,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la génération de la présentation:", error);
      throw error;
    }
  },

  /**
   * Génère une présentation slide par slide
   */
  async generateSlideBySlide(params: SlideSpeakSlideBySlideParams): Promise<SlideSpeakTaskResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('slidespeak-generate-slide-by-slide', {
        body: params,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la génération slide par slide:", error);
      throw error;
    }
  },

  /**
   * Récupère le statut d'une tâche de génération
   */
  async getTaskStatus(taskId: string): Promise<SlideSpeakTaskResult> {
    try {
      const { data, error } = await supabase.functions.invoke('slidespeak-task-status', {
        body: { task_id: taskId },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du statut:", error);
      throw error;
    }
  },

  /**
   * Récupère la liste des templates disponibles
   */
  async getTemplates(): Promise<SlideSpeakTemplate[]> {
    try {
      const { data, error } = await supabase.functions.invoke('slidespeak-templates', {});

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des templates:", error);
      throw error;
    }
  },
};
