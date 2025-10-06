'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDecks, useCreateDeck, useExportAllDecks } from '@/hooks';
import { useUIStore } from '@/stores/ui';
import { ImportCSV } from '@/features/decks/components/ImportCSV';
import DeckCard from '@/features/decks/components/DeckCard';
import { Download, BookOpen, X } from 'lucide-react';

export default function DecksPage() {
	const t = useTranslations('DecksPage');
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
		<div className="space-y-4 sm:space-y-6">
			{/* Mobile-first header */}
			<div className="space-y-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
					<p className="text-muted-foreground mt-1 text-sm sm:text-base">
						{t('subtitle')}
					</p>
				</div>

				{/* Responsive action buttons */}
				<div className="flex flex-col sm:flex-row sm:items-center gap-3">
					{/* Create Deck Button - Primary action */}
					{!isCreating && (
						<button
							onClick={() => setIsCreating(true)}
							className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
						>
							<span className="text-base sm:text-sm">+</span>
							{t('createDeck')}
						</button>
					)}

					{/* Secondary actions - only show if decks exist */}
					{decks && decks.length > 0 && (
						<div className="grid grid-cols-2 gap-3 sm:flex sm:gap-3">
							<button
								onClick={handleExportAllDecks}
								disabled={exportAllDecksMutation.isPending}
								className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-3 sm:px-3 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
							>
								<span>📤</span>
								<span className="hidden sm:inline">{exportAllDecksMutation.isPending ? t('exporting') : t('exportAll')}</span>
								<span className="sm:hidden">{t('export')}</span>
							</button>

							<button
								onClick={() => setShowImportModal(true)}
								className="bg-green-600 hover:bg-green-700 text-white px-3 py-3 sm:px-3 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
							>
								<Download className="w-4 h-4" />
								<span className="hidden sm:inline">{t('importCsv')}</span>
								<span className="sm:hidden">{t('import')}</span>
							</button>
						</div>
					)}
				</div>
			</div>

			{isCreating && (
				<div className="bg-card border rounded-lg p-6">
					<form onSubmit={handleCreateDeck} className="space-y-4">
						<div>
							<label htmlFor="deckName" className="block text-sm font-medium mb-2">
								{t('deckNameLabel')}
							</label>
							<input
								id="deckName"
								type="text"
								value={newDeckName}
								onChange={(e) => setNewDeckName(e.target.value)}
								placeholder={t('deckNamePlaceholder')}
								className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
								{createDeckMutation.isPending ? t('creating') : t('create')}
							</button>
							<button
								type="button"
								onClick={() => {
									setIsCreating(false);
									setNewDeckName('');
								}}
								className="bg-muted0 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
							>
								{t('cancel')}
							</button>
						</div>
					</form>
				</div>
			)}

			{!decks || decks.length === 0 ? (
				<div className="text-center py-16">
					<BookOpen className="w-16 h-16 mb-4 text-gray-400" />
					<h3 className="text-xl font-semibold mb-2">{t('emptyTitle')}</h3>
					<p className="text-muted-foreground mb-6">
						{t('emptyDescription')}
					</p>
					{!isCreating && (
						<button
							onClick={() => setIsCreating(true)}
							className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 sm:py-2 rounded-lg font-semibold transition-colors duration-200 text-base sm:text-sm"
						>
							{t('emptyCta')}
						</button>
					)}
				</div>
			) : (
				<div className="space-y-4">
					{decks.map((deck) => (
						<DeckCard
							key={deck.id}
							deck={deck}
							onEdit={(d) => openModal('renameDeck', { deckId: d.id, currentName: d.name })}
							onDelete={handleDeleteDeck}
						/>
					))}
				</div>
			)}

			{/* Import CSV Modal */}
			{showImportModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold">{t('importModalTitle')}</h2>
								<button
									onClick={() => setShowImportModal(false)}
									className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
								>
									<X className="w-4 h-4" />
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

