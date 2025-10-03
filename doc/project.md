## 1) Project Setup

2. Install core deps
    - npm install dexie zustand @tanstack/react-query next-pwa class-variance-authority clsx zod
    - npm install -D @types/dexie @types/node @types/react @types/react-dom @testing-library/react @testing-library/user-event vitest @vitest/ui jsdom playwright
3. Tailwind config
    - Add shadcn/ui or your chosen component lib
    - Configure base styles, dark mode class strategy
4. Project metadata
    - Add app/favicon, app/manifest.json, icons, theme-color

Recommended folders:

- app/
- components/
- lib/ (dexie, csv, id, date)
- stores/
- hooks/
- styles/
- tests/
- e2e/

---

## 2) PWA Enablement

1. Enable PWA for a 15.5.4 version of Next.js. in App router PWA is supported.

---

## 3) Data Model (IndexedDB via Dexie)

Entities and minimal fields:

- Deck
    - id string (ulid)
    - name string
    - createdAt number
    - updatedAt number
- Card
    - id string
    - deckId string (index)
    - question string
    - answer string
    - createdAt number
    - updatedAt number
- Progress
    - id string
    - cardId string (index)
    - status 'NEW' | 'LEARNING' | 'MASTERED'
    - lastReviewedAt number | null
    - timesSeen number
    - timesKnown number

dexie.ts:

- db = new Dexie('flashlearny')
- db.version(1).stores({
    - decks: 'id, name, updatedAt',
    - cards: 'id, deckId, updatedAt',
    - progress: 'id, cardId, status'

})

CRUD helpers in lib/db.ts:

- createDeck, renameDeck, deleteDeckCascade
- createCard, updateCard, deleteCard
- getDecks, getCardsByDeck
- getOrInitProgress(cardId), setProgress(cardId, status), incrementSeenKnown

---

## 4) State and Data Fetching

- Use React Query for async operations from Dexie:
    - queryKey patterns: ['decks'], ['cards', deckId], ['progress', cardId]
    - invalidate on mutations
- Use Zustand for UI state:
    - Current deckId, study session state, theme, modals
- Avoid server actions for MVP 1. Everything is client‑side.

---

## 5) Routing and Pages (Next.js App Router)

Pages:

- / (Start/Landing)
    - Title, tagline, “Get Started” → /decks
    - Show install prompt button if available
- /decks
    - List decks with creation button
    - Each row shows % completion and card count
- /decks/[deckId]
    - Tabs: Cards | Study | Stats
- /decks/[deckId]/edit-card/[cardId?]
    - New/edit card form
- Optional static pages: /about, /help, /privacy

---

## 6) UI Components

- Shell
    - Header: Decks | Create Deck | Profile placeholder
    - Footer: About | Help | Privacy
- DeckList, DeckCard
- CardList, CardRow
- CardEditor (question, answer)
- StudyCard
    - Front side with question
    - Flip interaction
    - Buttons: I knew it | I didn’t | Almost knew it
- ProgressBar, EmptyState, ConfirmDialog, Toast

Design:

- Mobile‑first, large tap targets
- Dark mode toggle
- Keep it Crisp. 60fps feel, no layout shifts.

---

## 7) Study Flow

Session builder:

1. Load all cards in deck
2. Optionally shuffle
3. For each card:
    - Show question
    - Reveal answer on tap
    - User marks Known or Not Known

Progress update rules (simple):

- NEW → LEARNING on first interaction
- If Known:
    - timesSeen++, timesKnown++, lastReviewedAt=now
    - If timesKnown >= 3, status → MASTERED
- If Not Known:
    - timesSeen++, lastReviewedAt=now
    - status → LEARNING

Store session metrics in memory; persist only per‑card progress.

---

## 8) Progress and Deck Completion

- Deck completion = MASTERED cards / total cards
- Compute with a Dexie tx:
    - Get cards, join progress by cardId
- Cache with React Query and recompute on mutations

---

## 9) Import / Export CSV

CSV format:

- Columns: deckName, question, answer

Import steps:

1. Choose file
2. Parse (streaming parser optional for big files)
3. Group by deckName
4. For each deck, upsert deck
5. Create cards and init progress as NEW

Export steps:

- Given deckId, fetch cards
- Generate CSV and trigger download

Use a lightweight parser or your own simple split if you control format.

---

## 10) Testing

- Unit (Vitest)
    - lib/db.ts CRUD, progress transitions, csv parsing
- Component tests (Vitest + Testing Library)
    - CardEditor, StudyCard flows
- E2E (Playwright)
    - Create deck → add cards → study → progress bars
    - Offline mode: set network offline, confirm operations still work

CI:

- GitHub Actions: run vitest and playwright on push

---

## 11) Performance and Resilience

- Dexie transactions for batch operations
- Keep component trees small and memoize heavy lists
- Use React Query staleTime for Dexie reads to reduce thrash
- Defer non‑critical work with requestIdleCallback
- Handle quota and IndexedDB errors with user‑friendly toasts

---

## 12) i18n (Optional in MVP 1)

- Add spanish as second language
- If enabling now: next-intl with en and es namespaces
- Wrap UI strings in t('key') and keep JSON locale files small

---

## 13) Deployment

- Local: npm dev
- Build: npm build
- Vercel:
    - Link repo, auto‑deploy main branch
    - Verify manifest, PWA install on mobile Chrome/Safari
    - Test offline from deployed URL

---

## 14) Milestones Checklist

- [ ]  Repo initialized, Tailwind and shadcn set up
- [ ]  PWA manifest and service worker working
- [ ]  Dexie schema and CRUD helpers
- [ ]  React Query + Zustand wiring
- [ ]  Start page with Get Started and Install button
- [ ]  Decks list with create, rename, delete
- [ ]  Cards CRUD per deck
- [ ]  Study flow with flip and Known/Not Known/Almost
- [ ]  Progress computation and deck completion %
- [ ]  CSV import and export
- [ ]  Unit, component, and E2E tests
- [ ]  Deployed on Vercel and verified offline

---

## 15) Minimal Code Stubs

lib/id.ts:

- export const uid = () => crypto.randomUUID() // or ulid

lib/dexie.ts:

- import Dexie from 'dexie'
- export const db = new Dexie('flashlearny') as Dexie & {
    - decks: Dexie.Table<Deck, string>
    - cards: Dexie.Table<Card, string>
    - progress: Dexie.Table<Progress, string>
- }
- db.version(1).stores({
    - decks: 'id, name, updatedAt',
    - cards: 'id, deckId, updatedAt',
    - progress: 'id, cardId, status'

})

stores/ui.ts (Zustand):

- currentDeckId, setCurrentDeckId
- theme, setTheme
- modal state

Study handler:

- function onMark(cardId, known) {
    - const p = await getOrInitProgress(cardId)
    - if (known) { p.timesKnown++; if (p.timesKnown >= 3) p.status='MASTERED' }
    - else { p.status='LEARNING' }
    - p.timesSeen++; p.lastReviewedAt=[Date.now](http://Date.now)()
    - await db.progress.put(p)
    - queryClient.invalidateQueries(['progress', cardId])

}