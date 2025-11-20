'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useProgress } from '@/features/stats';
import { Card as UICard, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import type { Card } from '@/lib/types';
import { Eye, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

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

		const statusConfig = {
			MASTERED: { variant: 'default' as const, className: '' },
			LEARNING: { variant: 'secondary' as const, className: '' },
			NEW: { variant: 'outline' as const, className: '' }
		};

		const config = statusConfig[progress.status as keyof typeof statusConfig] || statusConfig.NEW;

		return (
			<Badge variant={config.variant} className={config.className}>
				{progress.status}
			</Badge>
		);
	};

	return (
		<UICard>
			<CardContent className="p-4 sm:p-6">
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
							<span className="flex items-center gap-1 text-foreground">
								<CheckCircle className="w-4 h-4" />
								<span className="font-medium">{progress.timesKnown}</span>
								<span className="text-xs">{tRow('knew')}</span>
							</span>
							{(progress.timesAlmost ?? 0) > 0 && (
								<span className="flex items-center gap-1 text-muted-foreground">
									<span className="w-4 h-4 flex items-center justify-center font-bold">~</span>
									<span className="font-medium">{progress.timesAlmost}</span>
									<span className="text-xs">{tRow('almost')}</span>
								</span>
							)}
							{progress.timesSeen > 0 && (
								<span className="flex items-center gap-1">
									<span className="text-xs text-muted-foreground">{tRow('accuracy')}</span>
									<span className="font-semibold text-foreground">
										{Math.round((progress.timesKnown / progress.timesSeen) * 100)}%
									</span>
								</span>
							)}
						</div>
						{progress.lastReviewedAt && (
							<div className="flex items-center gap-1 text-xs text-muted-foreground">
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
						className={cn(buttonVariants(), "flex-1 sm:flex-none text-sm font-medium")}
					>
						{tRow('edit')}
					</Link>
					<Button
						onClick={() => onDelete(card.id, card.question)}
						variant="destructive"
						className="flex-1 sm:flex-none text-sm font-medium"
					>
						{tRow('delete')}
					</Button>
				</div>
			</div>
			</CardContent>
		</UICard>
	);
}
