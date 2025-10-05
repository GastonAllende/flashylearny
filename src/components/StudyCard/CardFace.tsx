'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardFaceProps {
	content: string;
	label: string;
	icon: React.ReactNode;
	bgColor: string;
	textColor: string;
	hint: string;
}

export function CardFace({ content, label, icon, bgColor, textColor, hint }: CardFaceProps) {
	return (
		<Card className={cn(
			"w-full h-full rounded-2xl shadow-2xl flex flex-col justify-center items-center p-8 relative border-4",
			bgColor,
			"border-white dark:border-gray-200"
		)}>
			{/* Header */}
			<div className="absolute top-6 left-6 flex items-center gap-2">
				<span className="text-2xl">{icon}</span>
				<Badge variant="secondary" className={cn("font-semibold", textColor, "opacity-90")}>
					{label}
				</Badge>
			</div>

			{/* Content */}
			<CardContent className="flex-1 flex items-center justify-center text-center p-0">
				<div className={cn(textColor, "text-2xl sm:text-3xl lg:text-4xl font-bold leading-relaxed max-w-lg")}>
					{content}
				</div>
			</CardContent>

			{/* Hint */}
			<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
				<p className={cn(textColor, "opacity-80 text-sm font-medium")}>
					{hint}
				</p>
			</div>
		</Card>
	);
}
