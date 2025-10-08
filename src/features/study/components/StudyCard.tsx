'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { Card } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CardFace } from './CardFace';
import { ResponseButton } from './ResponseButton';
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
	const t = useTranslations('StudyCard');
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
				aria-label={isFlipped ? t('indicatorAnswer') : t('indicatorQuestion')}
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
							label={t('question')}
							icon={<HelpCircle className="w-6 h-6" />}
							bgColor="bg-blue-500"
							textColor="text-blue-50"
							hint={t('tapToReveal')}
						/>
					</div>

					{/* Answer Side */}
					<div className="absolute inset-0 backface-hidden rotate-y-180">
						<CardFace
							content={card.answer}
							label={t('answer')}
							icon={<Lightbulb className="w-6 h-6" />}
							bgColor="bg-green-500"
							textColor="text-green-50"
							hint={t('howWell')}
						/>
					</div>
				</div>

				{/* Flip Indicator */}
				<Badge
					variant="secondary"
					className="absolute top-4 right-4 bg-black/20 text-white pointer-events-none"
				>
					{isFlipped ? t('indicatorAnswer') : t('indicatorQuestion')}
				</Badge>
			</div>

			{/* Response Buttons - Only show when answer is revealed */}
			{isFlipped && (
				<div className="space-y-4">
					<div className="text-center mb-4">
						<h3 className="text-lg font-semibold mb-2">
							{t('howWell')}
						</h3>
						<p className="text-muted-foreground text-sm">
							{t('beHonest')}
						</p>
					</div>

					<div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
						<ResponseButton
							label={t('responses.didnt.label')}
							description={t('responses.didnt.description')}
							icon={<Frown className="w-6 h-6 sm:w-8 sm:h-8" />}
							color="red"
							onClick={() => handleResponse('didnt')}
						/>

						<ResponseButton
							label={t('responses.almost.label')}
							description={t('responses.almost.description')}
							icon={<Brain className="w-6 h-6 sm:w-8 sm:h-8" />}
							color="yellow"
							onClick={() => handleResponse('almost')}
						/>

						<ResponseButton
							label={t('responses.knew.label')}
							description={t('responses.knew.description')}
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
						<Lightbulb className="w-4 h-4" /> {t('tapToRevealShort')}
					</p>
				</div>
			)}
		</div>
	);
}

