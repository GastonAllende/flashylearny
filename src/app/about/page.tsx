import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold">{t('keyFeatures.title')}</h2>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Brain className="w-6 h-6 text-primary mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.smartLearning.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.smartLearning.description')}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Smartphone className="w-6 h-6 text-primary mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.offlineFirst.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.offlineFirst.description')}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<BarChart3 className="w-6 h-6 text-secondary mt-1" />
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
								<Moon className="w-6 h-6 text-primary mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.darkMode.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.darkMode.description')}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Save className="w-6 h-6 text-secondary mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.localStorage.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.localStorage.description')}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FolderOpen className="w-6 h-6 text-muted-foreground mt-1" />
								<div>
									<h3 className="font-semibold">{t('keyFeatures.importExport.title')}</h3>
									<p className="text-muted-foreground text-sm">
										{t('keyFeatures.importExport.description')}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold">{t('howItWorks.title')}</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-start gap-4">
							<div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
							<div>
								<h3 className="font-semibold">{t('howItWorks.step1.title')}</h3>
								<p className="text-muted-foreground text-sm">{t('howItWorks.step1.description')}</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
							<div>
								<h3 className="font-semibold">{t('howItWorks.step2.title')}</h3>
								<p className="text-muted-foreground text-sm">{t('howItWorks.step2.description')}</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
							<div>
								<h3 className="font-semibold">{t('howItWorks.step3.title')}</h3>
								<p className="text-muted-foreground text-sm">{t('howItWorks.step3.description')}</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
							<div>
								<h3 className="font-semibold">{t('howItWorks.step4.title')}</h3>
								<p className="text-muted-foreground text-sm">{t('howItWorks.step4.description')}</p>
							</div>
						</div>
					</CardContent>
				</Card>

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
				<Button asChild size="lg" className="px-8 py-6 text-lg">
					<Link href="/decks">
						{t('cta')}
					</Link>
				</Button>
			</div>
		</div>
	);
}


