import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import {
  getCardsByDeck,
  createCard,
  updateCard,
  deleteCard,
} from '@/lib/db';
import type { Card } from '@/lib/types';

/**
 * Hook to fetch all cards in a deck
 */
export function useCards(deckId: string) {
  return useQuery({
    queryKey: queryKeys.cards(deckId),
    queryFn: () => getCardsByDeck(deckId),
    enabled: !!deckId, // Only run query if deckId is provided
  });
}

/**
 * Hook to create a new card in a deck
 */
export function useCreateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ deckId, question, answer }: { deckId: string; question: string; answer: string }) =>
      createCard(deckId, question, answer),
    onSuccess: (newCard) => {
      // Invalidate cards list for this deck
      queryClient.invalidateQueries({ queryKey: queryKeys.cards(newCard.deckId) });
      
      // Invalidate deck progress and completion since we added a card
      queryClient.invalidateQueries({ queryKey: queryKeys.deckProgress(newCard.deckId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.deckCompletion(newCard.deckId) });
      
      // Invalidate decks list to update timestamps
      queryClient.invalidateQueries({ queryKey: queryKeys.decks });
    },
  });
}

/**
 * Hook to update an existing card
 */
export function useUpdateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cardId, updates }: { cardId: string; updates: Partial<Pick<Card, 'question' | 'answer'>> }) =>
      updateCard(cardId, updates),
    onSuccess: () => {
      // Invalidate all cards queries (simpler approach)
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      
      // Invalidate decks list to update timestamps
      queryClient.invalidateQueries({ queryKey: queryKeys.decks });
    },
  });
}

/**
 * Hook to delete a card
 */
export function useDeleteCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: (_, cardId) => {
      // Invalidate all cards queries since we don't know which deck it belonged to
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      
      // Invalidate progress queries for this card
      queryClient.removeQueries({ queryKey: queryKeys.progress(cardId) });
      
      // Invalidate all deck progress and completion queries
      queryClient.invalidateQueries({ queryKey: ['progress', 'deck'] });
      queryClient.invalidateQueries({ queryKey: ['progress', 'completion'] });
      
      // Invalidate decks list to update timestamps
      queryClient.invalidateQueries({ queryKey: queryKeys.decks });
    },
  });
}