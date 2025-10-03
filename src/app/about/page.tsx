import Link from 'next/link';

export default function AboutPage() {
	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">About FlashyLearny</h1>
				<p className="text-xl text-gray-600 dark:text-gray-300">
					Your offline-first study companion for mastering any subject
				</p>
			</div>

			<div className="grid gap-8">
				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-4">What is FlashyLearny?</h2>
					<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
						FlashyLearny is a modern, offline-first flashcard application designed to help you learn and retain information effectively.
						Built with spaced repetition principles and progressive web app technology, it works seamlessly both online and offline,
						ensuring your study sessions are never interrupted.
					</p>
				</section>

				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">Key Features</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<span className="text-2xl">🧠</span>
								<div>
									<h3 className="font-semibold">Smart Learning</h3>
									<p className="text-gray-600 dark:text-gray-400 text-sm">
										Adaptive spaced repetition algorithm helps you focus on cards that need the most attention
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<span className="text-2xl">📱</span>
								<div>
									<h3 className="font-semibold">Offline First</h3>
									<p className="text-gray-600 dark:text-gray-400 text-sm">
										Study anywhere, anytime - no internet connection required
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<span className="text-2xl">📊</span>
								<div>
									<h3 className="font-semibold">Progress Tracking</h3>
									<p className="text-gray-600 dark:text-gray-400 text-sm">
										Detailed statistics and progress visualization to track your learning journey
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<span className="text-2xl">🌙</span>
								<div>
									<h3 className="font-semibold">Dark Mode</h3>
									<p className="text-gray-600 dark:text-gray-400 text-sm">
										Eye-friendly dark theme for comfortable studying in any lighting
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<span className="text-2xl">💾</span>
								<div>
									<h3 className="font-semibold">Local Storage</h3>
									<p className="text-gray-600 dark:text-gray-400 text-sm">
										All your data stays on your device - private and secure
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<span className="text-2xl">📁</span>
								<div>
									<h3 className="font-semibold">Import/Export</h3>
									<p className="text-gray-600 dark:text-gray-400 text-sm">
										Easy backup and sharing with CSV import/export functionality
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
					<div className="space-y-4">
						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
							<div>
								<h3 className="font-semibold">Create Decks</h3>
								<p className="text-gray-600 dark:text-gray-400 text-sm">Organize your study material into themed decks</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
							<div>
								<h3 className="font-semibold">Add Cards</h3>
								<p className="text-gray-600 dark:text-gray-400 text-sm">Create flashcards with questions and answers</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
							<div>
								<h3 className="font-semibold">Study & Review</h3>
								<p className="text-gray-600 dark:text-gray-400 text-sm">Study cards and mark whether you knew the answer</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
							<div>
								<h3 className="font-semibold">Track Progress</h3>
								<p className="text-gray-600 dark:text-gray-400 text-sm">Watch your mastery improve over time</p>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-4">Technology</h2>
					<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
						FlashyLearny is built with modern web technologies to provide a fast, reliable, and accessible experience:
					</p>
					<ul className="text-gray-600 dark:text-gray-400 space-y-2">
						<li>• <strong>Next.js 15</strong> - React framework for optimal performance</li>
						<li>• <strong>IndexedDB</strong> - Client-side database for offline functionality</li>
						<li>• <strong>Progressive Web App</strong> - Installable and works offline</li>
						<li>• <strong>Tailwind CSS</strong> - Modern, responsive design</li>
						<li>• <strong>TypeScript</strong> - Type-safe development</li>
					</ul>
				</section>
			</div>

			<div className="text-center">
				<Link
					href="/decks"
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 inline-block"
				>
					Start Learning Today
				</Link>
			</div>
		</div>
	);
}


