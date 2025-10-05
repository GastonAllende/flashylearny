import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
	// Default to English
	let locale = 'en';

	// Try to get locale from cookie
	const headersList = await headers();
	const cookieHeader = headersList.get('cookie');
	if (cookieHeader) {
		const localeCookie = cookieHeader.split(';').find(c => c.trim().startsWith('NEXT_LOCALE='));
		if (localeCookie) {
			locale = localeCookie.split('=')[1];
		}
	}

	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default
	};
});
