'use client';

import { useState, useEffect } from 'react';
import type { Card } from '../../lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card as UICard, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { HelpCircle, Lightbulb, Frown, Brain, PartyPopper } from 'lucide-react';

interface StudyCardProps {
	card: Card;
	onResponse: (response: 'knew' | 'almost' | 'didnt') => void;
	isFlipped?: boolean;
	className?: string;
}

export default function StudyCard({
	card,
	onResponse,
	isFlipped: controlledFlipped,
	className = ''
}: StudyCardProps) {
	const [isFlipped, setIsFlipped] = useState(controlledFlipped ?? false);
	const [isAnimating, setIsAnimating] = useState(false);

	// Reset flip state when card changes
	useEffect(() => {
		if (controlledFlipped !== undefined) {
			setIsFlipped(controlledFlipped);
		} else {
			setIsFlipped(false);
		}
	}, [card.id, controlledFlipped]);

	const handleFlip = () => {
		if (isAnimating) return;

		setIsAnimating(true);
		setIsFlipped(!isFlipped);

		// Reset animation state
		setTimeout(() => setIsAnimating(false), 300);
	};

	const handleResponse = (response: 'knew' | 'almost' | 'didnt') => {
		onResponse(response);
		// Auto-flip back to question side for next card
		if (isFlipped) {
			setIsFlipped(false);
		}
	};

	return (
		<div className={`max-w-2xl mx-auto ${className}`}>
			{/* Card Container */}
			<div
				className="relative w-full aspect-[4/3] sm:aspect-[3/2] perspective-1000 cursor-pointer mb-6"
				onClick={handleFlip}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => e.key === 'Enter' && handleFlip()}
				aria-label={isFlipped ? "Showing answer. Click to show question." : "Showing question. Click to show answer."}
			>
				{/* Card Inner */}
				<div
					className={`
            relative w-full h-full transition-transform duration-300 preserve-3d
            ${isFlipped ? 'rotate-y-180' : ''}
            ${isAnimating ? 'pointer-events-none' : ''}
          `}
				>
					{/* Question Side */}
					<div className="absolute inset-0 backface-hidden">
						<CardFace
							content={card.question}
							label="Question"
							icon={<HelpCircle className="w-6 h-6" />}
							bgColor="bg-blue-500"
							textColor="text-blue-50"
							hint="Tap to reveal answer"
						/>
					</div>

					{/* Answer Side */}
					<div className="absolute inset-0 backface-hidden rotate-y-180">
						<CardFace
							content={card.answer}
							label="Answer"
							icon={<Lightbulb className="w-6 h-6" />}
							bgColor="bg-green-500"
							textColor="text-green-50"
							hint="How well did you know this?"
						/>
					</div>
				</div>

				{/* Flip Indicator */}
				<Badge
					variant="secondary"
					className="absolute top-4 right-4 bg-black/20 text-white pointer-events-none"
				>
					{isFlipped ? 'Answer' : 'Question'}
				</Badge>
			</div>

			{/* Response Buttons - Only show when answer is revealed */}
			{isFlipped && (
				<div className="space-y-4">
					<div className="text-center mb-4">
						<h3 className="text-lg font-semibold mb-2">
							How well did you know this?
						</h3>
						<p className="text-muted-foreground text-sm">
							Be honest - it helps us show you the right cards at the right time
						</p>
					</div>

					<div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
						<ResponseButton
							label="I didn't know it"
							description="Show this more often"
							icon={<Frown className="w-6 h-6 sm:w-8 sm:h-8" />}
							color="red"
							onClick={() => handleResponse('didnt')}
						/>

						<ResponseButton
							label="Almost knew it"
							description="Show occasionally"
							icon={<Brain className="w-6 h-6 sm:w-8 sm:h-8" />}
							color="yellow"
							onClick={() => handleResponse('almost')}
						/>

						<ResponseButton
							label="I knew it!"
							description="Show less often"
							icon={<PartyPopper className="w-6 h-6 sm:w-8 sm:h-8" />}
							color="green"
							onClick={() => handleResponse('knew')}
						/>
					</div>
				</div>
			)}

			{/* Progress Hint */}
			{!isFlipped && (
				<div className="text-center">
					<p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
						<Lightbulb className="w-4 h-4" /> Tap the card to reveal the answer
					</p>
				</div>
			)}
		</div>
	);
}

interface CardFaceProps {
	content: string;
	label: string;
	icon: React.ReactNode;
	bgColor: string;
	textColor: string;
	hint: string;
}

function CardFace({ content, label, icon, bgColor, textColor, hint }: CardFaceProps) {
	return (
		<UICard className={cn(
			"w-full h-full rounded-2xl shadow-2xl flex flex-col justify-center items-center p-8 relative border-4",
			bgColor,
			"border-white dark:border-gray-200"
		)}>
			{/* Header */}
			<div className="absolute top-6 left-6 flex items-center gap-2">
				<span className="text-2xl">{icon}</span>
				<Badge variant="secondary" className={cn("font-semibold", textColor, "opacity-90")}>
					{label}
				</Badge>
			</div>

			{/* Content */}
			<CardContent className="flex-1 flex items-center justify-center text-center p-0">
				<div className={cn(textColor, "text-2xl sm:text-3xl lg:text-4xl font-bold leading-relaxed max-w-lg")}>
					{content}
				</div>
			</CardContent>

			{/* Hint */}
			<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
				<p className={cn(textColor, "opacity-80 text-sm font-medium")}>
					{hint}
				</p>
			</div>
		</UICard>
	);
}

interface ResponseButtonProps {
	label: string;
	description: string;
	icon: React.ReactNode;
	color: 'red' | 'yellow' | 'green';
	onClick: () => void;
}

function ResponseButton({ label, description, icon, color, onClick }: ResponseButtonProps) {
	const getButtonVariant = (color: string) => {
		switch (color) {
			case 'red':
				return 'destructive';
			case 'green':
				return 'default';
			case 'yellow':
			default:
				return 'outline';
		}
	};

	const getColorClasses = (color: string) => {
		switch (color) {
			case 'red':
				return 'border-destructive/20 hover:bg-destructive/10';
			case 'yellow':
				return 'border-amber-200 hover:bg-amber-50 text-amber-900 dark:border-amber-800 dark:hover:bg-amber-900/20 dark:text-amber-100';
			case 'green':
				return 'border-green-200 hover:bg-green-50 text-green-900 dark:border-green-800 dark:hover:bg-green-900/20 dark:text-green-100';
			default:
				return '';
		}
	};

	return (
		<Button
			onClick={onClick}
			variant={getButtonVariant(color)}
			size="lg"
			className={cn(
				"w-full h-auto p-4 sm:p-6 hover:scale-105 active:scale-95 transition-all duration-200",
				"focus:ring-4 focus:ring-opacity-20",
				getColorClasses(color)
			)}
		>
			<div className="flex items-center justify-center space-x-3 sm:flex-col sm:space-x-0 sm:space-y-2">
				<div className="flex items-center justify-center">{icon}</div>
				<div className="text-left sm:text-center">
					<div className="font-semibold text-base sm:text-lg">{label}</div>
					<div className="text-sm opacity-80">{description}</div>
				</div>
			</div>
		</Button>
	);
}