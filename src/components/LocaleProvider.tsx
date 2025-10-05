"use client";

import { useEffect } from 'react';
import { getLocaleFromStorage } from '@/lib/locale';

export default function LocaleProvider({ children }: { children: React.ReactNode; }) {
	useEffect(() => {
		// Check if the stored locale matches the current page locale
		getLocaleFromStorage();

		// If there's a stored locale and it's different from default, we might need to reload
		// This will be handled by the LanguageSelector component
	}, []);

	return <>{children}</>;
}
