import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Lock, Smartphone, Save, CheckCircle, Database, AlertTriangle, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
	const t = useTranslations('PrivacyPage');

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">{t('title')}</h1>
				<p className="text-xl text-muted-foreground">
					{t('subtitle')}
				</p>
				<p className="text-sm text-muted-foreground">
					{t('lastUpdated')}
				</p>
			</div>

			<div className="grid gap-8">
				{/* Overview */}
				<Alert>
					<Lock className="h-4 w-4" />
					<AlertTitle className="text-xl">{t('overview.title')}</AlertTitle>
					<AlertDescription className="leading-relaxed">
						{t('overview.description')}
					</AlertDescription>
				</Alert>

				{/* Data Collection */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold">{t('dataCollection.title')}</h2>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="border-l-4 border-primary pl-4">
							<h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								{t('dataCollection.storedLocally.title')}
							</h3>
							<ul className="space-y-2 text-muted-foreground">
								{t.raw('dataCollection.storedLocally.items').map((item: string, index: number) => (
									<li key={index}>• {item}</li>
								))}
							</ul>
							<p className="text-sm text-muted-foreground mt-2">
								<strong>{t('dataCollection.storedLocally.note')}</strong>
							</p>
						</div>

						<div className="border-l-4 border-destructive pl-4">
							<h3 className="font-semibold text-destructive mb-2 flex items-center gap-2">
								<X className="w-5 h-5" />
								{t('dataCollection.notCollected.title')}
							</h3>
							<ul className="space-y-2 text-muted-foreground">
								{t.raw('dataCollection.notCollected.items').map((item: string, index: number) => (
									<li key={index}>• {item}</li>
								))}
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Data Storage */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold">{t('dataStorage.title')}</h2>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-4">
						<div className="space-y-4">
							<Card>
								<CardContent className="pt-6">
									<h3 className="font-semibold mb-2 flex items-center gap-2">
										<Database className="w-5 h-5" />
										{t('dataStorage.localStorage.title')}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t('dataStorage.localStorage.description')}
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="pt-6">
									<h3 className="font-semibold mb-2 flex items-center gap-2">
										<Lock className="w-5 h-5" />
										{t('dataStorage.security.title')}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t('dataStorage.security.description')}
									</p>
								</CardContent>
							</Card>
						</div>

						<div className="space-y-4">
							<Card>
								<CardContent className="pt-6">
									<h3 className="font-semibold mb-2 flex items-center gap-2">
										<Smartphone className="w-5 h-5" />
										{t('dataStorage.deviceAccess.title')}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t('dataStorage.deviceAccess.description')}
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="pt-6">
									<h3 className="font-semibold mb-2 flex items-center gap-2">
										<Save className="w-5 h-5" />
										{t('dataStorage.dataBackup.title')}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t('dataStorage.dataBackup.description')}
									</p>
								</CardContent>
							</Card>
						</div>
					</CardContent>
				</Card>

				{/* Third-Party Services */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold">{t('thirdPartyServices.title')}</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert variant="destructive">
							<AlertTriangle className="h-4 w-4" />
							<AlertTitle>{t('thirdPartyServices.hosting.title')}</AlertTitle>
							<AlertDescription className="text-sm">
								{t('thirdPartyServices.hosting.description')}
							</AlertDescription>
						</Alert>

						<Alert>
							<CheckCircle className="h-4 w-4" />
							<AlertTitle>{t('thirdPartyServices.noAnalytics.title')}</AlertTitle>
							<AlertDescription className="text-sm">
								{t('thirdPartyServices.noAnalytics.description')}
							</AlertDescription>
						</Alert>
					</CardContent>
				</Card>

				{/* Your Rights */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold">{t('yourRights.title')}</h2>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<h3 className="font-semibold text-lg">{t('yourRights.dataControl.title')}</h3>
							<ul className="space-y-2 text-muted-foreground">
								{t.raw('yourRights.dataControl.items').map((item: string, index: number) => (
									<li key={index}>• {item}</li>
								))}
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="font-semibold text-lg">{t('yourRights.dataPortability.title')}</h3>
							<ul className="space-y-2 text-muted-foreground">
								{t.raw('yourRights.dataPortability.items').map((item: string, index: number) => (
									<li key={index}>• {item}</li>
								))}
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Data Deletion */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold">{t('dataDeletion.title')}</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-foreground">
							{t('dataDeletion.description')}
						</p>

						<Card>
							<CardContent className="pt-6">
								<h3 className="font-semibold mb-2">{t('dataDeletion.howToDelete.title')}</h3>
								<ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
									{t.raw('dataDeletion.howToDelete.steps').map((step: string, index: number) => (
										<li key={index}>{step}</li>
									))}
								</ol>
							</CardContent>
						</Card>
					</CardContent>
				</Card>

				{/* Contact */}
				<Card>
					<CardHeader>
						<h2 className="text-2xl font-semibold">{t('contact.title')}</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-foreground">
							{t('contact.description')}
						</p>

						<ul className="space-y-2 text-muted-foreground">
							{t.raw('contact.methods').map((method: string, index: number) => (
								<li key={index}>• {method}</li>
							))}
						</ul>

						<p className="text-sm text-muted-foreground">
							{t('contact.updateNote')}
						</p>
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