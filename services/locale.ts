import { Locale } from '@/i18n/config';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export function setUserLocale(locale: Locale) {
	document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=31536000;SameSite=Lax`;
	window.location.reload();
}