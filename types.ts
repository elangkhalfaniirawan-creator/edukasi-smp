
export enum Subject {
  MATH = 'Matematika',
  SCIENCE = 'IPA',
  ENGLISH = 'Bahasa Inggris',
  HISTORY = 'IPS/Sejarah'
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface WordChallenge {
  word: string;
  hint: string;
  explanation: string;
  subject: Subject;
}

export interface PuzzleChallenge {
  concept: string;
  definition: string;
  segments: string[];
  explanation: string;
  subject: Subject;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
