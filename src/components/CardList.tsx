'use client';

import Link from 'next/link';
import CardRow from './CardRow';
import EmptyState from './EmptyState';
import { useCards } from '../../hooks';
import { useUIStore } from '../../stores/ui';
import type { Card } from '../../lib/types';

interface CardListProps {
	deckId: string;
	className?: string;
	showProgress?: boolean;
}

export default function CardList({ deckId, className = '', showProgress = true }: CardListProps) {
	const { data: cards, isLoading } = useCards(deckId);
	const { openModal } = useUIStore();

	const handleDeleteCard = (cardId: string, question: string) => {
		openModal('deleteCard', { cardId, question });
	};

	if (isLoading) {
		return (
			<div className={`space-y-4 ${className}`}>
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse"
					>
						<div className="space-y-4">
							<div>
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
								<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
							</div>
							<div>
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
								<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!cards || cards.length === 0) {
		return (
			<div className={className}>
				<EmptyState
					icon="📇"
					title="No cards yet"
					description="Add your first card to start building your study deck"
					actionLabel="Add Your First Card"
					onAction={() => window.location.href = `/decks/${deckId}/edit-card`}
				/>
			</div>
		);
	}

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
						Cards ({cards.length})
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Manage your flashcards and track your progress
					</p>
				</div>

				<Link
					href={`/decks/${deckId}/edit-card`}
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
				>
					<span className="text-xl">+</span>
					Add Card
				</Link>
			</div>

			{/* Filter/Sort Options */}
			<div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
				<CardListStats cards={cards} />
			</div>

			{/* Cards Grid */}
			<div className="space-y-4">
				{cards.map((card) => (
					<CardRow
						key={card.id}
						card={card}
						deckId={deckId}
						onDelete={handleDeleteCard}
						showProgress={showProgress}
					/>
				))}
			</div>
		</div>
	);
}

interface CardListStatsProps {
	cards: Card[];
}

function CardListStats({ cards }: CardListStatsProps) {
	const totalCards = cards.length;
	const createdToday = cards.filter(card => {
		const today = new Date();
		const cardDate = new Date(card.createdAt);
		return cardDate.toDateString() === today.toDateString();
	}).length;

	const recentlyUpdated = cards.filter(card => {
		const threeDaysAgo = new Date();
		threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
		return new Date(card.updatedAt) > threeDaysAgo;
	}).length;

	return (
		<div className="flex items-center gap-6 text-sm">
			<div className="flex items-center gap-2">
				<span className="text-2xl">📇</span>
				<span className="text-gray-600 dark:text-gray-400">
					<strong className="text-gray-900 dark:text-gray-100">{totalCards}</strong> total cards
				</span>
			</div>

			{createdToday > 0 && (
				<div className="flex items-center gap-2">
					<span className="text-2xl">✨</span>
					<span className="text-gray-600 dark:text-gray-400">
						<strong className="text-green-600 dark:text-green-400">{createdToday}</strong> created today
					</span>
				</div>
			)}

			{recentlyUpdated > 0 && (
				<div className="flex items-center gap-2">
					<span className="text-2xl">🔄</span>
					<span className="text-gray-600 dark:text-gray-400">
						<strong className="text-blue-600 dark:text-blue-400">{recentlyUpdated}</strong> recently updated
					</span>
				</div>
			)}
		</div>
	);
}