'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: 'danger' | 'warning' | 'info';
	onConfirm: () => void;
	onCancel: () => void;
	className?: string;
}

export default function ConfirmDialog({
	isOpen,
	title,
	message,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	variant = 'danger',
	onConfirm,
	onCancel,
	className = ''
}: ConfirmDialogProps) {
	const dialogRef = useRef<HTMLDivElement>(null);
	const confirmButtonRef = useRef<HTMLButtonElement>(null);

	// Focus management
	useEffect(() => {
		if (isOpen) {
			// Focus the confirm button when dialog opens
			confirmButtonRef.current?.focus();

			// Prevent body scroll
			document.body.style.overflow = 'hidden';
		} else {
			// Restore body scroll
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	// Handle keyboard events
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === 'Escape') {
				onCancel();
			} else if (e.key === 'Enter') {
				onConfirm();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onCancel, onConfirm]);

	// Handle backdrop click
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onCancel();
		}
	};

	if (!isOpen) return null;

	// Variant styles
	const variantStyles = {
		danger: {
			icon: '⚠️',
			iconBg: 'bg-red-100 dark:bg-red-900/30',
			iconColor: 'text-red-600 dark:text-red-400',
			confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
		},
		warning: {
			icon: '⚠️',
			iconBg: 'bg-amber-100 dark:bg-amber-900/30',
			iconColor: 'text-amber-600 dark:text-amber-400',
			confirmButton: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
		},
		info: {
			icon: 'ℹ️',
			iconBg: 'bg-blue-100 dark:bg-blue-900/30',
			iconColor: 'text-blue-600 dark:text-blue-400',
			confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
		}
	};

	const styles = variantStyles[variant];

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
			role="dialog"
			aria-modal="true"
			aria-labelledby="dialog-title"
			aria-describedby="dialog-message"
		>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200"
				onClick={handleBackdropClick}
			/>

			{/* Dialog */}
			<div
				ref={dialogRef}
				className="
          relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl 
          max-w-md w-full mx-4 transform transition-all duration-200
          animate-in zoom-in-95 fade-in-0
        "
			>
				{/* Content */}
				<div className="p-6">
					{/* Icon and Title */}
					<div className="flex items-start gap-4 mb-4">
						<div className={`
              flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg}
              flex items-center justify-center
            `}>
							<span className="text-2xl">{styles.icon}</span>
						</div>

						<div className="flex-1 min-w-0">
							<h2
								id="dialog-title"
								className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
							>
								{title}
							</h2>
							<p
								id="dialog-message"
								className="text-gray-600 dark:text-gray-400 leading-relaxed"
							>
								{message}
							</p>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
					<div className="flex gap-3 justify-end">
						<button
							onClick={onCancel}
							className="
                px-4 py-2 text-gray-700 dark:text-gray-300 
                bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500
                rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-500
                focus:outline-none focus:ring-4 focus:ring-gray-500/20
                transition-colors duration-200
              "
						>
							{cancelLabel}
						</button>

						<button
							ref={confirmButtonRef}
							onClick={onConfirm}
							className={`
                px-4 py-2 text-white rounded-lg font-medium
                focus:outline-none focus:ring-4 focus:ring-opacity-20
                transition-colors duration-200
                ${styles.confirmButton}
              `}
						>
							{confirmLabel}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// Preset confirm dialogs for common actions
export function DeleteDeckDialog({
	isOpen,
	deckName,
	onConfirm,
	onCancel
}: {
	isOpen: boolean;
	deckName: string;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	return (
		<ConfirmDialog
			isOpen={isOpen}
			title="Delete Deck"
			message={`Are you sure you want to delete "${deckName}"? This will permanently remove the deck and all its cards. This action cannot be undone.`}
			confirmLabel="Delete Deck"
			cancelLabel="Keep Deck"
			variant="danger"
			onConfirm={onConfirm}
			onCancel={onCancel}
		/>
	);
}

export function DeleteCardDialog({
	isOpen,
	cardQuestion,
	onConfirm,
	onCancel
}: {
	isOpen: boolean;
	cardQuestion: string;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	const truncatedQuestion = cardQuestion.length > 60
		? `${cardQuestion.slice(0, 60)}...`
		: cardQuestion;

	return (
		<ConfirmDialog
			isOpen={isOpen}
			title="Delete Card"
			message={`Are you sure you want to delete the card "${truncatedQuestion}"? This action cannot be undone.`}
			confirmLabel="Delete Card"
			cancelLabel="Keep Card"
			variant="danger"
			onConfirm={onConfirm}
			onCancel={onCancel}
		/>
	);
}

export function ResetProgressDialog({
	isOpen,
	deckName,
	onConfirm,
	onCancel
}: {
	isOpen: boolean;
	deckName: string;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	return (
		<ConfirmDialog
			isOpen={isOpen}
			title="Reset Progress"
			message={`Are you sure you want to reset all progress for "${deckName}"? This will clear all study statistics and start fresh. This action cannot be undone.`}
			confirmLabel="Reset Progress"
			cancelLabel="Keep Progress"
			variant="warning"
			onConfirm={onConfirm}
			onCancel={onCancel}
		/>
	);
}