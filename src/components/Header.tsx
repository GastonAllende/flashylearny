"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Plus, User } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useUIStore } from "../../stores/ui";

export default function Header() {
	const [open, setOpen] = useState(false);
	const { openModal } = useUIStore();

	const handleCreateDeck = () => {
		openModal('createDeck');
		setOpen(false);
	};

	return (
		<header className="w-full border-b border-black/[.08] dark:border-white/[.145] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<nav className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
				<div className="flex items-center gap-6">
					<Link
						href="/"
						className="font-bold text-lg tracking-tight text-blue-600 hover:text-blue-700 transition-colors"
					>
						FlashyLearny
					</Link>
					<div className="hidden sm:flex items-center gap-6 text-sm font-medium">
						<Link
							href="/decks"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							Decks
						</Link>
					</div>
				</div>
				<div className="hidden sm:flex items-center gap-3">
					<ThemeToggle />
					<Link
						href="/profile"
						className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2"
					>
						<User className="h-4 w-4" /> Profile
					</Link>
				</div>
				<Button
					aria-label="Menu"
					variant="outline"
					size="sm"
					className="sm:hidden"
					onClick={() => setOpen((v) => !v)}
				>
					{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
				</Button>
			</nav>
			{open && (
				<div className="sm:hidden border-t border-black/[.08] dark:border-white/[.145] bg-white dark:bg-gray-900">
					<div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-4">
						<Link
							href="/decks"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 flex items-center gap-2"
							onClick={() => setOpen(false)}
						>
							<BookOpen className="h-4 w-4" /> Decks
						</Link>
						<button
							onClick={handleCreateDeck}
							className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 text-left flex items-center gap-2"
						>
							<Plus className="h-4 w-4" /> Create Deck
						</button>
						<div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
							<ThemeToggle />
							<Link
								href="/profile"
								className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-2"
								onClick={() => setOpen(false)}
							>
								<User className="h-4 w-4" /> Profile
							</Link>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}


