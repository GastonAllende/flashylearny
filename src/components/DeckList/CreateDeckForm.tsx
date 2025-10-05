'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface CreateDeckFormProps {
	newDeckName: string;
	setNewDeckName: (name: string) => void;
	onSubmit: (e: React.FormEvent) => Promise<void>;
	onCancel: () => void;
	isLoading: boolean;
}

export function CreateDeckForm({
	newDeckName,
	setNewDeckName,
	onSubmit,
	onCancel,
	isLoading
}: CreateDeckFormProps) {
	return (
		<Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
			<CardContent className="p-6">
				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<Label htmlFor="deckName" className="text-foreground">
							Deck Name
						</Label>
						<Input
							id="deckName"
							type="text"
							value={newDeckName}
							onChange={(e) => setNewDeckName(e.target.value)}
							placeholder="e.g., Spanish Vocabulary, Biology Terms..."
							className="text-lg mt-2"
							autoFocus
							disabled={isLoading}
							maxLength={100}
						/>
						<p className="text-xs text-muted-foreground mt-1">
							Choose a descriptive name for your study deck
						</p>
					</div>

					<div className="flex gap-3">
						<Button
							type="submit"
							disabled={!newDeckName.trim() || isLoading}
							className="flex items-center gap-2"
						>
							{isLoading ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
									Creating...
								</>
							) : (
								<>
									<Sparkles className="w-4 h-4" />
									Create Deck
								</>
							)}
						</Button>

						<Button
							type="button"
							variant="secondary"
							onClick={onCancel}
							disabled={isLoading}
						>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
