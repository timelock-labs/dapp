import { Locale } from '@/i18n/config';
import { cookieUtil } from '@/utils/cookieUtil';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export function setUserLocale(locale: Locale) {
	cookieUtil.set(LOCALE_COOKIE_NAME, locale, {
		path: '/',
		maxAge: 31536000,
		sameSite: 'lax',
	});
	window.location.reload();
}
