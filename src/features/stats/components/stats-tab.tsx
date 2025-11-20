'use client';

import { useTranslations } from 'next-intl';
import { Card as UICard, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Card } from '@/lib/types';
import { BarChart3, CheckCircle, Brain, CreditCard, Eye } from 'lucide-react';

interface StatsTabProps {
	deckProgress: Array<{ card: Card; progress: { id: string; cardId: string; status: string; timesSeen: number; timesKnown: number; }; }> | undefined;
	completion: { completion: number; mastered: number; total: number; } | undefined;
	analytics: { statusDistribution: { NEW: number; LEARNING: number; MASTERED: number; }; averageAccuracy: number; totalReviews: number; recentActivity: { date: string; reviews: number; }[]; } | undefined;
}

export function StatsTab({ deckProgress, completion, analytics }: StatsTabProps) {
	const t = useTranslations('DeckDetail');

	if (!deckProgress || deckProgress.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="mb-4 flex justify-center"><BarChart3 className="h-16 w-16" /></div>
				<h3 className="text-xl font-semibold mb-2">{t('stats.noStatsTitle')}</h3>
				<p className="text-muted-foreground">{t('stats.noStatsDescription')}</p>
			</div>
		);
	}

	// Use analytics data if available, otherwise fallback to computing from deckProgress
	const statusCounts = analytics?.statusDistribution || deckProgress.reduce((acc, { progress }) => {
		acc[progress.status] = (acc[progress.status] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">{t('stats.title')}</h2>

			{/* Status Distribution */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<UICard className="text-center">
					<CardContent className="pt-6">
						<CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
						<div className="text-3xl font-bold text-foreground">{statusCounts.MASTERED || 0}</div>
						<div className="text-sm text-muted-foreground mt-1">{t('stats.mastered')}</div>
					</CardContent>
				</UICard>
				<UICard className="text-center">
					<CardContent className="pt-6">
						<Brain className="h-8 w-8 mx-auto mb-2 text-secondary" />
						<div className="text-3xl font-bold text-foreground">{statusCounts.LEARNING || 0}</div>
						<div className="text-sm text-muted-foreground mt-1">{t('stats.learning')}</div>
					</CardContent>
				</UICard>
				<UICard className="text-center">
					<CardContent className="pt-6">
						<CreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
						<div className="text-3xl font-bold text-foreground">{statusCounts.NEW || 0}</div>
						<div className="text-sm text-muted-foreground mt-1">{t('stats.new')}</div>
					</CardContent>
				</UICard>
			</div>

			{/* Enhanced Analytics */}
			{analytics && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<UICard className="text-center">
						<CardContent className="pt-6">
							<BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
							<div className="text-3xl font-bold text-foreground">{`${analytics.averageAccuracy}%`}</div>
							<div className="text-sm text-muted-foreground mt-1">{t('stats.averageAccuracy')}</div>
						</CardContent>
					</UICard>
					<UICard className="text-center">
						<CardContent className="pt-6">
							<Eye className="h-8 w-8 mx-auto mb-2 text-secondary" />
							<div className="text-3xl font-bold text-foreground">{analytics.totalReviews}</div>
							<div className="text-sm text-muted-foreground mt-1">{t('stats.totalReviews')}</div>
						</CardContent>
					</UICard>
				</div>
			)}

			{completion && (
				<UICard>
					<CardHeader>
						<h3 className="font-semibold">{t('stats.progressOverview')}</h3>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<div className="flex justify-between items-center mb-2">
								<span className="text-sm text-muted-foreground">{t('stats.completionRate')}</span>
								<span className="text-sm font-semibold">{completion.completion}%</span>
							</div>
							<Progress value={completion.completion} className="h-4" />
						</div>
						<div className="flex justify-between text-sm text-muted-foreground pt-2">
							<span>{t('stats.masteredCount', { count: completion.mastered })}</span>
							<span>{t('stats.totalCount', { count: completion.total })}</span>
						</div>
					</CardContent>
				</UICard>
			)}

			{/* Recent Activity Chart */}
			{analytics && analytics.recentActivity.length > 0 && (
				<UICard>
					<CardHeader>
						<h3 className="font-semibold">{t('stats.recentActivity')}</h3>
					</CardHeader>
					<CardContent className="space-y-2">
						{analytics.recentActivity.map((activity) => {
							const maxReviews = Math.max(...analytics.recentActivity.map(a => a.reviews));
							const percentage = Math.min(100, (activity.reviews / maxReviews) * 100);
							return (
								<div key={activity.date} className="flex items-center justify-between gap-4">
									<span className="text-sm text-muted-foreground min-w-24">
										{new Date(activity.date).toLocaleDateString()}
									</span>
									<div className="flex-1">
										<Progress value={percentage} className="h-2" />
									</div>
									<span className="text-sm font-medium w-8 text-right">{activity.reviews}</span>
								</div>
							);
						})}
					</CardContent>
				</UICard>
			)}
		</div>
	);
}
