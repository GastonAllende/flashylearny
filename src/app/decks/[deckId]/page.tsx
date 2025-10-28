'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCards, useDeckCompletion, useDeckProgress, useDeckAnalytics, useDeleteDeck, useExportDeck, useDecks } from '@/hooks';
import { useUIStore } from '@/stores/ui';
import { DeleteDeckDialog } from '@/components/ConfirmDialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CardsTab } from '@/features/cards/components/CardsTab';
import { StudyTab } from '@/features/study/components/StudyTab';
import { StatsTab } from '@/features/stats/components/StatsTab';
import { Brain, Trash2, CreditCard, BarChart3, RotateCcw, ArrowLeft, Plus, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'cards' | 'study' | 'stats';

export default function DeckDetailPage() {
	const t = useTranslations('DeckDetail');
	const params = useParams();
	const router = useRouter();
	const searchParams = useSearchParams();
	const deckId = params.deckId as string;
	const [activeTab, setActiveTab] = useState<TabType>('cards');

	// Handle tab query parameter
	useEffect(() => {
		const tab = searchParams.get('tab') as TabType;
		if (tab && ['cards', 'study', 'stats'].includes(tab)) {
			setActiveTab(tab);
		}
	}, [searchParams]);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const { data: decks } = useDecks();
	const currentDeck = decks?.find(d => d.id === deckId);
	const currentDeckName = currentDeck?.name || 'Deck';
	const currentDeckCategory = currentDeck?.category || null;

	const { data: cards, isLoading: cardsLoading } = useCards(deckId);
	const { data: completion } = useDeckCompletion(deckId);
	const { data: deckProgress } = useDeckProgress(deckId);
	const { data: analytics } = useDeckAnalytics(deckId);
	const { openModal } = useUIStore();
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
				<Spinner size="xl" className="text-primary" />
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
					className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 text-sm"
				>
					<ArrowLeft className="h-4 w-4" /> {t('backToDecks')}
				</Link>

				{/* Deck title and progress */}
				<div className="space-y-3">
					<h1 className="text-2xl sm:text-3xl font-bold">{currentDeckName}</h1>
					{completion && (
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm text-muted-foreground">
								<span>{t('complete', { value: completion.completion })}</span>
								<span>{t('cardsSummary', { total: completion.total, mastered: completion.mastered })}</span>
							</div>
							<div className="bg-muted rounded-full h-3 w-full">
								<div
									className="bg-primary h-3 rounded-full transition-all duration-300"
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
							className={cn(buttonVariants(), "py-3 sm:py-2 text-sm font-semibold")}
						>
							<Plus className="h-4 w-4" />
							{t('addCard')}
						</Link>
						{cards && cards.length > 0 && (
							<Button
								onClick={handleStartStudy}
								variant="secondary"
								className="py-3 sm:py-2 text-sm font-semibold"
							>
								<Brain className="h-4 w-4" />
								{t('startStudy')}
							</Button>
						)}
					</div>

					{/* Secondary actions - only show if cards exist */}
					{cards && cards.length > 0 && (
						<div className="grid grid-cols-2 gap-3 sm:flex sm:gap-2">
							<Button
								onClick={() => openModal('renameDeck', { deckId, deckName: currentDeckName, category: currentDeckCategory })}
								variant="outline"
								className="py-3 sm:py-2 text-sm font-medium"
								title={t('renameTitle')}
							>
								<CreditCard className="h-4 w-4" />
								{t('rename')}
							</Button>
							<Button
								onClick={() => openModal('resetProgress', { deckId })}
								variant="secondary"
								className="py-3 sm:py-2 text-sm font-medium"
								title={t('resetTitle')}
							>
								<RotateCcw className="h-4 w-4" />
								{t('reset')}
							</Button>
						</div>
					)}

					{/* Tertiary actions */}
					<div className="grid grid-cols-2 gap-3 sm:flex sm:gap-2">
						{cards && cards.length > 0 && (
							<Button
								onClick={handleExportDeck}
								disabled={exportDeckMutation.isPending}
								variant="secondary"
								className="py-3 sm:py-2 text-sm font-medium"
							>
								<Download className="h-4 w-4" />
								{t('export')}
							</Button>
						)}
						<Button
							onClick={() => setShowDeleteDialog(true)}
							variant="destructive"
							className="py-3 sm:py-2 text-sm font-medium"
							disabled={deleteDeckMutation.isPending}
						>
							<Trash2 className="h-4 w-4" />
							{t('delete')}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile-first tabs */}
			<div className="border-b border">
				<nav className="flex">
					{[
						{ id: 'cards', label: t('tabs.cards'), icon: CreditCard },
						{ id: 'study', label: t('tabs.study'), icon: Brain },
						{ id: 'stats', label: t('tabs.stats'), icon: BarChart3 },
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as TabType)}
							className={`flex-1 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${activeTab === tab.id
								? 'border-primary text-primary'
								: 'border-transparent text-muted-foreground hover:text-foreground'
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
				deckName={currentDeckName}
				onConfirm={handleDeleteDeck}
				onCancel={() => setShowDeleteDialog(false)}
			/>
		</div>
	);
}

