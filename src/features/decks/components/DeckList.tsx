'use client';

import { useState } from 'react';
import DeckCard from './DeckCard';
import EmptyState from '@/components/EmptyState';
import { CreateDeckForm } from './CreateDeckForm';
import { useDecks, useCreateDeck, useCategories } from '@/hooks';
import { useSubscription } from '@/hooks/use-subscription';
import { useUIStore } from '@/stores/ui';
import type { Deck } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Filter, X, Crown, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DeckListProps {
	className?: string;
}

export default function DeckList({ className = '' }: DeckListProps) {
	const [isCreating, setIsCreating] = useState(false);
	const [newDeckName, setNewDeckName] = useState('');
	const [category, setCategory] = useState('');
	const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

	const { data: decks, isLoading } = useDecks();
	const { data: categories } = useCategories();
	const createDeckMutation = useCreateDeck();
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

	const handleEditDeck = (deck: Deck) => {
		openModal('renameDeck', { deckId: deck.id, deckName: deck.name, category: deck.category });
	};

	const handleDeleteDeck = (deckId: string, deckName: string) => {
		openModal('deleteDeck', { deckId, deckName });
	};

	if (isLoading) {
		return (
			<div className={`space-y-4 ${className}`}>
				{[...Array(3)].map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<div className="h-6 bg-muted rounded w-48 mb-3"></div>
									<div className="h-4 bg-muted rounded w-32 mb-2"></div>
									<div className="h-3 bg-muted rounded w-24"></div>
								</div>
								<div className="flex gap-2">
									<div className="h-9 w-16 bg-muted rounded-lg"></div>
									<div className="h-9 w-9 bg-muted rounded-lg"></div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!decks || decks.length === 0) {
		return (
			<div className={className}>
				{isCreating ? (
					<CreateDeckForm
						newDeckName={newDeckName}
						setNewDeckName={setNewDeckName}
						category={category}
						setCategory={setCategory}
						onSubmit={handleCreateDeck}
						onCancel={() => {
							setIsCreating(false);
							setNewDeckName('');
							setCategory('');
						}}
						isLoading={createDeckMutation.isPending}
					/>
				) : (
					<EmptyState
						icon={<BookOpen className="w-20 h-20" />}
						title="No decks yet"
						description="Create your first deck to start studying with flashcards"
						actionLabel="Create Your First Deck"
						onAction={handleCreateClick}
					/>
				)}
			</div>
		);
	}

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Header with create button */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-foreground">
						Your Study Decks
					</h2>
					<div className="flex items-center gap-3 mt-1">
						<p className="text-muted-foreground">
							{filteredDecks.length} {selectedFilter ? 'filtered ' : ''}deck{filteredDecks.length !== 1 ? 's' : ''} {selectedFilter ? `in "${selectedFilter}"` : 'ready for studying'}
						</p>
						<Badge variant="secondary" className="text-xs">
							Tier: {subscription.tier} | {currentDeckCount}/{subscription.limits.maxDecks} decks
						</Badge>
					</div>
				</div>

				{!isCreating && (
					<Button
						onClick={handleCreateClick}
						size="lg"
						className="shadow-lg hover:shadow-xl"
						disabled={!canCreate}
					>
						{!canCreate && <Crown className="mr-2 h-4 w-4" />}
						<span className="text-xl mr-2">+</span>
						Create Deck
					</Button>
				)}
			</div>

			{/* Free tier limit warning */}
			{subscription.isFree && usagePercentage >= 80 && canCreate && (
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						You're using {currentDeckCount} of {subscription.limits.maxDecks} decks on the free plan.
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
						You've reached the maximum of {subscription.limits.maxDecks} decks on the free plan.
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

			{/* Category filter */}
			{categories && categories.length > 0 && (
				<div className="flex flex-wrap items-center gap-2">
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
							className="cursor-pointer hover:bg-primary/10"
							onClick={() => setSelectedFilter(cat)}
						>
							{cat} ({decks?.filter(d => d.category === cat).length || 0})
							{selectedFilter === cat && (
								<X className="w-3 h-3 ml-1" onClick={(e) => {
									e.stopPropagation();
									setSelectedFilter(null);
								}} />
							)}
						</Badge>
					))}
				</div>
			)}

			{/* Create deck form */}
			{isCreating && (
				<CreateDeckForm
					newDeckName={newDeckName}
					setNewDeckName={setNewDeckName}
					category={category}
					setCategory={setCategory}
					onSubmit={handleCreateDeck}
					onCancel={() => {
						setIsCreating(false);
						setNewDeckName('');
						setCategory('');
					}}
					isLoading={createDeckMutation.isPending}
				/>
			)}

			{/* Deck grid */}
			{filteredDecks.length > 0 ? (
				<div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
					{filteredDecks.map((deck) => (
						<DeckCard
							key={deck.id}
							deck={deck}
							onEdit={handleEditDeck}
							onDelete={handleDeleteDeck}
						/>
					))}
				</div>
			) : (
				<EmptyState
					icon={<Filter className="w-20 h-20" />}
					title="No decks in this category"
					description={`No decks found in "${selectedFilter}". Try selecting a different category or create a new deck.`}
					actionLabel="Clear Filter"
					onAction={() => setSelectedFilter(null)}
				/>
			)}
		</div>
	);
}

