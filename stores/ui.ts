import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Study session types
export interface StudySession {
  deckId: string;
  cardIds: string[];
  currentIndex: number;
  isActive: boolean;
  startedAt: number;
  showAnswer: boolean;
  sessionStats: {
    totalCards: number;
    seenCards: number;
    knownCards: number;
    unknownCards: number;
  };
}

// Modal types
export type ModalType = 'createDeck' | 'renameDeck' | 'deleteDeck' | 'deleteCard' | 'confirmExit' | null;

export interface ModalState {
  type: ModalType;
  isOpen: boolean;
  data?: Record<string, unknown>;
}

// Main UI state interface
export interface UIState {
  // Current deck navigation
  currentDeckId: string | null;
  setCurrentDeckId: (deckId: string | null) => void;
  
  // Theme management
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Study session state
  studySession: StudySession | null;
  startStudySession: (deckId: string, cardIds: string[]) => void;
  endStudySession: () => void;
  showAnswer: () => void;
  hideAnswer: () => void;
  nextCard: () => void;
  markCard: (wasKnown: boolean) => void;
  
  // Modal management
  modal: ModalState;
  openModal: (type: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  
  // UI helpers
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Current deck navigation
      currentDeckId: null,
      setCurrentDeckId: (deckId) => set({ currentDeckId: deckId }),
      
      // Theme management (persisted)
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // Study session state (not persisted - reset on app restart)
      studySession: null,
      startStudySession: (deckId, cardIds) => {
        const shuffledCardIds = [...cardIds].sort(() => Math.random() - 0.5);
        set({
          studySession: {
            deckId,
            cardIds: shuffledCardIds,
            currentIndex: 0,
            isActive: true,
            startedAt: Date.now(),
            showAnswer: false,
            sessionStats: {
              totalCards: shuffledCardIds.length,
              seenCards: 0,
              knownCards: 0,
              unknownCards: 0,
            },
          },
        });
      },
      
      endStudySession: () => set({ studySession: null }),
      
      showAnswer: () => {
        const session = get().studySession;
        if (session) {
          set({
            studySession: { ...session, showAnswer: true },
          });
        }
      },
      
      hideAnswer: () => {
        const session = get().studySession;
        if (session) {
          set({
            studySession: { ...session, showAnswer: false },
          });
        }
      },
      
      nextCard: () => {
        const session = get().studySession;
        if (session) {
          // Always advance to next index, even if it goes beyond the array length
          // This allows the isSessionCompleted function to properly detect completion
          set({
            studySession: {
              ...session,
              currentIndex: session.currentIndex + 1,
              showAnswer: false,
            },
          });
        }
      },
      
      markCard: (wasKnown) => {
        const session = get().studySession;
        if (session) {
          const updatedStats = {
            ...session.sessionStats,
            seenCards: session.sessionStats.seenCards + 1,
            knownCards: wasKnown ? session.sessionStats.knownCards + 1 : session.sessionStats.knownCards,
            unknownCards: !wasKnown ? session.sessionStats.unknownCards + 1 : session.sessionStats.unknownCards,
          };
          
          set({
            studySession: {
              ...session,
              sessionStats: updatedStats,
            },
          });
        }
      },
      
      // Modal management
      modal: {
        type: null,
        isOpen: false,
        data: undefined,
      },
      
      openModal: (type, data) => set({
        modal: {
          type,
          isOpen: true,
          data,
        },
      }),
      
      closeModal: () => set({
        modal: {
          type: null,
          isOpen: false,
          data: undefined,
        },
      }),
      
      // UI helpers
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'flashylearny-ui-store',
      // Only persist certain fields
      partialize: (state) => ({
        theme: state.theme,
        currentDeckId: state.currentDeckId,
      }),
    }
  )
);