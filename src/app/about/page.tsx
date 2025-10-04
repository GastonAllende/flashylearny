import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Smartphone, BarChart3, Moon, Save, FolderOpen } from 'lucide-react';

export default function AboutPage() {
	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">About FlashyLearny</h1>
				<p className="text-xl text-muted-foreground">
					Your offline-first study companion for mastering any subject
				</p>
			</div>

			<div className="grid gap-8">
				<Card>
					<CardContent className="p-8">
						<h2 className="text-2xl font-semibold mb-4">What is FlashyLearny?</h2>
						<p className="text-muted-foreground leading-relaxed">
							FlashyLearny is a modern, offline-first flashcard application designed to help you learn and retain information effectively.
							Built with spaced repetition principles and progressive web app technology, it works seamlessly both online and offline,
							ensuring your study sessions are never interrupted.
						</p>
					</CardContent>
				</Card>

				<section className="bg-card border border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-6">Key Features</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Brain className="w-6 h-6 text-blue-600 mt-1" />
								<div>
									<h3 className="font-semibold">Smart Learning</h3>
									<p className="text-muted-foreground text-sm">
										Adaptive spaced repetition algorithm helps you focus on cards that need the most attention
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Smartphone className="w-6 h-6 text-green-600 mt-1" />
								<div>
									<h3 className="font-semibold">Offline First</h3>
									<p className="text-muted-foreground text-sm">
										Study anywhere, anytime - no internet connection required
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<BarChart3 className="w-6 h-6 text-purple-600 mt-1" />
								<div>
									<h3 className="font-semibold">Progress Tracking</h3>
									<p className="text-muted-foreground text-sm">
										Detailed statistics and progress visualization to track your learning journey
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Moon className="w-6 h-6 text-indigo-600 mt-1" />
								<div>
									<h3 className="font-semibold">Dark Mode</h3>
									<p className="text-muted-foreground text-sm">
										Eye-friendly dark theme for comfortable studying in any lighting
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Save className="w-6 h-6 text-orange-600 mt-1" />
								<div>
									<h3 className="font-semibold">Local Storage</h3>
									<p className="text-muted-foreground text-sm">
										All your data stays on your device - private and secure
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FolderOpen className="w-6 h-6 text-teal-600 mt-1" />
								<div>
									<h3 className="font-semibold">Import/Export</h3>
									<p className="text-muted-foreground text-sm">
										Easy backup and sharing with CSV import/export functionality
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-card border border rounded-lg p-8">
					<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
					<div className="space-y-4">
						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
							<div>
								<h3 className="font-semibold">Create Decks</h3>
								<p className="text-muted-foreground text-sm">Organize your study material into themed decks</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
							<div>
								<h3 className="font-semibold">Add Cards</h3>
								<p className="text-muted-foreground text-sm">Create flashcards with questions and answers</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
							<div>
								<h3 className="font-semibold">Study & Review</h3>
								<p className="text-muted-foreground text-sm">Study cards and mark whether you knew the answer</p>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
							<div>
								<h3 className="font-semibold">Track Progress</h3>
								<p className="text-muted-foreground text-sm">Watch your mastery improve over time</p>
							</div>
						</div>
					</div>
				</section>

				<Card>
					<CardContent className="p-8">
						<h2 className="text-2xl font-semibold mb-4">Technology</h2>
						<p className="text-muted-foreground leading-relaxed mb-4">
							FlashyLearny is built with modern web technologies to provide a fast, reliable, and accessible experience:
						</p>
						<ul className="text-muted-foreground space-y-2">
							<li>• <strong>Next.js 15</strong> - React framework for optimal performance</li>
							<li>• <strong>IndexedDB</strong> - Client-side database for offline functionality</li>
							<li>• <strong>Progressive Web App</strong> - Installable and works offline</li>
							<li>• <strong>Tailwind CSS</strong> - Modern, responsive design</li>
							<li>• <strong>TypeScript</strong> - Type-safe development</li>
						</ul>
					</CardContent>
				</Card>
			</div>

			<div className="text-center">
				<Link
					href="/decks"
					className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-lg"
				>
					Start Learning Today
				</Link>
			</div>
		</div>
	);
}


