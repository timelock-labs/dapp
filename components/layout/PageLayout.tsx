'use client';

import React from 'react';
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AppSidebar } from '@/components/nav/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { ChainSwitcher } from '@/components/wallet/chain-switcher'
import { ConnectWallet } from '@/components/wallet/connect-wallet'
import type { BaseComponentProps } from '@/types';
import "@/app/globals.css";

interface PageLayoutProps extends BaseComponentProps {
  title: string;
}

/**
 * Main page layout component with sidebar navigation and header
 * 
 * @param props - PageLayout component props
 * @returns JSX.Element
 */
export default function PageLayout({
  title,
  children,
  className
}: PageLayoutProps) {

  return (
    <div className={className}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-[72px] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-gray-200">
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
              <ConnectWallet icon={true} headerStyle={true}  />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      </ThemeProvider>
    </div>
  );
}