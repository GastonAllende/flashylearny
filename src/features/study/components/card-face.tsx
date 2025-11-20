'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardFaceProps {
	content: string;
	label: string;
	icon: React.ReactNode;
	hint: string;
}

export function CardFace({ content, label, icon, hint }: CardFaceProps) {
	return (
		<Card className={cn(
			"w-full h-full rounded-2xl shadow-xl flex flex-col justify-center items-center p-8 relative",
			"bg-card border"
		)}>
			{/* Header */}
			<div className="absolute top-6 left-6 flex items-center gap-2">
				<span className="text-2xl">{icon}</span>
				<Badge variant="secondary" className={cn("font-semibold opacity-80")}>
					{label}
				</Badge>
			</div>

			{/* Content */}
			<CardContent className="flex-1 flex items-center justify-center text-center p-0">
				<div className={cn("text-foreground", "text-2xl sm:text-3xl lg:text-4xl font-bold leading-relaxed max-w-lg")}>
					{content}
				</div>
			</CardContent>

			{/* Hint */}
			<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
				<p className={cn("text-muted-foreground", "text-sm font-medium")}>
					{hint}
				</p>
			</div>
		</Card>
	);
}
