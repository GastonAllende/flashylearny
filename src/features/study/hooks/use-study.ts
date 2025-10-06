import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { getCardsByDeck, getDeckCompletion } from '@/lib/db';
import { useUIStore } from '@/stores/ui';
import { useStudyProgress } from '@/features/stats/hooks/use-progress';
import type { Card } from '@/lib/types';

/**
 * Hook for managing study sessions
 */
export function useStudySession() {
  const {
    studySession,
    startStudySession,
    endStudySession,
    showAnswer,
    hideAnswer,
    nextCard,
    markCard,
  } = useUIStore();

  const queryClient = useQueryClient();
  const studyProgressMutation = useStudyProgress();

  /**
   * Start a new study session with optional card shuffling
   */
  const startSession = async (deckId: string, shuffleCards = true) => {
    // Fetch all cards for the deck
    const cards = await getCardsByDeck(deckId);
    
    if (cards.length === 0) {
      throw new Error('No cards found in this deck');
    }

    let cardIds = cards.map(card => card.id);
    
    // Shuffle cards if requested (default behavior)
    if (shuffleCards) {
      cardIds = [...cardIds].sort(() => Math.random() - 0.5);
    }
    
    // Start the session
    startStudySession(deckId, cardIds);
  };

  /**
   * Handle user response to a card (I knew it / I didn't know it / Almost knew it)
   */
  const handleCardResponse = async (response: 'knew' | 'almost' | 'didnt') => {
    if (!studySession || !studySession.cardIds[studySession.currentIndex]) {
      return;
    }

    const currentCardId = studySession.cardIds[studySession.currentIndex];

    try {
      // Pass the response directly to the mutation
      await studyProgressMutation.mutateAsync({ cardId: currentCardId, response });

      // Update session stats in UI store
      // "almost" is counted separately from "knew" in the session stats
      markCard(response);

      // Auto-advance to next card after a brief delay
      setTimeout(() => {
        // Always advance to next card (or trigger session completion)
        nextCard();

        // If we haven't completed the session, hide the answer for next card
        if (studySession.currentIndex + 1 < studySession.cardIds.length) {
          hideAnswer(); // Reset to question side for next card
        }
        // If this was the last card, nextCard() will increment the index
        // and isSessionCompleted will return true, showing completion screen
      }, 500);

    } catch (error) {
      console.error('Failed to update progress:', error);
      // Continue anyway - don't block user experience
      markCard(response);
      nextCard();
      if (studySession.currentIndex + 1 < studySession.cardIds.length) {
        hideAnswer();
      }
    }
  };

  /**
   * Get the current card being studied
   */
  const getCurrentCard = (): Card | null => {
    if (!studySession) return null;
    
    const currentCardId = studySession.cardIds[studySession.currentIndex];
    if (!currentCardId) return null;

    // Try to get card from cache first
    const cachedCards = queryClient.getQueryData<Card[]>(queryKeys.cards(studySession.deckId));
    if (cachedCards) {
      return cachedCards.find(card => card.id === currentCardId) || null;
    }

    return null;
  };

  /**
   * Check if the session is completed
   */
  const isSessionCompleted = (): boolean => {
    if (!studySession) return false;
    // Session is completed when current index equals or exceeds the number of cards
    // This happens after the last card has been answered
    return studySession.currentIndex >= studySession.cardIds.length;
  };

  /**
   * Get session progress as percentage
   */
  const getSessionProgress = (): number => {
    if (!studySession) return 0;
    return Math.round((studySession.currentIndex / studySession.cardIds.length) * 100);
  };

  /**
   * Skip current card (don't update progress)
   */
  const skipCard = () => {
    if (studySession && studySession.currentIndex < studySession.cardIds.length - 1) {
      nextCard();
      hideAnswer();
    }
  };

  /**
   * Restart the current session
   */
  const restartSession = () => {
    if (!studySession) return;
    
    // Start a new session with the same deck
    startStudySession(studySession.deckId, studySession.cardIds);
  };

  /**
   * Check if the entire deck is mastered (100% completion)
   */
  const checkDeckMastery = async (): Promise<boolean> => {
    if (!studySession) return false;
    
    try {
      const completion = await getDeckCompletion(studySession.deckId);
      return completion.completion === 100;
    } catch (error) {
      console.error('Failed to check deck mastery:', error);
      return false;
    }
  };

  return {
    // Session state
    studySession,
    currentCard: getCurrentCard(),
    isSessionCompleted: isSessionCompleted(),
    sessionProgress: getSessionProgress(),
    
    // Session control
    startSession,
    endStudySession,
    restartSession,
    checkDeckMastery,
    
    // Card interaction
    showAnswer,
    hideAnswer,
    handleCardResponse,
    skipCard,
    
    // Loading states
    isUpdatingProgress: studyProgressMutation.isPending,
  };
}

/**
 * Hook to fetch cards for a study session (with caching)
 */
export function useStudyCards(deckId: string) {
  return useQuery({
    queryKey: queryKeys.cards(deckId),
    queryFn: () => getCardsByDeck(deckId),
    enabled: !!deckId,
    staleTime: 5 * 60 * 1000, // 5 minutes - cards don't change often during study
  });
}