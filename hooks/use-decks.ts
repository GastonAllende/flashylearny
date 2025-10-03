import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/react-query';
import {
  getDecks,
  createDeck,
  renameDeck,
  deleteDeckCascade,
} from '../lib/db';

/**
 * Hook to fetch all decks
 */
export function useDecks() {
  return useQuery({
    queryKey: queryKeys.decks,
    queryFn: getDecks,
  });
}

/**
 * Hook to create a new deck
 */
export function useCreateDeck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => createDeck(name),
    onSuccess: () => {
      // Invalidate and refetch decks list
      queryClient.invalidateQueries({ queryKey: queryKeys.decks });
    },
  });
}

/**
 * Hook to rename an existing deck
 */
export function useRenameDeck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ deckId, newName }: { deckId: string; newName: string }) =>
      renameDeck(deckId, newName),
    onSuccess: () => {
      // Invalidate decks list to show updated name
      queryClient.invalidateQueries({ queryKey: queryKeys.decks });
    },
  });
}

/**
 * Hook to delete a deck and all its associated data
 */
export function useDeleteDeck() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deckId: string) => deleteDeckCascade(deckId),
    onSuccess: (_, deckId) => {
      // Invalidate decks list
      queryClient.invalidateQueries({ queryKey: queryKeys.decks });
      
      // Remove specific deck queries from cache
      queryClient.removeQueries({ queryKey: queryKeys.deck(deckId) });
      queryClient.removeQueries({ queryKey: queryKeys.cards(deckId) });
      queryClient.removeQueries({ queryKey: queryKeys.deckProgress(deckId) });
      queryClient.removeQueries({ queryKey: queryKeys.deckCompletion(deckId) });
    },
  });
}