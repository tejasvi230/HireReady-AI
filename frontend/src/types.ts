export interface Question {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  difficulty: string;
  isPinned: boolean;
  aiExplanation?: string;
  tags?: string[];
  session?: string | { _id: string };
  createdAt?: string;
}

export interface Session {
  _id?: string;
  title: string;
  jobRole: string;
  experienceLevel: string;
  category: string;
  questions: Question[] | string[];
  isActive: boolean;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AppTab = "sessions" | "pinned" | "generate";
