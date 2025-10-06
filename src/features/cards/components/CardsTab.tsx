'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CardItem } from './CardItem';
import type { Card } from '@/lib/types';
import { CreditCard, Plus } from 'lucide-react';

interface CardsTabProps {
	deckId: string;
	cards: Card[] | undefined;
	onDeleteCard: (cardId: string, cardQuestion: string) => void;
}

export function CardsTab({ deckId, cards, onDeleteCard }: CardsTabProps) {
	const t = useTranslations('DeckDetail');

	if (!cards || cards.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="mb-4 flex justify-center"><CreditCard className="h-16 w-16" /></div>
				<h3 className="text-xl font-semibold mb-2">{t('noCardsTitle')}</h3>
				<p className="text-muted-foreground mb-6">
					{t('noCardsDescription')}
				</p>
				<Link
					href={`/decks/${deckId}/edit-card`}
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 sm:py-2 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center gap-2 text-base sm:text-sm"
				>
					<Plus className="h-5 w-5" />
					{t('addCard')}
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg sm:text-xl font-semibold">{t('cardsHeader', { count: cards.length })}</h2>
				<Link
					href={`/decks/${deckId}/edit-card`}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 text-sm"
				>
					<Plus className="h-4 w-4" />
					{t('addCard')}
				</Link>
			</div>

			<div className="space-y-4">
				{cards.map((card) => (
					<CardItem key={card.id} card={card} deckId={deckId} onDelete={onDeleteCard} />
				))}
			</div>
		</div>
	);
}
