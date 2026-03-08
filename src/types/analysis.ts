export interface ResumeAnalysis {
  atsScore: number;
  skillMatchPercentage: number;
  formattingScore: number;
  experienceScore: number;
  keywordScore: number;
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
}
