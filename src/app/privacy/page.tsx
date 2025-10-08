import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Lock, Smartphone, Save, CheckCircle, Database, AlertTriangle, X } from 'lucide-react';

export default function PrivacyPage() {
	const t = useTranslations('PrivacyPage');

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">{t('title')}</h1>
				<p className="text-xl text-gray-600 dark:text-gray-300">
					{t('subtitle')}
				</p>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					{t('lastUpdated')}
				</p>
			</div>

			<div className="grid gap-8">
				{/* Overview */}
				<section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center gap-2">
						<Lock className="w-6 h-6" />
						{t('overview.title')}
					</h2>
					<p className="text-blue-800 dark:text-blue-200 leading-relaxed">
						{t('overview.description')}
					</p>
				</section>

				{/* Data Collection */}
				<section className="bg-card border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">{t('dataCollection.title')}</h2>

					<div className="space-y-6">
						<div className="border-l-4 border-green-500 pl-4">
							<h3 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								{t('dataCollection.storedLocally.title')}
							</h3>
							<ul className="space-y-2 text-muted-foreground">
								{t.raw('dataCollection.storedLocally.items').map((item: string, index: number) => (
									<li key={index}>• {item}</li>
								))}
							</ul>
							<p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
								<strong>{t('dataCollection.storedLocally.note')}</strong>
							</p>
						</div>

						<div className="border-l-4 border-red-500 pl-4">
							<h3 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
								<X className="w-5 h-5" />
								{t('dataCollection.notCollected.title')}
							</h3>
							<ul className="space-y-2 text-muted-foreground">
								{t.raw('dataCollection.notCollected.items').map((item: string, index: number) => (
									<li key={index}>• {item}</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				{/* Data Storage */}
				<section className="bg-card border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">{t('dataStorage.title')}</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="bg-muted dark:bg-gray-700 p-4 rounded-lg">
								<h3 className="font-semibold mb-2 flex items-center gap-2">
									<Database className="w-5 h-5" />
									{t('dataStorage.localStorage.title')}
								</h3>
								<p className="text-sm text-muted-foreground">
									{t('dataStorage.localStorage.description')}
								</p>
							</div>

							<div className="bg-muted dark:bg-gray-700 p-4 rounded-lg">
								<h3 className="font-semibold mb-2 flex items-center gap-2">
									<Lock className="w-5 h-5" />
									{t('dataStorage.security.title')}
								</h3>
								<p className="text-sm text-muted-foreground">
									{t('dataStorage.security.description')}
								</p>
							</div>
						</div>

						<div className="space-y-4">
							<div className="bg-muted dark:bg-gray-700 p-4 rounded-lg">
								<h3 className="font-semibold mb-2 flex items-center gap-2">
									<Smartphone className="w-5 h-5" />
									{t('dataStorage.deviceAccess.title')}
								</h3>
								<p className="text-sm text-muted-foreground">
									{t('dataStorage.deviceAccess.description')}
								</p>
							</div>

							<div className="bg-muted dark:bg-gray-700 p-4 rounded-lg">
								<h3 className="font-semibold mb-2 flex items-center gap-2">
									<Save className="w-5 h-5" />
									{t('dataStorage.dataBackup.title')}
								</h3>
								<p className="text-sm text-muted-foreground">
									{t('dataStorage.dataBackup.description')}
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Third-Party Services */}
				<section className="bg-card border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">{t('thirdPartyServices.title')}</h2>

					<div className="space-y-4">
						<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
							<h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
								<AlertTriangle className="w-5 h-5" />
								{t('thirdPartyServices.hosting.title')}
							</h3>
							<p className="text-yellow-800 dark:text-yellow-200 text-sm">
								{t('thirdPartyServices.hosting.description')}
							</p>
						</div>

						<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
							<h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								{t('thirdPartyServices.noAnalytics.title')}
							</h3>
							<p className="text-green-800 dark:text-green-200 text-sm">
								{t('thirdPartyServices.noAnalytics.description')}
							</p>
						</div>
					</div>
				</section>

				{/* Your Rights */}
				<section className="bg-card border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">{t('yourRights.title')}</h2>

					<div className="grid md:grid-cols-2 gap-6">
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
					</div>
				</section>

				{/* Data Deletion */}
				<section className="bg-card border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">{t('dataDeletion.title')}</h2>

					<div className="space-y-4">
						<p className="text-foreground">
							{t('dataDeletion.description')}
						</p>

						<div className="bg-muted dark:bg-gray-700 p-4 rounded-lg">
							<h3 className="font-semibold mb-2">{t('dataDeletion.howToDelete.title')}</h3>
							<ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
								{t.raw('dataDeletion.howToDelete.steps').map((step: string, index: number) => (
									<li key={index}>{step}</li>
								))}
							</ol>
						</div>
					</div>
				</section>

				{/* Contact */}
				<section className="bg-card border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">{t('contact.title')}</h2>

					<p className="text-foreground mb-4">
						{t('contact.description')}
					</p>

					<ul className="space-y-2 text-muted-foreground">
						{t.raw('contact.methods').map((method: string, index: number) => (
							<li key={index}>• {method}</li>
						))}
					</ul>

					<p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
						{t('contact.updateNote')}
					</p>
				</section>
			</div>

			<div className="text-center">
				<Link
					href="/decks"
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
				>
					{t('cta')}
				</Link>
			</div>
		</div>
	);
}