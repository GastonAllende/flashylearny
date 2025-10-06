export interface Deck {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface Card {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  createdAt: number;
  updatedAt: number;
}

export interface Progress {
  id: string;
  cardId: string;
  status: 'NEW' | 'LEARNING' | 'MASTERED';
  lastReviewedAt: number | null;
  timesSeen: number;
  timesKnown: number;
  timesAlmost: number;  // Track "almost knew it" responses separately
}