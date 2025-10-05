import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
	value: string | number;
	label: string;
	color?: 'green' | 'yellow' | 'blue' | 'purple' | 'red' | 'gray';
	icon?: LucideIcon;
	className?: string;
}

const colorClasses = {
	green: 'text-green-600 dark:text-green-500',
	yellow: 'text-yellow-600 dark:text-yellow-500',
	blue: 'text-blue-600 dark:text-blue-500',
	purple: 'text-purple-600 dark:text-purple-500',
	red: 'text-red-600 dark:text-red-500',
	gray: 'text-gray-600 dark:text-gray-500',
};

export function StatCard({ value, label, color = 'blue', icon: Icon, className }: StatCardProps) {
	return (
		<div className={cn('bg-card border rounded-lg p-6 text-center', className)}>
			{Icon && (
				<div className="flex justify-center mb-2">
					<Icon className={cn('h-8 w-8', colorClasses[color])} />
				</div>
			)}
			<div className={cn('text-3xl font-bold', colorClasses[color])}>
				{value}
			</div>
			<div className="text-sm text-muted-foreground mt-1">
				{label}
			</div>
		</div>
	);
}
