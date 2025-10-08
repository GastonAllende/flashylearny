import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import {
  getDecks,
  createDeck,
  renameDeck,
  updateDeck,
  deleteDeckCascade,
  getDecksByCategory,
  getAllCategories,
  updateDeckCategory,
} from '@/lib/db';

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
    mutationFn: ({ name, category }: { name: string; category?: string | null }) =>
      createDeck(name, category),
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
 * Hook to update deck details (name and/or category)
 */
export function useUpdateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deckId, updates }: { deckId: string; updates: { name?: string; category?: string | null } }) =>
      updateDeck(deckId, updates),
    onSuccess: () => {
      // Invalidate decks list and categories to show updated details
      queryClient.invalidateQueries({ queryKey: queryKeys.decks });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
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

/**
 * Hook to fetch decks filtered by category
 */
export function useDecksByCategory(category: string | null) {
  return useQuery({
    queryKey: ['decks', 'category', category],
    queryFn: () => getDecksByCategory(category),
  });
}

/**
 * Hook to fetch all unique categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });
}

/**
 * Hook to update a deck's category
 */
export function useUpdateDeckCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deckId, category }: { deckId: string; category: string | null }) =>
      updateDeckCategory(deckId, category),
    onSuccess: () => {
      // Invalidate decks list to show updated category
      queryClient.invalidateQueries({ queryKey: queryKeys.decks });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}