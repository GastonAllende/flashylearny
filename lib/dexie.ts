import Dexie, { Table } from 'dexie';
import type { Deck, Card, Progress } from './types';

export class FlashLearnyDB extends Dexie {
  decks!: Table<Deck, string>;
  cards!: Table<Card, string>;
  progress!: Table<Progress, string>;

  constructor() {
    super('flashlearny');
    
    this.version(1).stores({
      decks: 'id, name, updatedAt',
      cards: 'id, deckId, updatedAt',
      progress: 'id, cardId, status'
    });
  }
}

export const db = new FlashLearnyDB();