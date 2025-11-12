'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
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
        confirmLabel,
        cancelLabel,
        variant = 'danger',
        onConfirm,
        onCancel,
        className = ''
}: ConfirmDialogProps) {
        const confirmButtonRef = useRef<HTMLButtonElement>(null);
        const t = useTranslations('ConfirmDialog');

        const finalConfirmLabel = confirmLabel ?? t('confirm');
        const finalCancelLabel = cancelLabel ?? t('cancel');

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
			iconBg: 'bg-destructive/10',
		},
		warning: {
			icon: <AlertTriangle className="w-6 h-6" />,
			iconBg: 'bg-secondary/20',
		},
		info: {
			icon: <Info className="w-6 h-6" />,
			iconBg: 'bg-primary/10',
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
                                                {finalCancelLabel}
                                        </Button>
                                        <Button
                                                ref={confirmButtonRef}
                                                variant={variant === 'danger' ? 'destructive' : 'default'}
                                                onClick={onConfirm}
                                        >
                                                {finalConfirmLabel}
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
        const t = useTranslations('ConfirmDialog.deleteDeck');

        return (
                <ConfirmDialog
                        isOpen={isOpen}
                        title={t('title')}
                        message={t('message', { deckName })}
                        confirmLabel={t('confirm')}
                        cancelLabel={t('cancel')}
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
        const t = useTranslations('ConfirmDialog.deleteCard');
        const truncatedQuestion =
                cardQuestion.length > 50 ? `${cardQuestion.substring(0, 50)}...` : cardQuestion;

        return (
                <ConfirmDialog
                        isOpen={isOpen}
                        title={t('title')}
                        message={t('message', { cardQuestion: truncatedQuestion })}
                        confirmLabel={t('confirm')}
                        cancelLabel={t('cancel')}
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
        const t = useTranslations('ConfirmDialog.resetProgress');

        return (
                <ConfirmDialog
                        isOpen={isOpen}
                        title={t('title')}
                        message={t('message', { deckName })}
                        confirmLabel={t('confirm')}
                        cancelLabel={t('cancel')}
                        variant="warning"
                        onConfirm={onConfirm}
                        onCancel={onCancel}
                />
        );
}
