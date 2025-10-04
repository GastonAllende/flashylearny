# FlashyLearny - AI Assistant Documentation

## Project Overview

**FlashyLearny** is an offline-first Progressive Web App (PWA) for creating and studying flashcard decks with spaced repetition. The application runs entirely client-side with no backend, using IndexedDB for local data persistence.

### Core Purpose
- Create and organize study decks with flashcards
- Study cards with spaced repetition algorithm
- Track learning progress (NEW → LEARNING → MASTERED)
- Import/export decks via CSV
- Work completely offline after initial load

### Key Characteristics
- **Offline-First**: All data stored in IndexedDB via Dexie
- **PWA**: Installable on mobile and desktop
- **No Backend**: Purely client-side application
- **Mobile-First UI**: Responsive design with touch-optimized interactions
- **Dark Mode**: Full theme support via next-themes

## Tech Stack

### Core Framework
- **Next.js 15.5.4** - App Router (no server actions)
- **React 19.1.0** - UI library
- **TypeScript 5.9.3** - Type safety

### State & Data Management
- **Dexie 4.2.0** - IndexedDB wrapper for offline storage
- **Zustand 5.0.8** - UI state management (with persist middleware)
- **TanStack Query 5.90.2** - Async state and caching for Dexie operations

### UI & Styling
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Component library (Button, Dialog, Tabs, etc.)
- **next-themes 0.4.6** - Dark mode support
- **Lucide React 0.544.0** - Icon library
- **Sonner 2.0.7** - Toast notifications

### PWA & Offline
- **next-pwa 5.6.0** - Service worker and manifest generation
- **Custom Service Worker** - Located at `public/sw.js`

### Validation & Utilities
- **Zod 4.1.11** - Schema validation
- **class-variance-authority** - Component variants
- **clsx & tailwind-merge** - Class name utilities

### Testing (DevDependencies)
- **Vitest 3.2.4** - Unit and component testing
- **Playwright 1.55.1** - E2E testing
- **@testing-library/react 16.3.0** - Component testing utilities

## Architecture

### Data Flow
```
User Interaction
  → Component
  → Hook (useCards, useDecks, etc.)
  → TanStack Query Mutation/Query
  → lib/db.ts functions
  → Dexie
  → IndexedDB
```

### State Management Strategy

**Zustand (stores/ui.ts)** - UI-only state:
- Current deck ID
- Study session state (active session, current card, stats)
- Theme preference
- Modal state (type, isOpen, data)
- Loading states

**TanStack Query** - Server/async state:
- Deck list: `['decks']`
- Deck cards: `['cards', deckId]`
- Card progress: `['progress', cardId]`
- Deck completion: `['deckCompletion', deckId]`
- Deck analytics: `['deckAnalytics', deckId]`

**Persistence**:
- Zustand: Partial state persisted to localStorage (theme, currentDeckId)
- All app data: IndexedDB via Dexie (decks, cards, progress)

## Data Model

### Database Schema (Dexie)

**Database Name**: `flashlearny`

#### Deck Entity
```typescript
interface Deck {
  id: string;          // UUID (crypto.randomUUID)
  name: string;
  createdAt: number;   // Unix timestamp
  updatedAt: number;   // Unix timestamp
}
// Indexes: id (primary), name, updatedAt
```

#### Card Entity
```typescript
interface Card {
  id: string;          // UUID
  deckId: string;      // Foreign key to Deck
  question: string;
  answer: string;
  createdAt: number;
  updatedAt: number;
}
// Indexes: id (primary), deckId, updatedAt
```

#### Progress Entity
```typescript
interface Progress {
  id: string;                              // UUID
  cardId: string;                          // Foreign key to Card
  status: 'NEW' | 'LEARNING' | 'MASTERED';
  lastReviewedAt: number | null;
  timesSeen: number;                       // Total review count
  timesKnown: number;                      // Correct answer count
}
// Indexes: id (primary), cardId, status
```

### Database Operations (lib/db.ts)

All operations use Dexie transactions for ACID guarantees.

**Cascade Delete Pattern**:
- Deleting a deck deletes all its cards and all progress records for those cards
- Deleting a card deletes its progress record
- All updates touch the parent deck's `updatedAt` timestamp

**Progress Rules**:
- Missing progress record = NEW status
- First interaction: NEW → LEARNING
- 3+ known answers: LEARNING → MASTERED
- Wrong answer on mastered: MASTERED → LEARNING

## Project Structure

```
flashylearny/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   ├── manifest.ts               # PWA manifest config
│   │   ├── decks/
│   │   │   ├── page.tsx              # Deck list
│   │   │   └── [deckId]/
│   │   │       ├── page.tsx          # Deck detail (Cards/Study/Stats tabs)
│   │   │       └── edit-card/[[...cardId]]/
│   │   │           └── page.tsx      # Card editor (create/edit)
│   │   ├── about/page.tsx
│   │   ├── help/page.tsx
│   │   └── privacy/page.tsx
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── CardEditor.tsx
│   │   ├── StudyCard.tsx             # Flashcard with flip animation
│   │   ├── DeckList.tsx, DeckCard.tsx
│   │   ├── CardList.tsx, CardRow.tsx
│   │   ├── ImportCSV.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Header.tsx, Footer.tsx
│   │   ├── InstallPrompt.tsx         # PWA install button
│   │   ├── RegisterSW.tsx            # Service worker registration
│   │   ├── Providers.tsx             # React Query + Theme providers
│   │   └── GlobalModalHandler.tsx    # Centralized modal management
│   │
│   └── lib/
│       ├── types.ts                  # Core TypeScript interfaces
│       ├── dexie.ts                  # Dexie database setup
│       ├── db.ts                     # CRUD operations (5+ txn functions)
│       ├── csv.ts                    # CSV parse/generate/download
│       ├── id.ts                     # UUID generation
│       ├── react-query.ts            # Query client config
│       └── utils.ts                  # cn() utility
│
├── stores/
│   └── ui.ts                         # Zustand store for UI state
│
├── hooks/                            # Custom React hooks
│   ├── use-decks.ts                  # Deck CRUD hooks
│   ├── use-cards.ts                  # Card CRUD hooks
│   ├── use-study.ts                  # Study session hooks
│   ├── use-progress.ts               # Progress tracking hooks
│   ├── use-csv.ts                    # CSV import/export hooks
│   └── index.ts                      # Barrel exports
│
├── lib/                              # Shared utilities (root level)
├── styles/
├── tests/                            # Unit tests
├── e2e/                              # Playwright E2E tests
├── public/                           # Static assets
│   ├── sw.js                         # Service worker
│   ├── manifest.json                 # PWA manifest
│   └── icons/                        # App icons
│
├── doc/                              # Project documentation
│   ├── mvp1.md                       # MVP requirements
│   └── ui-components-summary.md
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
└── README.md
```

## Key Features

### 1. Study Session Flow

**Location**: `src/app/decks/[deckId]/page.tsx` (Study Tab)

**Process**:
1. User clicks "Start Study" → Choose shuffle mode
2. Session initialized with card IDs (shuffled or ordered)
3. For each card:
   - Show question side
   - User clicks "Show Answer"
   - User responds: "I knew it" | "I didn't know it" | "Almost knew it"
4. Progress updated via `incrementSeenKnown()` in lib/db.ts
5. Auto-advance to next card after 500ms
6. Session complete → Show stats and mastery status

**Study Session State** (Zustand):
```typescript
interface StudySession {
  deckId: string;
  cardIds: string[];        // Shuffled or ordered
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
```

### 2. Progress Tracking Algorithm

**Location**: `lib/db.ts → incrementSeenKnown()`

**Rules**:
```typescript
// Always increment timesSeen and update lastReviewedAt
if (wasKnown) {
  timesKnown++
  if (timesKnown >= 3) {
    status = 'MASTERED'  // Promoted to mastered
  } else if (status === 'NEW') {
    status = 'LEARNING'  // First correct answer
  }
} else {
  if (status === 'NEW') {
    status = 'LEARNING'  // First interaction
  } else if (status === 'MASTERED') {
    status = 'LEARNING'  // Demoted from mastered
  }
  // LEARNING stays LEARNING
}
```

**"Almost knew it" handling**:
- Treated as `wasKnown: false` for progress
- Increments `timesSeen` but not `timesKnown`
- Counted as "known" in session stats UI (for encouragement)

### 3. CSV Import/Export

**Format**:
```csv
deckName,question,answer
"Math Basics","What is 2+2?","4"
"Math Basics","What is 5*3?","15"
```

**Import** (`lib/csv.ts → parseCSV`):
- Parse CSV with quote handling
- Group cards by deckName
- Upsert decks (create if not exists)
- Bulk create cards
- Auto-initialize progress as NEW

**Export** (`lib/csv.ts → generateCSV`):
- Fetch deck and cards via Dexie transaction
- Generate CSV with escaped values
- Trigger browser download

**Location**: Import UI in `/decks` page, Export button in deck detail page

### 4. PWA Configuration

**Manifest** (`src/app/manifest.ts`):
- Name: "FlashyLearny - Study Decks & Flashcards"
- Display: standalone
- Theme color: #0ea5e9 (blue)
- Orientation: portrait-primary
- Categories: education, productivity, utilities

**Service Worker** (`public/sw.js`):
- Offline caching strategy
- Cache-first for static assets
- Network-first for API calls (none in this app)

**Install Prompt** (`src/components/InstallPrompt.tsx`):
- Detects PWA install capability
- Shows "Install App" button
- Handles beforeinstallprompt event

### 5. Deck Completion & Analytics

**Completion** (`lib/db.ts → getDeckCompletion`):
```typescript
{
  completion: number,     // Percentage (0-100)
  mastered: number,       // Count of MASTERED cards
  total: number          // Total cards in deck
}
```

**Analytics** (`lib/db.ts → getDeckAnalytics`):
```typescript
{
  statusDistribution: { NEW: number; LEARNING: number; MASTERED: number },
  averageAccuracy: number,     // (timesKnown / timesSeen) * 100
  totalReviews: number,        // Sum of all timesSeen
  recentActivity: Array<{      // 7-day activity chart
    date: string,
    reviews: number
  }>
}
```

## React Query Integration

### Query Client Configuration (lib/react-query.ts)

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 min - reduce thrash for client-side data
      gcTime: 1000 * 60 * 30,         // 30 min garbage collection
      retry: 2,                        // Reduced for client-side ops
      refetchOnWindowFocus: false,    // Not needed for Dexie
      refetchOnReconnect: false,      // Not needed for Dexie
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### Query Key Factory Pattern

**Centralized query keys** prevent typos and ensure consistency:

```typescript
export const queryKeys = {
  // Deck queries
  decks: ['decks'],
  deck: (id: string) => ['decks', id],

  // Card queries
  cards: (deckId: string) => ['cards', deckId],
  card: (id: string) => ['cards', 'single', id],

  // Progress queries
  progress: (cardId: string) => ['progress', cardId],
  deckProgress: (deckId: string) => ['progress', 'deck', deckId],
  deckCompletion: (deckId: string) => ['progress', 'completion', deckId],
  deckAnalytics: (deckId: string) => ['progress', 'analytics', deckId],
};
```

### Hook Pattern: Query + Mutation

All hooks follow this pattern:

**Read Operation (useQuery)**:
```typescript
export function useDecks() {
  return useQuery({
    queryKey: queryKeys.decks,
    queryFn: getDecks,  // Function from lib/db.ts
  });
}
```

**Write Operation (useMutation)**:
```typescript
export function useCreateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createDeck(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.decks });
    },
  });
}
```

**Usage in Components**:
```typescript
function DeckList() {
  const { data: decks, isLoading } = useDecks();
  const createDeckMutation = useCreateDeck();

  const handleCreate = async () => {
    await createDeckMutation.mutateAsync('New Deck');
    // queryKeys.decks automatically invalidated, UI updates
  };
}
```

## Custom Hooks

### Deck Hooks (hooks/use-decks.ts)

**Queries**:
- `useDecks()` - Fetch all decks (sorted by updatedAt DESC)
  - Query key: `['decks']`
  - Returns: `{ data: Deck[], isLoading, error }`

**Mutations**:
- `useCreateDeck()` - Create new deck
  - Invalidates: `['decks']`
  - Returns: `{ mutate, mutateAsync, isPending }`

- `useRenameDeck()` - Rename deck
  - Invalidates: `['decks']`

- `useDeleteDeck()` - Delete deck with cascade
  - Invalidates: `['decks']`
  - Removes: All queries for that deck (cards, progress, etc.)

- `useResetDeckProgress()` - Reset all progress for deck
  - Invalidates: `['progress', 'deck', deckId]`, `['progress', 'completion', deckId]`

- `useExportDeck()` - Export deck to CSV
  - Side effect only (triggers download)

### Card Hooks (hooks/use-cards.ts)

**Queries**:
- `useCards(deckId)` - Fetch cards for deck
  - Query key: `['cards', deckId]`
  - Sorted by createdAt ASC

- `useCard(cardId)` - Fetch single card
  - Query key: `['cards', 'single', cardId]`

**Mutations**:
- `useCreateCard()` - Create new card
  - Invalidates: `['cards', deckId]`, `['progress', 'deck', deckId]`, `['decks']`

- `useUpdateCard()` - Update card question/answer
  - Invalidates: `['cards', deckId]`, `['cards', 'single', cardId]`, `['decks']`

- `useDeleteCard()` - Delete card and its progress
  - Invalidates: `['cards', deckId]`, `['progress', 'deck', deckId]`, `['decks']`
  - Removes: `['cards', 'single', cardId]`, `['progress', cardId]`

### Study Hooks (hooks/use-study.ts)

**Main Hook**:
- `useStudySession()` - Manages study session state
  - Uses Zustand for session state (not React Query)
  - Uses `useStudyProgress()` mutation for progress updates
  - Returns:
    - State: `studySession`, `currentCard`, `isSessionCompleted`, `sessionProgress`
    - Actions: `startSession()`, `handleCardResponse()`, `showAnswer()`, etc.

**Supporting Queries**:
- `useStudyCards(deckId)` - Pre-fetch cards for study
  - Query key: `['cards', deckId]`
  - Enables background fetching before session starts

### Progress Hooks (hooks/use-progress.ts)

**Queries**:
- `useDeckProgress(deckId)` - Get progress for all cards in deck
  - Query key: `['progress', 'deck', deckId]`
  - Returns: `Array<{ card: Card; progress: Progress }>`

- `useDeckCompletion(deckId)` - Get completion percentage
  - Query key: `['progress', 'completion', deckId]`
  - Returns: `{ completion: number, mastered: number, total: number }`

- `useDeckAnalytics(deckId)` - Get detailed analytics
  - Query key: `['progress', 'analytics', deckId]`
  - Returns: Status distribution, accuracy, reviews, activity chart

**Mutations**:
- `useStudyProgress()` - Update card progress during study
  - Mutation function: `incrementSeenKnown(cardId, wasKnown)`
  - Invalidates: `['progress', cardId]`, `['progress', 'deck', deckId]`, `['progress', 'completion', deckId]`

### CSV Hooks (hooks/use-csv.ts)

**Mutations**:
- `useImportCSV()` - Import decks from CSV file
  - Calls: `importDecksWithCards()` from lib/db.ts
  - Invalidates: `['decks']` (to show newly imported decks)
  - Returns import stats: `{ decksCreated, cardsCreated }`

- `useExportAllDecks()` - Export all decks to CSV
  - Calls: `exportAllDecks()` then `generateCSV()` then `downloadCSV()`
  - Side effect only (triggers browser download)

## UI Components

### Core Study Components

**StudyCard** (`src/components/StudyCard.tsx`):
- Flashcard with CSS flip animation
- Props: `card`, `onResponse`, `isFlipped`
- Three response buttons: Knew it / Almost / Didn't know
- Accessible keyboard controls

**CardEditor** (`src/components/CardEditor.tsx`):
- Form for creating/editing cards
- Question and answer textareas
- Auto-save on blur (optional)
- Validation with error states

### UI Component Library (shadcn/ui)

Located in `src/components/ui/`:
- `button.tsx` - Button with variants
- `card.tsx` - Card container
- `dialog.tsx` - Modal dialogs
- `tabs.tsx` - Tab navigation
- `progress.tsx` - Progress bar
- `badge.tsx` - Status badges
- `input.tsx`, `textarea.tsx` - Form inputs
- `dropdown-menu.tsx` - Context menus
- `separator.tsx` - Visual dividers
- `sonner.tsx` - Toast notifications

### Layout Components

**Header** (`src/components/Header.tsx`):
- Navigation menu (Decks, About, Help)
- Theme toggle
- Install button (if PWA not installed)

**Footer** (`src/components/Footer.tsx`):
- Links to About, Help, Privacy
- Copyright info

### Modal System

**GlobalModalHandler** (`src/components/GlobalModalHandler.tsx`):
- Centralized modal rendering
- Types: `createDeck | renameDeck | deleteDeck | deleteCard | resetProgress | confirmExit`
- Uses Zustand modal state from `stores/ui.ts`

**Usage**:
```typescript
const { openModal, closeModal } = useUIStore();
openModal('deleteDeck', { deckId, deckName });
```

## Development

### Setup
```bash
npm install
npm run dev          # Start dev server (http://localhost:3000)
npm run dev:https    # Dev server with HTTPS (for PWA testing)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
```

### Testing
```bash
npm run test         # Vitest unit tests
npm run test:ui      # Vitest UI
npm run test:e2e     # Playwright E2E tests
```

### Key Files to Know

**Configuration**:
- `next.config.ts` - Next.js config, PWA headers for sw.js
- `tsconfig.json` - TypeScript config with `@/*` path alias
- `tailwind.config.js` - Tailwind + shadcn theme
- `components.json` - shadcn/ui config

**Critical Utilities**:
- `lib/id.ts` - `uid()` generates UUID via crypto.randomUUID()
- `lib/utils.ts` - `cn()` for className merging
- `lib/react-query.ts` - Query client with 5min staleTime

## Important Patterns & Best Practices

### 1. Dexie Transactions
Always use transactions for multi-table operations:
```typescript
await db.transaction('rw', db.decks, db.cards, db.progress, async () => {
  // Multiple operations here
});
```

### 2. Cascade Deletes
Implement proper cascade logic:
```typescript
// When deleting deck:
// 1. Get all cards in deck
// 2. Delete all progress for those cards
// 3. Delete all cards
// 4. Delete deck
```

### 3. Query Invalidation
Invalidate related queries after mutations:
```typescript
await createCardMutation.mutateAsync({ deckId, question, answer });
queryClient.invalidateQueries(['cards', deckId]);
queryClient.invalidateQueries(['deckCompletion', deckId]);
```

### 4. Optimistic Updates
Consider using optimistic updates for better UX:
```typescript
useMutation({
  mutationFn: deleteCard,
  onMutate: async (cardId) => {
    await queryClient.cancelQueries(['cards', deckId]);
    const previous = queryClient.getQueryData(['cards', deckId]);
    queryClient.setQueryData(['cards', deckId], old =>
      old?.filter(card => card.id !== cardId)
    );
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['cards', deckId], context.previous);
  },
});
```

### 5. Error Handling
- Use try-catch in mutation callbacks
- Show user-friendly toast messages
- Log errors to console for debugging
- Never block UX on non-critical failures

### 6. Performance
- Use `staleTime: 5 * 60 * 1000` for Dexie queries (data rarely changes)
- Memoize expensive computations
- Use Dexie bulk operations (`bulkAdd`, `bulkPut`)
- Implement virtual scrolling for 1000+ card decks (future enhancement)

### 7. Mobile Optimization
- Large tap targets (min 44x44px)
- Touch-friendly spacing
- Prevent zoom on input focus
- Use CSS transforms for animations (GPU accelerated)
- Test on actual devices, not just DevTools

## Common Tasks

### Adding a New Page
1. Create route in `src/app/[route]/page.tsx`
2. Update navigation in `Header.tsx`
3. Add link in `Footer.tsx` if static page

### Adding a New Modal
1. Add type to `ModalType` in `stores/ui.ts`
2. Create modal component or dialog
3. Add case in `GlobalModalHandler.tsx`
4. Trigger with `openModal(type, data)`

### Adding New Database Field
1. Update interface in `lib/types.ts`
2. Increment Dexie version in `lib/dexie.ts`
3. Add migration logic if needed
4. Update CRUD functions in `lib/db.ts`
5. Clear IndexedDB in DevTools for testing

### Debugging Dexie
- Open Chrome DevTools → Application → IndexedDB → flashlearny
- Inspect tables: decks, cards, progress
- Use Dexie.exists() to check if DB exists
- Use db.delete() in console to reset (dev only)

### Testing PWA
1. `npm run build` - Create production build
2. Serve over HTTPS (required for PWA)
3. Open DevTools → Application → Service Workers
4. Check Manifest, verify icons load
5. Test offline: DevTools → Network → Offline
6. Test install: Look for install prompt in address bar

## Troubleshooting

### PWA Not Installing
- Must be served over HTTPS
- Check manifest.json is accessible
- Verify all required icon sizes exist
- Check DevTools → Application → Manifest for errors

### IndexedDB Quota Exceeded
- Desktop Chrome: ~60% of disk space
- Mobile: ~50MB typically
- Show user-friendly message
- Implement deck export before cleanup

### Dark Mode Not Working
- Check `next-themes` provider in layout
- Verify `dark:` classes in Tailwind
- Ensure theme toggle updates Zustand store

### Study Session State Loss
- Study session state NOT persisted (by design)
- Only theme and currentDeckId persist
- Progress IS persisted in IndexedDB
- Refresh during study loses session progress (expected)

## Future Enhancements (Post-MVP)

- Spaced repetition scheduling (SM-2 algorithm)
- Image support in cards (via IndexedDB blob storage)
- Audio pronunciation (Web Speech API)
- Deck sharing via URL (compressed JSON)
- Multi-language flashcards with TTS
- Statistics dashboard with charts
- Tagging and advanced search
- Desktop sync via Web Bluetooth or QR code
- Gamification (streaks, achievements)

## Security Considerations

- No authentication (local-only app)
- No backend API
- Data stored in browser (user's device only)
- CSV import: Sanitize user input to prevent XSS
- Service worker: Ensure cache poisoning protections
- Content Security Policy headers in next.config.ts

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals
- Color contrast compliance (WCAG AA)
- Screen reader tested (VoiceOver, NVDA)

## Browser Support

- Chrome/Edge 90+ (full support)
- Firefox 88+ (full support)
- Safari 14+ (iOS/macOS)
- Samsung Internet 15+
- PWA install: Chrome, Edge, Safari on iOS 11.3+

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Auto-deploy on push to main
4. Access via `.vercel.app` domain
5. Custom domain optional

### Environment Variables
None required (no backend).

### Build Settings
- Build command: `npm run build`
- Output directory: `.next`
- Install command: `npm install`
- Node version: 20.x

## Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Dexie.js Docs](https://dexie.org)
- [TanStack Query Docs](https://tanstack.com/query)
- [Zustand Docs](https://zustand.docs.pmnd.rs/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

## License & Credits

- Project: FlashyLearny
- Built with: Next.js, Dexie, Zustand, TanStack Query
- UI Components: shadcn/ui
- Icons: Lucide React

---

**Last Updated**: October 2025
**Version**: MVP 1.0
