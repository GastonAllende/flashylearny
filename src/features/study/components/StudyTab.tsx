'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useUIStore } from '@/stores/ui';
import { useStudySession } from '@/hooks';
import { Button, buttonVariants } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import StudyCard from '@/features/study/components/StudyCard';
import { StudyCompletionView } from './StudyCompletionView';
import type { Card } from '@/lib/types';
import { Brain, Shuffle, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudyTabProps {
	deckId: string;
	cards: Card[] | undefined;
}

export function StudyTab({ deckId, cards }: StudyTabProps) {
	const t = useTranslations('DeckDetail');
	const {
		studySession,
		endStudySession,
		showAnswer,
	} = useUIStore();

	const {
		currentCard,
		isSessionCompleted,
		sessionProgress,
		startSession,
		handleCardResponse,
		restartSession,
		checkDeckMastery,
		isUpdatingProgress,
	} = useStudySession();

	// No cards available
	if (!cards || cards.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="mb-4 flex justify-center"><Brain className="h-16 w-16" /></div>
				<h3 className="text-xl font-semibold mb-2">{t('studyEmptyTitle')}</h3>
				<p className="text-muted-foreground mb-6">{t('studyEmptyDescription')}</p>
				<Link
					href={`/decks/${deckId}/edit-card`}
					className={cn(buttonVariants(), "py-3 sm:py-2 text-base sm:text-sm font-semibold")}
				>
					{t('addCards')}
				</Link>
			</div>
		);
	}

	// Session completed
	if (studySession && isSessionCompleted) {
		return <StudyCompletionView deckId={deckId} session={studySession} onRestart={restartSession} onEnd={endStudySession} checkDeckMastery={checkDeckMastery} />;
	}

	// No active session or session for different deck
	if (!studySession || studySession.deckId !== deckId) {
		return (
			<div className="text-center py-16">
				<div className="mb-4 flex justify-center"><Brain className="h-16 w-16" /></div>
				<h3 className="text-xl font-semibold mb-2">{t('readyTitle')}</h3>
				<p className="text-muted-foreground mb-6">
					{t('readyDescription', { count: cards.length })}
				</p>
				<div className="space-y-3 max-w-sm mx-auto">
					<Button
						onClick={() => startSession(deckId, true)}
						variant="secondary"
						className="w-full py-3 sm:py-2 text-base sm:text-sm font-semibold"
					>
						<Shuffle className="h-5 w-5" /> {t('shuffled')}
					</Button>
					<Button
						onClick={() => startSession(deckId, false)}
						className="w-full py-3 sm:py-2 text-base sm:text-sm font-semibold"
					>
						<ClipboardList className="h-5 w-5" /> {t('ordered')}
					</Button>
				</div>
			</div>
		);
	}

	// Active study session
	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Progress Header */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">
						{t('progress.cardOf', { current: studySession.currentIndex + 1, total: studySession.cardIds.length })}
					</h3>
					<button
						onClick={endStudySession}
						className="text-muted-foreground hover:text-foreground px-3 py-2 rounded transition-colors text-sm"
					>
						{t('progress.endSession')}
					</button>
				</div>

				{/* Progress Bar */}
				<div className="bg-muted rounded-full h-3 overflow-hidden">
					<div
						className="bg-primary h-full transition-all duration-300 ease-out"
						style={{ width: `${sessionProgress}%` }}
					/>
				</div>

				{/* Session Stats - Mobile responsive */}
				<div className="grid grid-cols-4 gap-2 text-xs sm:text-sm">
					<div className="text-center">
						<div className="text-foreground font-semibold">{studySession.sessionStats.knownCards}</div>
						<div className="text-muted-foreground">{t('progress.known')}</div>
					</div>
					<div className="text-center">
						<div className="text-foreground font-semibold">{studySession.sessionStats.almostCards}</div>
						<div className="text-muted-foreground">{t('progress.almost')}</div>
					</div>
					<div className="text-center">
						<div className="text-foreground font-semibold">{studySession.sessionStats.unknownCards}</div>
						<div className="text-muted-foreground">{t('progress.unknown')}</div>
					</div>
					<div className="text-center">
						<div className="text-muted-foreground font-semibold">{studySession.sessionStats.seenCards}</div>
						<div className="text-muted-foreground">{t('progress.total')}</div>
					</div>
				</div>
			</div>

			{/* Study Card */}
			{currentCard ? (
				<StudyCard
					card={currentCard}
					onResponse={handleCardResponse}
					isFlipped={studySession.showAnswer}
					className="mb-6"
				/>
			) : (
				<div className="text-center py-16">
					<Spinner size="xl" className="text-primary mx-auto" />
					<p className="mt-4 text-muted-foreground">{t('progress.loadingCard')}</p>
				</div>
			)}

			{/* Card Controls */}
			{!studySession.showAnswer && (
				<div className="text-center">
					<Button
						onClick={showAnswer}
						className="w-full max-w-sm py-3 sm:py-2 text-base sm:text-sm font-semibold"
					>
						{t('progress.showAnswer')}
					</Button>
				</div>
			)}

			{/* Loading Overlay */}
			{isUpdatingProgress && (
				<div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
					<div className="bg-card rounded-lg p-6 flex items-center gap-3">
						<Spinner size="md" className="text-primary" />
						<span>{t('progress.updating')}</span>
					</div>
				</div>
			)}
		</div>
	);
}
