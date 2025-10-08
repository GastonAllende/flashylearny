import type { SubscriptionTier } from './types';

// Subscription tier limits
export const SUBSCRIPTION_LIMITS = {
  free: {
    maxDecks: 5,
    maxCardsPerDeck: 50,
  },
  pro: {
    maxDecks: Infinity,
    maxCardsPerDeck: Infinity,
  },
} as const;

// Pricing
export const PRICING = {
  pro: {
    monthly: 4.99,
    yearly: 49.0,
  },
} as const;

/**
 * Check if user can create a new deck
 */
export function canCreateDeck(tier: SubscriptionTier, currentDeckCount: number): boolean {
  const limit = SUBSCRIPTION_LIMITS[tier].maxDecks;
  return currentDeckCount < limit;
}

/**
 * Check if user can create a new card in a deck
 */
export function canCreateCard(tier: SubscriptionTier, currentCardCount: number): boolean {
  const limit = SUBSCRIPTION_LIMITS[tier].maxCardsPerDeck;
  return currentCardCount < limit;
}

/**
 * Get remaining deck slots
 */
export function getRemainingDecks(tier: SubscriptionTier, currentDeckCount: number): number {
  const limit = SUBSCRIPTION_LIMITS[tier].maxDecks;
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - currentDeckCount);
}

/**
 * Get remaining card slots for a deck
 */
export function getRemainingCards(tier: SubscriptionTier, currentCardCount: number): number {
  const limit = SUBSCRIPTION_LIMITS[tier].maxCardsPerDeck;
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - currentCardCount);
}

/**
 * Check if user is on pro tier
 */
export function isProTier(tier: SubscriptionTier): boolean {
  return tier === 'pro';
}

/**
 * Check if user is on free tier
 */
export function isFreeTier(tier: SubscriptionTier): boolean {
  return tier === 'free';
}

/**
 * Get usage percentage for decks
 */
export function getDeckUsagePercentage(tier: SubscriptionTier, currentDeckCount: number): number {
  const limit = SUBSCRIPTION_LIMITS[tier].maxDecks;
  if (limit === Infinity) return 0;
  return Math.min(100, (currentDeckCount / limit) * 100);
}

/**
 * Get usage percentage for cards in a deck
 */
export function getCardUsagePercentage(tier: SubscriptionTier, currentCardCount: number): number {
  const limit = SUBSCRIPTION_LIMITS[tier].maxCardsPerDeck;
  if (limit === Infinity) return 0;
  return Math.min(100, (currentCardCount / limit) * 100);
}
