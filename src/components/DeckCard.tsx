'use client';

import Link from 'next/link';
import { useDeckCompletion } from '../../hooks';
import type { Deck } from '../../lib/types';

interface DeckCardProps {
	deck: Deck;
	onEdit?: (deck: Deck) => void;
	onDelete?: (deckId: string, deckName: string) => void;
}

export default function DeckCard({ deck, onEdit, onDelete }: DeckCardProps) {
	const { data: completion } = useDeckCompletion(deck.id);

	return (
		<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
			<div className="flex items-start justify-between">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-3 mb-3">
						<Link
							href={`/decks/${deck.id}`}
							className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
						>
							{deck.name}
						</Link>
						{completion && completion.total > 0 && (
							<div className="flex items-center gap-2 shrink-0">
								<div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-20">
									<div
										className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
										style={{ width: `${completion.completion}%` }}
									/>
								</div>
								<span className="text-sm font-medium text-green-600 dark:text-green-400">
									{completion.completion}%
								</span>
							</div>
						)}
					</div>

					<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
						{completion ? (
							<>
								<span className="flex items-center gap-1">
									📇 {completion.total} cards
								</span>
								{completion.mastered > 0 && (
									<span className="flex items-center gap-1">
										✅ {completion.mastered} mastered
									</span>
								)}
								{completion.total - completion.mastered > 0 && (
									<span className="flex items-center gap-1">
										📚 {completion.total - completion.mastered} learning
									</span>
								)}
							</>
						) : (
							<span className="flex items-center gap-1">
								📇 No cards yet
							</span>
						)}
					</div>

					<div className="text-xs text-gray-500 dark:text-gray-500">
						Updated {new Date(deck.updatedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric'
						})}
					</div>
				</div>

				<div className="flex items-center gap-2 ml-4">
					<Link
						href={`/decks/${deck.id}`}
						className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 min-w-[4rem] text-center"
					>
						Open
					</Link>

					{onEdit && (
						<button
							onClick={() => onEdit(deck)}
							className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
							title="Rename deck"
						>
							✏️
						</button>
					)}

					{onDelete && (
						<button
							onClick={() => onDelete(deck.id, deck.name)}
							className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
							title="Delete deck"
						>
							🗑️
						</button>
					)}
				</div>
			</div>

			{/* Study button for decks with cards */}
			{completion && completion.total > 0 && (
				<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
					<Link
						href={`/decks/${deck.id}?tab=study`}
						className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
					>
						<span>🧠</span>
						Start Studying
						<span className="group-hover:translate-x-1 transition-transform">→</span>
					</Link>
				</div>
			)}
		</div>
	);
}