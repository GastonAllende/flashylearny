import Link from "next/link";

export default function Footer() {
	return (
		<footer className="w-full border-t border-black/[.08] dark:border-white/[.145] mt-auto bg-gray-50 dark:bg-gray-900">
			<div className="mx-auto max-w-6xl px-4 py-6">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-6 text-sm font-medium">
						<Link
							href="/about"
							className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							📖 About
						</Link>
						<Link
							href="/help"
							className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							❓ Help
						</Link>
						<Link
							href="/privacy"
							className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							🔒 Privacy
						</Link>
					</div>
					<div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
						<p>© {new Date().getFullYear()} FlashyLearny</p>
						<span className="hidden sm:inline">•</span>
						<p>Made with 💙 for learners</p>
					</div>
				</div>
			</div>
		</footer>
	);
}


