'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
import "@/app/globals.css";

// Font definitions can remain if used by this component specifically,
// but their application to the body tag should be in the root layout.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This metadata might not apply as expected if PageLayout is used as a regular component
export const metadata: Metadata = {
  title: "Timelock UI",
  description: "Timelock Management Interface",
};

export default function PageLayout({
  title,
  children,
  // params: { locale }
}: Readonly<{
  title: string,
  children?: React.ReactNode;
  params?: { locale: string };
}>) {
  // Removed: const messages = getMessages();
  // If this component needs translations for its own text, use useTranslations()
  // e.g., const t = useTranslations('PageLayoutNamespace');

  return (
    // Removed <html> and <body> tags
    // Removed NextIntlClientProvider
    // Removed Web3Provider wrapper
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    {title}
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-3 ml-auto pr-4">
              <ChainSwitcher />
              <ConnectWallet icon={true} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}