"use client";

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
	{ code: 'en', label: 'English', flag: '🇺🇸' },
	{ code: 'es', label: 'Español', flag: '🇪🇸' },
	{ code: 'sv', label: 'Svenska', flag: '🇸🇪' },
];

export default function LanguageSelector() {
	const currentLocale = useLocale();
	const [isPending, startTransition] = useTransition();

	const handleLanguageChange = (newLocale: string) => {
		if (newLocale === currentLocale) return;

		startTransition(() => {
			// Store locale preference in both localStorage and cookie
			localStorage.setItem('locale', newLocale);
			document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year
			// Reload the page to apply new locale
			window.location.reload();
		});
	};

	const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					disabled={isPending}
					className="gap-2"
				>
					<Globe className="h-4 w-4" />
					<span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.label}</span>
					<span className="sm:hidden">{currentLanguage.flag}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{languages.map((language) => (
					<DropdownMenuItem
						key={language.code}
						onClick={() => handleLanguageChange(language.code)}
						className={currentLocale === language.code ? 'bg-accent' : ''}
					>
						<span className="mr-2">{language.flag}</span>
						{language.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
