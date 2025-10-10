"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, BookOpen, User, LogOut, Crown, Settings } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
	const [open, setOpen] = useState(false);
	const { user, profile, signOut, loading } = useAuth();
	const router = useRouter();
	const t = useTranslations('Header');

	const handleSignOut = async () => {
		await signOut();
		router.push('/auth/login');
		setOpen(false);
	};

	return (
		<header className="w-full border-b border-black/[.08] dark:border-white/[.145] bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<nav className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
				<div className="flex items-center gap-6">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary hover:text-primary/80 transition-colors"
					>
						<Image src="/icon.svg" alt="FlashyLearny" width={24} height={24} />
						FlashyLearny
					</Link>
					{user && (
						<div className="hidden md:flex items-center gap-6 text-sm font-medium">
							<Link
								href="/decks"
								className="text-muted-foreground hover:text-primary/80 transition-colors"
							>
								{t('decks')}
							</Link>
						</div>
					)}
				</div>
				<div className="hidden md:flex items-center gap-3">
					<LanguageSelector />
					<ThemeToggle />
					{user ? (
						<>
							{profile?.tier === 'pro' && (
								<Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
									<Crown className="h-3 w-3 mr-1" />
									PRO
								</Badge>
							)}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="flex items-center gap-2">
										<User className="h-4 w-4" />
										{user.email?.split('@')[0]}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel>
										<div className="flex flex-col">
											<span className="text-sm font-medium">{user.email}</span>
											<span className="text-xs text-muted-foreground">
												{profile?.tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
											</span>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/settings" className="cursor-pointer">
											<Settings className="h-4 w-4 mr-2" />
											Settings
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/settings/billing" className="cursor-pointer">
											<Crown className="h-4 w-4 mr-2" />
											{profile?.tier === 'pro' ? 'Billing' : 'Upgrade to Pro'}
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
										<LogOut className="h-4 w-4 mr-2" />
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						!loading && (
							<Button asChild variant="default" size="sm">
								<Link href="/auth/login">Sign in</Link>
							</Button>
						)
					)}
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
						{user ? (
							<>
								<div className="flex items-center justify-between pb-2 border-b">
									<div className="flex flex-col">
										<span className="text-sm font-medium">{user.email}</span>
										<span className="text-xs text-muted-foreground">
											{profile?.tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
										</span>
									</div>
									{profile?.tier === 'pro' && (
										<Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
											<Crown className="h-3 w-3 mr-1" />
											PRO
										</Badge>
									)}
								</div>
								<Link
									href="/decks"
									className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 flex items-center gap-2"
									onClick={() => setOpen(false)}
								>
									<BookOpen className="h-4 w-4" /> {t('decks')}
								</Link>
								<Link
									href="/settings"
									className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 flex items-center gap-2"
									onClick={() => setOpen(false)}
								>
									<Settings className="h-4 w-4" /> Settings
								</Link>
								<Link
									href="/settings/billing"
									className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 flex items-center gap-2"
									onClick={() => setOpen(false)}
								>
									<Crown className="h-4 w-4" /> {profile?.tier === 'pro' ? 'Billing' : 'Upgrade to Pro'}
								</Link>
							</>
						) : (
							!loading && (
								<Link
									href="/auth/login"
									className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2"
									onClick={() => setOpen(false)}
								>
									Sign in
								</Link>
							)
						)}
						<div className="flex items-center justify-between pt-2 border-t border">
							<div className="flex items-center gap-2">
								<LanguageSelector />
								<ThemeToggle />
							</div>
							{user && (
								<button
									onClick={handleSignOut}
									className="text-red-600 hover:text-red-700 transition-colors font-medium flex items-center gap-2"
								>
									<LogOut className="h-4 w-4" /> Sign out
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
}


