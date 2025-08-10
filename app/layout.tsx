import { notFound } from 'next/navigation';
import { Locale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';
import { routing } from '@/i18n/routing';import { Web3Provider } from '@/components/providers/web3-provider'; // Use the Providers from app/providers.tsx
import { TokenRefresher } from '@/components/auth/token-refresher';
import { ThemeProvider } from '@/components/providers/theme-provider';
import "@/app/globals.css"
import { Geist, Geist_Mono } from "next/font/google"; // Import fonts here
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  // 直接使用 defaultLocale
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || routing.defaultLocale;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <title>TimeLocker</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> {/* Apply font variables here */}
        <ThemeProvider attribute="class" defaultTheme="lightTheme" enableSystem>
          <Web3Provider> {/* Use the main Web3Provider component */}
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
            </NextIntlClientProvider>
            {/* <TokenRefresher /> */}
          </Web3Provider>
        </ThemeProvider>
        <Toaster position="top-center" /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}