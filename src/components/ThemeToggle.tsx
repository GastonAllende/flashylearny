'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function ThemeToggle({ className = '' }: { className?: string; }) {
	const [isDark, setIsDark] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Check system preference and stored preference
		const stored = localStorage.getItem('theme');
		const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		const shouldBeDark = stored === 'dark' || (!stored && systemPrefersDark);

		document.documentElement.classList.toggle('dark', shouldBeDark);
		setIsDark(shouldBeDark);
		setIsLoaded(true);
	}, []);

	const toggleTheme = () => {
		const newTheme = !isDark;
		setIsDark(newTheme);

		document.documentElement.classList.toggle('dark', newTheme);
		localStorage.setItem('theme', newTheme ? 'dark' : 'light');
	};

	// Don't render until loaded to prevent flash
	if (!isLoaded) {
		return (
			<div className={`w-12 h-12 ${className}`}>
				<div className="w-full h-full bg-muted rounded-lg animate-pulse" />
			</div>
		);
	}

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			className={`relative w-12 h-12 ${className}`}
			aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
			title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
		>
			<div className="relative w-full h-full flex items-center justify-center">
				{/* Sun Icon */}
				<svg
					className={`
            absolute w-5 h-5 transition-all duration-300 ease-out
            ${isDark
							? 'scale-0 rotate-90 opacity-0'
							: 'scale-100 rotate-0 opacity-100'
						}
          `}
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fillRule="evenodd"
						d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
						clipRule="evenodd"
					/>
				</svg>

				{/* Moon Icon */}
				<svg
					className={`
            absolute w-5 h-5 transition-all duration-300 ease-out
            ${isDark
							? 'scale-100 rotate-0 opacity-100'
							: 'scale-0 -rotate-90 opacity-0'
						}
          `}
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
				</svg>
			</div>
		</Button>
	);
}


