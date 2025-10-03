'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/react-query';
import GlobalModalHandler from '@/components/GlobalModalHandler';

interface ProvidersProps {
	children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<GlobalModalHandler />
		</QueryClientProvider>
	);
}