import Link from "next/link";
import { useTranslations } from "next-intl";
import { BookOpen, HelpCircle, Lock } from "lucide-react";

export default function Footer() {
	const t = useTranslations('Footer');
	return (
		<footer className="w-full border-t border mt-auto bg-muted/30">
			<div className="mx-auto max-w-6xl px-4 py-6">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-6 text-sm font-medium">
						<Link
							href="/about"
							className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
						>
							<BookOpen className="h-4 w-4" /> {t('about')}
						</Link>
						<Link
							href="/help"
							className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
						>
							<HelpCircle className="h-4 w-4" /> {t('help')}
						</Link>
						<Link
							href="/privacy"
							className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
						>
							<Lock className="h-4 w-4" /> {t('privacy')}
						</Link>
					</div>
					<div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-muted-foreground">
						<p>{t('copyright', { year: new Date().getFullYear() })}</p>
						<span className="hidden sm:inline">•</span>
						<p>{t('madeWith')}</p>
					</div>
				</div>
			</div>
		</footer>
	);
}


