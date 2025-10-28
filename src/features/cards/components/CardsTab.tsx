'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CardItem } from './CardItem';
import type { Card } from '@/lib/types';
import { CreditCard, Plus, Crown, AlertCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { useUIStore } from '@/stores/ui';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CardsTabProps {
	deckId: string;
	cards: Card[] | undefined;
	onDeleteCard: (cardId: string, cardQuestion: string) => void;
}

export function CardsTab({ deckId, cards, onDeleteCard }: CardsTabProps) {
	const t = useTranslations('DeckDetail');
	const subscription = useSubscription();
	const { openModal } = useUIStore();

	const currentCardCount = cards?.length || 0;
	const canCreate = subscription.canCreateCard(currentCardCount);
	const remaining = subscription.getRemainingCards(currentCardCount);
	const usagePercentage = subscription.getCardUsagePercentage(currentCardCount);

	const handleAddCardClick = (e: React.MouseEvent) => {
		if (!canCreate) {
			e.preventDefault();
			openModal('paywall', { context: 'card_limit' });
		}
	};

	if (!cards || cards.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="mb-4 flex justify-center"><CreditCard className="h-16 w-16" /></div>
				<h3 className="text-xl font-semibold mb-2">{t('noCardsTitle')}</h3>
				<p className="text-muted-foreground mb-6">
					{t('noCardsDescription')}
				</p>
				{canCreate ? (
					<Link
						href={`/decks/${deckId}/edit-card`}
						className={cn(buttonVariants(), "py-3 sm:py-2 text-base sm:text-sm font-semibold")}
					>
						<Plus className="h-5 w-5" />
						{t('addCard')}
					</Link>
				) : (
					<Button
						onClick={handleAddCardClick}
						size="lg"
						className="inline-flex items-center gap-2"
					>
						<Crown className="h-5 w-5" />
						{t('addCard')} (Pro)
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header with usage stats */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-lg sm:text-xl font-semibold">{t('cardsHeader', { count: cards.length })}</h2>
					{subscription.isFree && (
						<Badge variant="secondary" className="text-xs mt-1">
							{currentCardCount}/{subscription.limits.maxCardsPerDeck} cards used
						</Badge>
					)}
				</div>
				{canCreate ? (
					<Link
						href={`/decks/${deckId}/edit-card`}
						className={cn(buttonVariants(), "text-sm font-semibold")}
					>
						<Plus className="h-4 w-4" />
						{t('addCard')}
					</Link>
				) : (
					<Button
						onClick={handleAddCardClick}
						size="default"
						className="flex items-center gap-2"
						disabled={!canCreate}
					>
						<Crown className="h-4 w-4" />
						{t('addCard')}
					</Button>
				)}
			</div>

			{/* Free tier limit warning */}
			{subscription.isFree && usagePercentage >= 80 && canCreate && (
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						You&apos;re using {currentCardCount} of {subscription.limits.maxCardsPerDeck} cards in this deck.
						{remaining === 1 ? ' 1 card remaining.' : ` ${remaining} cards remaining.`}
						{' '}
						<button
							onClick={() => openModal('paywall', { context: 'card_limit_warning' })}
							className="font-medium text-primary hover:underline"
						>
							Upgrade to Pro for unlimited cards
						</button>
					</AlertDescription>
				</Alert>
			)}

			{/* Limit reached warning */}
			{!canCreate && (
				<Alert variant="destructive">
					<Crown className="h-4 w-4" />
					<AlertDescription>
						You&apos;ve reached the maximum of {subscription.limits.maxCardsPerDeck} cards per deck on the free plan.
						{' '}
						<button
							onClick={() => openModal('paywall', { context: 'card_limit' })}
							className="font-medium underline"
						>
							Upgrade to Pro for unlimited cards
						</button>
					</AlertDescription>
				</Alert>
			)}

			{/* Cards list */}
			<div className="space-y-4">
				{cards.map((card) => (
					<CardItem key={card.id} card={card} deckId={deckId} onDelete={onDeleteCard} />
				))}
			</div>
		</div>
	);
}
