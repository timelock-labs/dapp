'use client';

import React from 'react';
import Logo from '@/components/layout/Logo';
import { LoginButton } from '@/components/wallet/login-button';
import HomeAnimation from '@/components/ui/HomeAnimation';
// import LoginFooter from '@/components/ui/LoginFooter';
import './index.css'
import Image from 'next/image';
import { useTranslations } from 'next-intl';


const TimeLockerSplitPage = () => {
	const t = useTranslations('walletLogin');

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
						<div className='text-6xl font-medium text-center mb-12 leading-tight'>{t('motto')}</div>
						<div className='w-[90%]'><LoginButton fullWidth={true} /></div>
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
