'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useUIStore } from '../../../../../stores/ui';
import { useStudySession } from '../../../../../hooks';
import StudyCard from '@/components/StudyCard';
import { StudyCompletionView } from './StudyCompletionView';
import type { Card } from '../../../../../lib/types';
import { Brain, Shuffle, ClipboardList } from 'lucide-react';

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
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-base sm:text-sm"
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
					<button
						onClick={() => startSession(deckId, true)}
						className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-base sm:text-sm"
					>
						<span className="inline-flex items-center justify-center gap-2"><Shuffle className="h-5 w-5" /> {t('shuffled')}</span>
					</button>
					<button
						onClick={() => startSession(deckId, false)}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-base sm:text-sm"
					>
						<span className="inline-flex items-center justify-center gap-2"><ClipboardList className="h-5 w-5" /> {t('ordered')}</span>
					</button>
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
						className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-2 rounded transition-colors text-sm"
					>
						{t('progress.endSession')}
					</button>
				</div>

				{/* Progress Bar */}
				<div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
					<div
						className="bg-blue-500 h-full transition-all duration-300 ease-out"
						style={{ width: `${sessionProgress}%` }}
					/>
				</div>

				{/* Session Stats - Mobile responsive */}
				<div className="grid grid-cols-4 gap-2 text-xs sm:text-sm">
					<div className="text-center">
						<div className="text-green-600 dark:text-green-400 font-semibold">{studySession.sessionStats.knownCards}</div>
						<div className="text-muted-foreground">{t('progress.known')}</div>
					</div>
					<div className="text-center">
						<div className="text-yellow-600 dark:text-yellow-400 font-semibold">{studySession.sessionStats.almostCards}</div>
						<div className="text-muted-foreground">{t('progress.almost')}</div>
					</div>
					<div className="text-center">
						<div className="text-red-600 dark:text-red-400 font-semibold">{studySession.sessionStats.unknownCards}</div>
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
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-muted-foreground">{t('progress.loadingCard')}</p>
				</div>
			)}

			{/* Card Controls */}
			{!studySession.showAnswer && (
				<div className="text-center">
					<button
						onClick={showAnswer}
						className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 sm:px-6 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-base sm:text-sm"
					>
						{t('progress.showAnswer')}
					</button>
				</div>
			)}

			{/* Loading Overlay */}
			{isUpdatingProgress && (
				<div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
					<div className="bg-card rounded-lg p-6 flex items-center gap-3">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
						<span>{t('progress.updating')}</span>
					</div>
				</div>
			)}
		</div>
	);
}
