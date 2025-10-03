'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useDecks, useCreateDeck, useExportAllDecks } from '../../../hooks';
import { useDeckCompletion } from '../../../hooks';
import { useUIStore } from '../../../stores/ui';
import { ImportCSV } from '../../components/ImportCSV';

export default function DecksPage() {
	const [isCreating, setIsCreating] = useState(false);
	const [newDeckName, setNewDeckName] = useState('');
	const [showImportModal, setShowImportModal] = useState(false);

	const { data: decks, isLoading } = useDecks();
	const createDeckMutation = useCreateDeck();
	const exportAllDecksMutation = useExportAllDecks();
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
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Study Decks</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Organize your flashcards into decks and track your progress
					</p>
				</div>

				<div className="flex items-center gap-3">
					{/* Export All Button */}
					{decks && decks.length > 0 && (
						<button
							onClick={handleExportAllDecks}
							disabled={exportAllDecksMutation.isPending}
							className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
						>
							<span>📤</span>
							{exportAllDecksMutation.isPending ? 'Exporting...' : 'Export All'}
						</button>
					)}

					{/* Import Button */}
					<button
						onClick={() => setShowImportModal(true)}
						className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
					>
						<span>📥</span>
						Import CSV
					</button>

					{/* Create Deck Button */}
					{!isCreating && (
						<button
							onClick={() => setIsCreating(true)}
							className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
						>
							<span className="text-xl">+</span>
							Create Deck
						</button>
					)}
				</div>
			</div>

			{isCreating && (
				<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
					<form onSubmit={handleCreateDeck} className="space-y-4">
						<div>
							<label htmlFor="deckName" className="block text-sm font-medium mb-2">
								Deck Name
							</label>
							<input
								id="deckName"
								type="text"
								value={newDeckName}
								onChange={(e) => setNewDeckName(e.target.value)}
								placeholder="Enter deck name..."
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
								autoFocus
								disabled={createDeckMutation.isPending}
							/>
						</div>
						<div className="flex gap-3">
							<button
								type="submit"
								disabled={!newDeckName.trim() || createDeckMutation.isPending}
								className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
							>
								{createDeckMutation.isPending ? 'Creating...' : 'Create'}
							</button>
							<button
								type="button"
								onClick={() => {
									setIsCreating(false);
									setNewDeckName('');
								}}
								className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{!decks || decks.length === 0 ? (
				<div className="text-center py-16">
					<div className="text-6xl mb-4">📚</div>
					<h3 className="text-xl font-semibold mb-2">No decks yet</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						Create your first deck to start studying with flashcards
					</p>
					{!isCreating && (
						<button
							onClick={() => setIsCreating(true)}
							className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
						>
							Create Your First Deck
						</button>
					)}
				</div>
			) : (
				<div className="grid gap-4">
					{decks.map((deck) => (
						<DeckCard
							key={deck.id}
							deck={deck}
							onDelete={handleDeleteDeck}
						/>
					))}
				</div>
			)}

			{/* Import CSV Modal */}
			{showImportModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold">Import Decks from CSV</h2>
								<button
									onClick={() => setShowImportModal(false)}
									className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
								>
									×
								</button>
							</div>
							<ImportCSV
								onSuccess={handleImportSuccess}
								onCancel={() => setShowImportModal(false)}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

interface DeckCardProps {
	deck: { id: string; name: string; createdAt: number; updatedAt: number; };
	onDelete: (deckId: string, deckName: string) => void;
}

function DeckCard({ deck, onDelete }: DeckCardProps) {
	const { data: completion } = useDeckCompletion(deck.id);

	return (
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
			<div className="flex items-center justify-between">
				<div className="flex-1">
					<div className="flex items-center gap-4">
						<Link
							href={`/decks/${deck.id}`}
							className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
						>
							{deck.name}
						</Link>
						{completion && (
							<div className="flex items-center gap-2">
								<div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-24">
									<div
										className="bg-green-500 h-2 rounded-full transition-all duration-300"
										style={{ width: `${completion.completion}%` }}
									/>
								</div>
								<span className="text-sm text-gray-600 dark:text-gray-400">
									{completion.completion}%
								</span>
							</div>
						)}
					</div>

					<div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
						{completion && (
							<>
								<span>{completion.total} cards</span>
								<span>•</span>
								<span>{completion.mastered} mastered</span>
								<span>•</span>
							</>
						)}
						<span>Updated {new Date(deck.updatedAt).toLocaleDateString()}</span>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Link
						href={`/decks/${deck.id}`}
						className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg transition-colors duration-200"
					>
						Open
					</Link>
					<button
						onClick={() => onDelete(deck.id, deck.name)}
						className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg transition-colors duration-200"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}