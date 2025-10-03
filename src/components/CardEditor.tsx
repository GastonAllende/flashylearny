'use client';

import { useState, useEffect } from 'react';
import StudyCard from './StudyCard';
import type { Card } from '../../lib/types';

interface CardEditorProps {
	deckId: string;
	card?: Card;
	onSave: (data: { question: string; answer: string; }) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
	className?: string;
}

export default function CardEditor({
	deckId,
	card,
	onSave,
	onCancel,
	isLoading = false,
	className = ''
}: CardEditorProps) {
	const [question, setQuestion] = useState(card?.question ?? '');
	const [answer, setAnswer] = useState(card?.answer ?? '');
	const [showPreview, setShowPreview] = useState(false);
	const [errors, setErrors] = useState<{ question?: string; answer?: string; }>({});

	// Reset form when card changes
	useEffect(() => {
		setQuestion(card?.question ?? '');
		setAnswer(card?.answer ?? '');
		setErrors({});
	}, [card]);

	const validateForm = () => {
		const newErrors: { question?: string; answer?: string; } = {};

		if (!question.trim()) {
			newErrors.question = 'Question is required';
		} else if (question.trim().length < 3) {
			newErrors.question = 'Question must be at least 3 characters';
		} else if (question.trim().length > 500) {
			newErrors.question = 'Question must be less than 500 characters';
		}

		if (!answer.trim()) {
			newErrors.answer = 'Answer is required';
		} else if (answer.trim().length < 1) {
			newErrors.answer = 'Answer cannot be empty';
		} else if (answer.trim().length > 1000) {
			newErrors.answer = 'Answer must be less than 1000 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = async () => {
		if (!validateForm()) return;

		try {
			await onSave({
				question: question.trim(),
				answer: answer.trim()
			});
		} catch (error) {
			console.error('Failed to save card:', error);
			// Error handling could be improved with toast notifications
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent, field: 'question' | 'answer') => {
		// Allow Ctrl/Cmd + Enter to save
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			e.preventDefault();
			handleSave();
		}

		// Clear field-specific errors when user starts typing
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};

	// Create preview card
	const previewCard: Card = {
		id: 'preview',
		deckId,
		question: question || 'Your question will appear here...',
		answer: answer || 'Your answer will appear here...',
		createdAt: Date.now(),
		updatedAt: Date.now()
	};

	return (
		<div className={`max-w-4xl mx-auto ${className}`}>
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
					{card ? 'Edit Card' : 'Create New Card'}
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					{card ? 'Update your flashcard content below' : 'Add a new flashcard to your deck'}
				</p>
			</div>

			{/* Toggle Buttons */}
			<div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8 max-w-md">
				<button
					onClick={() => setShowPreview(false)}
					className={`
            flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200
            ${!showPreview
							? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
							: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
						}
          `}
				>
					✏️ Edit
				</button>
				<button
					onClick={() => setShowPreview(true)}
					className={`
            flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200
            ${showPreview
							? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
							: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
						}
          `}
				>
					👁️ Preview
				</button>
			</div>

			{showPreview ? (
				/* Preview Mode */
				<div className="space-y-6">
					<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
						<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
							📖 Study Preview
						</h3>
						<p className="text-blue-700 dark:text-blue-300 text-sm">
							This is how your card will look during study sessions. Click the card to flip it!
						</p>
					</div>

					<StudyCard
						card={previewCard}
						onResponse={() => { }} // No-op for preview
						className="pointer-events-auto"
					/>

					<div className="text-center">
						<button
							onClick={() => setShowPreview(false)}
							className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
						>
							← Back to editing
						</button>
					</div>
				</div>
			) : (
				/* Edit Mode */
				<div className="space-y-8">
					{/* Question Field */}
					<div className="space-y-3">
						<label htmlFor="question" className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
							Question
							<span className="text-red-500 ml-1">*</span>
						</label>
						<textarea
							id="question"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							onKeyDown={(e) => handleKeyDown(e, 'question')}
							placeholder="What do you want to learn? (e.g., 'What is the capital of France?')"
							rows={4}
							className={`
                w-full px-4 py-3 border rounded-lg resize-none
                text-lg leading-relaxed
                focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                transition-colors duration-200
                ${errors.question
									? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
									: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
								}
                text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
              `}
							maxLength={500}
						/>
						<div className="flex justify-between items-center">
							{errors.question && (
								<p className="text-red-600 dark:text-red-400 text-sm font-medium">
									{errors.question}
								</p>
							)}
							<span className={`text-sm ml-auto ${question.length > 450 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
								}`}>
								{question.length}/500
							</span>
						</div>
					</div>

					{/* Answer Field */}
					<div className="space-y-3">
						<label htmlFor="answer" className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
							Answer
							<span className="text-red-500 ml-1">*</span>
						</label>
						<textarea
							id="answer"
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							onKeyDown={(e) => handleKeyDown(e, 'answer')}
							placeholder="The correct answer or explanation (e.g., 'Paris - it's the largest city and political capital of France')"
							rows={6}
							className={`
                w-full px-4 py-3 border rounded-lg resize-none
                text-lg leading-relaxed
                focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500
                transition-colors duration-200
                ${errors.answer
									? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
									: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
								}
                text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
              `}
							maxLength={1000}
						/>
						<div className="flex justify-between items-center">
							{errors.answer && (
								<p className="text-red-600 dark:text-red-400 text-sm font-medium">
									{errors.answer}
								</p>
							)}
							<span className={`text-sm ml-auto ${answer.length > 900 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
								}`}>
								{answer.length}/1000
							</span>
						</div>
					</div>

					{/* Tips */}
					<div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
						<h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
							💡 Tips for great flashcards
						</h4>
						<ul className="text-amber-800 dark:text-amber-200 text-sm space-y-1">
							<li>• Keep questions specific and clear</li>
							<li>• Make answers concise but complete</li>
							<li>• Use your own words to aid memory</li>
							<li>• Include context or examples when helpful</li>
						</ul>
					</div>
				</div>
			)}

			{/* Action Buttons */}
			{!showPreview && (
				<div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
					<button
						onClick={handleSave}
						disabled={isLoading || !question.trim() || !answer.trim()}
						className="
              bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
              text-white px-8 py-3 rounded-lg font-semibold 
              transition-all duration-200 flex items-center justify-center gap-2
              hover:shadow-lg disabled:cursor-not-allowed
              focus:outline-none focus:ring-4 focus:ring-blue-500/20
            "
					>
						{isLoading && (
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						)}
						{card ? 'Update Card' : 'Create Card'}
						<span className="text-sm opacity-80">(⌘⏎)</span>
					</button>

					<button
						onClick={onCancel}
						disabled={isLoading}
						className="
              bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
              text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-semibold 
              transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-4 focus:ring-gray-500/20
            "
					>
						Cancel
					</button>

					{question.trim() && answer.trim() && (
						<button
							onClick={() => setShowPreview(true)}
							className="
                bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30
                text-green-700 dark:text-green-300 px-6 py-3 rounded-lg font-semibold 
                transition-colors duration-200
                focus:outline-none focus:ring-4 focus:ring-green-500/20
              "
						>
							👁️ Preview Card
						</button>
					)}
				</div>
			)}
		</div>
	);
}