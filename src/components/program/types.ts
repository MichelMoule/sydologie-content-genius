
export interface ProgramModule {
  title: string;
  duration: string;
  objectives: string[];
  content: string;
  activities: string[];
  resources: string[];
}

export interface ProgramData {
  modules: ProgramModule[];
  overview: string;
  globalObjectives: string[];
  targetAudience: string;
  prerequisites: string;
  evaluationMethods: string[];
}

export interface ProgramFormData {
  programName: string;
  subjectMatter: string;
  targetAudience: string;
  duration: string;
  learningObjectives: string;
  prerequisites: string;
  preferredFormat: string;
  additionalRequirements: string;
}
