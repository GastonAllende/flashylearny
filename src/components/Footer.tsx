import Link from "next/link";
import { BookOpen, HelpCircle, Lock } from "lucide-react";

export default function Footer() {
	return (
		<footer className="w-full border-t border-border mt-auto bg-muted/30">
			<div className="mx-auto max-w-6xl px-4 py-6">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-6 text-sm font-medium">
						<Link
							href="/about"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<BookOpen className="h-4 w-4" /> About
						</Link>
						<Link
							href="/help"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<HelpCircle className="h-4 w-4" /> Help
						</Link>
						<Link
							href="/privacy"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Lock className="h-4 w-4" /> Privacy
						</Link>
					</div>
					<div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
						<p>© {new Date().getFullYear()} FlashyLearny</p>
						<span className="hidden sm:inline">•</span>
						<p>Made with 💙 for learners</p>
					</div>
				</div>
			</div>
		</footer>
	);
}


