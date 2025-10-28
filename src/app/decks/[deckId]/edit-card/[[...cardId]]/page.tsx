'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCreateCard, useUpdateCard, useCards } from '@/hooks';
import { useSubscription } from '@/hooks/use-subscription';
import { useUIStore } from '@/stores/ui';
import type { Card } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Save, Plus, Lightbulb, ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function EditCardPage() {
	const t = useTranslations('EditCard');
	const params = useParams();
	const router = useRouter();
	const deckId = params.deckId as string;
	// Handle catch-all route - cardId can be an array or undefined
	const cardIdParam = params.cardId as string[] | undefined;
	const cardId = cardIdParam?.[0]; // Get first element if array exists

	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const { data: cards, isLoading: cardsLoading } = useCards(deckId);
	const createCardMutation = useCreateCard();
	const updateCardMutation = useUpdateCard();
	const subscription = useSubscription();
	const { openModal } = useUIStore();

	const isEditing = !!cardId;
	const currentCard = cards?.find((card: Card) => card.id === cardId);

	const currentCardCount = cards?.length || 0;
	const canCreate = subscription.canCreateCard(currentCardCount);

	// Load existing card data if editing
	useEffect(() => {
		if (isEditing && currentCard) {
			setQuestion(currentCard.question);
			setAnswer(currentCard.answer);
		}
	}, [isEditing, currentCard]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!question.trim() || !answer.trim()) {
			return;
		}

		// Check limit before creating new card (not when editing)
		if (!isEditing && !canCreate) {
			toast.error(`You've reached the maximum of ${subscription.limits.maxCardsPerDeck} cards per deck on the free plan`);
			openModal('paywall', { context: 'card_limit' });
			return;
		}

		setIsLoading(true);

		try {
			if (isEditing && cardId) {
				await updateCardMutation.mutateAsync({
					cardId,
					updates: {
						question: question.trim(),
						answer: answer.trim(),
					},
				});
			} else {
				await createCardMutation.mutateAsync({
					deckId,
					question: question.trim(),
					answer: answer.trim(),
				});
			}

			// Navigate back to deck detail page
			router.push(`/decks/${deckId}`);
		} catch (error) {
			console.error('Failed to save card:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		router.push(`/decks/${deckId}`);
	};

	// Show loading spinner while cards are being fetched
	if (cardsLoading) {
		return (
			<div className="flex items-center justify-center min-h-[50vh]">
				<Spinner size="xl" className="text-primary" />
			</div>
		);
	}

	// Show error if editing a card that doesn't exist
	if (isEditing && !currentCard && !cardsLoading) {
		return (
			<div className="max-w-2xl mx-auto text-center py-16">
				<X className="w-16 h-16 mb-4 text-destructive mx-auto" />
				<h3 className="text-xl font-semibold mb-2">{t('cardNotFoundTitle')}</h3>
				<p className="text-muted-foreground mb-4">
					{t('cardNotFoundDescription')}
				</p>
				<Link
					href={`/decks/${deckId}`}
					className={cn(buttonVariants(), "inline-flex")}
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					{t('backToDeck')}
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* Header */}
			<div>
				<div className="flex items-center gap-3 mb-4">
					<Link
						href={`/decks/${deckId}`}
						className="text-primary hover:text-primary/80 transition-colors duration-200"
					>
						<span className="inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> {t('backToDeck')}</span>
					</Link>
				</div>
				<h1 className="text-3xl font-bold">
					{isEditing ? t('headerEdit') : t('headerAdd')}
				</h1>
				<p className="text-muted-foreground mt-1">
					{isEditing ? t('subEdit') : t('subAdd')}
				</p>
			</div>

			{/* Form */}
			<div className="bg-card border rounded-lg p-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Question Field */}
					<div>
						<label htmlFor="question" className="block text-sm font-medium mb-2">
							{t('questionLabel')} <span className="text-destructive">*</span>
						</label>
						<textarea
							id="question"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							placeholder={t('questionPlaceholder')}
							rows={4}
							className="w-full px-4 py-3 border border-input rounded-lg bg-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none resize-none"
							disabled={isLoading}
							required
						/>
						<p className="text-sm text-muted-foreground mt-1">
							{t('questionHelp')}
						</p>
					</div>

					{/* Answer Field */}
					<div>
						<label htmlFor="answer" className="block text-sm font-medium mb-2">
							{t('answerLabel')} <span className="text-destructive">*</span>
						</label>
						<textarea
							id="answer"
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							placeholder={t('answerPlaceholder')}
							rows={4}
							className="w-full px-4 py-3 border border-input rounded-lg bg-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none resize-none"
							disabled={isLoading}
							required
						/>
						<p className="text-sm text-muted-foreground mt-1">
							{t('answerHelp')}
						</p>
					</div>

					{/* Preview */}
					{(question || answer) && (
						<div className="border-t border pt-6">
							<h3 className="font-medium mb-4">{t('preview')}</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-secondary border rounded-lg p-4">
									<h4 className="font-medium mb-2">{t('front')}</h4>
									<p className="text-foreground whitespace-pre-wrap">
										{question || t('questionPreviewPlaceholder')}
									</p>
								</div>
								<div className="bg-secondary border rounded-lg p-4">
									<h4 className="font-medium mb-2">{t('back')}</h4>
									<p className="text-foreground whitespace-pre-wrap">
										{answer || t('answerPreviewPlaceholder')}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Actions */}
					<div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border">
						<Button
							type="submit"
							disabled={!question.trim() || !answer.trim() || isLoading}
							className="px-6 py-3 sm:py-2 font-semibold"
						>
							{isLoading ? (
								<>
									<Spinner size="sm" />
									{isEditing ? t('updating') : t('creating')}
								</>
							) : (
								<>
									{isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
									{isEditing ? t('updateCard') : t('createCard')}
								</>
							)}
						</Button>

						<Button
							type="button"
							variant="secondary"
							onClick={handleCancel}
							disabled={isLoading}
							className="px-6 py-3 sm:py-2 font-semibold"
						>
							{t('cancel')}
						</Button>
					</div>
				</form>
			</div>

			{/* Tips */}
			<div className="bg-secondary border rounded-lg p-4">
				<h3 className="font-medium mb-2 flex items-center gap-2">
					<Lightbulb className="w-5 h-5" />
					{t('tipsTitle')}
				</h3>
				<ul className="text-sm text-muted-foreground space-y-1">
					<li>• {t('tip1')}</li>
					<li>• {t('tip2')}</li>
					<li>• {t('tip3')}</li>
					<li>• {t('tip4')}</li>
				</ul>
			</div>
		</div>
	);
}