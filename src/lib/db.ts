import { db } from './dexie';
import { uid } from './id';
import type { Deck, Card, Progress } from './types';

// ===============================
// DECK OPERATIONS
// ===============================

/**
 * Create a new deck with generated ID and timestamps
 */
export async function createDeck(name: string): Promise<Deck> {
  const now = Date.now();
  const deck: Deck = {
    id: uid(),
    name,
    createdAt: now,
    updatedAt: now,
  };
  
  await db.decks.add(deck);
  return deck;
}

/**
 * Rename an existing deck and update its timestamp
 */
export async function renameDeck(deckId: string, newName: string): Promise<void> {
  await db.decks.update(deckId, {
    name: newName,
    updatedAt: Date.now(),
  });
}

/**
 * Delete a deck and all its associated cards and progress records (cascade delete)
 */
export async function deleteDeckCascade(deckId: string): Promise<void> {
  await db.transaction('rw', db.decks, db.cards, db.progress, async () => {
    // Get all cards in this deck
    const cards = await db.cards.where('deckId').equals(deckId).toArray();
    const cardIds = cards.map(card => card.id);
    
    // Delete all progress records for cards in this deck
    if (cardIds.length > 0) {
      await db.progress.where('cardId').anyOf(cardIds).delete();
    }
    
    // Delete all cards in this deck
    await db.cards.where('deckId').equals(deckId).delete();
    
    // Delete the deck itself
    await db.decks.delete(deckId);
  });
}

/**
 * Reset all learning progress for a deck by removing progress rows for its cards
 * Missing progress rows are treated as NEW throughout the app.
 */
export async function resetDeckProgress(deckId: string): Promise<void> {
  await db.transaction('rw', db.cards, db.progress, db.decks, async () => {
    const cards = await db.cards.where('deckId').equals(deckId).toArray();
    const cardIds = cards.map(card => card.id);

    if (cardIds.length > 0) {
      await db.progress.where('cardId').anyOf(cardIds).delete();
    }

    // Touch deck updatedAt timestamp
    await db.decks.update(deckId, { updatedAt: Date.now() });
  });
}

/**
 * Get all decks ordered by most recently updated
 */
export async function getDecks(): Promise<Deck[]> {
  return await db.decks.orderBy('updatedAt').reverse().toArray();
}

// ===============================
// CARD OPERATIONS
// ===============================

/**
 * Create a new card in a deck
 */
export async function createCard(deckId: string, question: string, answer: string): Promise<Card> {
  const now = Date.now();
  const card: Card = {
    id: uid(),
    deckId,
    question,
    answer,
    createdAt: now,
    updatedAt: now,
  };
  
  await db.cards.add(card);
  
  // Update deck's updatedAt timestamp
  await db.decks.update(deckId, { updatedAt: now });
  
  return card;
}

/**
 * Update an existing card's question and/or answer
 */
export async function updateCard(cardId: string, updates: Partial<Pick<Card, 'question' | 'answer'>>): Promise<void> {
  const now = Date.now();
  
  await db.transaction('rw', db.cards, db.decks, async () => {
    const card = await db.cards.get(cardId);
    if (!card) throw new Error('Card not found');
    
    // Update the card
    await db.cards.update(cardId, {
      ...updates,
      updatedAt: now,
    });
    
    // Update deck's updatedAt timestamp
    await db.decks.update(card.deckId, { updatedAt: now });
  });
}

/**
 * Delete a card and its associated progress
 */
export async function deleteCard(cardId: string): Promise<void> {
  await db.transaction('rw', db.cards, db.progress, db.decks, async () => {
    const card = await db.cards.get(cardId);
    if (!card) throw new Error('Card not found');
    
    // Delete the card's progress
    await db.progress.where('cardId').equals(cardId).delete();
    
    // Delete the card
    await db.cards.delete(cardId);
    
    // Update deck's updatedAt timestamp
    await db.decks.update(card.deckId, { updatedAt: Date.now() });
  });
}

/**
 * Get all cards in a deck ordered by creation date
 */
export async function getCardsByDeck(deckId: string): Promise<Card[]> {
  return await db.cards.where('deckId').equals(deckId).sortBy('createdAt');
}

// ===============================
// PROGRESS OPERATIONS
// ===============================

/**
 * Get progress for a card, or create initial progress if none exists
 */
export async function getOrInitProgress(cardId: string): Promise<Progress> {
  let progress = await db.progress.where('cardId').equals(cardId).first();

  if (!progress) {
    progress = {
      id: uid(),
      cardId,
      status: 'NEW',
      lastReviewedAt: null,
      timesSeen: 0,
      timesKnown: 0,
      timesAlmost: 0,
    };
    await db.progress.add(progress);
  }

  return progress;
}

/**
 * Set the status of a card's progress
 */
export async function setProgress(cardId: string, status: Progress['status']): Promise<void> {
  const progress = await getOrInitProgress(cardId);
  await db.progress.update(progress.id, { status });
}

/**
 * Update progress based on study response
 * Implements the study flow rules:
 * - NEW → LEARNING on first interaction
 * - If Known: timesSeen++, timesKnown++, lastReviewedAt=now
 *   If timesKnown >= 3, status → MASTERED
 * - If Almost: timesSeen++, timesAlmost++, lastReviewedAt=now, status → LEARNING
 *   (Shows card less frequently than "didn't know" but more than "knew")
 * - If Not Known: timesSeen++, lastReviewedAt=now, status → LEARNING
 */
export async function incrementSeenKnown(
  cardId: string,
  response: 'knew' | 'almost' | 'didnt'
): Promise<Progress> {
  const progress = await getOrInitProgress(cardId);
  const now = Date.now();

  // Always increment times seen and update last reviewed
  const updates: Partial<Progress> = {
    timesSeen: progress.timesSeen + 1,
    lastReviewedAt: now,
  };

  if (response === 'knew') {
    // User knew the answer
    updates.timesKnown = progress.timesKnown + 1;

    // Promote to MASTERED if known 3+ times
    if (updates.timesKnown >= 3) {
      updates.status = 'MASTERED';
    } else if (progress.status === 'NEW') {
      // First interaction: NEW → LEARNING
      updates.status = 'LEARNING';
    }
  } else if (response === 'almost') {
    // User almost knew it - track separately for future spaced repetition
    updates.timesAlmost = progress.timesAlmost + 1;

    if (progress.status === 'NEW') {
      // First interaction: NEW → LEARNING
      updates.status = 'LEARNING';
    } else if (progress.status === 'MASTERED') {
      // Demote from MASTERED back to LEARNING
      updates.status = 'LEARNING';
    }
    // LEARNING stays LEARNING
  } else {
    // User didn't know the answer
    if (progress.status === 'NEW') {
      // First interaction: NEW → LEARNING
      updates.status = 'LEARNING';
    } else if (progress.status === 'MASTERED') {
      // Demote from MASTERED back to LEARNING if they got it wrong
      updates.status = 'LEARNING';
    }
    // LEARNING stays LEARNING
  }

  await db.progress.update(progress.id, updates);

  return { ...progress, ...updates };
}

/**
 * Get progress for all cards in a deck using a Dexie transaction
 * Automatically initializes progress records for cards that don't have them
 */
export async function getDeckProgress(deckId: string): Promise<{ card: Card; progress: Progress }[]> {
  return await db.transaction('rw', [db.cards, db.progress], async () => {
    const cards = await db.cards.where('deckId').equals(deckId).toArray();
    const results: { card: Card; progress: Progress }[] = [];

    for (const card of cards) {
      // Use getOrInitProgress to ensure progress record exists in DB
      const progress = await getOrInitProgress(card.id);
      results.push({ card, progress });
    }

    return results;
  });
}

/**
 * Calculate deck completion percentage (MASTERED cards / total cards) using Dexie transaction
 * Automatically initializes progress records for cards that don't have them
 */
export async function getDeckCompletion(deckId: string): Promise<{ completion: number; mastered: number; total: number }> {
  return await db.transaction('rw', [db.cards, db.progress], async () => {
    // Get all cards for this deck
    const cards = await db.cards.where('deckId').equals(deckId).toArray();
    const total = cards.length;

    if (total === 0) {
      return { completion: 0, mastered: 0, total: 0 };
    }

    // Count mastered cards and initialize missing progress records
    let mastered = 0;
    for (const card of cards) {
      // Use getOrInitProgress to ensure progress record exists
      const progress = await getOrInitProgress(card.id);
      if (progress.status === 'MASTERED') {
        mastered++;
      }
    }

    return {
      completion: Math.round((mastered / total) * 100),
      mastered,
      total,
    };
  });
}

/**
 * Get detailed deck analytics including average accuracy, review frequency, etc.
 * Automatically initializes progress records for cards that don't have them
 */
export async function getDeckAnalytics(deckId: string): Promise<{
  statusDistribution: { NEW: number; LEARNING: number; MASTERED: number };
  averageAccuracy: number;
  totalReviews: number;
  recentActivity: { date: string; reviews: number }[];
}> {
  return await db.transaction('rw', [db.cards, db.progress], async () => {
    const cards = await db.cards.where('deckId').equals(deckId).toArray();

    if (cards.length === 0) {
      return {
        statusDistribution: { NEW: 0, LEARNING: 0, MASTERED: 0 },
        averageAccuracy: 0,
        totalReviews: 0,
        recentActivity: [],
      };
    }

    // Calculate status distribution and stats
    const statusDistribution = { NEW: 0, LEARNING: 0, MASTERED: 0 };
    let totalSeen = 0;
    let totalKnown = 0;
    const allProgress: Progress[] = [];

    // Initialize missing progress records and collect all progress data
    for (const card of cards) {
      const progress = await getOrInitProgress(card.id);
      const status = progress.status as keyof typeof statusDistribution;
      statusDistribution[status]++;
      totalSeen += progress.timesSeen;
      totalKnown += progress.timesKnown;
      allProgress.push(progress);
    }

    const averageAccuracy = totalSeen > 0 ? Math.round((totalKnown / totalSeen) * 100) : 0;

    // Generate recent activity based on actual review data (last 7 days including today)
    const recentActivity = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Go back 7 days from today (including today = 7 days total)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i); // i days ago

      const dayStart = date.getTime();
      const dayEnd = dayStart + (24 * 60 * 60 * 1000); // 24 hours later

      // Count number of cards that were last reviewed during this day
      const cardsReviewedThisDay = allProgress.filter(progress =>
        progress.lastReviewedAt &&
        progress.lastReviewedAt >= dayStart &&
        progress.lastReviewedAt < dayEnd
      ).length;

      recentActivity.push({
        date: date.toISOString().split('T')[0],
        reviews: cardsReviewedThisDay
      });
    }

    return {
      statusDistribution,
      averageAccuracy,
      totalReviews: totalSeen,
      recentActivity,
    };
  });
}

// ===============================
// BULK OPERATIONS
// ===============================

/**
 * Import multiple decks with their cards in a single transaction
 */
export async function importDecksWithCards(
  decksData: Array<{
    deckName: string;
    cards: Array<{ question: string; answer: string }>;
  }>
): Promise<{ decksCreated: number; cardsCreated: number }> {
  return await db.transaction('rw', db.decks, db.cards, async () => {
    const now = Date.now();
    let decksCreated = 0;
    let cardsCreated = 0;

    for (const deckData of decksData) {
      // Check if deck already exists
      let deck = await db.decks.where('name').equals(deckData.deckName).first();
      
      if (!deck) {
        // Create new deck
        deck = {
          id: uid(),
          name: deckData.deckName,
          createdAt: now,
          updatedAt: now,
        };
        await db.decks.add(deck);
        decksCreated++;
      } else {
        // Update existing deck timestamp
        await db.decks.update(deck.id, { updatedAt: now });
      }

      // Create all cards for this deck
      const cardsToAdd: Card[] = [];
      for (const cardData of deckData.cards) {
        const card: Card = {
          id: uid(),
          deckId: deck.id,
          question: cardData.question,
          answer: cardData.answer,
          createdAt: now,
          updatedAt: now,
        };
        cardsToAdd.push(card);
      }

      if (cardsToAdd.length > 0) {
        await db.cards.bulkAdd(cardsToAdd);
        cardsCreated += cardsToAdd.length;
      }
    }

    return { decksCreated, cardsCreated };
  });
}

/**
 * Export deck with all its cards
 */
export async function exportDeck(deckId: string): Promise<{ deck: Deck; cards: Card[] }> {
  return await db.transaction('r', db.decks, db.cards, async () => {
    const deck = await db.decks.get(deckId);
    if (!deck) {
      throw new Error('Deck not found');
    }

    const cards = await db.cards.where('deckId').equals(deckId).toArray();
    
    return { deck, cards };
  });
}

/**
 * Export all decks with their cards
 */
export async function exportAllDecks(): Promise<Array<{ deck: Deck; cards: Card[] }>> {
  return await db.transaction('r', db.decks, db.cards, async () => {
    const decks = await db.decks.orderBy('updatedAt').reverse().toArray();
    const results: Array<{ deck: Deck; cards: Card[] }> = [];

    for (const deck of decks) {
      const cards = await db.cards.where('deckId').equals(deck.id).toArray();
      results.push({ deck, cards });
    }

    return results;
  });
}

// ===============================
// MIGRATIONS
// ===============================

/**
 * Migration: Initialize progress records for all cards that don't have them
 * This is idempotent - safe to run multiple times
 * Returns the number of progress records created
 */
export async function migrateInitializeAllProgress(): Promise<{
  cardsProcessed: number;
  progressCreated: number;
}> {
  return await db.transaction('rw', db.cards, db.progress, async () => {
    // Get all cards
    const allCards = await db.cards.toArray();

    if (allCards.length === 0) {
      return { cardsProcessed: 0, progressCreated: 0 };
    }

    let progressCreated = 0;

    // Initialize progress for each card that doesn't have it
    for (const card of allCards) {
      const existingProgress = await db.progress.where('cardId').equals(card.id).first();

      if (!existingProgress) {
        // Create new progress record
        const newProgress: Progress = {
          id: uid(),
          cardId: card.id,
          status: 'NEW',
          lastReviewedAt: null,
          timesSeen: 0,
          timesKnown: 0,
          timesAlmost: 0,
        };

        await db.progress.add(newProgress);
        progressCreated++;
      }
    }

    return {
      cardsProcessed: allCards.length,
      progressCreated,
    };
  });
}