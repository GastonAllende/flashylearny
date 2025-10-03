import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration optimized for client-side operations with Dexie
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Since we're using Dexie (client-side), data is always fresh
      staleTime: 1000 * 60 * 5, // 5 minutes - reduce thrash as mentioned in specs
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 2, // Reduced retries for client-side operations
      refetchOnWindowFocus: false, // Not needed for client-side data
      refetchOnReconnect: false, // Not needed for client-side data
    },
    mutations: {
      retry: 1, // Single retry for mutations
    },
  },
});

/**
 * Query key factories for consistent key patterns
 */
export const queryKeys = {
  // Deck queries
  decks: ['decks'] as const,
  deck: (id: string) => ['decks', id] as const,
  
  // Card queries
  cards: (deckId: string) => ['cards', deckId] as const,
  card: (id: string) => ['cards', 'single', id] as const,
  
  // Progress queries
  progress: (cardId: string) => ['progress', cardId] as const,
  deckProgress: (deckId: string) => ['progress', 'deck', deckId] as const,
  deckCompletion: (deckId: string) => ['progress', 'completion', deckId] as const,
  deckAnalytics: (deckId: string) => ['progress', 'analytics', deckId] as const,
} as const;