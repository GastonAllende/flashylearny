'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResponseButtonProps {
	label: string;
	description: string;
	icon: React.ReactNode;
	color: 'red' | 'yellow' | 'green';
	onClick: () => void;
}

export function ResponseButton({ label, description, icon, color, onClick }: ResponseButtonProps) {
	const getButtonVariant = (color: string) => {
		switch (color) {
			case 'red':
				return 'destructive';
			case 'green':
				return 'default';
			case 'yellow':
			default:
				return 'outline';
		}
	};

	const getColorClasses = (color: string) => {
		switch (color) {
			case 'red':
				return 'border-destructive/20 hover:bg-destructive/10';
			case 'yellow':
				return 'border-amber-200 hover:bg-amber-50 text-amber-900 dark:border-amber-800 dark:hover:bg-amber-900/20 dark:text-amber-100';
			case 'green':
				return 'border-green-200 hover:bg-green-50 text-green-900 dark:border-green-800 dark:hover:bg-green-900/20 dark:text-green-100';
			default:
				return '';
		}
	};

	return (
		<Button
			onClick={onClick}
			variant={getButtonVariant(color)}
			size="lg"
			className={cn(
				"w-full h-auto p-4 sm:p-6 hover:scale-105 active:scale-95 transition-all duration-200",
				"focus:ring-4 focus:ring-opacity-20",
				getColorClasses(color)
			)}
		>
			<div className="flex items-center justify-center space-x-3 sm:flex-col sm:space-x-0 sm:space-y-2">
				<div className="flex items-center justify-center">{icon}</div>
				<div className="text-left sm:text-center">
					<div className="font-semibold text-base sm:text-lg">{label}</div>
					<div className="text-sm opacity-80">{description}</div>
				</div>
			</div>
		</Button>
	);
}
