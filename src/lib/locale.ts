export function getLocaleFromStorage(): string {
	if (typeof window === 'undefined') {
		return 'en';
	}
	return localStorage.getItem('locale') || 'en';
}

export function setLocaleInStorage(locale: string): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem('locale', locale);
	}
}
