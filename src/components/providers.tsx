'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import MigrationRunner from './migration-runner';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<MigrationRunner />
				{children}
			</AuthProvider>
		</QueryClientProvider>
	);
}
