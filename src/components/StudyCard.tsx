'use client';

import { useState, useEffect } from 'react';
import type { Card } from '../../lib/types';

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
				className="relative w-full aspect-[3/2] perspective-1000 cursor-pointer mb-8"
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
							icon="❓"
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
							icon="💡"
							bgColor="bg-green-500"
							textColor="text-green-50"
							hint="How well did you know this?"
						/>
					</div>
				</div>

				{/* Flip Indicator */}
				<div className="absolute top-4 right-4 bg-black bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium pointer-events-none">
					{isFlipped ? 'Answer' : 'Question'}
				</div>
			</div>

			{/* Response Buttons - Only show when answer is revealed */}
			{isFlipped && (
				<div className="space-y-4">
					<div className="text-center mb-6">
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
							How well did you know this?
						</h3>
						<p className="text-gray-600 dark:text-gray-400 text-sm">
							Be honest - it helps us show you the right cards at the right time
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<ResponseButton
							label="I didn't know it"
							description="Show this more often"
							icon="😅"
							color="red"
							onClick={() => handleResponse('didnt')}
						/>

						<ResponseButton
							label="Almost knew it"
							description="Show occasionally"
							icon="🤔"
							color="yellow"
							onClick={() => handleResponse('almost')}
						/>

						<ResponseButton
							label="I knew it!"
							description="Show less often"
							icon="🎉"
							color="green"
							onClick={() => handleResponse('knew')}
						/>
					</div>
				</div>
			)}

			{/* Progress Hint */}
			{!isFlipped && (
				<div className="text-center">
					<p className="text-gray-500 dark:text-gray-400 text-sm">
						💡 Tap the card to reveal the answer
					</p>
				</div>
			)}
		</div>
	);
}

interface CardFaceProps {
	content: string;
	label: string;
	icon: string;
	bgColor: string;
	textColor: string;
	hint: string;
}

function CardFace({ content, label, icon, bgColor, textColor, hint }: CardFaceProps) {
	return (
		<div className={`
      w-full h-full rounded-2xl ${bgColor} shadow-2xl 
      flex flex-col justify-center items-center p-8 relative
      border-4 border-white dark:border-gray-200
    `}>
			{/* Header */}
			<div className="absolute top-6 left-6 flex items-center gap-2">
				<span className="text-2xl">{icon}</span>
				<span className={`font-semibold ${textColor} opacity-90`}>{label}</span>
			</div>

			{/* Content */}
			<div className="flex-1 flex items-center justify-center text-center">
				<div className={`${textColor} text-2xl sm:text-3xl lg:text-4xl font-bold leading-relaxed max-w-lg`}>
					{content}
				</div>
			</div>

			{/* Hint */}
			<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
				<p className={`${textColor} opacity-80 text-sm font-medium`}>
					{hint}
				</p>
			</div>
		</div>
	);
}

interface ResponseButtonProps {
	label: string;
	description: string;
	icon: string;
	color: 'red' | 'yellow' | 'green';
	onClick: () => void;
}

function ResponseButton({ label, description, icon, color, onClick }: ResponseButtonProps) {
	const colorClasses = {
		red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-900 dark:text-red-100',
		yellow: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-900 dark:text-amber-100',
		green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-900 dark:text-green-100'
	};

	return (
		<button
			onClick={onClick}
			className={`
        ${colorClasses[color]}
        border-2 rounded-xl p-6 transition-all duration-200
        hover:scale-105 hover:shadow-lg active:scale-95
        focus:outline-none focus:ring-4 focus:ring-opacity-20
        ${color === 'red' ? 'focus:ring-red-500' : ''}
        ${color === 'yellow' ? 'focus:ring-amber-500' : ''}
        ${color === 'green' ? 'focus:ring-green-500' : ''}
      `}
		>
			<div className="flex flex-col items-center text-center space-y-2">
				<span className="text-3xl">{icon}</span>
				<div className="font-semibold text-lg">{label}</div>
				<div className="text-sm opacity-80">{description}</div>
			</div>
		</button>
	);
}