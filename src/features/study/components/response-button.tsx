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
				return 'default'; // uses app primary for positive action
			case 'yellow':
			default:
				return 'outline'; // neutral/secondary look
		}
	};

	return (
		<Button
			onClick={onClick}
			variant={getButtonVariant(color)}
			size="lg"
			className={cn(
				"w-full h-auto p-4 sm:p-6 transition-all duration-200",
				"hover:shadow-md active:shadow-sm",
				"focus-visible:ring-[3px] focus-visible:ring-ring/40"
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
