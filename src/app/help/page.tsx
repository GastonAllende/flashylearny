import Link from 'next/link';

export default function HelpPage() {
	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">Help & Support</h1>
				<p className="text-xl text-gray-600 dark:text-gray-300">
					Get the most out of FlashyLearny with these helpful guides
				</p>
			</div>

			<div className="grid gap-8">
				{/* Getting Started */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
						<span className="text-3xl">🚀</span>
						Getting Started
					</h2>

					<div className="space-y-4">
						<div className="border-l-4 border-blue-500 pl-4">
							<h3 className="font-semibold text-lg">1. Create Your First Deck</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Start by creating a deck to organize your study material. Click the &quot;Create Deck&quot; button on the decks page and give it a descriptive name.
							</p>
						</div>

						<div className="border-l-4 border-blue-500 pl-4">
							<h3 className="font-semibold text-lg">2. Add Cards</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Click &quot;Add Card&quot; to create flashcards. Write a clear question on the front and the answer on the back. Keep them concise for better memorization.
							</p>
						</div>

						<div className="border-l-4 border-blue-500 pl-4">
							<h3 className="font-semibold text-lg">3. Start Studying</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Use the &quot;Start Studying&quot; button to begin a study session. Review each card and honestly mark whether you knew the answer.
							</p>
						</div>
					</div>
				</section>

				{/* Study Tips */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
						<span className="text-3xl">💡</span>
						Study Tips
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-green-600 mb-2">✅ Best Practices</h3>
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li>• Study in short, regular sessions (15-30 minutes)</li>
									<li>• Be honest when marking cards as known/unknown</li>
									<li>• Review difficult cards more frequently</li>
									<li>• Create cards in your own words</li>
									<li>• Focus on understanding, not just memorization</li>
								</ul>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-red-600 mb-2">❌ Things to Avoid</h3>
								<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<li>• Making cards too long or complex</li>
									<li>• Studying when tired or distracted</li>
									<li>• Marking cards as known when you&apos;re not sure</li>
									<li>• Skipping review sessions</li>
									<li>• Creating too many new cards at once</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* Features Guide */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
						<span className="text-3xl">📖</span>
						Features Guide
					</h2>

					<div className="space-y-6">
						<div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
							<h3 className="font-semibold mb-2">Spaced Repetition</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								Cards you struggle with will appear more frequently, while cards you&apos;ve mastered will appear less often.
								This helps optimize your study time and improves long-term retention.
							</p>
						</div>

						<div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
							<h3 className="font-semibold mb-2">Progress Tracking</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								Monitor your learning progress with detailed statistics. See how many cards you&apos;ve mastered,
								are currently learning, or haven&apos;t studied yet.
							</p>
						</div>

						<div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
							<h3 className="font-semibold mb-2">Offline Mode</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								All your data is stored locally on your device. You can study anywhere, even without an internet connection.
								Your progress syncs automatically when you reconnect.
							</p>
						</div>
					</div>
				</section>

				{/* Troubleshooting */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
						<span className="text-3xl">🔧</span>
						Troubleshooting
					</h2>

					<div className="space-y-4">
						<details className="border border-gray-200 dark:border-gray-600 rounded-lg">
							<summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50 dark:hover:bg-gray-700">
								My data disappeared or cards aren&apos;t loading
							</summary>
							<div className="p-4 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400">
								<p>This usually happens when browser data is cleared. Try:</p>
								<ul className="mt-2 space-y-1 ml-4">
									<li>• Refresh the page</li>
									<li>• Check if you&apos;re using a different browser or incognito mode</li>
									<li>• Ensure your browser supports IndexedDB</li>
									<li>• Import your data from a CSV backup if available</li>
								</ul>
							</div>
						</details>

						<details className="border border-gray-200 dark:border-gray-600 rounded-lg">
							<summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50 dark:hover:bg-gray-700">
								The app won&apos;t install on my device
							</summary>
							<div className="p-4 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400">
								<p>PWA installation requirements:</p>
								<ul className="mt-2 space-y-1 ml-4">
									<li>• Use a supported browser (Chrome, Firefox, Safari, Edge)</li>
									<li>• Visit the site over HTTPS</li>
									<li>• Look for the install button in your browser&apos;s address bar</li>
									<li>• On mobile, use &quot;Add to Home Screen&quot; from the browser menu</li>
								</ul>
							</div>
						</details>

						<details className="border border-gray-200 dark:border-gray-600 rounded-lg">
							<summary className="p-4 cursor-pointer font-semibold hover:bg-gray-50 dark:hover:bg-gray-700">
								Study sessions aren&apos;t working properly
							</summary>
							<div className="p-4 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400">
								<p>Try these steps:</p>
								<ul className="mt-2 space-y-1 ml-4">
									<li>• Make sure your deck has cards</li>
									<li>• Refresh the page and try again</li>
									<li>• Clear browser cache and reload</li>
									<li>• Check console for any error messages</li>
								</ul>
							</div>
						</details>
					</div>
				</section>

				{/* Keyboard Shortcuts */}
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
						<span className="text-3xl">⌨️</span>
						Keyboard Shortcuts
					</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-semibold mb-4">Study Session</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>Show answer</span>
									<code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Space</code>
								</div>
								<div className="flex justify-between">
									<span>Mark as known</span>
									<code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Y or →</code>
								</div>
								<div className="flex justify-between">
									<span>Mark as unknown</span>
									<code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">N or ←</code>
								</div>
							</div>
						</div>

						<div>
							<h3 className="font-semibold mb-4">Navigation</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>Go to decks</span>
									<code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">G D</code>
								</div>
								<div className="flex justify-between">
									<span>Create new deck</span>
									<code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">C</code>
								</div>
								<div className="flex justify-between">
									<span>Toggle theme</span>
									<code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">T</code>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>

			<div className="text-center">
				<Link
					href="/decks"
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
				>
					Back to Studying
				</Link>
			</div>
		</div>
	);
}