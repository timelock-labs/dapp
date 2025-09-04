'use client';

import React, { useEffect } from 'react';
import Logo from '@/components/layout/Logo';
import { LoginButton } from '@/components/wallet/login-button';
import HomeAnimation from '@/components/ui/HomeAnimation';
import './index.css';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useAuthStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

const TimeLockerSplitPage = () => {
	const t = useTranslations('walletLogin');
	const locale = useLocale();
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const router = useRouter();
	const textStyle1 = locale === 'zh' ? 'text-6xl tracking-wide' : 'text-[42px]';
	const textStyle2 = locale === 'zh' ? 'text-6xl tracking-wide' : 'text-[42px]';

	// 路由保护：已登录用户访问/login时重定向到/home
	useEffect(() => {
		if (isAuthenticated) {
			router.replace('/home');
		}
	}, [isAuthenticated, router]);

	return (
		<div className='flex items-center justify-center h-screen min-h-[860px] min-w-[1440px] bg-black text-white'>
			<div className='flex w-[1440px] h-[860px] items-center justify-between rounded-xl border border-gray-800 relative'>
				<div className='w-full flex items-center justify-between absolute top-4 z-10 px-10'>
					<Logo />
					<div className='flex items-center gap-4'>
						<Image src='/twitter.svg' alt='Icon' width={24} height={24} className='cursor-pointer' />
						<Image src='/telegram.svg' alt='Icon' width={24} height={24} className='cursor-pointer' />
						<Image src='/book.svg' alt='Icon' width={24} height={24} className='cursor-pointer' />
						<Image src='/github.svg' alt='Icon' width={24} height={24} className='cursor-pointer' />
					</div>
				</div>

				<div className="flex flex-col w-[580px] h-full p-10  ml-4 justify-center items-center bg-[url('/bg-left-logo.svg')] bg-[size:50%_100%] bg-center bg-repeat-y">
					<div className='w-[360px] flex flex-col '>
						<div className={`${textStyle1} font-medium text-left leading-tight whitespace-nowrap`}>{t('motto1')}</div>
						<div className={`${textStyle2} font-medium text-left mb-12 leading-tight whitespace-nowrap`}>{t('motto2')}</div>
						<div className='w-[85%]'>
							<LoginButton fullWidth={true} />
						</div>
					</div>
				</div>
				<div className='flex flex-col w-[860px] h-full overflow-hidden rounded-tr-xl rounded-br-xl'>
					<HomeAnimation className='w-full h-full scale-120' />
				</div>
				{/* <LoginFooter /> */}
			</div>
		</div>
	);
};

export default TimeLockerSplitPage;
