import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface EmptyStateProps {
	icon?: React.ReactNode;
	title: string;
	description: string;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
}

export default function EmptyState({
	icon = <FileText className="w-20 h-20" />,
	title,
	description,
	actionLabel,
	onAction,
	className = ""
}: EmptyStateProps) {
	return (
		<div className={`text-center py-16 px-6 ${className}`}>
			<div className="text-8xl mb-6 animate-bounce flex justify-center">
				{icon}
			</div>

			<h3 className="text-2xl font-semibold text-foreground mb-3">
				{title}
			</h3>

			<p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
				{description}
			</p>

			{actionLabel && onAction && (
				<Button
					onClick={onAction}
					size="lg"
					className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
				>
					{actionLabel}
				</Button>
			)}
		</div>
	);
}