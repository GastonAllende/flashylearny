"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Plus, User } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useUIStore } from "../../stores/ui";

export default function Header() {
	const [open, setOpen] = useState(false);
	const { openModal } = useUIStore();
	const t = useTranslations('Header');

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
					<div className="hidden md:flex items-center gap-6 text-sm font-medium">
						<Link
							href="/decks"
							className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							{t('decks')}
						</Link>
					</div>
				</div>
				<div className="hidden md:flex items-center gap-3">
					<LanguageSelector />
					<ThemeToggle />
					<Link
						href="/profile"
						className="bg-muted hover:bg-muted/80 border px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2"
					>
						<User className="h-4 w-4" /> {t('profile')}
					</Link>
				</div>
				<Button
					aria-label={t('menu')}
					variant="outline"
					size="sm"
					className="md:hidden"
					onClick={() => setOpen((v) => !v)}
				>
					{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
				</Button>
			</nav>
			{open && (
				<div className="md:hidden border-t border-black/[.08] dark:border-white/[.145] bg-card">
					<div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-4">
						<Link
							href="/decks"
							className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 flex items-center gap-2"
							onClick={() => setOpen(false)}
						>
							<BookOpen className="h-4 w-4" /> {t('decks')}
						</Link>
						<button
							onClick={handleCreateDeck}
							className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 text-left flex items-center gap-2"
						>
							<Plus className="h-4 w-4" /> {t('createDeck')}
						</button>
						<div className="flex items-center justify-between pt-2 border-t border">
							<div className="flex items-center gap-2">
								<LanguageSelector />
								<ThemeToggle />
							</div>
							<Link
								href="/profile"
								className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-2"
								onClick={() => setOpen(false)}
							>
								<User className="h-4 w-4" /> {t('profile')}
							</Link>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}


