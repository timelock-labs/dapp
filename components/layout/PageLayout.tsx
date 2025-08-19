'use client';

import React from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AppSidebar } from '@/components/nav/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ChainSwitcher } from '@/components/wallet/chain-switcher';
import { ConnectWallet } from '@/components/wallet/connect-wallet';
import type { BaseComponentProps } from '@/types';
import '@/app/globals.css';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

interface PageLayoutProps extends BaseComponentProps {
	title: string;
}


/**
 * Main page layout component with sidebar navigation and header
 *
 * @param props - PageLayout component props
 * @returns JSX.Element
 */
export default function PageLayout({ title, children, className }: PageLayoutProps) {
	// 根据当前路径自动推断标题（如果未显式传入 title）
	const pathname = usePathname();

	const tAbiLib = useTranslations('ABI-Lib');
	const tCreateTimelock = useTranslations('CreateTimelock');
	const tHome = useTranslations('home_page');
	const tImportTimelock = useTranslations('ImportTimelock');
	const tTransactions = useTranslations('Transactions');
	const tTransactionsLog = useTranslations('Transactions_log');
	const tEcosystem = useTranslations('Ecosystem');
	const tTimelocks = useTranslations('TimelockTable');
	const tNotify = useTranslations('Notify');
	const tCreateTx = useTranslations('CreateTransaction');

	const pathKey = React.useMemo(() => {
		const seg = pathname.split('/').filter(Boolean)[0] ?? 'home';
		return seg;
	}, [pathname]);

	const autoTitleMap: Record<string, string> = {
		'abi-lib': tAbiLib('title'),
		'create-timelock': tCreateTimelock('createTimelock'),
		'home': tHome('create_protocol_title'),
		'import-timelock': tImportTimelock('title'),
		'transactions': tTransactions('title'),
		'transactions-log': tTransactionsLog('title'),
		'ecosystem': tEcosystem('title'),
		'timelocks': tTimelocks('title'),
		'notify': tNotify('title'),
		'create-transaction': tCreateTx('title'),
	};

	const effectiveTitle = title || autoTitleMap[pathKey] || title;

	return (
		<div className={className}>
			<ThemeProvider attribute='class' defaultTheme='light' enableSystem disableTransitionOnChange>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<header className='flex h-[72px] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-gray-200'>
							<div className='flex items-center gap-2 px-4'>
								<Separator orientation='vertical' className='mr-2 h-4' />
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem>{effectiveTitle}</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>

							<div className='flex items-center gap-3 ml-auto pr-6'>
								<ChainSwitcher />
								<ConnectWallet icon={true} headerStyle={true} />
							</div>
						</header>
						<div className='flex flex-1 flex-col gap-4 p-6'>{children}</div>
					</SidebarInset>
				</SidebarProvider>
			</ThemeProvider>
		</div>
	);
}
