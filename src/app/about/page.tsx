import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Smartphone, BarChart3, Moon, Save, FolderOpen } from 'lucide-react';

export default function AboutPage() {
	const t = useTranslations('AboutPage');

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">{t('title')}</h1>
				<p className="text-xl text-muted-foreground">
					{t('subtitle')}
				</p>
			</div>

			<div className="grid gap-8">
				<Card>
					<CardContent className="p-8">
						<h2 className="text-2xl font-semibold mb-4">{t('whatIs.title')}</h2>
						<p className="text-muted-foreground leading-relaxed">
							{t('whatIs.description')}
						</p>
					</CardContent>
				</Card>

				<section className="bg-card border border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">{t('keyFeatures.title')}</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Brain className="w-6 h-6 text-blue-600 mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.smartLearning.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.smartLearning.description')}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Smartphone className="w-6 h-6 text-green-600 mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.offlineFirst.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.offlineFirst.description')}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<BarChart3 className="w-6 h-6 text-purple-600 mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.progressTracking.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.progressTracking.description')}
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Moon className="w-6 h-6 text-indigo-600 mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.darkMode.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.darkMode.description')}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Save className="w-6 h-6 text-orange-600 mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.localStorage.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.localStorage.description')}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FolderOpen className="w-6 h-6 text-teal-600 mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.importExport.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.importExport.description')}
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-card border border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-4">{t('howItWorks.title')}</h2>
					<div className="space-y-4">
						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
							<div>
								<h3 className="font-semibold">{t('howItWorks.step1.title')}</h3>
								<p className="text-muted-foreground text-sm">{t('howItWorks.step1.description')}</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
							<div>
								<h3 className="font-semibold">{t('howItWorks.step2.title')}</h3>
								<p className="text-muted-foreground text-sm">{t('howItWorks.step2.description')}</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
							<div>
								<h3 className="font-semibold">{t('howItWorks.step3.title')}</h3>
								<p className="text-muted-foreground text-sm">{t('howItWorks.step3.description')}</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
							<div>
								<h3 className="font-semibold">{t('howItWorks.step4.title')}</h3>
								<p className="text-muted-foreground text-sm">{t('howItWorks.step4.description')}</p>
							</div>
						</div>
					</div>
				</section>

				<Card>
					<CardContent className="p-8">
						<h2 className="text-2xl font-semibold mb-4">{t('technology.title')}</h2>
						<p className="text-muted-foreground leading-relaxed mb-4">
							{t('technology.description')}
						</p>
						<ul className="text-muted-foreground space-y-2">
							<li>• {t('technology.nextjs')}</li>
							<li>• {t('technology.indexeddb')}</li>
							<li>• {t('technology.pwa')}</li>
							<li>• {t('technology.tailwind')}</li>
							<li>• {t('technology.typescript')}</li>
						</ul>
					</CardContent>
				</Card>
			</div>

			<div className="text-center">
				<Link
					href="/decks"
					className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-lg"
				>
					{t('cta')}
				</Link>
			</div>
		</div>
	);
}


