'use client';

import Link from 'next/link';
import { CheckCircle, BookOpen, Eye, Clock, Edit, Trash2 } from 'lucide-react';
import { useProgress } from '../../hooks';
import type { Card as CardType } from '../../lib/types';

interface CardRowProps {
	card: CardType;
	deckId: string;
	onDelete?: (cardId: string, question: string) => void;
	showProgress?: boolean;
}

export default function CardRow({
	card,
	deckId,
	onDelete,
	showProgress = true
}: CardRowProps) {
	const { data: progress } = useProgress(card.id);

	const getStatusColor = (status?: string) => {
		switch (status) {
			case 'MASTERED':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'LEARNING':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
			case 'NEW':
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
		}
	};

	const getStatusIcon = (status?: string) => {
		switch (status) {
			case 'MASTERED':
				return <CheckCircle className="w-3 h-3" />;
			case 'LEARNING':
				return <BookOpen className="w-3 h-3" />;
			case 'NEW':
			default:
				return <span className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">N</span>;
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-all duration-200 group">
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0 space-y-4">
					{/* Question */}
					<div>
						<div className="flex items-center gap-2 mb-2">
							<h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wide">
								Question
							</h4>
							{showProgress && progress && (
								<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progress.status)}`}>
									{getStatusIcon(progress.status)}
									{progress.status}
								</span>
							)}
						</div>
						<p className="text-gray-800 dark:text-gray-200 leading-relaxed">
							{card.question}
						</p>
					</div>

					{/* Answer */}
					<div>
						<h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wide mb-2">
							Answer
						</h4>
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							{card.answer}
						</p>
					</div>

					{/* Progress Stats */}
					{showProgress && progress && (progress.timesSeen > 0 || progress.timesKnown > 0) && (
						<div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
							<span className="flex items-center gap-1">
								<Eye className="w-4 h-4" /> Seen {progress.timesSeen} time{progress.timesSeen !== 1 ? 's' : ''}
							</span>
							<span className="flex items-center gap-1">
								<CheckCircle className="w-4 h-4" /> Known {progress.timesKnown} time{progress.timesKnown !== 1 ? 's' : ''}
							</span>
							{progress.lastReviewedAt && (
								<span className="flex items-center gap-1">
									<Clock className="w-4 h-4" /> Last reviewed {new Date(progress.lastReviewedAt).toLocaleDateString()}
								</span>
							)}
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex flex-col gap-2 shrink-0">
					<Link
						href={`/decks/${deckId}/edit-card/${card.id}`}
						className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center flex items-center gap-1"
					>
						<Edit className="w-4 h-4" /> Edit
					</Link>

					{onDelete && (
						<button
							onClick={() => onDelete(card.id, card.question)}
							className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
						>
							<Trash2 className="w-4 h-4" /> Delete
						</button>
					)}
				</div>
			</div>
		</div>
	);
}