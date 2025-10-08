import { useAuth } from '@/contexts/AuthContext';
import {
  canCreateDeck,
  canCreateCard,
  getRemainingDecks,
  getRemainingCards,
  getDeckUsagePercentage,
  getCardUsagePercentage,
  isProTier,
  isFreeTier,
  SUBSCRIPTION_LIMITS,
  PRICING,
} from '@/lib/subscription';
import type { SubscriptionTier } from '@/lib/types';

export function useSubscription() {
  const { profile } = useAuth();
  const tier: SubscriptionTier = profile?.tier || 'free';

  return {
    tier,
    limits: SUBSCRIPTION_LIMITS[tier],
    pricing: PRICING,
    isPro: isProTier(tier),
    isFree: isFreeTier(tier),

    // Deck limits
    canCreateDeck: (currentDeckCount: number) => canCreateDeck(tier, currentDeckCount),
    getRemainingDecks: (currentDeckCount: number) => getRemainingDecks(tier, currentDeckCount),
    getDeckUsagePercentage: (currentDeckCount: number) => getDeckUsagePercentage(tier, currentDeckCount),

    // Card limits
    canCreateCard: (currentCardCount: number) => canCreateCard(tier, currentCardCount),
    getRemainingCards: (currentCardCount: number) => getRemainingCards(tier, currentCardCount),
    getCardUsagePercentage: (currentCardCount: number) => getCardUsagePercentage(tier, currentCardCount),
  };
}
