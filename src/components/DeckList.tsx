'use client';

import { useState } from 'react';
import DeckCard from './DeckCard';
import EmptyState from './EmptyState';
import { useDecks, useCreateDeck } from '../../hooks';
import { useUIStore } from '../../stores/ui';
import type { Deck } from '../../lib/types';

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
					<div
						key={i}
						className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-pulse"
					>
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-3"></div>
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
								<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
							</div>
							<div className="flex gap-2">
								<div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
								<div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
							</div>
						</div>
					</div>
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
						icon="📚"
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
					<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
						Your Study Decks
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						{decks.length} deck{decks.length !== 1 ? 's' : ''} ready for studying
					</p>
				</div>

				{!isCreating && (
					<button
						onClick={() => setIsCreating(true)}
						className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
					>
						<span className="text-xl">+</span>
						Create Deck
					</button>
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

interface CreateDeckFormProps {
	newDeckName: string;
	setNewDeckName: (name: string) => void;
	onSubmit: (e: React.FormEvent) => Promise<void>;
	onCancel: () => void;
	isLoading: boolean;
}

function CreateDeckForm({
	newDeckName,
	setNewDeckName,
	onSubmit,
	onCancel,
	isLoading
}: CreateDeckFormProps) {
	return (
		<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
			<form onSubmit={onSubmit} className="space-y-4">
				<div>
					<label htmlFor="deckName" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
						Deck Name
					</label>
					<input
						id="deckName"
						type="text"
						value={newDeckName}
						onChange={(e) => setNewDeckName(e.target.value)}
						placeholder="e.g., Spanish Vocabulary, Biology Terms..."
						className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
						autoFocus
						disabled={isLoading}
						maxLength={100}
					/>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
						Choose a descriptive name for your study deck
					</p>
				</div>

				<div className="flex gap-3">
					<button
						type="submit"
						disabled={!newDeckName.trim() || isLoading}
						className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
					>
						{isLoading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
								Creating...
							</>
						) : (
							<>
								<span>✨</span>
								Create Deck
							</>
						)}
					</button>

					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}