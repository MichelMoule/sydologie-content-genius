
export interface ScriptSection {
  section: string;
  narration: string;
  visualNotes: string;
  duration: string;
}

export interface VideoScriptData {
  title: string;
  targetAudience: string;
  duration: string;
  format?: string; // Add new optional format field
  learningObjectives: string[];
  overview: string;
  script: ScriptSection[];
  additionalNotes?: string;
}
