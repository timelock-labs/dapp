import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Web3Provider } from "@/components/providers/web3-provider";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AppSidebar } from '@/components/nav/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { ChainSwitcher } from '@/components/wallet/chain-switcher'
import { ConnectWallet } from '@/components/wallet/connect-wallet'

// 用于 i18n
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Timelock UI",
  description: "Timelock Management Interface",
};

export default async function RootLayout({ // Make the function async
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
   params: {locale: string};
}>) {
    const messages = await getMessages(); // Await the messages

  return (
     <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Web3Provider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                      {/* <SidebarTrigger className="-ml-1" /> */}
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <Breadcrumb>
                        <BreadcrumbList>
                          <BreadcrumbItem>
                            <BreadcrumbPage>Dashboard</BreadcrumbPage>
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>
                    </div>
                    
                    {/* 右上角的钱包和链切换 */}
                    <div className="flex items-center gap-3 ml-auto pr-4">
                      <ChainSwitcher />
                      <ConnectWallet />
                    </div>
                  </header>
                  <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </Web3Provider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
