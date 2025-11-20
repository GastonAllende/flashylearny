'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { StudySession } from '@/stores/ui';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PartyPopper, RotateCcw, BarChart3, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudyCompletionViewProps {
	deckId: string;
	session: StudySession;
	onRestart: () => void;
	onEnd: () => void;
	checkDeckMastery: () => Promise<boolean>;
}

export function StudyCompletionView({
	deckId,
	session,
	onRestart,
	onEnd,
	checkDeckMastery
}: StudyCompletionViewProps) {
	const t = useTranslations('DeckDetail.completionView');
	const [isDeckMastered, setIsDeckMastered] = useState<boolean | null>(null);
	const accuracy = session.sessionStats.seenCards > 0
		? Math.round((session.sessionStats.knownCards / session.sessionStats.seenCards) * 100)
		: 0;

	// Check if the entire deck is mastered when component mounts
	useEffect(() => {
		checkDeckMastery().then(setIsDeckMastered);
	}, [checkDeckMastery]);

	return (
		<div className="text-center py-16 max-w-2xl mx-auto">
			{/* Conditional celebration based on deck mastery */}
			{isDeckMastered ? (
				<>
					<div className="mb-6 flex justify-center"><PartyPopper className="h-16 w-16" /></div>
					<h2 className="text-3xl font-bold mb-4">{t('deckMasteredTitle')}</h2>
					<p className="text-muted-foreground mb-8 whitespace-pre-line">
						{t('deckMasteredBody')}
					</p>
				</>
			) : (
				<>
					<div className="mb-6 flex justify-center"><PartyPopper className="h-16 w-16" /></div>
					<h2 className="text-3xl font-bold mb-4">{t('sessionCompleteTitle')}</h2>
					<p className="text-muted-foreground mb-8">
						{t('sessionCompleteBody')}
					</p>
				</>
			)}

			{/* Session Statistics */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
				<Card className="text-center">
					<CardContent className="pt-6">
						<div className="text-2xl font-bold text-foreground">{session.cardIds.length}</div>
						<div className="text-sm text-muted-foreground">{t('stats.totalCards')}</div>
					</CardContent>
				</Card>
				<Card className="text-center">
					<CardContent className="pt-6">
						<div className="text-2xl font-bold text-foreground">{session.sessionStats.knownCards}</div>
						<div className="text-sm text-muted-foreground">{t('stats.known')}</div>
					</CardContent>
				</Card>
				<Card className="text-center">
					<CardContent className="pt-6">
						<div className="text-2xl font-bold text-foreground">{session.sessionStats.almostCards}</div>
						<div className="text-sm text-muted-foreground">{t('stats.almost')}</div>
					</CardContent>
				</Card>
				<Card className="text-center">
					<CardContent className="pt-6">
						<div className="text-2xl font-bold text-foreground">{session.sessionStats.unknownCards}</div>
						<div className="text-sm text-muted-foreground">{t('stats.unknown')}</div>
					</CardContent>
				</Card>
				<Card className="text-center">
					<CardContent className="pt-6">
						<div className="text-2xl font-bold text-foreground">{accuracy}%</div>
						<div className="text-sm text-muted-foreground">{t('stats.accuracy')}</div>
					</CardContent>
				</Card>
			</div>

			{/* Action Buttons */}
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					{!isDeckMastered && (
						<Button
							onClick={onRestart}
							variant="secondary"
							className="px-8 py-3 sm:py-2 font-semibold"
						>
							<RotateCcw className="h-5 w-5" /> {t('studyAgain')}
						</Button>
					)}
					<Link
						href={`/decks/${deckId}?tab=stats`}
						onClick={onEnd}
						className={cn(buttonVariants(), "px-8 py-3 sm:py-2 font-semibold")}
					>
						<BarChart3 className="h-5 w-5" /> {t('viewStats')}
					</Link>
				</div>
				<Link
					href="/decks"
					onClick={onEnd}
					className="text-muted-foreground hover:text-foreground transition-colors duration-200"
				>
					<span className="inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> {t('backToAll')}</span>
				</Link>
			</div>
		</div>
	);
}
