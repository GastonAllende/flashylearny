'use client';

import { useState } from 'react';
import DeckCard from './DeckCard';
import EmptyState from '@/components/EmptyState';
import { CreateDeckForm } from './CreateDeckForm';
import { useDecks, useCreateDeck } from '@/hooks';
import { useUIStore } from '@/stores/ui';
import type { Deck } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface DeckListProps {
	className?: string;
}

export default function DeckList({ className = '' }: DeckListProps) {
	const [isCreating, setIsCreating] = useState(false);
	const [newDeckName, setNewDeckName] = useState('');

	const { data: decks, isLoading } = useDecks();
	const createDeckMutation = useCreateDeck();
	const { openModal } = useUIStore();

	const handleCreateDeck = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newDeckName.trim()) return;

		try {
			await createDeckMutation.mutateAsync(newDeckName.trim());
			setNewDeckName('');
			setIsCreating(false);
		} catch (error) {
			console.error('Failed to create deck:', error);
		}
	};

	const handleEditDeck = (deck: Deck) => {
		openModal('renameDeck', { deckId: deck.id, currentName: deck.name });
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
						onSubmit={handleCreateDeck}
						onCancel={() => {
							setIsCreating(false);
							setNewDeckName('');
						}}
						isLoading={createDeckMutation.isPending}
					/>
				) : (
					<EmptyState
						icon={<BookOpen className="w-20 h-20" />}
						title="No decks yet"
						description="Create your first deck to start studying with flashcards"
						actionLabel="Create Your First Deck"
						onAction={() => setIsCreating(true)}
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
					<p className="text-muted-foreground mt-1">
						{decks.length} deck{decks.length !== 1 ? 's' : ''} ready for studying
					</p>
				</div>

				{!isCreating && (
					<Button
						onClick={() => setIsCreating(true)}
						size="lg"
						className="shadow-lg hover:shadow-xl"
					>
						<span className="text-xl mr-2">+</span>
						Create Deck
					</Button>
				)}
			</div>

			{/* Create deck form */}
			{isCreating && (
				<CreateDeckForm
					newDeckName={newDeckName}
					setNewDeckName={setNewDeckName}
					onSubmit={handleCreateDeck}
					onCancel={() => {
						setIsCreating(false);
						setNewDeckName('');
					}}
					isLoading={createDeckMutation.isPending}
				/>
			)}

			{/* Deck grid */}
			<div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
				{decks.map((deck) => (
					<DeckCard
						key={deck.id}
						deck={deck}
						onEdit={handleEditDeck}
						onDelete={handleDeleteDeck}
					/>
				))}
			</div>
		</div>
	);
}

