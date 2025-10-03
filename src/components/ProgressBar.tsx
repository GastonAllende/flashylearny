'use client';

interface ProgressBarProps {
	value: number; // 0-100
	max?: number; // default 100
	label?: string;
	showPercentage?: boolean;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'default' | 'success' | 'warning' | 'danger';
	className?: string;
	animated?: boolean;
}

export default function ProgressBar({
	value,
	max = 100,
	label,
	showPercentage = false,
	size = 'md',
	variant = 'default',
	className = '',
	animated = false
}: ProgressBarProps) {
	// Normalize value to percentage
	const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

	// Size classes
	const sizeClasses = {
		sm: 'h-2',
		md: 'h-3',
		lg: 'h-4'
	};

	// Variant classes
	const variantClasses = {
		default: 'bg-blue-500',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		danger: 'bg-red-500'
	};

	// Background classes
	const backgroundClasses = {
		default: 'bg-blue-100 dark:bg-blue-900/30',
		success: 'bg-green-100 dark:bg-green-900/30',
		warning: 'bg-amber-100 dark:bg-amber-900/30',
		danger: 'bg-red-100 dark:bg-red-900/30'
	};

	return (
		<div className={`w-full ${className}`}>
			{/* Label and Percentage */}
			{(label || showPercentage) && (
				<div className="flex justify-between items-center mb-2">
					{label && (
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{label}
						</span>
					)}
					{showPercentage && (
						<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
							{Math.round(percentage)}%
						</span>
					)}
				</div>
			)}

			{/* Progress Bar Container */}
			<div className={`
        w-full ${sizeClasses[size]} ${backgroundClasses[variant]} 
        rounded-full overflow-hidden
      `}>
				{/* Progress Bar Fill */}
				<div
					className={`
            h-full ${variantClasses[variant]} rounded-full
            transition-all duration-300 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
					style={{ width: `${percentage}%` }}
					role="progressbar"
					aria-valuenow={value}
					aria-valuemin={0}
					aria-valuemax={max}
					aria-label={label}
				/>
			</div>

			{/* Value Display (for non-percentage cases) */}
			{!showPercentage && max !== 100 && (
				<div className="flex justify-between items-center mt-1">
					<span className="text-xs text-gray-500 dark:text-gray-400">
						{value} of {max}
					</span>
				</div>
			)}
		</div>
	);
}

// Preset progress bar components for common use cases
export function StudyProgressBar({
	studied,
	total,
	className = ''
}: {
	studied: number;
	total: number;
	className?: string;
}) {
	return (
		<ProgressBar
			value={studied}
			max={total}
			label={`Study Progress`}
			showPercentage={true}
			variant="success"
			size="md"
			className={className}
		/>
	);
}

export function KnowledgeProgressBar({
	known,
	total,
	className = ''
}: {
	known: number;
	total: number;
	className?: string;
}) {
	const percentage = total > 0 ? (known / total) * 100 : 0;
	const variant = percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'default';

	return (
		<ProgressBar
			value={known}
			max={total}
			label={`Knowledge Level`}
			showPercentage={true}
			variant={variant}
			size="md"
			className={className}
		/>
	);
}

export function SessionProgressBar({
	current,
	total,
	className = ''
}: {
	current: number;
	total: number;
	className?: string;
}) {
	return (
		<ProgressBar
			value={current}
			max={total}
			label={`Session Progress`}
			variant="default"
			size="lg"
			className={className}
			animated={current < total}
		/>
	);
}