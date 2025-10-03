'use client';

import { useEffect, useRef } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle, Info } from 'lucide-react';

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
	const confirmButtonRef = useRef<HTMLButtonElement>(null);

	// Focus management
	useEffect(() => {
		if (isOpen) {
			// Focus the confirm button when dialog opens
			confirmButtonRef.current?.focus();
		}
	}, [isOpen]);

	// Variant styles for icons
	const variantStyles = {
		danger: {
			icon: <AlertTriangle className="w-6 h-6" />,
			iconBg: 'bg-red-100 dark:bg-red-900',
		},
		warning: {
			icon: <AlertTriangle className="w-6 h-6" />,
			iconBg: 'bg-yellow-100 dark:bg-yellow-900',
		},
		info: {
			icon: <Info className="w-6 h-6" />,
			iconBg: 'bg-blue-100 dark:bg-blue-900',
		}
	};

	const styles = variantStyles[variant];

	if (!isOpen) return null;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent className={className}>
				<DialogHeader>
					<div className="flex items-start gap-4">
						<div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
							{styles.icon}
						</div>
						<div className="flex-1 min-w-0">
							<DialogTitle className="text-lg font-semibold">
								{title}
							</DialogTitle>
							<DialogDescription className="leading-relaxed">
								{message}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>
				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={onCancel}>
						{cancelLabel}
					</Button>
					<Button
						ref={confirmButtonRef}
						variant={variant === 'danger' ? 'destructive' : 'default'}
						onClick={onConfirm}
					>
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
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
			message={`Are you sure you want to delete "${deckName}"? This action cannot be undone and all cards in this deck will be permanently deleted.`}
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
	return (
		<ConfirmDialog
			isOpen={isOpen}
			title="Delete Card"
			message={`Are you sure you want to delete this card: "${cardQuestion.length > 50 ? cardQuestion.substring(0, 50) + '...' : cardQuestion}"? This action cannot be undone.`}
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
			message={`Are you sure you want to reset all learning progress for "${deckName}"? All cards will be marked as new and need to be studied again.`}
			confirmLabel="Reset Progress"
			cancelLabel="Keep Progress"
			variant="warning"
			onConfirm={onConfirm}
			onCancel={onCancel}
		/>
	);
}