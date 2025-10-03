'use client';

import { useState, useEffect } from 'react';
import StudyCard from './StudyCard';
import type { Card } from '../../lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Eye, Edit3, Save, X, Lightbulb, ArrowLeft } from 'lucide-react';

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
	const [activeTab, setActiveTab] = useState('edit');
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
				<h1 className="text-3xl font-bold mb-2">
					{card ? 'Edit Card' : 'Create New Card'}
				</h1>
				<p className="text-muted-foreground">
					{card ? 'Update your flashcard content below' : 'Add a new flashcard to your deck'}
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-2 max-w-md">
					<TabsTrigger value="edit" className="flex items-center gap-2">
						<Edit3 className="h-4 w-4" />
						Edit
					</TabsTrigger>
					<TabsTrigger value="preview" className="flex items-center gap-2">
						<Eye className="h-4 w-4" />
						Preview
					</TabsTrigger>
				</TabsList>

				<TabsContent value="preview" className="space-y-6 mt-8">
					<UICard className="border-blue-200 bg-blue-50/50">
						<CardHeader>
							<CardTitle className="text-blue-900 flex items-center gap-2">
								<Eye className="h-5 w-5" />
								Study Preview
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-blue-700 text-sm">
								This is how your card will look during study sessions. Click the card to flip it!
							</p>
						</CardContent>
					</UICard>

					<StudyCard
						card={previewCard}
						onResponse={() => { }} // No-op for preview
						className="pointer-events-auto"
					/>

					<div className="text-center">
						<Button variant="ghost" onClick={() => setActiveTab('edit')}>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to editing
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="edit" className="space-y-8 mt-8">
					{/* Question Field */}
					<div className="space-y-3">
						<Label htmlFor="question" className="text-lg font-semibold">
							Question
							<span className="text-destructive ml-1">*</span>
						</Label>
						<Textarea
							id="question"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							onKeyDown={(e) => handleKeyDown(e, 'question')}
							placeholder="What do you want to learn? (e.g., 'What is the capital of France?')"
							rows={4}
							className={`text-lg ${errors.question ? 'border-destructive' : ''}`}
							maxLength={500}
						/>
						<div className="flex justify-between items-center">
							{errors.question && (
								<div className="flex items-center gap-2 text-destructive text-sm">
									<AlertTriangle className="h-4 w-4" />
									{errors.question}
								</div>
							)}
							<Badge variant={question.length > 450 ? "destructive" : "secondary"} className="ml-auto">
								{question.length}/500
							</Badge>
						</div>
					</div>

					{/* Answer Field */}
					<div className="space-y-3">
						<Label htmlFor="answer" className="text-lg font-semibold">
							Answer
							<span className="text-destructive ml-1">*</span>
						</Label>
						<Textarea
							id="answer"
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							onKeyDown={(e) => handleKeyDown(e, 'answer')}
							placeholder="The correct answer or explanation (e.g., 'Paris - it's the largest city and political capital of France')"
							rows={6}
							className={`text-lg ${errors.answer ? 'border-destructive' : ''}`}
							maxLength={1000}
						/>
						<div className="flex justify-between items-center">
							{errors.answer && (
								<div className="flex items-center gap-2 text-destructive text-sm">
									<AlertTriangle className="h-4 w-4" />
									{errors.answer}
								</div>
							)}
							<Badge variant={answer.length > 900 ? "destructive" : "secondary"} className="ml-auto">
								{answer.length}/1000
							</Badge>
						</div>
					</div>

					{/* Tips */}
					<UICard className="border-amber-200 bg-amber-50/50">
						<CardHeader>
							<CardTitle className="text-amber-900 flex items-center gap-2">
								<Lightbulb className="h-5 w-5" />
								Tips for great flashcards
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="text-amber-800 text-sm space-y-1">
								<li>• Keep questions specific and clear</li>
								<li>• Make answers concise but complete</li>
								<li>• Use your own words to aid memory</li>
								<li>• Include context or examples when helpful</li>
							</ul>
						</CardContent>
					</UICard>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
						<Button
							onClick={handleSave}
							disabled={isLoading || !question.trim() || !answer.trim()}
							className="flex items-center gap-2"
						>
							{isLoading ? (
								<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
							) : (
								<Save className="h-4 w-4" />
							)}
							{card ? 'Update Card' : 'Create Card'}
							<Badge variant="outline" className="text-xs">⌘⏎</Badge>
						</Button>

						<Button
							variant="outline"
							onClick={onCancel}
							disabled={isLoading}
							className="flex items-center gap-2"
						>
							<X className="h-4 w-4" />
							Cancel
						</Button>

						{question.trim() && answer.trim() && (
							<Button
								variant="outline"
								onClick={() => setActiveTab('preview')}
								className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
							>
								<Eye className="h-4 w-4" />
								Preview Card
							</Button>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}