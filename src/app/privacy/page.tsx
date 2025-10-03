import Link from 'next/link';
import { Lock, Smartphone, Save, CheckCircle, Database, AlertTriangle, X } from 'lucide-react';

export default function PrivacyPage() {
	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">Privacy Policy</h1>
				<p className="text-xl text-gray-600 dark:text-gray-300">
					Your privacy is important to us
				</p>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Last updated: October 2, 2025
				</p>
			</div>

			<div className="grid gap-8">
				{/* Overview */}
				<section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center gap-2">
						<Lock className="w-6 h-6" />
						Privacy Overview
					</h2>
					<p className="text-blue-800 dark:text-blue-200 leading-relaxed">
						FlashyLearny is designed with privacy at its core. All your study data stays on your device.
						We don&apos;t collect, store, or transmit any of your personal information or study content to external servers.
					</p>
				</section>

				{/* Data Collection */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">What Data We Collect</h2>

					<div className="space-y-6">
						<div className="border-l-4 border-green-500 pl-4">
							<h3 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								Data Stored Locally
							</h3>
							<ul className="space-y-2 text-gray-600 dark:text-gray-400">
								<li>• Your flashcard decks and their content</li>
								<li>• Study progress and statistics</li>
								<li>• App preferences (theme, settings)</li>
								<li>• Session data for study tracking</li>
							</ul>
							<p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
								<strong>Important:</strong> This data never leaves your device and is stored in your browser&apos;s local database.
							</p>
						</div>

						<div className="border-l-4 border-red-500 pl-4">
							<h3 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
								<X className="w-5 h-5" />
								Data We DON&apos;T Collect
							</h3>
							<ul className="space-y-2 text-gray-600 dark:text-gray-400">
								<li>• Personal information (name, email, phone)</li>
								<li>• Usage analytics or tracking data</li>
								<li>• Device information or IP addresses</li>
								<li>• Study content or progress data</li>
								<li>• Cookies for tracking purposes</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Data Storage */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">How We Store Your Data</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
								<h3 className="font-semibold mb-2 flex items-center gap-2">
									<Database className="w-5 h-5" />
									Local Storage
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									All data is stored using IndexedDB in your browser. This is a client-side database that keeps
									your information secure and accessible offline.
								</p>
							</div>

							<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
								<h3 className="font-semibold mb-2">🔐 Security</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Your data is protected by your browser&apos;s security measures and is not accessible to other websites
									or applications.
								</p>
							</div>
						</div>

						<div className="space-y-4">
							<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
								<h3 className="font-semibold mb-2 flex items-center gap-2">
									<Smartphone className="w-5 h-5" />
									Device Access
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Only you have access to your study data through this app on your device. No accounts or
									sign-ups are required.
								</p>
							</div>

							<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
								<h3 className="font-semibold mb-2 flex items-center gap-2">
									<Save className="w-5 h-5" />
									Data Backup
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									You can export your data as CSV files for backup purposes. These files remain under your control.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Third-Party Services */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">Third-Party Services</h2>

					<div className="space-y-4">
						<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
							<h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
								<AlertTriangle className="w-5 h-5" />
								Hosting
							</h3>
							<p className="text-yellow-800 dark:text-yellow-200 text-sm">
								This application is hosted on Vercel. While Vercel may collect standard web server logs
								(IP addresses, request times), they do not have access to your study data since it&apos;s stored locally.
							</p>
						</div>

						<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
							<h3 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								No Analytics
							</h3>
							<p className="text-green-800 dark:text-green-200 text-sm">
								We do not use Google Analytics, Facebook Pixel, or any other tracking services.
								Your usage patterns and study habits remain private.
							</p>
						</div>
					</div>
				</section>

				{/* Your Rights */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">Your Rights and Control</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<h3 className="font-semibold text-lg">Data Control</h3>
							<ul className="space-y-2 text-gray-600 dark:text-gray-400">
								<li>• <strong>Access:</strong> All your data is always accessible through the app</li>
								<li>• <strong>Export:</strong> Download your data as CSV files anytime</li>
								<li>• <strong>Delete:</strong> Clear all data through browser settings</li>
								<li>• <strong>Modify:</strong> Edit or delete individual cards and decks</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="font-semibold text-lg">Data Portability</h3>
							<ul className="space-y-2 text-gray-600 dark:text-gray-400">
								<li>• Export decks to CSV format</li>
								<li>• Import data from other flashcard apps</li>
								<li>• No vendor lock-in or proprietary formats</li>
								<li>• Standard, readable file formats</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Data Deletion */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">Data Deletion</h2>

					<div className="space-y-4">
						<p className="text-gray-700 dark:text-gray-300">
							Since all data is stored locally on your device, you have complete control over its deletion:
						</p>

						<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
							<h3 className="font-semibold mb-2">How to delete your data:</h3>
							<ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
								<li>Clear your browser&apos;s storage for this site</li>
								<li>Use your browser&apos;s &quot;Clear browsing data&quot; feature</li>
								<li>Uninstall the PWA from your device</li>
								<li>Delete individual decks and cards within the app</li>
							</ol>
						</div>
					</div>
				</section>

				{/* Contact */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">Questions or Concerns?</h2>

					<p className="text-gray-700 dark:text-gray-300 mb-4">
						If you have any questions about this privacy policy or how FlashyLearny handles your data,
						you can reach out through:
					</p>

					<ul className="space-y-2 text-gray-600 dark:text-gray-400">
						<li>• GitHub repository issues (if open source)</li>
						<li>• Contact form on our website</li>
						<li>• Email support (if provided)</li>
					</ul>

					<p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
						This privacy policy may be updated from time to time. Any changes will be posted on this page.
					</p>
				</section>
			</div>

			<div className="text-center">
				<Link
					href="/decks"
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
				>
					Start Studying Privately
				</Link>
			</div>
		</div>
	);
}