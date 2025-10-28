import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { BookOpen, Lightbulb, CheckCircle, X, Settings, Keyboard, ArrowRight, ArrowLeft, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HelpPage() {
	const t = useTranslations('HelpPage');

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">{t('title')}</h1>
				<p className="text-xl text-muted-foreground">
					{t('subtitle')}
				</p>
			</div>

			<div className="grid gap-8">
				{/* Getting Started */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold flex items-center gap-3">
							<Rocket className="w-8 h-8 text-primary" />
							{t('gettingStarted.title')}
						</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="border-l-4 border-primary pl-4">
							<h3 className="font-semibold text-lg">{t('gettingStarted.step1.title')}</h3>
							<p className="text-muted-foreground">
								{t('gettingStarted.step1.description')}
							</p>
						</div>

						<div className="border-l-4 border-primary pl-4">
							<h3 className="font-semibold text-lg">{t('gettingStarted.step2.title')}</h3>
							<p className="text-muted-foreground">
								{t('gettingStarted.step2.description')}
							</p>
						</div>

						<div className="border-l-4 border-primary pl-4">
							<h3 className="font-semibold text-lg">{t('gettingStarted.step3.title')}</h3>
							<p className="text-muted-foreground">
								{t('gettingStarted.step3.description')}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Study Tips */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold flex items-center gap-3">
							<Lightbulb className="w-8 h-8 text-secondary" />
							{t('learningTips.title')}
						</h2>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-primary mb-2 flex items-center gap-1">
									<CheckCircle className="w-4 h-4" /> {t('learningTips.bestPractices.title')}
								</h3>
								<ul className="space-y-2 text-sm text-muted-foreground">
									{t.raw('learningTips.bestPractices.items').map((item: string, index: number) => (
										<li key={index}>• {item}</li>
									))}
								</ul>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-destructive mb-2 flex items-center gap-1">
									<X className="w-4 h-4" /> {t('learningTips.thingsToAvoid.title')}
								</h3>
								<ul className="space-y-2 text-sm text-muted-foreground">
									{t.raw('learningTips.thingsToAvoid.items').map((item: string, index: number) => (
										<li key={index}>• {item}</li>
									))}
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Features Guide */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold flex items-center gap-3">
							<BookOpen className="w-8 h-8 text-primary" />
							{t('featuresGuide.title')}
						</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<Card>
							<CardContent className="pt-6">
								<h3 className="font-semibold mb-2">{t('featuresGuide.spacedRepetition.title')}</h3>
								<p className="text-muted-foreground text-sm">
									{t('featuresGuide.spacedRepetition.description')}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<h3 className="font-semibold mb-2">{t('featuresGuide.progressTracking.title')}</h3>
								<p className="text-muted-foreground text-sm">
									{t('featuresGuide.progressTracking.description')}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<h3 className="font-semibold mb-2">{t('featuresGuide.offlineMode.title')}</h3>
								<p className="text-muted-foreground text-sm">
									{t('featuresGuide.offlineMode.description')}
								</p>
							</CardContent>
						</Card>
					</CardContent>
				</Card>

				{/* Troubleshooting */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold flex items-center gap-3">
							<Settings className="w-8 h-8 text-muted-foreground" />
							{t('troubleshooting.title')}
						</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<details className="border border-border rounded-lg">
							<summary className="p-4 cursor-pointer font-semibold hover:bg-muted">
								{t('troubleshooting.dataDisappeared.title')}
							</summary>
							<div className="p-4 border-t border-border text-sm text-muted-foreground">
								<p>{t('troubleshooting.dataDisappeared.description')}</p>
								<ul className="mt-2 space-y-1 ml-4">
									{t.raw('troubleshooting.dataDisappeared.steps').map((step: string, index: number) => (
										<li key={index}>• {step}</li>
									))}
								</ul>
							</div>
						</details>

						<details className="border border-border rounded-lg">
							<summary className="p-4 cursor-pointer font-semibold hover:bg-muted">
								{t('troubleshooting.appWontInstall.title')}
							</summary>
							<div className="p-4 border-t border-border text-sm text-muted-foreground">
								<p>{t('troubleshooting.appWontInstall.description')}</p>
								<ul className="mt-2 space-y-1 ml-4">
									{t.raw('troubleshooting.appWontInstall.steps').map((step: string, index: number) => (
										<li key={index}>• {step}</li>
									))}
								</ul>
							</div>
						</details>

						<details className="border border-border rounded-lg">
							<summary className="p-4 cursor-pointer font-semibold hover:bg-muted">
								{t('troubleshooting.studySessionsNotWorking.title')}
							</summary>
							<div className="p-4 border-t border-border text-sm text-muted-foreground">
								<p>{t('troubleshooting.studySessionsNotWorking.description')}</p>
								<ul className="mt-2 space-y-1 ml-4">
									{t.raw('troubleshooting.studySessionsNotWorking.steps').map((step: string, index: number) => (
										<li key={index}>• {step}</li>
									))}
								</ul>
							</div>
						</details>
					</CardContent>
				</Card>

				{/* Keyboard Shortcuts */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold flex items-center gap-3">
							<Keyboard className="w-8 h-8 text-muted-foreground" />
							{t('keyboardShortcuts.title')}
						</h2>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-semibold mb-4">{t('keyboardShortcuts.studySession.title')}</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>{t('keyboardShortcuts.studySession.showAnswer')}</span>
									<code className="bg-muted px-2 py-1 rounded">Space</code>
								</div>
								<div className="flex justify-between">
									<span>{t('keyboardShortcuts.studySession.markAsKnown')}</span>
									<code className="bg-muted px-2 py-1 rounded flex items-center gap-1">
										Y or <ArrowRight className="w-3 h-3" />
									</code>
								</div>
								<div className="flex justify-between">
									<span>{t('keyboardShortcuts.studySession.markAsUnknown')}</span>
									<code className="bg-muted px-2 py-1 rounded flex items-center gap-1">
										N or <ArrowLeft className="w-3 h-3" />
									</code>
								</div>
							</div>
						</div>

						<div>
							<h3 className="font-semibold mb-4">{t('keyboardShortcuts.navigation.title')}</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>{t('keyboardShortcuts.navigation.goToDecks')}</span>
									<code className="bg-muted px-2 py-1 rounded">G D</code>
								</div>
								<div className="flex justify-between">
									<span>{t('keyboardShortcuts.navigation.createNewDeck')}</span>
									<code className="bg-muted px-2 py-1 rounded">C</code>
								</div>
								<div className="flex justify-between">
									<span>{t('keyboardShortcuts.navigation.toggleTheme')}</span>
									<code className="bg-muted px-2 py-1 rounded">T</code>
								</div>
							</div>
						</div>
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