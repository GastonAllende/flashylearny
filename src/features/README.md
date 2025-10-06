# Features Directory

This directory contains feature-based modules following a domain-driven design pattern.

## Structure

Each feature module is organized as follows:

```
features/
├── [feature-name]/
│   ├── components/      # React components specific to this feature
│   ├── hooks/          # Custom hooks for this feature
│   └── index.ts        # Barrel export for public API
```

## Available Features

### 📚 Decks (`/features/decks`)
Manages deck creation, listing, and organization.

**Components:**
- `DeckList` - Grid of deck cards
- `DeckCard` - Individual deck card with stats
- `CreateDeckForm` - Form for creating new decks
- `ImportCSV` - CSV import functionality

**Hooks:**
- `useDecks` - Fetch all decks
- `useCreateDeck` - Create new deck
- `useRenameDeck` - Rename deck
- `useDeleteDeck` - Delete deck with cascade
- `useExportDeck` - Export deck to CSV
- `useExportAllDecks` - Export all decks
- `useMigrations` - Database migrations

### 🃏 Cards (`/features/cards`)
Handles individual card management within decks.

**Components:**
- `CardsTab` - Tab showing all cards in a deck
- `CardItem` - Individual card display with progress

**Hooks:**
- `useCards` - Fetch cards for a deck
- `useCard` - Fetch single card
- `useCreateCard` - Create new card
- `useUpdateCard` - Update card content
- `useDeleteCard` - Delete card

### 🧠 Study (`/features/study`)
Manages the study session experience.

**Components:**
- `StudyTab` - Study session interface
- `StudyCard` - Flashcard with flip animation
- `CardFace` - Question/Answer card face
- `ResponseButton` - User response buttons (knew/almost/didn't know)
- `StudyCompletionView` - Session completion screen

**Hooks:**
- `useStudySession` - Manage study session state
- `useStudyCards` - Pre-fetch cards for study
- `useStudyProgress` - Update card progress during study

### 📊 Stats (`/features/stats`)
Tracks and displays learning progress and analytics.

**Components:**
- `StatsTab` - Statistics and analytics dashboard

**Hooks:**
- `useProgress` - Get progress for a specific card
- `useDeckProgress` - Get progress for all cards in deck
- `useDeckCompletion` - Get deck completion percentage
- `useDeckAnalytics` - Get detailed analytics (accuracy, reviews, etc.)

### 📄 CSV (`/features/csv`)
Handles CSV import/export functionality.

**Hooks:**
- `useImportCSV` - Import decks from CSV file

## Import Patterns

### Same Feature
```typescript
// Within the same feature, use relative imports
import { CardItem } from './CardItem';
```

### Cross-Feature
```typescript
// Use the feature's barrel export
import { useProgress } from '@/features/stats';
import { StudyCard } from '@/features/study';
```

### Shared Resources
```typescript
// Use @ alias for shared resources
import { Button } from '@/components/ui/button';
import type { Card } from '@/lib/types';
import { useUIStore } from '@/stores/ui';
```

### From App Routes
```typescript
// Import from feature barrel exports
import { DeckList } from '@/features/decks';
import { CardsTab } from '@/features/cards';
import { StudyTab } from '@/features/study';
import { StatsTab } from '@/features/stats';
```

## Backward Compatibility

The root `/hooks/index.ts` file re-exports all hooks from their feature modules for backward compatibility. This allows existing imports like `import { useDecks } from '@/hooks'` to continue working.

## Benefits of This Structure

1. **Clear Boundaries**: Each feature is self-contained with its own components and hooks
2. **Easy Navigation**: Related files are grouped together by domain
3. **Scalability**: New features can be added without cluttering the codebase
4. **Maintainability**: Changes to one feature are less likely to affect others
5. **Discoverability**: Developers can easily find all code related to a feature
6. **Testing**: Features can be tested in isolation
7. **Code Splitting**: Easier to implement lazy loading per feature

## Adding a New Feature

1. Create feature directory: `mkdir -p src/features/[feature-name]/{components,hooks}`
2. Add components and hooks
3. Create barrel export `src/features/[feature-name]/index.ts`
4. Update this README with the new feature

## Migration Notes

This structure was migrated from a mixed component organization on 2025-10-06. All imports have been updated to use the `@/features/*` pattern.
