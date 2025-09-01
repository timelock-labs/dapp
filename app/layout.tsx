import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import { Web3Provider } from '@/components/providers/web3-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/app/globals.css';
import { Geist, Geist_Mono } from 'next/font/google'; // Import fonts here
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';
import PageLayout from '@/components/layout/PageLayout';
import I18nInitializer from '@/components/providers/I18nInitializer';


const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

type Props = {
	children: ReactNode;
};

export default async function RootLayout(props: Props) {
	const { children } = props;
	// use defaultLocale
	const cookieStore = await cookies();
	const locale = cookieStore.get('NEXT_LOCALE')?.value || routing.defaultLocale;
	const messages = await getMessages({ locale });
	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<title>Timelocker</title>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute='class' defaultTheme='lightTheme' enableSystem>
					<Web3Provider>
						<NextIntlClientProvider locale={locale} messages={messages}>
							<I18nInitializer />
							<PageLayout>
								{children}
							</PageLayout>
						</NextIntlClientProvider>
					</Web3Provider>
				</ThemeProvider>
				<Toaster position='top-center' />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
