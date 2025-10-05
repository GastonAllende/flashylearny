'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useDeckCompletion } from '../../hooks';
import type { Deck } from '../../lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, BookOpen, Brain, ArrowRight, CreditCard, CheckCircle } from 'lucide-react';

interface DeckCardProps {
	deck: Deck;
	onEdit?: (deck: Deck) => void;
	onDelete?: (deckId: string, deckName: string) => void;
}

export default function DeckCard({ deck, onEdit, onDelete }: DeckCardProps) {
	const t = useTranslations('DeckCard');
	const { data: completion } = useDeckCompletion(deck.id);

	return (
		<Card className="group hover:shadow-lg transition-all duration-200">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-3 mb-3">
							<Link
								href={`/decks/${deck.id}`}
								className="text-xl font-semibold text-foreground hover:text-primary transition-colors truncate"
							>
								{deck.name}
							</Link>
							{completion && completion.total > 0 && (
								<div className="flex items-center gap-2 shrink-0">
									<Progress value={completion.completion} className="w-20 h-2" />
									<Badge variant="secondary" className="text-xs">
										{completion.completion}%
									</Badge>
								</div>
							)}
						</div>

						<div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
							{completion ? (
								<>
									<Badge variant="outline" className="gap-1">
										<CreditCard className="w-3 h-3" /> {t('cards', { count: completion.total })}
									</Badge>
									{completion.mastered > 0 && (
										<Badge variant="default" className="gap-1 bg-green-500">
											<CheckCircle className="w-3 h-3" /> {t('mastered', { count: completion.mastered })}
										</Badge>
									)}
									{completion.total - completion.mastered > 0 && (
										<Badge variant="outline" className="gap-1">
											<BookOpen className="w-3 h-3" /> {t('learning', { count: completion.total - completion.mastered })}
										</Badge>
									)}
								</>
							) : (
								<Badge variant="outline" className="gap-1">
									<CreditCard className="w-3 h-3" /> {t('noCardsYet')}
								</Badge>
							)}
						</div>

						<div className="text-xs text-muted-foreground">
							{t('updated', {
								date: new Date(deck.updatedAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								})
							})}
						</div>
					</div>

					<div className="flex items-center gap-2 ml-4">
						<Link href={`/decks/${deck.id}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
							<BookOpen className="h-4 w-4 mr-1" />
							{t('open')}
						</Link>

						{onEdit && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => onEdit(deck)}
								title={t('renameTitle')}
							>
								<Edit className="h-4 w-4" />
							</Button>
						)}

						{onDelete && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => onDelete(deck.id, deck.name)}
								title={t('deleteTitle')}
								className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			</CardHeader>

			{/* Study button for decks with cards */}
			{completion && completion.total > 0 && (
				<CardContent className="pt-0">
					<Link href={`/decks/${deck.id}?tab=study`} className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white group">
						<Brain className="h-4 w-4 mr-2" />
						{t('startStudying')}
						<ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
					</Link>
				</CardContent>
			)}
		</Card>
	);
}