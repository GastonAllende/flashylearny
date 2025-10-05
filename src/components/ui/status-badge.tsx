import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Brain, Circle, LucideIcon } from 'lucide-react';

type CardStatus = 'NEW' | 'LEARNING' | 'MASTERED';

interface StatusBadgeProps {
	status: CardStatus;
	count?: number;
	showIcon?: boolean;
	variant?: 'default' | 'outline';
	className?: string;
}

const statusConfig: Record<CardStatus, {
	label: string;
	icon: LucideIcon;
	className: string;
}> = {
	MASTERED: {
		label: 'Mastered',
		icon: CheckCircle,
		className: 'bg-green-500 hover:bg-green-600 text-white border-green-500',
	},
	LEARNING: {
		label: 'Learning',
		icon: Brain,
		className: 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500',
	},
	NEW: {
		label: 'New',
		icon: Circle,
		className: 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500',
	},
};

export function StatusBadge({
	status,
	count,
	showIcon = true,
	variant = 'default',
	className
}: StatusBadgeProps) {
	const config = statusConfig[status];
	const Icon = config.icon;

	return (
		<Badge
			variant={variant}
			className={cn(
				variant === 'default' && config.className,
				'gap-1',
				className
			)}
		>
			{showIcon && <Icon className="w-3 h-3" />}
			<span>{config.label}</span>
			{count !== undefined && <span>({count})</span>}
		</Badge>
	);
}
