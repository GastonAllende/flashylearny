'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/react-query';
import GlobalModalHandler from '@/components/GlobalModalHandler';
import { Toaster } from '@/components/ui/sonner';
import { useMigrations } from '../../hooks/use-migrations';

interface ProvidersProps {
	children: React.ReactNode;
}

function MigrationRunner() {
	// Run database migrations on app startup
	useMigrations();
	return null;
}

export default function Providers({ children }: ProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<MigrationRunner />
			{children}
			<GlobalModalHandler />
			<Toaster />
		</QueryClientProvider>
	);
}