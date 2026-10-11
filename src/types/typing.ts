export interface Passage {
  id: string;
  title: string;
  category: 'literature' | 'science' | 'philosophy' | 'technology' | 'nature';
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
}

export type CharState = 'idle' | 'correct' | 'incorrect' | 'current';

export interface CharResult {
  char: string;
  state: CharState;
}

export interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  duration: number; // seconds
  passage: Passage;
  completedAt: string;
}

export type TimerMode = 15 | 30 | 60 | 120;
export type TestMode = 'timed' | 'passage';
