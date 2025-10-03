interface EmptyStateProps {
	icon?: string;
	title: string;
	description: string;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
}

export default function EmptyState({
	icon = "📝",
	title,
	description,
	actionLabel,
	onAction,
	className = ""
}: EmptyStateProps) {
	return (
		<div className={`text-center py-16 px-6 ${className}`}>
			<div className="text-8xl mb-6 animate-bounce">
				{icon}
			</div>

			<h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
				{title}
			</h3>

			<p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
				{description}
			</p>

			{actionLabel && onAction && (
				<button
					onClick={onAction}
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
				>
					{actionLabel}
				</button>
			)}
		</div>
	);
}