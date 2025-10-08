export interface Deck {
  id: string;
  name: string;
  category: string | null;  // Subject/category (e.g., "C#", "JavaScript", "Math")
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

// Auth types
export type SubscriptionTier = 'free' | 'pro';

export interface UserProfile {
  id: string;
  email: string;
  tier: SubscriptionTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: 'active' | 'inactive' | 'canceled' | 'past_due' | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}