'use client';

import { useRouter } from 'next/navigation';
import { useUIStore } from '../../stores/ui';
import { useDeleteDeck, useDeleteCard } from '../../hooks';
import { DeleteDeckDialog, DeleteCardDialog } from './ConfirmDialog';

/**
 * Global modal handler that manages all confirmation dialogs
 * This component is rendered once at the app level and handles modal state
 */
export default function GlobalModalHandler() {
	const router = useRouter();
	const { modal, closeModal } = useUIStore();
	const deleteDeckMutation = useDeleteDeck();
	const deleteCardMutation = useDeleteCard();

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

		default:
			return null;
	}
}