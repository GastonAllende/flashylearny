'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useProgress } from '../../../../../hooks';
import type { Card } from '../../../../../lib/types';
import { Eye, CheckCircle, Clock } from 'lucide-react';

interface CardItemProps {
	card: Card;
	deckId: string;
	onDelete: (cardId: string, cardQuestion: string) => void;
}

export function CardItem({ card, deckId, onDelete }: CardItemProps) {
	const { data: progress } = useProgress(card.id);
	const tRow = useTranslations('CardRow');

	const getStatusBadge = () => {
		if (!progress) return null;

		const colors = {
			MASTERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
			LEARNING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
			NEW: 'bg-muted text-gray-800 dark:bg-gray-700 dark:text-gray-200'
		};

		return (
			<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[progress.status as keyof typeof colors] || colors.NEW}`}>
				{progress.status}
			</span>
		);
	};

	return (
		<div className="bg-card border rounded-lg p-4 sm:p-6">
			<div className="space-y-4">
				<div className="space-y-3">
					<div>
						<div className="flex items-center gap-2 mb-1">
							<h4 className="font-medium text-foreground text-sm">{tRow('question')}</h4>
							{getStatusBadge()}
						</div>
						<p className="text-foreground text-sm sm:text-base">{card.question}</p>
					</div>
					<div>
						<h4 className="font-medium text-foreground mb-1 text-sm">{tRow('answer')}</h4>
						<p className="text-foreground text-sm sm:text-base">{card.answer}</p>
					</div>
				</div>

				{/* Progress Stats */}
				{progress && (progress.timesSeen > 0 || progress.timesKnown > 0) && (
					<div className="border-t border pt-3 space-y-2">
						<div className="flex flex-wrap items-center gap-3 text-sm">
							<span className="flex items-center gap-1 text-muted-foreground">
								<Eye className="w-4 h-4" />
								<span className="font-medium">{progress.timesSeen}</span>
								<span className="text-xs">{tRow('seen')}</span>
							</span>
							<span className="flex items-center gap-1 text-green-600 dark:text-green-400">
								<CheckCircle className="w-4 h-4" />
								<span className="font-medium">{progress.timesKnown}</span>
								<span className="text-xs">{tRow('knew')}</span>
							</span>
							{(progress.timesAlmost ?? 0) > 0 && (
								<span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
									<span className="w-4 h-4 flex items-center justify-center font-bold">~</span>
									<span className="font-medium">{progress.timesAlmost}</span>
									<span className="text-xs">{tRow('almost')}</span>
								</span>
							)}
							{progress.timesSeen > 0 && (
								<span className="flex items-center gap-1">
									<span className="text-xs text-muted-foreground">{tRow('accuracy')}</span>
									<span className={`font-semibold ${Math.round((progress.timesKnown / progress.timesSeen) * 100) >= 80
										? 'text-green-600 dark:text-green-400'
										: Math.round((progress.timesKnown / progress.timesSeen) * 100) >= 50
											? 'text-yellow-600 dark:text-yellow-400'
											: 'text-red-600 dark:text-red-400'
										}`}>
										{Math.round((progress.timesKnown / progress.timesSeen) * 100)}%
									</span>
								</span>
							)}
						</div>
						{progress.lastReviewedAt && (
							<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
								<Clock className="w-3 h-3" />
								{tRow('lastReviewed')} {new Date(progress.lastReviewedAt).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</div>
						)}
					</div>
				)}

				<div className="flex gap-3 sm:gap-2">
					<Link
						href={`/decks/${deckId}/edit-card/${card.id}`}
						className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-center text-sm"
					>
						{tRow('edit')}
					</Link>
					<button
						onClick={() => onDelete(card.id, card.question)}
						className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
					>
						{tRow('delete')}
					</button>
				</div>
			</div>
		</div>
	);
}
