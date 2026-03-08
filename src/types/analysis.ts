export interface ResumeAnalysis {
  atsScore: number;
  skillMatchPercentage: number;
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
}
