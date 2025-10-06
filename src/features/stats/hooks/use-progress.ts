import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import {
  getOrInitProgress,
  incrementSeenKnown,
  getDeckProgress,
  getDeckCompletion,
  getDeckAnalytics,
  resetDeckProgress,
} from '@/lib/db';
import type { Progress } from '@/lib/types';

/**
 * Hook to fetch progress for a specific card
 */
export function useProgress(cardId: string) {
  return useQuery({
    queryKey: queryKeys.progress(cardId),
    queryFn: () => getOrInitProgress(cardId),
    enabled: !!cardId, // Only run query if cardId is provided
  });
}

/**
 * Hook to fetch progress for all cards in a deck
 */
export function useDeckProgress(deckId: string) {
  return useQuery({
    queryKey: queryKeys.deckProgress(deckId),
    queryFn: () => getDeckProgress(deckId),
    enabled: !!deckId, // Only run query if deckId is provided
  });
}

/**
 * Hook to fetch deck completion statistics
 */
export function useDeckCompletion(deckId: string) {
  return useQuery({
    queryKey: queryKeys.deckCompletion(deckId),
    queryFn: () => getDeckCompletion(deckId),
    enabled: !!deckId, // Only run query if deckId is provided
  });
}

/**
 * Hook to fetch detailed deck analytics
 */
export function useDeckAnalytics(deckId: string) {
  return useQuery({
    queryKey: queryKeys.deckAnalytics(deckId),
    queryFn: () => getDeckAnalytics(deckId),
    enabled: !!deckId, // Only run query if deckId is provided
  });
}

/**
 * Hook to handle study session progress updates (main study flow)
 */
export function useStudyProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, response }: { cardId: string; response: 'knew' | 'almost' | 'didnt' }) =>
      incrementSeenKnown(cardId, response),
    onSuccess: (updatedProgress, { cardId }) => {
      // Update the specific card's progress in cache
      queryClient.setQueryData(queryKeys.progress(cardId), updatedProgress);

      // Invalidate deck progress and completion queries
      queryClient.invalidateQueries({ queryKey: ['progress', 'deck'] });
      queryClient.invalidateQueries({ queryKey: ['progress', 'completion'] });
      queryClient.invalidateQueries({ queryKey: ['progress', 'analytics'] });
    },
  });
}

/**
 * Hook to reset all progress for a deck
 */
export function useResetDeckProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deckId: string) => resetDeckProgress(deckId),
    onSuccess: (_data, deckId) => {
      // Invalidate deck-related progress queries
      queryClient.invalidateQueries({ queryKey: queryKeys.deckProgress(deckId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.deckCompletion(deckId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.deckAnalytics(deckId) });
      // Invalidate ALL individual card progress queries (starts with ['progress', cardId])
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
}