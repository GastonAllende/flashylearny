'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCreateCard, useUpdateCard, useCards } from '../../../../../../hooks';
import type { Card } from '../../../../../../lib/types';
import { Save, Plus, Lightbulb, ArrowLeft, X } from 'lucide-react';

export default function EditCardPage() {
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

	const isEditing = !!cardId;
	const currentCard = cards?.find((card: Card) => card.id === cardId);

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
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	// Show error if editing a card that doesn't exist
	if (isEditing && !currentCard && !cardsLoading) {
		return (
			<div className="max-w-2xl mx-auto text-center py-16">
				<X className="w-16 h-16 mb-4 text-red-400 mx-auto" />
				<h3 className="text-xl font-semibold mb-2">Card not found</h3>
				<p className="text-muted-foreground mb-4">
					The card you&apos;re trying to edit doesn&apos;t exist or has been deleted.
				</p>
				<Link
					href={`/decks/${deckId}`}
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Deck
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
						className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
					>
						<span className="inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Back to Deck</span>
					</Link>
				</div>
				<h1 className="text-3xl font-bold">
					{isEditing ? 'Edit Card' : 'Add New Card'}
				</h1>
				<p className="text-muted-foreground mt-1">
					{isEditing
						? 'Update the question and answer for this flashcard'
						: 'Create a new flashcard for your deck'
					}
				</p>
			</div>

			{/* Form */}
			<div className="bg-card border border rounded-lg p-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Question Field */}
					<div>
						<label htmlFor="question" className="block text-sm font-medium mb-2">
							Question <span className="text-red-500">*</span>
						</label>
						<textarea
							id="question"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							placeholder="Enter the question or front side of the card..."
							rows={4}
							className="w-full px-4 py-3 border border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
							disabled={isLoading}
							required
						/>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
							This is what you&apos;ll see first when studying
						</p>
					</div>

					{/* Answer Field */}
					<div>
						<label htmlFor="answer" className="block text-sm font-medium mb-2">
							Answer <span className="text-red-500">*</span>
						</label>
						<textarea
							id="answer"
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							placeholder="Enter the answer or back side of the card..."
							rows={4}
							className="w-full px-4 py-3 border border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
							disabled={isLoading}
							required
						/>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
							This will be revealed after you flip the card
						</p>
					</div>

					{/* Preview */}
					{(question || answer) && (
						<div className="border-t border pt-6">
							<h3 className="font-medium mb-4">Preview</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
									<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Front (Question)</h4>
									<p className="text-foreground whitespace-pre-wrap">
										{question || 'Question will appear here...'}
									</p>
								</div>
								<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
									<h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Back (Answer)</h4>
									<p className="text-foreground whitespace-pre-wrap">
										{answer || 'Answer will appear here...'}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Actions */}
					<div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border">
						<button
							type="submit"
							disabled={!question.trim() || !answer.trim() || isLoading}
							className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
						>
							{isLoading ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									{isEditing ? 'Updating...' : 'Creating...'}
								</>
							) : (
								<>
									{isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
									{isEditing ? 'Update Card' : 'Create Card'}
								</>
							)}
						</button>

						<button
							type="button"
							onClick={handleCancel}
							disabled={isLoading}
							className="bg-muted0 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>

			{/* Tips */}
			<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
				<h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
					<Lightbulb className="w-5 h-5" />
					Tips for effective flashcards
				</h3>
				<ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
					<li>• Keep questions and answers concise and clear</li>
					<li>• Focus on one concept per card</li>
					<li>• Use your own words to improve retention</li>
					<li>• Include context when necessary</li>
				</ul>
			</div>
		</div>
	);
}