import Dexie, { Table } from 'dexie';
import type { Deck, Card, Progress } from './types';

export class FlashLearnyDB extends Dexie {
  decks!: Table<Deck, string>;
  cards!: Table<Card, string>;
  progress!: Table<Progress, string>;

  constructor() {
    super('flashlearny');

    // Version 1: Initial schema
    this.version(1).stores({
      decks: 'id, name, updatedAt',
      cards: 'id, deckId, updatedAt',
      progress: 'id, cardId, status'
    });

    // Version 2: Add timesAlmost field to track "almost knew it" responses
    this.version(2).stores({
      decks: 'id, name, updatedAt',
      cards: 'id, deckId, updatedAt',
      progress: 'id, cardId, status'
    }).upgrade(tx => {
      // Add timesAlmost field to existing progress records
      return tx.table('progress').toCollection().modify(progress => {
        if (progress.timesAlmost === undefined) {
          progress.timesAlmost = 0;
        }
      });
    });
  }
}

export const db = new FlashLearnyDB();