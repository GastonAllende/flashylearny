'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCards, useDeckCompletion, useDeckProgress, useDeckAnalytics, useStudySession, useDeleteDeck, useExportDeck, useDecks, useProgress } from '../../../../hooks';
import { useUIStore } from '../../../../stores/ui';
import StudyCard from '@/components/StudyCard';
import { DeleteDeckDialog } from '@/components/ConfirmDialog';
import type { Card } from '../../../../lib/types';
import type { StudySession } from '../../../../stores/ui';
import { Brain, Trash2, CreditCard, BarChart3, PartyPopper, RotateCcw, CheckCircle, ArrowLeft, Shuffle, ClipboardList, Plus, Download, Eye, Clock } from 'lucide-react';

type TabType = 'cards' | 'study' | 'stats';

export default function DeckDetailPage() {
	const params = useParams();
	const router = useRouter();
	const deckId = params.deckId as string;
	const [activeTab, setActiveTab] = useState<TabType>('cards');
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const { data: decks } = useDecks();
	const currentDeckName = decks?.find(d => d.id === deckId)?.name || 'Deck';

	const { data: cards, isLoading: cardsLoading } = useCards(deckId);
	const { data: completion } = useDeckCompletion(deckId);
	const { data: deckProgress } = useDeckProgress(deckId);
	const { data: analytics } = useDeckAnalytics(deckId);
	const { startStudySession, openModal } = useUIStore();
	const deleteDeckMutation = useDeleteDeck();
	const exportDeckMutation = useExportDeck();

	const handleStartStudy = () => {
		// Navigate to Study tab where the user can choose
		// Shuffled or Ordered session per MVP optional shuffle
		if (cards && cards.length > 0) {
			setActiveTab('study');
		}
	};

	const handleDeleteDeck = async () => {
		try {
			await deleteDeckMutation.mutateAsync(deckId);
			router.push('/decks'); // Navigate back to decks list
		} catch (error) {
			console.error('Failed to delete deck:', error);
			// Could add toast notification here
		}
		setShowDeleteDialog(false);
	};

	const handleExportDeck = async () => {
		try {
			await exportDeckMutation.mutateAsync({ deckId });
		} catch (error) {
			console.error('Failed to export deck:', error);
			// Could add toast notification here
		}
	};

	const handleDeleteCard = (cardId: string, cardQuestion: string) => {
		openModal('deleteCard', { cardId, cardQuestion });
	};

	if (cardsLoading) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Mobile-first header */}
			<div className="space-y-4">
				{/* Back button */}
				<Link
					href="/decks"
					className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm"
				>
					<ArrowLeft className="h-4 w-4" /> Back to Decks
				</Link>

				{/* Deck title and progress */}
				<div className="space-y-3">
					<h1 className="text-2xl sm:text-3xl font-bold">{currentDeckName}</h1>
					{completion && (
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
								<span>{completion.completion}% complete</span>
								<span>{completion.total} cards • {completion.mastered} mastered</span>
							</div>
							<div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 w-full">
								<div
									className="bg-green-500 h-3 rounded-full transition-all duration-300"
									style={{ width: `${completion.completion}%` }}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Responsive action buttons */}
				<div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
					{/* Primary actions */}
					<div className="grid grid-cols-2 gap-3 sm:flex sm:gap-2">
						<Link
							href={`/decks/${deckId}/edit-card`}
							className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
						>
							<Plus className="h-4 w-4" />
							Add Card
						</Link>
						{cards && cards.length > 0 && (
							<button
								onClick={handleStartStudy}
								className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
							>
								<Brain className="h-4 w-4" />
								Start Study
							</button>
						)}
					</div>

					{/* Secondary actions - only show if cards exist */}
					{cards && cards.length > 0 && (
						<div className="grid grid-cols-2 gap-3 sm:flex sm:gap-2">
							<button
								onClick={() => openModal('renameDeck', { deckId, deckName: currentDeckName })}
								className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-3 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
								title="Rename this deck"
							>
								<CreditCard className="h-4 w-4" />
								Rename
							</button>
							<button
								onClick={() => openModal('resetProgress', { deckId })}
								className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
								title="Reset all learning progress for this deck"
							>
								<RotateCcw className="h-4 w-4" />
								Reset
							</button>
						</div>
					)}

					{/* Tertiary actions */}
					<div className="grid grid-cols-2 gap-3 sm:flex sm:gap-2">
						{cards && cards.length > 0 && (
							<button
								onClick={handleExportDeck}
								disabled={exportDeckMutation.isPending}
								className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
							>
								<Download className="h-4 w-4" />
								Export
							</button>
						)}
						<button
							onClick={() => setShowDeleteDialog(true)}
							className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
							disabled={deleteDeckMutation.isPending}
						>
							<Trash2 className="h-4 w-4" />
							Delete
						</button>
					</div>
				</div>
			</div>

			{/* Mobile-first tabs */}
			<div className="border-b border-gray-200 dark:border-gray-700">
				<nav className="flex">
					{[
						{ id: 'cards', label: 'Cards', icon: CreditCard },
						{ id: 'study', label: 'Study', icon: Brain },
						{ id: 'stats', label: 'Stats', icon: BarChart3 },
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as TabType)}
							className={`flex-1 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === tab.id
								? 'border-blue-500 text-blue-600 dark:text-blue-400'
								: 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
								}`}
						>
							<tab.icon className="h-4 w-4" />
							<span className="hidden sm:inline">{tab.label}</span>
						</button>
					))}
				</nav>
			</div>

			{/* Tab Content */}
			<div className="mt-6">
				{activeTab === 'cards' && (
					<CardsTab deckId={deckId} cards={cards} onDeleteCard={handleDeleteCard} />
				)}
				{activeTab === 'study' && (
					<StudyTab deckId={deckId} cards={cards} />
				)}
				{activeTab === 'stats' && (
					<StatsTab deckProgress={deckProgress} completion={completion} analytics={analytics} />
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<DeleteDeckDialog
				isOpen={showDeleteDialog}
				deckName="this deck"
				onConfirm={handleDeleteDeck}
				onCancel={() => setShowDeleteDialog(false)}
			/>
		</div>
	);
}

// Card Item Component with Progress
function CardItem({ card, deckId, onDelete }: { card: Card; deckId: string; onDelete: (cardId: string, cardQuestion: string) => void }) {
	const { data: progress } = useProgress(card.id);

	const getStatusBadge = () => {
		if (!progress) return null;

		const colors = {
			MASTERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
			LEARNING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
			NEW: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
		};

		return (
			<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[progress.status as keyof typeof colors] || colors.NEW}`}>
				{progress.status}
			</span>
		);
	};

	return (
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
			<div className="space-y-4">
				<div className="space-y-3">
					<div>
						<div className="flex items-center gap-2 mb-1">
							<h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Question</h4>
							{getStatusBadge()}
						</div>
						<p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{card.question}</p>
					</div>
					<div>
						<h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1 text-sm">Answer</h4>
						<p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{card.answer}</p>
					</div>
				</div>

				{/* Progress Stats */}
				{progress && (progress.timesSeen > 0 || progress.timesKnown > 0) && (
					<div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
						<div className="flex flex-wrap items-center gap-3 text-sm">
							<span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
								<Eye className="w-4 h-4" />
								<span className="font-medium">{progress.timesSeen}</span>
								<span className="text-xs">seen</span>
							</span>
							<span className="flex items-center gap-1 text-green-600 dark:text-green-400">
								<CheckCircle className="w-4 h-4" />
								<span className="font-medium">{progress.timesKnown}</span>
								<span className="text-xs">knew</span>
							</span>
							{(progress.timesAlmost ?? 0) > 0 && (
								<span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
									<span className="w-4 h-4 flex items-center justify-center font-bold">~</span>
									<span className="font-medium">{progress.timesAlmost}</span>
									<span className="text-xs">almost</span>
								</span>
							)}
							{progress.timesSeen > 0 && (
								<span className="flex items-center gap-1">
									<span className="text-xs text-gray-600 dark:text-gray-400">Accuracy:</span>
									<span className={`font-semibold ${
										Math.round((progress.timesKnown / progress.timesSeen) * 100) >= 80
											? 'text-green-600 dark:text-green-400'
											: Math.round((progress.timesKnown / progress.timesSeen) * 100) >= 50
											? 'text-yellow-600 dark:text-yellow-400'
											: 'text-red-600 dark:text-red-400'
									}`}>
										{Math.round((progress.timesKnown / progress.timesSeen) * 100)}%
									</span>
								</span>
							)}
						</div>
						{progress.lastReviewedAt && (
							<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
								<Clock className="w-3 h-3" />
								Last reviewed: {new Date(progress.lastReviewedAt).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</div>
						)}
					</div>
				)}

				<div className="flex gap-3 sm:gap-2">
					<Link
						href={`/decks/${deckId}/edit-card/${card.id}`}
						className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-center text-sm"
					>
						Edit
					</Link>
					<button
						onClick={() => onDelete(card.id, card.question)}
						className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}

// Cards Tab Component
function CardsTab({ deckId, cards, onDeleteCard }: { deckId: string; cards: Card[] | undefined; onDeleteCard: (cardId: string, cardQuestion: string) => void; }) {
	if (!cards || cards.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="mb-4 flex justify-center"><CreditCard className="h-16 w-16" /></div>
				<h3 className="text-xl font-semibold mb-2">No cards yet</h3>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					Add your first card to start building your study deck
				</p>
				<Link
					href={`/decks/${deckId}/edit-card`}
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 sm:py-2 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center gap-2 text-base sm:text-sm"
				>
					<Plus className="h-5 w-5" />
					Add Your First Card
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg sm:text-xl font-semibold">Cards ({cards.length})</h2>
				<Link
					href={`/decks/${deckId}/edit-card`}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 text-sm"
				>
					<Plus className="h-4 w-4" />
					Add Card
				</Link>
			</div>

			<div className="space-y-4">
				{cards.map((card) => (
					<CardItem key={card.id} card={card} deckId={deckId} onDelete={onDeleteCard} />
				))}
			</div>
		</div>
	);
}

// Study Tab Component  
function StudyTab({ deckId, cards }: { deckId: string; cards: Card[] | undefined; }) {
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
				<h3 className="text-xl font-semibold mb-2">No cards to study</h3>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					Add some cards to this deck before you can start studying
				</p>
				<Link
					href={`/decks/${deckId}/edit-card`}
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-base sm:text-sm"
				>
					Add Cards
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
				<h3 className="text-xl font-semibold mb-2">Ready to study?</h3>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					You have {cards.length} cards ready for studying
				</p>
				<div className="space-y-3 max-w-sm mx-auto">
					<button
						onClick={() => startSession(deckId, true)}
						className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-base sm:text-sm"
					>
						<span className="inline-flex items-center justify-center gap-2"><Shuffle className="h-5 w-5" /> Shuffled Study</span>
					</button>
					<button
						onClick={() => startSession(deckId, false)}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-base sm:text-sm"
					>
						<span className="inline-flex items-center justify-center gap-2"><ClipboardList className="h-5 w-5" /> Ordered Study</span>
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
						Card {studySession.currentIndex + 1} of {studySession.cardIds.length}
					</h3>
					<button
						onClick={endStudySession}
						className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-2 rounded transition-colors text-sm"
					>
						End Session
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
						<div className="text-gray-600 dark:text-gray-400">Known</div>
					</div>
					<div className="text-center">
						<div className="text-yellow-600 dark:text-yellow-400 font-semibold">{studySession.sessionStats.almostCards}</div>
						<div className="text-gray-600 dark:text-gray-400">Almost</div>
					</div>
					<div className="text-center">
						<div className="text-red-600 dark:text-red-400 font-semibold">{studySession.sessionStats.unknownCards}</div>
						<div className="text-gray-600 dark:text-gray-400">Unknown</div>
					</div>
					<div className="text-center">
						<div className="text-gray-600 dark:text-gray-400 font-semibold">{studySession.sessionStats.seenCards}</div>
						<div className="text-gray-600 dark:text-gray-400">Total</div>
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
					<p className="mt-4 text-gray-600 dark:text-gray-400">Loading card...</p>
				</div>
			)}

			{/* Card Controls */}
			{!studySession.showAnswer && (
				<div className="text-center">
					<button
						onClick={showAnswer}
						className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 sm:px-6 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-base sm:text-sm"
					>
						Show Answer
					</button>
				</div>
			)}

			{/* Loading Overlay */}
			{isUpdatingProgress && (
				<div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
						<span>Updating progress...</span>
					</div>
				</div>
			)}
		</div>
	);
}

// Stats Tab Component
function StatsTab({
	deckProgress,
	completion,
	analytics
}: {
	deckProgress: Array<{ card: Card; progress: { id: string; cardId: string; status: string; timesSeen: number; timesKnown: number; }; }> | undefined;
	completion: { completion: number; mastered: number; total: number; } | undefined;
	analytics: { statusDistribution: { NEW: number; LEARNING: number; MASTERED: number; }; averageAccuracy: number; totalReviews: number; recentActivity: { date: string; reviews: number; }[]; } | undefined;
}) {
	if (!deckProgress || deckProgress.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="mb-4 flex justify-center"><BarChart3 className="h-16 w-16" /></div>
				<h3 className="text-xl font-semibold mb-2">No statistics yet</h3>
				<p className="text-gray-600 dark:text-gray-400">
					Study some cards to see your progress statistics
				</p>
			</div>
		);
	}

	// Use analytics data if available, otherwise fallback to computing from deckProgress
	const statusCounts = analytics?.statusDistribution || deckProgress.reduce((acc, { progress }) => {
		acc[progress.status] = (acc[progress.status] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Deck Statistics</h2>

			{/* Status Distribution */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
					<div className="text-3xl font-bold text-green-600">{statusCounts.MASTERED || 0}</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">Mastered</div>
				</div>

				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
					<div className="text-3xl font-bold text-yellow-600">{statusCounts.LEARNING || 0}</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">Learning</div>
				</div>

				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
					<div className="text-3xl font-bold text-gray-600">{statusCounts.NEW || 0}</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">New</div>
				</div>
			</div>

			{/* Enhanced Analytics */}
			{analytics && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
						<div className="text-3xl font-bold text-blue-600">{analytics.averageAccuracy}%</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">Average Accuracy</div>
					</div>

					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
						<div className="text-3xl font-bold text-purple-600">{analytics.totalReviews}</div>
						<div className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</div>
					</div>
				</div>
			)}

			{completion && (
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<h3 className="font-semibold mb-4">Progress Overview</h3>
					<div className="space-y-3">
						<div className="flex justify-between">
							<span>Completion Rate</span>
							<span className="font-semibold">{completion.completion}%</span>
						</div>
						<div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4">
							<div
								className="bg-green-500 h-4 rounded-full transition-all duration-300"
								style={{ width: `${completion.completion}%` }}
							/>
						</div>
						<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
							<span>{completion.mastered} mastered</span>
							<span>{completion.total} total</span>
						</div>
					</div>
				</div>
			)}

			{/* Recent Activity Chart */}
			{analytics && analytics.recentActivity.length > 0 && (
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<h3 className="font-semibold mb-4">Recent Activity</h3>
					<div className="space-y-2">
						{analytics.recentActivity.map((activity) => (
							<div key={activity.date} className="flex items-center justify-between">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									{new Date(activity.date).toLocaleDateString()}
								</span>
								<div className="flex items-center gap-2">
									<div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16">
										<div
											className="bg-blue-500 h-2 rounded-full transition-all duration-300"
											style={{ width: `${Math.min(100, (activity.reviews / Math.max(...analytics.recentActivity.map(a => a.reviews))) * 100)}%` }}
										/>
									</div>
									<span className="text-sm font-medium w-8 text-right">{activity.reviews}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

// Study Completion Component
function StudyCompletionView({
	deckId,
	session,
	onRestart,
	onEnd,
	checkDeckMastery
}: {
	deckId: string;
	session: StudySession;
	onRestart: () => void;
	onEnd: () => void;
	checkDeckMastery: () => Promise<boolean>;
}) {
	const [isDeckMastered, setIsDeckMastered] = useState<boolean | null>(null);
	const accuracy = session.sessionStats.seenCards > 0
		? Math.round((session.sessionStats.knownCards / session.sessionStats.seenCards) * 100)
		: 0;

	// Check if the entire deck is mastered when component mounts
	useEffect(() => {
		checkDeckMastery().then(setIsDeckMastered);
	}, [checkDeckMastery]);

	return (
		<div className="text-center py-16 max-w-2xl mx-auto">
			{/* Conditional celebration based on deck mastery */}
			{isDeckMastered ? (
				<>
					<div className="mb-6 flex justify-center"><PartyPopper className="h-16 w-16" /></div>
					<h2 className="text-3xl font-bold mb-4">Deck Mastered!</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-8">
						Congratulations! You have mastered all cards in this deck.
						<br />All cards are now marked as MASTERED status!
					</p>
				</>
			) : (
				<>
					<div className="mb-6 flex justify-center"><PartyPopper className="h-16 w-16" /></div>
					<h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-8">
						Great job studying your flashcards!
					</p>
				</>
			)}

			{/* Session Statistics */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
					<div className="text-2xl font-bold text-blue-600">{session.cardIds.length}</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">Total Cards</div>
				</div>
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
					<div className="text-2xl font-bold text-green-600">{session.sessionStats.knownCards}</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">Known</div>
				</div>
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
					<div className="text-2xl font-bold text-yellow-600">{session.sessionStats.almostCards}</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">Almost</div>
				</div>
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
					<div className="text-2xl font-bold text-red-600">{session.sessionStats.unknownCards}</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">Unknown</div>
				</div>
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
					<div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
					<div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					{!isDeckMastered && (
						<button
							onClick={onRestart}
							className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
						>
							<span className="inline-flex items-center gap-2"><RotateCcw className="h-5 w-5" /> Study Again</span>
						</button>
					)}
					<Link
						href={`/decks/${deckId}`}
						onClick={onEnd}
						className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
					>
						<span className="inline-flex items-center gap-2"><BarChart3 className="h-5 w-5" /> View Stats</span>
					</Link>
				</div>
				<Link
					href="/decks"
					onClick={onEnd}
					className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
				>
					<span className="inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Back to All Decks</span>
				</Link>
			</div>
		</div>
	);
}