'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDecks, useCreateDeck, useExportAllDecks, useCategories } from '@/hooks';
import { useSubscription } from '@/hooks/use-subscription';
import { useUIStore } from '@/stores/ui';
import { ImportCSV } from '@/features/decks/components/ImportCSV';
import DeckCard from '@/features/decks/components/DeckCard';
import { Download, BookOpen, X, Filter, Tag, Crown, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function DecksPage() {
	const t = useTranslations('DecksPage');
	const [isCreating, setIsCreating] = useState(false);
	const [newDeckName, setNewDeckName] = useState('');
	const [category, setCategory] = useState('');
	const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
	const [showImportModal, setShowImportModal] = useState(false);

	const { data: decks, isLoading } = useDecks();
	const { data: categories } = useCategories();
	const createDeckMutation = useCreateDeck();
	const exportAllDecksMutation = useExportAllDecks();
	const { openModal } = useUIStore();
	const subscription = useSubscription();

	const currentDeckCount = decks?.length || 0;
	const canCreate = subscription.canCreateDeck(currentDeckCount);
	const remaining = subscription.getRemainingDecks(currentDeckCount);
	const usagePercentage = subscription.getDeckUsagePercentage(currentDeckCount);

	// Filter decks by selected category
	const filteredDecks = decks?.filter((deck) => {
		if (!selectedFilter) return true;
		return deck.category === selectedFilter;
	}) || [];

	const handleCreateClick = () => {
		if (!canCreate) {
			openModal('paywall', { context: 'deck_limit' });
			return;
		}
		setIsCreating(true);
	};

	const handleCreateDeck = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newDeckName.trim()) return;

		// Double check limit before mutation
		if (!canCreate) {
			toast.error(`You've reached the maximum of ${subscription.limits.maxDecks} decks on the free plan`);
			openModal('paywall', { context: 'deck_limit' });
			return;
		}

		try {
			await createDeckMutation.mutateAsync({
				name: newDeckName.trim(),
				category: category.trim() || null,
			});
			setNewDeckName('');
			setCategory('');
			setIsCreating(false);
			toast.success('Deck created successfully!');
		} catch (error) {
			console.error('Failed to create deck:', error);
			toast.error('Failed to create deck. Please try again.');
		}
	};

	const handleDeleteDeck = (deckId: string, deckName: string) => {
		openModal('deleteDeck', { deckId, deckName });
	};

	const handleExportAllDecks = async () => {
		try {
			await exportAllDecksMutation.mutateAsync({});
		} catch (error) {
			console.error('Failed to export all decks:', error);
		}
	};

	const handleImportSuccess = (result: { decksCreated: number; cardsCreated: number; decksData: string[]; }) => {
		setShowImportModal(false);
		console.log('Import successful:', result);
		// Could add toast notification here
	};

	if (isLoading) {
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
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
					<div className="flex items-center gap-3 mt-1">
						<p className="text-muted-foreground text-sm sm:text-base">
							{t('subtitle')}
						</p>
						{subscription.isFree && decks && decks.length > 0 && (
							<Badge variant="secondary" className="text-xs">
								{currentDeckCount}/{subscription.limits.maxDecks} decks used
							</Badge>
						)}
					</div>
				</div>

				{/* Responsive action buttons */}
				<div className="flex flex-col sm:flex-row sm:items-center gap-3">
					{/* Create Deck Button - Primary action */}
					{!isCreating && (
						<Button
							onClick={handleCreateClick}
							disabled={!canCreate}
							className="py-3 sm:py-2 text-sm font-semibold"
						>
							{!canCreate && <Crown className="w-4 h-4" />}
							<span className="text-base sm:text-sm">+</span>
							{t('createDeck')}
						</Button>
					)}

					{/* Secondary actions - only show if decks exist */}
					{decks && decks.length > 0 && (
						<div className="grid grid-cols-2 gap-3 sm:flex sm:gap-3">
							<Button
								onClick={handleExportAllDecks}
								disabled={exportAllDecksMutation.isPending}
								variant="secondary"
								className="py-3 sm:py-2 text-sm font-medium"
							>
								<span>📤</span>
								<span className="hidden sm:inline">{exportAllDecksMutation.isPending ? t('exporting') : t('exportAll')}</span>
								<span className="sm:hidden">{t('export')}</span>
							</Button>

							<Button
								onClick={() => setShowImportModal(true)}
								variant="secondary"
								className="py-3 sm:py-2 text-sm font-medium"
							>
								<Download className="w-4 h-4" />
								<span className="hidden sm:inline">{t('importCsv')}</span>
								<span className="sm:hidden">{t('import')}</span>
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Free tier limit warning */}
			{subscription.isFree && usagePercentage >= 80 && canCreate && (
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						You&apos;re using {currentDeckCount} of {subscription.limits.maxDecks} decks on the free plan.
						{remaining === 1 ? ' 1 deck remaining.' : ` ${remaining} decks remaining.`}
						{' '}
						<button
							onClick={() => openModal('paywall', { context: 'deck_limit_warning' })}
							className="font-medium text-primary hover:underline"
						>
							Upgrade to Pro for unlimited decks
						</button>
					</AlertDescription>
				</Alert>
			)}

			{/* Limit reached warning */}
			{!canCreate && (
				<Alert variant="destructive">
					<Crown className="h-4 w-4" />
					<AlertDescription>
						You&apos;ve reached the maximum of {subscription.limits.maxDecks} decks on the free plan.
						{' '}
						<button
							onClick={() => openModal('paywall', { context: 'deck_limit' })}
							className="font-medium underline"
						>
							Upgrade to Pro for unlimited decks
						</button>
					</AlertDescription>
				</Alert>
			)}

			{isCreating && (
				<Card>
					<CardContent className="pt-6">
						<form onSubmit={handleCreateDeck} className="space-y-4">
						<div>
							<label htmlFor="deckName" className="block text-sm font-medium mb-2">
								{t('deckNameLabel')}
							</label>
							<Input
								id="deckName"
								type="text"
								value={newDeckName}
								onChange={(e) => setNewDeckName(e.target.value)}
								placeholder={t('deckNamePlaceholder')}
								autoFocus
								disabled={createDeckMutation.isPending}
							/>
						</div>
						<div>
							<label htmlFor="category" className="block text-sm font-medium mb-2">
								Category (Optional)
							</label>
							<Input
								id="category"
								type="text"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								placeholder="e.g., Languages, Science, History..."
								disabled={createDeckMutation.isPending}
								maxLength={50}
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Organize your decks by category
							</p>
						</div>
						<div className="flex gap-3">
							<Button
								type="submit"
								disabled={!newDeckName.trim() || createDeckMutation.isPending}
								className="px-6 font-semibold"
							>
								{createDeckMutation.isPending ? t('creating') : t('create')}
							</Button>
							<Button
								type="reset"
								variant="secondary"
								onClick={() => {
									setIsCreating(false);
									setNewDeckName('');
									setCategory('');
								}}
								className="px-6 font-semibold"
							>
								{t('cancel')}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		)}

			{/* Category filter */}
			{categories && categories.length > 0 && decks && decks.length > 0 && (
				<Card>
					<CardContent className="p-4 flex flex-wrap items-center gap-2">
						<Filter className="w-4 h-4 text-muted-foreground" />
					<Badge
						variant={!selectedFilter ? "default" : "outline"}
						className="cursor-pointer hover:bg-primary/10"
						onClick={() => setSelectedFilter(null)}
					>
						All ({decks?.length || 0})
					</Badge>
					{categories.map((cat) => (
						<Badge
							key={cat}
							variant={selectedFilter === cat ? "default" : "outline"}
							className="cursor-pointer hover:bg-primary/10 gap-1"
							onClick={() => setSelectedFilter(cat)}
						>
							<Tag className="w-3 h-3" />
							{cat} ({decks?.filter(d => d.category === cat).length || 0})
							{selectedFilter === cat && (
								<X className="w-3 h-3 ml-1" onClick={(e) => {
									e.stopPropagation();
									setSelectedFilter(null);
								}} />
							)}
						</Badge>
					))}
					</CardContent>
				</Card>
			)}

			{!decks || decks.length === 0 ? (
				<div className="text-center py-16">
					<BookOpen className="w-16 h-16 mb-4 text-muted-foreground" />
					<h3 className="text-xl font-semibold mb-2">{t('emptyTitle')}</h3>
					<p className="text-muted-foreground mb-6">
						{t('emptyDescription')}
					</p>
					{!isCreating && (
						<Button
							onClick={handleCreateClick}
							disabled={!canCreate}
							className="py-3 sm:py-2 text-base sm:text-sm font-semibold"
						>
							{!canCreate && <Crown className="w-4 h-4" />}
							{t('emptyCta')}
						</Button>
					)}
				</div>
			) : filteredDecks.length === 0 && selectedFilter ? (
				<Card>
					<CardContent className="pt-16 pb-16 text-center">
						<Filter className="w-16 h-16 mb-4 text-muted-foreground mx-auto" />
					<h3 className="text-xl font-semibold mb-2">No decks in {selectedFilter}</h3>
					<p className="text-muted-foreground mb-6">
						No decks found in this category. Try selecting a different category or create a new deck.
					</p>
					<Button
						onClick={() => setSelectedFilter(null)}
						className="py-3 sm:py-2 text-base sm:text-sm font-semibold"
					>
						Clear Filter
					</Button>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{filteredDecks.map((deck) => (
						<DeckCard
							key={deck.id}
							deck={deck}
							onEdit={(d) => openModal('renameDeck', { deckId: d.id, deckName: d.name, category: d.category })}
							onDelete={handleDeleteDeck}
						/>
					))}
				</div>
			)}

			{/* Import CSV Modal */}
			<Dialog open={showImportModal} onOpenChange={setShowImportModal}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">{t('importModalTitle')}</DialogTitle>
					</DialogHeader>
					<ImportCSV
						onSuccess={handleImportSuccess}
						onCancel={() => setShowImportModal(false)}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

