'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '../../stores/ui';
import { useDeleteDeck, useDeleteCard, useRenameDeck } from '../../hooks';
import { DeleteDeckDialog, DeleteCardDialog, ResetProgressDialog } from './ConfirmDialog';
import { useResetDeckProgress } from '../../hooks/use-progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

/**
 * Global modal handler that manages all confirmation dialogs
 * This component is rendered once at the app level and handles modal state
 */
export default function GlobalModalHandler() {
	const router = useRouter();
	const { modal, closeModal } = useUIStore();
	const deleteDeckMutation = useDeleteDeck();
	const deleteCardMutation = useDeleteCard();
	const renameDeckMutation = useRenameDeck();
	const resetDeckProgressMutation = useResetDeckProgress();
	const [newDeckName, setNewDeckName] = useState('');

	useEffect(() => {
		if (modal.type === 'renameDeck' && modal.isOpen) {
			setNewDeckName((modal.data?.deckName as string) || '');
		}
	}, [modal.type, modal.isOpen, modal.data]);

	const handleDeleteDeck = async () => {
		if (!modal.data?.deckId) return;

		try {
			await deleteDeckMutation.mutateAsync(modal.data.deckId as string);
			closeModal();
			// If we're currently viewing this deck, navigate back to decks list
			if (window.location.pathname.includes(modal.data.deckId as string)) {
				router.push('/decks');
			}
		} catch (error) {
			console.error('Failed to delete deck:', error);
			// Keep modal open on error so user can try again
		}
	};

	const handleDeleteCard = async () => {
		if (!modal.data?.cardId) return;

		try {
			await deleteCardMutation.mutateAsync(modal.data.cardId as string);
			closeModal();
		} catch (error) {
			console.error('Failed to delete card:', error);
			// Keep modal open on error so user can try again
		}
	};

	const handleResetProgress = async () => {
		if (!modal.data?.deckId) return;
		try {
			await resetDeckProgressMutation.mutateAsync(modal.data.deckId as string);
			closeModal();
		} catch (error) {
			console.error('Failed to reset progress:', error);
		}
	};

	const handleRenameDeck = async () => {
		if (!modal.data?.deckId || !newDeckName.trim()) return;
		try {
			await renameDeckMutation.mutateAsync({ deckId: modal.data.deckId as string, newName: newDeckName.trim() });
			closeModal();
		} catch (error) {
			console.error('Failed to rename deck:', error);
		}
	};

	// Render appropriate modal based on type
	switch (modal.type) {
		case 'deleteDeck':
			return (
				<DeleteDeckDialog
					isOpen={modal.isOpen}
					deckName={modal.data?.deckName as string || 'Unknown Deck'}
					onConfirm={handleDeleteDeck}
					onCancel={closeModal}
				/>
			);

		case 'deleteCard':
			return (
				<DeleteCardDialog
					isOpen={modal.isOpen}
					cardQuestion={modal.data?.cardQuestion as string || 'this card'}
					onConfirm={handleDeleteCard}
					onCancel={closeModal}
				/>
			);

		case 'resetProgress':
			return (
				<ResetProgressDialog
					isOpen={modal.isOpen}
					deckName={(modal.data?.deckName as string) || 'this deck'}
					onConfirm={handleResetProgress}
					onCancel={closeModal}
				/>
			);

		case 'renameDeck':
			return (
				<Dialog open={modal.isOpen} onOpenChange={(open) => !open && closeModal()}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Rename Deck</DialogTitle>
							<DialogDescription>Enter a new name for this deck.</DialogDescription>
						</DialogHeader>
						<div className="py-2">
							<Input
								value={newDeckName}
								onChange={(e) => setNewDeckName(e.target.value)}
								placeholder="New deck name"
							/>
						</div>
						<DialogFooter className="gap-2">
							<Button variant="outline" onClick={closeModal}>Cancel</Button>
							<Button onClick={handleRenameDeck} disabled={renameDeckMutation.isPending || !newDeckName.trim()}>
								{renameDeckMutation.isPending ? 'Renaming...' : 'Rename'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			);

		default:
			return null;
	}
}