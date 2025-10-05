import { cn } from '@/lib/utils';

interface ProgressBarProps {
	value: number; // 0-100
	label?: string;
	showBadge?: boolean;
	color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const colorClasses = {
	green: 'bg-green-500',
	blue: 'bg-blue-500',
	yellow: 'bg-yellow-500',
	red: 'bg-red-500',
	purple: 'bg-purple-500',
};

const sizeClasses = {
	sm: 'h-2',
	md: 'h-3',
	lg: 'h-4',
};

export function ProgressBar({
	value,
	label,
	showBadge = false,
	color = 'green',
	size = 'md',
	className
}: ProgressBarProps) {
	const percentage = Math.min(100, Math.max(0, value));

	return (
		<div className={cn('w-full', className)}>
			{label && (
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm text-muted-foreground">{label}</span>
					{showBadge && (
						<span className="text-sm font-semibold">{percentage}%</span>
					)}
				</div>
			)}
			<div className={cn(
				'bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
				sizeClasses[size]
			)}>
				<div
					className={cn(
						'rounded-full transition-all duration-300',
						colorClasses[color],
						sizeClasses[size]
					)}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}
