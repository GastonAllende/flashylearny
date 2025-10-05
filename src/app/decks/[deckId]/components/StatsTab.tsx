'use client';

import { useTranslations } from 'next-intl';
import { StatCard } from '@/components/ui/stat-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import type { Card } from '../../../../../lib/types';
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
				<StatCard
					value={statusCounts.MASTERED || 0}
					label={t('stats.mastered')}
					color="green"
					icon={CheckCircle}
				/>
				<StatCard
					value={statusCounts.LEARNING || 0}
					label={t('stats.learning')}
					color="yellow"
					icon={Brain}
				/>
				<StatCard
					value={statusCounts.NEW || 0}
					label={t('stats.new')}
					color="gray"
					icon={CreditCard}
				/>
			</div>

			{/* Enhanced Analytics */}
			{analytics && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<StatCard
						value={`${analytics.averageAccuracy}%`}
						label={t('stats.averageAccuracy')}
						color="blue"
						icon={BarChart3}
					/>
					<StatCard
						value={analytics.totalReviews}
						label={t('stats.totalReviews')}
						color="purple"
						icon={Eye}
					/>
				</div>
			)}

			{completion && (
				<div className="bg-card border rounded-lg p-6">
					<h3 className="font-semibold mb-4">{t('stats.progressOverview')}</h3>
					<div className="space-y-3">
						<ProgressBar
							value={completion.completion}
							label={t('stats.completionRate')}
							showBadge={true}
							color="green"
							size="lg"
						/>
						<div className="flex justify-between text-sm text-muted-foreground pt-2">
							<span>{t('stats.masteredCount', { count: completion.mastered })}</span>
							<span>{t('stats.totalCount', { count: completion.total })}</span>
						</div>
					</div>
				</div>
			)}

			{/* Recent Activity Chart */}
			{analytics && analytics.recentActivity.length > 0 && (
				<div className="bg-card border rounded-lg p-6">
					<h3 className="font-semibold mb-4">{t('stats.recentActivity')}</h3>
					<div className="space-y-2">
						{analytics.recentActivity.map((activity) => (
							<div key={activity.date} className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">
									{new Date(activity.date).toLocaleDateString()}
								</span>
								<div className="flex items-center gap-2">
									<div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-16">
										<div
											className="bg-blue-500 h-2 rounded-full transition-all duration-300"
											style={{ width: `${Math.min(100, (activity.reviews / Math.max(...analytics.recentActivity.map(a => a.reviews))) * 100)}%` }}
										/>
									</div>
									<span className="text-sm font-medium w-8 text-right">{activity.reviews}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
