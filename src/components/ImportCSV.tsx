'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { useImportCSV } from '../../hooks';
import { CheckCircle, Folder, X, Download } from 'lucide-react';

interface ImportCSVProps {
	onSuccess?: (result: { decksCreated: number; cardsCreated: number; decksData: string[]; }) => void;
	onCancel?: () => void;
}

export function ImportCSV({ onSuccess, onCancel }: ImportCSVProps) {
	const t = useTranslations('ImportCSV');
	const [isDragOver, setIsDragOver] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const importMutation = useImportCSV();

	const handleFileSelect = (file: File) => {
		setSelectedFile(file);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);

		const files = Array.from(e.dataTransfer.files);
		const csvFile = files.find(file => file.name.toLowerCase().endsWith('.csv'));

		if (csvFile) {
			handleFileSelect(csvFile);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleImport = async () => {
		if (!selectedFile) return;

		try {
			const result = await importMutation.mutateAsync(selectedFile);
			onSuccess?.(result);
		} catch (error) {
			// Error is handled by the mutation
			console.error('Import failed:', error);
		}
	};

	const handleReset = () => {
		setSelectedFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<div className="space-y-6">
			{/* File Drop Zone */}
			<div
				className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
          ${isDragOver
						? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
						: 'border hover:border-gray-400 dark:hover:border-gray-500'
					}
          ${selectedFile ? 'bg-green-50 dark:bg-green-900/20 border-green-400' : ''}
        `}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
			>
				<input
					ref={fileInputRef}
					type="file"
					accept=".csv"
					onChange={handleFileInputChange}
					className="hidden"
				/>

				{selectedFile ? (
					<div className="space-y-3">
						<CheckCircle className="w-10 h-10 text-green-600" />
						<div>
							<h3 className="font-medium text-green-800 dark:text-green-200">{t('fileSelected')}</h3>
							<p className="text-sm text-green-600 dark:text-green-300 mt-1">
								{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
							</p>
						</div>
						<Button
							variant="link"
							size="sm"
							className="text-sm text-muted-foreground hover:text-foreground underline"
							onClick={handleReset}
						>
							{t('chooseDifferent')}
						</Button>
					</div>
				) : (
					<div className="space-y-3">
						<Folder className="w-10 h-10 text-gray-600" />
						<div>
							<h3 className="font-medium">{t('dropHere')}</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
								{t('or')}{' '}
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="text-blue-600 hover:text-blue-700 underline"
								>
									{t('browseFiles')}
								</button>
							</p>
						</div>
					</div>
				)}
			</div>

			{/* File Format Info */}
			<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
				<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t('csvFormat')}</h4>
				<p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
					{t('columnsIntro')}
				</p>
				<div className="bg-white dark:bg-blue-950/20 rounded border font-mono text-xs p-2 mb-2">
					deckName,question,answer
				</div>
				<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
					<li>• <strong>deckName:</strong> {t('colDeckName')}</li>
					<li>• <strong>question:</strong> {t('colQuestion')}</li>
					<li>• <strong>answer:</strong> {t('colAnswer')}</li>
				</ul>
			</div>

			{/* Error Display */}
			{importMutation.error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
					<h4 className="font-medium text-red-900 dark:text-red-100 mb-1 flex items-center gap-2">
						<X className="w-4 h-4" /> {t('importFailed')}
					</h4>
					<p className="text-sm text-red-800 dark:text-red-200">
						{importMutation.error instanceof Error ? importMutation.error.message : t('unknownError')}
					</p>
				</div>
			)}

			{/* Actions */}
			<div className="flex flex-col sm:flex-row gap-3">
				<Button
					onClick={handleImport}
					disabled={!selectedFile || importMutation.isPending}
					className="flex items-center justify-center gap-2"
				>
					{importMutation.isPending ? (
						<>
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							{t('importing')}
						</>
					) : (
						<>
							<Download className="w-4 h-4" />
							{t('importCsv')}
						</>
					)}
				</Button>

				{onCancel && (
					<Button
						variant="outline"
						onClick={onCancel}
						disabled={importMutation.isPending}
					>
						{t('cancel')}
					</Button>
				)}
			</div>

			{/* Sample Data Link */}
			<div className="text-center">
				<button
					onClick={() => {
						const sampleCSV = `deckName,question,answer
Spanish Vocabulary,What is "hello" in Spanish?,Hola
Spanish Vocabulary,What is "goodbye" in Spanish?,Adiós
Math Facts,What is 7 x 8?,56
Math Facts,What is the square root of 64?,8`;

						const blob = new Blob([sampleCSV], { type: 'text/csv' });
						const url = URL.createObjectURL(blob);
						const a = document.createElement('a');
						a.href = url;
						a.download = 'sample_flashcards.csv';
						a.click();
						URL.revokeObjectURL(url);
					}}
					className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
				>
					{t('downloadSample')}
				</button>
			</div>
		</div>
	);
}